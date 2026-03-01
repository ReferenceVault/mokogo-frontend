import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import DashboardHeader from '@/components/DashboardHeader'
import DashboardSidebar from '@/components/DashboardSidebar'
import { LayoutGrid, Home, MessageSquare, Settings, Users, Flag } from 'lucide-react'
import { AdminOverviewTab } from './tabs/AdminOverviewTab'
import { AdminUsersTab } from './tabs/AdminUsersTab'
import { AdminListingsTab } from './tabs/AdminListingsTab'
import { AdminReportsTab } from './tabs/AdminReportsTab'
import { AdminRequestsTab } from './tabs/AdminRequestsTab'
import { AdminSettingsTab } from './tabs/AdminSettingsTab'
import { ADMIN_VIEW_IDS, type AdminViewId } from './constants'
import { useStore } from '@/store/useStore'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useStore((state) => state.user)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeView, setActiveView] = useState<AdminViewId>('overview')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const openTab = (location.state as { openTab?: string })?.openTab
    if (openTab === 'users') setActiveView('users')
  }, [location.state])

  const handleLogout = () => {
    navigate('/admin/login')
  }

  const handleNavigateToUserDashboard = () => {
    navigate('/dashboard')
  }

  // Get user info from store, with fallbacks
  const userName = user?.name || user?.email?.split('@')[0] || 'Admin'
  const userEmail = user?.email || ''

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <DashboardHeader
        activeView="overview"
        onViewChange={(view) => setActiveView(view as AdminViewId)}
        menuItems={[{ label: 'Dashboard', view: 'overview' }]}
        userName={userName}
        userEmail={userEmail}
        userImageUrl={user?.profileImageUrl}
        onLogout={handleLogout}
        onNavigateToOtherDashboard={handleNavigateToUserDashboard}
        otherDashboardLabel="User Dashboard"
      />

      <div className="flex flex-1">
        <DashboardSidebar
          title="Admin Panel"
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeView={activeView}
          menuItems={[
            { id: 'overview', label: 'Overview', icon: LayoutGrid, onClick: () => setActiveView('overview') },
            { id: 'listings', label: 'Listings', icon: Home, onClick: () => setActiveView('listings') },
            { id: 'users', label: 'Users', icon: Users, onClick: () => setActiveView('users') },
            { id: 'requests', label: 'Requests', icon: MessageSquare, onClick: () => setActiveView('requests') },
            { id: 'reports', label: 'Reports', icon: Flag, onClick: () => setActiveView('reports') },
            { id: 'settings', label: 'Settings', icon: Settings, onClick: () => setActiveView('settings') },
          ]}
        />

        <SocialSidebar position="right" />

        <main className="flex-1 pr-11 lg:pr-14">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {activeView === 'overview' && <AdminOverviewTab />}
            {activeView === 'users' && <AdminUsersTab />}
            {activeView === 'listings' && <AdminListingsTab />}
            {activeView === 'requests' && <AdminRequestsTab onSetActiveView={(view) => setActiveView(view as AdminViewId)} />}
            {activeView === 'reports' && <AdminReportsTab />}
            {activeView === 'settings' && <AdminSettingsTab />}
            {!ADMIN_VIEW_IDS.includes(activeView) && (
              <div className="text-center py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
                <p className="text-gray-600">Content will be added here</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default AdminDashboard
