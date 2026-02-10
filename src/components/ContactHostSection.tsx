import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MessageCircle, Clock, Shield, CheckCircle, CheckCircle2 } from 'lucide-react'
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
  compact?: boolean
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
  compact = false,
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

  const containerClass = compact
    ? 'bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/35 p-4'
    : 'bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/35 p-6'
  
  const priceClass = compact ? 'text-xl font-bold mb-1' : 'text-3xl font-bold mb-1'
  const priceSubtextClass = compact ? 'text-sm text-gray-600' : 'text-gray-600'
  const buttonClass = compact
    ? 'w-full bg-orange-400 text-white font-semibold py-2.5 rounded-lg hover:bg-orange-500 hover:shadow-lg transition-all transform hover:scale-105 mb-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm'
    : 'w-full bg-orange-400 text-white font-bold py-4 rounded-xl hover:bg-orange-500 hover:shadow-lg transition-all transform hover:scale-105 mb-4 disabled:opacity-50 disabled:cursor-not-allowed'
  const textClass = compact ? 'text-xs' : 'text-sm'
  const inputClass = compact ? 'p-2' : 'p-3'
  const borderClass = compact ? 'border border-stone-300 rounded-lg' : 'border border-stone-300 rounded-lg'

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
          <CheckCircle2 className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} text-green-500 mx-auto mb-3`} />
          <h3 className={`${compact ? 'text-base' : 'text-lg'} font-semibold text-gray-900 mb-2`}>
            This Property is Fulfilled
          </h3>
          <p className={`${compact ? 'text-xs' : 'text-sm'} text-gray-600`}>
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
        {!compact && <div className="text-sm text-gray-500 mt-1">+ ₹500 maintenance</div>}
      </div>

      <div className={`space-y-${compact ? '3' : '4'} mb-4`}>
        <div className="grid grid-cols-2 gap-4">
          <div className={`${borderClass} ${inputClass}`}>
            <div className={`${textClass} font-semibold text-gray-700 uppercase mb-1`}>Move-in Date</div>
            {compact ? (
              <div className="[&_button]:!h-auto [&_button]:!py-0 [&_button]:!px-0 [&_button]:!border-0 [&_button]:!bg-transparent [&_button]:!shadow-none [&_button]:!min-w-0 [&_button]:!w-full [&_button]:text-xs">
                <MoveInDateField
                  value={moveInDate}
                  onChange={(date) => setMoveInDate(date)}
                  min={new Date().toISOString().split('T')[0]}
                  hideLabel={true}
                  numberOfMonths={1}
                />
              </div>
            ) : (
              <input
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border-0 p-0 text-sm focus:ring-0 bg-transparent"
              />
            )}
          </div>
          {!compact && (
            <div className={`${borderClass} ${inputClass}`}>
              <div className={`${textClass} font-semibold text-gray-700 uppercase mb-1`}>Duration</div>
              <select
                className="w-full border-0 p-0 text-sm focus:ring-0 bg-transparent"
                defaultValue="6 months"
              >
                <option>6 months</option>
                <option>12 months</option>
                <option>Flexible</option>
              </select>
            </div>
          )}
        </div>

        <div className={`${borderClass} ${inputClass}`}>
          <div className={`${textClass} font-semibold text-gray-700 uppercase ${compact ? 'mb-1.5' : 'mb-2'}`}>
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
          className={`w-full bg-gray-200 text-gray-500 font-${compact ? 'semibold' : 'bold'} ${
            compact ? 'py-2.5 rounded-lg' : 'py-4 rounded-xl'
          } cursor-not-allowed mb-${compact ? '3' : '4'} ${textClass}`}
        >
          <div
            className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} border-2 border-gray-400 border-t-transparent rounded-full animate-spin inline-block mr-2`}
          ></div>
          Loading...
        </button>
      ) : requestStatus.status === 'pending' ? (
        <button
          disabled
          className={`w-full bg-gray-300 text-gray-600 font-${compact ? 'semibold' : 'bold'} ${
            compact ? 'py-2.5 rounded-lg' : 'py-4 rounded-xl'
          } cursor-not-allowed mb-${compact ? '3' : '4'} ${textClass}`}
        >
          <Clock className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} inline mr-2`} />
          Request Sent
        </button>
      ) : requestStatus.status === 'approved' ? (
        <button
          onClick={handleStartConversation}
          className={`w-full bg-green-500 text-white font-${compact ? 'semibold' : 'bold'} ${
            compact ? 'py-2.5 rounded-lg' : 'py-4 rounded-xl'
          } hover:bg-green-600 hover:shadow-lg transition-all transform hover:scale-105 mb-${compact ? '3' : '4'}`}
        >
          <MessageCircle className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} inline mr-2`} />
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
                <div
                  className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2`}
                ></div>
                Sending...
              </>
            ) : (
              <>
                <MessageCircle className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} inline mr-2`} />
                Contact Host
              </>
            )}
          </button>

          <div className={`text-center ${textClass} text-gray-600 mb-${compact ? '3' : '4'}`}>
            You won't be charged yet
          </div>
        </>
      )}

      <div className={`border-t border-stone-200 pt-${compact ? '3' : '4'}`}>
        <div className={`flex justify-between items-center mb-${compact ? '1.5' : '2'}`}>
          <span className={`${textClass} text-gray-700`}>Monthly rent</span>
          <span className={`${textClass} text-gray-900`}>₹{formatPrice(listing.rent)}</span>
        </div>
        {!compact && (
          <div className={`flex justify-between items-center mb-${compact ? '1.5' : '2'}`}>
            <span className={`${textClass} text-gray-700`}>Maintenance</span>
            <span className={`${textClass} text-gray-900`}>₹500</span>
          </div>
        )}
        <div className={`flex justify-between items-center mb-${compact ? '1.5' : '2'}`}>
          <span className={`${textClass} text-gray-700`}>Security deposit</span>
          <span className={`${textClass} text-gray-900`}>₹{formatPrice(listing.deposit)}</span>
        </div>
        <div className={`border-t border-stone-200 pt-${compact ? '1.5' : '2'} mt-${compact ? '1.5' : '2'}`}>
          <div className="flex justify-between items-center font-bold">
            <span className={`${compact ? 'text-sm' : 'text-base'} text-gray-900`}>Total upfront</span>
            <span className={`${compact ? 'text-sm' : 'text-base'} text-gray-900`}>
              ₹{formatPrice(listing.rent + (compact ? 0 : 500) + listing.deposit)}
            </span>
          </div>
        </div>
      </div>

      {/* Safety Tips */}
      {!compact && (
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 mt-6">
          <div className="flex items-center mb-4">
            <Shield className="w-6 h-6 text-orange-400 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Safety First</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
              <span>Always meet in person before committing</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
              <span>Verify host identity and documents</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
              <span>Never transfer money without visiting</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
              <span>Use MOKOGO messaging for initial contact</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactHostSection
