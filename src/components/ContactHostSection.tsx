import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MessageCircle, Clock, CheckCircle2 } from 'lucide-react'
import { MoveInDateField } from './MoveInDateField'
import { Listing } from '@/types'
import { formatPrice } from '@/utils/formatters'
import { isProfileComplete } from '@/utils/profileValidation'
import { requestsApi } from '@/services/api'

interface ContactHostSectionProps {
  listing: Listing
  user?: any
  isOwner?: boolean
  requestStatus?: {
    status: 'pending' | 'approved' | 'rejected' | null
    requestId?: string
  }
  loadingRequestStatus?: boolean
  conversationId?: string | null
  onRequestSent?: () => void
  onRequestStatusUpdate?: (status: { status: 'pending' | 'approved' | 'rejected' | null; requestId?: string }) => void
  onError?: (error: string) => void
  className?: string
}

const ContactHostSection = ({
  listing,
  user,
  isOwner = false,
  requestStatus = { status: null },
  loadingRequestStatus = false,
  conversationId = null,
  onRequestSent,
  onRequestStatusUpdate,
  onError,
  className = '',
}: ContactHostSectionProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [moveInDate, setMoveInDate] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [messageError, setMessageError] = useState<string | null>(null)
  const contactCardRef = useRef<HTMLDivElement | null>(null)
  const contactButtonRef = useRef<HTMLButtonElement | null>(null)

  // Handle focus parameter for scrolling to contact section
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('focus') === 'contact') {
      setTimeout(() => {
        contactCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        contactButtonRef.current?.focus()
      }, 100)
    }
  }, [location.search, listing?.id])

  const containerClass = 'bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/35 p-4 sm:p-5'
  const priceClass = 'text-xl font-bold mb-1'
  const priceSubtextClass = 'text-sm text-gray-600'
  const buttonClass = 'w-full min-h-[44px] bg-orange-400 text-white font-semibold py-2.5 rounded-lg hover:bg-orange-500 hover:shadow-lg transition-all transform sm:hover:scale-105 mb-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center'
  const textClass = 'text-xs'
  const inputClass = 'p-2'
  const borderClass = 'border border-stone-300 rounded-lg'

  const handleStartConversation = () => {
    if (conversationId) {
      navigate(`/dashboard?view=messages&conversation=${conversationId}`)
    } else if (requestStatus.status === 'approved') {
      navigate('/dashboard?view=messages')
    } else {
      navigate('/dashboard?view=messages')
    }
  }

  const handleContactHost = async () => {
    // Check if user is logged in
    if (!user) {
      if (listing.id) {
        sessionStorage.setItem(
          'mokogo-auth-redirect',
          JSON.stringify({ path: '/dashboard', listingId: listing.id, focus: 'contact' })
        )
      }
      navigate(`/auth?redirect=/dashboard&listing=${listing.id}&focus=contact`)
      return
    }

    // Check if profile is complete
    if (!isProfileComplete(user)) {
      // This should be handled by parent component
      if (onError) {
        onError('Please complete your profile first')
      }
      return
    }

    if (!listing) return

    // Validate message is required
    if (!message || message.trim() === '') {
      setMessageError('Message is required')
      return
    }

    setMessageError(null)
    setIsSubmitting(true)
    try {
      const newRequest = await requestsApi.create({
        listingId: listing.id,
        message: message.trim(),
        moveInDate: moveInDate || undefined,
      })

      // Update request status
      const updatedStatus = {
        status: 'pending' as const,
        requestId: newRequest._id || newRequest.id
      }
      if (onRequestStatusUpdate) {
        onRequestStatusUpdate(updatedStatus)
      }

      // Clear form
      setMessage('')
      setMoveInDate('')

      // Show success
      if (onRequestSent) {
        onRequestSent()
      }
    } catch (error: any) {
      console.error('Error sending request:', error)
      const errorMessage = error.response?.data?.message || 'Failed to send request. Please try again.'
      
      // If error is about existing request, try to refresh status
      if (errorMessage.includes('already') || errorMessage.includes('pending') || errorMessage.includes('approved')) {
        try {
          const request = await requestsApi.getStatusByListing(listing.id)
          if (request && onRequestStatusUpdate) {
            const status = request.status === 'approved' 
              ? 'approved' 
              : request.status === 'rejected'
              ? 'rejected'
              : 'pending'
            onRequestStatusUpdate({
              status,
              requestId: request._id || request.id
            })
          }
        } catch (refreshError) {
          console.error('Error refreshing request status:', refreshError)
        }
      }
      
      if (onError) {
        onError(errorMessage)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Don't show contact section for owners
  if (isOwner) {
    return null
  }

  // Don't show if listing is fulfilled
  if (listing.status === 'fulfilled') {
    return (
      <div ref={contactCardRef} className={`${containerClass} ${className}`}>
        <div className="text-center py-6">
          <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            This Property is Fulfilled
          </h3>
          <p className="text-xs text-gray-600">
            This listing is no longer available on the market.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div ref={contactCardRef} className={`${containerClass} ${className}`}>
      <div className="text-center mb-4">
        <div className={priceClass}>₹{formatPrice(listing.rent)}</div>
        <div className={priceSubtextClass}>per month</div>
      </div>

      <div className="space-y-3 mb-4">
        <div className={`${borderClass} ${inputClass}`}>
          <div className={`${textClass} font-semibold text-gray-700 uppercase mb-1`}>Move-in Date</div>
          <div className="[&_button]:!h-auto [&_button]:!py-0 [&_button]:!px-0 [&_button]:!border-0 [&_button]:!bg-transparent [&_button]:!shadow-none [&_button]:!min-w-0 [&_button]:!w-full [&_button]:text-xs">
            <MoveInDateField
              value={moveInDate}
              onChange={(date) => setMoveInDate(date)}
              min={new Date().toISOString().split('T')[0]}
              hideLabel={true}
              numberOfMonths={1}
            />
          </div>
        </div>

        <div className={`${borderClass} ${inputClass}`}>
          <div className={`${textClass} font-semibold text-gray-700 uppercase mb-1.5`}>
            Your Message
          </div>
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              if (messageError && e.target.value.trim() !== '') {
                setMessageError(null)
              }
            }}
            className={`w-full border-0 p-0 ${textClass} focus:ring-0 resize-none bg-transparent ${
              messageError ? 'text-red-600' : ''
            }`}
            rows={3}
            placeholder="Tell the host about yourself..."
            required
          />
          {messageError && (
            <p className={`${textClass} text-red-500 mt-1`}>{messageError}</p>
          )}
        </div>
      </div>

      {/* Contact Host Button - Single button that changes based on request status */}
      {loadingRequestStatus ? (
        <button
          disabled
          className={`w-full min-h-[44px] bg-gray-200 text-gray-500 font-semibold py-2.5 rounded-lg cursor-not-allowed mb-3 flex items-center justify-center ${textClass}`}
        >
          <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
          Loading...
        </button>
      ) : requestStatus.status === 'pending' ? (
        <button
          disabled
          className={`w-full min-h-[44px] bg-gray-300 text-gray-600 font-semibold py-2.5 rounded-lg cursor-not-allowed mb-3 flex items-center justify-center ${textClass}`}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          Request Sent
        </button>
      ) : requestStatus.status === 'approved' ? (
        <button
          onClick={handleStartConversation}
          className="w-full min-h-[44px] bg-green-500 text-white font-semibold py-2.5 rounded-lg hover:bg-green-600 hover:shadow-lg transition-all transform sm:hover:scale-105 mb-3 flex items-center justify-center"
        >
          <MessageCircle className="w-4 h-4 inline mr-2" />
          Start Conversation
        </button>
      ) : (
        <>
          <button
            ref={contactButtonRef}
            onClick={handleContactHost}
            disabled={isSubmitting || listing.status === ('fulfilled' as Listing['status'])}
            className={buttonClass}
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Contact Host
              </>
            )}
          </button>

          <div className={`text-center ${textClass} text-gray-600 mb-3`}>
            You won't be charged yet
          </div>
        </>
      )}

      <div className="border-t border-stone-200 pt-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className={`${textClass} text-gray-700`}>Monthly rent</span>
          <span className={`${textClass} text-gray-900`}>₹{formatPrice(listing.rent)}</span>
        </div>
        <div className="flex justify-between items-center mb-1.5">
          <span className={`${textClass} text-gray-700`}>Security deposit</span>
          <span className={`${textClass} text-gray-900`}>₹{formatPrice(listing.deposit)}</span>
        </div>
        <div className="border-t border-stone-200 pt-1.5 mt-1.5">
          <div className="flex justify-between items-center font-bold">
            <span className="text-sm text-gray-900">Total upfront</span>
            <span className="text-sm text-gray-900">
              ₹{formatPrice(listing.rent + listing.deposit)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactHostSection
