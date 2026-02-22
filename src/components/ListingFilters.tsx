import { useState, useEffect, useRef, useCallback } from 'react'

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
  
  // Dual-handle slider state
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

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

  const MIN_RENT = 0
  const MAX_RENT = 60000
  const STEP = 1000

  const getPercentage = (value: number) => {
    return ((value - MIN_RENT) / (MAX_RENT - MIN_RENT)) * 100
  }

  const getValueFromPosition = (clientX: number) => {
    if (!sliderRef.current) return MIN_RENT
    const rect = sliderRef.current.getBoundingClientRect()
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const value = Math.round((percentage * (MAX_RENT - MIN_RENT) + MIN_RENT) / STEP) * STEP
    return Math.max(MIN_RENT, Math.min(MAX_RENT, value))
  }

  const handleMouseDown = (handle: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(handle)
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return
    
    const newValue = getValueFromPosition(e.clientX)
    
    if (isDragging === 'min') {
      setMinRent(() => {
        const clampedValue = Math.min(newValue, maxRent)
        return Math.max(MIN_RENT, clampedValue)
      })
    } else {
      setMaxRent(() => {
        const clampedValue = Math.max(newValue, minRent)
        return Math.min(MAX_RENT, clampedValue)
      })
    }
  }, [isDragging, minRent, maxRent])

  const handleMouseUp = useCallback(() => {
    setIsDragging(null)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const handleTouchStart = (handle: 'min' | 'max') => (e: React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(handle)
  }

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !sliderRef.current) return
    
    const touch = e.touches[0]
    if (!touch) return
    
    const newValue = getValueFromPosition(touch.clientX)
    
    if (isDragging === 'min') {
      setMinRent(() => {
        const clampedValue = Math.min(newValue, maxRent)
        return Math.max(MIN_RENT, clampedValue)
      })
    } else {
      setMaxRent(() => {
        const clampedValue = Math.max(newValue, minRent)
        return Math.min(MAX_RENT, clampedValue)
      })
    }
  }, [isDragging, minRent, maxRent])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(null)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
      return () => {
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, handleTouchMove, handleTouchEnd])

  // Lock body scroll when modal is open so only the popup content scrolls
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  // Prevent touch scroll on backdrop (so body doesn't scroll); panel content still scrolls
  useEffect(() => {
    if (!open || !panelRef.current) return
    const overlay = panelRef.current.parentElement
    if (!overlay) return
    const handleTouchMove = (e: TouchEvent) => {
      if (panelRef.current?.contains(e.target as Node)) return
      e.preventDefault()
    }
    overlay.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => overlay.removeEventListener('touchmove', handleTouchMove)
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center bg-black/40 p-0 md:p-4 overflow-hidden">
      <div
        ref={panelRef}
        className="w-full max-w-lg md:max-w-2xl bg-white rounded-t-2xl md:rounded-2xl shadow-xl max-h-[90vh] md:max-h-[85vh] overflow-hidden flex flex-col min-h-0"
      >
        <div className="flex-shrink-0 px-5 pt-4 pb-3 border-b border-gray-200 flex items-center justify-between">
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

        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-5 py-4 space-y-5 overscroll-contain">
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
            <div className="mb-3">
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(minRent)} – {formatCurrency(maxRent)}
              </span>
            </div>
            
            {/* Dual-handle range slider */}
            <div className="relative mb-3" ref={sliderRef}>
              {/* Track */}
              <div className="relative h-2 bg-gray-200 rounded-full">
                {/* Active range */}
                <div
                  className="absolute h-2 bg-mokogo-primary rounded-full"
                  style={{
                    left: `${getPercentage(minRent)}%`,
                    width: `${getPercentage(maxRent) - getPercentage(minRent)}%`,
                  }}
                />
                
                {/* Min handle */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-mokogo-primary rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10"
                  style={{ left: `${getPercentage(minRent)}%` }}
                  onMouseDown={handleMouseDown('min')}
                  onTouchStart={handleTouchStart('min')}
                />
                
                {/* Max handle */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-mokogo-primary rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10"
                  style={{ left: `${getPercentage(maxRent)}%` }}
                  onMouseDown={handleMouseDown('max')}
                  onTouchStart={handleTouchStart('max')}
                />
              </div>
              
              {/* Labels */}
              <div className="flex justify-between mt-2 text-[10px] text-gray-500">
                <span>{formatCurrency(MIN_RENT)}</span>
                <span>{formatCurrency(MAX_RENT)}</span>
              </div>
            </div>
            
            {/* Quick preset buttons */}
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
                  setMaxRent(MAX_RENT)
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
            <div className="flex items-center gap-3">
              <span className="block text-sm font-medium text-gray-800">LGBTQ+ friendly</span>
              <button
                type="button"
                onClick={() => setLgbtqFriendly(prev => !prev)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-mokogo-primary focus:ring-offset-2 ${
                  lgbtqFriendly ? 'bg-mokogo-primary' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={lgbtqFriendly}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    lgbtqFriendly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-3 bg-white">
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
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-mokogo-primary text-white text-xs md:text-sm font-semibold py-2.5 px-4 hover:bg-mokogo-primary-dark transition-colors"
          >
            Apply filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default ListingFilters

