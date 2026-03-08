import { Plus, Minus } from 'lucide-react'
import type { FAQItem } from '../types'

interface FaqSectionProps {
  items: FAQItem[]
  openIndex: number | null
  onToggle: (index: number) => void
}

const FaqSection = ({ items, openIndex, onToggle }: FaqSectionProps) => {
  return (
    <section className="relative mx-auto max-w-5xl overflow-hidden rounded-[36px] bg-gradient-to-br from-white via-orange-50/40 to-white px-6 py-10 shadow-[0_24px_80px_rgba(15,23,42,0.06)] ring-1 ring-orange-100 md:px-10 md:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-8 h-32 w-32 rounded-full bg-orange-100/50 blur-3xl" />
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-amber-100/40 blur-3xl" />
      </div>

      <div className="relative text-center">
        <span className="inline-flex items-center rounded-full border border-orange-200/80 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-orange-600 shadow-sm">
          FAQs
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Got Questions?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
          Everything you might want to know before searching, listing, or connecting on Mokogo.
        </p>
      </div>

      <div className="relative mt-8 space-y-3">
        {items.map((item, index) => {
          const isOpen = openIndex === index
          return (
            <div
              key={item.question}
              className={`overflow-hidden rounded-2xl border transition-all ${
                isOpen
                  ? 'border-orange-200 bg-white shadow-sm'
                  : 'border-orange-100/80 bg-white/90 hover:border-orange-200'
              }`}
            >
              <button
                type="button"
                onClick={() => onToggle(index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6"
              >
                <span className={`text-base font-semibold leading-6 ${isOpen ? 'text-orange-600' : 'text-gray-900'}`}>
                  {item.question}
                </span>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isOpen
                      ? 'border-orange-200 bg-orange-50 text-orange-600'
                      : 'border-orange-100 bg-white text-gray-500'
                  }`}
                >
                  {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-sm leading-7 text-gray-600 md:px-6">
                  {item.answer}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default FaqSection
