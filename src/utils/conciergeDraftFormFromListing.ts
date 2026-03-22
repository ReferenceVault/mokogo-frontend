/**
 * Maps a concierge listing API record to the same shape as ConciergeCreateDraftPage form state,
 * with empty strings / [] / undefined where data is missing so the full form always renders.
 */
import { sanitizeIndianMobileInput, splitFullName } from '@/utils/listerProfile'

export type ConciergeDraftFormState = Record<string, string | number | boolean | string[] | undefined>

function isoToDateInput(v: unknown): string {
  if (v == null || v === '') return ''
  if (typeof v === 'string') return v.length >= 10 ? v.slice(0, 10) : ''
  if (typeof v === 'object' && v !== null && 'toISOString' in v) {
    return (v as Date).toISOString().slice(0, 10)
  }
  return ''
}

function str(v: unknown): string {
  return v != null && v !== undefined ? String(v) : ''
}

function strArr(v: unknown): string[] {
  return Array.isArray(v) ? (v as unknown[]).map((x) => String(x)) : []
}

export function createEmptyConciergeDraftForm(): ConciergeDraftFormState {
  return {
    photos: [],
    city: '',
    locality: '',
    placeId: '',
    latitude: undefined,
    longitude: undefined,
    formattedAddress: '',
    societyName: '',
    roomType: '',
    buildingType: '',
    bhkType: '',
    furnishingLevel: '',
    bathroomType: '',
    rent: '',
    deposit: '',
    moveInDate: '',
    description: '',
    flatAmenities: [],
    societyAmenities: [],
    preferredGender: '',
    foodPreference: '',
    petPolicy: '',
    smokingPolicy: '',
    drinkingPolicy: '',
    currentFlatmates: '',
    lgbtqFriendly: undefined,
    conciergeListerFirstName: '',
    conciergeListerLastName: '',
    conciergeListerEmail: '',
    conciergeListerPhone: '',
    conciergeListerProfileImageUrl: '',
    conciergeListerGender: '',
    conciergeListerOccupation: '',
    conciergeListerCompanyName: '',
    conciergeListerAbout: '',
    conciergeListerSmoking: '',
    conciergeListerDrinking: '',
    conciergeListerFoodPreference: '',
    conciergeSourcePlatform: '',
    conciergeSourcePlatformOther: '',
    conciergeSourceLink: '',
    conciergeSourceUsername: '',
    conciergeAddedBy: '',
    conciergeOutreachChannel: '',
    conciergeOutreachStatus: '',
    conciergeFollowUpDate: '',
  }
}

export function conciergeListingRecordToFormData(listing: Record<string, unknown>): ConciergeDraftFormState {
  const empty = createEmptyConciergeDraftForm()
  const fullName = str(listing.conciergeListerName)
  const { first, last } = splitFullName(fullName)
  const rawPhone = listing.conciergeListerPhone
  const phone =
    rawPhone != null && rawPhone !== '' ? sanitizeIndianMobileInput(String(rawPhone)) : ''

  const rent = listing.rent
  const deposit = listing.deposit
  const rentStr =
    rent != null && rent !== '' && !Number.isNaN(Number(rent)) ? String(Number(rent)) : ''
  const depositStr =
    deposit != null && deposit !== '' && !Number.isNaN(Number(deposit)) ? String(Number(deposit)) : ''

  const lgbtq = listing.lgbtqFriendly
  const lgbtqFriendly =
    lgbtq === true ? true : lgbtq === false ? false : undefined

  return {
    ...empty,
    photos: strArr(listing.photos),
    city: str(listing.city),
    locality: str(listing.locality),
    placeId: str(listing.placeId),
    latitude: typeof listing.latitude === 'number' ? listing.latitude : undefined,
    longitude: typeof listing.longitude === 'number' ? listing.longitude : undefined,
    formattedAddress: str(listing.formattedAddress),
    societyName: str(listing.societyName),
    roomType: str(listing.roomType),
    buildingType: str(listing.buildingType),
    bhkType: str(listing.bhkType),
    furnishingLevel: str(listing.furnishingLevel),
    bathroomType: str(listing.bathroomType),
    rent: rentStr,
    deposit: depositStr,
    moveInDate: isoToDateInput(listing.moveInDate),
    description: str(listing.description),
    flatAmenities: strArr(listing.flatAmenities),
    societyAmenities: strArr(listing.societyAmenities),
    preferredGender: str(listing.preferredGender),
    foodPreference: str(listing.foodPreference),
    petPolicy: str(listing.petPolicy),
    smokingPolicy: str(listing.smokingPolicy),
    drinkingPolicy: str(listing.drinkingPolicy),
    currentFlatmates: str(listing.currentFlatmates),
    lgbtqFriendly,
    conciergeListerFirstName: first,
    conciergeListerLastName: last,
    conciergeListerEmail: str(listing.conciergeListerEmail),
    conciergeListerPhone: phone,
    conciergeListerProfileImageUrl: str(listing.conciergeListerProfileImageUrl),
    conciergeListerGender: str(listing.conciergeListerGender),
    conciergeListerOccupation: str(listing.conciergeListerOccupation),
    conciergeListerCompanyName: str(listing.conciergeListerCompanyName),
    conciergeListerAbout: str(listing.conciergeListerAbout),
    conciergeListerSmoking: str(listing.conciergeListerSmoking),
    conciergeListerDrinking: str(listing.conciergeListerDrinking),
    conciergeListerFoodPreference: str(listing.conciergeListerFoodPreference),
    conciergeSourcePlatform: str(listing.conciergeSourcePlatform),
    conciergeSourcePlatformOther: str(listing.conciergeSourcePlatformOther),
    conciergeSourceLink: str(listing.conciergeSourceLink),
    conciergeSourceUsername: str(listing.conciergeSourceUsername),
    conciergeAddedBy: str(listing.conciergeAddedBy),
    conciergeOutreachChannel: str(listing.conciergeOutreachChannel),
    conciergeOutreachStatus: str(listing.conciergeOutreachStatus) || 'not_contacted',
    conciergeFollowUpDate: isoToDateInput(listing.conciergeFollowUpDate),
  }
}

/** Extract outreach log parsed for React state (stored temporarily on form object during hydration). */
export function parseOutreachLogFromListing(listing: Record<string, unknown>): Array<{ date: string; note: string }> {
  const log = listing.conciergeOutreachLog
  if (!Array.isArray(log)) return []
  return (log as { date?: unknown; note?: unknown }[]).map((e) => ({
    date: isoToDateInput(e.date),
    note: str(e.note),
  }))
}
