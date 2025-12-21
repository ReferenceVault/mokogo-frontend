import { Listing } from '@/types'

interface Step2PricingProps {
  data: Partial<Listing>
  onChange: (updates: Partial<Listing>) => void
}

const Step2Pricing = ({ data, onChange }: Step2PricingProps) => {
  const handleChange = (field: keyof Listing, value: any) => {
    onChange({ [field]: value })
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Price & move-in details
      </h1>

      <div className="space-y-6">
        {/* Rent */}
        <div className="w-[110%]">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Rent per month (₹) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-mokogo-primary font-semibold z-10">₹</span>
            <input
              type="number"
              value={data.rent || ''}
              onChange={(e) => handleChange('rent', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-gradient-to-br from-white via-white to-orange-50/30 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-mokogo-primary/50 focus:border-mokogo-primary transition-all duration-200 shadow-sm hover:shadow-md hover:border-orange-300/70 text-gray-700 font-medium pl-8"
              placeholder="15000"
              min="0"
            />
          </div>
        </div>

        {/* Deposit */}
        <div className="w-[110%]">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Deposit (₹)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-mokogo-primary font-semibold z-10">₹</span>
            <input
              type="number"
              value={data.deposit || ''}
              onChange={(e) => handleChange('deposit', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-gradient-to-br from-white via-white to-orange-50/30 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-mokogo-primary/50 focus:border-mokogo-primary transition-all duration-200 shadow-sm hover:shadow-md hover:border-orange-300/70 text-gray-700 font-medium pl-8"
              placeholder="30000"
              min="0"
            />
          </div>
        </div>

        {/* Setup Cost */}
        <div className="w-[110%]">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Setup cost (₹) (optional)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-mokogo-primary font-semibold z-10">₹</span>
            <input
              type="number"
              value={data.setupCost || ''}
              onChange={(e) => handleChange('setupCost', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-gradient-to-br from-white via-white to-orange-50/30 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-mokogo-primary/50 focus:border-mokogo-primary transition-all duration-200 shadow-sm hover:shadow-md hover:border-orange-300/70 text-gray-700 font-medium pl-8"
              placeholder="5000"
              min="0"
            />
          </div>
        </div>

        {/* Move-in Date */}
        <div className="w-[110%]">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Move-in date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={data.moveInDate || ''}
            onChange={(e) => handleChange('moveInDate', e.target.value)}
            className="w-full px-4 py-3 bg-gradient-to-br from-white via-white to-orange-50/30 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-mokogo-primary/50 focus:border-mokogo-primary transition-all duration-200 shadow-sm hover:shadow-md hover:border-orange-300/70 text-gray-700 font-medium"
            min={today}
          />
        </div>

        {/* Minimum Stay */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Minimum stay
          </label>
          <div className="relative w-[110%]">
            <select
              value={data.minimumStay || ''}
              onChange={(e) => handleChange('minimumStay', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-4 py-3 bg-gradient-to-br from-white via-white to-orange-50/30 border-2 border-orange-200/50 rounded-full focus:outline-none focus:ring-2 focus:ring-mokogo-primary/50 focus:border-mokogo-primary transition-all duration-200 shadow-sm hover:shadow-md hover:border-orange-300/70 appearance-none cursor-pointer text-gray-700 font-medium"
            >
              <option value="">None</option>
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="9">9 months</option>
              <option value="12">12 months</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step2Pricing
