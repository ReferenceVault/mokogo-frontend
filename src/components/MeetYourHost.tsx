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

const MeetYourHost = ({ listing, hostInfo, className = '' }: MeetYourHostProps) => {
  const containerClass = 'bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/35 p-4 sm:p-5'
  const titleClass = 'text-lg font-bold mb-4'
  const hostNameClass = 'text-base font-bold'
  const hostAboutClass = 'text-sm text-gray-700 mb-3'

  const hostAbout =
    hostInfo?.about?.trim() ||
    `Hi! I'm ${hostInfo?.name || 'a professional'} working in ${listing?.city || 'this city'}. I love meeting new people and creating a comfortable, friendly environment for my flatmates. I'm clean, organized, and respect personal space while being approachable for any questions or concerns.`

  return (
    <div className={`${containerClass} ${className}`}>
      <h2 className={titleClass}>Meet Your Host</h2>
      
      <div className={`flex flex-col sm:flex-row items-start gap-3 sm:gap-4`}>
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
        </div>
      </div>
    </div>
  )
}

export default MeetYourHost
