import { Bed, Bath, Calendar, Building2 } from 'lucide-react'
import { Listing } from '@/types'
import { formatPrice, formatDate } from '@/utils/formatters'

// Map bathroomType from listing to display: 'attached' or 'common' (Shared/Common -> common)
function getBathroomDisplay(value: string | undefined): string {
  if (!value || !value.trim()) return '—'
  const v = value.trim().toLowerCase()
  if (v === 'attached') return 'attached'
  if (v === 'common' || v === 'shared') return 'common'
  return value.trim()
}

interface RoomDetailsProps {
  listing: Listing
  className?: string
}

const RoomDetails = ({ listing, className = '' }: RoomDetailsProps) => {
  const bathroomLabel = getBathroomDisplay(listing.bathroomType)

  return (
    <div className={`bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/35 p-4 sm:p-5 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-4">
        <h2 className="text-lg font-bold text-gray-900">Room Details</h2>
        <div className="text-left sm:text-right">
          <div className="text-xl sm:text-xl font-bold text-gray-900">₹{formatPrice(listing.rent)}</div>
          <div className="text-sm text-gray-600">per person per month</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
        <div className="flex items-center gap-3 sm:flex-col sm:text-center p-4 sm:p-3 bg-stone-50 rounded-lg min-h-[72px] sm:min-h-0">
          <div className="flex-shrink-0 w-12 h-12 sm:w-auto sm:h-auto flex items-center justify-center bg-orange-100 sm:bg-transparent rounded-lg sm:rounded-none">
            <Building2 className="w-6 h-6 text-orange-400" />
          </div>
          <div className="min-w-0 flex-1 sm:flex-initial">
            <div className="text-xs text-gray-600 break-words">Building Type</div>
            <div className="text-sm font-semibold text-gray-900 break-words">{listing.buildingType || '—'}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:flex-col sm:text-center p-4 sm:p-3 bg-stone-50 rounded-lg min-h-[72px] sm:min-h-0">
          <div className="flex-shrink-0 w-12 h-12 sm:w-auto sm:h-auto flex items-center justify-center bg-orange-100 sm:bg-transparent rounded-lg sm:rounded-none">
            <Bed className="w-6 h-6 text-orange-400" />
          </div>
          <div className="min-w-0 flex-1 sm:flex-initial">
            <div className="text-xs text-gray-600 break-words">Apartment Type</div>
            <div className="text-sm font-semibold text-gray-900 break-words">{listing.bhkType || '—'}</div>
            <div className="text-xs text-gray-600 break-words">{listing.roomType || '—'}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:flex-col sm:text-center p-4 sm:p-3 bg-stone-50 rounded-lg min-h-[72px] sm:min-h-0">
          <div className="flex-shrink-0 w-12 h-12 sm:w-auto sm:h-auto flex items-center justify-center bg-orange-100 sm:bg-transparent rounded-lg sm:rounded-none">
            <Bath className="w-6 h-6 text-orange-400" />
          </div>
          <div className="min-w-0 flex-1 sm:flex-initial">
            <div className="text-xs text-gray-600 break-words">Bathroom</div>
            <div className="text-sm font-semibold text-gray-900 capitalize">{bathroomLabel}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:flex-col sm:text-center p-4 sm:p-3 bg-stone-50 rounded-lg min-h-[72px] sm:min-h-0">
          <div className="flex-shrink-0 w-12 h-12 sm:w-auto sm:h-auto flex items-center justify-center bg-orange-100 sm:bg-transparent rounded-lg sm:rounded-none">
            <Calendar className="w-6 h-6 text-orange-400" />
          </div>
          <div className="min-w-0 flex-1 sm:flex-initial">
            <div className="text-xs text-gray-600 break-words">Available</div>
            <div className="text-sm font-semibold text-gray-900">{formatDate(listing.moveInDate)}</div>
          </div>
        </div>
      </div>

      {listing.description && listing.description.trim() && (
        <div className="border-t border-stone-200 pt-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Description</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {listing.description}
          </p>
        </div>
      )}
    </div>
  )
}

export default RoomDetails
