import { useState, useEffect } from 'react'
import { conciergeApi } from '@/services/api'
import { ArrowLeft, Copy, RefreshCw, AlertCircle } from 'lucide-react'

const LISTING_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'approval_pending', label: 'Approval Pending' },
  { value: 'live', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'expired', label: 'Expired' },
  { value: 'archived', label: 'Archived' },
]

const OUTREACH_STATUS_OPTIONS = [
  { value: 'not_contacted', label: 'Not Contacted' },
  { value: 'link_sent', label: 'Link Sent' },
  { value: 'follow_up_sent', label: 'Follow-up Sent' },
  { value: 'responded', label: 'Responded' },
  { value: 'approved', label: 'Approved' },
  { value: 'declined', label: 'Declined' },
]

interface ConciergeListingDetailProps {
  listingId: string
  onBack: () => void
  onUpdated?: () => void
}

export function ConciergeListingDetail({ listingId, onBack, onUpdated }: ConciergeListingDetailProps) {
  const [listing, setListing] = useState<Record<string, unknown> | null>(null)
  const hasUnpublishedEdits = listing?.conciergeHasUnpublishedEdits === true
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [outreachNote, setOutreachNote] = useState('')
  const [outreachDate, setOutreachDate] = useState(new Date().toISOString().slice(0, 10))

  const fetchListing = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await conciergeApi.getById(listingId)
      setListing(data)
    } catch (e) {
      console.error('Error fetching listing:', e)
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Failed to load listing.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListing()
  }, [listingId])

  const handleUpdate = async (data: Record<string, unknown>) => {
    setSaving(true)
    setError(null)
    try {
      const updated = await conciergeApi.updateListing(listingId, data)
      setListing(updated)
      onUpdated?.()
    } catch (e) {
      console.error('Error updating:', e)
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Failed to update.')
    } finally {
      setSaving(false)
    }
  }

  const copyLink = () => {
    const token = listing?.previewToken as string | undefined
    if (!token) return
    const url = `${window.location.origin}/preview/${token}`
    navigator.clipboard.writeText(url)
  }

  const handleRegenerateLink = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await conciergeApi.regenerateLink(listingId)
      setListing((prev) => prev ? { ...prev, previewToken: res.previewToken } : null)
      onUpdated?.()
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Failed to regenerate link.')
    } finally {
      setSaving(false)
    }
  }

  const handleAddOutreachEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!outreachNote.trim()) return
    await handleUpdate({
      outreachLogEntry: { date: outreachDate, note: outreachNote.trim() },
    })
    setOutreachNote('')
    setOutreachDate(new Date().toISOString().slice(0, 10))
  }

  const formatDate = (d: string | Date | undefined) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to list
        </button>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error || 'Listing not found'}
        </div>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to list
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Photos */}
      {((listing.photos as string[]) || []).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Photos</h2>
          <div className="flex flex-wrap gap-3">
            {(listing.photos as string[]).map((url, i) => (
              <div key={i} className="w-28 h-28 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0">
                <img
                  src={url}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90"
                  onClick={() => window.open(url, '_blank')}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {(listing.title as string) || 'Untitled Listing'}
            </h1>
            <p className="text-gray-600 mt-1">
              {[listing.locality, listing.city].filter(Boolean).join(', ') || '—'}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  (listing.status as string) === 'live'
                    ? 'bg-green-100 text-green-800'
                    : (listing.status as string) === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {(listing.status as string)?.replace('_', ' ') || '—'}
              </span>
              {(listing.conciergeHasUnpublishedEdits as boolean) && (
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                  Unpublished Edits
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={copyLink}
              disabled={!listing.previewToken}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              <Copy className="w-4 h-4" /> Copy Link
            </button>
            <button
              onClick={handleRegenerateLink}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" /> Regenerate Link
            </button>
          </div>
        </div>
      </div>

      {/* Unpublished edits banner + Publish Changes */}
      {hasUnpublishedEdits ? (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 font-medium">You have unpublished changes.</p>
          <p className="text-sm text-amber-700 mt-1 mb-3">
            Clicking this will push your edits live on the homepage and explore page. Until you
            publish, seekers continue to see the previous version of this listing.
          </p>
          <button
            onClick={async () => {
              setSaving(true)
              setError(null)
              try {
                await conciergeApi.publishChanges(listingId)
                fetchListing()
                onUpdated?.()
              } catch (e) {
                const msg = (e as { response?: { data?: { message?: string } } })?.response?.data
                  ?.message
                setError(msg || 'Failed to publish changes.')
              } finally {
                setSaving(false)
              }
            }}
            disabled={saving}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50"
          >
            {saving ? 'Publishing...' : 'Publish Changes'}
          </button>
        </div>
      ) : null}

      {/* Publish on Behalf */}
      {(listing.status as string) !== 'live' && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 font-medium">Publish on Behalf</p>
          <p className="text-sm text-blue-700 mt-1 mb-3">
            List this property live now. We'll create an account for the owner and send them a set
            password email.
          </p>
          <button
            onClick={async () => {
              setSaving(true)
              setError(null)
              try {
                await conciergeApi.publishOnBehalf(listingId)
                fetchListing()
                onUpdated?.()
              } catch (e) {
                const msg = (e as { response?: { data?: { message?: string } } })?.response?.data
                  ?.message
                setError(msg || 'Failed to publish.')
              } finally {
                setSaving(false)
              }
            }}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Publishing...' : 'Publish on Behalf'}
          </button>
        </div>
      )}

      {/* Concierge tracking */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Concierge Tracking</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Listing Status</label>
            <select
              value={(listing.status as string) || ''}
              onChange={(e) => handleUpdate({ status: e.target.value })}
              disabled={saving}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {LISTING_STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Outreach Status</label>
            <select
              value={(listing.conciergeOutreachStatus as string) || 'not_contacted'}
              onChange={(e) => handleUpdate({ conciergeOutreachStatus: e.target.value })}
              disabled={saving}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {OUTREACH_STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {(listing.conciergeOutreachStatus as string) === 'link_sent' && (
              <p className="text-xs text-gray-500 mt-1">
                Once you mark this as Link Sent, we will automatically flag this listing for
                follow-up if there is no response in 48 hours.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
            <input
              type="date"
              value={
                listing.conciergeFollowUpDate
                  ? new Date(listing.conciergeFollowUpDate as string).toISOString().slice(0, 10)
                  : ''
              }
              onChange={(e) =>
                handleUpdate({
                  conciergeFollowUpDate: e.target.value || undefined,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Set a date to remind yourself to follow up with this owner.
            </p>
          </div>
        </div>

        {/* Outreach Log */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Outreach Log
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Keep a running record of every conversation or touchpoint with this owner.
          </p>

          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {((listing.conciergeOutreachLog as Array<{ date: string; note: string }>) || []).map(
              (entry, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-2 bg-gray-50 rounded-lg text-sm"
                >
                  <span className="text-gray-500 flex-shrink-0">
                    {formatDate(entry.date)}
                  </span>
                  <span className="text-gray-800">{entry.note || '—'}</span>
                </div>
              )
            )}
            {(!listing.conciergeOutreachLog ||
              (listing.conciergeOutreachLog as []).length === 0) && (
              <p className="text-sm text-gray-500 italic">No entries yet.</p>
            )}
          </div>

          <form onSubmit={handleAddOutreachEntry} className="flex flex-wrap gap-2">
            <input
              type="date"
              value={outreachDate}
              onChange={(e) => setOutreachDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={outreachNote}
              onChange={(e) => setOutreachNote(e.target.value)}
              placeholder="Add note..."
              className="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={saving || !outreachNote.trim()}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50"
            >
              Add Entry
            </button>
          </form>
        </div>
      </div>

      {/* Owner Activity */}
      {listing.ownerId ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Owner Activity</h2>
          <p className="text-xs text-gray-500 mb-3">
            This shows whether the owner has accessed their account after sign-up. If Last Login shows
            never, consider sending them a quick follow-up message with their login link.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Account created:</span>{' '}
              {formatDate((listing.ownerActivity as { accountCreatedAt?: string })?.accountCreatedAt)}
            </div>
            <div>
              <span className="text-gray-500">Last login:</span>{' '}
              {(listing.ownerActivity as { lastLoginAt?: string | null })?.lastLoginAt
                ? formatDate((listing.ownerActivity as { lastLoginAt: string }).lastLoginAt)
                : 'Never'}
            </div>
            <div>
              <span className="text-gray-500">Total logins:</span>{' '}
              {(listing.ownerActivity as { loginCount?: number })?.loginCount ?? 0}
            </div>
          </div>
        </div>
      ) : null}

      {/* Lister info summary */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Lister Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Name:</span>{' '}
            {(listing.conciergeListerName as string) || '—'}
          </div>
          <div>
            <span className="text-gray-500">Email:</span>{' '}
            {(listing.conciergeListerEmail as string) || '—'}
          </div>
          <div>
            <span className="text-gray-500">Phone:</span>{' '}
            {(listing.conciergeListerPhone as string) || '—'}
          </div>
          <div>
            <span className="text-gray-500">Added by:</span>{' '}
            {(listing.conciergeAddedBy as string) || '—'}
          </div>
          <div>
            <span className="text-gray-500">Date added:</span>{' '}
            {formatDate(listing.conciergeDateAdded as string)}
          </div>
        </div>
      </div>
    </div>
  )
}
