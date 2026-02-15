import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { blocksApi, CreateBlockRequest } from '@/services/api'

interface BlockUserModalProps {
  isOpen: boolean
  onClose: () => void
  blockedUserId: string
  blockedUserName: string
  onSuccess?: () => void
}

const BlockUserModal = ({
  isOpen,
  onClose,
  blockedUserId,
  blockedUserName,
  onSuccess,
}: BlockUserModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleBlock = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const blockData: CreateBlockRequest = {
        blockedUserId,
      }

      await blocksApi.block(blockData)
      
      // Call success callback
      if (onSuccess) {
        onSuccess()
      }
      
      // Close modal
      onClose()
    } catch (err: any) {
      console.error('Error blocking user:', err)
      setError(
        err?.response?.data?.message || 
        'Failed to block user. Please try again.'
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Block User</h2>
          </div>
          <p className="text-sm text-gray-600">
            Block <span className="font-semibold">{blockedUserName}</span>?
          </p>
        </div>

        {/* Warning Message */}
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 mb-2">
            <strong>What happens when you block someone:</strong>
          </p>
          <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
            <li>You won't be able to send or receive messages from this user</li>
            <li>Your conversation will be hidden from your active view</li>
            <li>You won't see each other in search results</li>
            <li>Any active requests will be cancelled</li>
            <li>Chat history will be preserved but hidden</li>
          </ul>
        </div>

        {/* Info Message */}
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            You can unblock this user later from your settings. Blocking is global and applies to all listings.
          </p>
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
            onClick={handleBlock}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Blocking...
              </>
            ) : (
              'Block User'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BlockUserModal
