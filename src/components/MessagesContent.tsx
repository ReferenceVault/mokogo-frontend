import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { messagesApi, ConversationResponse, MessageResponse, listingsApi, usersApi, UserProfile, ListingResponse, blocksApi } from '@/services/api'
import { websocketService } from '@/services/websocket'
import UserAvatar from './UserAvatar'
import ReportUserModal from './ReportUserModal'
import BlockUserModal from './BlockUserModal'
import ArchiveConversationModal from './ArchiveConversationModal'
import { 
  MoreVertical, 
  Shield,
  Paperclip,
  Image as ImageIcon,
  Send,
  X,
  Flag,
  Archive,
  User,
  ChevronLeft,
  MapPin
} from 'lucide-react'

interface MessagesContentProps {
  initialConversationId?: string
}

const MessagesContent = ({ initialConversationId }: MessagesContentProps) => {
  const { user } = useStore()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState<ConversationResponse[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(initialConversationId || null)
  const [messages, setMessages] = useState<MessageResponse[]>([])
  const [message, setMessage] = useState('')
  const [showProfile, setShowProfile] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set()) // Set of online user IDs
  const [property, setProperty] = useState<ListingResponse | null>(null)
  const [propertyLoading, setPropertyLoading] = useState(false)
  const [profileToShow, setProfileToShow] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [showUnavailableModal, setShowUnavailableModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [showArchiveModal, setShowArchiveModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'active' | 'archived' | 'blocked'>('active')
  const [archivedConversations, setArchivedConversations] = useState<ConversationResponse[]>([])
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([])
  const [blockedConversations, setBlockedConversations] = useState<ConversationResponse[]>([])
  const [currentUserMessagingRestricted, setCurrentUserMessagingRestricted] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const conversationsLoadedRef = useRef(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const lastFetchedListingIdRef = useRef<string | null>(null)
  const isFetchingRef = useRef(false)

  const conversationMenuRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  useEffect(() => {
    if (user && !conversationsLoadedRef.current) {
      const token = localStorage.getItem('mokogo-access-token')
      if (token) {
        websocketService.connect(token)
      }
      
      // Always fetch fresh conversations to get latest messages and unread counts
      // Cache is used for initial load, but we need fresh data for messages view
      fetchConversations()
      conversationsLoadedRef.current = true
    } else if (!user) {
      // Disconnect WebSocket and clear state when user logs out
      websocketService.disconnect()
      setOnlineUsers(new Set())
      setConversations([])
      setMessages([])
      setSelectedConversationId(null)
      conversationsLoadedRef.current = false
    }

    // WebSocket listeners
    const handleNewMessage = (newMessage: MessageResponse) => {
      // Update conversations list to refresh unread count and last message
      setConversations(prev => {
        const updated = prev.map(conv => {
          const convId = conv._id || conv.id
          const messageConvId = typeof newMessage.conversationId === 'object' 
            ? (newMessage.conversationId as any)._id 
            : newMessage.conversationId
            
          if (convId === messageConvId || convId === newMessage.conversationId) {
            // Update last message and increment unread count if not from current user
            const senderId = typeof newMessage.senderId === 'object' 
              ? (newMessage.senderId as any)._id 
              : newMessage.senderId
            const userId = typeof user === 'object' && user?.id ? user.id : ''
            const isFromCurrentUser = senderId === userId || senderId === (user as any)?._id
            const isCurrentConversation = selectedConversationId === convId
            
            return {
              ...conv,
              lastMessageId: newMessage,
              lastMessageAt: newMessage.createdAt,
              unreadCount: isFromCurrentUser || isCurrentConversation 
                ? (conv.unreadCount || 0) 
                : (conv.unreadCount || 0) + 1
            }
          }
          return conv
        })
        
        // Sort by lastMessageAt to show most recent first
        return updated.sort((a, b) => {
          const timeA = new Date(a.lastMessageAt || 0).getTime()
          const timeB = new Date(b.lastMessageAt || 0).getTime()
          return timeB - timeA
        })
      })

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
          // Preserve unreadCount if not provided in update
          const existingConv = updated[index]
          const updatedConv = {
            ...updatedConversation,
            unreadCount: updatedConversation.unreadCount !== undefined 
              ? updatedConversation.unreadCount 
              : existingConv.unreadCount
          }
          // Move to top
          updated.splice(index, 1)
          updated.unshift(updatedConv)
          return updated
        }
        return prev
      })
    }

    const handleMessagesRead = (data: { conversationId: string; lastReadMessageId: string }) => {
      // Only update if it's the current conversation
      if (selectedConversationId && data.conversationId === selectedConversationId) {
        setMessages(prev => {
          const userId = typeof user === 'object' && user?.id ? user.id : ''
          const lastReadMsgId = data.lastReadMessageId
          
          // Find the index of the last read message
          const lastReadIndex = prev.findIndex(m => (m._id || m.id) === lastReadMsgId)
          if (lastReadIndex === -1) return prev
          
          // Mark all messages from current user up to and including the lastReadMessageId as read
          return prev.map((msg, index) => {
            const senderId = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId
            // Only mark messages from current user that are at or before the last read message
            if (senderId === userId && index <= lastReadIndex) {
              return { ...msg, isRead: true }
            }
            return msg
          })
        })
      }
    }

    const handleUserPresence = (data: { userId: string; isOnline: boolean }) => {
      setOnlineUsers(prev => {
        const updated = new Set(prev)
        if (data.isOnline) {
          updated.add(data.userId)
        } else {
          updated.delete(data.userId)
        }
        return updated
      })
    }

    websocketService.on('new_message', handleNewMessage)
    websocketService.on('conversation_updated', handleConversationUpdate)
    websocketService.on('messages_read', handleMessagesRead)
    websocketService.on('user_presence', handleUserPresence)

    return () => {
      websocketService.off('new_message', handleNewMessage)
      websocketService.off('conversation_updated', handleConversationUpdate)
      websocketService.off('messages_read', handleMessagesRead)
      websocketService.off('user_presence', handleUserPresence)
    }
  }, [user, selectedConversationId])

  // Handle tab close to disconnect WebSocket
  useEffect(() => {
    const handleBeforeUnload = () => {
      websocketService.disconnect()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  useEffect(() => {
    if (initialConversationId) {
      // Clear old state when redirecting to a new conversation
      setMessages([])
      setProperty(null)
      setProfileToShow(null)
      setConversationFromUrl(null)
      lastFetchedListingIdRef.current = null
      setSelectedConversationId(initialConversationId)
    }
  }, [initialConversationId])

  // When conversation from URL is not in list, fetch it directly (e.g. deep link on mobile)
  const [conversationFromUrl, setConversationFromUrl] = useState<ConversationResponse | null>(null)
  useEffect(() => {
    if (!selectedConversationId || loading) return
    const inList = conversations.some(c => (c._id || c.id) === selectedConversationId)
    if (inList) {
      setConversationFromUrl(null)
      return
    }
    let cancelled = false
    messagesApi.getConversationById(selectedConversationId)
      .then((conv) => {
        if (!cancelled) {
          setConversationFromUrl(conv)
          setConversations(prev => {
            if (prev.some(c => (c._id || c.id) === selectedConversationId)) return prev
            return [conv, ...prev]
          })
        }
      })
      .catch(() => {
        if (!cancelled) setConversationFromUrl(null)
      })
    return () => { cancelled = true }
  }, [selectedConversationId, loading, conversations.length])

  useEffect(() => {
    if (selectedConversationId) {
      // Clear messages first when switching conversations
      setMessages([])
      // Then fetch new messages
      fetchMessages(selectedConversationId)
      websocketService.emit('join_conversation', { conversationId: selectedConversationId })
      
      // Mark conversation as read and reset unread count
      setConversations(prev => {
        return prev.map(conv => {
          const convId = conv._id || conv.id
          if (convId === selectedConversationId) {
            return { ...conv, unreadCount: 0 }
          }
          return conv
        })
      })
      
      // Mark as read on server
      messagesApi.markAsRead(selectedConversationId).catch(err => {
        console.error('Error marking conversation as read:', err)
      })
    } else {
      // Clear messages when no conversation is selected
      setMessages([])
    }
  }, [selectedConversationId])

  // Fetch property and profile when conversation is selected
  useEffect(() => {
    const fetchPropertyAndProfile = async () => {
      if (!selectedConversationId || !user) {
        setProperty(null)
        setProfileToShow(null)
        lastFetchedListingIdRef.current = null
        return
      }

      // Find conversation from current conversations state or conversationFromUrl
      // Wait a bit for conversationFromUrl to be fetched if it's not in the list yet
      let conversation = conversations.find(c => (c._id || c.id) === selectedConversationId)
      if (!conversation && conversationFromUrl && (conversationFromUrl._id || conversationFromUrl.id) === selectedConversationId) {
        conversation = conversationFromUrl
      }
      
      // If conversation is still not found, try fetching it
      if (!conversation) {
        try {
          const fetchedConv = await messagesApi.getConversationById(selectedConversationId)
          conversation = fetchedConv
          // Set conversationFromUrl to trigger re-render
          setConversationFromUrl(fetchedConv)
          // Add to conversations list if not already there
          setConversations(prev => {
            if (prev.some(c => (c._id || c.id) === selectedConversationId)) return prev
            return [fetchedConv, ...prev]
          })
        } catch (error) {
          console.error('Error fetching conversation:', error)
          setProperty(null)
          setProfileToShow(null)
          lastFetchedListingIdRef.current = null
          return
        }
      }
      
      if (!conversation) {
        setProperty(null)
        setProfileToShow(null)
        lastFetchedListingIdRef.current = null
        return
      }

      // Get listingId from conversation
      const listingId = typeof conversation.listingId === 'object' 
        ? conversation.listingId._id 
        : conversation.listingId

      if (!listingId) {
        setProperty(null)
        setProfileToShow(null)
        lastFetchedListingIdRef.current = null
        return
      }

      // Guard: Skip if already fetching
      if (isFetchingRef.current) {
        return
      }

      // Skip if we've already loaded this exact listing for the current conversation
      // But only if we're still on the same conversation (check by comparing listingId)
      if (lastFetchedListingIdRef.current === listingId && property?._id === listingId) {
        // Same listing already loaded - skip refetch
        return
      }

      // Mark as fetching and update ref
      isFetchingRef.current = true
      lastFetchedListingIdRef.current = listingId

      // Fetch property using ONLY public endpoint
      setPropertyLoading(true)
      try {
        const propertyData = await listingsApi.getByIdPublic(listingId)
        setProperty(propertyData)

        // Determine ownership
        const userId = typeof user === 'object' && user?.id ? user.id : ''
        const ownerId = propertyData.ownerId
        const isOwner = ownerId === userId

        // Determine which profile to show
        let profileUserId: string | null = null
        if (isOwner) {
          // Show OTHER participant's profile
          const user1Id = typeof conversation.user1Id === 'object' ? conversation.user1Id._id : conversation.user1Id
          const user2Id = typeof conversation.user2Id === 'object' ? conversation.user2Id._id : conversation.user2Id
          profileUserId = user1Id === userId ? user2Id : user1Id
        } else {
          // Show PROPERTY OWNER's profile
          profileUserId = ownerId
        }

        // Fetch profile
        if (profileUserId) {
          setProfileLoading(true)
          try {
            const profileData = await usersApi.getUserById(profileUserId)
            setProfileToShow(profileData)
          } catch (error) {
            console.error('Error fetching user profile:', error)
            setProfileToShow(null)
          } finally {
            setProfileLoading(false)
          }
        } else {
          setProfileToShow(null)
        }
      } catch (error) {
        // Gracefully handle error - do NOT attempt protected fallback
        console.error('Error fetching property from public endpoint:', error)
        setProperty(null)
        setProfileToShow(null)
        lastFetchedListingIdRef.current = null
      } finally {
        setPropertyLoading(false)
        isFetchingRef.current = false
      }
    }

    fetchPropertyAndProfile()
  }, [selectedConversationId, user, conversationFromUrl, conversations]) // Include conversations so it re-runs when list is loaded

  useEffect(() => {
    //messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  // Scroll only the messages container, not the entire page
  if (messagesContainerRef.current) {
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
  }
  }, [messages])

  // Fetch current user's messaging restriction status
  useEffect(() => {
    const fetchUserMessagingStatus = async () => {
      if (!user?.id) {
        setCurrentUserMessagingRestricted(false)
        return
      }

      try {
        const profile = await usersApi.getMyProfile()
        setCurrentUserMessagingRestricted(profile.messagingRestricted || false)
      } catch (error) {
        console.error('Error fetching user messaging status:', error)
        // Default to false if fetch fails
        setCurrentUserMessagingRestricted(false)
      }
    }

    fetchUserMessagingStatus()
  }, [user?.id])

  const fetchConversations = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const [conversationsData, archivedData, onlineUsersData, blockedIds] = await Promise.all([
        messagesApi.getAllConversations(false), // Active conversations
        messagesApi.getAllConversations(true), // Archived conversations
        messagesApi.getOnlineUsers().catch(() => []), // Fetch online users, ignore errors
        blocksApi.getAllBlockedUserIds().catch(() => []), // Fetch blocked user IDs
      ])
      
      // Sort conversations by lastMessageAt (most recent first)
      const sortedConversations = [...conversationsData].sort((a, b) => {
        const timeA = new Date(a.lastMessageAt || 0).getTime()
        const timeB = new Date(b.lastMessageAt || 0).getTime()
        return timeB - timeA
      })

      const sortedArchived = [...archivedData].sort((a, b) => {
        const timeA = new Date(a.lastMessageAt || 0).getTime()
        const timeB = new Date(b.lastMessageAt || 0).getTime()
        return timeB - timeA
      })
      
      // Helper function to extract user ID string from conversation user field
      const getUserIdStr = (userId: any): string => {
        if (!userId) return ''
        if (typeof userId === 'string') return userId
        if (typeof userId === 'object' && userId._id) {
          return userId._id.toString()
        }
        if (typeof userId === 'object' && userId.id) {
          return userId.id.toString()
        }
        return ''
      }

      // Normalize blocked IDs to strings for comparison
      const normalizedBlockedIds = blockedIds.map(id => {
        if (typeof id === 'string') return id
        if (typeof id === 'object' && id && '_id' in id) return (id as any)._id.toString()
        if (typeof id === 'object' && id && 'id' in id) return (id as any).id.toString()
        return String(id)
      })
      
      // Debug logging
      if (import.meta.env.DEV && blockedIds.length > 0) {
        console.log('Blocked user IDs:', normalizedBlockedIds)
      }
      
      // Filter blocked conversations
      const blockedConvs: ConversationResponse[] = []
      const activeConvs = sortedConversations.filter(conv => {
        const user1IdStr = getUserIdStr(conv.user1Id)
        const user2IdStr = getUserIdStr(conv.user2Id)
        
        // Check if either user is in the blocked list (compare as strings)
        const isBlocked = (user1IdStr && normalizedBlockedIds.includes(user1IdStr)) || 
                         (user2IdStr && normalizedBlockedIds.includes(user2IdStr))
        
        if (isBlocked) {
          if (import.meta.env.DEV) {
            console.log('Found blocked conversation:', {
              convId: conv._id || conv.id,
              user1Id: user1IdStr,
              user2Id: user2IdStr,
              isBlocked
            })
          }
          blockedConvs.push(conv)
          return false
        }
        return true
      })

      // Also check archived conversations for blocked users
      const archivedNonBlocked = sortedArchived.filter(conv => {
        const user1IdStr = getUserIdStr(conv.user1Id)
        const user2IdStr = getUserIdStr(conv.user2Id)
        
        // Check if either user is in the blocked list (compare as strings)
        const isBlocked = (user1IdStr && normalizedBlockedIds.includes(user1IdStr)) || 
                         (user2IdStr && normalizedBlockedIds.includes(user2IdStr))
        
        if (isBlocked) {
          blockedConvs.push(conv)
          return false
        }
        return true
      })
      
      // Cache the conversations
      useStore.getState().setCachedConversations([...activeConvs, ...archivedNonBlocked])
      useStore.getState().setDataFetchedAt(Date.now())
      
      setConversations(activeConvs)
      setArchivedConversations(archivedNonBlocked)
      setBlockedConversations(blockedConvs)
      setBlockedUserIds(blockedIds)
      setOnlineUsers(new Set(onlineUsersData))
      
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
      
      // Reset unread count for this conversation
      setConversations(prev => 
        prev.map(conv => 
          (conv._id || conv.id) === conversationId 
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      )
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedConversationId || sending) return

    // Check if conversation is disabled
    const currentConversation = conversations.find(c => (c._id || c.id) === selectedConversationId)
    if (currentConversation?.isDisabled) {
      alert('This listing is no longer active')
      return
    }

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
    } catch (error: any) {
      console.error('Error sending message:', error)
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => !m._id?.startsWith('temp-')))
      if (error?.message?.includes('no longer active') || error?.message?.includes('Listing')) {
        alert('This listing is no longer active')
      } else {
        alert('Failed to send message. Please try again.')
      }
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


  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      return
    }

    try {
      await messagesApi.deleteConversation(conversationId)
      setConversations(prev => prev.filter(conv => (conv._id || conv.id) !== conversationId))
      setOpenMenuId(null)
      
      // If deleted conversation was selected, clear selection
      if (selectedConversationId === conversationId) {
        setSelectedConversationId(null)
        setMessages([])
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
      alert('Failed to delete conversation. Please try again.')
    }
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
      
      // Close conversation menus
      let clickedOutside = true
      conversationMenuRefs.current.forEach((ref) => {
        if (ref && ref.contains(event.target as Node)) {
          clickedOutside = false
        }
      })
      
      if (clickedOutside) {
        setOpenMenuId(null)
      }
    }

    if (showMenu || openMenuId) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu, openMenuId])

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
    
    if (user1Id === userId) {
      if (typeof conversation.user2Id === 'object') {
        return {
          _id: conversation.user2Id._id,
          name: conversation.user2Id.name,
          email: conversation.user2Id.email,
          profileImageUrl: conversation.user2Id.profileImageUrl,
          messagingRestricted: conversation.user2Id.messagingRestricted || false
        }
      }
      return { _id: conversation.user2Id, name: 'Unknown', email: '', profileImageUrl: undefined, messagingRestricted: false }
    }
    
    if (typeof conversation.user1Id === 'object') {
      return {
        _id: conversation.user1Id._id,
        name: conversation.user1Id.name,
        email: conversation.user1Id.email,
        profileImageUrl: conversation.user1Id.profileImageUrl,
        messagingRestricted: conversation.user1Id.messagingRestricted || false
      }
    }
    return { _id: conversation.user1Id, name: 'Unknown', email: '', profileImageUrl: undefined, messagingRestricted: false }
  }


  const getLastMessage = (conversation: ConversationResponse) => {
    // Check if lastMessageId is an object with text property
    if (conversation.lastMessageId && typeof conversation.lastMessageId === 'object') {
      const lastMessage = conversation.lastMessageId as MessageResponse
      return lastMessage.text || 'No messages yet'
    }
    // If lastMessageId is a string ID, we can't get the text without fetching
    // But we should have it from the API response
    // Fallback to checking if there's a lastMessage property
    if ((conversation as any).lastMessage && typeof (conversation as any).lastMessage === 'object') {
      return ((conversation as any).lastMessage as MessageResponse).text || 'No messages yet'
    }
    return 'No messages yet'
  }

  // Get conversations based on active tab
  const getCurrentConversations = () => {
    if (activeTab === 'archived') return archivedConversations
    if (activeTab === 'blocked') return blockedConversations
    return conversations
  }

  const currentConversations = getCurrentConversations()

  const selectedConversation = currentConversations.find(c => (c._id || c.id) === selectedConversationId) ||
    conversations.find(c => (c._id || c.id) === selectedConversationId) ||
    archivedConversations.find(c => (c._id || c.id) === selectedConversationId) ||
    blockedConversations.find(c => (c._id || c.id) === selectedConversationId) ||
    (conversationFromUrl && (conversationFromUrl._id || conversationFromUrl.id) === selectedConversationId ? conversationFromUrl : null)
  const otherUser = selectedConversation ? getOtherUser(selectedConversation) : null

  // Check if current user blocked the other user
  const [didCurrentUserBlock, setDidCurrentUserBlock] = useState<boolean>(false)
  const [isBlockedConversation, setIsBlockedConversation] = useState<boolean>(false)
  
  useEffect(() => {
    if (otherUser && selectedConversation) {
      const otherUserId = otherUser._id
      const isBlocked = blockedUserIds.includes(otherUserId)
      setIsBlockedConversation(isBlocked)
      
      if (isBlocked) {
        blocksApi.getBlockedUsers().then(blockedIds => {
          setDidCurrentUserBlock(blockedIds.includes(otherUserId))
        }).catch(() => setDidCurrentUserBlock(false))
      } else {
        setDidCurrentUserBlock(false)
      }
    } else {
      setIsBlockedConversation(false)
      setDidCurrentUserBlock(false)
    }
  }, [otherUser?._id, selectedConversation, blockedUserIds])
  
  // Debug: Log to see what data we're getting
  if (import.meta.env.DEV && selectedConversation) {
    console.log('Selected conversation:', selectedConversation)
    console.log('Other user:', otherUser)
    console.log('User1Id:', selectedConversation.user1Id)
    console.log('User2Id:', selectedConversation.user2Id)
  }

  return (
    // <div className="h-[calc(100vh-4rem)] sm:h-[calc(100vh-120px)] flex bg-gray-50">
      <div className="h-[calc(100dvh-4rem)] sm:h-[calc(100vh-120px)] min-h-[400px] flex flex-col lg:flex-row bg-gray-50 overflow-hidden">

      {/* Backdrop for profile overlay on mobile */}
      {selectedConversation && showProfile && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden" 
          onClick={() => setShowProfile(false)}
          aria-hidden="true"
        />
      )}

      {/* Left Panel - Messages List */}
      <div className={`flex flex-col w-full lg:w-80 border-r border-gray-200 bg-white flex-shrink-0 ${selectedConversationId ? 'hidden lg:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Messages</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('active')
              setSelectedConversationId(null)
            }}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'active'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => {
              setActiveTab('archived')
              setSelectedConversationId(null)
            }}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'archived'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Archived
          </button>
          <button
            onClick={() => {
              setActiveTab('blocked')
              setSelectedConversationId(null)
            }}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'blocked'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Blocked
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : currentConversations.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-gray-500 text-sm">
                {activeTab === 'archived' 
                  ? 'No archived conversations' 
                  : activeTab === 'blocked'
                  ? 'No blocked conversations'
                  : 'No conversations yet'}
              </p>
            </div>
          ) : (
            currentConversations.map((conv) => {
              const other = getOtherUser(conv)
              const isSelected = (conv._id || conv.id) === selectedConversationId
              const unreadCount = conv.unreadCount || 0
              
              const convId = conv._id || conv.id
              const isMenuOpen = openMenuId === convId
              
              return (
                <div
                  key={convId}
                  onClick={() => setSelectedConversationId(convId)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors relative ${
                    isSelected ? 'bg-orange-50 border-l-4 border-l-orange-400' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <UserAvatar 
                        user={other}
                        size="lg" 
                      />
                      {(() => {
                        const otherUserId = other._id
                        const isOnline = otherUserId ? onlineUsers.has(otherUserId) : false
                        return isOnline ? (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        ) : null
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900 truncate">{other.name || 'Unknown'}</span>
                          {(() => {
                            const otherUserId = other._id
                            const isOnline = otherUserId ? onlineUsers.has(otherUserId) : false
                            return isOnline ? (
                              <span className="text-xs text-green-600 font-medium">Online</span>
                            ) : null
                          })()}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-gray-500">
                            {formatTime(conv.lastMessageAt)}
                          </span>
                          {unreadCount > 0 && (
                            <span className="bg-orange-400 text-white text-xs font-semibold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 truncate mb-1">{getLastMessage(conv)}</p>
                    </div>
                    <div 
                      ref={(el) => {
                        if (el) conversationMenuRefs.current.set(convId, el)
                        else conversationMenuRefs.current.delete(convId)
                      }}
                      className="relative flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenuId(isMenuOpen ? null : convId)
                        }}
                        className="p-2 min-h-[44px] min-w-[44px] hover:bg-gray-200 rounded transition-colors flex items-center justify-center"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                      {isMenuOpen && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[140px]">
                          <button
                            onClick={(e) => handleDeleteConversation(convId, e)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Delete Chat
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Center Panel - Chat Window */}
      <div className={`flex-1 flex flex-col min-h-0 bg-white min-w-0 ${!selectedConversationId ? 'hidden lg:flex' : 'flex'}`}>
        {selectedConversation && otherUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <button
                  onClick={() => setSelectedConversationId(null)}
                  className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Back to conversations"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="relative">
                  <UserAvatar 
                    user={otherUser}
                    size="md" 
                  />
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900">{otherUser.name || 'Unknown'}</span>
                  <div className="flex items-center gap-2 text-xs">
                    {(() => {
                      const otherUserId = otherUser._id
                      const isOnline = otherUserId ? onlineUsers.has(otherUserId) : false
                      return (
                        <>
                          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                          <span className={isOnline ? 'text-green-600 font-medium' : 'text-gray-500'}>
                            {isOnline ? 'Online' : 'Offline'}
                          </span>
                        </>
                      )
                    })()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowProfile(!showProfile)}
                  className="p-2 min-h-[44px] min-w-[44px] hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center flex-shrink-0"
                  title={showProfile ? 'Hide profile' : 'Show profile'}
                >
                  {showProfile ? (
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  ) : (
                    <User className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Disabled Banner */}
            {selectedConversation?.isDisabled && (
              <div className="px-4 py-2 bg-orange-50 border-b border-orange-200">
                <div className="flex items-center gap-2 text-sm text-orange-800">
                  <span>🔕</span>
                  <span>This listing is no longer active</span>
                </div>
              </div>
            )}

            {/* Blocked Banner */}
            {selectedConversation && otherUser && isBlockedConversation && (
              <div className="px-4 py-2 bg-red-50 border-b border-red-200">
                <div className="flex items-center gap-2 text-sm text-red-800">
                  <span>🚫</span>
                  <span>
                    {didCurrentUserBlock 
                      ? 'This user is blocked' 
                      : 'This conversation is no longer available.'}
                  </span>
                </div>
              </div>
            )}

            {/* Messages */}
            {/* <div className="flex-1 overflow-y-auto p-4 space-y-4"> */}
            <div ref={messagesContainerRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 space-y-4">

              {(() => {
                const userId = typeof user === 'object' && user?.id ? user.id : ''
                // Find the last message sent by current user
                const userMessages = messages.filter(m => {
                  const mSenderId = typeof m.senderId === 'object' ? m.senderId._id : m.senderId
                  return mSenderId === userId && !m.isSystem
                })
                const lastUserMessage = userMessages[userMessages.length - 1]
                const lastUserMessageId = lastUserMessage ? (lastUserMessage._id || lastUserMessage.id) : null
                
                return messages.map((msg) => {
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
                  const isYou = senderId === userId
                  const msgId = msg._id || msg.id
                  const isLastUserMessage = msgId === lastUserMessageId

                  return (
                    <div key={msgId} className={`flex ${isYou ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-2 max-w-[85%] sm:max-w-[70%] ${isYou ? 'flex-row-reverse' : 'flex-row'}`}>
                        {!isYou && (
                          <UserAvatar 
                            user={{
                              name: typeof msg.senderId === 'object' ? msg.senderId.name : undefined,
                              profileImageUrl: typeof msg.senderId === 'object' ? (msg.senderId as any).profileImageUrl : undefined
                            }} 
                            size="sm" 
                            className="flex-shrink-0"
                          />
                        )}
                        <div className={`rounded-lg px-4 py-2 ${isYou ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-900'}`}>
                          <p className="text-sm whitespace-pre-line">{msg.text}</p>
                          <div className={`flex items-center gap-1 mt-1 ${isYou ? 'justify-end' : 'justify-start'}`}>
                            <span className={`text-xs ${isYou ? 'text-orange-100' : 'text-gray-500'}`}>
                              {formatTimestamp(msg.createdAt)}
                            </span>
                            {isYou && isLastUserMessage && msg.isRead && (
                              <span className="text-xs text-orange-100 italic">Seen</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              })()}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              {selectedConversation?.isDisabled ? (
                <div className="flex items-center justify-center py-3">
                  <p className="text-sm text-gray-500">Listing no longer available</p>
                </div>
              ) : isBlockedConversation ? (
                <div className="flex items-center justify-center py-3">
                  <p className="text-sm text-gray-500">
                    {didCurrentUserBlock 
                      ? 'You have blocked this user' 
                      : 'This conversation is no longer available.'}
                  </p>
                </div>
              ) : currentUserMessagingRestricted ? (
                <div className="flex items-center justify-center py-3">
                  <p className="text-sm text-gray-500 text-center">
                    Messaging restricted for you. Contact support.
                  </p>
                </div>
              ) : (
                <div className="flex items-end gap-2">
                  <button className="hidden sm:flex p-2 min-h-[44px] min-w-[44px] hover:bg-gray-100 rounded-lg transition-colors items-center justify-center">
                    <span className="text-xl text-gray-600">+</span>
                  </button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={sending}
                    className="flex-1 min-h-[44px] px-4 py-2.5 border border-gray-200 rounded-lg text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent disabled:opacity-50"
                  />
                  <button className="hidden sm:flex p-2 min-h-[44px] min-w-[44px] hover:bg-gray-100 rounded-lg transition-colors items-center justify-center">
                    <Paperclip className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="hidden sm:flex p-2 min-h-[44px] min-w-[44px] hover:bg-gray-100 rounded-lg transition-colors items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-gray-600" />
                  </button>
                  <button 
                    onClick={handleSendMessage}
                    disabled={sending || !message.trim()}
                    className="min-h-[44px] min-w-[44px] flex-shrink-0 bg-orange-400 text-white rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </>
        ) : selectedConversationId && loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-6 text-center">
            <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-base sm:text-sm">Loading conversation...</p>
          </div>
        ) : selectedConversationId && !selectedConversation && !loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-6 text-center">
            <p className="text-base sm:text-sm">Conversation not found</p>
            <button
              onClick={() => setSelectedConversationId(null)}
              className="mt-3 text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              Back to conversations
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-6 text-center">
            <p className="text-base sm:text-sm">Select a conversation to start messaging</p>
          </div>
        )}
      </div>

      {/* Right Panel - Property & User Profile */}
      {selectedConversation && showProfile && (
        <div className="fixed lg:relative inset-y-0 right-0 z-40 w-full max-w-sm lg:max-w-none lg:w-80 border-l border-gray-200 bg-white overflow-y-auto shadow-xl lg:shadow-none">
          {/* Header with Close Button */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Details</h3>
              <button
                onClick={() => setShowProfile(false)}
                className="p-2 min-h-[44px] min-w-[44px] hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Property Tile */}
            <div className="relative">
              {/* Skeleton - Fades out when content loads */}
              <div 
                className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${
                  propertyLoading ? 'opacity-100 animate-pulse' : 'opacity-0 absolute inset-0 pointer-events-none'
                }`}
              >
                {/* Skeleton Image */}
                <div className="h-48 bg-gray-200"></div>
                {/* Skeleton Content */}
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
              
              {/* Actual Content - Fades in when loaded */}
              {property && (
                <div 
                  className={`border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 ease-in-out ${
                    propertyLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  {/* Property Image */}
                  <div className="relative h-48 bg-gray-100">
                    {property.photos && property.photos.length > 0 ? (
                      <img
                        src={property.photos[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Property Details */}
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                      {property.title}
                    </h4>
                    {(property.locality || property.city) && (
                      <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
                        <MapPin className="w-3 h-3" />
                        <span>
                          {property.locality && property.city
                            ? `${property.locality}, ${property.city}`
                            : property.locality || property.city || 'Location'}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        const listingId = property._id || property.id
                        const listingStatus = (property as any).status || property.status
                        
                        // Only navigate if listing is 'live' (publicly accessible)
                        if (listingStatus === 'live') {
                          navigate(`/listings/${listingId}`)
                        } else {
                          setShowUnavailableModal(true)
                        }
                      }}
                      className="w-full px-4 py-2 bg-orange-400 text-white text-sm font-medium rounded-lg hover:bg-orange-500 transition-colors"
                    >
                      View Detail
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Section */}
            <div className="relative">
              {/* Skeleton - Fades out when content loads */}
              <div 
                className={`border-t border-gray-200 pt-6 transition-all duration-300 ease-in-out ${
                  profileLoading ? 'opacity-100 animate-pulse' : 'opacity-0 absolute inset-0 pointer-events-none'
                }`}
              >
                <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
                
                {/* Skeleton Profile Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>

                {/* Skeleton Profile Info */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-28"></div>
                  </div>
                </div>
              </div>
              
              {/* Actual Content - Fades in when loaded */}
              {profileToShow && (
                <div 
                  className={`border-t border-gray-200 pt-6 transition-all duration-300 ease-in-out ${
                    profileLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Profile</h3>
                  
                  {/* Profile Photo and Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <UserAvatar 
                      user={profileToShow}
                      size="xl" 
                    />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {profileToShow.name || 'Unknown'}
                      </div>
                      {(() => {
                        const profileUserId = profileToShow._id
                        const isOnline = profileUserId ? onlineUsers.has(profileUserId) : false
                        return (
                          <div className="flex items-center gap-2 text-xs mt-1">
                            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                            <span className={isOnline ? 'text-green-600 font-medium' : 'text-gray-500'}>
                              {isOnline ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        )
                      })()}
                    </div>
                  </div>

                  {/* Profile Information */}
                  <div className="space-y-3 text-sm">
                    {profileToShow.gender && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender</span>
                        <span className="text-gray-900 font-medium">{profileToShow.gender}</span>
                      </div>
                    )}
                    {profileToShow.occupation && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Occupation</span>
                        <span className="text-gray-900 font-medium">{profileToShow.occupation}</span>
                      </div>
                    )}
                    {profileToShow.companyName && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Company</span>
                        <span className="text-gray-900 font-medium">{profileToShow.companyName}</span>
                      </div>
                    )}
                    {profileToShow.about && (
                      <div>
                        <span className="text-gray-600 block mb-1">About You</span>
                        <p className="text-gray-900 font-medium">{profileToShow.about}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Safety & Privacy */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Safety & Privacy</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setShowReportModal(true)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Flag className="w-4 h-4" />
                  Report User
                </button>
                <button 
                  onClick={() => setShowBlockModal(true)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Block User
                </button>
                <button 
                  onClick={() => setShowArchiveModal(true)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
                >
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

      {/* Unavailable Listing Modal */}
      {showUnavailableModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-2xl p-6 max-w-md w-full border border-gray-200 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Listing Unavailable</h3>
              <button
                onClick={() => setShowUnavailableModal(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              This listing is no longer available.
            </p>
            <button
              onClick={() => setShowUnavailableModal(false)}
              className="w-full px-6 py-3 bg-orange-400 text-white rounded-xl font-semibold hover:bg-orange-500 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Report User Modal */}
      {selectedConversation && otherUser && (
        <ReportUserModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          reportedUserId={otherUser._id}
          reportedUserName={otherUser.name || 'Unknown User'}
          listingId={property ? (property._id || property.id) : undefined}
          conversationId={selectedConversationId || undefined}
          onSuccess={() => {
            // Optionally show a success message or refresh data
            console.log('Report submitted successfully')
          }}
        />
      )}

      {/* Block User Modal */}
      {selectedConversation && otherUser && (
        <BlockUserModal
          isOpen={showBlockModal}
          onClose={() => setShowBlockModal(false)}
          blockedUserId={otherUser._id}
          blockedUserName={otherUser.name || 'Unknown User'}
          onSuccess={async () => {
            // Refresh conversations to update blocked list
            await fetchConversations()
            // Switch to blocked tab to show the blocked conversation
            setActiveTab('blocked')
            // Clear selected conversation if it's with blocked user
            setSelectedConversationId(null)
            setMessages([])
            console.log('User blocked successfully')
          }}
        />
      )}

      {/* Archive Conversation Modal */}
      {selectedConversationId && (
        <ArchiveConversationModal
          isOpen={showArchiveModal}
          onClose={() => setShowArchiveModal(false)}
          conversationId={selectedConversationId}
          onSuccess={() => {
            // Refresh conversations to update list
            fetchConversations()
            // Clear selected conversation
            setSelectedConversationId(null)
            setMessages([])
            console.log('Conversation archived successfully')
          }}
        />
      )}
    </div>
  )
}

export default MessagesContent

