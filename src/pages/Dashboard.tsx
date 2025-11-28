import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Logo from '@/components/Logo'
import { useStore } from '@/store/useStore'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, currentListing, setCurrentListing } = useStore()
  const [showBoostModal, setShowBoostModal] = useState(false)
  const [showArchiveModal, setShowArchiveModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleCreateListing = () => {
    if (currentListing && currentListing.status === 'live') {
      // Show one active listing rule message
      return
    }
    navigate('/listing/wizard')
  }

  const handleContinueDraft = () => {
    navigate('/listing/wizard')
  }

  const handleEditListing = () => {
    navigate('/listing/wizard')
  }

  const handleArchive = () => {
    if (currentListing) {
      const updated = { ...currentListing, status: 'archived' as const }
      setCurrentListing(updated)
      setShowArchiveModal(false)
    }
  }

  const handleDelete = () => {
    if (currentListing) {
      setCurrentListing(null)
      localStorage.removeItem('mokogo-listing')
      setShowDeleteModal(false)
    }
  }

  const handleBoost = () => {
    if (currentListing) {
      const updated = { ...currentListing, boostEnabled: true }
      setCurrentListing(updated)
      setShowBoostModal(false)
    }
  }

  const formatLastUpdated = (dateString: string) => {
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
      {/* Top Navigation */}
      <header className="bg-white border-b border-mokogo-gray px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-mokogo-blue/20 flex items-center justify-center">
              <span className="text-mokogo-blue font-medium text-sm">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <button className="text-gray-600 hover:text-gray-900 text-sm">
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Your listings
        </h1>

        {/* One Active Listing Rule Banner */}
        {currentListing && currentListing.status === 'live' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">You already have an active listing</h3>
                <p className="text-sm text-blue-800">
                  You can keep only one listing live at a time. Archive or delete your current listing to create a new one.
                </p>
              </div>
            </div>
          </div>
        )}

        {!currentListing ? (
          /* State A - No listing yet */
          <div className="card text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-mokogo-gray/50 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              You don't have any listings yet.
            </h2>
            <p className="text-gray-600 mb-6">It takes less than 4 minutes.</p>
            <button onClick={handleCreateListing} className="btn-primary inline-block">
              Create your first listing
            </button>
          </div>
        ) : currentListing.status === 'draft' ? (
          /* State B - Draft listing */
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {currentListing.title || 'Draft listing'}
                </h2>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  {currentListing.city && currentListing.locality && (
                    <span>{currentListing.city} · {currentListing.locality}</span>
                  )}
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    Draft
                  </span>
                  {currentListing.updatedAt && (
                    <span>Last updated {formatLastUpdated(currentListing.updatedAt)}</span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              We saved your progress. You can finish your listing anytime.
            </p>
            <div className="flex gap-3">
              <button onClick={handleContinueDraft} className="btn-primary">
                Continue draft
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Delete draft
              </button>
            </div>
          </div>
        ) : (
          /* State C/D - Live/Archived listing */
          <div className="card">
            <div className="flex items-start gap-4">
              {currentListing.photos && currentListing.photos.length > 0 && (
                <div className="w-32 h-32 rounded-lg bg-mokogo-gray flex-shrink-0 overflow-hidden">
                  <img
                    src={currentListing.photos[0]}
                    alt="Listing"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {currentListing.title}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {currentListing.city} · {currentListing.locality}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentListing.boostEnabled && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Boosted
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        currentListing.status === 'live'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {currentListing.status.charAt(0).toUpperCase() + currentListing.status.slice(1)}
                    </span>
                  </div>
                </div>
                {currentListing.status === 'archived' && (
                  <p className="text-sm text-gray-600 mb-4">
                    This listing is not visible to seekers.
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-4">
                  {currentListing.status === 'live' ? (
                    <>
                      <button onClick={handleEditListing} className="btn-secondary">
                        Edit listing
                      </button>
                      <Link to="/requests" className="btn-primary">
                        View requests
                      </Link>
                      <button
                        onClick={() => setShowBoostModal(true)}
                        className="btn-secondary"
                      >
                        Boost visibility
                      </button>
                      <button
                        onClick={() => setShowArchiveModal(true)}
                        className="text-sm text-gray-600 hover:text-gray-900"
                      >
                        Archive listing
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          const updated = { ...currentListing, status: 'live' as const }
                          setCurrentListing(updated)
                        }}
                        className="btn-primary"
                      >
                        Re-publish
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Delete listing
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Boost Modal */}
      {showBoostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Boost visibility</h3>
            <p className="text-gray-600 mb-4">
              Boost is coming soon. For now, we'll mark this listing as Boosted in your account.
            </p>
            <div className="flex gap-3">
              <button onClick={handleBoost} className="btn-primary flex-1">
                Confirm
              </button>
              <button
                onClick={() => setShowBoostModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Archive listing</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to archive this listing? It will no longer be visible to seekers.
            </p>
            <div className="flex gap-3">
              <button onClick={handleArchive} className="btn-primary flex-1">
                Archive
              </button>
              <button
                onClick={() => setShowArchiveModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete listing</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this listing? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-700 flex-1">
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard