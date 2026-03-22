import { User } from '@/types'

export const isProfileComplete = (user: User | null): boolean => {
  if (!user) return false

  // Parse name to check first and last name
  const nameParts = user.name ? user.name.trim().split(' ') : []
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''

  // Check all required fields (aligned with Profile form — no DOB / city / area)
  const requiredFields = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    gender: user.gender || '',
    occupation: user.occupation || '',
    companyName: user.companyName || '',
    about: user.about || '',
    smoking: user.smoking || '',
    drinking: user.drinking || '',
    foodPreference: user.foodPreference || '',
  }

  // Check if all required fields are filled
  return Object.values(requiredFields).every(value => value.trim() !== '')
}
