import { Bed, Bath, Calendar } from 'lucide-react'
import { Listing } from '@/types'
import { formatPrice, formatDate } from '@/utils/formatters'

interface RoomDetailsProps {
  listing: Listing
  className?: string
}

const RoomDetails = ({ listing, className = '' }: RoomDetailsProps) => {
  const containerClass = 'bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/35 p-4 sm:p-5'
  const titleClass = 'text-lg font-bold'
  const priceClass = 'text-xl font-bold'
  const gridClass = 'grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4'
  const cardClass = 'text-center p-3 bg-stone-50 rounded-lg'
  const iconClass = 'w-6 h-6'
  const textClass = 'text-sm font-semibold'
  const subtextClass = 'text-xs text-gray-600'
  const descriptionTitleClass = 'text-base font-semibold'
  const descriptionTextClass = 'text-sm text-gray-700'
  const borderClass = 'border-t border-stone-200 pt-4'
  const spacingClass = 'mb-3'

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={titleClass}>Room Details</h2>
        <div className="text-right">
          <div className={priceClass}>₹{formatPrice(listing.rent)}</div>
          <div className="text-sm text-gray-600">per month</div>
        </div>
      </div>

      <div className={gridClass}>
        <div className={cardClass}>
          <Bed className={`${iconClass} text-orange-400 mx-auto mb-2`} />
          <div className={textClass}>{listing.bhkType}</div>
          <div className={subtextClass}>{listing.roomType}</div>
        </div>
        <div className={cardClass}>
          <Bath className={`${iconClass} text-orange-400 mx-auto mb-2`} />
          <div className={textClass}>1 Bathroom</div>
          <div className={subtextClass}>Dedicated</div>
        </div>
        <div className={cardClass}>
          <Calendar className={`${iconClass} text-orange-400 mx-auto mb-2`} />
          <div className={textClass}>Available</div>
          <div className={subtextClass}>{formatDate(listing.moveInDate)}</div>
        </div>
      </div>

      {listing.description && listing.description.trim() && (
        <div className={borderClass}>
          <h3 className={`${descriptionTitleClass} text-gray-900 ${spacingClass}`}>Description</h3>
          <p className={`${descriptionTextClass} leading-relaxed ${spacingClass}`}>
            {listing.description}
          </p>
        </div>
      )}
    </div>
  )
}

export default RoomDetails
