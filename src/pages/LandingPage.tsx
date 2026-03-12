import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import { useStore } from '@/store/useStore'
import { Listing, VibeTagId } from '@/types'
import { listingsApi, ListingResponse, subscriptionsApi } from '@/services/api'
import MikoVibeQuiz from '@/components/MikoVibeQuiz'
import type { CityItem, FeaturedListingItem, LandingSearchFilters, SearchMode } from './landing/types'
import { isListingWithinRadius, sortListingsByDistance } from '@/utils/distance'
import {
  faqItems,
  howItWorksWorkflows,
  mikoQuestionPills,
  testimonials,
  whyMokogoFeatures,
} from './landing/data'
import HeroSection from './landing/components/HeroSection'
import FeaturedListingsSection from './landing/components/FeaturedListingsSection'
import CitiesSection from './landing/components/CitiesSection'
import HowItWorksSection from './landing/components/HowItWorksSection'
import MikoVibeSection from './landing/components/MikoVibeSection'
import WhyMokogoSection from './landing/components/WhyMokogoSection'
import ListYourSpaceSection from './landing/components/ListYourSpaceSection'
import TestimonialsSection from './landing/components/TestimonialsSection'
import FaqSection from './landing/components/FaqSection'
import NewsletterSection from './landing/components/NewsletterSection'
import NotifyCityModal from './landing/components/NotifyCityModal'
import MarqueeStyles from './landing/components/MarqueeStyles'

