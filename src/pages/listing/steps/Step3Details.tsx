import { useEffect } from 'react'
import { Listing } from '@/types'
import CustomSelect from '@/components/CustomSelect'
import AmenitiesSelector from '@/components/AmenitiesSelector'
import { CURRENT_FLATMATES_OPTIONS } from '@/constants/currentFlatmates'

interface Step3DetailsProps {
  data: Partial<Listing>
  onChange: (updates: Partial<Listing>) => void
  error?: string
  onClearError?: (field?: string) => void
  /** Hide wizard heading (e.g. embedded in Concierge) */
  hideHeader?: boolean
}

const Step3Details = ({ data, onChange, error, onClearError, hideHeader = false }: Step3DetailsProps) => {
  // Clear errors when fields become valid
  useEffect(() => {
    if (data.buildingType && data.buildingType.trim() && error && onClearError) {
      onClearError('buildingType')
    }
  }, [data.buildingType, error, onClearError])

  useEffect(() => {
    if (data.bhkType && data.bhkType.trim() && error && onClearError) {
      onClearError('bhkType')
    }
  }, [data.bhkType, error, onClearError])

  useEffect(() => {
    if (data.roomType && data.roomType.trim() && error && onClearError) {
      onClearError('roomType')
    }
  }, [data.roomType, error, onClearError])

  useEffect(() => {
    if (data.furnishingLevel && data.furnishingLevel.trim() && error && onClearError) {
      onClearError('furnishingLevel')
    }
  }, [data.furnishingLevel, error, onClearError])

  // Clear step error when all required fields are filled
  useEffect(() => {
    if (data.buildingType && data.buildingType.trim() &&
        data.bhkType && data.bhkType.trim() && 
        data.roomType && data.roomType.trim() && 
        data.furnishingLevel && data.furnishingLevel.trim() && 
        error && onClearError) {
      onClearError()
    }
  }, [data.buildingType, data.bhkType, data.roomType, data.furnishingLevel, error, onClearError])

  const handleChange = (field: keyof Listing, value: any) => {
    onChange({ [field]: value })
  }

  return (
    <div>
      {!hideHeader && (
        <>
          <h2 className="text-lg sm:text-[1.2375rem] font-semibold text-gray-900 mb-1">Details</h2>
          <p className="text-[0.825rem] text-gray-600 mb-4">Room and apartment details</p>
        </>
      )}

      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[0.825rem]">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Room Type - First */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-3">
            Room Type <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {['Private Room', 'Shared Room', 'Master Room'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleChange('roomType', type)}
                className={`flex-1 min-h-[44px] px-4 py-3 rounded-lg font-medium transition-colors ${
                  data.roomType === type
                    ? 'bg-orange-400 text-white border-orange-400'
                    : 'bg-white/30 text-gray-700 border border-stone-200 hover:border-orange-400 hover:text-orange-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Building Type, Apartment Type, Furnishing, and Bathroom Type - Two Rows (2 fields per row) */}
        <div className="space-y-4">
          {/* Row 1: Building Type + Apartment Type */}
          <div className="flex flex-wrap gap-4">
            {/* Building Type */}
            <div className="flex-1 min-w-0 sm:min-w-[200px]">
              <CustomSelect
                label="Building Type"
                value={data.buildingType || ''}
                onValueChange={(value) => handleChange('buildingType', value)}
                placeholder="Select building type"
                options={[
                  { value: 'Gated Society', label: 'Gated Society' },
                  { value: 'Standalone Apartment', label: 'Standalone Apartment' },
                  { value: 'Independent House', label: 'Independent House' }
                ]}
                error={error}
              />
            </div>

            {/* BHK Type */}
            <div className="flex-1 min-w-0 sm:min-w-[200px]">
              <CustomSelect
                label="Apartment Type"
                value={data.bhkType || ''}
                onValueChange={(value) => handleChange('bhkType', value)}
                placeholder="Select BHK type"
                options={[
                  { value: '1RK', label: '1 RK' },
                  { value: '1BHK', label: '1 BHK' },
                  { value: '2BHK', label: '2 BHK' },
                  { value: '3BHK', label: '3 BHK' },
                  { value: '4BHK+', label: '4 BHK or more' }
                ]}
                error={error}
              />
            </div>
          </div>

          {/* Row 2: Furnishing + Bathroom Type */}
          <div className="flex flex-wrap gap-4">
            {/* Furnishing */}
            <div className="flex-1 min-w-0 sm:min-w-[200px]">
              <CustomSelect
                label="Furnishing"
                value={data.furnishingLevel || ''}
                onValueChange={(value) => handleChange('furnishingLevel', value)}
                placeholder="Select furnishing status"
                options={[
                  { value: 'Fully Furnished', label: 'Fully Furnished' },
                  { value: 'Semi-furnished', label: 'Semi Furnished' },
                  { value: 'Unfurnished', label: 'Unfurnished' }
                ]}
              />
            </div>

            {/* Bathroom Type */}
            <div className="flex-1 min-w-0 sm:min-w-[200px]">
              <CustomSelect
                label="Bathroom Type"
                value={data.bathroomType || ''}
                onValueChange={(value) => handleChange('bathroomType', value)}
                placeholder="Select bathroom type"
                options={[
                  { value: 'Attached', label: 'Attached Bathroom' },
                  { value: 'Common', label: 'Common Bathroom' }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Current flatmates — standardized counts only (no free text) */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-3">
            Current flatmates{' '}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <p className="text-xs text-stone-500 mb-2">
            People already living in the flat (excluding the room you&apos;re listing). Tap to select — no manual typing.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-2">
            {CURRENT_FLATMATES_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleChange('currentFlatmates', n)}
                className={`min-w-[2.75rem] min-h-[44px] px-3 py-2 rounded-lg font-medium transition-colors ${
                  data.currentFlatmates === n
                    ? 'bg-orange-400 text-white border-orange-400'
                    : 'bg-white/30 text-gray-700 border border-stone-200 hover:border-orange-400 hover:text-orange-500'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <AmenitiesSelector
          selected={[
            ...(data.flatAmenities || []).filter(a => ['WiFi', 'Washing machine', 'AC', 'Geyser', 'Fridge', 'TV', 'Sofa', 'Bed'].includes(a)),
            ...(data.societyAmenities || []).filter(a => ['Gym', 'Pool', 'Security', 'Parking'].includes(a))
          ]}
          onChange={(amenities) => {
            // Split amenities into flat and society based on their categories
            const flatAmenitiesList = amenities.filter(a => ['WiFi', 'Washing machine', 'AC', 'Geyser', 'Fridge', 'TV', 'Sofa', 'Bed'].includes(a))
            const societyAmenitiesList = amenities.filter(a => ['Gym', 'Pool', 'Security', 'Parking'].includes(a))
            
            // Preserve other amenities that aren't in the selector
            const otherFlatAmenities = (data.flatAmenities || [])
              .filter(a => a !== 'Kitchen')
              .filter(a => !['WiFi', 'Washing machine', 'AC', 'Geyser', 'Fridge', 'TV', 'Sofa', 'Bed'].includes(a))
            const otherSocietyAmenities = (data.societyAmenities || []).filter(a => !['Gym', 'Pool', 'Security', 'Parking'].includes(a))
            
            onChange({ 
              flatAmenities: [...flatAmenitiesList, ...otherFlatAmenities],
              societyAmenities: [...societyAmenitiesList, ...otherSocietyAmenities]
            })
          }}
          label="Amenities (Optional)"
        />
      </div>
    </div>
  )
}

export default Step3Details

