import { useState } from 'react'
import { X, Archive } from 'lucide-react'
import { messagesApi } from '@/services/api'

interface ArchiveConversationModalProps {
  isOpen: boolean
  onClose: () => void
  conversationId: string
  onSuccess?: () => void
}

const ArchiveConversationModal = ({
  isOpen,
  onClose,
  conversationId,
  onSuccess,
}: ArchiveConversationModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleArchive = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      await messagesApi.archiveConversation(conversationId)
      
      // Call success callback
      if (onSuccess) {
        onSuccess()
      }
      
      // Close modal
      onClose()
    } catch (err: any) {
      console.error('Error archiving conversation:', err)
      setError(
        err?.response?.data?.message || 
        'Failed to archive conversation. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[80] p-4">
      <div className="relative bg-white rounded-2xl p-6 max-w-md w-full border border-gray-200 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Archive className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Archive Conversation</h2>
          </div>
          <p className="text-sm text-gray-600">
            Archive this conversation?
          </p>
        </div>

        {/* Info Message */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 mb-2">
            <strong>What happens when you archive:</strong>
          </p>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>This conversation will be moved to your archived folder</li>
            <li>It will be hidden from your primary inbox</li>
            <li>You can access it later from the archived tab</li>
            <li>If the other user sends a new message, it will automatically return to your inbox</li>
            <li>This is different from blocking - you can still receive messages</li>
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleArchive}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-orange-400 rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Archiving...
              </>
            ) : (
              'Archive Conversation'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ArchiveConversationModal
