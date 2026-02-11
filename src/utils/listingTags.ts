import type { Listing } from '@/types'

export const getListingBadgeLabel = (listing: Listing): string | null => {
  const parts: string[] = []

  // LGBTQ+ flag if explicitly friendly
  if (listing.lgbtqFriendly) {
    parts.push('🏳️‍🌈 LGBTQ+ Friendly')
  }

  // Furnishing level (use whatever enum string the API sends, e.g. "Fully Furnished", "Semi-furnished", "Unfurnished")
  if (listing.furnishingLevel) {
    parts.push(listing.furnishingLevel)
  }

  // Building type (enum values are already user-friendly: "Gated Society", "Standalone Apartment", "Independent House")
  if (listing.buildingType) {
    parts.push(listing.buildingType)
  }

  if (!parts.length) {
    return null
  }

  return parts.join(' + ')
}

