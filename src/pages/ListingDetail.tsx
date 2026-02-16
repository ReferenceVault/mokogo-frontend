import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Logo from '@/components/Logo'
import UserAvatar from '@/components/UserAvatar'
import ProfileCompletionModal from '@/components/ProfileCompletionModal'
import Toast from '@/components/Toast'
import ListingHeading from '@/components/ListingHeading'
import ListingPhotos from '@/components/ListingPhotos'
import RoomDetails from '@/components/RoomDetails'
import AmenitiesSection from '@/components/AmenitiesSection'
import MeetYourHost from '@/components/MeetYourHost'
import ContactHostSection from '@/components/ContactHostSection'
import { useStore } from '@/store/useStore'

import { formatPrice, formatRent } from '@/utils/formatters'
import { handleLogout as handleLogoutUtil } from '@/utils/auth'
import { requestsApi, listingsApi, messagesApi, usersApi, UserProfile } from '@/services/api'
import { Listing } from '@/types'
import { getListingBadgeLabel } from '@/utils/listingTags'

import {
  ChevronDown,
  ChevronRight,
  Bell,
  Heart,
  Heart as HeartIcon
} from 'lucide-react'

const ListingDetail = () => {
  const { listingId } = useParams()
  const navigate = useNavigate()
  const { allListings, user, setUser, toggleSavedListing, isListingSaved, savedListings, setSavedListings } = useStore()
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [listing, setListing] = useState<Listing | null>(null)
  const [isListingLoading, setIsListingLoading] = useState(true)
  const [listingOwner, setListingOwner] = useState<UserProfile | null>(null)

  // Keep listing detail public regardless of auth state
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Don't auto-redirect - let users access /listings/:id directly
  // If they want dashboard view, they can navigate there manually

  // Fetch listing - try public listings first (works for both logged in and not logged in)
  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) {
        setLoading(false)
        setIsListingLoading(false)
        return
      }

      // First check if it's in allListings (user's own listings)
      const foundInStore = allListings.find(l => l.id === listingId)
      if (foundInStore) {
        setListing(foundInStore)
        setLoading(false)
        setIsListingLoading(false)
        
        // Try to get ownerId from API for ownership check and fetch owner profile
        try {
          const listingDetail = user
            ? await listingsApi.getById(listingId).catch(() => null)
            : await listingsApi.getByIdPublic(listingId).catch(() => null)
          if (listingDetail) {
            const ownerId = listingDetail.ownerId
            setListingOwnerId(ownerId)
            // Fetch owner profile
            if (ownerId && user && ownerId !== user.id) {
              try {
                const ownerProfile = await usersApi.getUserById(ownerId)
                setListingOwner(ownerProfile)
              } catch (error) {
                console.error('Error fetching listing owner profile:', error)
              }
            } else if (ownerId && user && ownerId === user.id) {
              setListingOwner(user as any)
            }
          } else {
            // Fallback to public listings
            try {
              const publicListings = await listingsApi.getAllPublic('live')
              const found = publicListings.find(l => (l._id || l.id) === listingId)
              if (found) {
                const ownerId = (found as any).ownerId || null
                setListingOwnerId(ownerId)
                // Fetch owner profile if we have ownerId
                if (ownerId && user && ownerId !== user.id) {
                  try {
                    const ownerProfile = await usersApi.getUserById(ownerId)
                    setListingOwner(ownerProfile)
                  } catch (error) {
                    console.error('Error fetching listing owner profile:', error)
                  }
                } else if (ownerId && user && ownerId === user.id) {
                  setListingOwner(user as any)
                }
              }
            } catch (publicError) {
              console.error('Error fetching public listing:', publicError)
            }
          }
        } catch (error) {
          // If getById fails, try public listings
          try {
            const publicListings = await listingsApi.getAllPublic('live')
            const found = publicListings.find(l => (l._id || l.id) === listingId)
            if (found) {
              const ownerId = (found as any).ownerId || null
              setListingOwnerId(ownerId)
              // Fetch owner profile if we have ownerId
              if (ownerId && user && ownerId !== user.id) {
                try {
                  const ownerProfile = await usersApi.getUserById(ownerId)
                  setListingOwner(ownerProfile)
                } catch (error) {
                  console.error('Error fetching listing owner profile:', error)
                }
              } else if (ownerId && user && ownerId === user.id) {
                setListingOwner(user as any)
              }
            }
          } catch (publicError) {
            console.error('Error fetching public listing:', publicError)
          }
        }
        return
      }

      // Try to get listing directly by ID (works for both logged in and not logged in)
      try {
        setLoading(true)
        setIsListingLoading(true)
        
        let response: any
        try {
          // Try public endpoint first (works without auth)
          response = await listingsApi.getByIdPublic(listingId)
        } catch (publicError: any) {
          // If public fails and user is logged in, try authenticated endpoint
          if (user) {
            try {
              response = await listingsApi.getById(listingId)
            } catch (authError) {
              console.error('Error fetching listing:', authError)
              throw publicError // Use the original error
            }
          } else {
            throw publicError
          }
        }

        if (response) {
          // Map API response to frontend format
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
          }
          setListing(mappedListing)
          // Store ownerId to check ownership
          const ownerId = response.ownerId || null
          setListingOwnerId(ownerId)
          
          // Fetch owner profile if we have ownerId and it's not the current user
          if (ownerId && user && ownerId !== user.id) {
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
        } else {
          setListing(null)
        }
      } catch (error) {
        console.error('Error fetching listing:', error)
        setListing(null)
      } finally {
        setLoading(false)
        setIsListingLoading(false)
      }
    }

    fetchListing()
  }, [listingId, allListings, user])

  // Check if listing is saved when component loads, listingId changes, or savedListings changes
  useEffect(() => {
    if (listingId && user) {
      setIsSaved(isListingSaved(listingId))
    } else {
      setIsSaved(false)
    }
  }, [listingId, user, savedListings, isListingSaved])

  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [listingOwnerId, setListingOwnerId] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)

  // Fetch user profile if profileImageUrl is missing
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return
      
      // Only fetch if profileImageUrl is missing
      if ((user as any).profileImageUrl) return
      
      try {
        const profile = await usersApi.getMyProfile()
        // Merge profile data with existing user data
        const updatedUser = { ...user, ...profile }
        setUser(updatedUser as any)
      } catch (error) {
        console.error('Error fetching user profile in ListingDetail:', error)
      }
    }
    
    fetchProfile()
  }, [user, setUser])

  // Request status state - fetched from API
  const [requestStatus, setRequestStatus] = useState<{
    status: 'pending' | 'approved' | 'rejected' | null
    requestId?: string
  }>({ status: null })
  const [loadingRequestStatus, setLoadingRequestStatus] = useState(true)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  useEffect(() => {
    const loadListing = async () => {
      if (!listingId) {
        setListing(null)
        setIsListingLoading(false)
        setLoading(false)
        return
      }

      const cachedListing = allListings.find(l => l.id === listingId)
      if (cachedListing) {
        setListing(cachedListing)
        setIsListingLoading(false)
        setLoading(false)
        return
      }

      setIsListingLoading(true)
      setLoading(true)
      try {
        const response = await listingsApi.getById(listingId)
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
      } catch (error) {
        console.error('Error loading listing detail:', error)
        setListing(null)
      } finally {
        setIsListingLoading(false)
      }
    }

    loadListing()
  }, [listingId, allListings])

  // Check if current user is the owner of this listing
  // Only check ownerId from API response, not allListings (which may contain public listings)
  const isOwner = !!user && !!listingOwnerId && (
    listingOwnerId === user.id || listingOwnerId === (user as any)._id
  )

  // Get host information - use listing owner if available, otherwise fallback to current user
  const hostInfo = listingOwner || (user as any)

  // Fetch request status on mount and when listingId/user changes
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
        console.error('Error fetching request status:', error)
        setRequestStatus({ status: null })
      } finally {
        setLoadingRequestStatus(false)
      }
    }

    fetchRequestStatus()
  }, [user, listingId])

  // Check if conversation exists for this listing (only if request is approved)
  // Use a ref to prevent duplicate calls and cache results
  const conversationCheckRef = useRef<{ key: string; timestamp: number } | null>(null)
  const CONVERSATION_CACHE_TTL = 30000 // 30 seconds cache
  
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



  if (loading) {
    return (
      <div className="min-h-screen bg-mokogo-off-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading listing...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (isListingLoading) {
    return (
      <div className="min-h-screen bg-mokogo-off-white flex flex-col">
        <Header forceGuest />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-600">Loading listing...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-mokogo-off-white flex flex-col">
        <Header forceGuest />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Listing not found</h1>
            <Link to="/" className="text-orange-400 hover:text-orange-500">
              Back to listings
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleSave = () => {
    // Check if user is logged in
    if (!user) {
      if (listingId) {
        localStorage.setItem('mokogo-pending-saved-listing', listingId)
      }
      sessionStorage.setItem(
        'mokogo-auth-redirect',
        JSON.stringify({ path: '/dashboard', view: 'saved' })
      )
      navigate('/auth?redirect=/dashboard&view=saved')
      return
    }

    // User is logged in - toggle save
    if (listingId) {
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
          // Fallback to local toggle if API fails
          toggleSavedListing(listingId)
          setIsSaved(!isSaved)
        })
    }
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
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // You could show a toast notification here
    }
  }

  const handleReport = () => {
    // Check if user is logged in
    if (!user) {
      navigate(`/auth?redirect=/listings/${listingId}`)
      return
    }

    // User is logged in - implement report functionality
    // You can add a report modal or navigate to report page
    alert('Report functionality will be implemented')
  }

  const handleMarkAsFulfilled = async () => {
    if (!listing || !listingId) return
    
    if (!confirm('Are you sure you want to mark this listing as fulfilled? This will disable all conversations for this listing.')) {
      return
    }

    try {
      const updatedListing = await listingsApi.markAsFulfilled(listingId)
      // Map API response to frontend format
      const mappedListing: Listing = {
        id: updatedListing._id || updatedListing.id,
        title: updatedListing.title,
        city: updatedListing.city || '',
        locality: updatedListing.locality || '',
        societyName: updatedListing.societyName,
        bhkType: updatedListing.bhkType || '',
        roomType: updatedListing.roomType || '',
        rent: updatedListing.rent || 0,
        deposit: updatedListing.deposit || 0,
        moveInDate: updatedListing.moveInDate || '',
        furnishingLevel: updatedListing.furnishingLevel || '',
        bathroomType: updatedListing.bathroomType,
        flatAmenities: updatedListing.flatAmenities || [],
        societyAmenities: updatedListing.societyAmenities || [],
        preferredGender: updatedListing.preferredGender || '',
        foodPreference: updatedListing.foodPreference,
        petPolicy: updatedListing.petPolicy,
        smokingPolicy: updatedListing.smokingPolicy,
        drinkingPolicy: updatedListing.drinkingPolicy,
        description: updatedListing.description,
        photos: updatedListing.photos || [],
        status: updatedListing.status,
        createdAt: updatedListing.createdAt,
        updatedAt: updatedListing.updatedAt,
        mikoTags: updatedListing.mikoTags,
        lgbtqFriendly: updatedListing.lgbtqFriendly,
      }
      setListing(mappedListing)
    } catch (error: any) {
      console.error('Error marking listing as fulfilled:', error)
      alert(error?.response?.data?.message || 'Failed to mark listing as fulfilled. Please try again.')
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
    } else {
      alert(errorMessage)
    }
  }

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId)
  }


  // Mock similar listings (filter current listing)
  const similarListings = allListings
    .filter(l => l.id !== listingId && l.city === listing.city)
    .slice(0, 3)

  const faqs = [
    {
      id: '1',
      question: 'What is included in the rent?',
      answer: 'The rent includes furnished room, Wi-Fi, and access to common areas (kitchen, living room). Electricity charges are shared equally among flatmates. Maintenance fee of ₹500/month covers society charges and basic repairs.'
    },
    {
      id: '2',
      question: 'What is the security deposit policy?',
      answer: 'Security deposit is 2 months\' rent (₹' + formatPrice(listing.deposit) + '). It will be refunded within 15 days of checkout after deducting any damages or pending dues. The deposit is refundable and serves as security for the property.'
    },
    {
      id: '3',
      question: 'Can I schedule a visit before deciding?',
      answer: 'Absolutely! We encourage all potential tenants to visit the property in person. You can schedule a visit through our platform or contact the host directly. Virtual tours are also available if you\'re unable to visit immediately.'
    },
    {
      id: '4',
      question: 'What is the minimum stay duration?',
      answer: 'The minimum stay duration is 6 months. However, we prefer long-term tenants (12+ months) for stability. If you need to leave early, a 1-month notice period is required as per the rental agreement.'
    },
    {
      id: '5',
      question: 'Are there any additional charges?',
      answer: 'Apart from rent and maintenance (₹500/month), you\'ll need to contribute to electricity bills based on actual consumption. Cooking gas is shared among flatmates. No other hidden charges.'
    }
  ]

  const handleLogout = () => handleLogoutUtil(navigate)

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {user ? (
        <>
          {/* Lister Dashboard Header */}
          <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-8">
                  <Logo />
                  
                  <nav className="hidden md:flex items-center space-x-1">
                    <Link 
                      to="/dashboard"
                      className="px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white/50"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/dashboard"
                      className="px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white/50"
                    >
                      My Listings
                    </Link>
                  </nav>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-orange-400 rounded-full"></span>
                  </button>
                  
                  <button 
                    onClick={() => navigate('/dashboard?view=saved')}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    <HeartIcon className="w-5 h-5" />
                  </button>
                  
                  <div 
                    className="flex items-center gap-3 cursor-pointer relative"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      <UserAvatar 
                        user={{
                          name: user?.name,
                          profileImageUrl: (user as any)?.profileImageUrl
                        }}
                        size="md"
                        showBorder={false}
                        className="shadow-lg bg-gradient-to-br from-orange-400 to-orange-500 text-white"
                      />
                    </div>
                  </div>

                  {showUserMenu && (
                    <div className="absolute top-full right-4 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-orange-200/50 py-2 z-50 overflow-hidden">
                      <div className="px-4 py-2 border-b border-orange-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.email || ''}</p>
                      </div>
                      <Link
                        to="/dashboard?view=profile"
                        onClick={() => setShowUserMenu(false)}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          handleLogout()
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Click outside to close user menu */}
          {showUserMenu && (
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowUserMenu(false)}
            />
          )}
        </>
      ) : (
        <Header forceGuest />
      )}

      {/* Breadcrumb Navigation */}
      <section className="py-3 sm:py-4 bg-white border-b border-stone-200 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 min-w-0">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm flex-nowrap">
            <Link to="/" className="text-orange-400 hover:text-orange-500">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/explore" className="text-orange-400 hover:text-orange-500">Find Rooms</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-orange-400">{listing.city}</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 truncate max-w-[120px] sm:max-w-none">{listing.title}</span>
          </nav>
        </div>
      </section>

      {/* Listing Header Section */}
      <ListingHeading
        listing={listing}
        isSaved={isSaved}
        isOwner={isOwner}
        onSave={handleSave}
        onShare={handleShare}
        onReport={handleReport}
        onMarkAsFulfilled={handleMarkAsFulfilled}
        showVerified={false}
        showActions={true}
      />

      {/* Photo Gallery Section */}
      <ListingPhotos 
        listing={listing}
        mainImageHeight="h-[280px] sm:h-[350px] lg:h-[500px]"
        thumbnailHeight="h-[70px] sm:h-[90px] lg:h-[120px]"
      />

      {/* Main Content Section */}
      <section className="py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`grid grid-cols-1 gap-6 sm:gap-8 lg:gap-12 ${!isOwner ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
            
            {/* Left Content */}
            <div className={`space-y-8 ${!isOwner ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
              
              {/* Room Details */}
              <RoomDetails listing={listing} />

              {/* Amenities Section */}
              <AmenitiesSection listing={listing} />

              {/* Host Information Section */}
              <MeetYourHost listing={listing} hostInfo={hostInfo} />
              
            </div>
            
            {/* Right Sidebar - Only show for non-owners */}
            {!isOwner && (
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-6">
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
                />
              </div>
            </div>
            )}
            
          </div>
        </div>
      </section>

      {/* Similar Listings Section */}
      {similarListings.length > 0 && (
        <section className="py-10 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Similar Rooms in {listing.city}</h2>
              <Link to="/" className="text-orange-400 hover:text-orange-500 font-semibold text-sm sm:text-base flex-shrink-0">View All</Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {similarListings.map((similar) => {
                const saved = isListingSaved(similar.id)
                return (
                  <Link 
                    key={similar.id}
                    to={`/dashboard?listing=${similar.id}`}
                    className="bg-white/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group border border-white/60 block"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      {similar.photos && similar.photos.length > 0 ? (
                        <img
                          src={similar.photos[0]}
                          alt={similar.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-mokogo-gray" />
                      )}

                      <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
                        {getListingBadgeLabel(similar) && (
                          <span className="pointer-events-none inline-flex max-w-[75%] px-3 py-1 bg-mokogo-primary text-white rounded-full text-xs font-medium shadow-md whitespace-normal break-words">
                            {getListingBadgeLabel(similar)}
                          </span>
                        )}
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            if (!user) {
                              navigate('/auth')
                              return
                            }
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
                          className="pointer-events-auto w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors z-20 flex-shrink-0"
                          aria-label={saved ? 'Unsave property' : 'Save property'}
                        >
                          <Heart className={`w-5 h-5 ${saved ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm">
                          {similar.title.split('·')[0].trim()}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="line-clamp-1">{similar.locality}, {similar.city}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <div>
                          <p className="text-xl font-bold text-gray-900">{formatRent(similar.rent)}</p>
                          <p className="text-xs text-gray-600">per month</p>
                        </div>
                        <span className="btn-primary text-sm px-4 py-2 inline-block text-center">
                          View Details
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Frequently Asked Questions</h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">Get answers to common questions about this listing and the rental process</p>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="border border-stone-200 rounded-xl">
                <button 
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-stone-50 transition-colors gap-3"
                >
                  <span className="font-semibold text-gray-900 text-sm sm:text-base text-left">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${expandedFAQ === faq.id ? 'rotate-180' : ''}`} />
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-sm sm:text-base text-gray-700">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <ProfileCompletionModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
        action="contact"
      />
      {showSuccessToast && (
        <Toast 
          message="Request sent successfully! The host will review your request." 
          onClose={() => setShowSuccessToast(false)}
          type="success"
        />
      )}
    </div>
  )
}

export default ListingDetail

