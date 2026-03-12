import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import type { CityItem } from '../types'

interface CitiesSectionProps {
  cities: CityItem[]
  onNotify: (cityName: string) => void
}

const CitiesSection = ({ cities, onNotify }: CitiesSectionProps) => {
  return (
    <section className="relative mx-auto max-w-7xl pt-1 pb-8 md:pt-1 md:pb-9">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-1/4 top-0 h-96 w-96 rounded-full bg-orange-200/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-orange-300/15 blur-3xl" />
      </div>

      <div className="relative space-y-10">
        <div className="space-y-3 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/60 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-white shadow-lg shadow-orange-500/20 ring-1 ring-white/40 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.9)]" />
            Discover Top Locations
          </span>
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
            Now Live In These Cities
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-600 md:text-base">
            Cities go live automatically when verified listings are available.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {cities.map((city, index) => {
            const wrapperClasses = [
              'group relative h-[300px] overflow-hidden rounded-[28px] border shadow-lg transition-all duration-300 lg:h-[240px] lg:rounded-3xl',
              city.active
                ? 'block cursor-pointer border-orange-200/70 bg-white hover:-translate-y-1 hover:border-orange-400 hover:shadow-2xl hover:shadow-orange-500/15'
                : 'border-gray-200/80 bg-white/70 opacity-80 grayscale',
            ].join(' ')

            const cardContent = (
              <>
                <img
                  src={city.image}
                  alt={city.name}
                  className={`h-full w-full object-cover ${city.active ? 'transition-transform duration-700 group-hover:scale-105' : ''}`}
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5 ${city.active ? 'group-hover:from-black/85' : ''}`} />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />

                <div className="absolute left-0 right-0 top-4 flex items-center justify-between px-4">
                  {city.active ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400"></span>
                      </span>
                      Live
                    </div>
                  ) : (
                    <span />
                  )}

                  {!city.active && (
                    <button
                      type="button"
                      onClick={() => onNotify(city.name)}
                      className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 text-[11px] font-semibold text-orange-600 shadow-sm transition-all hover:bg-orange-50 hover:shadow-md"
                    >
                      <Bell className="h-3.5 w-3.5" />
                      Notify Me
                    </button>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 text-white md:p-6">
                  <h3 className="text-xl font-bold tracking-tight md:text-2xl">{city.name}</h3>
                  <p className="mt-1 text-sm text-white/85">
                    {city.active ? 'Explore verified rooms and flatmate options' : 'Be the first to know when we launch here'}
                  </p>
                </div>
              </>
            )

            return city.active ? (
              <Link
                key={city.name}
                to={`/city/${encodeURIComponent(city.name)}`}
                className={wrapperClasses}
                style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
              >
                {cardContent}
              </Link>
            ) : (
              <div
                key={city.name}
                className={wrapperClasses}
                style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
              >
                {cardContent}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CitiesSection
