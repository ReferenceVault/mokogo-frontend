import { useState, useEffect, useRef } from 'react'
import { adminApi, type ListingsByCityItem, type ActiveListingsByAreaItem } from '@/services/api'
import { OverviewMetricTile } from '../components/OverviewMetricTile'
import {
  Home,
  User,
  Users,
  MessageSquare,
  CheckCircle,
  XCircle,
  Flag,
  Shield,
  FileCheck,
  TrendingUp,
  Timer,
  ChevronDown,
  Download,
  AlertTriangle,
} from 'lucide-react'

const TIME_PERIOD_OPTIONS = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days'] as const

export function AdminOverviewTab() {
  const [timePeriod, setTimePeriod] = useState<string>('Last 7 Days')
  const [showTimePeriodDropdown, setShowTimePeriodDropdown] = useState(false)
  const timePeriodDropdownRef = useRef<HTMLDivElement>(null)
  const [activeListersCount, setActiveListersCount] = useState<number | null>(null)
  const [activeSeekersCount, setActiveSeekersCount] = useState<number | null>(null)
  const [liveListingsCount, setLiveListingsCount] = useState<number | null>(null)
  const [requestsSentCount, setRequestsSentCount] = useState<number | null>(null)
  const [successfulConnectionsCount, setSuccessfulConnectionsCount] = useState<number | null>(null)
  const [medianTimeToFulfillment, setMedianTimeToFulfillment] = useState<number | null>(null)
  const [listingsFulfilledStats, setListingsFulfilledStats] = useState<{ fulfilled: number; total: number } | null>(null)
  const [listingsRejectedCount, setListingsRejectedCount] = useState<number | null>(null)
  const [totalUsersCount, setTotalUsersCount] = useState<number | null>(null)
  const [listingsCreatedCount, setListingsCreatedCount] = useState<number | null>(null)
  const [listingsApprovedCount, setListingsApprovedCount] = useState<number | null>(null)
  const [listingsByCity, setListingsByCity] = useState<ListingsByCityItem[]>([])
  const [activeListingsByArea, setActiveListingsByArea] = useState<ActiveListingsByAreaItem[]>([])
  const [reportedUsersCount, setReportedUsersCount] = useState<number | null>(null)
  const [blockedUsersCount, setBlockedUsersCount] = useState<number | null>(null)
  const [maleUsersCount, setMaleUsersCount] = useState<number | null>(null)
  const [femaleUsersCount, setFemaleUsersCount] = useState<number | null>(null)
  const [completedProfilesCount, setCompletedProfilesCount] = useState<number | null>(null)
  const [overviewLoading, setOverviewLoading] = useState(false)
  const [overviewError, setOverviewError] = useState<string | null>(null)
  const [overviewRetryKey, setOverviewRetryKey] = useState(0)

  const timePeriodDays = timePeriod === 'Last 30 Days' ? 30 : timePeriod === 'Last 90 Days' ? 90 : 7

  useEffect(() => {
    const fetchStats = async () => {
      setOverviewLoading(true)
      setOverviewError(null)
      try {
      const promises = [
        adminApi.getActiveListersCount(),
        adminApi.getActiveSeekersCount(),
        adminApi.getLiveListingsCount(),
        adminApi.getRequestsSentCount(timePeriodDays),
        adminApi.getSuccessfulConnectionsCount(timePeriodDays),
        adminApi.getMedianTimeToFulfillment(),
        adminApi.getListingsFulfilledStats(),
        adminApi.getListingsRejectedCount(),
        adminApi.getTotalUsersCount(),
        adminApi.getListingsCreatedCount(timePeriodDays),
        adminApi.getListingsApprovedCount(timePeriodDays),
        adminApi.getListingsByCity(),
        adminApi.getActiveListingsByArea(),
        adminApi.getReportedUsersCount(),
        adminApi.getBlockedUsersCount(),
        adminApi.getMaleUsersCount(),
        adminApi.getFemaleUsersCount(),
        adminApi.getCompletedProfilesCount(),
      ]
      const results = await Promise.allSettled(promises)
      const errors: string[] = []
      if (results[0].status === 'fulfilled') setActiveListersCount(results[0].value as number); else errors.push('active listers')
      if (results[1].status === 'fulfilled') setActiveSeekersCount(results[1].value as number); else errors.push('active seekers')
      if (results[2].status === 'fulfilled') setLiveListingsCount(results[2].value as number); else errors.push('live listings')
      if (results[3].status === 'fulfilled') setRequestsSentCount(results[3].value as number); else errors.push('requests sent')
      if (results[4].status === 'fulfilled') setSuccessfulConnectionsCount(results[4].value as number); else errors.push('successful connections')
      if (results[5].status === 'fulfilled') setMedianTimeToFulfillment(results[5].value as number); else errors.push('median time to fulfillment')
      if (results[6].status === 'fulfilled') setListingsFulfilledStats(results[6].value as { fulfilled: number; total: number }); else errors.push('listings fulfilled')
      if (results[7].status === 'fulfilled') setListingsRejectedCount(results[7].value as number); else errors.push('listings rejected')
      if (results[8].status === 'fulfilled') setTotalUsersCount(results[8].value as number); else errors.push('total users')
      if (results[9].status === 'fulfilled') setListingsCreatedCount(results[9].value as number); else errors.push('listings created')
      if (results[10].status === 'fulfilled') setListingsApprovedCount(results[10].value as number); else errors.push('listings approved')
      if (results[11].status === 'fulfilled') setListingsByCity(Array.isArray(results[11].value) ? (results[11].value as ListingsByCityItem[]) : []); else errors.push('listings by city')
      if (results[12].status === 'fulfilled') setActiveListingsByArea(Array.isArray(results[12].value) ? (results[12].value as ActiveListingsByAreaItem[]) : []); else errors.push('listings by area')
      if (results[13].status === 'fulfilled') setReportedUsersCount(results[13].value as number); else errors.push('reported users')
      if (results[14].status === 'fulfilled') setBlockedUsersCount(results[14].value as number); else errors.push('blocked users')
      if (results[15].status === 'fulfilled') setMaleUsersCount(results[15].value as number); else errors.push('male users')
      if (results[16].status === 'fulfilled') setFemaleUsersCount(results[16].value as number); else errors.push('female users')
      if (results[17].status === 'fulfilled') setCompletedProfilesCount(results[17].value as number); else errors.push('completed profiles')
      if (errors.length > 0) {
        const firstRejection = results.find((r): r is PromiseRejectedResult => r.status === 'rejected')
        const err = firstRejection?.reason
        const status = err?.response?.status
        const serverMessage = err?.response?.data?.message
        let message: string
        if (status === 401) message = 'Please sign in as an admin to view stats.'
        else if (status === 403) message = 'You do not have permission to view admin stats. Your account may not have the admin role.'
        else if (err?.response == null) message = 'Cannot reach the server. Check that the backend is running and that VITE_API_URL (or the app\'s API URL) points to it.'
        else if (status === 500) message = serverMessage ? `Server error: ${serverMessage}` : 'Server error (500). Check backend logs.'
        else message = serverMessage || (status ? `Request failed (${status}).` : err?.message || 'Request failed.')
        setOverviewError(message)
        results.forEach((r, i) => { if (r.status === 'rejected') console.error(`Admin stats [${i}]:`, r.reason) })
      }
      } catch (err) {
        console.error('Admin overview fetch error:', err)
        setOverviewError(err instanceof Error ? err.message : 'Failed to load overview stats.')
      } finally {
        setOverviewLoading(false)
      }
    }
    fetchStats()
  }, [timePeriodDays, overviewRetryKey])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (timePeriodDropdownRef.current && !timePeriodDropdownRef.current.contains(e.target as Node))
        setShowTimePeriodDropdown(false)
    }
    if (showTimePeriodDropdown) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showTimePeriodDropdown])

  const ratio = liveListingsCount != null && liveListingsCount > 0 && activeSeekersCount != null ? activeSeekersCount / liveListingsCount : null
  const isHealthy = ratio != null && ratio >= 3 && ratio <= 5
  const isOversupply = ratio != null && ratio < 3
  const isHighDemand = ratio != null && ratio > 5
  const ratioDisplay = ratio != null ? `${ratio.toFixed(1)} : 1` : '—'

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mokogo Health</h1>
          <p className="text-sm text-gray-600 mt-1">Weekly Product Review - Week of Jan 27, 2025</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative" ref={timePeriodDropdownRef}>
            <button
              onClick={() => setShowTimePeriodDropdown(!showTimePeriodDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              {timePeriod}
              <ChevronDown className={`w-4 h-4 transition-transform ${showTimePeriodDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showTimePeriodDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {TIME_PERIOD_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setTimePeriod(opt); setShowTimePeriodDropdown(false) }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${timePeriod === opt ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700'} ${opt === TIME_PERIOD_OPTIONS[0] ? 'rounded-t-lg' : ''} ${opt === TIME_PERIOD_OPTIONS[TIME_PERIOD_OPTIONS.length - 1] ? 'rounded-b-lg' : ''}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-md">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {overviewError && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800">{overviewError}</p>
          </div>
          <button
            type="button"
            onClick={() => setOverviewRetryKey((k) => k + 1)}
            className="shrink-0 px-3 py-1.5 text-sm font-medium bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* MARKETPLACE HEALTH */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">MARKETPLACE HEALTH</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <OverviewMetricTile icon={<Home className="w-4 h-4 text-blue-600" />} iconBgClass="bg-blue-100" label="Active Listers" value={overviewLoading ? <span className="inline-block w-8 h-7 animate-pulse bg-gray-200 rounded" /> : activeListersCount !== null ? activeListersCount : '—'} />
          <OverviewMetricTile icon={<User className="w-4 h-4 text-orange-600" />} iconBgClass="bg-orange-100" label="Active Seekers" value={overviewLoading ? <span className="inline-block w-8 h-7 animate-pulse bg-gray-200 rounded" /> : activeSeekersCount !== null ? activeSeekersCount : '—'} />
          <div className={`rounded-lg shadow-md border p-3 text-center ${isHealthy ? 'bg-green-50 border-green-200' : isOversupply ? 'bg-red-50 border-red-200' : isHighDemand ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-center mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isHealthy ? 'bg-green-100' : isOversupply ? 'bg-red-100' : isHighDemand ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <TrendingUp className={`w-4 h-4 ${isHealthy ? 'text-green-600' : isOversupply ? 'text-red-600' : isHighDemand ? 'text-blue-600' : 'text-gray-600'}`} />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Seekers per Listing</p>
              <p className={`text-2xl font-bold mb-1 ${isHealthy ? 'text-green-700' : isOversupply ? 'text-red-700' : isHighDemand ? 'text-blue-700' : 'text-gray-900'}`}>{ratioDisplay}</p>
              {(isHealthy || isOversupply || isHighDemand) && <p className={`text-xs font-medium ${isHealthy ? 'text-green-700' : isOversupply ? 'text-red-700' : 'text-blue-700'}`}>{isHealthy ? 'Healthy' : isOversupply ? 'Oversupply' : 'Too High Demand'}</p>}
            </div>
          </div>
          <OverviewMetricTile icon={<MessageSquare className="w-4 h-4 text-orange-600" />} iconBgClass="bg-orange-100" label="Requests Sent" value={overviewLoading ? <span className="inline-block w-8 h-7 animate-pulse bg-gray-200 rounded" /> : requestsSentCount !== null ? requestsSentCount.toLocaleString() : '—'} subtitle={timePeriod} />
          <OverviewMetricTile icon={<CheckCircle className="w-4 h-4 text-indigo-600" />} iconBgClass="bg-indigo-100" label="Successful Connections" value={overviewLoading ? <span className="inline-block w-8 h-7 animate-pulse bg-gray-200 rounded" /> : successfulConnectionsCount !== null ? successfulConnectionsCount.toLocaleString() : '—'} subtitle={timePeriod} />
          <OverviewMetricTile icon={<CheckCircle className="w-4 h-4 text-orange-600" />} iconBgClass="bg-orange-100" label="Request Acceptance Rate (%)" value={overviewLoading ? <span className="inline-block w-10 h-7 animate-pulse bg-gray-200 rounded" /> : requestsSentCount != null && requestsSentCount > 0 && successfulConnectionsCount != null ? `${((successfulConnectionsCount / requestsSentCount) * 100).toFixed(1)}%` : '—'} />
          <OverviewMetricTile icon={<Timer className="w-4 h-4 text-purple-600" />} iconBgClass="bg-purple-100" label="Median Time to Fulfillment" value={overviewLoading ? <span className="inline-block w-10 h-7 animate-pulse bg-gray-200 rounded" /> : medianTimeToFulfillment !== null ? `${medianTimeToFulfillment}d` : '—'} />
        </div>
      </div>

      {/* GROWTH & INVENTORY */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">GROWTH & INVENTORY</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          <OverviewMetricTile icon={<CheckCircle className="w-4 h-4 text-green-600" />} iconBgClass="bg-green-100" label="Listings Fulfilled" value={overviewLoading ? <span className="inline-block w-8 h-7 animate-pulse bg-gray-200 rounded" /> : listingsFulfilledStats !== null ? listingsFulfilledStats.fulfilled.toLocaleString() : '—'} />
          <OverviewMetricTile icon={<TrendingUp className="w-4 h-4 text-indigo-600" />} iconBgClass="bg-indigo-100" label="Listings Fulfilled (%)" value={overviewLoading ? <span className="inline-block w-12 h-7 animate-pulse bg-gray-200 rounded" /> : listingsFulfilledStats !== null && listingsFulfilledStats.total > 0 ? `${((listingsFulfilledStats.fulfilled / listingsFulfilledStats.total) * 100).toFixed(1)}%` : '—'} />
          <OverviewMetricTile icon={<XCircle className="w-4 h-4 text-red-600" />} iconBgClass="bg-red-100" label="Listings Rejected" value={overviewLoading ? <span className="inline-block w-8 h-7 animate-pulse bg-gray-200 rounded" /> : listingsRejectedCount !== null ? listingsRejectedCount.toLocaleString() : '—'} />
          <OverviewMetricTile icon={<Users className="w-4 h-4 text-blue-600" />} iconBgClass="bg-blue-100" label="Total Users" value={overviewLoading ? <span className="inline-block w-8 h-7 animate-pulse bg-gray-200 rounded" /> : totalUsersCount !== null ? totalUsersCount.toLocaleString() : '—'} />
          <OverviewMetricTile icon={<Home className="w-4 h-4 text-emerald-600" />} iconBgClass="bg-emerald-100" label="Listing Created" value={overviewLoading ? <span className="inline-block w-8 h-7 animate-pulse bg-gray-200 rounded" /> : listingsCreatedCount !== null ? listingsCreatedCount.toLocaleString() : '—'} subtitle={timePeriod} />
          <OverviewMetricTile icon={<FileCheck className="w-4 h-4 text-teal-600" />} iconBgClass="bg-teal-100" label="Listings Approved" value={overviewLoading ? <span className="inline-block w-8 h-7 animate-pulse bg-gray-200 rounded" /> : listingsApprovedCount !== null ? listingsApprovedCount.toLocaleString() : '—'} subtitle={timePeriod} />
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-6">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-gray-900 mb-1">Total Listings by City</h3>
            <p className="text-xs text-gray-500 mb-3">Live listings only. Excludes draft, rejected, fulfilled, and inactive.</p>
            {overviewLoading ? (
              <div className="flex justify-center py-12 rounded-2xl bg-gray-50/50 border border-gray-100"><span className="inline-block w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" /></div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-lg shadow-gray-200/50 ring-1 ring-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-orange-50 to-amber-50/80 border-b border-orange-100">
                        <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">City</th>
                        <th className="px-3 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-600">Active</th>
                        <th className="px-3 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-600">Created (7d)</th>
                        <th className="px-3 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-600">Fulfilled (30d)</th>
                        <th className="px-3 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-600">0 Requests</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {listingsByCity.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No city data</td></tr> : listingsByCity.map((row, i) => (
                        <tr key={row.city} className={`transition-colors duration-150 hover:bg-orange-50/40 ${i % 2 === 1 ? 'bg-gray-50/40' : 'bg-white'}`}>
                          <td className="px-4 py-3 font-semibold text-gray-900">{row.city}</td>
                          <td className="px-3 py-3 text-right tabular-nums font-medium text-gray-800">{row.activeListings.toLocaleString()}</td>
                          <td className="px-3 py-3 text-right tabular-nums font-medium text-gray-800">{row.listingsCreatedLast7Days.toLocaleString()}</td>
                          <td className="px-3 py-3 text-right tabular-nums font-medium text-gray-800">{row.listingsFulfilledLast30Days.toLocaleString()}</td>
                          <td className="px-3 py-3 text-right tabular-nums font-medium text-gray-800">{row.listingsWithZeroRequests.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Active Listings by Area</h3>
            {overviewLoading ? (
              <div className="flex justify-center py-12 rounded-2xl bg-gray-50/50 border border-gray-100"><span className="inline-block w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" /></div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-lg shadow-gray-200/50 ring-1 ring-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-orange-50 to-amber-50/80 border-b border-orange-100">
                        <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Area</th>
                        <th className="px-4 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-600">Active Listings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {activeListingsByArea.length === 0 ? <tr><td colSpan={2} className="px-4 py-8 text-center text-gray-400">No area data</td></tr> : activeListingsByArea.map((row, i) => (
                        <tr key={row.area} className={`transition-colors duration-150 hover:bg-orange-50/40 ${i % 2 === 1 ? 'bg-gray-50/40' : 'bg-white'}`}>
                          <td className="px-4 py-3 font-semibold text-gray-900">{row.area}</td>
                          <td className="px-4 py-3 text-right tabular-nums font-medium text-gray-800">{row.activeListings.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trust and Safety</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-3 text-center">
              <div className="flex justify-center mb-2"><div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center"><Flag className="w-4 h-4 text-amber-600" /></div></div>
              <p className="text-xs text-gray-600 mb-1">Reports</p>
              <p className="text-2xl font-bold text-gray-900">{reportedUsersCount !== null ? reportedUsersCount.toLocaleString() : '—'}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Total users reported</p>
            </div>
            <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-3 text-center">
              <div className="flex justify-center mb-2"><div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center"><Shield className="w-4 h-4 text-amber-600" /></div></div>
              <p className="text-xs text-gray-600 mb-1">Blocked Users</p>
              <p className="text-2xl font-bold text-gray-900">{blockedUsersCount !== null ? blockedUsersCount.toLocaleString() : '—'}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Blocked by ≥1 user</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-3 text-center">
              <div className="flex justify-center mb-2"><div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center"><User className="w-4 h-4 text-emerald-600" /></div></div>
              <p className="text-xs text-gray-600 mb-1">Male</p>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">{maleUsersCount !== null ? maleUsersCount.toLocaleString() : '—'}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">No. of male users</p>
            </div>
            <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-3 text-center">
              <div className="flex justify-center mb-2"><div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center"><User className="w-4 h-4 text-emerald-600" /></div></div>
              <p className="text-xs text-gray-600 mb-1">Female</p>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">{femaleUsersCount !== null ? femaleUsersCount.toLocaleString() : '—'}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">No. of female users</p>
            </div>
            <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-3 text-center">
              <div className="flex justify-center mb-2"><div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center"><CheckCircle className="w-4 h-4 text-emerald-600" /></div></div>
              <p className="text-xs text-gray-600 mb-1">Completed Profiles</p>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">{completedProfilesCount !== null ? completedProfilesCount.toLocaleString() : '—'}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">All required criteria met</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
