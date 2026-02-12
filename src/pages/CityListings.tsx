import { useState, useMemo, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CustomSelect from '@/components/CustomSelect'
import { MoveInDateField } from '@/components/MoveInDateField'
import { formatRent } from '@/utils/formatters'
import { placesApi, AutocompletePrediction, listingsApi, ListingResponse } from '@/services/api'
import { Listing } from '@/types'
import { getListingBadgeLabel } from '@/utils/listingTags'
import ListingFilters, { ListingFilterState } from '@/components/ListingFilters'

const CityListings = () => {
  const { cityName } = useParams<{ cityName: string }>()
  const navigate = useNavigate()

  // Scroll to top when component mounts or city changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [cityName])

  // Filter state (inline / base filters)
  const [filters, setFilters] = useState({
    area: '',
    moveInDate: '',
    genderPreference: ''
  })

  // Advanced filter popup state
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState<ListingFilterState | null>(null)

  // City listings from server (already filtered by advanced filters if applied)
  const [cityListingsBase, setCityListingsBase] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Area autocomplete state
  const [areaInputValue, setAreaInputValue] = useState('')
  const [areaSuggestions, setAreaSuggestions] = useState<AutocompletePrediction[]>([])
  const [showAreaSuggestions, setShowAreaSuggestions] = useState(false)
  const [isLoadingArea, setIsLoadingArea] = useState(false)
  const areaInputRef = useRef<HTMLInputElement | null>(null)
  const areaSuggestionsRef = useRef<HTMLDivElement | null>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const skipNextAreaFetchRef = useRef(false)

  // Decode the city name from URL
  const decodedCityName = cityName ? decodeURIComponent(cityName) : ''
  
  // Get all listings for the city from backend (server-side filtering)
  useEffect(() => {
    const fetchCityListings = async () => {
      if (!decodedCityName) {
        setCityListingsBase([])
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      try {
        const backendFilters: any = { city: decodedCityName }
        const listings = await listingsApi.getAllPublic('live', backendFilters)
        const mapped: Listing[] = listings.map((listing: ListingResponse) => ({
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
        setCityListingsBase(mapped)
      } catch (error) {
        console.error('Error fetching city listings:', error)
        setCityListingsBase([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCityListings()
  }, [decodedCityName])

  // Apply filters to listings
  const cityListings = useMemo(() => {
    return cityListingsBase.filter(listing => {
      // Area filter
      if (filters.area && listing.locality !== filters.area) {
        return false
      }
      
      // Move-in Date filter
      // Business rule: show listings available ON or BEFORE the seeker's desired move-in date
      // i.e., listing.moveInDate <= filters.moveInDate (date-only comparison)
      if (filters.moveInDate) {
        const filterDate = new Date(filters.moveInDate)
        filterDate.setHours(0, 0, 0, 0) // Reset time for accurate comparison
        const listingDate = new Date(listing.moveInDate)
        listingDate.setHours(0, 0, 0, 0)
        // Show listings where listing's date is on or before the chosen date
        if (listingDate > filterDate) {
          return false
        }
      }
      
      // Gender Preference filter
      // Note: 'Any' should behave like "no restriction", so only apply when a specific gender is selected
      if (filters.genderPreference && filters.genderPreference !== 'Any') {
        // If filter is set and listing has a preference, they must match
        // If listing preference is 'Any', it matches all filters
        if (listing.preferredGender && listing.preferredGender !== 'Any') {
          if (listing.preferredGender !== filters.genderPreference) {
            return false
          }
        }
      }
      
      return true
    })
  }, [cityListingsBase, filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))

    // If advanced filters are active and gender changes inline,
    // re-apply advanced filters with the new gender so results update
    if (key === 'genderPreference' && advancedFilters) {
      const nextState: ListingFilterState = {
        ...advancedFilters,
        preferredGender: value || undefined,
      }
      setAdvancedFilters(nextState)
      void handleAdvancedApply(nextState)
    }
  }

  const clearFilters = () => {
    setFilters({
      area: '',
      moveInDate: '',
      genderPreference: ''
    })
    setAreaInputValue('')
    setAreaSuggestions([])
    setShowAreaSuggestions(false)
  }

  const hasActiveFilters = filters.area || filters.moveInDate || filters.genderPreference

  const cityFilterCount = useMemo(() => {
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

  const handleAdvancedApply = async (state: ListingFilterState) => {
    if (!decodedCityName) return
    setIsFilterOpen(false)
    setIsLoading(true)
    try {
      setAdvancedFilters(state)
      const backendFilters: any = { city: decodedCityName }

      // keep inline/base filters as server filters where it makes sense
      if (filters.area) backendFilters.area = filters.area
      if (filters.moveInDate) backendFilters.moveInDate = filters.moveInDate
      // Gender: popup selection overrides inline selection for consistency
      if (state.preferredGender) {
        setFilters(prev => ({ ...prev, genderPreference: state.preferredGender! }))
      }
      const effectiveGender = state.preferredGender || filters.genderPreference
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
      const mapped: Listing[] = listings.map((listing: ListingResponse) => ({
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
      setCityListingsBase(mapped)
    } catch (error) {
      console.error('Error applying city filters:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdvancedClear = async () => {
    if (!decodedCityName) return
    setAdvancedFilters(null)
    setIsFilterOpen(false)
    setIsLoading(true)
    try {
      const backendFilters: any = { city: decodedCityName }
      if (filters.area) backendFilters.area = filters.area
      if (filters.moveInDate) backendFilters.moveInDate = filters.moveInDate
      // Do NOT send gender here so inline gender becomes a pure client-side filter again

      const listings = await listingsApi.getAllPublic('live', backendFilters)
      const mapped: Listing[] = listings.map((listing: ListingResponse) => ({
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
      setCityListingsBase(mapped)
    } catch (error) {
      console.error('Error clearing city filters:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch area suggestions when user types
  useEffect(() => {
    // Skip one fetch if we just selected a suggestion
    if (skipNextAreaFetchRef.current) {
      skipNextAreaFetchRef.current = false
      return
    }

    if (!decodedCityName) {
      setAreaSuggestions([])
      setShowAreaSuggestions(false)
      return
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (!areaInputValue || areaInputValue.trim().length < 2) {
      setAreaSuggestions([])
      setShowAreaSuggestions(false)
      return
    }

    debounceTimerRef.current = setTimeout(async () => {
      setIsLoadingArea(true)
      try {
        const results = await placesApi.getAutocomplete(areaInputValue.trim(), decodedCityName)
        setAreaSuggestions(results)
        setShowAreaSuggestions(results.length > 0)
      } catch (error) {
        console.error('Error fetching area suggestions:', error)
        setAreaSuggestions([])
        setShowAreaSuggestions(false)
      } finally {
        setIsLoadingArea(false)
      }
    }, 300)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [areaInputValue, decodedCityName])

  const handleAreaSuggestionSelect = (prediction: AutocompletePrediction) => {
    skipNextAreaFetchRef.current = true
    setAreaInputValue(prediction.structured_formatting.main_text)
    setShowAreaSuggestions(false)
    setAreaSuggestions([])
    setFilters(prev => ({
      ...prev,
      area: prediction.structured_formatting.main_text,
    }))
  }

  // Close suggestions on outside click
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


  return (
    <div className="min-h-screen bg-mokogo-off-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-br from-mokogo-primary/30 to-mokogo-primary/20 py-4 md:py-5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/explore')}
                  className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-mokogo-primary transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Explore
                </button>
                <span className="text-gray-400">•</span>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Properties in <span className="text-mokogo-primary">{decodedCityName}</span>
                </h1>
              </div>
              <p className="text-sm text-gray-700">
                {cityListings.length} {cityListings.length === 1 ? 'property' : 'properties'} available
                {hasActiveFilters && (
                  <span className="text-mokogo-primary ml-1">
                    (filtered from {cityListingsBase.length})
                  </span>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="relative z-10 w-full bg-white/50 backdrop-blur-sm border-b border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1 relative z-20">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Area
                </label>
                <div className="relative">
                  <input
                    ref={areaInputRef}
                    type="text"
                    value={areaInputValue}
                    onChange={(e) => {
                      setAreaInputValue(e.target.value)
                      setFilters(prev => ({ ...prev, area: '' }))
                    }}
                    placeholder="Search area (e.g., Baner, Wakad)"
                    className="w-full h-[52px] px-4 rounded-xl border border-mokogo-gray focus:outline-none focus:ring-2 focus:ring-mokogo-primary bg-white/80"
                  />
                  {showAreaSuggestions && (
                    <div
                      ref={areaSuggestionsRef}
                      className="absolute mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-height-60 overflow-auto"
                    >
                      {isLoadingArea ? (
                        <div className="px-4 py-3 text-sm text-gray-500">Searching areas...</div>
                      ) : (
                        areaSuggestions.map(prediction => (
                          <button
                            key={prediction.place_id}
                            type="button"
                            onClick={() => handleAreaSuggestionSelect(prediction)}
                            className="w-full text-left px-4 py-2 hover:bg-orange-50 text-sm text-gray-700"
                          >
                            <div className="font-medium">
                              {prediction.structured_formatting.main_text}
                            </div>
                            <div className="text-xs text-gray-500">
                              {prediction.structured_formatting.secondary_text}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 relative z-20 [&_button]:h-[52px] [&_button]:py-0">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Move-in Date
                </label>
                <MoveInDateField
                  value={filters.moveInDate}
                  onChange={(date) => handleFilterChange('moveInDate', date)}
                  min={new Date().toISOString().split('T')[0]}
                  hideLabel={true}
                  className="!h-[52px] !rounded-xl !border !border-mokogo-gray"
                />
              </div>
              <div className="flex-1 relative z-20">
                <CustomSelect
                  label="Gender Preference"
                  value={filters.genderPreference}
                  onValueChange={(value) => handleFilterChange('genderPreference', value)}
                  placeholder="Select"
                  options={[
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Any', label: 'Any' }
                  ]}
                />
              </div>
              <div className="flex items-end gap-3">
                {hasActiveFilters && (
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2 opacity-0">
                      Clear
                    </label>
                    <button
                      onClick={clearFilters}
                      className="h-[52px] px-6 rounded-xl border border-mokogo-gray bg-white/80 hover:bg-white transition-colors text-gray-700 font-medium whitespace-nowrap"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2 opacity-0">
                    Filters
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(true)}
                    className="inline-flex items-center gap-2 h-[52px] px-4 rounded-xl border border-orange-300 bg-white text-xs font-semibold text-orange-600 shadow-sm hover:bg-orange-50"
                  >
                    <span>Filter</span>
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-[11px] text-white">
                      {cityFilterCount}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="py-8 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="text-center py-16 text-gray-600">
                Loading listings...
              </div>
            ) : cityListings.length > 0 ? (
              <>
                {/* Listings Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {cityListings.map((listing) => {
                  return (
                  <Link
                      key={listing.id}
                      to={`/listings/${listing.id}`}
                      className="bg-white/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group border border-white/60 block"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        {listing.photos && listing.photos.length > 0 ? (
                          <img
                            src={listing.photos[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-mokogo-gray" />
                        )}
                        {getListingBadgeLabel(listing) && (
                          <span className="absolute top-3 left-3 px-3 py-1 bg-mokogo-primary text-white rounded-full text-xs font-medium shadow-md z-10 whitespace-normal break-words">
                            {getListingBadgeLabel(listing)}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm">
                            {listing.title.split('·')[0].trim()}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="line-clamp-1">{listing.locality}, {listing.city}</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{listing.bhkType}</span>
                          <span>•</span>
                          <span>{listing.furnishingLevel}</span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                          <div>
                            <p className="text-xl font-bold text-gray-900">{formatRent(listing.rent)}</p>
                            <p className="text-xs text-gray-600">per month</p>
                          </div>
                          <span className="btn-primary text-sm px-4 py-2 inline-block text-center">
                            View Details
                          </span>
                        </div>
                      </div>
                    </Link>
                  )})}
                </div>
              </>
            ) : (
              <div className="text-center py-16 space-y-4">
                <div className="w-24 h-24 mx-auto bg-mokogo-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">No properties found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  We don't have any listings in {decodedCityName} at the moment. Check back soon or explore other cities!
                </p>
                <div className="flex gap-4 justify-center pt-4">
                  <button
                    onClick={() => navigate('/explore')}
                    className="btn-secondary"
                  >
                    Explore Other Cities
                  </button>
                  <Link to="/" className="btn-primary">
                    Back to Home
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <ListingFilters
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleAdvancedApply}
        onClear={handleAdvancedClear}
        initialValues={advancedFilters ?? undefined}
      />
    </div>
  )
}

export default CityListings

