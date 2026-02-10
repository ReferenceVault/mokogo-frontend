import {
  CheckCircle,
  Wifi,
  Car,
  Dumbbell,
  Waves,
  Wind,
  Tv,
  CookingPot,
  WashingMachine,
  Refrigerator,
  Armchair,
  Sun,
  Bed,
  Bath,
  Shield,
} from 'lucide-react'
import { Listing } from '@/types'

interface AmenitiesSectionProps {
  listing: Listing
  className?: string
  compact?: boolean
}

const AmenitiesSection = ({ listing, className = '', compact = false }: AmenitiesSectionProps) => {
  const containerClass = compact
    ? 'bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/35 p-5'
    : 'bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/35 p-8'
  
  const titleClass = compact ? 'text-lg font-bold mb-4' : 'text-2xl font-bold mb-6'
  const gridClass = compact
    ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'
    : 'grid grid-cols-1 md:grid-cols-2 gap-8'

  const amenityIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'WiFi': Wifi,
    'AC': Wind,
    'TV': Tv,
    'Parking': Car,
    'Gym': Dumbbell,
    'Pool': Waves,
    'Security': Shield,
    'Kitchen': CookingPot,
    'Washing machine': WashingMachine,
    'Fridge': Refrigerator,
    'Sofa': Armchair,
    'Bed': Bed,
    'Geyser': Bath,
    'Balcony': Sun,
  }

  const allAmenities = [...(listing.flatAmenities || []), ...(listing.societyAmenities || [])]

  if (compact) {
    return (
      <div className={`${containerClass} ${className}`}>
        <h2 className={titleClass}>Amenities</h2>
        <div className={gridClass}>
          {allAmenities.map((amenity, idx) => {
            const Icon = amenityIconMap[amenity] || CheckCircle
            return (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg hover:border-orange-300 transition-colors"
              >
                <Icon className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span className="text-sm text-gray-700">{amenity}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={`${containerClass} ${className}`}>
      <h2 className={titleClass}>Amenities</h2>
      <div className={gridClass}>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Amenities</h3>
          <div className="space-y-3">
            {listing.flatAmenities.slice(0, 6).map((amenity, idx) => (
              <div key={idx} className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Areas</h3>
          <div className="space-y-3">
            {listing.societyAmenities.slice(0, 6).map((amenity, idx) => (
              <div key={idx} className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AmenitiesSection
