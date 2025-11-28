import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '@/components/Logo'
import { useStore } from '@/store/useStore'

const RequestsList = () => {
  const navigate = useNavigate()
  const { currentListing, requests } = useStore()
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'blocked'>('all')

  const filteredRequests = requests.filter((req) => {
    if (filter === 'all') return true
    return req.status === filter
  })

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`
    return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`
  }

  return (
    <div className="min-h-screen bg-mokogo-off-white">
      <header className="bg-white border-b border-mokogo-gray px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <Link to="/dashboard" className="text-mokogo-blue hover:underline mb-4 inline-block">
          ← Back to dashboard
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {currentListing?.title || 'Listing requests'}
          </h1>
          <p className="text-gray-600 mt-1">
            {currentListing?.city} ·{' '}
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              Live
            </span>
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all', label: 'All' },
            { key: 'pending', label: 'Pending' },
            { key: 'accepted', label: 'Accepted' },
            { key: 'rejected', label: 'Rejected' },
            { key: 'blocked', label: 'Blocked' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f.key
                  ? 'bg-mokogo-blue text-white'
                  : 'border border-mokogo-gray text-gray-700 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-mokogo-gray/50 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-600">
              No requests yet. Share your listing link to get more responses.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                onClick={() => navigate(`/requests/${request.id}`)}
                className="card cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-mokogo-blue/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-mokogo-blue font-medium">
                      {request.seekerName[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {request.seekerName}
                        </h3>
                        {request.seekerOccupation && (
                          <p className="text-xs text-gray-500">{request.seekerOccupation}</p>
                        )}
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {request.introMessage}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            request.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : request.status === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : request.status === 'rejected'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(request.requestedAt)}
                        </span>
                      </div>
                    </div>
                    {request.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle accept - will be done in detail page
                            navigate(`/requests/${request.id}`)
                          }}
                          className="px-3 py-1.5 bg-green-100 text-green-700 rounded text-sm font-medium hover:bg-green-200"
                        >
                          Accept
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle reject - will be done in detail page
                            navigate(`/requests/${request.id}`)
                          }}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default RequestsList