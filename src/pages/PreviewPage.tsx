import { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ListingHeading from '@/components/ListingHeading'
import ListingPhotos from '@/components/ListingPhotos'
import RoomDetails from '@/components/RoomDetails'
import AmenitiesSection from '@/components/AmenitiesSection'
import MeetYourHost from '@/components/MeetYourHost'
import { previewApi, uploadApi } from '@/services/api'
import { Listing } from '@/types'
import { mapApiListingToListing } from '@/utils/mapApiListingToListing'
import { AlertCircle, Eye, Save, Zap, PencilLine } from 'lucide-react'
import {
  joinFullName,
  isValidIndianMobile10Digits,
  INDIAN_MOBILE_HINT,
} from '@/utils/listerProfile'
import {
  createEmptyConciergeDraftForm,
  conciergeListingRecordToFormData,
} from '@/utils/conciergeDraftFormFromListing'
import { buildPreviewTokenUpdatePayload } from '@/utils/previewTokenUpdatePayload'
import { PreviewDraftEditForm } from '@/components/preview/PreviewDraftEditForm'

function mergeListingWithPreviewForm(
  listing: Record<string, unknown>,
  formData: Record<string, string | number | boolean | string[] | undefined>,
): Record<string, unknown> {
  const patch = buildPreviewTokenUpdatePayload(formData)
  const merged: Record<string, unknown> = { ...listing }
  for (const [key, val] of Object.entries(patch)) {
    if (val !== undefined) merged[key] = val
  }
  return merged
}

export default function PreviewPage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [listing, setListing] = useState<Record<string, unknown> | null>(null)
  const [formData, setFormData] = useState<Record<string, string | number | boolean | string[] | undefined>>(
    () => createEmptyConciergeDraftForm(),
  )
  const [expandedSections, setExpandedSections] = useState<Set<number>>(() => new Set([0]))
  const [showAboutTemplates, setShowAboutTemplates] = useState(false)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [listerPhotoUploading, setListerPhotoUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [publishResult, setPublishResult] = useState<{ setPasswordSent?: boolean; listingId?: string } | null>(null)
  /** Draft only: switch between live-like preview and the edit form */
  const [mainTab, setMainTab] = useState<'preview' | 'edit'>('preview')
  const skipScrollOnFirstTabRender = useRef(true)

  useEffect(() => {
    if (skipScrollOnFirstTabRender.current) {
      skipScrollOnFirstTabRender.current = false
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [mainTab])

  useEffect(() => {
    if (!token) {
      setError('Invalid preview link')
      setLoading(false)
      return
    }
    previewApi
      .getByToken(token)
      .then((data) => {
        setListing(data)
        setFormData(conciergeListingRecordToFormData(data as Record<string, unknown>))
      })
      .catch((e) => {
        const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'This link may have expired.'
        setError(msg)
      })
      .finally(() => setLoading(false))
  }, [token])

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
    } catch {
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

  const handleSectionContinue = (index: number) => {
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

  /** Same shape as the public listing page — merged with full draft form for live edits */
  const displayListing: Listing | null = useMemo(() => {
    if (!listing) return null
    const merged = mergeListingWithPreviewForm(listing, formData)
    return mapApiListingToListing(merged)
  }, [listing, formData])

  const hostFromPreview = useMemo(() => {
    const fromForm = joinFullName(
      (formData.conciergeListerFirstName as string) || '',
      (formData.conciergeListerLastName as string) || '',
    ).trim()
    const nameFromListing = (listing?.conciergeListerName as string)?.trim()
    const img =
      ((formData.conciergeListerProfileImageUrl as string) || '').trim() ||
      (listing?.conciergeListerProfileImageUrl as string) ||
      ''
    const aboutForm = ((formData.conciergeListerAbout as string) || '').trim()
    const aboutListing = (listing?.conciergeListerAbout as string)?.trim()
    return {
      name: fromForm || nameFromListing || '',
      profileImageUrl: img || undefined,
      about: aboutForm || aboutListing || undefined,
    }
  }, [listing, formData])

  const phoneDigits = ((formData.conciergeListerPhone as string) || '').replace(/\D/g, '')
  const phoneInvalid =
    phoneDigits.length > 0 && !isValidIndianMobile10Digits(phoneDigits)

  const handleSave = async () => {
    if (!token) return
    if (!validateListerPhone()) {
      return
    }
    setSaving(true)
    setSaveSuccess(false)
    try {
      const updated = await previewApi.updateByToken(token, buildPreviewTokenUpdatePayload(formData))
      setListing(updated as Record<string, unknown>)
      setFormData(conciergeListingRecordToFormData(updated as Record<string, unknown>))
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  const [duplicatePrompt, setDuplicatePrompt] = useState(false)
  const [showChecklist, setShowChecklist] = useState(false)

  const requiredFields = {
    rent: !!(formData.rent && Number(formData.rent) > 0),
    email: !!((formData.conciergeListerEmail as string)?.trim()),
    firstName: !!((formData.conciergeListerFirstName as string)?.trim()),
    lastName: !!((formData.conciergeListerLastName as string)?.trim()),
    phoneOk: isValidIndianMobile10Digits(phoneDigits),
  }
  const allRequiredFilled =
    requiredFields.rent &&
    requiredFields.email &&
    requiredFields.firstName &&
    requiredFields.lastName &&
    requiredFields.phoneOk

  const handlePublish = async (replaceExisting?: boolean) => {
    if (!token) return
    if (!allRequiredFilled) {
      setShowChecklist(true)
      if (!requiredFields.phoneOk) {
        setError(INDIAN_MOBILE_HINT)
      }
      return
    }
    const email = (formData.conciergeListerEmail as string)?.trim()
    if (!email) {
      setError('Please add your email address to publish. We need it to create your account.')
      return
    }
    setShowChecklist(false)
    setPublishing(true)
    setError(null)
    setDuplicatePrompt(false)
    try {
      if (!replaceExisting) {
        const check = await previewApi.checkPublish(token)
        // Only block when the account already has another LIVE listing (must replace)
        if (check.duplicateAccount && check.hasActiveLiveListing) {
          setDuplicatePrompt(true)
          setPublishing(false)
          return
        }
        // duplicateAccount && !hasActiveLiveListing → continue: attach to existing account without archiving
      }
      await previewApi.updateByToken(token, buildPreviewTokenUpdatePayload(formData))
      const res = await previewApi.publish(token, replaceExisting ? { replaceExisting: true } : undefined)
      const lid = res.listing?._id || res.listing?.id
      setPublishResult({ setPasswordSent: res.setPasswordSent, listingId: lid })
      const published = res.listing as Record<string, unknown> | undefined
      if (published) {
        setListing(published)
        setFormData(conciergeListingRecordToFormData(published))
      } else {
        setListing((prev) => (prev ? { ...prev, status: 'live', _id: lid || prev._id } : prev))
      }
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to publish'
      setError(msg)
    } finally {
      setPublishing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100">
        <div className="animate-spin w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full" />
        <p className="mt-4 text-gray-600">Loading your listing...</p>
      </div>
    )
  }

  if (error && !listing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Link expired or invalid</h1>
          <p className="text-gray-600 text-center max-w-md">{error}</p>
        </main>
        <Footer />
      </div>
    )
  }

  const status = (listing?.status as string) || ''
  const listingId = (listing?._id as string) || ''
  const isDraft = status !== 'live'
  const showPreviewEditTabs = Boolean(listing && !publishResult && isDraft)

  return (
    <div className="min-h-screen flex flex-col bg-stone-100">
      <Header />

      {/* Draft: toggle between public-style preview and edit form — aligned with max-w-7xl content */}
      {showPreviewEditTabs && (
        <div className="sticky top-0 z-30 border-b border-stone-200/90 bg-stone-100/95 backdrop-blur-md shadow-[0_4px_24px_-12px_rgba(0,0,0,0.08)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <p className="max-w-xl text-center text-sm leading-relaxed text-gray-600">
                <span className="font-semibold text-gray-900">Your draft</span>
                <span className="text-gray-500"> — </span>
                <span className="block sm:inline sm:whitespace-normal">
                  Switch between a live-style preview and editing your details.
                </span>
              </p>
              <div
                className="flex w-full justify-center"
                role="tablist"
                aria-label="Preview and Edit Details"
              >
                <div className="inline-flex w-full max-w-md gap-1 rounded-2xl border border-stone-200/90 bg-white p-1.5 shadow-sm sm:w-auto sm:max-w-none sm:gap-1.5">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mainTab === 'preview'}
                    onClick={() => setMainTab('preview')}
                    className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all sm:min-w-[7.5rem] sm:flex-none ${
                      mainTab === 'preview'
                        ? 'bg-orange-500 text-white shadow-md ring-1 ring-orange-500/20'
                        : 'text-gray-600 hover:bg-stone-50 hover:text-gray-900'
                    }`}
                  >
                    <Eye className="h-4 w-4 shrink-0" aria-hidden />
                    Preview
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mainTab === 'edit'}
                    onClick={() => setMainTab('edit')}
                    className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all sm:min-w-[7.5rem] sm:flex-none ${
                      mainTab === 'edit'
                        ? 'bg-orange-500 text-white shadow-md ring-1 ring-orange-500/20'
                        : 'text-gray-600 hover:bg-stone-50 hover:text-gray-900'
                    }`}
                  >
                    <PencilLine className="h-4 w-4 shrink-0" aria-hidden />
                    Edit Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 w-full">
        {/* Intro + status banners — same horizontal rhythm as tab bar */}
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 ${showPreviewEditTabs ? 'pt-5 sm:pt-6' : 'pt-6 sm:pt-8'}`}
        >
          {!publishResult && isDraft && mainTab === 'preview' && (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
              <p className="text-orange-800 font-medium">
                This is how your listing will look to seekers after it goes live — same layout as the public listing page.
                Switch to <span className="font-semibold">Edit Details</span> to change anything or publish.
              </p>
            </div>
          )}
          {!publishResult && isDraft && mainTab === 'edit' && (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
              <p className="text-orange-800 font-medium">
                Same full form as when your draft was created — photos, property details, and lister profile. Use{' '}
                <span className="font-semibold">Preview</span> anytime to see the live-style view. Your title is
                generated automatically from property details.
              </p>
            </div>
          )}

          {status === 'live' && !publishResult && (
            <div className="p-4 sm:p-6 bg-green-50 border border-green-100 rounded-xl">
              <p className="text-green-800 font-medium">Your listing is live!</p>
              <button
                type="button"
                onClick={() => navigate(`/listings/${listingId}`)}
                className="mt-2 text-green-700 underline font-medium hover:text-green-900"
              >
                Open public listing page
              </button>
            </div>
          )}
        </div>

        {/* Production-style listing view — draft: only on Preview tab; live: always */}
        {displayListing && (mainTab === 'preview' || !isDraft) && (
          <>
            <ListingHeading listing={displayListing} showVerified={false} showActions={false} />
            <ListingPhotos
              listing={displayListing}
              mainImageHeight="h-[280px] sm:h-[350px] lg:h-[500px]"
              thumbnailHeight="h-[70px] sm:h-[90px] lg:h-[120px]"
            />
            <section className="py-6 sm:py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="space-y-8 max-w-4xl mx-auto lg:max-w-none">
                  <RoomDetails listing={displayListing} />
                  <AmenitiesSection listing={displayListing} />
                  <MeetYourHost listing={displayListing} hostInfo={hostFromPreview} />
                </div>
              </div>
            </section>
          </>
        )}

        {publishResult && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50/80 border-2 border-green-200 rounded-xl shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/listings/${publishResult.listingId || listingId}`)}
                  className="order-1 w-full sm:w-auto sm:min-w-[220px] px-6 py-3.5 bg-orange-500 text-white rounded-xl font-semibold text-base shadow-lg shadow-orange-500/25 hover:bg-orange-600 hover:shadow-orange-500/35 transition-all text-center"
                >
                  View your listing
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/auth')}
                  className="order-2 w-full sm:w-auto px-5 py-3 border-2 border-gray-300 bg-white text-gray-800 rounded-xl font-medium hover:bg-gray-50 text-center"
                >
                  Sign in
                </button>
              </div>
              <div className="pt-1 border-t border-green-200/80 space-y-2">
                <p className="text-green-900 font-semibold text-lg">Your listing is now live!</p>
                <p className="text-green-800 text-sm">
                  This is what seekers see on your public page. You can still edit details anytime from your dashboard.
                </p>
                {publishResult.setPasswordSent && (
                  <p className="text-green-700 text-sm">
                    We&apos;ve sent you an email to set your password. Check your inbox and click the link to access your
                    account.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit & publish — draft + Edit tab only */}
        {isDraft && mainTab === 'edit' && (
          <div className="max-w-4xl mx-auto w-full px-4 pb-12 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mt-2 sm:mt-4">
              <div className="bg-stone-50 border-b border-stone-200 px-4 py-3">
                <h2 className="text-lg font-semibold text-gray-900">Confirm &amp; publish</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Save progress anytime. When you&apos;re ready, publish to go live. The preview tab shows exactly how seekers
                  will see your listing.
                </p>
              </div>

              <div className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
                )}

                <PreviewDraftEditForm
                  formData={formData}
                  listingFormData={listingFormData}
                  expandedSections={expandedSections}
                  onToggleSection={toggleSection}
                  onFieldChange={handleChange}
                  onListingFieldsChange={handleListingFieldsChange}
                  photoUploading={photoUploading}
                  listerPhotoUploading={listerPhotoUploading}
                  onPhotoUpload={handlePhotoUpload}
                  onRemovePhoto={removePhoto}
                  onListerPhotoUpload={handleListerPhotoUpload}
                  listerPhoneInvalid={phoneInvalid}
                  showAboutTemplates={showAboutTemplates}
                  onShowAboutTemplates={setShowAboutTemplates}
                  onSectionContinue={handleSectionContinue}
                  savingOrPublishing={saving || publishing}
                />
              </div>

              {showChecklist && !allRequiredFilled && (
                <div className="px-6 pb-6">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-amber-800 font-medium">Complete these before publishing:</p>
                    <ul className="list-disc list-inside text-sm text-amber-700 mt-2 space-y-1">
                      {!requiredFields.rent && <li>Set the monthly rent (₹)</li>}
                      {!requiredFields.firstName && <li>Add your first name</li>}
                      {!requiredFields.lastName && <li>Add your last name</li>}
                      {!requiredFields.email && <li>Add your email address</li>}
                      {!requiredFields.phoneOk && <li>Add a valid 10-digit Indian mobile number</li>}
                    </ul>
                  </div>
                </div>
              )}

              {duplicatePrompt && (
                <div className="px-6 pb-6">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-amber-800 font-medium">You already have a MOKOGO account with this email or number.</p>
                    <p className="text-sm text-amber-700 mt-1 mb-3">
                      You already have another listing live. Choose how to continue — we only allow one active listing at a time.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/auth?email=${encodeURIComponent((formData.conciergeListerEmail as string) || '')}&phone=${encodeURIComponent((formData.conciergeListerPhone as string) || '')}`
                          )
                        }
                        className="px-4 py-2 border border-amber-600 text-amber-800 rounded-lg font-medium hover:bg-amber-100"
                      >
                        Log in to your existing account — your new listing will be saved as a draft
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePublish(true)}
                        disabled={publishing}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50"
                      >
                        Make this listing live — your current active listing will be archived
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6 border-t border-gray-200 bg-gray-50 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save progress'}
                </button>
                <button
                  type="button"
                  onClick={() => handlePublish()}
                  disabled={publishing}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" />
                  {publishing ? 'Publishing...' : 'Make it Live'}
                </button>
                {saveSuccess && (
                  <span className="text-sm text-green-600 font-medium self-center">Saved!</span>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
