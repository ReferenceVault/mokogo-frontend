import UserAvatar from './UserAvatar'
import { Listing } from '@/types'

interface MeetYourHostProps {
  listing: Listing
  hostInfo?: {
    name?: string
    profileImageUrl?: string
    about?: string
  }
  className?: string
}

/** Prefer name captured at listing creation (concierge fields), then profile. */
function resolveHostDisplay(listing: Listing, hostInfo?: MeetYourHostProps['hostInfo']) {
  const fromListing = listing.conciergeListerName?.trim()
  const fromProfile = hostInfo?.name?.trim()
  const badSingleWord = new Set(['host', 'user', 'n/a', 'na', '—', '-', 'unknown'])

  const isUsableName = (s: string | undefined): s is string => {
    const t = s?.trim()
    if (!t) return false
    if (badSingleWord.has(t.toLowerCase())) return false
    return true
  }

  /** Prefer listing (creation) name, then profile, never generic "Host". */
  const displayName = isUsableName(fromListing)
    ? fromListing!
    : isUsableName(fromProfile)
      ? fromProfile!
      : fromListing || fromProfile || 'Lister'

  const about =
    listing.conciergeListerAbout?.trim() ||
    hostInfo?.about?.trim() ||
    undefined

  const profileImageUrl =
    listing.conciergeListerProfileImageUrl?.trim() ||
    hostInfo?.profileImageUrl?.trim() ||
    undefined

  return { displayName, about, profileImageUrl }
}

const MeetYourHost = ({ listing, hostInfo, className = '' }: MeetYourHostProps) => {
  const containerClass = 'bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/35 p-4 sm:p-5'
  const titleClass = 'text-lg font-bold mb-1'
  const hostAboutClass = 'text-sm text-gray-700 mb-3'

  const { displayName, about, profileImageUrl } = resolveHostDisplay(listing, hostInfo)

  const hostAbout =
    about ||
    `Hi! I'm ${displayName} working in ${listing?.city || 'this city'}. I love meeting new people and creating a comfortable, friendly environment for my flatmates. I'm clean, organized, and respect personal space while being approachable for any questions or concerns.`

  return (
    <div className={`${containerClass} ${className}`}>
      <h2 className={titleClass}>Meet your host</h2>
      <p className="text-sm text-gray-700 mb-4">
        <span className="font-medium text-gray-600">Listed by:</span>{' '}
        <span className="font-semibold text-gray-900">{displayName}</span>
      </p>

      <div className={`flex flex-col sm:flex-row items-start gap-3 sm:gap-4`}>
        <div className="flex-shrink-0">
          <UserAvatar
            user={{
              name: displayName,
              profileImageUrl,
            }}
            size="xl"
            showBorder={true}
            className="bg-orange-400 border-orange-400/20"
          />
        </div>
        <div className="flex-1">
          <p className={hostAboutClass}>{hostAbout}</p>
        </div>
      </div>
    </div>
  )
}

export default MeetYourHost
