import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { conciergeApi } from '@/services/api'
import { Plus, RefreshCw, AlertCircle } from 'lucide-react'
import { MoveInDateField } from '@/components/MoveInDateField'
import { ConciergeListingDetail } from './ConciergeListingDetail'

const LISTING_STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'approval_pending', label: 'Approval Pending' },
  { value: 'live', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'expired', label: 'Expired' },
  { value: 'archived', label: 'Archived' },
  { value: 'unpublished_edits', label: 'Unpublished Edits' },
]

const OUTREACH_STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'not_contacted', label: 'Not Contacted' },
  { value: 'link_sent', label: 'Link Sent' },
  { value: 'follow_up_sent', label: 'Follow-up Sent' },
  { value: 'responded', label: 'Responded' },
  { value: 'approved', label: 'Approved' },
  { value: 'declined', label: 'Declined' },
]

const SOURCE_PLATFORM_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'x', label: 'X' },
  { value: 'other', label: 'Other' },
]

const OWNER_LOGIN_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'logged_in', label: 'Logged In' },
  { value: 'not_logged_in', label: 'Not Yet Logged In' },
]

const CHANGE_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'approval_pending', label: 'Approval Pending' },
  { value: 'live', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'expired', label: 'Expired' },
  { value: 'archived', label: 'Archived' },
]

interface ConciergeListing {
  _id: string
  title: string
  locality?: string
  city?: string
  status: string
  photos?: string[]
  conciergeHasUnpublishedEdits?: boolean
  conciergeOutreachStatus?: string
  conciergeOutreachStatusAt?: string
  previewToken?: string
  createdAt: string
  needsFollowUp?: boolean
}

