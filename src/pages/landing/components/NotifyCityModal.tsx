import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface NotifyCityModalProps {
  isOpen: boolean
  cityName: string
  email: string
  notifyError: string | null
  notifySuccess: string | null
  isSubmitting: boolean
  onClose: () => void
  onEmailChange: (value: string) => void
  onSubmit: () => void
}

const NotifyCityModal = ({
  isOpen,
  cityName,
  email,
  notifyError,
  notifySuccess,
  isSubmitting,
  onClose,
  onEmailChange,
  onSubmit,
}: NotifyCityModalProps) => {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Notify me when {cityName} goes live</h3>
            <p className="mt-2 text-sm text-gray-600">
              Drop your email and we’ll send you launch updates for this city.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close notify me modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {notifySuccess && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              {notifySuccess}
            </div>
          )}
          {notifyError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {notifyError}
            </div>
          )}
          <input
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : 'Notify Me'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default NotifyCityModal
