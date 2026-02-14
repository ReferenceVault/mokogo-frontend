import { useState, useEffect, useCallback } from 'react'
import { notificationsApi, NotificationResponse } from '@/services/api'
import { useSocket } from './useSocket'

interface UseNotificationsOptions {
  autoFetch?: boolean
  limit?: number
}

/**
 * Hook to manage notifications state and operations
 * Handles fetching, real-time updates via Socket.IO, and marking as read
 */
export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const { autoFetch = true, limit = 20 } = options

  const [notifications, setNotifications] = useState<NotificationResponse[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('mokogo-access-token') : null

  // Handle incoming notification from socket
  const handleNotification = useCallback((notification: NotificationResponse) => {
    setNotifications((prev) => {
      // Check if notification already exists (avoid duplicates)
      const exists = prev.some((n) => n.id === notification.id || n._id === notification.id)
      if (exists) {
        return prev
      }
      // Prepend new notification
      return [notification, ...prev]
    })

    // Increment unread count if notification is unread
    if (!notification.read) {
      setUnreadCount((prev) => prev + 1)
    }
  }, [])

  // Handle notification summary from socket (sent on connect)
  const handleNotificationSummary = useCallback((summary: { unreadCount: number; recentNotifications: NotificationResponse[] }) => {
    setUnreadCount(summary.unreadCount)
    // Optionally merge recent notifications if not already loaded
    setNotifications((prev) => {
      if (prev.length === 0 && summary.recentNotifications.length > 0) {
        return summary.recentNotifications
      }
      return prev
    })
  }, [])

  // Connect to socket for real-time notifications
  useSocket(token, handleNotification, handleNotificationSummary)

  // Fetch notifications from API
  const fetchNotifications = useCallback(async (unreadOnly = false) => {
    setLoading(true)
    setError(null)
    try {
      const response = await notificationsApi.list({
        limit,
        skip: 0,
        unreadOnly,
      })
      setNotifications(response.notifications)
      setUnreadCount(response.unreadCount)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch notifications')
      setError(error)
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [limit])

  // Mark a single notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationsApi.markAsRead(notificationId)
      
      // Optimistically update local state
      setNotifications((prev) =>
        prev.map((n) =>
          (n.id === notificationId || n._id === notificationId)
            ? { ...n, read: true }
            : n
        )
      )
      
      // Decrement unread count
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Error marking notification as read:', err)
      // Revert optimistic update on error
      fetchNotifications()
    }
  }, [fetchNotifications])

  // Mark all notifications as read
  const markAllRead = useCallback(async () => {
    try {
      await notificationsApi.markAllRead()
      
      // Optimistically update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
      // Revert optimistic update on error
      fetchNotifications()
    }
  }, [fetchNotifications])

  // Refresh notifications
  const refresh = useCallback(() => {
    fetchNotifications(false)
  }, [fetchNotifications])

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch && token) {
      fetchNotifications(false)
    }
  }, [autoFetch, token, fetchNotifications])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllRead,
    refresh,
  }
}
