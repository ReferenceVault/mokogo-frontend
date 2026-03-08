import type { WhyMokogoFeature } from '../types'

interface WhyMokogoSectionProps {
  features: WhyMokogoFeature[]
}

const WhyMokogoSection = ({ features }: WhyMokogoSectionProps) => {
  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-gradient-to-br from-white via-orange-50/70 to-orange-100/70 px-6 py-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)] ring-1 ring-orange-100 md:px-10 md:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-orange-200/25 blur-3xl" />
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-amber-200/20 blur-3xl" />
      </div>

      <div className="relative text-center">
        <span className="inline-flex items-center rounded-full border border-orange-200/80 bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-700 shadow-sm backdrop-blur">
          Why Mokogo
        </span>
        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Built to make room hunting feel <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">more real, direct, and safe</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
          Everything here is designed to reduce noise, cut middlemen, and help people find better fits faster.
        </p>
      </div>

      <div className="relative mt-8 grid gap-3 md:grid-cols-2 lg:mt-10">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className={[
              'group relative overflow-hidden rounded-[24px] border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md md:p-5',
              index === 0
                ? 'border-orange-200/80 bg-white shadow-orange-100/30'
                : '',
              index === 1
                ? 'border-orange-200/80 bg-[#FFFCF8] shadow-orange-100/30'
                : '',
              index === 2
                ? 'border-orange-200/80 bg-white shadow-orange-100/30'
                : '',
              index === 3
                ? 'border-orange-200/80 bg-[#FFFCF8] shadow-orange-100/30'
                : '',
            ].join(' ')}
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/60 blur-2xl" />
              <div className="absolute bottom-0 right-0 h-16 w-16 rounded-tl-[22px] bg-white/35" />
            </div>

            <div className="relative flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/85 text-2xl shadow-sm ring-1 ring-white/90">
                <span>{feature.icon}</span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-bold tracking-tight text-gray-900 md:text-lg">
                    {feature.title}
                  </h3>
                  <span className="shrink-0 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-500">
                    0{index + 1}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {feature.description}
                </p>

                <div className="mt-3 h-px w-full bg-gradient-to-r from-orange-300/70 via-white/80 to-transparent" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default WhyMokogoSection
