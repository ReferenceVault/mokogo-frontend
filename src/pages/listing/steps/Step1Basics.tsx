import { Listing } from '@/types'

interface Step1BasicsProps {
  data: Partial<Listing>
  onChange: (updates: Partial<Listing>) => void
}

const cities = [
  { value: 'Pune', group: 'Popular' },
  { value: 'Mumbai', group: 'Major Cities' },
  { value: 'Delhi', group: 'Major Cities' },
  { value: 'Bangalore', group: 'Major Cities' },
  { value: 'Hyderabad', group: 'Major Cities' },
  { value: 'Chennai', group: 'Major Cities' },
  { value: 'Kolkata', group: 'Major Cities' },
]

const Step1Basics = ({ data, onChange }: Step1BasicsProps) => {
  const handleChange = (field: keyof Listing, value: any) => {
    onChange({ [field]: value })
  }

  const roomTypes = [
    { value: 'Private Room', icon: 'home', label: 'Private Room' },
    { value: 'Shared Room', icon: 'users', label: 'Shared Room' },
    { value: 'Master Room', icon: 'crown', label: 'Master Room' },
  ]

  const getRoomIcon = (iconType: string) => {
    switch (iconType) {
      case 'home':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        )
      case 'users':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )
      case 'crown':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Tell us about the flat
      </h1>
      <p className="text-gray-600 mb-8">
        Let's start with the basic details of your property
      </p>

      <div className="space-y-6">
        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <select
            value={data.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            className="input-field"
          >
            <option value="">Select a city</option>
            <optgroup label="Popular">
              {cities.filter(c => c.group === 'Popular').map(city => (
                <option key={city.value} value={city.value}>{city.value}</option>
              ))}
            </optgroup>
            <optgroup label="Major Cities">
              {cities.filter(c => c.group === 'Major Cities').map(city => (
                <option key={city.value} value={city.value}>{city.value}</option>
              ))}
            </optgroup>
          </select>
          <p className="text-xs text-gray-500 mt-1.5">
            Choose the city where your property is located.
          </p>
        </div>

        {/* Locality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Locality <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={data.locality || ''}
              onChange={(e) => handleChange('locality', e.target.value)}
              className="input-field pr-10"
              placeholder="e.g., Koregaon Park, Hinjewadi"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1.5">
            Start typing to see suggestions.
          </p>
        </div>

        {/* Society Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Society Name <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <input
            type="text"
            value={data.societyName || ''}
            onChange={(e) => handleChange('societyName', e.target.value)}
            className="input-field"
            placeholder="e.g., Kumar Paradise, Amanora Park Town"
          />
          <p className="text-xs text-gray-500 mt-1.5">
            If your flat is in a gated society or apartment complex.
          </p>
        </div>

        {/* BHK Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            BHK Type <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {['1 BHK', '2 BHK', '3 BHK', '4+ BHK'].map((bhk) => {
              const value = bhk === '4+ BHK' ? '4BHK+' : bhk.replace(' ', '')
              return (
                <button
                  key={bhk}
                  type="button"
                  onClick={() => handleChange('bhkType', value)}
                  className={`px-6 py-2.5 rounded-full font-medium transition-colors border ${
                    data.bhkType === value
                      ? 'bg-mokogo-blue text-white border-mokogo-blue'
                      : 'bg-white text-gray-700 border-mokogo-gray hover:border-mokogo-blue hover:text-mokogo-blue'
                  }`}
                >
                  {bhk}
                </button>
              )
            })}
          </div>
        </div>

        {/* Room Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room Type <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {roomTypes.map((room) => (
              <button
                key={room.value}
                type="button"
                onClick={() => handleChange('roomType', room.value)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors border ${
                  data.roomType === room.value
                    ? 'bg-mokogo-blue text-white border-mokogo-blue'
                    : 'bg-white text-gray-700 border-mokogo-gray hover:border-mokogo-blue hover:text-mokogo-blue'
                }`}
              >
                {getRoomIcon(room.icon)}
                <span>{room.label}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1.5">
            Choose the type of room you're offering.
          </p>
        </div>
      </div>

      {/* Pro Tip Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-blue-900">Pro tip</span>
            </div>
            <p className="text-sm text-blue-800">
              Listings with complete and accurate details get 3x more inquiries. Take your time to fill in all the information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step1Basics
