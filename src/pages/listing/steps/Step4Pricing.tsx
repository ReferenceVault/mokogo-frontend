import { useEffect, useRef } from 'react'
import { Listing } from '@/types'
import { MoveInDateField } from '@/components/MoveInDateField'

interface Step4PricingProps {
  data: Partial<Listing>
  onChange: (updates: Partial<Listing>) => void
  error?: string
  onClearError?: (field?: string) => void
}

const Step4Pricing = ({ data, onChange, error, onClearError }: Step4PricingProps) => {
  const moveInDateRef = useRef<HTMLDivElement>(null)
  
  // Focus move-in date field when there's an error related to it
  useEffect(() => {
    if (error && (error.includes('Move-in date') || error.includes('move-in date'))) {
      // Scroll to and focus the move-in date field, ensuring error message is visible
      // Use a longer timeout to ensure the component is fully rendered
      setTimeout(() => {
        if (moveInDateRef.current) {
          // Scroll to center the field including the error message below it
          moveInDateRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          })
          // Try to focus the button inside MoveInDateField
          setTimeout(() => {
            const button = moveInDateRef.current?.querySelector('button')
            if (button) {
              button.focus()
            }
          }, 100)
        }
      }, 400)
    }
  }, [error])
  // Clear errors when fields become valid
  useEffect(() => {
    if (data.rent && data.rent > 0 && error && onClearError) {
      onClearError('rent')
    }
  }, [data.rent, error, onClearError])

  useEffect(() => {
    if (data.deposit && data.deposit > 0 && error && onClearError) {
      onClearError('deposit')
    }
  }, [data.deposit, error, onClearError])

  useEffect(() => {
    if (data.moveInDate && data.moveInDate.trim() && error && onClearError) {
      onClearError('moveInDate')
    }
  }, [data.moveInDate, error, onClearError])

  // Clear step error when all required fields are filled
  useEffect(() => {
    if (data.rent && data.rent > 0 && 
        data.deposit && data.deposit > 0 && 
        data.moveInDate && data.moveInDate.trim() && 
        error && onClearError) {
      onClearError()
    }
  }, [data.rent, data.deposit, data.moveInDate, error, onClearError])

  const handleChange = (field: keyof Listing, value: any) => {
    onChange({ [field]: value })
  }

  const today = new Date().toISOString().split('T')[0]

  const sanitizeAmountInput = (raw: string) => {
    // Keep only digits
    const digitsOnly = raw.replace(/\D/g, '')
    // Limit to max 5 digits
    const limited = digitsOnly.slice(0, 5)
    if (!limited) return 0
    const value = parseInt(limited, 10)
    // Extra safety: clamp to 99999
    return Math.min(value, 99999)
  }

  return (
    <div>
      <h2 className="text-xl sm:text-[1.375rem] font-semibold text-gray-900 mb-1">Pricing</h2>
      <p className="text-[0.9625rem] text-gray-600 mb-4">Rent and deposit</p>

      {/* Show general error only if it's not a move-in date error (move-in date errors show below the field) */}
      {error && !error.includes('Move-in date') && !error.includes('move-in date') && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[0.825rem]">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
        {/* Rent + Deposit row on mobile; all 3 in one row on web */}
        <div className="flex gap-4 sm:contents">
        {/* Rent */}
        <div className="flex-1 min-w-0 sm:min-w-[200px]">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Monthly Rent (₹) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <span className="text-lg font-semibold text-mokogo-primary">₹</span>
            </div>
            <input
              type="number"
              value={data.rent || ''}
              onChange={(e) => handleChange('rent', sanitizeAmountInput(e.target.value))}
              className="w-full min-h-[44px] px-4 py-3 bg-gradient-to-br from-white via-white to-orange-50/30 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-mokogo-primary/50 focus:border-mokogo-primary transition-all duration-200 shadow-sm hover:shadow-md hover:border-orange-300/70 text-gray-700 font-medium pl-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="e.g., 12000"
              min="0"
            />
          </div>
        </div>

        {/* Deposit */}
        <div className="flex-1 min-w-0 sm:min-w-[200px]">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Security Deposit (₹) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <span className="text-lg font-semibold text-mokogo-primary">₹</span>
            </div>
            <input
              type="number"
              value={data.deposit || ''}
              onChange={(e) => handleChange('deposit', sanitizeAmountInput(e.target.value))}
              className="w-full min-h-[44px] px-4 py-3 bg-gradient-to-br from-white via-white to-orange-50/30 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-mokogo-primary/50 focus:border-mokogo-primary transition-all duration-200 shadow-sm hover:shadow-md hover:border-orange-300/70 text-gray-700 font-medium pl-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="e.g., 24000"
              min="0"
            />
          </div>
        </div>
        </div>

        {/* Available From - full width on mobile, same row on web */}
        <div className="w-full sm:flex-1 sm:min-w-0 sm:min-w-[200px]">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Available From <span className="text-red-500">*</span>
          </label>
          <div 
            ref={moveInDateRef}
            data-move-in-date-field
            className={`[&_button]:!px-4 [&_button]:!py-3 [&_button]:!bg-gradient-to-br [&_button]:!from-white [&_button]:!via-white [&_button]:!to-orange-50/40 [&_button]:!border-2 ${
              error && (error.includes('Move-in date') || error.includes('move-in date'))
                ? '[&_button]:!border-red-500 [&_button]:!ring-2 [&_button]:!ring-red-200'
                : '[&_button]:!border-orange-300/60'
            } [&_button]:!rounded-xl [&_button]:!focus:ring-2 [&_button]:!focus:ring-orange-400/60 [&_button]:!focus:border-orange-400 [&_button]:!shadow-md hover:[&_button]:!shadow-lg hover:[&_button]:!border-orange-400 [&_button]:!text-gray-900 [&_button]:!font-medium [&_button]:!h-[52px]`}>
            <MoveInDateField
              value={data.moveInDate || ''}
              onChange={(date) => {
                handleChange('moveInDate', date)
                // Clear error when user changes the date
                if (error && onClearError) {
                  onClearError('moveInDate')
                }
              }}
              min={today}
              hideLabel={true}
              numberOfMonths={1}
            />
          </div>
          {error && (error.includes('Move-in date') || error.includes('move-in date')) && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Step4Pricing

