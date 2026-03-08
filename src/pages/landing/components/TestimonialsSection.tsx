import { Star } from 'lucide-react'
import type { TestimonialItem } from '../types'

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[]
}

const TestimonialsSection = ({ testimonials }: TestimonialsSectionProps) => {
  return (
    <section className="-mx-4 bg-gradient-to-b from-orange-50 via-white to-orange-50/40 px-4 py-10 sm:-mx-6 sm:px-6 md:-mx-12 md:px-12">
      <div className="mx-auto max-w-7xl text-center">
        <span className="inline-flex items-center rounded-full border border-orange-200/80 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-orange-600 shadow-sm">
          Testimonials
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">Voices of Success</h2>
        <p className="mt-3 text-sm text-gray-600 md:text-base">
          Real experiences from people who found their room with Mokogo.
        </p>
      </div>

      <div className="marquee-container mt-8 overflow-hidden">
        <div className="testimonial-marquee-track flex w-max gap-5 py-2">
          {testimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className="w-[320px] flex-shrink-0 rounded-[24px] border border-orange-100/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-14 w-14 rounded-full border-2 border-orange-100 object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm font-medium text-orange-500">{testimonial.city}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-orange-500 text-orange-500" />
                  ))}
                </div>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-600">
                  Verified story
                </span>
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-700">
                &ldquo;{testimonial.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
