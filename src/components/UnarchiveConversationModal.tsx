import { useState } from 'react'
import { X, ArchiveRestore } from 'lucide-react'
import { messagesApi } from '@/services/api'

interface UnarchiveConversationModalProps {
  isOpen: boolean
  onClose: () => void
  conversationId: string
  onSuccess?: () => void
}

const UnarchiveConversationModal = ({
  isOpen,
  onClose,
  conversationId,
  onSuccess,
}: UnarchiveConversationModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleUnarchive = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      await messagesApi.unarchiveConversation(conversationId)

      if (onSuccess) {
        onSuccess()
      }

      onClose()
    } catch (err: any) {
      console.error('Error unarchiving conversation:', err)
      setError(
        err?.response?.data?.message ||
          'Failed to unarchive conversation. Please try again.',
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
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <ArchiveRestore className="w-6 h-6 text-green-700" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Unarchive Conversation</h2>
          </div>
          <p className="text-sm text-gray-600">
            Move this conversation back to your primary inbox?
          </p>
        </div>

        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            This conversation will appear in the <strong>Active</strong> tab again.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

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
            onClick={handleUnarchive}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Unarchiving...
              </>
            ) : (
              'Unarchive'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UnarchiveConversationModal

