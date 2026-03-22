import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ListingHeading from '@/components/ListingHeading'
import ListingPhotos from '@/components/ListingPhotos'
import RoomDetails from '@/components/RoomDetails'
import AmenitiesSection from '@/components/AmenitiesSection'
import MeetYourHost from '@/components/MeetYourHost'
import { previewApi } from '@/services/api'
import { Listing } from '@/types'
import { mapApiListingToListing } from '@/utils/mapApiListingToListing'
import { AlertCircle, Save, Zap } from 'lucide-react'
import {
  joinFullName,
  splitFullName,
  sanitizeIndianMobileInput,
  isValidIndianMobile10Digits,
  INDIAN_MOBILE_HINT,
} from '@/utils/listerProfile'

interface PreviewFormData {
  title: string
  city: string
  locality: string
  rent: number
  deposit: number
  description: string
  listerFirstName: string
  listerLastName: string
  conciergeListerEmail: string
  conciergeListerPhone: string
}

const emptyForm: PreviewFormData = {
  title: '',
  city: '',
  locality: '',
  rent: 0,
  deposit: 0,
  description: '',
  listerFirstName: '',
  listerLastName: '',
  conciergeListerEmail: '',
  conciergeListerPhone: '',
}

function listingToForm(listing: Record<string, unknown>): PreviewFormData {
  const fullName = (listing.conciergeListerName as string) || ''
  const { first, last } = splitFullName(fullName)
  const rawPhone = (listing.conciergeListerPhone as string) || ''
  return {
    title: (listing.title as string) || '',
    city: (listing.city as string) || '',
    locality: (listing.locality as string) || '',
    rent: (listing.rent as number) || 0,
    deposit: (listing.deposit as number) || 0,
    description: (listing.description as string) || '',
    listerFirstName: first,
    listerLastName: last,
    conciergeListerEmail: (listing.conciergeListerEmail as string) || '',
    conciergeListerPhone: sanitizeIndianMobileInput(rawPhone),
  }
}

function formToPreviewPayload(form: PreviewFormData): Record<string, unknown> {
  return {
    title: form.title,
    city: form.city,
    locality: form.locality,
    rent: form.rent,
    deposit: form.deposit,
    description: form.description,
    conciergeListerName: joinFullName(form.listerFirstName, form.listerLastName),
    conciergeListerEmail: form.conciergeListerEmail,
    conciergeListerPhone: form.conciergeListerPhone.replace(/\D/g, ''),
  }
}

