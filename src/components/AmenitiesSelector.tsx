import { 
  Wifi, 
  Car, 
  Dumbbell, 
  Waves, 
  Shield, 
  Wind,
  Tv,
  CookingPot,
  WashingMachine,
  Refrigerator,
  Armchair,
  Bed,
  Bath
} from 'lucide-react'

interface Amenity {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const allAmenities: Amenity[] = [
  { id: 'WiFi', label: 'WiFi', icon: Wifi },
  { id: 'AC', label: 'AC', icon: Wind },
  { id: 'TV', label: 'TV', icon: Tv },
  { id: 'Parking', label: 'Parking', icon: Car },
  { id: 'Gym', label: 'Gym', icon: Dumbbell },
  { id: 'Pool', label: 'Pool', icon: Waves },
  { id: 'Security', label: '24/7 Security', icon: Shield },
  { id: 'Kitchen', label: 'Kitchen', icon: CookingPot },
  { id: 'Washing machine', label: 'Washing Machine', icon: WashingMachine },
  { id: 'Fridge', label: 'Fridge', icon: Refrigerator },
  { id: 'Sofa', label: 'Sofa', icon: Armchair },
  { id: 'Bed', label: 'Bed', icon: Bed },
  { id: 'Geyser', label: 'Geyser', icon: Bath }
]

interface AmenitiesSelectorProps {
  selected: string[]
  onChange: (amenities: string[]) => void
  label?: string
}

const AmenitiesSelector = ({ selected = [], onChange, label = 'Amenities (Optional)' }: AmenitiesSelectorProps) => {
  const handleToggle = (amenityId: string) => {
    if (selected.includes(amenityId)) {
      onChange(selected.filter(id => id !== amenityId))
    } else {
      onChange([...selected, amenityId])
    }
  }

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium text-stone-700">
          {label}
        </label>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {allAmenities.map((amenity) => {
          const Icon = amenity.icon
          const isSelected = selected.includes(amenity.id)
          
          return (
            <button
              key={amenity.id}
              type="button"
              onClick={() => handleToggle(amenity.id)}
              className={`flex items-center gap-3 min-h-[44px] px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                isSelected
                  ? 'bg-orange-400 border-orange-400 shadow-md'
                  : 'bg-stone-50 border-stone-200 hover:border-orange-300 hover:shadow-sm'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${
                isSelected ? 'text-white' : 'text-stone-600'
              }`} />
              <span className={`text-sm font-medium text-left ${
                isSelected ? 'text-white' : 'text-stone-700'
              }`}>
                {amenity.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default AmenitiesSelector