const LandingPage = () => {
  const navigate = useNavigate()
  const { allListings, setAllListings, user } = useStore()
  const [searchFilters, setSearchFilters] = useState<LandingSearchFilters>({
    city: '',
    moveInDate: '',
  })
  const [searchValidationMessage, setSearchValidationMessage] = useState<string | null>(null)
  const [searchMode, setSearchMode] = useState<SearchMode>('standard')
  const [isMikoOpen, setIsMikoOpen] = useState(false)
  const [subscribeEmail, setSubscribeEmail] = useState('')
  const [subscribeError, setSubscribeError] = useState<string | null>(null)
  const [subscribeSuccess, setSubscribeSuccess] = useState<string | null>(null)
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false)
  const [notifyCity, setNotifyCity] = useState('')
  const [notifyEmail, setNotifyEmail] = useState('')
  const [notifyError, setNotifyError] = useState<string | null>(null)
  const [notifySuccess, setNotifySuccess] = useState<string | null>(null)
  const [isNotifySubmitting, setIsNotifySubmitting] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const [nearbyListings, setNearbyListings] = useState<FeaturedListingItem[]>([])
  const [locationState, setLocationState] = useState<'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported' | 'no_listings'>('idle')
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null)

  const normalize = (v: string) => (v || '').trim().toLowerCase()

  const canonicalizeCityKey = (city: string) => {
    const c = normalize(city)
    if (!c) return ''
    if (c === 'new delhi' || c === 'delhi') return 'delhi ncr'
    return c
  }

  const canonicalizeCityLabel = (city: string) => {
    const key = canonicalizeCityKey(city)
    if (!key) return ''
    if (key === 'delhi ncr') return 'Delhi NCR'
    // Preserve original formatting for everything else
    return (city || '').trim()
  }

  // Landing page standard search: city + move-in date only

  // Fetch all live listings from API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listings = await listingsApi.getAllPublic('live')
        
        // Map API response to frontend format
        const mappedListings: Listing[] = listings.map((listing: ListingResponse) => ({
          id: listing._id || listing.id,
          title: listing.title,
          city: canonicalizeCityLabel(listing.city || ''),
          locality: listing.locality || '',
          placeId: listing.placeId,
          latitude: listing.latitude,
          longitude: listing.longitude,
          formattedAddress: listing.formattedAddress,
          societyName: listing.societyName,
          buildingType: listing.buildingType,
          bhkType: listing.bhkType || '',
          roomType: listing.roomType || '',
          rent: listing.rent || 0,
          deposit: listing.deposit || 0,
          moveInDate: listing.moveInDate || '',
          furnishingLevel: listing.furnishingLevel || '',
          bathroomType: listing.bathroomType,
          flatAmenities: listing.flatAmenities || [],
          societyAmenities: listing.societyAmenities || [],
          preferredGender: listing.preferredGender || '',
          foodPreference: listing.foodPreference,
          petPolicy: listing.petPolicy,
          smokingPolicy: listing.smokingPolicy,
          drinkingPolicy: listing.drinkingPolicy,
          description: listing.description,
          photos: listing.photos || [],
          status: listing.status,
          createdAt: listing.createdAt,
          updatedAt: listing.updatedAt,
          lgbtqFriendly: listing.lgbtqFriendly,
        }))
        
        setAllListings(mappedListings)
      } catch (error) {
        console.error('Error fetching public listings:', error)
        // Keep existing listings or empty array on error
      }
    }

    fetchListings()
  }, [setAllListings])

  const requestUserLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationState('unsupported')
      return
    }

    setLocationState('requesting')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setUserCoords({ lat, lng })
        setLocationState('granted')
      },
      () => {
        setLocationState('denied')
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 * 60 * 10 },
    )
  }, [])

  useEffect(() => {
    if (!userCoords || locationState !== 'granted') return

    const live = allListings.filter((l) => l.status === 'live' && l.latitude && l.longitude)
    const within = live.filter((l) => isListingWithinRadius(l, userCoords.lat, userCoords.lng, 15))
    const sorted = sortListingsByDistance(within, userCoords.lat, userCoords.lng).slice(0, 12)

    if (!sorted.length) {
      setNearbyListings([])
      setLocationState('no_listings')
      return
    }

    const toFeatured = (l: Listing): FeaturedListingItem => ({
      id: l.id,
      image: l.photos?.[0] || '/pune-city.png',
      furnishing: l.furnishingLevel || 'Furnished',
      title: l.title || 'Room available',
      location: `${l.locality || 'Area'}, ${l.city || ''}`.trim(),
      preference: l.preferredGender ? `${l.preferredGender} preferred` : 'View details',
      price: l.rent ? `₹${Number(l.rent).toLocaleString('en-IN')}/mo` : 'View price',
    })

    setNearbyListings(sorted.map(toFeatured))
  }, [allListings, locationState, userCoords])

  const handleSearch = () => {
    setSearchValidationMessage(null)
    if (!searchFilters.city) {
      setSearchValidationMessage('Select a city to search.')
      return
    }
    const params = new URLSearchParams()
    if (searchFilters.city) params.set('city', searchFilters.city)
    if (searchFilters.moveInDate) params.set('moveInDate', searchFilters.moveInDate)

    navigate(`/explore?${params.toString()}`)
  }

  const handleMikoComplete = (result: { tags: VibeTagId[]; roomTypePreference?: 'private' | 'shared' | 'either'; city?: string }) => {
    const params = new URLSearchParams()
    params.set('miko', '1')
    if (result.tags.length) {
      params.set('tags', result.tags.join(','))
    }
    if (result.roomTypePreference) {
      params.set('roomType', result.roomTypePreference)
    }
    if (result.city && result.city !== 'any') {
      params.set('city', result.city)
    } else if (searchFilters.city) {
      params.set('city', searchFilters.city)
    }
    if (searchFilters.moveInDate) params.set('moveInDate', searchFilters.moveInDate)

    setIsMikoOpen(false)
    if (user) {
      navigate(`/dashboard?view=miko&${params.toString()}`)
    } else {
      navigate(`/miko-results?${params.toString()}`)
    }
  }

  const liveCityStats = useMemo(() => {
    const map = new Map<string, { name: string; count: number }>()
    allListings
      .filter((l) => normalize(l.status as string) === 'live')
      .forEach((l) => {
        const raw = (l.city || '').trim()
        if (!raw) return
        const key = canonicalizeCityKey(raw)
        const label = canonicalizeCityLabel(raw)
        const current = map.get(key)
        if (current) current.count += 1
        else map.set(key, { name: label || raw, count: 1 })
      })
    return map
  }, [allListings])

  const cityImageByName: Record<string, string> = {
    'pune': '/pune-city.png',
    'mumbai': '/mumbai-city.png',
    'bangalore': '/bangalore-city.png',
    'bengaluru': '/bangalore-city.png',
    'hyderabad': '/hyderabad-city.png',
    'delhi ncr': '/delhi-city.png',
  }

  const discoverCities: CityItem[] = useMemo(() => {
    const baseOrder = ['Pune', 'Mumbai', 'Bangalore', 'Hyderabad', 'Delhi NCR']
    const base = baseOrder.map((name) => {
      const key = normalize(name)
      const stat = liveCityStats.get(key)
      const count = stat?.count ?? 0
      return {
        name,
        image: cityImageByName[key] || '/pune-city.png',
        listings: count,
        active: count > 0,
      }
    })

    // Add any extra cities that have live listings but aren't in the base list
    const extras: CityItem[] = []
    liveCityStats.forEach((stat, key) => {
      if (base.some((c) => normalize(c.name) === key)) return
      extras.push({
        name: stat.name,
        image: cityImageByName[key] || '/pune-city.png',
        listings: stat.count,
        active: true,
      })
    })

    return [...base, ...extras].sort((a, b) => {
      // Live cities (listings > 0) first, then by listing count DESC, then alphabetically
      if (a.active !== b.active) return a.active ? -1 : 1
      if (a.listings !== b.listings) return b.listings - a.listings
      return a.name.localeCompare(b.name)
    })
  }, [liveCityStats])

  const searchCities = useMemo(() => {
    const cities = Array.from(liveCityStats.values())
      .filter((c) => c.count > 0)
      .map((c) => c.name)
      .sort((a, b) => a.localeCompare(b))
    return cities.length ? cities : ['Pune']
  }, [liveCityStats])
  const testimonialsLoop = useMemo(() => [...testimonials, ...testimonials], [])

  const validateSubscribeEmail = (email: string) => {
    const trimmed = email.trim()
    if (!trimmed) {
      return 'Please enter a valid email address'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmed)) {
      return 'Please enter a valid email address'
    }
    return null
  }

  const handleSubscribe = async () => {
    setSubscribeSuccess(null)
    const error = validateSubscribeEmail(subscribeEmail)
    if (error) {
      setSubscribeError(error)
      return
    }

    setSubscribeError(null)
    setIsSubscribing(true)
    try {
      const response = await subscriptionsApi.subscribe({
        email: subscribeEmail.trim(),
      })
      setSubscribeSuccess(
        "You’re on the list ✅\nWe’ll email you when there’s something worth knowing.",
      )
      // Prefer backend message if it changes in future
      if (response?.message) {
        setSubscribeSuccess(response.message)
      }
      setSubscribeEmail('')
    } catch (error: any) {
      const status = error?.response?.status
      const message = error?.response?.data?.message

      if (status === 409) {
        setSubscribeError("You’re already on the list 😊")
      } else if (typeof message === 'string') {
        if (message.toLowerCase().includes('already on the list')) {
          setSubscribeError("You’re already on the list 😊")
        } else if (message.toLowerCase().includes('email')) {
          setSubscribeError('Please enter a valid email address')
        } else {
          setSubscribeError(
            'Something went wrong while subscribing. Please try again in a moment.',
          )
        }
      } else {
        setSubscribeError(
          'Something went wrong while subscribing. Please try again in a moment.',
        )
      }
    } finally {
      setIsSubscribing(false)
    }
  }

  const openNotifyModal = (cityName: string) => {
    setNotifyCity(cityName)
    setNotifyEmail('')
    setNotifyError(null)
    setNotifySuccess(null)
    setIsNotifyModalOpen(true)
  }

  const closeNotifyModal = () => {
    setIsNotifyModalOpen(false)
    setNotifyEmail('')
    setNotifyError(null)
    setNotifySuccess(null)
  }

  const handleNotifySubmit = async () => {
    setNotifySuccess(null)
    const error = validateSubscribeEmail(notifyEmail)
    if (error) {
      setNotifyError(error)
      return
    }

    setNotifyError(null)
    setIsNotifySubmitting(true)
    try {
      await subscriptionsApi.subscribe({
        email: notifyEmail.trim(),
      })
      setNotifySuccess(`Nice. We’ll let you know when ${notifyCity} goes live on Mokogo.`)
      setNotifyEmail('')
    } catch (error: any) {
      const status = error?.response?.status
      const message = error?.response?.data?.message

      if (status === 409 || (typeof message === 'string' && message.toLowerCase().includes('already'))) {
        setNotifyError('You’re already on the list for launch updates.')
      } else if (typeof message === 'string' && message.toLowerCase().includes('email')) {
        setNotifyError('Please enter a valid email address')
      } else {
        setNotifyError('Something went wrong while saving your request. Please try again in a moment.')
      }
    } finally {
      setIsNotifySubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-mokogo-off-white flex flex-col">
      <Header />
      <SocialSidebar />
      
      <main className="flex-1">
        {(locationState === 'idle' || locationState === 'requesting') && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/35 backdrop-blur-sm">
            <div className="max-w-md w-full mx-4 rounded-3xl border border-orange-200/80 bg-gradient-to-br from-orange-50 via-white to-orange-100 p-6 shadow-[0_22px_70px_rgba(15,23,42,0.5)] transform transition-transform duration-200 ease-out">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  Location-based results
                </div>
                <div className="space-y-2">
                  <p className="text-base font-semibold text-gray-900">
                    Enable location to find listings near your place easily
                  </p>
                  <p className="text-sm leading-relaxed text-gray-600">
                    We’ll use your approximate location to surface nearby live rooms first. No exact address is stored, and you can turn this off anytime from your browser.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={requestUserLocation}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-transform transition-colors hover:bg-orange-600 hover:scale-[1.02] active:scale-95"
                >
                  {locationState === 'requesting' ? 'Requesting…' : 'Enable location'}
                </button>
                <button
                  type="button"
                  onClick={() => setLocationState('denied')}
                  className="rounded-full px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        )}

        <HeroSection
          searchMode={searchMode}
          onSearchModeChange={setSearchMode}
          onOpenMiko={() => setIsMikoOpen(true)}
          searchFilters={searchFilters}
          searchCities={searchCities}
          onCityChange={(city) => {
            if (searchValidationMessage) {
              setSearchValidationMessage(null)
            }
            setSearchFilters((prev) => ({
              ...prev,
              city,
              moveInDate: '',
            }))
          }}
          searchValidationMessage={searchValidationMessage}
          isStandardSearchReady={Boolean(searchFilters.city)}
          onMoveInDateChange={(date) => setSearchFilters((prev) => ({ ...prev, moveInDate: date }))}
          onSearch={handleSearch}
        />
        <div className="bg-gradient-to-br from-orange-50 via-orange-100/50 to-orange-50">
          <div className="space-y-10 px-4 py-8 sm:space-y-14 sm:px-6 sm:py-10 md:space-y-16 md:px-12 md:py-12">
          <FeaturedListingsSection
            listings={nearbyListings}
            locationState={locationState}
          />
          <CitiesSection cities={discoverCities} onNotify={openNotifyModal} />
          <MikoVibeSection questions={mikoQuestionPills} onTryMiko={() => setIsMikoOpen(true)} />
          <HowItWorksSection workflows={howItWorksWorkflows} />
          <WhyMokogoSection features={whyMokogoFeatures} />
          <ListYourSpaceSection />
          {false && <TestimonialsSection testimonials={testimonialsLoop} />}
          <FaqSection
            items={faqItems}
            openIndex={openFaqIndex}
            onToggle={(index) => setOpenFaqIndex((prev) => (prev === index ? null : index))}
          />
          </div>
        </div>
        <MarqueeStyles />
        <NewsletterSection
          subscribeEmail={subscribeEmail}
          onSubscribeEmailChange={(value) => {
            setSubscribeEmail(value)
            if (subscribeError) setSubscribeError(null)
          }}
          subscribeError={subscribeError}
          subscribeSuccess={subscribeSuccess}
          isSubscribing={isSubscribing}
          onSubscribe={handleSubscribe}
        />
      </main>

      <Footer />
      <NotifyCityModal
        isOpen={isNotifyModalOpen}
        cityName={notifyCity}
        email={notifyEmail}
        notifyError={notifyError}
        notifySuccess={notifySuccess}
        isSubmitting={isNotifySubmitting}
        onClose={closeNotifyModal}
        onEmailChange={(value) => {
          setNotifyEmail(value)
          if (notifyError) setNotifyError(null)
        }}
        onSubmit={handleNotifySubmit}
      />

      <MikoVibeQuiz
        isOpen={isMikoOpen}
        onClose={() => setIsMikoOpen(false)}
        onComplete={handleMikoComplete}
      />
    </div>
  )
}

export default LandingPage