export default function PreviewPage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [listing, setListing] = useState<Record<string, unknown> | null>(null)
  const [form, setForm] = useState<PreviewFormData>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [publishResult, setPublishResult] = useState<{ setPasswordSent?: boolean; listingId?: string } | null>(null)

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
        setForm(listingToForm(data))
      })
      .catch((e) => {
        const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'This link may have expired.'
        setError(msg)
      })
      .finally(() => setLoading(false))
  }, [token])

  /** Same shape as the public listing page — merged with form for live edits */
  const displayListing: Listing | null = useMemo(() => {
    const base = mapApiListingToListing(listing)
    if (!base) return null
    const listerName = joinFullName(form.listerFirstName, form.listerLastName).trim()
    return {
      ...base,
      title: form.title,
      city: form.city,
      locality: form.locality,
      rent: form.rent,
      deposit: form.deposit,
      description: form.description,
      conciergeListerName: listerName || base.conciergeListerName,
      conciergeListerProfileImageUrl: base.conciergeListerProfileImageUrl,
      conciergeListerAbout: base.conciergeListerAbout,
    }
  }, [listing, form])

  const hostFromPreview = useMemo(() => {
    const fromForm = joinFullName(form.listerFirstName, form.listerLastName).trim()
    const nameFromListing = (listing?.conciergeListerName as string)?.trim()
    return {
      name: fromForm || nameFromListing || '',
      profileImageUrl: (listing?.conciergeListerProfileImageUrl as string) || undefined,
      about: (listing?.conciergeListerAbout as string)?.trim() || undefined,
    }
  }, [listing, form.listerFirstName, form.listerLastName])

  const phoneDigits = form.conciergeListerPhone.replace(/\D/g, '')
  const phoneInvalid =
    phoneDigits.length > 0 && !isValidIndianMobile10Digits(phoneDigits)

  const handleSave = async () => {
    if (!token) return
    if (phoneInvalid) {
      setError(INDIAN_MOBILE_HINT)
      return
    }
    setSaving(true)
    setSaveSuccess(false)
    try {
      const updated = await previewApi.updateByToken(token, formToPreviewPayload(form))
      setListing(updated as Record<string, unknown>)
      setForm(listingToForm(updated as Record<string, unknown>))
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
    title: !!(form.title?.trim()),
    rent: !!(form.rent && form.rent > 0),
    email: !!(form.conciergeListerEmail?.trim()),
    firstName: !!(form.listerFirstName?.trim()),
    lastName: !!(form.listerLastName?.trim()),
    phoneOk: isValidIndianMobile10Digits(phoneDigits),
  }
  const allRequiredFilled =
    requiredFields.title &&
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
    const email = form.conciergeListerEmail?.trim()
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
      await previewApi.updateByToken(token, formToPreviewPayload(form))
      const res = await previewApi.publish(token, replaceExisting ? { replaceExisting: true } : undefined)
      const lid = res.listing?._id || res.listing?.id
      setPublishResult({ setPasswordSent: res.setPasswordSent, listingId: lid })
      const published = res.listing as Record<string, unknown> | undefined
      if (published) {
        setListing(published)
        setForm(listingToForm(published))
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

  return (
    <div className="min-h-screen flex flex-col bg-stone-100">
      <Header />

      <main className="flex-1 w-full">
        {/* Intro + status banners */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-4">
          {!publishResult && (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
              <p className="text-orange-800 font-medium">
                We found your listing and created this for you. Below is exactly how your place appears on MOKOGO — review every
                detail, then scroll down to confirm your contact info and publish.
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

        {/* Production-style listing view (matches /listings/:id) */}
        {displayListing && (
          <>
            <ListingHeading listing={displayListing} showVerified={false} showActions={false} />
            <ListingPhotos
              listing={displayListing}
              mainImageHeight="h-[280px] sm:h-[350px] lg:h-[500px]"
              thumbnailHeight="h-[70px] sm:h-[90px] lg:h-[120px]"
            />
            <section className="py-6 sm:py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="space-y-8 max-w-4xl mx-auto lg:max-w-none">
                  <RoomDetails listing={displayListing} />
                  <AmenitiesSection listing={displayListing} />
                  <MeetYourHost listing={displayListing} hostInfo={hostFromPreview} />
                </div>
              </div>
            </section>

            {/* Success confirmation — full listing preview above */}
            {publishResult && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
                <div className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50/80 border-2 border-green-200 rounded-xl shadow-md space-y-4">
                  {/* Primary action first — most important next step after publish */}
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
                      Everything above is what seekers see on your public page. You can still edit details anytime from your
                      dashboard.
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
          </>
        )}

        {/* Edit & publish — same fields as before; updates preview via Save */}
        {status !== 'live' && (
          <div className="max-w-4xl mx-auto w-full px-4 pb-12 sm:px-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mt-4">
              <div className="bg-stone-50 border-b border-stone-200 px-4 py-3">
                <h2 className="text-lg font-semibold text-gray-900">Confirm &amp; publish</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Update title, location, rent, description, and your contact details. Saving updates what seekers will see
                  after you go live.
                </p>
              </div>

              <div className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g. Cozy room in Koramangala"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g. Bangalore"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Locality / Area</label>
                    <input
                      type="text"
                      value={form.locality}
                      onChange={(e) => setForm((f) => ({ ...f, locality: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g. Koramangala"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rent (₹/month) *</label>
                    <input
                      type="number"
                      min={0}
                      value={form.rent || ''}
                      onChange={(e) => setForm((f) => ({ ...f, rent: Number(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="15000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deposit (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={form.deposit || ''}
                      onChange={(e) => setForm((f) => ({ ...f, deposit: Number(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="30000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Describe your place..."
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Your contact details (required to publish)</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    Same structure as your MOKOGO profile: first &amp; last name, plus a valid 10-digit Indian mobile number.
                  </p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First name *</label>
                        <input
                          type="text"
                          value={form.listerFirstName}
                          onChange={(e) => setForm((f) => ({ ...f, listerFirstName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          placeholder="First name"
                          autoComplete="given-name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last name *</label>
                        <input
                          type="text"
                          value={form.listerLastName}
                          onChange={(e) => setForm((f) => ({ ...f, listerLastName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          placeholder="Last name"
                          autoComplete="family-name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={form.conciergeListerEmail}
                        onChange={(e) => setForm((f) => ({ ...f, conciergeListerEmail: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone number *</label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={form.conciergeListerPhone}
                        onChange={(e) => {
                          const digits = sanitizeIndianMobileInput(e.target.value)
                          setForm((f) => ({ ...f, conciergeListerPhone: digits }))
                          setError(null)
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                          phoneInvalid ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="10-digit mobile (e.g. 9876543210)"
                        maxLength={10}
                        autoComplete="tel"
                      />
                      {phoneInvalid && <p className="mt-1 text-xs text-red-600">{INDIAN_MOBILE_HINT}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {showChecklist && !allRequiredFilled && (
                <div className="px-6 pb-6">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-amber-800 font-medium">Complete these before publishing:</p>
                    <ul className="list-disc list-inside text-sm text-amber-700 mt-2 space-y-1">
                      {!requiredFields.title && <li>Add a title for your listing</li>}
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
                            `/auth?email=${encodeURIComponent(form.conciergeListerEmail || '')}&phone=${encodeURIComponent(form.conciergeListerPhone || '')}`
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
