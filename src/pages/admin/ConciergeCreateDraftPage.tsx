import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import DashboardHeader from '@/components/DashboardHeader'
import DashboardSidebar from '@/components/DashboardSidebar'
import { LayoutGrid, Home, MessageSquare, Settings, Users, Flag, Briefcase, ArrowLeft, Image } from 'lucide-react'
import { conciergeApi, uploadApi } from '@/services/api'
import { useStore } from '@/store/useStore'
import {
  joinFullName,
  sanitizeIndianMobileInput,
  isValidIndianMobile10Digits,
  INDIAN_MOBILE_HINT,
} from '@/utils/listerProfile'
import { generateListingTitle } from '@/utils/listingTitle'
import { Listing } from '@/types'
import Step2Location from '@/pages/listing/steps/Step2Location'
import Step3Details from '@/pages/listing/steps/Step3Details'
import Step4Pricing from '@/pages/listing/steps/Step4Pricing'
import Step5Preferences from '@/pages/listing/steps/Step5Preferences'

const SECTIONS = [
  { id: 'photos', title: 'Photos', icon: Image },
  { id: 'property', title: 'Property Details', icon: Home },
  { id: 'lister', title: 'Lister Profile', icon: Users },
  { id: 'tracking', title: 'Concierge Tracking', icon: Briefcase },
]

/** Matches backend `ConciergeOutreachStatus` */
const OUTREACH_STATUS_OPTIONS = [
  { value: 'not_contacted', label: 'Not contacted' },
  { value: 'link_sent', label: 'Link sent' },
  { value: 'follow_up_sent', label: 'Follow-up sent' },
  { value: 'responded', label: 'Responded' },
  { value: 'approved', label: 'Approved' },
  { value: 'declined', label: 'Declined' },
]

