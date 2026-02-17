import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { reportsApi, adminApi, ReportResponseWithDetails, ReportReason } from '@/services/api'
import { Flag, AlertTriangle } from 'lucide-react'

const getReasonLabel = (reasonCode: ReportReason) => {
  const reasonMap: Record<ReportReason, string> = {
    [ReportReason.SPAM_SCAM]: 'Spam / Scam',
    [ReportReason.HARASSMENT]: 'Harassment',
    [ReportReason.FAKE_LISTING]: 'Fake Listing',
    [ReportReason.INAPPROPRIATE_CONTENT]: 'Inappropriate Content',
    [ReportReason.ASKING_MONEY_OUTSIDE]: 'Asking for Money Outside Platform',
    [ReportReason.DISCRIMINATION]: 'Discrimination',
    [ReportReason.OTHER]: 'Other',
  }
  return reasonMap[reasonCode] || reasonCode
}

const getReportStatus = (r: ReportResponseWithDetails): string => {
  if (r.reportStatus) return r.reportStatus
  return r.reviewed ? 'resolved' : 'new'
}

const getReportStatusLabel = (status: string) => {
  const m: Record<string, string> = {
    new: 'New',
    under_review: 'Under Review',
    resolved: 'Resolved',
    escalated: 'Escalated',
  }
  return m[status] || status
}

