import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import type { FeaturedListingItem } from '../types'

interface FeaturedListingsSectionProps {
  listings: FeaturedListingItem[]
  locationState?: 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported' | 'no_listings'
}

const FeaturedListingsSection = ({ listings, locationState = 'idle' }: FeaturedListingsSectionProps) => {
  if (locationState !== 'granted' || !listings.length) {
    return null
  }

  return (
    <section className="space-y-6 py-6 md:py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center md:relative">
        <h2 className="text-3xl font-bold text-gray-900">Recent Listings Near You</h2>
        <Link
          to="/explore"
          className="inline-flex items-center rounded-full border-2 border-orange-500 bg-white px-5 py-2.5 text-sm font-semibold text-orange-500 shadow-sm transition-colors hover:bg-orange-50 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2"
        >
          Browse All →
        </Link>
      </div>

      <div className="marquee-container overflow-hidden">
        <div className="featured-marquee-track flex w-max gap-5 py-2">
          {listings.map((listing, index) => (
            <Link
              key={`${listing.id}-${index}`}
              to="/explore"
              className="w-[290px] flex-shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={listing.image} alt={listing.title} className="h-full w-full object-cover" />
                <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-800 shadow">
                  {listing.furnishing}
                </span>
              </div>
              <div className="space-y-3 p-4">
                <h3 className="text-base font-semibold text-gray-900">{listing.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  <span>{listing.location}</span>
                </div>
                <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  {listing.preference}
                </span>
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <p className="text-2xl font-bold text-gray-900">{listing.price}</p>
                  <span className="rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white">
                    View Details
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedListingsSection
