import { useState } from 'react'
import { X } from 'lucide-react'
import { reportsApi, ReportReason, CreateReportRequest } from '@/services/api'

interface ReportUserModalProps {
  isOpen: boolean
  onClose: () => void
  reportedUserId: string
  reportedUserName: string
  listingId?: string
  conversationId?: string
  onSuccess?: () => void
}

const REPORT_REASONS = [
  { value: ReportReason.SPAM_SCAM, label: 'Spam / Scam' },
  { value: ReportReason.HARASSMENT, label: 'Harassment' },
  { value: ReportReason.FAKE_LISTING, label: 'Fake listing' },
  { value: ReportReason.INAPPROPRIATE_CONTENT, label: 'Inappropriate content' },
  { value: ReportReason.ASKING_MONEY_OUTSIDE, label: 'Asking for money outside platform' },
  { value: ReportReason.DISCRIMINATION, label: 'Discrimination' },
  { value: ReportReason.OTHER, label: 'Other' },
]

const ReportUserModal = ({
  isOpen,
  onClose,
  reportedUserId,
  reportedUserName,
  listingId,
  conversationId,
  onSuccess,
}: ReportUserModalProps) => {
  const [selectedReason, setSelectedReason] = useState<ReportReason | ''>('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedReason) {
      setError('Please select a reason for reporting')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const reportData: CreateReportRequest = {
        reportedUserId,
        reasonCode: selectedReason as ReportReason,
        description: description.trim() || undefined,
      }

      if (listingId) {
        reportData.listingId = listingId
      }

      if (conversationId) {
        reportData.conversationId = conversationId
      }

      await reportsApi.create(reportData)
      
      // Reset form
      setSelectedReason('')
      setDescription('')
      setError(null)
      
      // Call success callback
      if (onSuccess) {
        onSuccess()
      }
      
      // Close modal
      onClose()
    } catch (err: any) {
      console.error('Error submitting report:', err)
      setError(
        err?.response?.data?.message || 
        'Failed to submit report. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedReason('')
      setDescription('')
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
          <h2 className="text-xl font-bold text-gray-900 mb-2">Report User</h2>
          <p className="text-sm text-gray-600">
            Report <span className="font-semibold">{reportedUserName}</span> for inappropriate behavior
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Reason Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Reason for reporting <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {REPORT_REASONS.map((reason) => (
                <label
                  key={reason.value}
                  className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={(e) => setSelectedReason(e.target.value as ReportReason)}
                    disabled={isSubmitting}
                    className="w-4 h-4 text-orange-400 border-gray-300 focus:ring-orange-400 focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-gray-900">{reason.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Additional details (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              rows={4}
              placeholder="Provide any additional information that might help us understand the issue..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Info Message */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              Your report will be reviewed by our team. We take all reports seriously and will take appropriate action.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedReason}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-orange-400 rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Report'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReportUserModal
