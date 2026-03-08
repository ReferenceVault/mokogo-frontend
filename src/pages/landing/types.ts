import type { LucideIcon } from 'lucide-react'

export type SearchMode = 'standard' | 'miko'

export interface LandingSearchFilters {
  city: string
  area: string
  areaPlaceId: string
  areaLat: number
  areaLng: number
  moveInDate: string
}

export interface DropdownPosition {
  top: number
  left: number
  width: number
}

export interface HowItWorksStep {
  number: string
  title: string
  description: string
  icon: LucideIcon
}

export interface HowItWorksWorkflow {
  id: string
  label: string
  title: string
  description: string
  steps: HowItWorksStep[]
}

export interface MikoQuestionPill {
  emoji: string
  text: string
}

export interface WhyMokogoFeature {
  icon: string
  title: string
  description: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface FeaturedListingItem {
  id: string
  image: string
  furnishing: string
  title: string
  location: string
  preference: string
  price: string
}

export interface CityItem {
  name: string
  image: string
  listings: number
  active: boolean
}

export interface TestimonialItem {
  id: number
  name: string
  role: string
  city: string
  image: string
  rating: number
  text: string
}
