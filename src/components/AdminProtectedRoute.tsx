import { Navigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { useEffect, useState } from 'react'
import { usersApi } from '@/services/api'

interface AdminProtectedRouteProps {
  children: React.ReactNode
}

// Helper to validate JWT token format (basic check)
const decodeJwtPayload = (token: string) => {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    return JSON.parse(atob(padded))
  } catch (error) {
    return null
  }
}

const isValidTokenFormat = (token: string): boolean => {
  const payload = decodeJwtPayload(token)
  if (!payload) return false
  if (payload.exp) {
    const expirationTime = payload.exp * 1000 // Convert to milliseconds
    if (Date.now() >= expirationTime) {
      return false // Token has expired
    }
  }
  return true
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const user = useStore((state) => state.user)
  const setUser = useStore((state) => state.setUser)
  const [isChecking, setIsChecking] = useState(true)
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    const checkAuthAndAdminAccess = async () => {
      // Check authentication on mount
      const accessToken = localStorage.getItem('mokogo-access-token')
      const savedUser = localStorage.getItem('mokogo-user')

      // If no token or user, redirect immediately
      if (!accessToken || !savedUser) {
        // Clear any stale data
        localStorage.removeItem('mokogo-user')
        localStorage.removeItem('mokogo-access-token')
        localStorage.removeItem('mokogo-refresh-token')
        setUser(null)
        setIsChecking(false)
        setShouldRedirect(true)
        return
      }

      // Validate token format and expiration
      if (!isValidTokenFormat(accessToken)) {
        // Token is invalid or expired, clear it
        localStorage.removeItem('mokogo-user')
        localStorage.removeItem('mokogo-access-token')
        localStorage.removeItem('mokogo-refresh-token')
        setUser(null)
        setIsChecking(false)
        setShouldRedirect(true)
        return
      }

      // If token exists but user state is not loaded, try to load it
      let currentUser = user
      if (!currentUser && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser)
          setUser(parsedUser)
          currentUser = parsedUser
        } catch (error) {
          console.error('Error parsing saved user:', error)
          localStorage.removeItem('mokogo-user')
          localStorage.removeItem('mokogo-access-token')
          localStorage.removeItem('mokogo-refresh-token')
          setUser(null)
          setIsChecking(false)
          setShouldRedirect(true)
          return
        }
      }

      // Check if user has admin role
      if (!currentUser || !currentUser.roles || !currentUser.roles.includes('admin')) {
        // User is authenticated but not an admin, redirect to admin login
        setIsChecking(false)
        setShouldRedirect(true)
        return
      }

      // Fetch full profile if user exists but doesn't have profileImageUrl
      if (currentUser && !(currentUser as any).profileImageUrl) {
        try {
          const profile = await usersApi.getMyProfile()
          // Merge profile data with existing user data
          const updatedUser = { ...currentUser, ...profile }
          setUser(updatedUser as any)
        } catch (error) {
          console.error('Error fetching user profile:', error)
          // Continue even if profile fetch fails
        }
      }

      setIsChecking(false)
    }

    checkAuthAndAdminAccess()
  }, [setUser]) // Removed 'user' from dependencies to prevent infinite loops

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mokogo-off-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-mokogo-primary"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Handle redirect after checking is complete
  if (shouldRedirect) {
    return <Navigate to="/admin/login" replace />
  }

  // Final check if user is authenticated and has admin role
  const accessToken = localStorage.getItem('mokogo-access-token')
  const savedUser = localStorage.getItem('mokogo-user')
  
  let currentUser = user
  if (!currentUser && savedUser) {
    try {
      currentUser = JSON.parse(savedUser)
    } catch (error) {
      console.error('Error parsing saved user in render:', error)
      currentUser = null
    }
  }

  // Check authentication
  if (!accessToken || !currentUser || !isValidTokenFormat(accessToken)) {
    return <Navigate to="/admin/login" replace />
  }

  // Check admin role
  if (!currentUser.roles || !currentUser.roles.includes('admin')) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}

export default AdminProtectedRoute
