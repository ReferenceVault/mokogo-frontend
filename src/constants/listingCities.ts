/**
 * Fixed city list for listing location — must match production (listing wizard / explore).
 */
export const LISTING_CITIES = [
  'Pune',
  'Mumbai',
  'Bangalore',
  'Delhi NCR',
  'Hyderabad',
] as const

export type ListingCity = (typeof LISTING_CITIES)[number]
