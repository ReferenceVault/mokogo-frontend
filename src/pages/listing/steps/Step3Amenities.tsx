import { Listing } from '@/types'

interface Step3AmenitiesProps {
  data: Partial<Listing>
  onChange: (updates: Partial<Listing>) => void
}

const flatAmenities = [
  'WiFi', 'Washing machine', 'AC', 'Geyser', 'Balcony', 'Fridge',
  'TV', 'Wardrobe', 'Microwave', 'Gas connection', 'Water purifier', 'RO'
]

const societyAmenities = [
  'Lift', 'Gym', 'Pool', 'CCTV', 'Park', 'Clubhouse', 'Security', 'Parking'
]

const Step3Amenities = ({ data, onChange }: Step3AmenitiesProps) => {
  const handleFurnishingChange = (value: string) => {
    onChange({ furnishingLevel: value })
  }

  const handleAmenityToggle = (amenity: string, type: 'flat' | 'society') => {
    const currentList = type === 'flat' 
      ? (data.flatAmenities || [])
      : (data.societyAmenities || [])
    
    const updatedList = currentList.includes(amenity)
      ? currentList.filter(a => a !== amenity)
      : [...currentList, amenity]
    
    onChange({ [type === 'flat' ? 'flatAmenities' : 'societyAmenities']: updatedList })
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Furnishing & amenities
      </h1>

      <div className="space-y-8">
        {/* Furnishing Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Furnishing level <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {['Unfurnished', 'Semi-furnished', 'Furnished', 'Luxury'].map((level) => (
              <label key={level} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="furnishing"
                  value={level}
                  checked={data.furnishingLevel === level}
                  onChange={(e) => handleFurnishingChange(e.target.value)}
                  className="w-4 h-4 text-mokogo-blue focus:ring-mokogo-blue"
                />
                <span className="text-gray-700">{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Flat Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Flat amenities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {flatAmenities.map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(data.flatAmenities || []).includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity, 'flat')}
                  className="w-4 h-4 text-mokogo-blue rounded focus:ring-mokogo-blue"
                />
                <span className="text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Society Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Society amenities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {societyAmenities.map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(data.societyAmenities || []).includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity, 'society')}
                  className="w-4 h-4 text-mokogo-blue rounded focus:ring-mokogo-blue"
                />
                <span className="text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step3Amenities
