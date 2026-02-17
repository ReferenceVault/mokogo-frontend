import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SocialSidebar from '@/components/SocialSidebar'
import DashboardHeader from '@/components/DashboardHeader'
import DashboardSidebar from '@/components/DashboardSidebar'
import { adminApi, type AdminUserProfile } from '@/services/api'
import {
  ArrowLeft,
  User,
  LayoutGrid,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  FileText,
  Home,
  MessageSquare,
  CheckCircle,
  Flag,
  PauseCircle,
  Ban,
  PlayCircle,
  Wine,
  Utensils,
  Cigarette,
  Users,
  Settings,
} from 'lucide-react'

const AdminUserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleLogout = () => {
    navigate('/admin/login')
  }

  const goToDashboard = (openTab: string) => {
    navigate('/admin/dashboard', { state: { openTab } })
  }
  const [profile, setProfile] = useState<AdminUserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (!userId) return
    const fetchProfile = async () => {
      setLoading(true)
      setError(null)
      try {
        const p = await adminApi.getUserProfileForAdmin(userId)
        setProfile(p)
      } catch (e) {
        console.error(e)
        setError('Could not load user profile.')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [userId])

  const handleStatusChange = async (status: 'ACTIVE' | 'PAUSED' | 'SUSPENDED') => {
    if (!userId || !profile) return
    setActionLoading(true)
    try {
      await adminApi.updateUserStatus(userId, status)
      setProfile({ ...profile, status })
    } catch (e) {
      console.error(e)
    } finally {
      setActionLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/admin/dashboard', { state: { openTab: 'users' } })
  }

  const sidebarMenuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid, onClick: () => goToDashboard('overview') },
    { id: 'listings', label: 'Listings', icon: Home, onClick: () => goToDashboard('listings') },
    { id: 'users', label: 'Users', icon: Users, onClick: () => goToDashboard('users') },
    { id: 'requests', label: 'Requests', icon: MessageSquare, onClick: () => goToDashboard('requests') },
    { id: 'reports', label: 'Reports', icon: Flag, onClick: () => goToDashboard('reports') },
    { id: 'settings', label: 'Settings', icon: Settings, onClick: () => goToDashboard('settings') },
  ]

  const renderLayout = (children: React.ReactNode) => (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <SocialSidebar position="right" />
      <DashboardHeader
        activeView="overview"
        menuItems={[{ label: 'Dashboard', view: 'overview' }]}
        userName="Admin"
        userEmail="admin@mokogo.in"
        onLogout={handleLogout}
      />
      <div className="flex flex-1">
        <DashboardSidebar
          title="Admin Panel"
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeView="users"
          menuItems={sidebarMenuItems}
        />
        <main className="flex-1 pr-11 lg:pr-14">
          <div className="max-w-4xl mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  )

  if (loading) {
    return renderLayout(
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
        <div className="inline-block w-10 h-10 border-2 border-orange-300 border-t-orange-500 rounded-full animate-spin" />
        <p className="mt-4 text-gray-600">Loading user profile...</p>
      </div>,
    )
  }

  if (error || !profile) {
    return renderLayout(
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
        <p className="text-gray-600">{error || 'User not found.'}</p>
        <button onClick={handleBack} className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
          Back to Users
        </button>
      </div>,
    )
  }

  const p = profile
  const statusClass =
    p.status === 'ACTIVE'
      ? 'bg-green-100 text-green-800 border-green-200'
      : p.status === 'PAUSED'
        ? 'bg-amber-100 text-amber-800 border-amber-200'
        : 'bg-red-100 text-red-800 border-red-200'
  const joined = p.createdAt
    ? new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'
  const location = [p.area, p.currentCity].filter(Boolean).join(', ') || null

  return renderLayout(
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </button>
        <h1 className="text-xl font-semibold text-gray-900">User Profile</h1>
      </div>
      <div className="space-y-6">
          {/* Profile card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 px-6 py-8 sm:px-8 sm:py-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="shrink-0">
                  {p.profileImageUrl ? (
                    <img
                      src={p.profileImageUrl}
                      alt=""
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-orange-200 flex items-center justify-center text-orange-700 font-bold text-2xl sm:text-3xl ring-4 ring-white shadow-lg">
                      {(p.name || '').slice(0, 2).toUpperCase() || '—'}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{p.name || '—'}</h2>
                  <p className="text-gray-600 mt-1 truncate">{p.email}</p>
                  {p.phoneNumber && (
                    <p className="text-gray-600 text-sm mt-0.5 flex items-center gap-2">
                      <Phone className="w-4 h-4 shrink-0" />
                      {p.phoneNumber}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${statusClass}`}>
                      {p.status}
                    </span>
                    <span className="text-sm text-gray-500">Joined {joined}</span>
                  </div>
                  {/* Status actions */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {p.status === 'ACTIVE' && (
                      <>
                        <button
                          onClick={() => handleStatusChange('PAUSED')}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 disabled:opacity-50 transition-colors"
                        >
                          <PauseCircle className="w-4 h-4" />
                          Pause
                        </button>
                        <button
                          onClick={() => handleStatusChange('SUSPENDED')}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 disabled:opacity-50 transition-colors"
                        >
                          <Ban className="w-4 h-4" />
                          Suspend
                        </button>
                      </>
                    )}
                    {(p.status === 'PAUSED' || p.status === 'SUSPENDED') && (
                      <button
                        onClick={() => handleStatusChange('ACTIVE')}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 disabled:opacity-50 transition-colors"
                      >
                        <PlayCircle className="w-4 h-4" />
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Home className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 tabular-nums">{p.listingsCreated ?? '—'}</p>
                <p className="text-xs text-gray-500">Listings Created</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 tabular-nums">{p.requestsSent ?? '—'}</p>
                <p className="text-xs text-gray-500">Requests Sent</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 tabular-nums">{p.requestsAccepted ?? '—'}</p>
                <p className="text-xs text-gray-500">Requests Accepted</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <Flag className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 tabular-nums">{p.reportCount ?? '—'}</p>
                <p className="text-xs text-gray-500">Reports Received</p>
              </div>
            </div>
          </div>

          {/* Details sections */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User className="w-4 h-4" />
                Personal Information
              </h3>
              <dl className="space-y-3 text-sm">
                {p.gender && (
                  <div>
                    <dt className="text-gray-500">Gender</dt>
                    <dd className="font-medium text-gray-900">{p.gender}</dd>
                  </div>
                )}
                {p.dateOfBirth && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <dt className="text-gray-500">Date of Birth</dt>
                      <dd className="font-medium text-gray-900">{p.dateOfBirth}</dd>
                    </div>
                  </div>
                )}
                {location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-gray-500">Location</dt>
                      <dd className="font-medium text-gray-900">{location}</dd>
                    </div>
                  </div>
                )}
                {p.occupation && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <div>
                      <dt className="text-gray-500">Occupation</dt>
                      <dd className="font-medium text-gray-900">{p.occupation}</dd>
                    </div>
                  </div>
                )}
                {p.companyName && (
                  <div>
                    <dt className="text-gray-500">Company</dt>
                    <dd className="font-medium text-gray-900">{p.companyName}</dd>
                  </div>
                )}
                {!p.gender && !p.dateOfBirth && !location && !p.occupation && !p.companyName && (
                  <p className="text-gray-500 italic">No personal information provided.</p>
                )}
              </dl>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Utensils className="w-4 h-4" />
                Preferences
              </h3>
              <dl className="space-y-3 text-sm">
                {p.smoking && (
                  <div className="flex items-center gap-2">
                    <Cigarette className="w-4 h-4 text-gray-400" />
                    <div>
                      <dt className="text-gray-500">Smoking</dt>
                      <dd className="font-medium text-gray-900">{p.smoking}</dd>
                    </div>
                  </div>
                )}
                {p.drinking && (
                  <div className="flex items-center gap-2">
                    <Wine className="w-4 h-4 text-gray-400" />
                    <div>
                      <dt className="text-gray-500">Drinking</dt>
                      <dd className="font-medium text-gray-900">{p.drinking}</dd>
                    </div>
                  </div>
                )}
                {p.foodPreference && (
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-gray-400" />
                    <div>
                      <dt className="text-gray-500">Food Preference</dt>
                      <dd className="font-medium text-gray-900">{p.foodPreference}</dd>
                    </div>
                  </div>
                )}
                {!p.smoking && !p.drinking && !p.foodPreference && (
                  <p className="text-gray-500 italic">No preferences provided.</p>
                )}
              </dl>
            </div>
          </div>

          {p.about && (
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                About
              </h3>
              <p className="text-gray-700 leading-relaxed">{p.about}</p>
            </div>
          )}
      </div>
    </div>
  )
}

export default AdminUserProfilePage
