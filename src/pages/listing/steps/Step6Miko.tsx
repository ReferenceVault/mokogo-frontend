import { useMemo } from 'react'
import { Listing, VibeTagId } from '@/types'
import { VIBE_TAG_GROUPS, VIBE_TAG_LABELS, normalizeVibeTagsOnePerGroup, toggleVibeTagExclusive } from '@/utils/miko'

interface Step6MikoProps {
  data: Partial<Listing>
  onChange: (updates: Partial<Listing>) => void
  error?: string
  onClearError?: () => void
}

const Step6Miko = ({ data, onChange, error }: Step6MikoProps) => {
  const normalized = useMemo(() => normalizeVibeTagsOnePerGroup(data.mikoTags), [data.mikoTags])
  const selectedTags = useMemo(() => new Set(normalized), [normalized])

  const toggleTag = (tag: VibeTagId) => {
    const next = toggleVibeTagExclusive(normalized, tag)
    onChange({ mikoTags: next })
  }

  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-base sm:text-lg font-semibold text-gray-900">MIKO Vibe Tags</h4>
        <p className="text-sm text-gray-600">
          Optional — add vibe tags to help seekers find your listing through MIKO.
        </p>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>

      {VIBE_TAG_GROUPS.map(group => (
        <div key={group.id} className="space-y-2">
          <h5 className="text-sm font-semibold text-gray-700">{group.title}</h5>
          <div className="flex flex-wrap gap-2">
            {group.tags.map(tag => {
              const isSelected = selectedTags.has(tag)
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`min-h-[44px] px-3 py-2 rounded-full text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                  }`}
                >
                  {VIBE_TAG_LABELS[tag]}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Step6Miko