export function AdminConciergeTab() {
  const navigate = useNavigate()
  const location = useLocation()
  const [listings, setListings] = useState<ConciergeListing[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [listingStatus, setListingStatus] = useState('all')
  const [outreachStatus, setOutreachStatus] = useState('all')
  const [ownerLogin, setOwnerLogin] = useState('all')
  const [sourcePlatform, setSourcePlatform] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [addedBy, setAddedBy] = useState('')
  const [search, setSearch] = useState('')
  const [searchDebounced, setSearchDebounced] = useState('')
  const createSuccess = (location.state as { createSuccess?: string })?.createSuccess ?? null
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 400)
    return () => clearTimeout(t)
  }, [search])

  const fetchListings = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await conciergeApi.listListings({
        listingStatus: listingStatus === 'all' ? undefined : listingStatus,
        outreachStatus: outreachStatus === 'all' ? undefined : outreachStatus,
        ownerLogin: ownerLogin === 'all' ? undefined : ownerLogin,
        sourcePlatform: sourcePlatform === 'all' ? undefined : sourcePlatform,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        addedBy: addedBy.trim() || undefined,
        search: searchDebounced || undefined,
        page,
        limit: 12,
      })
      setListings(res.listings)
      setTotal(res.total)
    } catch (e) {
      console.error('Error fetching concierge listings:', e)
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Failed to load concierge listings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [listingStatus, outreachStatus, ownerLogin, sourcePlatform, dateFrom, dateTo, addedBy, searchDebounced, page])

  const handleChangeStatus = async (listingId: string, newStatus: string) => {
    setStatusUpdating(true)
    try {
      await conciergeApi.updateListing(listingId, { status: newStatus })
      fetchListings()
    } catch (e) {
      console.error('Error updating status:', e)
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Failed to update status.')
    } finally {
      setStatusUpdating(false)
    }
  }

  const formatDate = (d: string) => {
    const date = new Date(d)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700'
      case 'approval_pending': return 'bg-amber-100 text-amber-800'
      case 'live': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-gray-100 text-gray-600'
      case 'archived': return 'bg-slate-100 text-slate-700'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getOutreachLabel = (s?: string) => {
    const o = OUTREACH_STATUS_OPTIONS.find((x) => x.value === s)
    return o?.label ?? (s ? s.replace(/_/g, ' ') : 'Unknown')
  }

  const getOutreachBadgeClass = (s?: string) => {
    switch (s) {
      case 'not_contacted':
        return 'bg-slate-100 text-slate-800 border border-slate-200'
      case 'link_sent':
        return 'bg-sky-100 text-sky-900 border border-sky-200'
      case 'follow_up_sent':
        return 'bg-violet-100 text-violet-900 border border-violet-200'
      case 'responded':
        return 'bg-emerald-100 text-emerald-900 border border-emerald-200'
      case 'approved':
        return 'bg-green-100 text-green-900 border border-green-200'
      case 'declined':
        return 'bg-rose-100 text-rose-900 border border-rose-200'
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200'
    }
  }

  return (
    <div className="relative">
      {/* Gradient ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-amber-100/30 rounded-full blur-3xl" />
      </div>

      {/* Header: Concierge (left) | Search (center) | Create Draft (right) */}
      <div className="relative mb-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/50 bg-orange-200/30 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-orange-800/80 mb-3">
          Admin • Concierge
        </span>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 lg:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Concierge</h1>
            <p className="text-sm text-gray-600 mt-1">Manage listings from external sources</p>
          </div>
          <div className="flex justify-center">
            <div className="w-[500px]">
              <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
              <input
                type="text"
                placeholder="Locality, city, phone, email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/80"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => navigate('/admin/dashboard/concierge/create')}
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              Create Draft Listing
            </button>
          </div>
        </div>
      </div>

      {/* Filters - uniform sizing */}
      <div className="bg-white/70 backdrop-blur-md rounded-xl border border-white/50 shadow-sm p-4 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="min-w-[145px]">
          <label className="block text-xs font-medium text-gray-600 mb-1">Listing Status</label>
          <select
            value={listingStatus}
            onChange={(e) => { setListingStatus(e.target.value); setPage(1) }}
            className="w-full h-9 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/80"
          >
            {LISTING_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="min-w-[145px]">
          <label className="block text-xs font-medium text-gray-600 mb-1">Outreach Status</label>
          <select
            value={outreachStatus}
            onChange={(e) => { setOutreachStatus(e.target.value); setPage(1) }}
            className="w-full h-9 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/80"
          >
            {OUTREACH_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="min-w-[145px]">
          <label className="block text-xs font-medium text-gray-600 mb-1">Owner Login</label>
          <select
            value={ownerLogin}
            onChange={(e) => { setOwnerLogin(e.target.value); setPage(1) }}
            className="w-full h-9 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/80"
          >
            {OWNER_LOGIN_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="min-w-[145px]">
          <label className="block text-xs font-medium text-gray-600 mb-1">Source Platform</label>
          <select
            value={sourcePlatform}
            onChange={(e) => { setSourcePlatform(e.target.value); setPage(1) }}
            className="w-full h-9 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/80"
          >
            {SOURCE_PLATFORM_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="min-w-[145px]">
          <label className="block text-xs font-medium text-gray-600 mb-1">Date From</label>
          <div className="[&_button]:!h-9 [&_button]:!min-h-9 [&_button]:!rounded-lg">
            <MoveInDateField
              value={dateFrom || undefined}
              onChange={(v) => { setDateFrom(v || ''); setPage(1) }}
              min="2020-01-01"
              hideLabel
              className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white/80"
            />
          </div>
        </div>
        <div className="min-w-[145px]">
          <label className="block text-xs font-medium text-gray-600 mb-1">Date To</label>
          <div className="[&_button]:!h-9 [&_button]:!min-h-9 [&_button]:!rounded-lg">
            <MoveInDateField
              value={dateTo || undefined}
              onChange={(v) => { setDateTo(v || ''); setPage(1) }}
              min={dateFrom || '2020-01-01'}
              hideLabel
              className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white/80"
            />
          </div>
        </div>
        <div className="min-w-[145px]">
          <label className="block text-xs font-medium text-gray-600 mb-1">Added By</label>
          <input
            type="text"
            placeholder="Team member"
            value={addedBy}
            onChange={(e) => { setAddedBy(e.target.value); setPage(1) }}
            className="w-full h-9 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/80"
          />
        </div>
        </div>
      </div>

      {createSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
          {createSuccess}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {selectedListingId ? (
        <ConciergeListingDetail
          listingId={selectedListingId}
          onBack={() => setSelectedListingId(null)}
          onUpdated={fetchListings}
        />
      ) : loading ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((listing, idx) => (
            <div
              key={listing._id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedListingId(listing._id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setSelectedListingId(listing._id)
                }
              }}
              className="group bg-white rounded-2xl border border-gray-200/80 shadow-md overflow-hidden hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-200 transition-all duration-300 hover:-translate-y-1 cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Photo thumbnail — opens detail with card click */}
              <div className="relative h-36 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center overflow-hidden pointer-events-none">
                {listing.photos && listing.photos.length > 0 ? (
                  <>
                    <img
                      src={listing.photos[0]}
                      alt={listing.title || 'Listing'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </>
                ) : (
                  <div className="text-gray-400 group-hover:text-orange-400 transition-colors">
                    <span className="text-4xl">📷</span>
                    <p className="text-xs mt-1">No photos</p>
                  </div>
                )}
              </div>
              <div className="p-4">
              <div className="flex flex-col gap-2 mb-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-gray-900 truncate flex-1 min-w-0 group-hover:text-orange-700 transition-colors">
                    {listing.title || 'Untitled'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadgeClass(listing.status)}`}>
                    {listing.status.replace('_', ' ')}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${getOutreachBadgeClass(listing.conciergeOutreachStatus)}`}
                    title={`Outreach status: ${getOutreachLabel(listing.conciergeOutreachStatus)}`}
                  >
                    {getOutreachLabel(listing.conciergeOutreachStatus)}
                  </span>
                  {listing.conciergeHasUnpublishedEdits && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                      Unpublished Edits
                    </span>
                  )}
                  {listing.needsFollowUp && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800" title="48hr follow-up">
                      Follow-up
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {[listing.locality, listing.city].filter(Boolean).join(', ') || '—'}
              </p>
              <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-orange-400" />
                {formatDate(listing.createdAt)}
              </p>
              <div
                className="pt-1 border-t border-gray-100"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <label htmlFor={`listing-status-${listing._id}`} className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Listing status
                </label>
                <select
                  id={`listing-status-${listing._id}`}
                  value={listing.status}
                  onChange={(e) => {
                    e.stopPropagation()
                    handleChangeStatus(listing._id, e.target.value)
                  }}
                  disabled={statusUpdating}
                  className="w-full h-10 border-2 border-gray-300 rounded-lg px-3 text-sm font-medium text-gray-900 bg-white shadow-sm hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {!CHANGE_STATUS_OPTIONS.some((o) => o.value === listing.status) && listing.status && (
                    <option value={listing.status}>
                      {listing.status.replace(/_/g, ' ')} (current)
                    </option>
                  )}
                  {CHANGE_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && listings.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No concierge listings found. Create a draft to get started.
        </div>
      )}

      {/* Pagination */}
      {total > 12 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="py-2 text-sm text-gray-600">
            Page {page} of {Math.ceil(total / 12)}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(total / 12)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
