import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import { useStore } from '@/store/useStore'
import { Listing, VibeTagId } from '@/types'
import { listingsApi, ListingResponse, subscriptionsApi, placesApi, AutocompletePrediction } from '@/services/api'
import MikoVibeQuiz from '@/components/MikoVibeQuiz'
import type { CityItem, LandingSearchFilters, SearchMode } from './landing/types'
import {
  faqItems,
  featuredDummyListings,
  howItWorksWorkflows,
  mikoQuestionPills,
  rotatingHeroPlaceholders,
  searchCities,
  testimonials,
  whatsappCommunityUrl,
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
    area: '',
    areaPlaceId: '',
    areaLat: 0,
    areaLng: 0,
    moveInDate: '',
  })
  const [areaSuggestions, setAreaSuggestions] = useState<AutocompletePrediction[]>([])
  const [showAreaSuggestions, setShowAreaSuggestions] = useState(false)
  const [isLoadingArea, setIsLoadingArea] = useState(false)
  const [areaInputValue, setAreaInputValue] = useState('')
  const [areaDropdownPosition, setAreaDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const areaSuggestionsRef = useRef<HTMLDivElement>(null)
  const areaInputRef = useRef<HTMLInputElement>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null)
  const rateLimitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [searchMode, setSearchMode] = useState<SearchMode>('standard')
  const [isMikoOpen, setIsMikoOpen] = useState(false)
  const [subscribeEmail, setSubscribeEmail] = useState('')
  const [subscribeError, setSubscribeError] = useState<string | null>(null)
  const [subscribeSuccess, setSubscribeSuccess] = useState<string | null>(null)
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [heroPlaceholderIndex, setHeroPlaceholderIndex] = useState(0)
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false)
  const [notifyCity, setNotifyCity] = useState('')
  const [notifyEmail, setNotifyEmail] = useState('')
  const [notifyError, setNotifyError] = useState<string | null>(null)
  const [notifySuccess, setNotifySuccess] = useState<string | null>(null)
  const [isNotifySubmitting, setIsNotifySubmitting] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setHeroPlaceholderIndex((prev) => (prev + 1) % rotatingHeroPlaceholders.length)
    }, 2000)

    return () => {
      window.clearInterval(interval)
    }
  }, [])

  // Fetch all live listings from API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listings = await listingsApi.getAllPublic('live')
        
        // Map API response to frontend format
        const mappedListings: Listing[] = listings.map((listing: ListingResponse) => ({
          id: listing._id || listing.id,
          title: listing.title,
          city: listing.city || '',
          locality: listing.locality || '',
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

  // Calculate dropdown position based on input field
  const updateAreaDropdownPosition = useCallback(() => {
    if (areaInputRef.current) {
      const rect = areaInputRef.current.getBoundingClientRect()
      setAreaDropdownPosition({
        top: rect.bottom + 4, // 4px spacing
        left: rect.left,
        width: rect.width,
      })
    }
  }, [])

  // Fetch area autocomplete suggestions with debouncing
  const fetchAreaSuggestions = useCallback(async (input: string, city: string) => {
    if (!input || input.trim().length < 2 || !city) {
      setAreaSuggestions([])
      setShowAreaSuggestions(false)
      return
    }

    setIsLoadingArea(true)
    try {
      const results = await placesApi.getAutocomplete(input.trim(), city)
      setAreaSuggestions(results)
      if (results.length > 0) {
        setShowAreaSuggestions(true)
        updateAreaDropdownPosition()
      } else {
        setShowAreaSuggestions(false)
      }
    } catch (error: any) {
      // Gracefully handle 429 errors - show user-visible message
      if (error?.response?.status === 429) {
        setRateLimitMessage('Too many requests. Please type slower and wait a moment.')
        setAreaSuggestions([])
        setShowAreaSuggestions(false)
        
        // Auto-dismiss message after 5 seconds
        if (rateLimitTimerRef.current) {
          clearTimeout(rateLimitTimerRef.current)
        }
        rateLimitTimerRef.current = setTimeout(() => {
          setRateLimitMessage(null)
        }, 5000)
      } else {
        console.error('Error fetching area suggestions:', error)
        setAreaSuggestions([])
        setShowAreaSuggestions(false)
      }
    } finally {
      setIsLoadingArea(false)
    }
  }, [updateAreaDropdownPosition])

  // Handle area input change
  const handleAreaInputChange = (value: string) => {
    setAreaInputValue(value)
    
    // Clear rate limit message when user starts typing again
    if (rateLimitMessage) {
      setRateLimitMessage(null)
      if (rateLimitTimerRef.current) {
        clearTimeout(rateLimitTimerRef.current)
      }
    }
    
    setSearchFilters(prev => ({
      ...prev,
      area: value,
      areaPlaceId: '',
      areaLat: 0,
      areaLng: 0,
    }))
    setShowAreaSuggestions(false)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (searchFilters.city && value.trim().length >= 2) {
      debounceTimerRef.current = setTimeout(() => {
        fetchAreaSuggestions(value, searchFilters.city)
      }, 400)
    }
  }

  const handleAreaFocus = () => {
    updateAreaDropdownPosition()
    if (areaSuggestions.length > 0 && areaInputValue.trim().length >= 2) {
      setShowAreaSuggestions(true)
    }
  }

  // Update position when suggestions are shown or input is focused
  useEffect(() => {
    if (showAreaSuggestions) {
      updateAreaDropdownPosition()
    }
  }, [showAreaSuggestions, updateAreaDropdownPosition])

  // Handle area suggestion selection
  const handleAreaSuggestionSelect = async (prediction: AutocompletePrediction) => {
    setAreaInputValue(prediction.structured_formatting.main_text)
    setShowAreaSuggestions(false)
    setAreaSuggestions([])

    try {
      const placeDetails = await placesApi.getPlaceDetails(prediction.place_id)
      setSearchFilters(prev => ({
        ...prev,
        area: prediction.structured_formatting.main_text,
        areaPlaceId: placeDetails.place_id,
        areaLat: placeDetails.geometry.location.lat,
        areaLng: placeDetails.geometry.location.lng,
      }))
    } catch (error) {
      console.error('Error fetching area details:', error)
      setSearchFilters(prev => ({
        ...prev,
        area: prediction.structured_formatting.main_text,
        areaPlaceId: prediction.place_id,
      }))
    }
  }

  // Handle scroll and resize to update dropdown position
  useEffect(() => {
    if (!showAreaSuggestions) return

    const handleScroll = () => {
      updateAreaDropdownPosition()
    }

    const handleResize = () => {
      updateAreaDropdownPosition()
    }

    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [showAreaSuggestions, updateAreaDropdownPosition])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        areaSuggestionsRef.current &&
        !areaSuggestionsRef.current.contains(event.target as Node) &&
        areaInputRef.current &&
        !areaInputRef.current.contains(event.target as Node)
      ) {
        setShowAreaSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Cleanup rate limit timer on unmount
  useEffect(() => {
    return () => {
      if (rateLimitTimerRef.current) {
        clearTimeout(rateLimitTimerRef.current)
      }
    }
  }, [])

  // Clear area when city changes
  useEffect(() => {
    if (!searchFilters.city) {
      setAreaInputValue('')
      setSearchFilters(prev => ({
        ...prev,
        area: '',
        areaPlaceId: '',
        areaLat: 0,
        areaLng: 0,
      }))
      setAreaSuggestions([])
      setShowAreaSuggestions(false)
    }
  }, [searchFilters.city])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchFilters.city) params.set('city', searchFilters.city)
    if (searchFilters.area && searchFilters.areaPlaceId) {
      params.set('area', searchFilters.area)
      params.set('areaPlaceId', searchFilters.areaPlaceId)
      if (searchFilters.areaLat) params.set('areaLat', searchFilters.areaLat.toString())
      if (searchFilters.areaLng) params.set('areaLng', searchFilters.areaLng.toString())
    }
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
    if (searchFilters.area && searchFilters.areaPlaceId) {
      params.set('area', searchFilters.area)
      params.set('areaPlaceId', searchFilters.areaPlaceId)
      if (searchFilters.areaLat) params.set('areaLat', searchFilters.areaLat.toString())
      if (searchFilters.areaLng) params.set('areaLng', searchFilters.areaLng.toString())
    }

    setIsMikoOpen(false)
    if (user) {
      navigate(`/dashboard?view=miko&${params.toString()}`)
    } else {
      navigate(`/miko-results?${params.toString()}`)
    }
  }


  // Get city listings count from actual listings
  const getCityListingsCount = (cityName: string) => {
    return allListings.filter(l => l.city === cityName && l.status === 'live').length
  }

  const cities: CityItem[] = [
    { 
      name: 'Pune', 
      image: '/pune-city.png', 
      listings: getCityListingsCount('Pune'),
      active: true
    },
    { 
      name: 'Mumbai', 
      image: '/mumbai-city.png', 
      listings: getCityListingsCount('Mumbai'),
      active: false
    },
    { 
      name: 'Bangalore', 
      image: '/bangalore-city.png', 
      listings: getCityListingsCount('Bangalore'),
      active: false
    },
    { 
      name: 'Hyderabad', 
      image: '/hyderabad-city.png', 
      listings: getCityListingsCount('Hyderabad'),
      active: false
    },
    {
      name: 'Delhi NCR',
      image: '/delhi-city.png',
      listings: getCityListingsCount('Delhi NCR'),
      active: false
    }
  ]
  const featuredListingsLoop = useMemo(() => [...featuredDummyListings, ...featuredDummyListings], [])
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
        <HeroSection
          searchMode={searchMode}
          onSearchModeChange={setSearchMode}
          onOpenMiko={() => setIsMikoOpen(true)}
          searchFilters={searchFilters}
          searchCities={searchCities}
          onCityChange={(city) => setSearchFilters((prev) => ({ ...prev, city }))}
          areaInputRef={areaInputRef}
          areaInputValue={areaInputValue}
          onAreaInputChange={handleAreaInputChange}
          onAreaFocus={handleAreaFocus}
          heroPlaceholder={rotatingHeroPlaceholders[heroPlaceholderIndex]}
          isLoadingArea={isLoadingArea}
          rateLimitMessage={rateLimitMessage}
          showAreaSuggestions={showAreaSuggestions}
          areaSuggestions={areaSuggestions}
          areaSuggestionsRef={areaSuggestionsRef}
          areaDropdownPosition={areaDropdownPosition}
          onAreaSuggestionSelect={handleAreaSuggestionSelect}
          onMoveInDateChange={(date) => setSearchFilters((prev) => ({ ...prev, moveInDate: date }))}
          onSearch={handleSearch}
        />
        <div className="bg-gradient-to-br from-orange-50 via-orange-100/50 to-orange-50">
          <div className="space-y-10 px-4 py-8 sm:space-y-14 sm:px-6 sm:py-10 md:space-y-16 md:px-12 md:py-12">
          <FeaturedListingsSection listings={featuredListingsLoop} />
          <CitiesSection cities={cities} onNotify={openNotifyModal} />
          <HowItWorksSection workflows={howItWorksWorkflows} />
          <MikoVibeSection questions={mikoQuestionPills} onTryMiko={() => setIsMikoOpen(true)} />
          <WhyMokogoSection features={whyMokogoFeatures} />
          <ListYourSpaceSection />
          <TestimonialsSection testimonials={testimonialsLoop} />
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
          whatsappCommunityUrl={whatsappCommunityUrl}
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
