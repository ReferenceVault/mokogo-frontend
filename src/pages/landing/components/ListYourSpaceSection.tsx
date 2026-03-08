import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'

const ListYourSpaceSection = () => {
  return (
    <section className="mx-auto grid max-w-7xl overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-orange-100 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="flex bg-orange-500 px-6 py-10 text-white md:px-10 lg:items-center lg:py-12">
        <div className="max-w-xl space-y-6">
          <span className="inline-flex items-center rounded-full border border-white/80 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-orange-600 shadow-sm">
            For Owners & Hosts
          </span>

          <div className="space-y-3">
            <h2 className="max-w-lg text-3xl font-bold tracking-tight md:text-4xl">
              Have a room? List it free.
            </h2>
            <p className="max-w-md text-[15px] leading-7 text-white/90 md:text-base">
              Reach verified room seekers in your city and connect directly without broker noise.
            </p>
          </div>

          <div className="space-y-3 rounded-[24px] border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            {[
              'Free to list with no hidden charges',
              'Only verified, genuine seekers contact you',
              'Direct conversations with zero broker interference',
            ].map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-white" />
                <span className="text-sm font-medium leading-6 text-white/95 md:text-[15px]">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/auth?redirect=/dashboard&view=listings"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50"
            >
              List Your Space →
            </Link>
            <span className="text-sm text-white/80">Simple setup. No listing fee.</span>
          </div>
        </div>
      </div>
      <div className="bg-orange-50 p-4 md:p-5 lg:pl-0 lg:pr-5 lg:py-0">
        <div className="h-full w-full overflow-hidden rounded-[28px] lg:rounded-l-none shadow-sm ring-1 ring-orange-100">
          <img
            src="/bangalore-city.png"
            alt="Listing preview"
            className="h-[320px] w-full object-cover md:h-[380px] lg:h-full lg:min-h-[420px]"
          />
        </div>
      </div>
    </section>
  )
}

export default ListYourSpaceSection
