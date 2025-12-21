import { Listing } from '@/types'

interface Step4PricingProps {
  data: Partial<Listing>
  onChange: (updates: Partial<Listing>) => void
  error?: string
}

const Step4Pricing = ({ data, onChange, error }: Step4PricingProps) => {
  const handleChange = (field: keyof Listing, value: any) => {
    onChange({ [field]: value })
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Pricing</h1>
      <p className="text-gray-600 mb-6">Rent and deposit</p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Rent */}
        <div className="w-[110%]">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Monthly Rent (₹) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <svg className="w-5 h-5 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <input
              type="number"
              value={data.rent || ''}
              onChange={(e) => handleChange('rent', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-gradient-to-br from-white via-white to-orange-50/30 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-mokogo-primary/50 focus:border-mokogo-primary transition-all duration-200 shadow-sm hover:shadow-md hover:border-orange-300/70 text-gray-700 font-medium pl-12"
              placeholder="e.g., 12000"
              min="0"
            />
          </div>
        </div>

        {/* Deposit */}
        <div className="w-[110%]">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Security Deposit (₹) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <svg className="w-5 h-5 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <input
              type="number"
              value={data.deposit || ''}
              onChange={(e) => handleChange('deposit', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-gradient-to-br from-white via-white to-orange-50/30 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-mokogo-primary/50 focus:border-mokogo-primary transition-all duration-200 shadow-sm hover:shadow-md hover:border-orange-300/70 text-gray-700 font-medium pl-12"
              placeholder="e.g., 24000"
              min="0"
            />
          </div>
        </div>

        {/* Available From */}
        <div className="w-[110%]">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Available From <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <svg className="w-5 h-5 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="date"
              value={data.moveInDate || ''}
              onChange={(e) => handleChange('moveInDate', e.target.value)}
              className="w-full px-4 py-3 bg-gradient-to-br from-white via-white to-orange-50/30 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-mokogo-primary/50 focus:border-mokogo-primary transition-all duration-200 shadow-sm hover:shadow-md hover:border-orange-300/70 text-gray-700 font-medium pl-12"
              min={today}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step4Pricing

