/**
 * Build PATCH body for `previewApi.updateByToken` — same listing + lister fields as concierge draft,
 * without admin-only concierge tracking fields.
 */
import { generateListingTitle } from '@/utils/listingTitle'
import { joinFullName } from '@/utils/listerProfile'

export function buildPreviewTokenUpdatePayload(
  formData: Record<string, string | number | boolean | string[] | undefined>,
): Record<string, unknown> {
  const flatAmenities = (formData.flatAmenities as string[]) || []
  const societyAmenities = (formData.societyAmenities as string[]) || []
  const photos = (formData.photos as string[]) || []
  const rentNum = formData.rent ? Number(formData.rent) : undefined
  const title = generateListingTitle({
    roomType: (formData.roomType as string) || '',
    bhkType: (formData.bhkType as string) || '',
    locality: (formData.locality as string) || '',
    city: (formData.city as string) || '',
    rent: rentNum,
    furnishingLevel: (formData.furnishingLevel as string) || '',
  })
  const placeId = ((formData.placeId as string) || '').trim()
  const lat = formData.latitude
  const lng = formData.longitude
  const formattedAddr = ((formData.formattedAddress as string) || '').trim()
  return {
    photos: photos.length ? photos : undefined,
    title,
    city: (formData.city as string)?.trim() || undefined,
    locality: (formData.locality as string)?.trim() || undefined,
    placeId: placeId || undefined,
    latitude: typeof lat === 'number' && !Number.isNaN(lat) ? lat : undefined,
    longitude: typeof lng === 'number' && !Number.isNaN(lng) ? lng : undefined,
    formattedAddress: formattedAddr || undefined,
    societyName: (formData.societyName as string)?.trim() || undefined,
    roomType: (formData.roomType as string) || undefined,
    buildingType: (formData.buildingType as string) || undefined,
    bhkType: (formData.bhkType as string) || undefined,
    furnishingLevel: (formData.furnishingLevel as string) || undefined,
    bathroomType: (formData.bathroomType as string) || undefined,
    currentFlatmates: ((formData.currentFlatmates as string) || '').trim() || undefined,
    rent: formData.rent ? Number(formData.rent) : undefined,
    deposit: formData.deposit ? Number(formData.deposit) : undefined,
    moveInDate: (formData.moveInDate as string) || undefined,
    description: (formData.description as string)?.trim() || undefined,
    flatAmenities: flatAmenities.length ? flatAmenities : undefined,
    societyAmenities: societyAmenities.length ? societyAmenities : undefined,
    preferredGender: (formData.preferredGender as string) || undefined,
    foodPreference: (formData.foodPreference as string) || undefined,
    petPolicy: (formData.petPolicy as string) || undefined,
    smokingPolicy: (formData.smokingPolicy as string) || undefined,
    drinkingPolicy: (formData.drinkingPolicy as string) || undefined,
    lgbtqFriendly:
      formData.lgbtqFriendly === true ? true : formData.lgbtqFriendly === false ? false : undefined,
    conciergeListerName:
      joinFullName(
        (formData.conciergeListerFirstName as string) || '',
        (formData.conciergeListerLastName as string) || '',
      ) || undefined,
    conciergeListerEmail: (formData.conciergeListerEmail as string)?.trim() || undefined,
    conciergeListerPhone: (() => {
      const d = ((formData.conciergeListerPhone as string) || '').replace(/\D/g, '')
      return d ? d : undefined
    })(),
    conciergeListerOccupation: (formData.conciergeListerOccupation as string)?.trim() || undefined,
    conciergeListerProfileImageUrl:
      ((formData.conciergeListerProfileImageUrl as string) || '').trim() || undefined,
    conciergeListerGender: ((formData.conciergeListerGender as string) || '').trim() || undefined,
    conciergeListerCompanyName:
      ((formData.conciergeListerCompanyName as string) || '').trim() || undefined,
    conciergeListerAbout: ((formData.conciergeListerAbout as string) || '').trim() || undefined,
    conciergeListerSmoking: ((formData.conciergeListerSmoking as string) || '').trim() || undefined,
    conciergeListerDrinking: ((formData.conciergeListerDrinking as string) || '').trim() || undefined,
    conciergeListerFoodPreference:
      ((formData.conciergeListerFoodPreference as string) || '').trim() || undefined,
  }
}
