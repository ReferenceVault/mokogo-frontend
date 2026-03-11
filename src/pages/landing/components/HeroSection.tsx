import { Link } from 'react-router-dom'
import CustomSelect from '@/components/CustomSelect'
import { MoveInDateField } from '@/components/MoveInDateField'
import type { LandingSearchFilters, SearchMode } from '../types'

interface HeroSectionProps {
  searchMode: SearchMode
  onSearchModeChange: (mode: SearchMode) => void
  onOpenMiko: () => void
  searchFilters: LandingSearchFilters
  searchCities: string[]
  onCityChange: (city: string) => void
  searchValidationMessage?: string | null
  isStandardSearchReady?: boolean
  onMoveInDateChange: (date: string) => void
  onSearch: () => void
}

const HeroSection = ({
  searchMode,
  onSearchModeChange,
  onOpenMiko,
  searchFilters,
  searchCities,
  onCityChange,
  searchValidationMessage,
  isStandardSearchReady = false,
  onMoveInDateChange,
  onSearch,
}: HeroSectionProps) => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100/50 to-orange-50 pb-12 sm:pb-16 md:pb-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-orange-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-3 sm:px-6 sm:pt-4 md:px-12">
        <div className="relative rounded-2xl border border-orange-100 bg-white/85 p-4 shadow-2xl backdrop-blur-xl sm:rounded-3xl sm:p-6 md:p-12">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-50/60 via-transparent to-orange-100/30 pointer-events-none" />

          <div className="relative space-y-4 sm:space-y-6 md:space-y-7">
            <div className="space-y-3 text-center">
              <h1 className="px-1 text-2xl font-bold leading-tight text-gray-950 sm:text-3xl md:text-4xl lg:text-5xl">
                <span>Discover Rooms in Shared Flats</span>
              </h1>
              <p className="mx-auto flex max-w-[773px] flex-wrap justify-center gap-x-2 gap-y-1 text-xs font-semibold text-orange-600 sm:text-sm md:block md:text-base">
                <span>⚡ Real listings</span>
                <span className="hidden sm:inline md:hidden">•</span>
                <span>🤝 Direct contact</span>
                <span className="hidden sm:inline md:hidden">•</span>
                <span>💸 Zero brokerage</span>
              </p>
            </div>

            <div className="relative rounded-2xl border border-orange-100 bg-white/95 p-4 shadow-xl sm:p-5 md:p-6">
              <div className="mb-3 space-y-2 sm:mb-4">
                <div className="flex flex-col items-center gap-2 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <div className="hidden sm:block" />
                  <div className="inline-flex w-full justify-center rounded-full border border-orange-200 bg-orange-50 p-1 text-sm font-semibold shadow-sm sm:w-auto sm:justify-self-center">
                    <button
                      type="button"
                      onClick={() => onSearchModeChange('standard')}
                      className={`rounded-full px-4 py-2 transition-all ${
                        searchMode === 'standard'
                          ? 'bg-white text-orange-600 shadow-sm'
                          : 'text-orange-500 hover:text-orange-600'
                      }`}
                    >
                      Standard Search
                    </button>
                    <button
                      type="button"
                      onClick={() => onSearchModeChange('miko')}
                      className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 transition-all ${
                        searchMode === 'miko'
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-200'
                          : 'bg-orange-100/70 text-orange-600 hover:bg-orange-200/80 hover:text-orange-700'
                      }`}
                    >
                      <span>Miko Vibe Search</span>
                    </button>
                  </div>
                  {false && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 sm:justify-self-end">
                      <span>🔥</span>
                      <span>14 new listings added today</span>
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  {searchMode === 'miko' && (
                    <span className="text-xs text-gray-600 md:text-sm">
                      Answer 6 quick questions. Get vibe-matched homes.
                    </span>
                  )}
                </div>
              </div>

              {searchMode === 'standard' ? (
                <div className="grid items-end gap-3 md:grid-cols-3">
                  <div className="[&_button]:h-[50px] [&_button]:py-0">
                    <CustomSelect
                      label="Select City"
                      value={searchFilters.city}
                      onValueChange={onCityChange}
                      placeholder="Select your city"
                      options={searchCities.map((city) => ({ value: city, label: city }))}
                    />
                  </div>
                  <div className="overflow-visible [&_button]:h-[50px] [&_button]:py-0">
                    <label className="mb-2 block text-sm font-medium text-stone-700">
                      Move-in Date
                    </label>
                    <MoveInDateField
                      value={searchFilters.moveInDate}
                      onChange={onMoveInDateChange}
                      min={new Date().toISOString().split('T')[0]}
                      hideLabel={true}
                      disabled={!searchFilters.city}
                      className="!h-[50px] !rounded-lg !border-2 !border-gray-200 hover:!border-orange-300 focus:!border-orange-400 focus:!ring-2 focus:!ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone-700 opacity-0">
                      Search
                    </label>
                    <button
                      type="button"
                      onClick={onSearch}
                      disabled={!isStandardSearchReady}
                      className={`group relative flex h-[50px] w-full items-center justify-center gap-1.5 overflow-hidden rounded-lg bg-orange-500 text-sm font-semibold text-white shadow-lg transition-all duration-300 ${
                        isStandardSearchReady
                          ? 'hover:scale-[1.02] hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/30 active:scale-95'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <svg className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="relative z-10">Search</span>
                    </button>
                    {searchValidationMessage && (
                      <p className="mt-2 text-xs text-amber-700">
                        {searchValidationMessage}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                  <div className="text-left">
                    <p className="text-lg font-semibold text-gray-900">Find your vibe with Miko</p>
                    <p className="text-sm text-gray-600">
                      Get matched with homes that fit your lifestyle, not just your budget.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenMiko}
                    className="w-full rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-orange-600 md:w-auto"
                  >
                    Start Miko Vibe Search
                  </button>
                </div>
              )}
            </div>

            <div className="mt-1 flex flex-col items-center justify-center gap-3 border-t border-orange-100 pt-2 sm:mt-2 sm:flex-row sm:pt-2.5">
              <p className="text-sm font-medium text-gray-600 sm:text-base">
                Have a room to rent?
              </p>
              <Link
                to="/auth?redirect=/dashboard&view=listings"
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-orange-600"
              >
                List Your Place
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
