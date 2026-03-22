import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import DashboardHeader from '@/components/DashboardHeader'
import DashboardSidebar from '@/components/DashboardSidebar'
import {
  LayoutGrid,
  Home,
  MessageSquare,
  Settings,
  Users,
  Flag,
  Briefcase,
  ArrowLeft,
  Image,
  User,
  Mail,
  Phone,
  Building,
  FileText,
  Cigarette,
  Wine,
  Utensils,
  X,
  Clock,
  Copy,
  Heart,
  Calendar,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
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
import {
  createEmptyConciergeDraftForm,
  conciergeListingRecordToFormData,
  parseOutreachLogFromListing,
} from '@/utils/conciergeDraftFormFromListing'

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

/** Same copy as user Profile “About You” templates (ProfileContent). */
const LISTER_ABOUT_TEMPLATES: {
  id: string
  title: string
  icon: typeof Briefcase
  content: string
}[] = [
  {
    id: 'professional',
    title: 'Professional Background',
    icon: Briefcase,
    content:
      "I'm a software engineer working at TCS with 5 years of experience in the tech industry. I'm a clean, responsible person with excellent references. I don't smoke, rarely have guests, and prefer a quiet environment for work. I maintain a regular work schedule and value cleanliness and organization in shared spaces.",
  },
  {
    id: 'lifestyle',
    title: 'Clean & Quiet Lifestyle',
    icon: Calendar,
    content:
      "I'm a marketing professional who values cleanliness and a peaceful environment. I have flexible work hours and am very respectful of shared spaces. I maintain a clean, quiet lifestyle and prefer organized living. I'm looking for a roommate who shares similar values of respect and cleanliness.",
  },
  {
    id: 'tech-worker',
    title: 'Tech Professional',
    icon: Briefcase,
    content:
      "I work in the tech industry and maintain a clean, quiet lifestyle. I'm organized, responsible, and prefer a peaceful living environment. I respect shared spaces and believe in open communication with roommates. I enjoy a balanced lifestyle with time for both work and personal interests.",
  },
  {
    id: 'creative',
    title: 'Creative Professional',
    icon: Heart,
    content:
      "I'm a UI/UX designer who loves creativity and tidy living spaces. I'm respectful, enjoy cooking, and maintain a clean environment. I value friendly interactions and mutual respect with roommates. I prefer a calm, organized home where I can focus on my work and hobbies.",
  },
  {
    id: 'working-professional',
    title: 'Working Professional',
    icon: Clock,
    content:
      "I'm a working professional with a steady income and reliable employment. I'm ready to move in and can provide all necessary documents. I maintain a professional lifestyle, respect house rules, and value cleanliness. I'm looking for a comfortable living space with a responsible roommate.",
  },
  {
    id: 'founder',
    title: 'Founder & Entrepreneur',
    icon: Briefcase,
    content:
      "I'm a founder building exciting projects and value focus, discipline, and a positive environment. My schedule can be busy, but I'm respectful of shared spaces and maintain a clean, organized lifestyle. I appreciate open communication and living with driven, like-minded individuals who value ambition and balance.",
  },
]

export default function ConciergeCreateDraftPage() {
  const navigate = useNavigate()
  const { listingId } = useParams<{ listingId?: string }>()
  const isEditMode = Boolean(listingId)
  const user = useStore((state) => state.user)
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]))
  const [formData, setFormData] = useState<Record<string, string | number | boolean | string[] | undefined>>(
    () => createEmptyConciergeDraftForm(),
  )
  const [listingLoading, setListingLoading] = useState(!!listingId)
  const [listingLoadError, setListingLoadError] = useState<string | null>(null)
  const [loadedListing, setLoadedListing] = useState<Record<string, unknown> | null>(null)
  const [actionsBusy, setActionsBusy] = useState(false)
  /** Pending outreach log rows saved when the draft is created (same model as listing detail). */
  const [outreachLogEntries, setOutreachLogEntries] = useState<Array<{ date: string; note: string }>>([])
  const [newLogDate, setNewLogDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [newLogNote, setNewLogNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [listerPhotoUploading, setListerPhotoUploading] = useState(false)
  const [showListerAboutTemplates, setShowListerAboutTemplates] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const listerTemplateModalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!listingId) {
      setListingLoading(false)
      setLoadedListing(null)
      return
    }
    let cancelled = false
    setListingLoading(true)
    setListingLoadError(null)
    conciergeApi
      .getById(listingId)
      .then((data) => {
        if (cancelled) return
        const rec = data as Record<string, unknown>
        setLoadedListing(rec)
        setFormData(conciergeListingRecordToFormData(rec))
        setOutreachLogEntries(parseOutreachLogFromListing(rec))
        setExpandedSections(new Set())
      })
      .catch((e: unknown) => {
        if (cancelled) return
        const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
        setListingLoadError(msg || 'Failed to load listing.')
      })
      .finally(() => {
        if (!cancelled) setListingLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [listingId])

  useEffect(() => {
    if (!showListerAboutTemplates) return
    const onDown = (ev: MouseEvent) => {
      if (listerTemplateModalRef.current && !listerTemplateModalRef.current.contains(ev.target as Node)) {
        setShowListerAboutTemplates(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [showListerAboutTemplates])

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
      if (isEditMode && listingId) {
        const updated = await conciergeApi.updateListing(listingId, payload)
        setLoadedListing(updated as Record<string, unknown>)
        navigate('/admin/dashboard', {
          state: { openTab: 'concierge', createSuccess: 'Draft listing updated.' },
        })
      } else {
        const created = await conciergeApi.createDraft(payload)
        const previewUrl = `${window.location.origin}/preview/${created.previewToken}`
        navigate('/admin/dashboard', {
          state: { openTab: 'concierge', createSuccess: `Draft saved. Preview link: ${previewUrl}` },
        })
      }
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || (isEditMode ? 'Failed to update draft.' : 'Failed to create draft.'))
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

  const handleListerPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }
    const maxSize = 2 * 1024 * 1024
    if (file.size > maxSize) {
      setError('Image size must be less than 2MB.')
      return
    }
    setListerPhotoUploading(true)
    setError(null)
    try {
      const url = await uploadApi.uploadProfileImage(file)
      handleChange('conciergeListerProfileImageUrl', url)
    } catch {
      setError('Failed to upload lister photo. Please try again.')
    } finally {
      setListerPhotoUploading(false)
      e.target.value = ''
    }
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
      conciergeSourcePlatform: (formData.conciergeSourcePlatform as string) || undefined,
      conciergeSourcePlatformOther: (formData.conciergeSourcePlatformOther as string)?.trim() || undefined,
      conciergeSourceLink: (formData.conciergeSourceLink as string)?.trim() || undefined,
      conciergeSourceUsername: (formData.conciergeSourceUsername as string)?.trim() || undefined,
      conciergeAddedBy: (formData.conciergeAddedBy as string)?.trim() || undefined,
      conciergeOutreachChannel: (formData.conciergeOutreachChannel as string) || undefined,
      conciergeOutreachStatus:
        ((formData.conciergeOutreachStatus as string) || '').trim() || 'not_contacted',
      conciergeFollowUpDate: ((formData.conciergeFollowUpDate as string) || '').trim() || undefined,
      outreachLogEntries: isEditMode
        ? outreachLogEntries
            .filter((e) => e.note.trim())
            .map((e) => ({
              date: e.date || undefined,
              note: e.note.trim(),
            }))
        : outreachLogEntries.length > 0
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

  const copyPreviewLink = () => {
    const t = loadedListing?.previewToken as string | undefined
    if (!t) return
    void navigator.clipboard.writeText(`${window.location.origin}/preview/${t}`)
  }

  const handleRegeneratePreviewLink = async () => {
    if (!listingId) return
    setActionsBusy(true)
    setError(null)
    try {
      const res = await conciergeApi.regenerateLink(listingId)
      setLoadedListing((prev) => (prev ? { ...prev, previewToken: res.previewToken } : prev))
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Failed to regenerate link.')
    } finally {
      setActionsBusy(false)
    }
  }

  const handlePublishOnBehalf = async () => {
    if (!listingId) return
    setActionsBusy(true)
    setError(null)
    try {
      await conciergeApi.publishOnBehalf(listingId)
      const fresh = await conciergeApi.getById(listingId)
      setLoadedListing(fresh as Record<string, unknown>)
      navigate('/admin/dashboard', { state: { openTab: 'concierge', createSuccess: 'Listing published on behalf of owner.' } })
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Failed to publish.')
    } finally {
      setActionsBusy(false)
    }
  }

  const handlePublishChanges = async () => {
    if (!listingId) return
    setActionsBusy(true)
    setError(null)
    try {
      await conciergeApi.publishChanges(listingId)
      const fresh = await conciergeApi.getById(listingId)
      setLoadedListing(fresh as Record<string, unknown>)
      setFormData(conciergeListingRecordToFormData(fresh as Record<string, unknown>))
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Failed to publish changes.')
    } finally {
      setActionsBusy(false)
    }
  }

  if (listingId && listingLoading) {
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
        <div className="flex flex-1 items-center justify-center py-24">
          <RefreshCw className="w-10 h-10 text-orange-500 animate-spin" />
        </div>
        <Footer />
      </div>
    )
  }

  if (listingId && listingLoadError) {
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
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
          <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
          <p className="text-red-800 text-center mb-4">{listingLoadError}</p>
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard', { state: { openTab: 'concierge' } })}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Back to Concierge
          </button>
        </div>
        <Footer />
      </div>
    )
  }

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
              <h1 className="text-xl sm:text-[1.375rem] font-bold text-gray-900">
                {isEditMode ? 'Edit draft listing' : 'Create Draft Listing'}
              </h1>
              <p className="text-[0.825rem] text-gray-600">
                {isEditMode
                  ? 'Same form as create: every field is shown; empty fields can be filled in now.'
                  : 'All fields are optional. Add details as needed.'}
              </p>
            </div>

            {isEditMode && loadedListing && (
              <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm space-y-3">
                <p className="text-sm font-semibold text-gray-900">Preview &amp; publish</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={actionsBusy || !loadedListing.previewToken}
                    onClick={copyPreviewLink}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Copy className="w-4 h-4" /> Copy preview link
                  </button>
                  <button
                    type="button"
                    disabled={actionsBusy}
                    onClick={() => void handleRegeneratePreviewLink()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${actionsBusy ? 'animate-spin' : ''}`} /> Regenerate link
                  </button>
                </div>
                {(loadedListing.status as string) !== 'live' && (
                  <button
                    type="button"
                    disabled={actionsBusy}
                    onClick={() => void handlePublishOnBehalf()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {actionsBusy ? 'Working…' : 'Publish on behalf'}
                  </button>
                )}
                {loadedListing.conciergeHasUnpublishedEdits === true && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-amber-800 mb-2">This listing has unpublished edits (live on site).</p>
                    <button
                      type="button"
                      disabled={actionsBusy}
                      onClick={() => void handlePublishChanges()}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50"
                    >
                      Publish changes to live
                    </button>
                  </div>
                )}
              </div>
            )}

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
                              <p className="text-xs text-gray-500 -mt-1 mb-3">
                                Same fields and groupings as the user Profile page. Optional for drafts; name is stored as
                                first + last on the listing. Photo and &quot;About you&quot; appear on the public preview
                                where configured.
                              </p>

                              {/* Profile photo — matches Profile */}
                              <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <input
                                      id="concierge-lister-photo"
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={handleListerPhotoUpload}
                                      disabled={listerPhotoUploading}
                                    />
                                    <label
                                      htmlFor="concierge-lister-photo"
                                      className={`w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white text-lg font-semibold cursor-pointer hover:opacity-90 transition-opacity overflow-hidden ${
                                        listerPhotoUploading ? 'opacity-50 cursor-not-allowed' : ''
                                      }`}
                                    >
                                      {(formData.conciergeListerProfileImageUrl as string) ? (
                                        <img
                                          src={formData.conciergeListerProfileImageUrl as string}
                                          alt="Lister"
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        ((formData.conciergeListerFirstName as string) || 'L').charAt(0).toUpperCase()
                                      )}
                                    </label>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Click to upload</p>
                                    <p className="text-xs text-gray-400 mt-0.5">JPG, PNG or GIF. Max 2MB</p>
                                    {listerPhotoUploading && (
                                      <p className="text-xs text-orange-500 mt-1">Uploading…</p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Basic Information */}
                              <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-orange-500" />
                                <p className="text-sm font-semibold text-gray-900">Basic Information</p>
                              </div>
                              <div className="border border-gray-200 rounded-lg p-4 space-y-4 mb-6 bg-white">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input
                                      type="text"
                                      value={(formData.conciergeListerFirstName as string) || ''}
                                      onChange={(e) => handleChange('conciergeListerFirstName', e.target.value)}
                                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                      placeholder="Enter your first name"
                                      autoComplete="given-name"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                      type="text"
                                      value={(formData.conciergeListerLastName as string) || ''}
                                      onChange={(e) => handleChange('conciergeListerLastName', e.target.value)}
                                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                      placeholder="Enter your last name"
                                      autoComplete="family-name"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                                    Email
                                  </label>
                                  <input
                                    type="email"
                                    value={(formData.conciergeListerEmail as string) || ''}
                                    onChange={(e) => handleChange('conciergeListerEmail', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                    placeholder="owner@example.com"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">Lister contact email (for outreach and claim flow).</p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                                    Phone Number
                                  </label>
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
                                    placeholder="10-digit mobile number (e.g., 9876543210)"
                                    maxLength={10}
                                  />
                                  {listerPhoneInvalid && (
                                    <p className="mt-1 text-xs text-red-600">{INDIAN_MOBILE_HINT}</p>
                                  )}
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <Users className="w-3.5 h-3.5 text-gray-400" />
                                    Gender
                                  </label>
                                  <select
                                    value={(formData.conciergeListerGender as string) || ''}
                                    onChange={(e) => handleChange('conciergeListerGender', e.target.value)}
                                    className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  >
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </div>
                              </div>

                              {/* Professional Information */}
                              <div className="flex items-center gap-2 mb-2">
                                <Briefcase className="w-4 h-4 text-orange-500" />
                                <p className="text-sm font-semibold text-gray-900">Professional Information</p>
                              </div>
                              <div className="border border-gray-200 rounded-lg p-4 space-y-4 mb-6 bg-white">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                                    Occupation / Role
                                  </label>
                                  <input
                                    type="text"
                                    value={(formData.conciergeListerOccupation as string) || ''}
                                    onChange={(e) => handleChange('conciergeListerOccupation', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                    placeholder="e.g., Software Engineer, Marketing Manager"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <Building className="w-3.5 h-3.5 text-gray-400" />
                                    Company Name
                                  </label>
                                  <input
                                    type="text"
                                    value={(formData.conciergeListerCompanyName as string) || ''}
                                    onChange={(e) => handleChange('conciergeListerCompanyName', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                    placeholder="Enter company name"
                                  />
                                </div>
                              </div>

                              {/* About You */}
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-orange-500" />
                                <p className="text-sm font-semibold text-gray-900">About You</p>
                              </div>
                              <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-white">
                                <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-1.5">
                                  <span>About You</span>
                                  <button
                                    type="button"
                                    onClick={() => setShowListerAboutTemplates(true)}
                                    className="text-xs text-orange-500 hover:text-orange-600 hover:underline font-normal"
                                  >
                                    Choose from pre-written templates
                                  </button>
                                </label>
                                <textarea
                                  value={(formData.conciergeListerAbout as string) || ''}
                                  onChange={(e) => handleChange('conciergeListerAbout', e.target.value)}
                                  rows={5}
                                  maxLength={500}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
                                  placeholder="Tell us about yourself..."
                                />
                                <p className="text-xs text-gray-500 mt-1 text-right">
                                  {String((formData.conciergeListerAbout as string) || '').length}/500 characters
                                </p>
                              </div>

                              {/* Lifestyle */}
                              <div className="flex items-center gap-2 mb-2">
                                <Users className="w-4 h-4 text-orange-500" />
                                <p className="text-sm font-semibold text-gray-900">Lifestyle Preferences</p>
                              </div>
                              <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-white">
                                <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg">
                                  <p className="text-xs text-blue-800">
                                    These preferences are private and used only to recommend compatible homes and flatmates.
                                  </p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <Cigarette className="w-3.5 h-3.5 text-gray-400" />
                                    Smoking
                                  </label>
                                  <select
                                    value={(formData.conciergeListerSmoking as string) || ''}
                                    onChange={(e) => handleChange('conciergeListerSmoking', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  >
                                    <option value="">Select preference</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                    <option value="Occasionally">Occasionally</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <Wine className="w-3.5 h-3.5 text-gray-400" />
                                    Drinking
                                  </label>
                                  <select
                                    value={(formData.conciergeListerDrinking as string) || ''}
                                    onChange={(e) => handleChange('conciergeListerDrinking', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  >
                                    <option value="">Select preference</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                    <option value="Occasionally">Occasionally</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <Utensils className="w-3.5 h-3.5 text-gray-400" />
                                    Food Preference
                                  </label>
                                  <select
                                    value={(formData.conciergeListerFoodPreference as string) || ''}
                                    onChange={(e) => handleChange('conciergeListerFoodPreference', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  >
                                    <option value="">Select preference</option>
                                    <option value="Vegetarian">Vegetarian</option>
                                    <option value="Non-vegetarian">Non-vegetarian</option>
                                    <option value="Eggetarian">Eggetarian</option>
                                  </select>
                                </div>
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
                    {submitting ? 'Saving…' : isEditMode ? 'Save changes' : 'Save'}
                  </button>
                </div>
              </div>

              {showListerAboutTemplates && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div
                    ref={listerTemplateModalRef}
                    className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                  >
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">About You Templates</h3>
                        <p className="text-sm text-gray-600 mt-1">Same templates as the user Profile page</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowListerAboutTemplates(false)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {LISTER_ABOUT_TEMPLATES.map((template) => {
                          const IconComponent = template.icon
                          return (
                            <div
                              key={template.id}
                              className="bg-white border border-gray-200 rounded-lg p-5 hover:border-orange-400 hover:shadow-md transition-all relative group"
                            >
                              <div className="flex items-start gap-3 mb-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <IconComponent className="w-5 h-5 text-orange-600" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 mb-1">{template.title}</h4>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => navigator.clipboard.writeText(template.content)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-orange-600"
                                  title="Copy template"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-3">{template.content}</p>
                              <button
                                type="button"
                                onClick={() => {
                                  handleChange('conciergeListerAbout', template.content)
                                  setShowListerAboutTemplates(false)
                                }}
                                className="text-sm font-medium text-orange-600 hover:text-orange-700"
                              >
                                Use This Template →
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
