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
}

const AmenitiesSection = ({ listing, className = '' }: AmenitiesSectionProps) => {
  const containerClass = 'bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/35 p-4 sm:p-5'
  const titleClass = 'text-lg font-bold mb-4'
  const gridClass = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'

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

  // Don't render if there are no amenities
  if (allAmenities.length === 0) {
    return null
  }

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

export default AmenitiesSection
