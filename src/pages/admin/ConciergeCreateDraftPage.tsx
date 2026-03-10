import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import DashboardHeader from '@/components/DashboardHeader'
import DashboardSidebar from '@/components/DashboardSidebar'
import { LayoutGrid, Home, MessageSquare, Settings, Users, Flag, Briefcase, ArrowLeft, Image } from 'lucide-react'
import { conciergeApi, uploadApi } from '@/services/api'
import { MoveInDateField } from '@/components/MoveInDateField'
import { useStore } from '@/store/useStore'

const SECTIONS = [
  { id: 'photos', title: 'Photos', icon: Image },
  { id: 'lister', title: 'Lister Profile', icon: Users },
  { id: 'property', title: 'Property Details', icon: Home },
  { id: 'tracking', title: 'Concierge Tracking', icon: Briefcase },
]

export default function ConciergeCreateDraftPage() {
  const navigate = useNavigate()
  const user = useStore((state) => state.user)
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]))
  const [formData, setFormData] = useState<Record<string, string | number | boolean | string[] | undefined>>({
    photos: [],
    title: '',
    city: '',
    locality: '',
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
    lgbtqFriendly: false,
    conciergeListerName: '',
    conciergeListerEmail: '',
    conciergeListerPhone: '',
    conciergeListerOccupation: '',
    conciergeListerCurrentCity: '',
    conciergeSourcePlatform: '',
    conciergeSourcePlatformOther: '',
    conciergeSourceLink: '',
    conciergeSourceUsername: '',
    conciergeAddedBy: '',
    conciergeOutreachChannel: '',
  })
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

  const performSubmit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const payload = buildPayload()
      const created = await conciergeApi.createDraft(payload)
      const previewUrl = `${window.location.origin}/preview/${created.previewToken}`
      navigate('/admin/dashboard', {
        state: { openTab: 'concierge', createSuccess: `Draft created. Preview link: ${previewUrl}` },
      })
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Failed to create draft.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSectionContinue = (index: number) => {
    if (index === SECTIONS.length - 1) {
      performSubmit()
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

  const handleAmenityToggle = (field: 'flatAmenities' | 'societyAmenities', value: string) => {
    const arr = (formData[field] as string[]) || []
    const next = arr.includes(value) ? arr.filter((a) => a !== value) : [...arr, value]
    handleChange(field, next)
  }

  const buildPayload = () => {
    const flatAmenities = (formData.flatAmenities as string[]) || []
    const societyAmenities = (formData.societyAmenities as string[]) || []
    const photos = (formData.photos as string[]) || []
    return {
      photos: photos.length ? photos : undefined,
      title: (formData.title as string)?.trim() || 'Untitled Listing',
      city: (formData.city as string)?.trim() || undefined,
      locality: (formData.locality as string)?.trim() || undefined,
      societyName: (formData.societyName as string)?.trim() || undefined,
      roomType: (formData.roomType as string) || undefined,
      buildingType: (formData.buildingType as string) || undefined,
      bhkType: (formData.bhkType as string) || undefined,
      furnishingLevel: (formData.furnishingLevel as string) || undefined,
      bathroomType: (formData.bathroomType as string) || undefined,
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
      lgbtqFriendly: formData.lgbtqFriendly ? true : undefined,
      conciergeListerName: (formData.conciergeListerName as string)?.trim() || undefined,
      conciergeListerEmail: (formData.conciergeListerEmail as string)?.trim() || undefined,
      conciergeListerPhone: (formData.conciergeListerPhone as string)?.trim() || undefined,
      conciergeListerOccupation: (formData.conciergeListerOccupation as string)?.trim() || undefined,
      conciergeListerCurrentCity: (formData.conciergeListerCurrentCity as string)?.trim() || undefined,
      conciergeSourcePlatform: (formData.conciergeSourcePlatform as string) || undefined,
      conciergeSourcePlatformOther: (formData.conciergeSourcePlatformOther as string)?.trim() || undefined,
      conciergeSourceLink: (formData.conciergeSourceLink as string)?.trim() || undefined,
      conciergeSourceUsername: (formData.conciergeSourceUsername as string)?.trim() || undefined,
      conciergeAddedBy: (formData.conciergeAddedBy as string)?.trim() || undefined,
      conciergeOutreachChannel: (formData.conciergeOutreachChannel as string) || undefined,
      conciergeOutreachStatus: 'not_contacted',
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    performSubmit()
  }

  const userName = user?.name || user?.email?.split('@')[0] || 'Admin'
  const userEmail = user?.email || ''
  const flatList = (formData.flatAmenities as string[]) || []
  const societyList = (formData.societyAmenities as string[]) || []

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

            <form onSubmit={handleSubmit}>
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
                          {section.id === 'lister' && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lister Name</label>
                                <input
                                  type="text"
                                  value={(formData.conciergeListerName as string) || ''}
                                  onChange={(e) => handleChange('conciergeListerName', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  placeholder="Owner name"
                                />
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
                                  value={(formData.conciergeListerPhone as string) || ''}
                                  onChange={(e) => handleChange('conciergeListerPhone', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  placeholder="10-digit mobile"
                                />
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
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current City</label>
                                <input
                                  type="text"
                                  value={(formData.conciergeListerCurrentCity as string) || ''}
                                  onChange={(e) => handleChange('conciergeListerCurrentCity', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  placeholder="Optional"
                                />
                              </div>
                            </>
                          )}

                          {section.id === 'property' && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                  type="text"
                                  value={(formData.title as string) || ''}
                                  onChange={(e) => handleChange('title', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  placeholder="Untitled Listing"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                  <input
                                    type="text"
                                    value={(formData.city as string) || ''}
                                    onChange={(e) => handleChange('city', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                    placeholder="e.g. Bangalore"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Locality</label>
                                  <input
                                    type="text"
                                    value={(formData.locality as string) || ''}
                                    onChange={(e) => handleChange('locality', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                    placeholder="e.g. Koramangala"
                                  />
                                </div>
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
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                                <select
                                  value={(formData.roomType as string) || ''}
                                  onChange={(e) => handleChange('roomType', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                >
                                  <option value="">—</option>
                                  <option value="Private Room">Private Room</option>
                                  <option value="Shared Room">Shared Room</option>
                                  <option value="Master Room">Master Room</option>
                                </select>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Building Type</label>
                                  <select
                                    value={(formData.buildingType as string) || ''}
                                    onChange={(e) => handleChange('buildingType', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  >
                                    <option value="">—</option>
                                    <option value="Gated Society">Gated Society</option>
                                    <option value="Standalone Apartment">Standalone Apartment</option>
                                    <option value="Independent House">Independent House</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">BHK Type</label>
                                  <select
                                    value={(formData.bhkType as string) || ''}
                                    onChange={(e) => handleChange('bhkType', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  >
                                    <option value="">—</option>
                                    <option value="1BHK">1 BHK</option>
                                    <option value="2BHK">2 BHK</option>
                                    <option value="3BHK">3 BHK</option>
                                    <option value="4BHK+">4 BHK+</option>
                                  </select>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Furnishing</label>
                                  <select
                                    value={(formData.furnishingLevel as string) || ''}
                                    onChange={(e) => handleChange('furnishingLevel', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  >
                                    <option value="">—</option>
                                    <option value="Fully Furnished">Fully Furnished</option>
                                    <option value="Semi-furnished">Semi-furnished</option>
                                    <option value="Unfurnished">Unfurnished</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Bathroom Type</label>
                                  <select
                                    value={(formData.bathroomType as string) || ''}
                                    onChange={(e) => handleChange('bathroomType', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  >
                                    <option value="">—</option>
                                    <option value="Attached">Attached</option>
                                    <option value="Common">Common</option>
                                  </select>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Rent (₹/month)</label>
                                  <input
                                    type="number"
                                    min={0}
                                    value={(formData.rent as string) ?? ''}
                                    onChange={(e) => handleChange('rent', e.target.value || '')}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                    placeholder="15000"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Deposit (₹)</label>
                                  <input
                                    type="number"
                                    min={0}
                                    value={(formData.deposit as string) ?? ''}
                                    onChange={(e) => handleChange('deposit', e.target.value || '')}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                    placeholder="30000"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Move-in Date</label>
                                <MoveInDateField
                                  value={(formData.moveInDate as string) || undefined}
                                  onChange={(v) => handleChange('moveInDate', v || '')}
                                  hideLabel
                                  className="w-full border border-gray-300 rounded-lg bg-white"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                  rows={2}
                                  value={(formData.description as string) || ''}
                                  onChange={(e) => handleChange('description', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  placeholder="Optional"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Flat Amenities</label>
                                <div className="flex flex-wrap gap-2">
                                  {['WiFi', 'AC', 'TV', 'Kitchen', 'Washing machine', 'Fridge', 'Geyser', 'Sofa', 'Bed'].map((a) => (
                                    <label
                                      key={a}
                                      className={`inline-flex items-center gap-1.5 px-2 py-1.5 border rounded-lg cursor-pointer hover:bg-gray-50 text-sm ${
                                        flatList.includes(a) ? 'border-orange-400 bg-orange-50' : 'border-gray-200'
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={flatList.includes(a)}
                                        onChange={() => handleAmenityToggle('flatAmenities', a)}
                                        className="rounded text-orange-500"
                                      />
                                      {a}
                                    </label>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Society Amenities</label>
                                <div className="flex flex-wrap gap-2">
                                  {['Gym', 'Pool', 'Security', 'Parking'].map((a) => (
                                    <label
                                      key={a}
                                      className={`inline-flex items-center gap-1.5 px-2 py-1.5 border rounded-lg cursor-pointer hover:bg-gray-50 text-sm ${
                                        societyList.includes(a) ? 'border-orange-400 bg-orange-50' : 'border-gray-200'
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={societyList.includes(a)}
                                        onChange={() => handleAmenityToggle('societyAmenities', a)}
                                        className="rounded text-orange-500"
                                      />
                                      {a}
                                    </label>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Gender</label>
                                <select
                                  value={(formData.preferredGender as string) || ''}
                                  onChange={(e) => handleChange('preferredGender', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                >
                                  <option value="">—</option>
                                  <option value="Male">Male Only</option>
                                  <option value="Female">Female Only</option>
                                  <option value="Any">Any</option>
                                </select>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Food Preference</label>
                                  <select
                                    value={(formData.foodPreference as string) || ''}
                                    onChange={(e) => handleChange('foodPreference', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  >
                                    <option value="">—</option>
                                    <option value="Vegetarian only">Vegetarian only</option>
                                    <option value="Non-veg allowed">Non-veg allowed</option>
                                    <option value="Open">Open</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Pet Policy</label>
                                  <select
                                    value={(formData.petPolicy as string) || ''}
                                    onChange={(e) => handleChange('petPolicy', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  >
                                    <option value="">—</option>
                                    <option value="Pets allowed">Pets allowed</option>
                                    <option value="Not allowed">Not allowed</option>
                                  </select>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Smoking Policy</label>
                                  <select
                                    value={(formData.smokingPolicy as string) || ''}
                                    onChange={(e) => handleChange('smokingPolicy', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  >
                                    <option value="">—</option>
                                    <option value="Allowed">Allowed</option>
                                    <option value="Not allowed">Not allowed</option>
                                    <option value="No issues">No issues</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Drinking Policy</label>
                                  <select
                                    value={(formData.drinkingPolicy as string) || ''}
                                    onChange={(e) => handleChange('drinkingPolicy', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  >
                                    <option value="">—</option>
                                    <option value="Allowed">Allowed</option>
                                    <option value="Not allowed">Not allowed</option>
                                    <option value="No issues">No issues</option>
                                  </select>
                                </div>
                              </div>
                              <div>
                                <label className="inline-flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={!!formData.lgbtqFriendly}
                                    onChange={(e) => handleChange('lgbtqFriendly', e.target.checked)}
                                    className="rounded text-orange-500"
                                  />
                                  <span className="text-sm font-medium text-gray-700">LGBTQ+ friendly</span>
                                </label>
                              </div>
                            </>
                          )}

                          {section.id === 'tracking' && (
                            <>
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
                            </>
                          )}

                          {/* Section footer with Continue */}
                          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                            <button
                              type="button"
                              onClick={() => handleSectionContinue(index)}
                              disabled={submitting}
                              className="w-full sm:w-auto text-sm px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-1.5"
                            >
                              {submitting
                                ? 'Creating...'
                                : index === SECTIONS.length - 1
                                ? 'Create Draft'
                                : 'Continue'}
                              {!submitting && index < SECTIONS.length - 1 && (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => navigate('/admin/dashboard', { state: { openTab: 'concierge' } })}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Draft'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
