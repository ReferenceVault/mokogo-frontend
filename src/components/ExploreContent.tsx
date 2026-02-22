import { useState, useMemo, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import CustomSelect from '@/components/CustomSelect'
import { MoveInDateField } from '@/components/MoveInDateField'
import { MapPin, Home, Heart } from 'lucide-react'
import { Listing, VibeTagId } from '@/types'
import { getListingMikoTags, getMikoMatchPercent, getMikoMatchScore } from '@/utils/miko'
import { getListingBadgeLabel } from '@/utils/listingTags'
import MikoTagPills from '@/components/MikoTagPills'
import { listingsApi, ListingResponse, placesApi, AutocompletePrediction, usersApi } from '@/services/api'
import { useStore } from '@/store/useStore'
import { sortListingsByDistance, isListingWithinRadius } from '@/utils/distance'
import ListingFilters, { ListingFilterState } from '@/components/ListingFilters'

interface ExploreContentProps {
  onListingClick: (listingId: string) => void
  hideFilters?: boolean
  headerTitle?: string
  headerSubtitle?: string
  showMikoTags?: boolean
  showClearMiko?: boolean
}

const ExploreContent = ({
  onListingClick,
  hideFilters = false,
  headerTitle,
  headerSubtitle,
  showMikoTags = true,
  showClearMiko = true
}: ExploreContentProps) => {
  const location = useLocation()
  const [exploreListings, setExploreListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toggleSavedListing, isListingSaved, setSavedListings } = useStore()

  // Area autocomplete state
  const [areaInputValue, setAreaInputValue] = useState('')
  const [areaSuggestions, setAreaSuggestions] = useState<AutocompletePrediction[]>([])
  const [showAreaSuggestions, setShowAreaSuggestions] = useState(false)
  const [isLoadingArea, setIsLoadingArea] = useState(false)
  const skipNextAreaFetchRef = useRef(false)
  const areaInputRef = useRef<HTMLDivElement>(null)
  const [areaDropdownPosition, setAreaDropdownPosition] = useState({ top: 0, left: 0, width: 0 })

  // Filter state
  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(location.search)
    return {
      city: params.get('city') || '',
      area: params.get('area') || '',
      areaPlaceId: params.get('areaPlaceId') || '',
      areaLat: params.get('areaLat') ? parseFloat(params.get('areaLat')!) : null,
      areaLng: params.get('areaLng') ? parseFloat(params.get('areaLng')!) : null,
      moveInDate: params.get('moveInDate') || '',
      preferredGender: params.get('preferredGender') || '',
    }
  })


  const [isMikoMode, setIsMikoMode] = useState(() => {
    const params = new URLSearchParams(location.search)
    return params.get('miko') === '1'
  })
  const [mikoTags, setMikoTags] = useState<VibeTagId[]>(() => {
    const params = new URLSearchParams(location.search)
    const tags = params.get('tags') || ''
    return tags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean) as VibeTagId[]
  })
  const [roomTypePreference, setRoomTypePreference] = useState<'private' | 'shared' | 'either' | null>(() => {
    const params = new URLSearchParams(location.search)
    const value = params.get('roomType')
    if (value === 'private' || value === 'shared' || value === 'either') {
      return value
    }
    return null
  })

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState<ListingFilterState | null>(null)
  const [sortOption, setSortOption] = useState<'rent_low_high' | 'rent_high_low' | 'newest'>('newest')

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true)
      try {
        const listings = await listingsApi.getAllPublic('live')
        const mappedListings: Listing[] = listings.map((listing: ListingResponse) => ({
          id: listing._id || listing.id,
          title: listing.title,
          city: listing.city || '',
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
          mikoTags: listing.mikoTags,
          lgbtqFriendly: listing.lgbtqFriendly,
        }))
        setExploreListings(mappedListings)
      } catch (error) {
        console.error('Error fetching public listings:', error)
        setExploreListings([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchListings()
  }, [])

  // Get all live listings
  const allLiveListings = exploreListings.filter(listing => listing.status === 'live')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setFilters({
      city: params.get('city') || '',
      area: params.get('area') || '',
      areaPlaceId: params.get('areaPlaceId') || '',
      areaLat: params.get('areaLat') ? parseFloat(params.get('areaLat')!) : null,
      areaLng: params.get('areaLng') ? parseFloat(params.get('areaLng')!) : null,
      moveInDate: params.get('moveInDate') || '',
      preferredGender: params.get('preferredGender') || '',
    })
    setAreaInputValue(params.get('area') || '')
    setIsMikoMode(params.get('miko') === '1')
    const tags = params.get('tags') || ''
    setMikoTags(
      tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean) as VibeTagId[]
    )
    const roomType = params.get('roomType')
    if (roomType === 'private' || roomType === 'shared' || roomType === 'either') {
      setRoomTypePreference(roomType)
    } else {
      setRoomTypePreference(null)
    }
  }, [location.search])

  // Apply filters to listings
  const filteredListings = useMemo(() => {
    const filtered = allLiveListings.filter(listing => {
      const hasMikoFilters =
        Boolean(filters.city || filters.area || filters.moveInDate || filters.preferredGender) ||
        Boolean(roomTypePreference) ||
        mikoTags.length > 0

      const cityMatch = filters.city ? listing.city === filters.city : false
      
      // Area matching: if coordinates provided, use distance (within 10km), otherwise exact match
      let areaMatch = false
      if (filters.area) {
        if (filters.areaLat !== null && filters.areaLng !== null && listing.latitude && listing.longitude) {
          // Use distance-based matching (within 10km)
          areaMatch = isListingWithinRadius(
            listing,
            filters.areaLat,
            filters.areaLng,
            10
          )
        } else {
          // Fallback to exact locality match
          areaMatch = listing.locality === filters.area
        }
      }
      // Move-in date match
      // Business rule: show listings available ON or BEFORE the seeker's desired move-in date
      // i.e., listing.moveInDate <= filters.moveInDate (date-only comparison)
      const moveInDateMatch = filters.moveInDate
        ? (() => {
            const filterDate = new Date(filters.moveInDate)
            filterDate.setHours(0, 0, 0, 0)
            const listingDate = new Date(listing.moveInDate)
            listingDate.setHours(0, 0, 0, 0)
            return listingDate <= filterDate
          })()
        : false

      // Gender preference match
      // Note: 'Any' should behave like "no restriction", so only apply when a specific gender is selected
      const genderMatch = filters.preferredGender
        ? (() => {
            if (filters.preferredGender === 'Any') {
              return true
            }
            // If listing has a specific preference (not 'Any'), it must match the filter
            if (listing.preferredGender && listing.preferredGender !== 'Any') {
              return listing.preferredGender === filters.preferredGender
            }
            // Listings with 'Any' preference match all filters
            return true
          })()
        : false

      const roomTypeMatch = roomTypePreference
        ? (() => {
            const roomType = listing.roomType.toLowerCase()
            if (roomTypePreference === 'private') {
              return roomType.includes('private') || roomType.includes('master')
            }
            if (roomTypePreference === 'shared') {
              return roomType.includes('shared')
            }
            return true
          })()
        : false

      const mikoTagsMatch = mikoTags.length > 0
        ? (() => {
            const listingTags = getListingMikoTags(listing)
            return listingTags.some(tag => mikoTags.includes(tag))
          })()
        : false

      if (isMikoMode) {
        if (filters.city && !cityMatch) return false

        const hasOtherFilters =
          Boolean(filters.area || filters.moveInDate || filters.preferredGender) ||
          Boolean(roomTypePreference) ||
          mikoTags.length > 0

        if (!hasMikoFilters || !hasOtherFilters) {
          return true
        }

        return (
          areaMatch ||
          moveInDateMatch ||
          genderMatch ||
          roomTypeMatch ||
          mikoTagsMatch
        )
      }

      // Standard search: all selected filters must match
      if (filters.city && !cityMatch) return false
      if (filters.area && !areaMatch) return false
      if (filters.moveInDate && !moveInDateMatch) return false
      if (filters.preferredGender && !genderMatch) return false
      if (roomTypePreference && !roomTypeMatch) return false

      return true
    })

    // Sort by distance if area coordinates are provided
    if (filters.area && filters.areaLat !== null && filters.areaLng !== null) {
      return sortListingsByDistance(filtered, filters.areaLat, filters.areaLng)
    }

    return filtered
  }, [allLiveListings, filters, isMikoMode, roomTypePreference, mikoTags])

  const rankedListings = useMemo(() => {
    if (!isMikoMode || mikoTags.length === 0) {
      return filteredListings
    }

    return [...filteredListings]
      .map(listing => {
        const listingTags = getListingMikoTags(listing)
        return {
          listing,
          score: getMikoMatchScore(mikoTags, listingTags),
        }
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        return new Date(b.listing.createdAt).getTime() - new Date(a.listing.createdAt).getTime()
      })
      .map(item => item.listing)
  }, [filteredListings, isMikoMode, mikoTags])

  const sortedListings = useMemo(() => {
    const base = [...rankedListings]

    if (sortOption === 'rent_low_high') {
      return base.sort((a, b) => (a.rent || 0) - (b.rent || 0))
    }

    if (sortOption === 'rent_high_low') {
      return base.sort((a, b) => (b.rent || 0) - (a.rent || 0))
    }

    // Newest to oldest
    return base.sort(
      (a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
    )
  }, [rankedListings, sortOption])

  const advancedFilterCount = useMemo(() => {
    if (!advancedFilters) return 0
    const DEFAULT_MIN_RENT = 0
    const DEFAULT_MAX_RENT = 0
    const {
      minRent,
      maxRent,
      roomTypes,
      furnishingLevels,
      preferredGender,
      bhkTypes,
      bathroomTypes,
      lgbtqFriendly,
    } = advancedFilters
    return (
      (minRent !== undefined && minRent !== DEFAULT_MIN_RENT ? 1 : 0) +
      (maxRent !== undefined && maxRent !== DEFAULT_MAX_RENT ? 1 : 0) +
      (roomTypes && roomTypes.length ? 1 : 0) +
      (furnishingLevels && furnishingLevels.length ? 1 : 0) +
      (preferredGender ? 1 : 0) +
      (bhkTypes && bhkTypes.length ? 1 : 0) +
      (bathroomTypes && bathroomTypes.length ? 1 : 0) +
      (lgbtqFriendly ? 1 : 0)
    )
  }, [advancedFilters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))

    // If advanced filters are active and gender changes inline,
    // re-apply advanced filters with the new gender so results update
    if (key === 'preferredGender' && advancedFilters) {
      const nextState: ListingFilterState = {
        ...advancedFilters,
        preferredGender: value || undefined,
      }
      setAdvancedFilters(nextState)
      // Fire and forget; this will call the backend with updated gender
      void handleAdvancedApply(nextState)
    }

    // Clear area filter if city changes
    if (key === 'city') {
      setFilters(prev => ({
        ...prev,
        city: value,
        area: '',
        areaPlaceId: '',
        areaLat: null,
        areaLng: null,
      }))
      setAreaInputValue('')
    }
  }

  const clearFilters = () => {
    setFilters({
      city: '',
      area: '',
      areaPlaceId: '',
      areaLat: null,
      areaLng: null,
      moveInDate: '',
      preferredGender: '',
    })
    setAreaInputValue('')
    setAreaSuggestions([])
    setShowAreaSuggestions(false)
  }

  const hasActiveFilters = filters.city || filters.area || filters.moveInDate || filters.preferredGender

  const handleAdvancedApply = async (state: ListingFilterState) => {
    setIsFilterOpen(false)
    setIsLoading(true)
    try {
      setAdvancedFilters(state)
      const backendFilters: any = {}

      // Include basic explore filters (city/area/date/gender) where relevant
      if (filters.city) backendFilters.city = filters.city
      if (filters.area) backendFilters.area = filters.area
      if (filters.areaLat != null) backendFilters.areaLat = filters.areaLat
      if (filters.areaLng != null) backendFilters.areaLng = filters.areaLng
      if (filters.moveInDate) backendFilters.moveInDate = filters.moveInDate

      // Gender: popup selection overrides inline selection for consistency
      if (state.preferredGender) {
        handleFilterChange('preferredGender', state.preferredGender)
      }
      const effectiveGender = state.preferredGender || filters.preferredGender
      if (effectiveGender) {
        backendFilters.preferredGender = effectiveGender
      }

      if (state.minRent != null && state.minRent > 0) backendFilters.minRent = state.minRent
      if (state.maxRent != null && state.maxRent > 0) backendFilters.maxRent = state.maxRent
      if (state.roomTypes.length) backendFilters.roomTypes = state.roomTypes
      if (state.bhkTypes.length) backendFilters.bhkTypes = state.bhkTypes
      if (state.furnishingLevels.length) backendFilters.furnishingLevels = state.furnishingLevels
      if (state.bathroomTypes.length) backendFilters.bathroomTypes = state.bathroomTypes
      if (state.lgbtqFriendly) backendFilters.lgbtqFriendly = true

      const listings = await listingsApi.getAllPublic('live', backendFilters)
      const mappedListings: Listing[] = listings.map((listing: ListingResponse) => ({
        id: listing._id || listing.id,
        title: listing.title,
        city: listing.city || '',
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
        mikoTags: listing.mikoTags,
        lgbtqFriendly: listing.lgbtqFriendly,
      }))
      setExploreListings(mappedListings)
    } catch (error) {
      console.error('Error applying advanced filters in dashboard explore:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdvancedClear = async () => {
    setAdvancedFilters(null)
    setIsFilterOpen(false)
    setIsLoading(true)
    try {
      const backendFilters: any = {}
      if (filters.city) backendFilters.city = filters.city
      if (filters.area) backendFilters.area = filters.area
      if (filters.areaLat != null) backendFilters.areaLat = filters.areaLat
      if (filters.areaLng != null) backendFilters.areaLng = filters.areaLng
      if (filters.moveInDate) backendFilters.moveInDate = filters.moveInDate
      // Do NOT send preferredGender here so inline gender becomes a pure client-side filter again

      const listings = await listingsApi.getAllPublic('live', backendFilters)
      const mappedListings: Listing[] = listings.map((listing: ListingResponse) => ({
        id: listing._id || listing.id,
        title: listing.title,
        city: listing.city || '',
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
        mikoTags: listing.mikoTags,
        lgbtqFriendly: listing.lgbtqFriendly,
      }))
      setExploreListings(mappedListings)
    } catch (error) {
      console.error('Error clearing advanced filters in dashboard explore:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch area suggestions when user types
  useEffect(() => {
    // If we're programmatically setting the area input after a selection,
    // skip one autocomplete call to avoid an extra API hit.
    if (skipNextAreaFetchRef.current) {
      skipNextAreaFetchRef.current = false
      return
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined

    const fetchSuggestions = async () => {
      if (!areaInputValue || areaInputValue.trim().length < 2 || !filters.city) {
        setAreaSuggestions([])
        setShowAreaSuggestions(false)
        return
      }
      setIsLoadingArea(true)
      try {
        const results = await placesApi.getAutocomplete(areaInputValue.trim(), filters.city)
        setAreaSuggestions(results)
        setShowAreaSuggestions(results.length > 0)
      } catch (error) {
        console.error('Error fetching area suggestions:', error)
        setAreaSuggestions([])
        setShowAreaSuggestions(false)
      } finally {
        setIsLoadingArea(false)
      }
    }

    timeoutId = setTimeout(fetchSuggestions, 300)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [areaInputValue, filters.city])
  useEffect(() => {
    const updateAreaDropdownPosition = () => {
      if (showAreaSuggestions && areaInputRef.current) {
        const rect = areaInputRef.current.getBoundingClientRect()
        setAreaDropdownPosition({
          top: rect.bottom + 8,
          left: rect.left,
          width: rect.width
        })
      }
    }
    if (showAreaSuggestions) {
      updateAreaDropdownPosition()
      window.addEventListener('scroll', updateAreaDropdownPosition, true)
      window.addEventListener('resize', updateAreaDropdownPosition)
    }
    return () => {
      window.removeEventListener('scroll', updateAreaDropdownPosition, true)
      window.removeEventListener('resize', updateAreaDropdownPosition)
    }
  }, [showAreaSuggestions])

  const handleAreaSuggestionSelect = async (prediction: AutocompletePrediction) => {
    // Prevent the next useEffect run from firing autocomplete again
    skipNextAreaFetchRef.current = true
    setAreaInputValue(prediction.structured_formatting.main_text)
    setShowAreaSuggestions(false)
    setAreaSuggestions([])

    try {
      const placeDetails = await placesApi.getPlaceDetails(prediction.place_id)
      setFilters(prev => ({
        ...prev,
        area: prediction.structured_formatting.main_text,
        areaPlaceId: placeDetails.place_id,
        areaLat: placeDetails.geometry.location.lat,
        areaLng: placeDetails.geometry.location.lng,
      }))
    } catch (error) {
      console.error('Error fetching area details:', error)
      setFilters(prev => ({
        ...prev,
        area: prediction.structured_formatting.main_text,
        areaPlaceId: prediction.place_id,
      }))
    }
  }

  const formatRent = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const renderMikoTags = () => {
    if (!showMikoTags || !isMikoMode || mikoTags.length === 0) return null
    return (
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-600">
        <span className="px-2 py-1 rounded-full bg-orange-50 text-orange-600 font-semibold border border-orange-200">
          Miko Vibe Active
        </span>
        <MikoTagPills tags={mikoTags} max={4} />
        {showClearMiko && (
          <button
            onClick={() => {
              setIsMikoMode(false)
              setMikoTags([])
              setRoomTypePreference(null)
            }}
            className="text-orange-600 font-semibold hover:text-orange-700"
          >
            Clear Miko
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20">
      {!hideFilters ? (
        <section className="relative z-10 w-full bg-white/50 backdrop-blur-sm border-b border-gray-200 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1 relative z-20">
              <CustomSelect
                label="City"
                value={filters.city}
                onValueChange={(value) => handleFilterChange('city', value)}
                placeholder="Select your city"
                options={[
                  { value: 'Pune', label: 'Pune' },
                ]}
              />
            </div>
            {filters.city && (
              <div ref={areaInputRef} className="flex-1 relative z-20">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Area
                </label>
                <input
                  type="text"
                  value={areaInputValue}
                  onChange={(e) => setAreaInputValue(e.target.value)}
                  placeholder="Search area (e.g., Baner, Wakad)"
                  className="w-full h-[52px] px-4 rounded-xl border border-mokogo-gray focus:outline-none focus:ring-2 focus:ring-mokogo-primary bg-white/80 text-base sm:text-sm"
                />
                {showAreaSuggestions && typeof document !== 'undefined' && createPortal(
                  <div
                    className="fixed z-[99999] bg-white border border-gray-200 rounded-xl shadow-xl max-h-[50vh] sm:max-h-60 overflow-auto"
                    style={{
                      top: `${areaDropdownPosition.top}px`,
                      left: `${areaDropdownPosition.left}px`,
                      width: `${Math.max(areaDropdownPosition.width, 200)}px`
                    }}
                  >
                    {isLoadingArea ? (
                      <div className="px-4 py-3 text-sm text-gray-500">Searching areas...</div>
                    ) : (
                      areaSuggestions.map(prediction => (
                        <button
                          key={prediction.place_id}
                          type="button"
                          onClick={() => handleAreaSuggestionSelect(prediction)}
                          className="w-full text-left px-4 py-3 sm:py-2 min-h-[48px] sm:min-h-0 flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 hover:bg-orange-50 active:bg-orange-50 text-sm text-gray-700"
                        >
                          <span className="font-medium truncate">
                            {prediction.structured_formatting.main_text}
                          </span>
                          <span className="text-xs text-gray-500 truncate sm:max-w-none">
                            {prediction.structured_formatting.secondary_text}
                          </span>
                        </button>
                      ))
                    )}
                  </div>,
                  document.body
                )}
            </div>
            )}
            <div className="flex-1 relative z-20 [&_button]:h-[52px] [&_button]:py-0">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Move-in Date
              </label>
              <MoveInDateField
                value={filters.moveInDate}
                onChange={(date) => handleFilterChange('moveInDate', date)}
                min={new Date().toISOString().split('T')[0]}
                hideLabel={true}
                numberOfMonths={1}
                className="!h-[52px] !rounded-xl !border !border-mokogo-gray"
              />
            </div>
            <div className="flex-1 relative z-20">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Gender Preference
              </label>
              <CustomSelect
                label=""
                value={filters.preferredGender}
                onValueChange={(value) => handleFilterChange('preferredGender', value)}
                placeholder="Select"
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Any', label: 'Any' },
                ]}
              />
            </div>
            <div className="flex flex-wrap items-end gap-3 w-full md:w-auto">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="h-[52px] min-h-[44px] px-4 sm:px-6 rounded-xl border border-mokogo-gray bg-white/80 hover:bg-white transition-colors text-gray-700 font-medium whitespace-nowrap"
                >
                  Clear Filters
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className="h-[52px] min-h-[44px] px-4 sm:px-5 rounded-xl border border-orange-300 bg-white text-xs font-semibold text-orange-600 shadow-sm hover:bg-orange-50 flex items-center gap-2"
              >
                <span>Filter</span>
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-[11px] text-white">
                  {advancedFilterCount}
                </span>
              </button>
            </div>
          </div>
            {renderMikoTags()}
          </div>
        </section>
      ) : (
        <section className="relative z-10 w-full bg-white/50 backdrop-blur-sm border-b border-gray-200 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {headerTitle || 'MIKO Vibe Search Results'}
              </h2>
              {headerSubtitle && (
                <p className="text-sm text-gray-600">{headerSubtitle}</p>
              )}
            </div>
            {renderMikoTags()}
          </div>
        </section>
      )}

      {/* Listings Grid */}
      <section className="py-6 sm:py-8 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="text-center py-16 text-gray-600">
              Loading listings...
            </div>
          ) : sortedListings.length > 0 ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <p className="text-sm text-gray-700">
                  {sortedListings.length} {sortedListings.length === 1 ? 'place' : 'places'} found
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Sort by</span>
                  <div className="w-48">
                    <CustomSelect
                      label=""
                      value={sortOption}
                      onValueChange={(value) =>
                        setSortOption(value as 'rent_low_high' | 'rent_high_low' | 'newest')
                      }
                      placeholder="Select"
                      options={[
                        { value: 'rent_low_high', label: 'Rent: Low to High' },
                        { value: 'rent_high_low', label: 'Rent: High to Low' },
                        { value: 'newest', label: 'Newest Listings' },
                      ]}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 items-stretch">
              {sortedListings.map((listing) => {
                const listingTags = getListingMikoTags(listing)
                const matchPercent = isMikoMode ? getMikoMatchPercent(mikoTags, listingTags) : 0
                const saved = isListingSaved(listing.id)
                const handleToggleSave = () => {
                  const willSave = !saved
                  const request = willSave
                    ? usersApi.saveListing(listing.id)
                    : usersApi.removeSavedListing(listing.id)
                  request
                    .then((updated) => {
                      setSavedListings(updated)
                    })
                    .catch(() => {
                      // Fallback to local toggle if API fails
                      toggleSavedListing(listing.id)
                    })
                }
                return (
                <button
                  key={listing.id}
                  onClick={() => onListingClick(listing.id)}
                  className="bg-white/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group border border-white/60 text-left flex flex-col h-full"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden rounded-t-2xl">
                    {listing.photos && listing.photos.length > 0 ? (
                      <img
                        src={listing.photos[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-2xl"
                      />
                    ) : (
                      <div className="w-full h-full bg-mokogo-gray flex items-center justify-center rounded-t-2xl">
                        <Home className="w-12 h-12 text-gray-400" />
                      </div>
                    )}

                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
                      {getListingBadgeLabel(listing) && (
                        <span className="pointer-events-none inline-flex max-w-[75%] px-3 py-1 bg-mokogo-primary text-white rounded-full text-xs font-medium shadow-md whitespace-normal break-words">
                          {getListingBadgeLabel(listing)}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleToggleSave()
                        }}
                        className="pointer-events-auto w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors z-20 flex-shrink-0"
                        aria-label={saved ? 'Unsave property' : 'Save property'}
                      >
                        <Heart className={`w-5 h-5 ${saved ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                      </button>
                    </div>

                    {isMikoMode && mikoTags.length > 0 && (
                      <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-orange-600 rounded-full border border-orange-200 shadow-sm">
                        {matchPercent}% Vibe Match
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm">
                        {listing.title.split('·')[0].trim()}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{listing.locality}, {listing.city}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{listing.bhkType}</span>
                      <span>•</span>
                      <span>{listing.furnishingLevel}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-auto flex-nowrap">
                      <div className="min-w-0 flex-1">
                        <p className="text-xl font-bold text-gray-900 truncate">{formatRent(listing.rent)}</p>
                        <p className="text-xs text-gray-600">per month</p>
                      </div>
                      <span className="btn-primary text-sm px-4 py-2 inline-block text-center flex-shrink-0 whitespace-nowrap min-w-[100px]">
                        View Details
                      </span>
                    </div>
                  </div>
                </button>
              )})}
            </div>
            </>
          ) : (
            <div className="text-center py-16 space-y-4">
              <div className="w-24 h-24 mx-auto bg-mokogo-primary/10 rounded-full flex items-center justify-center">
                <Home className="w-12 h-12 text-mokogo-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">No properties found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Try adjusting your filters to see more results
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="btn-primary mt-4"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {!hideFilters && (
        <ListingFilters
          open={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={handleAdvancedApply}
          onClear={handleAdvancedClear}
          initialValues={advancedFilters ?? undefined}
        />
      )}
    </div>
  )
}

export default ExploreContent
