export interface User {
  id: string
  phone: string
  email: string
  name?: string
}

export interface Listing {
  id: string
  title: string
  city: string
  locality: string
  societyName?: string
  bhkType: string
  roomType: string
  rent: number
  deposit: number
  setupCost?: number
  moveInDate: string
  minimumStay?: number
  furnishingLevel: string
  flatAmenities: string[]
  societyAmenities: string[]
  preferredGender: string
  foodPreference: string
  smokingAllowed: string
  drinkingAllowed: string
  guestsAllowed: string
  notes?: string
  photos: string[]
  status: 'draft' | 'live' | 'archived'
  boostEnabled?: boolean
  createdAt: string
  updatedAt: string
}

export interface Request {
  id: string
  listingId: string
  seekerId: string
  seekerName: string
  seekerAvatar?: string
  seekerAge?: number
  seekerGender?: string
  seekerOccupation?: string
  seekerCity?: string
  introMessage: string
  status: 'pending' | 'accepted' | 'rejected' | 'blocked'
  requestedAt: string
  desiredMoveInDate?: string
  contactRevealed: boolean
  seekerPhone?: string
  seekerEmail?: string
}
