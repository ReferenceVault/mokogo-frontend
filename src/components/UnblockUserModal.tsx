import { useState } from 'react'
import { X, UserCheck } from 'lucide-react'
import { blocksApi } from '@/services/api'

interface UnblockUserModalProps {
  isOpen: boolean
  onClose: () => void
  unblockedUserId: string
  unblockedUserName: string
  onSuccess?: () => void
}

const UnblockUserModal = ({
  isOpen,
  onClose,
  unblockedUserId,
  unblockedUserName,
  onSuccess,
}: UnblockUserModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleUnblock = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      await blocksApi.unblock(unblockedUserId)
      
      // Call success callback
      if (onSuccess) {
        onSuccess()
      }
      
      // Close modal
      onClose()
    } catch (err: any) {
      console.error('Error unblocking user:', err)
      setError(
        err?.response?.data?.message || 
        'Failed to unblock user. Please try again.'
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
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Unblock User</h2>
          </div>
          <p className="text-sm text-gray-600">
            Are you sure you want to unblock <span className="font-semibold">{unblockedUserName}</span>?
          </p>
        </div>

        {/* Info Message */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 mb-2">
            <strong>What happens when you unblock someone:</strong>
          </p>
          <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
            <li>You will be able to send and receive messages from this user</li>
            <li>The conversation will appear in your active conversations</li>
            <li>You will see each other in search results</li>
            <li>Chat history will be restored and visible</li>
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
            onClick={handleUnblock}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Unblocking...
              </>
            ) : (
              'Unblock User'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UnblockUserModal