export default function ConciergeCreateDraftPage() {
  const navigate = useNavigate()
  const user = useStore((state) => state.user)
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]))
  const [formData, setFormData] = useState<Record<string, string | number | boolean | string[] | undefined>>({
    photos: [],
    city: '',
    locality: '',
    placeId: '',
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
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
    lgbtqFriendly: undefined as boolean | undefined,
    conciergeListerFirstName: '',
    conciergeListerLastName: '',
    conciergeListerEmail: '',
    conciergeListerPhone: '',
    conciergeListerOccupation: '',
    conciergeSourcePlatform: '',
    conciergeSourcePlatformOther: '',
    conciergeSourceLink: '',
    conciergeSourceUsername: '',
    conciergeAddedBy: '',
    conciergeOutreachChannel: '',
    conciergeOutreachStatus: '',
    conciergeFollowUpDate: '',
  })
  /** Pending outreach log rows saved when the draft is created (same model as listing detail). */
  const [outreachLogEntries, setOutreachLogEntries] = useState<Array<{ date: string; note: string }>>([])
  const [newLogDate, setNewLogDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [newLogNote, setNewLogNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const validateListerPhone = (): boolean => {
    const raw = (formData.conciergeListerPhone as string) || ''
    const d = raw.replace(/\D/g, '')
    if (d.length > 0 && !isValidIndianMobile10Digits(d)) {
      setError(INDIAN_MOBILE_HINT)
      return false
    }
    return true
  }

  const performSubmit = async () => {
    if (!validateListerPhone()) return
    setSubmitting(true)
    setError(null)
    try {
      const payload = buildPayload()
      const created = await conciergeApi.createDraft(payload)
      const previewUrl = `${window.location.origin}/preview/${created.previewToken}`
      navigate('/admin/dashboard', {
        state: { openTab: 'concierge', createSuccess: `Draft saved. Preview link: ${previewUrl}` },
      })
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Failed to create draft.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSectionContinue = (index: number) => {
    // Lister profile section: block Continue if phone is partially filled or invalid
    if (index === 2 && !validateListerPhone()) {
      return
    }
    setExpandedSections((prev) => {
      const next = new Set(prev)
      next.delete(index)
      next.add(index + 1)
      return next
    })
    setTimeout(() => {
      document.getElementById(`section-${index + 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleChange = (field: string, value: string | number | boolean | string[] | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  /** Maps concierge form state → listing wizard shape for shared step components */
  const listingFormData = useMemo((): Partial<Listing> => {
    const rentRaw = formData.rent
    const depRaw = formData.deposit
    const rent =
      rentRaw !== '' && rentRaw != null && String(rentRaw).trim() !== ''
        ? Number(rentRaw)
        : 0
    const deposit =
      depRaw !== '' && depRaw != null && String(depRaw).trim() !== ''
        ? Number(depRaw)
        : 0
    const cf = (formData.currentFlatmates as string)?.trim()
    const lgbtq = formData.lgbtqFriendly
    return {
      city: (formData.city as string) || '',
      locality: (formData.locality as string) || '',
      placeId: ((formData.placeId as string) || '').trim() || undefined,
      latitude: typeof formData.latitude === 'number' ? formData.latitude : undefined,
      longitude: typeof formData.longitude === 'number' ? formData.longitude : undefined,
      formattedAddress: ((formData.formattedAddress as string) || '').trim() || undefined,
      societyName: (formData.societyName as string) || '',
      roomType: (formData.roomType as string) || '',
      buildingType: (formData.buildingType as string) || '',
      bhkType: (formData.bhkType as string) || '',
      furnishingLevel: (formData.furnishingLevel as string) || '',
      bathroomType: (formData.bathroomType as string) || '',
      currentFlatmates: cf || undefined,
      flatAmenities: (formData.flatAmenities as string[]) || [],
      societyAmenities: (formData.societyAmenities as string[]) || [],
      rent,
      deposit,
      moveInDate: (formData.moveInDate as string) || '',
      preferredGender: (formData.preferredGender as string) || '',
      foodPreference: (formData.foodPreference as string) || '',
      petPolicy: (formData.petPolicy as string) || '',
      smokingPolicy: (formData.smokingPolicy as string) || '',
      drinkingPolicy: (formData.drinkingPolicy as string) || '',
      lgbtqFriendly: lgbtq === true ? true : lgbtq === false ? false : undefined,
      description: (formData.description as string) || '',
    }
  }, [formData])

  const handleListingFieldsChange = (updates: Partial<Listing>) => {
    setFormData((prev) => {
      const n: Record<string, string | number | boolean | string[] | undefined> = { ...prev }
      if ('rent' in updates) {
        const r = updates.rent
        n.rent = r === undefined || r === null || r === 0 ? '' : String(r)
      }
      if ('deposit' in updates) {
        const d = updates.deposit
        n.deposit = d === undefined || d === null || d === 0 ? '' : String(d)
      }
      for (const [k, v] of Object.entries(updates)) {
        if (k === 'rent' || k === 'deposit') continue
        if (v === undefined) {
          if (k === 'placeId') n.placeId = ''
          else if (k === 'latitude' || k === 'longitude') n[k] = undefined
          continue
        }
        n[k] = v as string | number | boolean | string[]
      }
      return n
    })
    setError(null)
  }

  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files?.length) return
    const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024)
    if (validFiles.length === 0) return
    setPhotoUploading(true)
    try {
      const urls = await uploadApi.uploadPhotos(validFiles)
      const current = (formData.photos as string[]) || []
      handleChange('photos', [...current, ...urls])
    } catch (e) {
      setError('Failed to upload photos. Please try again.')
    } finally {
      setPhotoUploading(false)
    }
  }

  const removePhoto = (index: number) => {
    const current = (formData.photos as string[]) || []
    handleChange('photos', current.filter((_, i) => i !== index))
  }

  const buildPayload = () => {
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
      lgbtqFriendly: formData.lgbtqFriendly === true ? true : formData.lgbtqFriendly === false ? false : undefined,
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
      conciergeSourcePlatform: (formData.conciergeSourcePlatform as string) || undefined,
      conciergeSourcePlatformOther: (formData.conciergeSourcePlatformOther as string)?.trim() || undefined,
      conciergeSourceLink: (formData.conciergeSourceLink as string)?.trim() || undefined,
      conciergeSourceUsername: (formData.conciergeSourceUsername as string)?.trim() || undefined,
      conciergeAddedBy: (formData.conciergeAddedBy as string)?.trim() || undefined,
      conciergeOutreachChannel: (formData.conciergeOutreachChannel as string) || undefined,
      conciergeOutreachStatus:
        ((formData.conciergeOutreachStatus as string) || '').trim() || 'not_contacted',
      conciergeFollowUpDate: ((formData.conciergeFollowUpDate as string) || '').trim() || undefined,
      outreachLogEntries:
        outreachLogEntries.length > 0
          ? outreachLogEntries.map((e) => ({
              date: e.date || undefined,
              note: e.note.trim(),
            }))
          : undefined,
    }
  }

  const addOutreachLogRow = () => {
    const note = newLogNote.trim()
    if (!note) return
    setOutreachLogEntries((prev) => [...prev, { date: newLogDate, note }])
    setNewLogNote('')
    setNewLogDate(new Date().toISOString().slice(0, 10))
    setError(null)
  }

  const removeOutreachLogRow = (idx: number) => {
    setOutreachLogEntries((prev) => prev.filter((_, i) => i !== idx))
  }

  const userName = user?.name || user?.email?.split('@')[0] || 'Admin'
  const userEmail = user?.email || ''
  const listerPhoneDigits = ((formData.conciergeListerPhone as string) || '').replace(/\D/g, '')
  const listerPhoneInvalid =
    listerPhoneDigits.length > 0 && !isValidIndianMobile10Digits(listerPhoneDigits)

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <DashboardHeader
        activeView="concierge"
        onViewChange={() => navigate('/admin/dashboard')}
        menuItems={[{ label: 'Dashboard', view: 'overview' }]}
        userName={userName}
        userEmail={userEmail}
        userImageUrl={user?.profileImageUrl}
        onLogout={() => navigate('/admin/login')}
        onNavigateToOtherDashboard={() => navigate('/dashboard')}
        otherDashboardLabel="User Dashboard"
      />

      <div className="flex flex-1">
        <DashboardSidebar
          title="Admin Panel"
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeView="concierge"
          menuItems={[
            { id: 'overview', label: 'Overview', icon: LayoutGrid, onClick: () => navigate('/admin/dashboard') },
            { id: 'concierge', label: 'Concierge', icon: Briefcase, onClick: () => navigate('/admin/dashboard', { state: { openTab: 'concierge' } }) },
            { id: 'listings', label: 'Listings', icon: Home, onClick: () => navigate('/admin/dashboard', { state: { openTab: 'listings' } }) },
            { id: 'users', label: 'Users', icon: Users, onClick: () => navigate('/admin/dashboard', { state: { openTab: 'users' } }) },
            { id: 'requests', label: 'Requests', icon: MessageSquare, onClick: () => navigate('/admin/dashboard', { state: { openTab: 'requests' } }) },
            { id: 'reports', label: 'Reports', icon: Flag, onClick: () => navigate('/admin/dashboard', { state: { openTab: 'reports' } }) },
            { id: 'settings', label: 'Settings', icon: Settings, onClick: () => navigate('/admin/dashboard', { state: { openTab: 'settings' } }) },
          ]}
        />

        <SocialSidebar position="right" />

        <main className="flex-1 min-w-0 overflow-x-hidden px-4 sm:px-0 pr-11 lg:pr-14">
          <div className="max-w-[900px] mx-auto px-0 sm:px-6 md:px-8 py-4 sm:py-6">
            <div className="mb-3 flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/dashboard', { state: { openTab: 'concierge' } })}
                className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
            <div className="mb-3">
              <h1 className="text-xl sm:text-[1.375rem] font-bold text-gray-900">Create Draft Listing</h1>
              <p className="text-[0.825rem] text-gray-600">All fields are optional. Add details as needed.</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">{error}</div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault()
              }}
            >
              <div className="space-y-2">
                {SECTIONS.map((section, index) => {
                  const isExpanded = expandedSections.has(index)
                  const Icon = section.icon
                  return (
                    <div
                      key={section.id}
                      id={`section-${index}`}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => toggleSection(index)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                            <Icon className="w-3.5 h-3.5 text-orange-600" />
                          </div>
                          <h3 className="text-sm font-semibold text-gray-900">{section.title}</h3>
                        </div>
                        <svg
                          className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-2 border-t border-gray-100 space-y-4">
                          {section.id === 'photos' && (
                            <>
                              <p className="text-sm text-gray-600 mb-2">Add photos of the property. Optional but recommended.</p>
                              <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 hover:bg-orange-50/30 transition-colors cursor-pointer"
                                onClick={() => document.getElementById('concierge-photo-input')?.click()}
                              >
                                <input
                                  id="concierge-photo-input"
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => { handlePhotoUpload(e.target.files); e.target.value = '' }}
                                />
                                <div className="space-y-2">
                                  <div className="w-10 h-10 mx-auto rounded-full bg-orange-100 flex items-center justify-center">
                                    <Image className="w-5 h-5 text-orange-600" />
                                  </div>
                                  <p className="text-sm font-medium text-gray-700">Click to upload photos</p>
                                  <p className="text-xs text-gray-500">JPEG, PNG, WebP. Max 5MB each.</p>
                                  <button
                                    type="button"
                                    disabled={photoUploading}
                                    className="text-sm px-3 py-1.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50"
                                  >
                                    {photoUploading ? 'Uploading...' : 'Choose Photos'}
                                  </button>
                                </div>
                              </div>
                              {((formData.photos as string[]) || []).length > 0 && (
                                <div className="mt-4">
                                  <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Photos ({(formData.photos as string[]).length})</p>
                                  <div className="flex flex-wrap gap-2">
                                    {((formData.photos as string[])).map((url, i) => (
                                      <div key={i} className="relative group">
                                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                          <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                        <button
                                          type="button"
                                          onClick={(e) => { e.stopPropagation(); removePhoto(i) }}
                                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                          {section.id === 'property' && (
                            <>
                              <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700 space-y-1">
                                <p>
                                  <span className="font-medium text-stone-800">Title</span> is generated automatically from
                                  room type, BHK, locality, rent, and furnishing — same formula as the user-facing{' '}
                                  <span className="font-medium">List Your Place</span> flow.
                                </p>
                                <p className="text-stone-600">
                                  The sections below match the production listing wizard: Location → Details → Pricing →
                                  Preferences.
                                </p>
                              </div>
                              <p className="text-xs font-semibold text-gray-800 uppercase tracking-wide">Location</p>
                              <div className="border border-gray-200 rounded-lg p-3 bg-white">
                                <Step2Location
                                  data={listingFormData}
                                  onChange={handleListingFieldsChange}
                                  hideTitle
                                  showSocietyField={false}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Society / Building Name</label>
                                <input
                                  type="text"
                                  value={(formData.societyName as string) || ''}
                                  onChange={(e) => handleChange('societyName', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  placeholder="Optional"
                                />
                              </div>
                              <p className="text-xs font-semibold text-gray-800 uppercase tracking-wide">Details</p>
                              <div className="border border-gray-200 rounded-lg p-3 bg-white overflow-x-hidden">
                                <Step3Details data={listingFormData} onChange={handleListingFieldsChange} hideHeader />
                              </div>
                              <p className="text-xs font-semibold text-gray-800 uppercase tracking-wide">Pricing</p>
                              <div className="border border-gray-200 rounded-lg p-3 bg-white overflow-x-hidden">
                                <Step4Pricing data={listingFormData} onChange={handleListingFieldsChange} hideHeader />
                              </div>
                              <p className="text-xs font-semibold text-gray-800 uppercase tracking-wide">Preferences</p>
                              <div className="border border-gray-200 rounded-lg p-3 bg-white overflow-x-hidden">
                                <Step5Preferences data={listingFormData} onChange={handleListingFieldsChange} hideHeader />
                              </div>
                            </>
                          )}
                          {section.id === 'lister' && (
                            <>
                              <p className="text-xs text-gray-500 -mt-1 mb-2">
                                Matches the user profile layout (first &amp; last name). Stored as a single full name for the listing.
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                                  <input
                                    type="text"
                                    value={(formData.conciergeListerFirstName as string) || ''}
                                    onChange={(e) => handleChange('conciergeListerFirstName', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                    placeholder="First name"
                                    autoComplete="given-name"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                                  <input
                                    type="text"
                                    value={(formData.conciergeListerLastName as string) || ''}
                                    onChange={(e) => handleChange('conciergeListerLastName', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                    placeholder="Last name"
                                    autoComplete="family-name"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lister Email</label>
                                <input
                                  type="email"
                                  value={(formData.conciergeListerEmail as string) || ''}
                                  onChange={(e) => handleChange('conciergeListerEmail', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  placeholder="owner@example.com"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lister Phone</label>
                                <input
                                  type="tel"
                                  inputMode="numeric"
                                  value={(formData.conciergeListerPhone as string) || ''}
                                  onChange={(e) =>
                                    handleChange('conciergeListerPhone', sanitizeIndianMobileInput(e.target.value))
                                  }
                                  className={`w-full border rounded-lg px-3 py-2 text-sm ${
                                    listerPhoneInvalid ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                  placeholder="10-digit mobile (6–9…)"
                                  maxLength={10}
                                />
                                {listerPhoneInvalid && (
                                  <p className="mt-1 text-xs text-red-600">{INDIAN_MOBILE_HINT}</p>
                                )}
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                                <input
                                  type="text"
                                  value={(formData.conciergeListerOccupation as string) || ''}
                                  onChange={(e) => handleChange('conciergeListerOccupation', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  placeholder="Optional"
                                />
                              </div>
                            </>
                          )}

                          {section.id === 'tracking' && (
                            <>
                              <p className="text-xs text-gray-500 -mt-1 mb-2">
                                Source and assignment fields. Set outreach status, follow-up, and log notes so the team stays aligned.
                              </p>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Source Platform</label>
                                <select
                                  value={(formData.conciergeSourcePlatform as string) || ''}
                                  onChange={(e) => handleChange('conciergeSourcePlatform', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                >
                                  <option value="">—</option>
                                  <option value="facebook">Facebook</option>
                                  <option value="telegram">Telegram</option>
                                  <option value="whatsapp">WhatsApp</option>
                                  <option value="x">X</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Source Link / Post URL</label>
                                <input
                                  type="url"
                                  value={(formData.conciergeSourceLink as string) || ''}
                                  onChange={(e) => handleChange('conciergeSourceLink', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  placeholder="https://..."
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Source Username</label>
                                <input
                                  type="text"
                                  value={(formData.conciergeSourceUsername as string) || ''}
                                  onChange={(e) => handleChange('conciergeSourceUsername', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  placeholder="FB/Telegram handle"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Property Added By</label>
                                <input
                                  type="text"
                                  value={(formData.conciergeAddedBy as string) || ''}
                                  onChange={(e) => handleChange('conciergeAddedBy', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  placeholder="Your name"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Outreach Channel</label>
                                <select
                                  value={(formData.conciergeOutreachChannel as string) || ''}
                                  onChange={(e) => handleChange('conciergeOutreachChannel', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                >
                                  <option value="">—</option>
                                  <option value="whatsapp">WhatsApp</option>
                                  <option value="telegram">Telegram</option>
                                  <option value="facebook">Facebook</option>
                                  <option value="x">X</option>
                                  <option value="phone_call">Phone Call</option>
                                </select>
                              </div>

                              <div className="pt-2 border-t border-gray-100 mt-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Outreach status</label>
                                <select
                                  value={(formData.conciergeOutreachStatus as string) || 'not_contacted'}
                                  onChange={(e) => handleChange('conciergeOutreachStatus', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                >
                                  {OUTREACH_STATUS_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                      {o.label}
                                    </option>
                                  ))}
                                </select>
                                {(formData.conciergeOutreachStatus as string) === 'link_sent' && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    After link sent, we can flag this listing for follow-up if there is no response in 48 hours.
                                  </p>
                                )}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up date</label>
                                <input
                                  type="date"
                                  value={(formData.conciergeFollowUpDate as string) || ''}
                                  onChange={(e) => handleChange('conciergeFollowUpDate', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  When to check back with this owner (optional).
                                </p>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Outreach log</label>
                                <p className="text-xs text-gray-500 mb-2">
                                  Timestamped notes visible to the whole team. Add entries here before saving; they are stored when you save the draft.
                                </p>
                                {outreachLogEntries.length > 0 && (
                                  <ul className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                                    {outreachLogEntries.map((entry, idx) => (
                                      <li
                                        key={`${entry.date}-${idx}`}
                                        className="flex gap-2 items-start p-2 bg-gray-50 rounded-lg text-sm"
                                      >
                                        <span className="text-gray-500 flex-shrink-0 tabular-nums">
                                          {entry.date
                                            ? new Date(entry.date + 'T12:00:00').toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                              })
                                            : '—'}
                                        </span>
                                        <span className="text-gray-800 flex-1">{entry.note}</span>
                                        <button
                                          type="button"
                                          onClick={() => removeOutreachLogRow(idx)}
                                          className="text-xs text-red-600 hover:underline flex-shrink-0"
                                        >
                                          Remove
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                                <div className="flex flex-wrap gap-2 items-end">
                                  <div>
                                    <label className="sr-only">Log entry date</label>
                                    <input
                                      type="date"
                                      value={newLogDate}
                                      onChange={(e) => setNewLogDate(e.target.value)}
                                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-[180px]">
                                    <label className="sr-only">Log note</label>
                                    <input
                                      type="text"
                                      value={newLogNote}
                                      onChange={(e) => setNewLogNote(e.target.value)}
                                      placeholder="Note (e.g. messaged on WA, no reply yet)"
                                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={addOutreachLogRow}
                                    disabled={!newLogNote.trim()}
                                    className="px-3 py-2 bg-stone-200 text-stone-800 rounded-lg text-sm font-medium hover:bg-stone-300 disabled:opacity-50"
                                  >
                                    Add to log
                                  </button>
                                </div>
                              </div>
                            </>
                          )}

                          {/* Continue (not on last section — use Save below) */}
                          {index < SECTIONS.length - 1 && (
                            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                              <button
                                type="button"
                                onClick={() => handleSectionContinue(index)}
                                disabled={submitting}
                                className="w-full sm:w-auto text-sm px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-1.5"
                              >
                                Continue
                                {!submitting && (
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:items-center sm:justify-between">
                <p className="text-xs text-gray-500 order-2 sm:order-1">
                  Use <span className="font-medium text-gray-700">Continue</span> between sections, then{' '}
                  <span className="font-medium text-gray-700">Save</span> once to create the draft and return to the list.
                </p>
                <div className="flex gap-3 order-1 sm:order-2">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/dashboard', { state: { openTab: 'concierge' } })}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => performSubmit()}
                    disabled={submitting}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50"
                  >
                    {submitting ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
