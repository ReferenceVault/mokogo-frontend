import { useState, useEffect } from 'react'

export interface ListingFilterState {
  minRent?: number
  maxRent?: number
  roomTypes: string[]
  furnishingLevels: string[]
  preferredGender?: string
  bhkTypes: string[]
  bathroomTypes: string[]
  lgbtqFriendly: boolean
}

interface ListingFiltersProps {
  initialValues?: Partial<ListingFilterState>
  onApply: (filters: ListingFilterState) => void
  onClear: () => void
  open: boolean
  onClose: () => void
}

const DEFAULT_MIN_RENT = 0
const DEFAULT_MAX_RENT = 0

const ALL_ROOM_TYPES = ['Private Room', 'Shared Room', 'Master Room']
const ALL_FURNISHING = ['Fully Furnished', 'Semi-furnished', 'Unfurnished']
const ALL_BHK_TYPES = ['1BHK', '2BHK', '3BHK']
const ALL_BATHROOM_TYPES = ['Attached', 'Common']

export const ListingFilters = ({
  initialValues,
  onApply,
  onClear,
  open,
  onClose,
}: ListingFiltersProps) => {
  const [minRent, setMinRent] = useState<number>(initialValues?.minRent ?? DEFAULT_MIN_RENT)
  const [maxRent, setMaxRent] = useState<number>(initialValues?.maxRent ?? DEFAULT_MAX_RENT)
  const [roomTypes, setRoomTypes] = useState<string[]>(initialValues?.roomTypes ?? [])
  const [furnishingLevels, setFurnishingLevels] = useState<string[]>(initialValues?.furnishingLevels ?? [])
  const [preferredGender, setPreferredGender] = useState<string | undefined>(initialValues?.preferredGender)
  const [bhkTypes, setBhkTypes] = useState<string[]>(initialValues?.bhkTypes ?? [])
  const [bathroomTypes, setBathroomTypes] = useState<string[]>(initialValues?.bathroomTypes ?? [])
  const [lgbtqFriendly, setLgbtqFriendly] = useState<boolean>(initialValues?.lgbtqFriendly ?? false)

  useEffect(() => {
    if (!open) return
    setMinRent(initialValues?.minRent ?? DEFAULT_MIN_RENT)
    setMaxRent(initialValues?.maxRent ?? DEFAULT_MAX_RENT)
    setRoomTypes(initialValues?.roomTypes ?? [])
    setFurnishingLevels(initialValues?.furnishingLevels ?? [])
    setPreferredGender(initialValues?.preferredGender)
    setBhkTypes(initialValues?.bhkTypes ?? [])
    setBathroomTypes(initialValues?.bathroomTypes ?? [])
    setLgbtqFriendly(initialValues?.lgbtqFriendly ?? false)
  }, [open, initialValues])

  const handleToggle = (value: string, current: string[], setter: (next: string[]) => void) => {
    if (current.includes(value)) {
      setter(current.filter(v => v !== value))
    } else {
      setter([...current, value])
    }
  }

  const handleApply = () => {
    onApply({
      minRent,
      maxRent,
      roomTypes,
      furnishingLevels,
      preferredGender,
      bhkTypes,
      bathroomTypes,
      lgbtqFriendly,
    })
    onClose()
  }

  const handleClearAll = () => {
    setMinRent(DEFAULT_MIN_RENT)
    setMaxRent(DEFAULT_MAX_RENT)
    setRoomTypes([])
    setFurnishingLevels([])
    setPreferredGender(undefined)
    setBhkTypes([])
    setBathroomTypes([])
    setLgbtqFriendly(false)
    onClear()
  }

  const selectedCount =
    (minRent !== DEFAULT_MIN_RENT ? 1 : 0) +
    (maxRent !== DEFAULT_MAX_RENT ? 1 : 0) +
    (roomTypes.length ? 1 : 0) +
    (furnishingLevels.length ? 1 : 0) +
    (preferredGender ? 1 : 0) +
    (bhkTypes.length ? 1 : 0) +
    (bathroomTypes.length ? 1 : 0) +
    (lgbtqFriendly ? 1 : 0)

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center bg-black/40">
      <div className="w-full max-w-lg md:max-w-2xl bg-white rounded-t-2xl md:rounded-2xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-5 pt-4 pb-3 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-base md:text-lg font-semibold text-gray-900">Filters</h2>
            <p className="text-xs md:text-sm text-gray-500">
              {selectedCount > 0 ? `${selectedCount} filters applied` : 'Narrow down your search'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
          >
            <span className="sr-only">Close</span>
            ✕
          </button>
        </div>

        <div className="px-5 py-4 space-y-5 overflow-y-auto">
          {/* Price range */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-800">Price range (per month)</span>
              <button
                type="button"
                className="text-xs text-mokogo-primary font-semibold"
                onClick={() => {
                  setMinRent(DEFAULT_MIN_RENT)
                  setMaxRent(DEFAULT_MAX_RENT)
                }}
              >
                Reset
              </button>
            </div>
            <div className="mb-2">
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(minRent)} – {formatCurrency(maxRent)}
              </span>
            </div>
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-gray-500 w-10">Min</span>
                <input
                  type="range"
                  min={0}
                  max={60000}
                  step={1000}
                  value={minRent}
                  onChange={e => {
                    const value = Number(e.target.value) || 0
                    setMinRent(value > maxRent ? maxRent : value)
                  }}
                  className="flex-1 accent-mokogo-primary"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-gray-500 w-10">Max</span>
                <input
                  type="range"
                  min={0}
                  max={60000}
                  step={1000}
                  value={maxRent}
                  onChange={e => {
                    const value = Number(e.target.value) || 0
                    setMaxRent(value < minRent ? minRent : value)
                  }}
                  className="flex-1 accent-mokogo-primary"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="px-3 py-1.5 rounded-full border text-xs font-medium text-gray-700 hover:border-mokogo-primary hover:text-mokogo-primary"
                onClick={() => {
                  setMinRent(0)
                  setMaxRent(15000)
                }}
              >
                Under ₹15k
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-full border text-xs font-medium text-gray-700 hover:border-mokogo-primary hover:text-mokogo-primary"
                onClick={() => {
                  setMinRent(15000)
                  setMaxRent(25000)
                }}
              >
                ₹15k–₹25k
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-full border text-xs font-medium text-gray-700 hover:border-mokogo-primary hover:text-mokogo-primary"
                onClick={() => {
                  setMinRent(25000)
                  setMaxRent(DEFAULT_MAX_RENT)
                }}
              >
                ₹25k+
              </button>
            </div>
          </div>

          {/* Room type */}
          <div>
            <span className="block text-sm font-medium text-gray-800 mb-2">Room type</span>
            <div className="flex flex-wrap gap-2">
              {ALL_ROOM_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleToggle(type, roomTypes, setRoomTypes)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium ${
                    roomTypes.includes(type)
                      ? 'bg-mokogo-primary text-white border-mokogo-primary'
                      : 'text-gray-700 border-gray-300 hover:border-mokogo-primary hover:text-mokogo-primary'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* BHK type */}
          <div>
            <span className="block text-sm font-medium text-gray-800 mb-2">Apartment BHK type</span>
            <div className="flex flex-wrap gap-2">
              {ALL_BHK_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleToggle(type, bhkTypes, setBhkTypes)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium ${
                    bhkTypes.includes(type)
                      ? 'bg-mokogo-primary text-white border-mokogo-primary'
                      : 'text-gray-700 border-gray-300 hover:border-mokogo-primary hover:text-mokogo-primary'
                  }`}
                >
                  {type.replace('BHK', ' BHK')}
                </button>
              ))}
            </div>
          </div>

          {/* Furnishing */}
          <div>
            <span className="block text-sm font-medium text-gray-800 mb-2">Furnishing</span>
            <div className="flex flex-wrap gap-2">
              {ALL_FURNISHING.map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleToggle(level, furnishingLevels, setFurnishingLevels)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium ${
                    furnishingLevels.includes(level)
                      ? 'bg-mokogo-primary text-white border-mokogo-primary'
                      : 'text-gray-700 border-gray-300 hover:border-mokogo-primary hover:text-mokogo-primary'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Gender preference */}
          <div>
            <span className="block text-sm font-medium text-gray-800 mb-2">Gender preference</span>
            <div className="flex flex-wrap gap-2">
              {['Male', 'Female', 'Any'].map(value => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPreferredGender(value === preferredGender ? undefined : value)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium ${
                    preferredGender === value
                      ? 'bg-mokogo-primary text-white border-mokogo-primary'
                      : 'text-gray-700 border-gray-300 hover:border-mokogo-primary hover:text-mokogo-primary'
                  }`}
                >
                  {value === 'Any' ? 'Any' : `${value} only`}
                </button>
              ))}
            </div>
          </div>

          {/* Bathroom type */}
          <div>
            <span className="block text-sm font-medium text-gray-800 mb-2">Bathroom type</span>
            <div className="flex flex-wrap gap-2">
              {ALL_BATHROOM_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleToggle(type, bathroomTypes, setBathroomTypes)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium ${
                    bathroomTypes.includes(type)
                      ? 'bg-mokogo-primary text-white border-mokogo-primary'
                      : 'text-gray-700 border-gray-300 hover:border-mokogo-primary hover:text-mokogo-primary'
                  }`}
                >
                  {type === 'Attached' ? 'Attached bathroom' : 'Common bathroom'}
                </button>
              ))}
            </div>
          </div>

          {/* LGBTQ+ friendly */}
          <div>
            <span className="block text-sm font-medium text-gray-800 mb-2">LGBTQ+ friendly</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLgbtqFriendly(prev => !prev)}
                className={`flex-1 px-3 py-2 rounded-lg border text-xs font-medium ${
                  lgbtqFriendly
                    ? 'bg-mokogo-primary text-white border-mokogo-primary'
                    : 'text-gray-700 border-gray-300 hover:border-mokogo-primary hover:text-mokogo-primary'
                }`}
              >
                {lgbtqFriendly ? 'Enabled – show only LGBTQ+ friendly homes' : 'Show only LGBTQ+ friendly homes'}
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs md:text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-mokogo-primary text-white text-xs md:text-sm font-semibold py-2.5 px-4 hover:bg-mokogo-primary-dark transition-colors"
          >
            Apply filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default ListingFilters

