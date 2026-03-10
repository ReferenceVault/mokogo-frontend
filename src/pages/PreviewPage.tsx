import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { previewApi } from '@/services/api'
import { Home, AlertCircle, Save, Zap } from 'lucide-react'

interface PreviewFormData {
  title: string
  city: string
  locality: string
  rent: number
  deposit: number
  description: string
  conciergeListerName: string
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
  conciergeListerName: '',
  conciergeListerEmail: '',
  conciergeListerPhone: '',
}

function listingToForm(listing: Record<string, unknown>): PreviewFormData {
  return {
    title: (listing.title as string) || '',
    city: (listing.city as string) || '',
    locality: (listing.locality as string) || '',
    rent: (listing.rent as number) || 0,
    deposit: (listing.deposit as number) || 0,
    description: (listing.description as string) || '',
    conciergeListerName: (listing.conciergeListerName as string) || '',
    conciergeListerEmail: (listing.conciergeListerEmail as string) || '',
    conciergeListerPhone: (listing.conciergeListerPhone as string) || '',
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

  const handleSave = async () => {
    if (!token) return
    setSaving(true)
    setSaveSuccess(false)
    try {
      const updated = await previewApi.updateByToken(token, { ...form })
      setListing(updated)
      setForm(listingToForm(updated))
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
    name: !!(form.conciergeListerName?.trim()),
  }
  const allRequiredFilled = requiredFields.title && requiredFields.rent && requiredFields.email && requiredFields.name

  const handlePublish = async (replaceExisting?: boolean) => {
    if (!token) return
    if (!allRequiredFilled) {
      setShowChecklist(true)
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
        if (check.duplicateAccount) {
          setDuplicatePrompt(true)
          setPublishing(false)
          return
        }
      }
      const res = await previewApi.publish(token, replaceExisting ? { replaceExisting: true } : undefined)
      const lid = res.listing?._id || res.listing?.id
      setPublishResult({ setPasswordSent: res.setPasswordSent, listingId: lid })
      setListing((prev) => (prev ? { ...prev, status: 'live', _id: lid || prev._id } : prev))
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to publish'
      setError(msg)
    } finally {
      setPublishing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
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

  const photos = (listing?.photos as string[]) || []
  const title = form.title || 'Your listing'
  const status = (listing?.status as string) || ''
  const listingId = (listing?._id as string) || ''

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Message */}
          <div className="bg-orange-50 border-b border-orange-100 p-4">
            <p className="text-orange-800 font-medium">
              We found your listing and created this for you. Review the details, edit if needed, and publish for free.
            </p>
          </div>

          {/* Photos */}
          <div className="aspect-video bg-gray-200 flex items-center justify-center">
            {photos.length > 0 ? (
              <img src={photos[0]} alt={title} className="w-full h-full object-cover" />
            ) : (
              <Home className="w-16 h-16 text-gray-400" />
            )}
          </div>

          {/* Already live */}
          {status === 'live' && !publishResult && (
            <div className="p-6 bg-green-50 border-b border-green-100">
              <p className="text-green-800 font-medium">Your listing is live!</p>
              <button
                onClick={() => navigate(`/listings/${listingId}`)}
                className="mt-2 text-green-700 underline font-medium hover:text-green-900"
              >
                View your listing
              </button>
            </div>
          )}

          {/* Publish success */}
          {publishResult && (
            <div className="p-6 bg-green-50 border-b border-green-100 space-y-2">
              <p className="text-green-800 font-semibold">Your listing is now live!</p>
              {publishResult.setPasswordSent && (
                <p className="text-green-700 text-sm">
                  We've sent you an email to set your password. Check your inbox and click the link to access your account.
                </p>
              )}
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => navigate(`/listings/${publishResult.listingId || listingId}`)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                >
                  View your listing
                </button>
                <button
                  onClick={() => navigate('/auth')}
                  className="px-4 py-2 border border-green-600 text-green-700 rounded-lg font-medium hover:bg-green-50"
                >
                  Sign in
                </button>
              </div>
            </div>
          )}

          {/* Editable form (when not published or just loaded) */}
          {status !== 'live' && (
            <>
              <div className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
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
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your name *</label>
                      <input
                        type="text"
                        value={form.conciergeListerName}
                        onChange={(e) => setForm((f) => ({ ...f, conciergeListerName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={form.conciergeListerEmail}
                        onChange={(e) => setForm((f) => ({ ...f, conciergeListerEmail: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={form.conciergeListerPhone}
                        onChange={(e) => setForm((f) => ({ ...f, conciergeListerPhone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {showChecklist && !allRequiredFilled && (
                <div className="p-6 bg-amber-50 border-b border-amber-200">
                  <p className="text-amber-800 font-medium">Complete these before publishing:</p>
                  <ul className="list-disc list-inside text-sm text-amber-700 mt-2 space-y-1">
                    {!requiredFields.title && <li>Add a title for your listing</li>}
                    {!requiredFields.rent && <li>Set the monthly rent (₹)</li>}
                    {!requiredFields.name && <li>Add your name</li>}
                    {!requiredFields.email && <li>Add your email address</li>}
                  </ul>
                </div>
              )}

              {duplicatePrompt && (
                <div className="p-6 bg-amber-50 border-b border-amber-200">
                  <p className="text-amber-800 font-medium">It looks like you already have a MOKOGO account with this email or number.</p>
                  <p className="text-sm text-amber-700 mt-1 mb-3">
                    We allow one active listing per account. You can switch which listing is live at any time from your dashboard.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
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
                      onClick={() => handlePublish(true)}
                      disabled={publishing}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50"
                    >
                      Make this listing live — your current active listing will be deactivated
                    </button>
                  </div>
                </div>
              )}

              <div className="p-6 border-t border-gray-200 bg-gray-50 flex flex-wrap gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save progress'}
                </button>
                <button
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
            </>
          )}

        </div>
      </main>
      <Footer />
    </div>
  )
}
