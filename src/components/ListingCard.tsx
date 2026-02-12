import { Link } from 'react-router-dom'
import { Heart, MapPin, Home } from 'lucide-react'
import { Listing } from '@/types'
import { getListingBadgeLabel } from '@/utils/listingTags'
import { formatRent } from '@/utils/formatters'

interface ListingCardProps {
  listing: Listing
  isSaved: boolean
  onToggleSave?: () => void
  to?: string
  onClick?: () => void
  ctaLabel?: string
  showMetaRow?: boolean
  mikoMatchPercent?: number
  showMikoBadge?: boolean
  className?: string
}

const ListingCard = ({
  listing,
  isSaved,
  onToggleSave,
  to,
  onClick,
  ctaLabel = 'View Details',
  showMetaRow = true,
  mikoMatchPercent,
  showMikoBadge = false,
  className = '',
}: ListingCardProps) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (to) {
      return (
        <Link
          to={to}
          className={`bg-white/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group border border-white/60 block ${className}`}
        >
          {children}
        </Link>
      )
    }

    return (
      <button
        type="button"
        onClick={onClick}
        className={`bg-white/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group border border-white/60 text-left flex flex-col h-full ${className}`}
      >
        {children}
      </button>
    )
  }

  return (
    <Wrapper>
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

        {onToggleSave && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleSave()
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors z-20"
            aria-label={isSaved ? 'Unsave property' : 'Save property'}
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
          </button>
        )}

        {getListingBadgeLabel(listing) && (
          <span className="absolute top-3 left-3 max-w-[80%] px-3 py-1 bg-mokogo-primary text-white rounded-full text-xs font-medium shadow-md truncate">
            {getListingBadgeLabel(listing)}
          </span>
        )}

        {showMikoBadge && mikoMatchPercent != null && mikoMatchPercent > 0 && (
          <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-orange-600 rounded-full border border-orange-200 shadow-sm">
            {mikoMatchPercent}% Vibe Match
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm">
            {listing.title ? listing.title.split('·')[0].trim() : 'Untitled Listing'}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <MapPin className="w-4 h-4" />
          <span className="line-clamp-1">
            {listing.locality || listing.city || 'Location'}
          </span>
        </div>

        {showMetaRow && (listing.bhkType || listing.furnishingLevel) && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {listing.bhkType && <span>{listing.bhkType}</span>}
            {listing.bhkType && listing.furnishingLevel && <span>•</span>}
            {listing.furnishingLevel && <span>{listing.furnishingLevel}</span>}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-auto flex-nowrap">
          <div className="min-w-0 flex-1">
            {!!listing.rent && (
              <>
                <p className="text-xl font-bold text-gray-900 truncate">
                  {formatRent(listing.rent)}
                </p>
                <p className="text-xs text-gray-600">per month</p>
              </>
            )}
          </div>
          <span className="btn-primary text-sm px-4 py-2 inline-block text-center flex-shrink-0 whitespace-nowrap min-w-[100px]">
            {ctaLabel}
          </span>
        </div>
      </div>
    </Wrapper>
  )
}

export default ListingCard

