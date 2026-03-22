import type { LucideIcon } from 'lucide-react'
import {
  Bed,
  Bath,
  Calendar,
  Building2,
  Armchair,
  Banknote,
  MapPin,
  Users,
} from 'lucide-react'
import { Listing } from '@/types'
import { formatPrice, formatDate } from '@/utils/formatters'

function formatHumanLabel(value: string | undefined): string {
  if (!value?.trim()) return '—'
  return value
    .trim()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function getBathroomDisplay(value: string | undefined): string {
  if (!value || !value.trim()) return '—'
  const v = value.trim().toLowerCase()
  if (v === 'attached') return 'attached'
  if (v === 'common' || v === 'shared') return 'common'
  return value.trim()
}

interface DetailCardProps {
  icon: LucideIcon
  label: string
  primary: React.ReactNode
  secondary?: React.ReactNode
}

function DetailCard({ icon: Icon, label, primary, secondary }: DetailCardProps) {
  return (
    <div className="flex min-h-[72px] items-center gap-3 rounded-lg bg-stone-50 p-4 sm:min-h-0 sm:flex-col sm:p-3 sm:text-center">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-orange-100 sm:h-auto sm:w-auto sm:rounded-none sm:bg-transparent">
        <Icon className="h-6 w-6 text-orange-400" aria-hidden />
      </div>
      <div className="min-w-0 flex-1 sm:flex-initial">
        <div className="break-words text-xs text-gray-600">{label}</div>
        <div className="break-words text-sm font-semibold text-gray-900">{primary}</div>
        {secondary != null && secondary !== '' && (
          <div className="mt-0.5 break-words text-xs text-gray-600">{secondary}</div>
        )}
      </div>
    </div>
  )
}

interface RoomDetailsProps {
  listing: Listing
  className?: string
}

const RoomDetails = ({ listing, className = '' }: RoomDetailsProps) => {
  const bathroomLabel = getBathroomDisplay(listing.bathroomType)
  const bhk = listing.bhkType?.trim() || '—'
  const roomLine = listing.roomType?.trim() || ''
  const furnishing = formatHumanLabel(listing.furnishingLevel)
  const depositNum = listing.deposit != null && !Number.isNaN(Number(listing.deposit)) ? Number(listing.deposit) : 0
  const depositDisplay = depositNum > 0 ? `₹${formatPrice(depositNum)}` : '—'
  const society = listing.societyName?.trim()
  const flatmates =
    listing.currentFlatmates === '6+' ? '6' : listing.currentFlatmates?.trim() || ''

  return (
    <div className={`rounded-xl border border-white/35 bg-white/70 p-4 shadow-lg backdrop-blur-md sm:p-5 ${className}`}>
      <div className="mb-4 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-gray-900">Room Details</h2>
        <div className="text-left sm:text-right">
          <div className="text-xl font-bold text-gray-900">₹{formatPrice(listing.rent)}</div>
          <div className="text-sm text-gray-600">per person per month</div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <DetailCard icon={Building2} label="Building Type" primary={listing.buildingType?.trim() || '—'} />
        <DetailCard
          icon={Bed}
          label="Apartment Type"
          primary={bhk}
          secondary={roomLine || undefined}
        />
        <DetailCard icon={Bath} label="Bathroom" primary={<span className="capitalize">{bathroomLabel}</span>} />
        <DetailCard icon={Calendar} label="Available" primary={formatDate(listing.moveInDate)} />
        <DetailCard icon={Armchair} label="Furnishing" primary={furnishing} />
        <DetailCard icon={Banknote} label="Deposit" primary={depositDisplay} />
        {society ? <DetailCard icon={MapPin} label="Society / building" primary={society} /> : null}
        {flatmates ? (
          <DetailCard icon={Users} label="Current flatmates" primary={flatmates} />
        ) : null}
      </div>

      {listing.description && listing.description.trim() && (
        <div className="border-t border-stone-200 pt-4">
          <h3 className="mb-3 text-base font-semibold text-gray-900">Description</h3>
          <p className="text-sm leading-relaxed text-gray-700">{listing.description}</p>
        </div>
      )}
    </div>
  )
}

export default RoomDetails
