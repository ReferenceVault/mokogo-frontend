import { useEffect } from 'react'

interface ToastProps {
  message: string
  onClose: () => void
  duration?: number
  type?: 'success' | 'error' | 'info'
}

const Toast = ({ message, onClose, duration = 5000, type = 'info' }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md transform transition-all duration-500 ease-in-out">
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes highlightPulse {
          0%, 100% {
            box-shadow: 0 10px 25px -5px rgba(34, 197, 94, 0.3), 0 0 0 0 rgba(34, 197, 94, 0.4);
          }
          50% {
            box-shadow: 0 10px 25px -5px rgba(34, 197, 94, 0.5), 0 0 0 8px rgba(34, 197, 94, 0);
          }
        }
      `}</style>
      <div
        className={`rounded-xl border-2 px-4 py-3 text-sm shadow-xl flex items-center gap-2
          ${
            type === 'success'
              ? 'border-green-400 bg-gradient-to-r from-green-50 to-green-100 text-green-800 shadow-green-200/50'
              : type === 'error'
              ? 'border-red-300 bg-red-50 text-red-700 shadow-red-200/50'
              : 'border-orange-300 bg-orange-50 text-orange-700 shadow-orange-200/50'
          }`}
        style={{
          animation:
            type === 'success'
              ? 'slideInRight 0.5s ease-out, highlightPulse 2s ease-in-out infinite'
              : 'slideInRight 0.5s ease-out',
        }}
      >
        {type === 'success' && (
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center animate-pulse">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        <span className="flex-1">{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default Toast
