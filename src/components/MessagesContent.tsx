import { useState, useEffect, useRef } from 'react'
import { useStore } from '@/store/useStore'
import { messagesApi, ConversationResponse, MessageResponse } from '@/services/api'
import { websocketService } from '@/services/websocket'
import { 
  MoreVertical, 
  Shield,
  Paperclip,
  Image as ImageIcon,
  Send,
  X,
  Flag,
  Archive
} from 'lucide-react'

interface MessagesContentProps {
  initialConversationId?: string
}

const MessagesContent = ({ initialConversationId }: MessagesContentProps) => {
  const { user } = useStore()
  const [conversations, setConversations] = useState<ConversationResponse[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(initialConversationId || null)
  const [messages, setMessages] = useState<MessageResponse[]>([])
  const [message, setMessage] = useState('')
  const [showProfile, setShowProfile] = useState(true)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const conversationsLoadedRef = useRef(false)

  useEffect(() => {
    if (user && !conversationsLoadedRef.current) {
      const token = localStorage.getItem('mokogo-access-token')
      if (token) {
        websocketService.connect(token)
      }
      fetchConversations()
      conversationsLoadedRef.current = true
    }

    // WebSocket listeners
    const handleNewMessage = (newMessage: MessageResponse) => {
      // Only process messages for the current conversation
      if (selectedConversationId && newMessage.conversationId !== selectedConversationId) {
        return
      }

      setMessages(prev => {
        // Check if message already exists by ID
        const existingIndex = prev.findIndex(m => (m._id || m.id) === (newMessage._id || newMessage.id))
        if (existingIndex >= 0) {
          // Message already exists, update it (replace temp message with real one)
          const updated = [...prev]
          updated[existingIndex] = newMessage
          return updated
        }
        
        // Check if there's a temp message with the same text and sender that we should replace
        const senderId = typeof newMessage.senderId === 'object' ? newMessage.senderId._id : newMessage.senderId
        const userId = typeof user === 'object' && user?.id ? user.id : ''
        const isFromCurrentUser = senderId === userId
        
        const tempIndex = prev.findIndex(m => 
          m._id?.startsWith('temp-') && 
          m.text === newMessage.text &&
          m.conversationId === newMessage.conversationId &&
          isFromCurrentUser // Only replace temp messages from the current user
        )
        
        if (tempIndex >= 0) {
          // Replace temp message with real message
          const updated = [...prev]
          updated[tempIndex] = newMessage
          return updated
        }
        
        // New message, add it
        return [...prev, newMessage]
      })
      // Mark as read if it's the current conversation
      if (selectedConversationId && newMessage.conversationId === selectedConversationId) {
        messagesApi.markAsRead(selectedConversationId).catch(console.error)
      }
    }

    const handleConversationUpdate = (updatedConversation: ConversationResponse) => {
      setConversations(prev => {
        const index = prev.findIndex(c => (c._id || c.id) === (updatedConversation._id || updatedConversation.id))
        if (index >= 0) {
          const updated = [...prev]
          updated[index] = updatedConversation
          // Move to top
          updated.splice(index, 1)
          updated.unshift(updatedConversation)
          return updated
        }
        return prev
      })
    }

    websocketService.on('new_message', handleNewMessage)
    websocketService.on('conversation_updated', handleConversationUpdate)

    return () => {
      websocketService.off('new_message', handleNewMessage)
      websocketService.off('conversation_updated', handleConversationUpdate)
    }
  }, [user, selectedConversationId])

  useEffect(() => {
    if (initialConversationId && !selectedConversationId) {
      setSelectedConversationId(initialConversationId)
    }
  }, [initialConversationId])

  useEffect(() => {
    if (selectedConversationId) {
      fetchMessages(selectedConversationId)
      websocketService.emit('join_conversation', { conversationId: selectedConversationId })
    }
  }, [selectedConversationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchConversations = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const data = await messagesApi.getAllConversations()
      setConversations(data)
      if (initialConversationId && !selectedConversationId) {
        setSelectedConversationId(initialConversationId)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const data = await messagesApi.getMessages(conversationId)
      setMessages(data)
      await messagesApi.markAsRead(conversationId)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedConversationId || sending) return

    setSending(true)
    const messageText = message.trim()
    setMessage('')

    try {
      // Optimistically add message
      const tempMessage: MessageResponse = {
        _id: `temp-${Date.now()}`,
        id: `temp-${Date.now()}`,
        conversationId: selectedConversationId,
        senderId: typeof user === 'object' && user?.id ? { _id: user.id, name: user.name || '', email: user.email || '' } : user?.id || '',
        text: messageText,
        isRead: false,
        isSystem: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setMessages(prev => [...prev, tempMessage])

      // Send via WebSocket (primary method)
      websocketService.emit('send_message', {
        conversationId: selectedConversationId,
        text: messageText,
      })

      // Note: We don't call the API here because WebSocket handles it
      // The WebSocket gateway will create the message and emit it back
      // If WebSocket fails, we'll remove the optimistic message in the catch block
    } catch (error) {
      console.error('Error sending message:', error)
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => !m._id?.startsWith('temp-')))
      alert('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
  }

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }

  const getOtherUser = (conversation: ConversationResponse) => {
    const userId = typeof user === 'object' && user?.id ? user.id : ''
    const user1Id = typeof conversation.user1Id === 'object' ? conversation.user1Id._id : conversation.user1Id
    const user2Id = typeof conversation.user2Id === 'object' ? conversation.user2Id._id : conversation.user2Id
    
    if (user1Id === userId) {
      return typeof conversation.user2Id === 'object' ? conversation.user2Id : { _id: conversation.user2Id, name: 'Unknown', email: '' }
    }
    return typeof conversation.user1Id === 'object' ? conversation.user1Id : { _id: conversation.user1Id, name: 'Unknown', email: '' }
  }

  const getLastMessage = (conversation: ConversationResponse) => {
    if (conversation.lastMessageId && typeof conversation.lastMessageId === 'object') {
      return conversation.lastMessageId.text
    }
    return 'No messages yet'
  }

  const selectedConversation = conversations.find(c => (c._id || c.id) === selectedConversationId)
  const otherUser = selectedConversation ? getOtherUser(selectedConversation) : null

  return (
    <div className="h-[calc(100vh-120px)] flex bg-gray-50">
      {/* Left Panel - Messages List */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Messages</h2>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto border-t border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-gray-500 text-sm">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const other = getOtherUser(conv)
              const isSelected = (conv._id || conv.id) === selectedConversationId
              
              return (
                <div
                  key={conv._id || conv.id}
                  onClick={() => setSelectedConversationId(conv._id || conv.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    isSelected ? 'bg-orange-50 border-l-4 border-l-orange-400' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange-200">
                        <span className="text-orange-600 font-semibold text-lg">
                          {other.name?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-900 truncate">{other.name || 'Unknown'}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {formatTime(conv.lastMessageAt)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate mb-1">{getLastMessage(conv)}</p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Center Panel - Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConversation && otherUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange-200">
                    <span className="text-orange-600 font-semibold">
                      {otherUser.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900">{otherUser.name || 'Unknown'}</span>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                if (msg.isSystem) {
                  return (
                    <div key={msg._id || msg.id} className="flex justify-center">
                      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 max-w-md">
                        <p className="text-xs text-green-800 text-center">{msg.text}</p>
                      </div>
                    </div>
                  )
                }

                const senderId = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId
                const userId = typeof user === 'object' && user?.id ? user.id : ''
                const isYou = senderId === userId

                return (
                  <div key={msg._id || msg.id} className={`flex ${isYou ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-2 max-w-[70%] ${isYou ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!isYou && (
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 border-2 border-orange-200">
                          <span className="text-orange-600 font-semibold text-xs">
                            {typeof msg.senderId === 'object' ? msg.senderId.name?.[0]?.toUpperCase() : 'U'}
                          </span>
                        </div>
                      )}
                      <div className={`rounded-lg px-4 py-2 ${isYou ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-900'}`}>
                        <p className="text-sm whitespace-pre-line">{msg.text}</p>
                        <span className={`text-xs mt-1 block ${isYou ? 'text-orange-100' : 'text-gray-500'}`}>
                          {formatTimestamp(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="text-xl text-gray-600">+</span>
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={sending}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent disabled:opacity-50"
                />
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ImageIcon className="w-5 h-5 text-gray-600" />
                </button>
                <button 
                  onClick={handleSendMessage}
                  disabled={sending || !message.trim()}
                  className="w-10 h-10 bg-orange-400 text-white rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>

      {/* Right Panel - User Profile */}
      {selectedConversation && otherUser && showProfile && (
        <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange-200">
                    <span className="text-orange-600 font-semibold text-xl">
                      {otherUser.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900">{otherUser.name || 'Unknown'}</span>
                  <div className="text-xs text-green-500">Online</div>
                </div>
              </div>
              <button
                onClick={() => setShowProfile(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Basic Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="text-gray-900 font-medium">{otherUser.email || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Safety & Privacy */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Safety & Privacy</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  Report User
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                  <X className="w-4 h-4" />
                  Block User
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                  <Archive className="w-4 h-4" />
                  Archive Conversation
                </button>
              </div>
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-green-900 mb-1">Safe Communication Active</div>
                    <p className="text-xs text-green-700">
                      Your messages are encrypted and monitored for safety. Never share personal financial information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessagesContent
