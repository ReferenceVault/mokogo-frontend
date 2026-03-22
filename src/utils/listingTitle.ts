/**
 * Auto-generated listing title — same formula as ListingWizard `generateTitle`.
 */
export function generateListingTitle(data: {
  roomType?: string
  bhkType?: string
  locality?: string
  city?: string
  rent?: number | string
  furnishingLevel?: string
}): string {
  const roomType =
    data.roomType === 'Private Room'
      ? 'Private Room'
      : data.roomType === 'Shared Room'
        ? 'Shared Room'
        : 'Room'
  const bhk = data.bhkType || ''
  const locality = data.locality || data.city || ''
  const rentRaw = data.rent
  const rentNum =
    typeof rentRaw === 'string' ? parseFloat(rentRaw.replace(/,/g, '')) || 0 : rentRaw ?? 0
  const rent = rentNum > 0 ? `₹${rentNum.toLocaleString('en-IN')}` : ''
  const furnishing = data.furnishingLevel || ''

  return `${roomType} in ${bhk} · ${locality} · ${rent} · ${furnishing}`
}
