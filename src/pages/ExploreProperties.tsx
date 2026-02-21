import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import { listingsApi, ListingResponse } from '@/services/api'
import { Listing, VibeTagId } from '@/types'
import { formatRent } from '@/utils/formatters'
import { getListingMikoTags } from '@/utils/miko'
import { getListingBadgeLabel } from '@/utils/listingTags'
import ListingFilters, { ListingFilterState } from '@/components/ListingFilters'
import CustomSelect from '@/components/CustomSelect'

const ExploreProperties = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [exploreListings, setExploreListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortOption, setSortOption] = useState<'rent_low_high' | 'rent_high_low' | 'newest'>('newest')

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const filters = useMemo(() => ({
    city: searchParams.get('city') || '',
    area: searchParams.get('area') || '',
    areaPlaceId: searchParams.get('areaPlaceId') || '',
    areaLat: searchParams.get('areaLat') ? parseFloat(searchParams.get('areaLat')!) : null,
    areaLng: searchParams.get('areaLng') ? parseFloat(searchParams.get('areaLng')!) : null,
    minRent: searchParams.get('minRent') || '',
    maxRent: searchParams.get('maxRent') || '',
    moveInDate: searchParams.get('moveInDate') || '',
    preferredGender: searchParams.get('preferredGender') || '',
    roomTypes: searchParams.get('roomTypes') ? searchParams.get('roomTypes')!.split(',').filter(Boolean) : [],
    bhkTypes: searchParams.get('bhkTypes') ? searchParams.get('bhkTypes')!.split(',').filter(Boolean) : [],
    furnishingLevels: searchParams.get('furnishingLevels') ? searchParams.get('furnishingLevels')!.split(',').filter(Boolean) : [],
    bathroomTypes: searchParams.get('bathroomTypes') ? searchParams.get('bathroomTypes')!.split(',').filter(Boolean) : [],
    lgbtqFriendly: searchParams.get('lgbtqFriendly') === '1',
  }), [searchParams])
  const roomTypePreference = useMemo(() => {
    const value = searchParams.get('roomType')
    if (value === 'private' || value === 'shared' || value === 'either') {
      return value
    }
    return null
  }, [searchParams])
  const mikoTags = useMemo(() => {
    const tags = searchParams.get('tags') || ''
    return tags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean) as VibeTagId[]
  }, [searchParams])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('openFilter') === '1') {
      setIsFilterOpen(true)
    }
  }, [location.search])

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true)
      try {
        // Build backend filter object
        const backendFilters: any = {}
        // Default to Pune when no city selected (Pune is the only active city)
        backendFilters.city = filters.city || 'Pune'
        if (filters.area) backendFilters.area = filters.area
        if (filters.areaLat != null) backendFilters.areaLat = filters.areaLat
        if (filters.areaLng != null) backendFilters.areaLng = filters.areaLng
        if (filters.minRent) backendFilters.minRent = parseInt(filters.minRent)
        if (filters.maxRent) backendFilters.maxRent = parseInt(filters.maxRent)
        if (filters.moveInDate) backendFilters.moveInDate = filters.moveInDate
        if (roomTypePreference) backendFilters.roomType = roomTypePreference
        if (filters.preferredGender) backendFilters.preferredGender = filters.preferredGender
        if (filters.roomTypes.length) backendFilters.roomTypes = filters.roomTypes
        if (filters.bhkTypes.length) backendFilters.bhkTypes = filters.bhkTypes
        if (filters.furnishingLevels.length) backendFilters.furnishingLevels = filters.furnishingLevels
        if (filters.bathroomTypes.length) backendFilters.bathroomTypes = filters.bathroomTypes
        if (filters.lgbtqFriendly) backendFilters.lgbtqFriendly = true

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
        console.error('Error fetching public listings:', error)
        setExploreListings([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchListings()
  }, [
    filters.city,
    filters.area,
    filters.areaLat,
    filters.areaLng,
    filters.minRent,
    filters.maxRent,
    filters.moveInDate,
    filters.preferredGender,
    filters.roomTypes.join(','),
    filters.bhkTypes.join(','),
    filters.furnishingLevels.join(','),
    filters.bathroomTypes.join(','),
    filters.lgbtqFriendly,
    roomTypePreference,
  ])
  const handleApplyFilters = (state: ListingFilterState) => {
    const params = new URLSearchParams(location.search)
    if (state.minRent != null && state.minRent > 0) {
      params.set('minRent', String(state.minRent))
    } else {
      params.delete('minRent')
    }
    if (state.maxRent != null && state.maxRent > 0) {
      params.set('maxRent', String(state.maxRent))
    } else {
      params.delete('maxRent')
    }
    if (state.preferredGender) {
      params.set('preferredGender', state.preferredGender)
    } else {
      params.delete('preferredGender')
    }
    if (state.roomTypes.length) {
      params.set('roomTypes', state.roomTypes.join(','))
    } else {
      params.delete('roomTypes')
    }
    if (state.bhkTypes.length) {
      params.set('bhkTypes', state.bhkTypes.join(','))
    } else {
      params.delete('bhkTypes')
    }
    if (state.furnishingLevels.length) {
      params.set('furnishingLevels', state.furnishingLevels.join(','))
    } else {
      params.delete('furnishingLevels')
    }
    if (state.bathroomTypes.length) {
      params.set('bathroomTypes', state.bathroomTypes.join(','))
    } else {
      params.delete('bathroomTypes')
    }
    if (state.lgbtqFriendly) {
      params.set('lgbtqFriendly', '1')
    } else {
      params.delete('lgbtqFriendly')
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true })
  }

  const handleClearFilterParams = () => {
    const params = new URLSearchParams(location.search)
    ;['minRent','maxRent','preferredGender','roomTypes','bhkTypes','furnishingLevels','bathroomTypes','lgbtqFriendly'].forEach(key => params.delete(key))
    navigate(`${location.pathname}?${params.toString()}`, { replace: true })
  }

  // Backend already handles filtering, but we still need to filter by Miko tags on client side
  const filteredListings = useMemo(() => {
    // Backend returns filtered and sorted listings, we only need to filter by Miko tags
    if (mikoTags.length === 0) {
      return exploreListings
    }

    return exploreListings.filter(listing => {
      const listingTags = getListingMikoTags(listing)
      return listingTags.some(tag => mikoTags.includes(tag))
    })
  }, [exploreListings, mikoTags])

  const sortedListings = useMemo(() => {
    const base = [...filteredListings]

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
  }, [filteredListings, sortOption])

  // Calculate listings count per city from actual fetched listings (no exaggerated fallbacks)
  const getCityListingsCount = (cityName: string) => {
    return exploreListings.filter(l => l.city === cityName && l.status === 'live').length
  }

  const cities = [
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
      name: 'Hyderabad', 
      image: '/hyderabad-city.png', 
      listings: getCityListingsCount('Hyderabad'),
      active: false
    },
    { 
      name: 'Bangalore', 
      image: '/bangalore-city.png', 
      listings: getCityListingsCount('Bangalore'),
      active: false
    },
    {
      name: 'Delhi NCR',
      image: '/delhi-city.png',
      listings: getCityListingsCount('Delhi NCR'),
      active: false
    }
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <SocialSidebar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100/50 to-orange-50 px-6 md:px-[10%] pt-16 pb-16 sm:pt-20 sm:pb-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.15),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.12),transparent_60%),radial-gradient(circle_at_center,rgba(254,215,170,0.10),transparent_65%),radial-gradient(circle_at_top_right,rgba(255,237,213,0.08),transparent_70%)]" />
          
          <div className="relative mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/50 bg-orange-200/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-orange-800/80">
              Discover • Top Cities
            </span>
            <h1 className="mt-6 text-3xl sm:text-4xl lg:text-[2.9rem] font-bold leading-tight text-gray-900">
              Find rooms, without{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  brokers
                </span>
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-orange-200/40 -z-0 transform -skew-x-12" />
              </span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl leading-relaxed text-gray-800">
              Discover verified listings in your favorite cities. Find your perfect room and roommate.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="relative px-6 md:px-[10%] pt-10 pb-16 sm:pt-12 sm:pb-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#fef4f1] via-transparent to-transparent" />
          
          <div className="relative mx-auto max-w-7xl">
            {/* Cities Grid + Filter CTA */}
            <div className="mb-16">
              <div className="text-center space-y-3 mb-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/50 bg-orange-200/30 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-orange-800/80">
                  Browse by City
                </span>
                <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                  Browse properties in active cities
                </h2>
                  
                </div>
                <p className="text-gray-700 text-base max-w-2xl mx-auto">
                  Starting with Pune. More cities coming soon.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5 lg:gap-6">
                {cities.map((city, index) => {
                  const wrapperClasses = [
                    'group relative h-52 md:h-56 rounded-xl overflow-hidden shadow-lg border border-orange-200/30 block transform transition-all duration-300',
                    city.active
                      ? 'cursor-pointer hover:shadow-2xl hover:shadow-orange-500/20 hover:border-orange-400 hover:scale-105'
                      : 'cursor-not-allowed opacity-70 grayscale'
                  ].join(' ')

                  const cardContent = (
                    <>
                      {/* Image */}
                      <img
                        src={city.image}
                        alt={city.name}
                        className={`w-full h-full object-cover ${city.active ? 'group-hover:scale-110 transition-transform duration-700' : ''}`}
                      />
                      
                      {/* Gradient Overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent ${
                          city.active ? 'group-hover:from-black/90 group-hover:via-black/40 transition-all duration-300' : ''
                        }`}
                      />
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`text-xl md:text-2xl font-bold ${city.active ? 'group-hover:text-orange-300 transition-colors duration-300' : ''}`}>
                            {city.name}
                          </h3>
                          {city.active && (
                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                              <div className="bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg">
                                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                        {city.active ? (
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 group-hover:bg-orange-300 transition-colors duration-300" />
                            <p className="text-sm text-white/90 font-medium">
                              {city.listings} Properties
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-white/90 font-medium">Coming soon</p>
                        )}
                      </div>

                      {/* Top Badge */}
                      {city.active ? (
                        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                          <div className="bg-orange-500/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                            Explore
                          </div>
                        </div>
                      ) : (
                        <div className="absolute top-4 left-4">
                          <div className="bg-gray-800/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                            Coming soon
                          </div>
                        </div>
                      )}

                      {/* Shine Effect */}
                      {city.active && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      )}
                    </>
                  )

                  return city.active ? (
                    <Link
                      key={city.name}
                      to={`/city/${encodeURIComponent(city.name)}`}
                      className={wrapperClasses}
                      style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                    >
                      {cardContent}
                    </Link>
                  ) : (
                    <div
                      key={city.name}
                      className={wrapperClasses}
                      style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                    >
                      {cardContent}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Listings Grid */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {isLoading ? 'Loading...' : `${sortedListings.length} Available Properties`}
                </h2>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 text-xs md:text-sm">
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
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-white px-4 py-2 text-xs font-semibold text-orange-600 shadow-sm hover:bg-orange-50"
                  >
                    <span>Filter</span>
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-[11px] text-white">
                      {[
                        filters.maxRent,
                        filters.minRent,
                        filters.preferredGender,
                        filters.roomTypes.length,
                        filters.bhkTypes.length,
                        filters.furnishingLevels.length,
                        filters.bathroomTypes.length,
                        filters.lgbtqFriendly,
                      ].filter(Boolean).length}
                    </span>
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    <p className="mt-4 text-gray-600">Loading listings...</p>
                  </div>
                </div>
              ) : sortedListings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No listings available at the moment. Check back soon!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {sortedListings.map((listing) => {
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
                            <span className="absolute top-3 left-3 px-3 py-1 bg-mokogo-primary text-white rounded-full text-xs font-medium shadow-md truncate">
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

                          <div className="flex items-center justify-between pt-2 border-t border-gray-200 flex-nowrap">
                            <div className="min-w-0 flex-1">
                              <p className="text-xl font-bold text-gray-900 truncate">{formatRent(listing.rent)}</p>
                              <p className="text-xs text-gray-600">per month</p>
                            </div>
                            <span className="btn-primary text-sm px-4 py-2 inline-block text-center flex-shrink-0 whitespace-nowrap min-w-[100px]">
                              View Details
                            </span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <ListingFilters
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        onClear={handleClearFilterParams}
        initialValues={{
          minRent: filters.minRent ? parseInt(filters.minRent) : undefined,
          maxRent: filters.maxRent ? parseInt(filters.maxRent) : undefined,
          preferredGender: filters.preferredGender || undefined,
          roomTypes: filters.roomTypes,
          bhkTypes: filters.bhkTypes,
          furnishingLevels: filters.furnishingLevels,
          bathroomTypes: filters.bathroomTypes,
          lgbtqFriendly: filters.lgbtqFriendly,
        }}
      />
    </div>
  )
}

export default ExploreProperties
