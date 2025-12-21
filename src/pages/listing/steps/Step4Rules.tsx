import { Listing } from '@/types'

interface Step4RulesProps {
  data: Partial<Listing>
  onChange: (updates: Partial<Listing>) => void
}

const Step4Rules = ({ data, onChange }: Step4RulesProps) => {
  const handleChange = (field: keyof Listing, value: any) => {
    onChange({ [field]: value })
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Who are you looking for?
      </h1>

      <div className="space-y-6">
        {/* Preferred Gender */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-3">
            Preferred flatmate gender
          </label>
          <div className="flex gap-2">
            {['Any', 'Male', 'Female', 'Other'].map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() => handleChange('preferredGender', gender)}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                  data.preferredGender === gender
                    ? 'bg-orange-400 text-white'
                    : 'bg-stone-200 text-gray-700 hover:bg-stone-300'
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        {/* Food Preference */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-3">
            Food preference
          </label>
          <div className="space-y-2">
            {['Veg only', 'Non-veg ok', 'No preference'].map((pref) => (
              <label key={pref} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="food"
                  value={pref}
                  checked={data.foodPreference === pref}
                  onChange={(e) => handleChange('foodPreference', e.target.value)}
                  className="w-4 h-4 text-mokogo-primary focus:ring-mokogo-primary"
                />
                <span className="text-gray-700">{pref}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Smoking */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-3">
            Smoking allowed?
          </label>
          <div className="space-y-2">
            {['Yes', 'No', 'Balcony only'].map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="smoking"
                  value={option}
                  checked={data.smokingAllowed === option}
                  onChange={(e) => handleChange('smokingAllowed', e.target.value)}
                  className="w-4 h-4 text-mokogo-primary focus:ring-mokogo-primary"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Drinking */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-3">
            Drinking allowed?
          </label>
          <div className="space-y-2">
            {['Yes', 'No', 'Occasionally'].map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="drinking"
                  value={option}
                  checked={data.drinkingAllowed === option}
                  onChange={(e) => handleChange('drinkingAllowed', e.target.value)}
                  className="w-4 h-4 text-mokogo-primary focus:ring-mokogo-primary"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-3">
            Guests allowed?
          </label>
          <div className="space-y-2">
            {['Yes', 'No', 'Weekends only'].map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="guests"
                  value={option}
                  checked={data.guestsAllowed === option}
                  onChange={(e) => handleChange('guestsAllowed', e.target.value)}
                  className="w-4 h-4 text-mokogo-primary focus:ring-mokogo-primary"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="w-[110%]">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Notes for flatmate (optional)
          </label>
          <textarea
            value={data.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full px-4 py-3 bg-gradient-to-br from-white via-white to-orange-50/30 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-mokogo-primary/50 focus:border-mokogo-primary transition-all duration-200 shadow-sm hover:shadow-md hover:border-orange-300/70 text-gray-700 font-medium min-h-[100px] resize-none"
            placeholder="Any additional information or preferences..."
          />
        </div>
      </div>
    </div>
  )
}

export default Step4Rules
