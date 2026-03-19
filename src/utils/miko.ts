import { Listing, VibeTagId } from '@/types'

export const VIBE_TAG_LABELS: Record<VibeTagId, string> = {
  calm_vibes: 'Calm Vibes',
  thoughtfully_social: 'Thoughtfully Social',
  lively: 'Lively',
  couch_chill_repeat: 'Couch, Chill, Repeat',
  remote_life: 'Remote Life',
  community_living: 'Community Living',
  wallet_friendly: 'Wallet-Friendly',
  feel_good_space: 'Feel-Good Space',
  well_connected_area: 'Well-Connected Area',
  asap: 'ASAP',
  next_few_weeks: 'Next Few Weeks',
  no_rush: 'No Rush',
  privacy_over_all: 'Privacy > All',
  open_to_sharing: 'Open to Sharing',
  either_works: 'Either Works',
  smoke_free: 'Smoke-Free',
  peace_over_noise: 'Peace Over Noise',
  no_furry_roommates: 'No Furry Roommates',
  flexible_overall: 'Flexible Overall',
}

export const VIBE_TAG_GROUPS: { id: string; title: string; tags: VibeTagId[] }[] = [
  {
    id: 'home_vibe',
    title: 'Home Vibe',
    tags: ['calm_vibes', 'thoughtfully_social', 'lively'],
  },
  {
    id: 'home_life',
    title: 'Home Life',
    tags: ['couch_chill_repeat', 'remote_life', 'community_living'],
  },
  {
    id: 'priorities',
    title: 'Priorities',
    tags: ['wallet_friendly', 'feel_good_space', 'well_connected_area'],
  },
  {
    id: 'move_timing',
    title: 'Move Timing',
    tags: ['asap', 'next_few_weeks', 'no_rush'],
  },
  {
    id: 'personal_space',
    title: 'Personal Space',
    tags: ['privacy_over_all', 'open_to_sharing', 'either_works'],
  },
  {
    id: 'hard_no',
    title: 'Hard No',
    tags: ['smoke_free', 'peace_over_noise', 'no_furry_roommates', 'flexible_overall'],
  },
]

const VIBE_TAG_TO_GROUP_ID = new Map<VibeTagId, string>(
  VIBE_TAG_GROUPS.flatMap((g) => g.tags.map((t) => [t, g.id] as const)),
)

export const normalizeVibeTagsOnePerGroup = (tags: unknown): VibeTagId[] => {
  if (!Array.isArray(tags)) return []
  const seenGroups = new Set<string>()
  const out: VibeTagId[] = []
  for (const raw of tags) {
    if (typeof raw !== 'string') continue
    const tag = raw as VibeTagId
    if (!(tag in VIBE_TAG_LABELS)) continue
    const groupId = VIBE_TAG_TO_GROUP_ID.get(tag)
    if (!groupId) continue
    if (seenGroups.has(groupId)) continue
    seenGroups.add(groupId)
    out.push(tag)
  }
  return out
}

export const toggleVibeTagExclusive = (current: unknown, nextTag: VibeTagId): VibeTagId[] => {
  const normalized = normalizeVibeTagsOnePerGroup(current)
  const groupId = VIBE_TAG_TO_GROUP_ID.get(nextTag)
  if (!groupId) return normalized

  if (normalized.includes(nextTag)) {
    return normalized.filter((t) => t !== nextTag)
  }

  const withoutGroup = normalized.filter((t) => VIBE_TAG_TO_GROUP_ID.get(t) !== groupId)
  return [...withoutGroup, nextTag]
}

const WELL_CONNECTED_AREAS: Record<string, string[]> = {
  Pune: ['Baner', 'Hinjawadi', 'Kharadi', 'Viman Nagar', 'Wakad', 'Koregaon Park'],
  Mumbai: ['Andheri', 'Bandra', 'Powai', 'Lower Parel', 'Goregaon', 'Thane'],
  Hyderabad: ['Hitech City', 'Gachibowli', 'Kondapur', 'Jubilee Hills', 'Madhapur'],
  Bangalore: ['Whitefield', 'Koramangala', 'Indiranagar', 'HSR Layout', 'Bellandur'],
}

const daysBetween = (date: Date, other: Date) => {
  const diffMs = other.getTime() - date.getTime()
  return Math.floor(diffMs / 86400000)
}

export const getListingMikoTags = (listing: Listing): VibeTagId[] => {
  const tags = new Set<VibeTagId>()

  if (Array.isArray(listing.mikoTags)) {
    listing.mikoTags.forEach(tag => tags.add(tag))
  }

  if (listing.rent <= 15000) {
    tags.add('wallet_friendly')
  }

  const moveInDate = listing.moveInDate ? new Date(listing.moveInDate) : null
  if (moveInDate && !Number.isNaN(moveInDate.getTime())) {
    const today = new Date()
    const daysAway = daysBetween(today, moveInDate)
    if (daysAway <= 14) {
      tags.add('asap')
    } else if (daysAway <= 28) {
      tags.add('next_few_weeks')
    } else {
      tags.add('no_rush')
    }
  }

  const roomType = listing.roomType.toLowerCase()
  if (roomType.includes('private') || roomType.includes('master')) {
    tags.add('privacy_over_all')
  }
  if (roomType.includes('shared')) {
    tags.add('open_to_sharing')
  }
  if (!tags.has('privacy_over_all') && !tags.has('open_to_sharing')) {
    tags.add('either_works')
  }

  const connectedAreas = WELL_CONNECTED_AREAS[listing.city] || []
  if (connectedAreas.includes(listing.locality)) {
    tags.add('well_connected_area')
  }

  return Array.from(tags)
}

export const getMikoMatchScore = (
  seekerTags: VibeTagId[],
  listingTags: VibeTagId[],
) => {
  if (!seekerTags.length) return 0
  const listingTagSet = new Set(listingTags)
  const matches = seekerTags.filter(tag => listingTagSet.has(tag)).length
  return matches / seekerTags.length
}

export const getMikoMatchPercent = (
  seekerTags: VibeTagId[],
  listingTags: VibeTagId[],
) => {
  return Math.round(getMikoMatchScore(seekerTags, listingTags) * 100)
}

export const getMikoTagLabels = (tags: VibeTagId[], max = 3) => {
  const unique = Array.from(new Set(tags))
  return unique.slice(0, max).map(tag => VIBE_TAG_LABELS[tag])
}
