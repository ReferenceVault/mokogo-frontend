import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi, usersApi, type AdminUserItem, type CreateUserRequest } from '@/services/api'
import { ADMIN_USERS_PAGE_SIZE, ADMIN_SEARCH_DEBOUNCE_MS, ADMIN_ADD_USER_SUCCESS_CLOSE_MS } from '../constants'
import {
  Search,
  User,
  UserCircle,
  PauseCircle,
  Ban,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,
} from 'lucide-react'

export function AdminUsersTab() {
  const navigate = useNavigate()
  const [adminUsers, setAdminUsers] = useState<AdminUserItem[]>([])
  const [adminUsersTotal, setAdminUsersTotal] = useState(0)
  const [userSearch, setUserSearch] = useState('')
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [userStatusFilter, setUserStatusFilter] = useState('all')
  const [userPage, setUserPage] = useState(1)
  const [usersLoading, setUsersLoading] = useState(false)
  const [userActionLoading, setUserActionLoading] = useState(false)
  const [usersError, setUsersError] = useState<string | null>(null)
  const userSearchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [addUserLoading, setAddUserLoading] = useState(false)
  const [addUserError, setAddUserError] = useState('')
  const [addUserSuccess, setAddUserSuccess] = useState('')
  const [addUserForm, setAddUserForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
  })

  const fetchUsers = async () => {
    setUsersLoading(true)
    setUsersError(null)
    try {
      const data = await adminApi.getUsersForAdmin({
        search: userSearchQuery || undefined,
        status: userStatusFilter === 'all' ? undefined : userStatusFilter,
        page: userPage,
        limit: ADMIN_USERS_PAGE_SIZE,
      })
      setAdminUsers(data.users)
      setAdminUsersTotal(data.total)
    } catch (e) {
      console.error('Error fetching admin users:', e)
      const msg = (e as { response?: { data?: { message?: string }; status?: number } })?.response?.data?.message
      setUsersError(msg || 'Failed to load users. Please try again.')
    } finally {
      setUsersLoading(false)
    }
  }

  useEffect(() => {
    if (userSearchTimeoutRef.current) clearTimeout(userSearchTimeoutRef.current)
    userSearchTimeoutRef.current = setTimeout(() => {
      setUserSearchQuery(userSearch)
      setUserPage(1)
    }, ADMIN_SEARCH_DEBOUNCE_MS)
    return () => { if (userSearchTimeoutRef.current) clearTimeout(userSearchTimeoutRef.current) }
  }, [userSearch])

  useEffect(() => {
    fetchUsers()
  }, [userSearchQuery, userStatusFilter, userPage])

  const handleAddUserChange = (field: keyof typeof addUserForm, value: string) => {
    setAddUserForm(prev => ({ ...prev, [field]: value }))
  }

  const handleAddUserSubmit = async () => {
    setAddUserError('')
    setAddUserSuccess('')
    if (!addUserForm.name.trim() || !addUserForm.email.trim() || !addUserForm.password.trim()) {
      setAddUserError('Name, email, and password are required.')
      return
    }
    setAddUserLoading(true)
    try {
      const createUserData: CreateUserRequest = {
        name: addUserForm.name.trim(),
        email: addUserForm.email.trim(),
        password: addUserForm.password,
      }
      if (addUserForm.phoneNumber.trim()) {
        createUserData.phoneNumber = addUserForm.phoneNumber.trim()
      }
      await usersApi.createUser(createUserData)
      setAddUserSuccess('User created successfully.')
      setAddUserForm({ name: '', email: '', phoneNumber: '', password: '' })
      fetchUsers()
      setTimeout(() => {
        setShowAddUserModal(false)
        setAddUserSuccess('')
      }, ADMIN_ADD_USER_SUCCESS_CLOSE_MS)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string }; message?: string } }
      const message = err?.response?.data?.message || (err as Error)?.message || 'Failed to create user.'
      setAddUserError(message)
    } finally {
      setAddUserLoading(false)
    }
  }

  const handleStatusUpdate = async (userId: string, status: 'ACTIVE' | 'PAUSED' | 'SUSPENDED') => {
    setUserActionLoading(true)
    setUsersError(null)
    try {
      await adminApi.updateUserStatus(userId, status)
      const d = await adminApi.getUsersForAdmin({
        search: userSearchQuery || undefined,
        status: userStatusFilter === 'all' ? undefined : userStatusFilter,
        page: userPage,
        limit: ADMIN_USERS_PAGE_SIZE,
      })
      setAdminUsers(d.users)
      setAdminUsersTotal(d.total)
    } catch (e) {
      console.error(e)
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      setUsersError(msg || 'Failed to update user status. Please try again.')
    } finally {
      setUserActionLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-600 mt-1">Review and manage users. Search by name, email, or mobile.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or mobile..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-64"
            />
          </div>
          <button onClick={() => setShowAddUserModal(true)} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            <User className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <select
          value={userStatusFilter}
          onChange={(e) => { setUserStatusFilter(e.target.value); setUserPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
        >
          <option value="all">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-800">{adminUsersTotal}</span> total · Showing {(userPage - 1) * ADMIN_USERS_PAGE_SIZE + 1}–{Math.min(userPage * ADMIN_USERS_PAGE_SIZE, adminUsersTotal)}
        </p>
      </div>

      {usersError && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800">{usersError}</p>
          </div>
          <button
            type="button"
            onClick={() => { setUsersError(null); fetchUsers(); }}
            className="shrink-0 px-3 py-1.5 text-sm font-medium bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100/80 border-b-2 border-gray-200">
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Location</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Joined Date</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Reports</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usersLoading ? (
                <tr><td colSpan={6} className="px-5 py-16 text-center text-gray-500">Loading users...</td></tr>
              ) : adminUsers.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-16 text-center text-gray-500">No users found</td></tr>
              ) : (
                adminUsers.map((u) => {
                  const status = (u.status || 'ACTIVE').toUpperCase()
                  const isActive = status === 'ACTIVE'
                  const isPaused = status === 'PAUSED'
                  const isSuspended = status === 'SUSPENDED'
                  const initials = (u.name || '').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '—'
                  const location = [u.area, u.currentCity].filter(Boolean).join(', ') || '—'
                  const joined = u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
                  return (
                    <tr key={u._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-semibold text-xs">{initials}</div>
                          <div>
                            <div className="font-medium text-gray-900">{u.name || '—'}</div>
                            <div className="text-gray-500">{u.email}</div>
                            {u.phoneNumber && <div className="text-gray-500">{u.phoneNumber}</div>}
                            {u.gender && <div className="text-gray-400 text-xs">{u.gender}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-700">{location}</td>
                      <td className="px-5 py-3 text-gray-700 tabular-nums">{joined}</td>
                      <td className="px-5 py-3">
                        {isActive && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">Active</span>}
                        {isPaused && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">Paused</span>}
                        {isSuspended && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">Suspended</span>}
                        {!isActive && !isPaused && !isSuspended && <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{u.status}</span>}
                      </td>
                      <td className="px-5 py-3">
                        <span className={u.reportCount > 0 ? 'font-semibold text-red-600 tabular-nums' : 'tabular-nums text-gray-700'}>{u.reportCount}</span>
                        {u.reportCount > 0 && <span className="ml-1 text-red-500" title="User has been reported">●</span>}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            onClick={() => navigate(`/admin/dashboard/user/${u._id}`)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 transition-colors"
                          >
                            <UserCircle className="w-3.5 h-3.5" />
                            View Profile
                          </button>
                          {isActive && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(u._id, 'PAUSED')}
                                disabled={userActionLoading}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                title="Pause user"
                              >
                                <PauseCircle className="w-3.5 h-3.5" />
                                Pause
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(u._id, 'SUSPENDED')}
                                disabled={userActionLoading}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                title="Suspend user"
                              >
                                <Ban className="w-3.5 h-3.5" />
                                Suspend
                              </button>
                            </>
                          )}
                          {isPaused && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(u._id, 'ACTIVE')}
                                disabled={userActionLoading}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                title="Restore to active"
                              >
                                <PlayCircle className="w-3.5 h-3.5" />
                                Restore
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(u._id, 'SUSPENDED')}
                                disabled={userActionLoading}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                title="Suspend user"
                              >
                                <Ban className="w-3.5 h-3.5" />
                                Suspend
                              </button>
                            </>
                          )}
                          {isSuspended && (
                            <button
                              onClick={() => handleStatusUpdate(u._id, 'ACTIVE')}
                              disabled={userActionLoading}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              title="Restore to active"
                            >
                              <PlayCircle className="w-3.5 h-3.5" />
                              Restore
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        {adminUsersTotal > 0 && (adminUsersTotal > ADMIN_USERS_PAGE_SIZE || userPage > 1) && (
          <div className="px-5 py-4 border-t border-gray-200 bg-gray-50/50 flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-gray-600">
              Page <span className="font-semibold text-gray-800">{userPage}</span> of <span className="font-semibold text-gray-800">{Math.ceil(adminUsersTotal / ADMIN_USERS_PAGE_SIZE) || 1}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUserPage(1)}
                disabled={userPage <= 1}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                First
              </button>
              <button
                onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                disabled={userPage <= 1}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <span className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg font-medium">
                {userPage}
              </span>
              <button
                onClick={() => setUserPage((p) => p + 1)}
                disabled={userPage * ADMIN_USERS_PAGE_SIZE >= adminUsersTotal}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setUserPage(Math.ceil(adminUsersTotal / ADMIN_USERS_PAGE_SIZE) || 1)}
                disabled={userPage * ADMIN_USERS_PAGE_SIZE >= adminUsersTotal}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Last
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 relative">
            <button
              onClick={() => setShowAddUserModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Add User</h2>
            <p className="text-sm text-gray-600 mb-4">Create a new user account.</p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  value={addUserForm.name}
                  onChange={(e) => handleAddUserChange('name', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={addUserForm.email}
                  onChange={(e) => handleAddUserChange('email', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-gray-400 font-normal">(Optional)</span></label>
                <input
                  value={addUserForm.phoneNumber}
                  onChange={(e) => handleAddUserChange('phoneNumber', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="+91XXXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={addUserForm.password}
                  onChange={(e) => handleAddUserChange('password', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Minimum 8 characters"
                />
              </div>

              {addUserError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {addUserError}
                </div>
              )}
              {addUserSuccess && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
                  {addUserSuccess}
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUserSubmit}
                disabled={addUserLoading}
                className="px-4 py-2 text-sm rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-50"
              >
                {addUserLoading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
