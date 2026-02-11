import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { Listing } from '@/types'
import ProfileCompletionModal from '@/components/ProfileCompletionModal'
import Toast from '@/components/Toast'
import ListingHeading from '@/components/ListingHeading'
import ListingPhotos from '@/components/ListingPhotos'
import RoomDetails from '@/components/RoomDetails'
import AmenitiesSection from '@/components/AmenitiesSection'
import MeetYourHost from '@/components/MeetYourHost'
import ContactHostSection from '@/components/ContactHostSection'
import { formatPrice, formatDate } from '@/utils/formatters'
import { isProfileComplete } from '@/utils/profileValidation'
import { listingsApi, requestsApi, usersApi, messagesApi } from '@/services/api'

import {
  MapPin,
  ChevronRight,
  Home,
  Search,
  Heart,
} from 'lucide-react'

interface ListingDetailContentProps {
  listingId: string
  onBack?: () => void
  onExplore?: () => void
}

const ListingDetailContent = ({ listingId, onBack, onExplore }: ListingDetailContentProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { allListings, user, currentListing, setAllListings, toggleSavedListing, isListingSaved, savedListings, setSavedListings } = useStore()
  const [isSaved, setIsSaved] = useState(false)
  const [listing, setListing] = useState<Listing | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showProfileModal, setShowProfileModal] = useState(false)
  // Request status state - fetched from API
  const [requestStatus, setRequestStatus] = useState<{
    status: 'pending' | 'approved' | 'rejected' | null
    requestId?: string
  }>({ status: null })
  const [loadingRequestStatus, setLoadingRequestStatus] = useState(true)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [listingOwner, setListingOwner] = useState<any>(null)
  
  // Check if current user is the owner of this listing
  // If listing is in allListings, it means it's the user's own listing
  // (allListings only contains user's own listings from getAll API)
  const isOwner = !!user && allListings.some(l => l.id === listingId)
  
  // Get host information - use listing owner if available, otherwise fallback to current user
  const hostInfo = listingOwner || (user as any)
  const hostAbout =
    hostInfo?.about?.trim() ||
    `Hi! I'm ${hostInfo?.name || 'a professional'} working in ${listing?.city || 'this city'}. I love meeting new people and creating a comfortable, friendly environment for my flatmates. I'm clean, organized, and respect personal space while being approachable for any questions or concerns.`

  const foundListing = allListings.find(l => l.id === listingId)

  useEffect(() => {
    const loadListing = async () => {
      if (!listingId) {
        console.warn('ListingDetailContent: No listingId provided')
        setListing(null)
        setIsLoading(false)
        return
      }

      console.log('ListingDetailContent: Loading listing', listingId)

      // First check if it's in allListings (user's own listings)
      if (foundListing) {
        console.log('ListingDetailContent: Found in allListings')
        setListing(foundListing)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        // Try to get listing directly by ID (works for both logged in and not logged in)
        // The backend endpoint is public, so we can use getByIdPublic
        let response: any = null
        let errorOccurred = false
        
        try {
          // Try public endpoint first (works without auth)
          response = await listingsApi.getByIdPublic(listingId)
        } catch (publicError: any) {
          console.log('Public endpoint failed, trying authenticated endpoint...', publicError?.response?.status)
          // If public fails and user is logged in, try authenticated endpoint
          if (user) {
            try {
              response = await listingsApi.getById(listingId)
            } catch (authError: any) {
              console.error('Both public and authenticated endpoints failed:', {
                publicError: publicError?.response?.status,
                authError: authError?.response?.status,
                message: authError?.message
              })
              errorOccurred = true
            }
          } else {
            console.error('Public endpoint failed and user is not logged in:', publicError?.response?.status)
            errorOccurred = true
          }
        }

        if (response && !errorOccurred) {
          const mappedListing: Listing = {
            id: response._id || response.id,
            title: response.title,
            city: response.city || '',
            locality: response.locality || '',
            societyName: response.societyName,
            bhkType: response.bhkType || '',
            roomType: response.roomType || '',
            rent: response.rent || 0,
            deposit: response.deposit || 0,
            moveInDate: response.moveInDate || '',
            furnishingLevel: response.furnishingLevel || '',
            bathroomType: response.bathroomType,
            flatAmenities: response.flatAmenities || [],
            societyAmenities: response.societyAmenities || [],
            preferredGender: response.preferredGender || '',
            foodPreference: response.foodPreference,
            petPolicy: response.petPolicy,
            smokingPolicy: response.smokingPolicy,
            drinkingPolicy: response.drinkingPolicy,
            description: response.description,
            photos: response.photos || [],
            status: response.status,
            createdAt: response.createdAt,
            updatedAt: response.updatedAt,
            mikoTags: response.mikoTags,
            lgbtqFriendly: (response as any).lgbtqFriendly,
          }
          setListing(mappedListing)
          
          // Fetch owner profile if we have ownerId and it's not the current user
          const ownerId = response.ownerId
          if (ownerId && (!user || ownerId !== user.id)) {
            try {
              const ownerProfile = await usersApi.getUserById(ownerId)
              setListingOwner(ownerProfile)
            } catch (error) {
              console.error('Error fetching listing owner profile:', error)
              // If fetch fails, owner might not exist or we don't have permission
              setListingOwner(null)
            }
          } else if (ownerId && user && ownerId === user.id) {
            // If owner is current user, use current user's profile
            setListingOwner(user as any)
          }
          
          setIsLoading(false)
          return
        }

        try {
          const publicListings = await listingsApi.getAllPublic('live')
          const found = publicListings.find(l => (l._id || l.id) === listingId)
          if (found) {
            const mappedListing: Listing = {
              id: found._id || found.id,
              title: found.title,
              city: found.city || '',
              locality: found.locality || '',
              societyName: found.societyName,
              bhkType: found.bhkType || '',
              roomType: found.roomType || '',
              rent: found.rent || 0,
              deposit: found.deposit || 0,
              moveInDate: found.moveInDate || '',
              furnishingLevel: found.furnishingLevel || '',
              bathroomType: found.bathroomType,
              flatAmenities: found.flatAmenities || [],
              societyAmenities: found.societyAmenities || [],
              preferredGender: found.preferredGender || '',
              description: found.description,
              photos: found.photos || [],
              status: found.status,
              createdAt: found.createdAt,
              updatedAt: found.updatedAt,
              mikoTags: found.mikoTags,
              lgbtqFriendly: (found as any).lgbtqFriendly,
            }
            setListing(mappedListing)

            const ownerId = (found as any).ownerId
            if (ownerId && (!user || ownerId !== user.id)) {
              try {
                const ownerProfile = await usersApi.getUserById(ownerId)
                setListingOwner(ownerProfile)
              } catch (error) {
                console.error('Error fetching listing owner profile:', error)
                setListingOwner(null)
              }
            } else if (ownerId && user && ownerId === user.id) {
              setListingOwner(user as any)
            }

            setIsLoading(false)
            return
          }
        } catch (fallbackError) {
          console.error('Error fetching listing from public listings:', fallbackError)
        }

        // If we get here, listing was not found
        console.warn('Listing not found:', listingId)
        setListing(null)
      } catch (error: any) {
        console.error('Unexpected error loading listing detail:', error)
        setListing(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadListing()
  }, [listingId, foundListing, user])

  useEffect(() => {
    if (listingId) {
      setIsSaved(isListingSaved(listingId))
    }
  }, [listingId, savedListings, isListingSaved])


  // Check if conversation exists for this listing (only if request is approved)
  // Use a ref to prevent duplicate calls and cache results
  const conversationCheckRef = useRef<{ key: string; timestamp: number } | null>(null)
  const CONVERSATION_CACHE_TTL = 30000 // 30 seconds cache

  // Fetch request status on mount and when listingId/user changes (only for logged in users)
  useEffect(() => {
    const fetchRequestStatus = async () => {
      if (!user || !listingId) {
        setRequestStatus({ status: null })
        setLoadingRequestStatus(false)
        return
      }

      setLoadingRequestStatus(true)
      try {
        const request = await requestsApi.getStatusByListing(listingId)
        if (request) {
          const status = request.status === 'approved' 
            ? 'approved' 
            : request.status === 'rejected'
            ? 'rejected'
            : 'pending'
          setRequestStatus({
            status,
            requestId: request._id || request.id
          })
        } else {
          setRequestStatus({ status: null })
        }
      } catch (error) {
        // Silently fail - user might not have made a request yet
        setRequestStatus({ status: null })
      } finally {
        setLoadingRequestStatus(false)
      }
    }

    fetchRequestStatus()
  }, [user, listingId])
  
  useEffect(() => {
    const checkConversation = async () => {
      if (!user || !listingId || requestStatus.status !== 'approved') {
        setConversationId(null)
        return
      }

      // Check cache - prevent duplicate calls within TTL
      const cacheKey = `${listingId}-${requestStatus.status}`
      const now = Date.now()
      if (conversationCheckRef.current?.key === cacheKey && 
          (now - conversationCheckRef.current.timestamp) < CONVERSATION_CACHE_TTL) {
        return
      }

      conversationCheckRef.current = { key: cacheKey, timestamp: now }

      try {
        const conversations = await messagesApi.getAllConversations()
        const conversation = conversations.find(conv => {
          const convListingId = typeof conv.listingId === 'object' 
            ? (conv.listingId as any)._id || (conv.listingId as any).id 
            : conv.listingId
          return convListingId === listingId
        })
        setConversationId(conversation ? (conversation._id || conversation.id) : null)
      } catch (error: any) {
        // Handle 429 (Too Many Requests) gracefully - don't retry immediately
        if (error.response?.status === 429) {
          console.warn('Rate limited on conversation check, will retry later')
          // Keep existing conversationId or null, don't update
          // Extend cache to prevent immediate retry
          if (conversationCheckRef.current) {
            conversationCheckRef.current.timestamp = now + 60000 // Extend by 1 minute
          }
        } else {
          console.error('Error checking conversation:', error)
          setConversationId(null)
        }
      }
    }

    // Only check if status is approved, with debounce
    if (requestStatus.status === 'approved') {
      const timeoutId = setTimeout(() => {
        checkConversation()
      }, 500) // Increased debounce to 500ms

      return () => clearTimeout(timeoutId)
    } else {
      setConversationId(null)
    }
  }, [user, listingId, requestStatus.status])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-600">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading listing...</p>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Listing not found</h1>
          <p className="text-gray-600 mb-4">The listing you're looking for doesn't exist or is no longer available.</p>
          {onBack && (
            <button onClick={onBack} className="text-orange-400 hover:text-orange-500">
              Back to Dashboard
            </button>
          )}
        </div>
      </div>
    )
  }

  // Handle navigation to messages
  // If request is approved, conversation should exist (created by backend)
  // Navigate to messages - user can find the conversation there
  const handleStartConversation = () => {
    // If we have conversationId, navigate directly to it
    if (conversationId) {
      navigate(`/dashboard?view=messages&conversation=${conversationId}`)
    } else if (requestStatus.status === 'approved') {
      // Request is approved, conversation should exist - navigate to messages
      // MessagesContent will load conversations and user can find theirs
      navigate('/dashboard?view=messages')
    } else {
      // Fallback
      navigate('/dashboard?view=messages')
    }
  }


  const handleSave = () => {
    if (!listingId) return
    const willSave = !isListingSaved(listingId)
    const request = willSave
      ? usersApi.saveListing(listingId)
      : usersApi.removeSavedListing(listingId)
    request
      .then((updated) => {
        setSavedListings(updated)
        setIsSaved(updated.includes(listingId))
      })
      .catch(() => {
        toggleSavedListing(listingId)
        setIsSaved(!isSaved)
      })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing?.title,
        text: listing?.description,
        url: window.location.href,
      }).catch(() => {
        // User cancelled or error occurred
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleContactHostSuccess = () => {
    setShowSuccessToast(true)
  }

  const handleContactHostStatusUpdate = (status: { status: 'pending' | 'approved' | 'rejected' | null; requestId?: string }) => {
    setRequestStatus(status)
  }

  const handleContactHostError = (errorMessage: string) => {
    if (errorMessage.includes('profile') || errorMessage.includes('complete')) {
      setShowProfileModal(true)
    }
  }

  const handleMarkAsFulfilled = () => {
    if (listing) {
      const updatedListing = { ...listing, status: 'fulfilled' as const, updatedAt: new Date().toISOString() }
      const updatedListings = allListings.map(l => l.id === listing.id ? updatedListing : l)
      setAllListings(updatedListings)
      // Also update currentListing if it matches
      if (currentListing?.id === listing.id) {
        // We'd need setCurrentListing here, but it's not in the destructured values
        // The listing will be updated in allListings which should be sufficient
      }
    }
  }


  const similarListings = allListings
    .filter(l => l.id !== listingId && l.city === listing.city)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Breadcrumb Navigation */}
      <section className="py-4 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <nav className="flex items-center space-x-2 text-sm">
              {onBack ? (
                <button onClick={onBack} className="text-orange-400 hover:text-orange-500">Dashboard</button>
              ) : (
                <Link to="/dashboard" className="text-orange-400 hover:text-orange-500">Dashboard</Link>
              )}
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-orange-400">{listing.city}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{listing.title}</span>
            </nav>
            <button
              onClick={() => {
                if (onExplore) {
                  onExplore()
                } else if (onBack) {
                  onBack()
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg text-sm font-semibold hover:bg-orange-100 transition-all duration-300 border border-orange-200 hover:border-orange-300"
            >
              <Search className="w-4 h-4" />
              Browse More Properties
            </button>
          </div>
        </div>
      </section>

      {/* Listing Header Section */}
      <ListingHeading
        listing={listing}
        isSaved={isSaved}
        isOwner={isOwner}
        onSave={handleSave}
        onShare={handleShare}
        onMarkAsFulfilled={handleMarkAsFulfilled}
        showVerified={false}
        showActions={true}
      />

      {/* Photo Gallery Section */}
      <ListingPhotos 
        listing={listing} 
        className="py-4"
        mainImageHeight="h-[300px] lg:h-[350px]"
        thumbnailHeight="h-[90px] lg:h-[110px]"
      />

      {/* Main Content Section */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`grid grid-cols-1 gap-6 ${!isOwner ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
            
            {/* Left Content */}
            <div className={`space-y-4 ${!isOwner ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
              
              {/* Room Details */}
              <RoomDetails listing={listing} compact={true} />

              {/* Amenities Section */}
              <AmenitiesSection listing={listing} compact={true} />

              {/* Host Information Section */}
              <MeetYourHost listing={listing} hostInfo={hostInfo} compact={true} />
              
            </div>
            
            {/* Right Sidebar - Only show for non-owners */}
            {!isOwner && (
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <ContactHostSection
                  listing={listing}
                  user={user}
                  isOwner={isOwner}
                  requestStatus={requestStatus}
                  loadingRequestStatus={loadingRequestStatus}
                  conversationId={conversationId}
                  onRequestSent={handleContactHostSuccess}
                  onRequestStatusUpdate={handleContactHostStatusUpdate}
                  onError={handleContactHostError}
                  compact={true}
                />
              </div>
            </div>
            )}
            
          </div>
        </div>
      </section>

      {/* Similar Listings Section */}
      {similarListings.length > 0 && (
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Similar Rooms in {listing.city}</h2>
              <Link to="/explore" className="text-sm text-orange-400 hover:text-orange-500 font-semibold">View All</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarListings.map((similar) => (
                <Link 
                  key={similar.id}
                  to={`/dashboard?listing=${similar.id}`}
                  className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-white/35"
                >
                  <div className="relative">
                    {similar.photos && similar.photos.length > 0 ? (
                      <img 
                        className="w-full h-36 object-cover rounded-t-xl" 
                        src={similar.photos[0]} 
                        alt={similar.title} 
                      />
                    ) : (
                      <div className="w-full h-36 bg-gray-200 rounded-t-xl flex items-center justify-center">
                        <Home className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <button 
                      onClick={(e) => {
                        e.preventDefault()
                        const willSave = !isListingSaved(similar.id)
                        const request = willSave
                          ? usersApi.saveListing(similar.id)
                          : usersApi.removeSavedListing(similar.id)
                        request
                          .then((updated) => {
                            setSavedListings(updated)
                          })
                          .catch(() => {
                            toggleSavedListing(similar.id)
                          })
                      }}
                      className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full hover:bg-white transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${isListingSaved(similar.id) ? 'text-red-500 fill-red-500' : 'text-gray-700'}`} />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-900">{similar.title}</h3>
                      <div className="text-right">
                        <div className="text-base font-bold text-gray-900">₹{formatPrice(similar.rent)}</div>
                        <div className="text-xs text-gray-500">/month</div>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 text-orange-400" />
                      <span className="text-xs">{similar.locality}, {similar.city}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded text-xs font-medium">
                        {similar.preferredGender || 'Any'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ProfileCompletionModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
        action="contact"
      />
      {showSuccessToast && (
        <Toast 
          message="Request sent successfully! The host will review your request." 
          onClose={() => {
            setShowSuccessToast(false)
            if (onBack) {
              onBack()
            }
          }}
          type="success"
          duration={5000}
        />
      )}
    </div>
  )
}

export default ListingDetailContent

