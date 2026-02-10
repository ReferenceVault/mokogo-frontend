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
  compact?: boolean
}

const MeetYourHost = ({ listing, hostInfo, className = '', compact = false }: MeetYourHostProps) => {
  const containerClass = compact
    ? 'bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/35 p-5'
    : 'bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/35 p-5'
  
  const titleClass = compact ? 'text-lg font-bold mb-4' : 'text-lg font-bold mb-4'
  const hostNameClass = compact ? 'text-base font-bold' : 'text-base font-bold'
  const hostAboutClass = compact ? 'text-sm text-gray-700 mb-3' : 'text-sm text-gray-700 mb-3'
  const infoTextClass = compact ? 'text-xs text-gray-600' : 'text-xs text-gray-600'
  const spacingClass = compact ? 'space-x-4' : 'space-x-4'

  const hostAbout =
    hostInfo?.about?.trim() ||
    `Hi! I'm ${hostInfo?.name || 'a professional'} working in ${listing?.city || 'this city'}. I love meeting new people and creating a comfortable, friendly environment for my flatmates. I'm clean, organized, and respect personal space while being approachable for any questions or concerns.`

  return (
    <div className={`${containerClass} ${className}`}>
      <h2 className={titleClass}>Meet Your Host</h2>
      
      <div className={`flex items-start ${spacingClass}`}>
        <div className="flex-shrink-0">
          <UserAvatar
            user={{
              name: hostInfo?.name,
              profileImageUrl: hostInfo?.profileImageUrl,
            }}
            size="xl"
            showBorder={true}
            className="bg-orange-400 border-orange-400/20"
          />
        </div>
        <div className="flex-1">
          <h3 className={`${hostNameClass} mb-2`}>{hostInfo?.name || 'Host'}</h3>
          
          <p className={hostAboutClass}>{hostAbout}</p>
          
          <div className={`flex items-center ${spacingClass}`}>
            <div className={infoTextClass}>
              <span className="font-semibold">Languages:</span> Hindi, English
            </div>
            <div className={infoTextClass}>
              <span className="font-semibold">Response time:</span> Within 2 hours
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MeetYourHost
