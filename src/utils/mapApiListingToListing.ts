import { Listing } from '@/types'

/** Normalize move-in from API (ISO string or Date) for display components */
function normalizeMoveInDate(raw: unknown): string {
  if (raw == null) return ''
  if (typeof raw === 'string') {
    if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10)
    const d = new Date(raw)
    return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10)
  }
  if (raw instanceof Date) {
    return Number.isNaN(raw.getTime()) ? '' : raw.toISOString().slice(0, 10)
  }
  return ''
}

/**
 * Maps a listing document from the API (public getById, preview token, etc.) to the frontend `Listing` shape.
 */
export function mapApiListingToListing(response: unknown): Listing | null {
  if (!response || typeof response !== 'object') return null
  const r = response as Record<string, unknown>
  const id = (r._id || r.id) as string | undefined
  if (!id) return null

  return {
    id,
    title: (r.title as string) || '',
    city: (r.city as string) || '',
    locality: (r.locality as string) || '',
    placeId: r.placeId as string | undefined,
    latitude: r.latitude as number | undefined,
    longitude: r.longitude as number | undefined,
    formattedAddress: r.formattedAddress as string | undefined,
    societyName: r.societyName as string | undefined,
    buildingType: r.buildingType as string | undefined,
    bhkType: (r.bhkType as string) || '',
    roomType: (r.roomType as string) || '',
    rent: typeof r.rent === 'number' ? r.rent : Number(r.rent) || 0,
    deposit: typeof r.deposit === 'number' ? r.deposit : Number(r.deposit) || 0,
    moveInDate: normalizeMoveInDate(r.moveInDate),
    furnishingLevel: (r.furnishingLevel as string) || '',
    bathroomType: r.bathroomType as string | undefined,
    currentFlatmates: r.currentFlatmates as string | undefined,
    flatAmenities: Array.isArray(r.flatAmenities) ? (r.flatAmenities as string[]) : [],
    societyAmenities: Array.isArray(r.societyAmenities) ? (r.societyAmenities as string[]) : [],
    preferredGender: (r.preferredGender as string) || '',
    foodPreference: r.foodPreference as string | undefined,
    petPolicy: r.petPolicy as string | undefined,
    smokingPolicy: r.smokingPolicy as string | undefined,
    drinkingPolicy: r.drinkingPolicy as string | undefined,
    description: r.description as string | undefined,
    photos: Array.isArray(r.photos) ? (r.photos as string[]) : [],
    status: (r.status as Listing['status']) || 'draft',
    createdAt: (r.createdAt as string) || '',
    updatedAt: (r.updatedAt as string) || '',
    mikoTags: r.mikoTags as Listing['mikoTags'],
    lgbtqFriendly: r.lgbtqFriendly as boolean | undefined,
    conciergeListerName: (r.conciergeListerName as string) || undefined,
    conciergeListerProfileImageUrl: (r.conciergeListerProfileImageUrl as string) || undefined,
    conciergeListerAbout: (r.conciergeListerAbout as string) || undefined,
  }
}
