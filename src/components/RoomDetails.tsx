import { Bed, Bath, Calendar } from 'lucide-react'
import { Listing } from '@/types'
import { formatPrice, formatDate } from '@/utils/formatters'

interface RoomDetailsProps {
  listing: Listing
  className?: string
  compact?: boolean
}

const RoomDetails = ({ listing, className = '', compact = false }: RoomDetailsProps) => {
  const containerClass = compact
    ? 'bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/35 p-5'
    : 'bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/35 p-8'
  
  const titleClass = compact ? 'text-lg font-bold' : 'text-2xl font-bold'
  const priceClass = compact ? 'text-xl font-bold' : 'text-3xl font-bold'
  const gridClass = compact ? 'grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4' : 'grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8'
  const cardClass = compact ? 'text-center p-3 bg-stone-50 rounded-lg' : 'text-center p-4 bg-stone-50 rounded-xl'
  const iconClass = compact ? 'w-6 h-6' : 'w-8 h-8'
  const textClass = compact ? 'text-sm font-semibold' : 'font-semibold'
  const subtextClass = compact ? 'text-xs text-gray-600' : 'text-sm text-gray-600'
  const descriptionTitleClass = compact ? 'text-base font-semibold' : 'text-lg font-semibold'
  const descriptionTextClass = compact ? 'text-sm text-gray-700' : 'text-gray-700'
  const borderClass = compact ? 'border-t border-stone-200 pt-4' : 'border-t border-stone-200 pt-6'
  const spacingClass = compact ? 'mb-3' : 'mb-4'

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={titleClass}>Room Details</h2>
        <div className="text-right">
          <div className={priceClass}>₹{formatPrice(listing.rent)}</div>
          <div className={compact ? 'text-sm text-gray-600' : 'text-gray-600'}>per month</div>
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