const formatReportDateTime = (createdAt: string) => {
  const d = new Date(createdAt)
  return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function AdminReportsTab() {
  const navigate = useNavigate()
  const [reports, setReports] = useState<ReportResponseWithDetails[]>([])
  const [reportsLoading, setReportsLoading] = useState(false)
  const [reportsStatusFilter, setReportsStatusFilter] = useState<'all' | 'new' | 'under_review' | 'resolved'>('all')
  const [reportsCategoryFilter, setReportsCategoryFilter] = useState<string>('all')
  const [reportsSort, setReportsSort] = useState<'new_to_old' | 'old_to_new'>('new_to_old')
  const [reportActionModal, setReportActionModal] = useState<{ report: ReportResponseWithDetails; action: 'review' | 'pause_account' | 'suspend_account' | 'mark_resolved' } | null>(null)
  const [reportInternalNote, setReportInternalNote] = useState('')
  const [reportActionSubmitting, setReportActionSubmitting] = useState(false)
  const [reportsError, setReportsError] = useState<string | null>(null)

  const fetchReports = async () => {
    setReportsLoading(true)
    setReportsError(null)
    try {
      const data = await reportsApi.getAll()
      setReports(data)
    } catch (error) {
      console.error('Error fetching reports:', error)
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message
      setReportsError(msg || 'Failed to load reports. Please try again.')
    } finally {
      setReportsLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleReportAction = async () => {
    if (!reportActionModal || !reportInternalNote.trim()) return
    setReportActionSubmitting(true)
    setReportsError(null)
    try {
      await adminApi.reportAction(reportActionModal.report._id, reportActionModal.action, reportInternalNote.trim())
      setReportActionModal(null)
      setReportInternalNote('')
      fetchReports()
    } catch (e) {
      console.error(e)
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      setReportsError(msg || 'Failed to apply action. Please try again.')
    } finally {
      setReportActionSubmitting(false)
    }
  }

  const filteredReports = reports
    .filter(r => {
      if (reportsStatusFilter !== 'all' && getReportStatus(r) !== reportsStatusFilter) return false
      if (reportsCategoryFilter !== 'all' && r.reasonCode !== reportsCategoryFilter) return false
      return true
    })
    .sort((a, b) => {
      const ta = new Date(a.createdAt).getTime()
      const tb = new Date(b.createdAt).getTime()
      return reportsSort === 'new_to_old' ? tb - ta : ta - tb
    })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Reports</h1>
        <p className="text-sm text-gray-600">Review reports submitted by users. Click on names or listing to open profiles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">New</p>
          <p className="text-3xl font-bold text-orange-600">{reports.filter(r => getReportStatus(r) === 'new').length}</p>
          <p className="text-xs text-gray-500 mt-1">No admin action yet</p>
        </div>
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Under Review</p>
          <p className="text-3xl font-bold text-amber-600">{reports.filter(r => getReportStatus(r) === 'under_review').length}</p>
          <p className="text-xs text-gray-500 mt-1">Investigation in progress</p>
        </div>
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Resolved</p>
          <p className="text-3xl font-bold text-green-600">{reports.filter(r => getReportStatus(r) === 'resolved').length}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={reportsStatusFilter}
          onChange={(e) => setReportsStatusFilter(e.target.value as typeof reportsStatusFilter)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
        >
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="under_review">Under Review</option>
          <option value="resolved">Resolved</option>
        </select>
        <select
          value={reportsCategoryFilter}
          onChange={(e) => setReportsCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
        >
          <option value="all">All Categories</option>
          <option value={ReportReason.SPAM_SCAM}>Spam / Scam</option>
          <option value={ReportReason.HARASSMENT}>Harassment</option>
          <option value={ReportReason.FAKE_LISTING}>Fake Listing</option>
          <option value={ReportReason.INAPPROPRIATE_CONTENT}>Inappropriate Content</option>
          <option value={ReportReason.ASKING_MONEY_OUTSIDE}>Asking for Money Outside Platform</option>
          <option value={ReportReason.DISCRIMINATION}>Discrimination</option>
          <option value={ReportReason.OTHER}>Other</option>
        </select>
        <select
          value={reportsSort}
          onChange={(e) => setReportsSort(e.target.value as 'new_to_old' | 'old_to_new')}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
        >
          <option value="new_to_old">New to Old</option>
          <option value="old_to_new">Old to New</option>
        </select>
      </div>

      {reportsError && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800">{reportsError}</p>
          </div>
          <button
            type="button"
            onClick={() => { setReportsError(null); fetchReports(); }}
            className="shrink-0 px-3 py-1.5 text-sm font-medium bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {reportsLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100/80 border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Reported User</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Reported By</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Associated Listing</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReports.map((report) => {
                  const reporter = typeof report.reporterUserId === 'object' ? report.reporterUserId : null
                  const reported = typeof report.reportedUserId === 'object' ? report.reportedUserId : null
                  const listing = typeof report.listingId === 'object' ? report.listingId : null
                  const reporterName = reporter?.name || 'Unknown'
                  const reportedName = reported?.name || 'Unknown'
                  const reporterId = reporter?._id
                  const reportedId = reported?._id
                  const listingId = listing?._id
                  const listingTitle = listing?.title || '—'
                  const status = getReportStatus(report)
                  const statusClass = status === 'new' ? 'bg-orange-100 text-orange-800' : status === 'under_review' ? 'bg-amber-100 text-amber-800' : status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'

                  return (
                    <tr key={report._id || report.id} className="hover:bg-gray-50/80">
                      <td className="px-4 py-3">
                        {reportedId ? (
                          <button onClick={() => navigate(`/admin/dashboard/user/${reportedId}`)} className="text-orange-600 hover:text-orange-700 font-medium text-left">
                            {reportedName}
                          </button>
                        ) : (
                          <span className="text-gray-900">{reportedName}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {reporterId ? (
                          <button onClick={() => navigate(`/admin/dashboard/user/${reporterId}`)} className="text-orange-600 hover:text-orange-700 font-medium text-left">
                            {reporterName}
                          </button>
                        ) : (
                          <span className="text-gray-900">{reporterName}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {listingId ? (
                          <button onClick={() => navigate(`/listings/${listingId}`)} className="text-orange-600 hover:text-orange-700 font-medium text-left max-w-[120px] truncate block">
                            {listingTitle}
                          </button>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{getReasonLabel(report.reasonCode)}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-[180px]">
                        {report.description ? (
                          <span className="line-clamp-2" title={report.description}>{report.description}</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600 tabular-nums">{formatReportDateTime(report.createdAt)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                          {getReportStatusLabel(status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {(status === 'new' || status === 'under_review') && (
                          <button
                            onClick={() => setReportActionModal({ report, action: status === 'new' ? 'review' : 'mark_resolved' })}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 transition-colors"
                          >
                            {status === 'new' ? 'Review' : 'Resolve'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {filteredReports.length === 0 && (
            <div className="px-4 py-12 text-center text-gray-500">
              <Flag className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No reports found</p>
            </div>
          )}
        </div>
      )}

      {reportActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !reportActionSubmitting && (setReportActionModal(null), setReportInternalNote(''))}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {reportActionModal.action === 'review' ? 'Review Report' : 'Resolve Report'}
            </h3>
            {reportActionModal.action === 'review' ? (
              <>
                <p className="text-sm text-gray-600 mb-4">Choose an action and add a mandatory internal note (reason log).</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setReportActionModal(prev => prev ? { ...prev, action: 'pause_account' } : null)}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                  >
                    Pause Account
                  </button>
                  <button
                    onClick={() => setReportActionModal(prev => prev ? { ...prev, action: 'suspend_account' } : null)}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                  >
                    Suspend Account
                  </button>
                  <button
                    onClick={() => setReportActionModal(prev => prev ? { ...prev, action: 'mark_resolved' } : null)}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                  >
                    Mark as Resolved
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-600 mb-4">Add a mandatory internal note explaining your decision.</p>
            )}
            <textarea
              value={reportInternalNote}
              onChange={e => setReportInternalNote(e.target.value)}
              placeholder="Internal note (required)"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => { setReportActionModal(null); setReportInternalNote('') }}
                disabled={reportActionSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReportAction}
                disabled={reportActionSubmitting || !reportInternalNote.trim() || reportActionModal.action === 'review'}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reportActionSubmitting ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
