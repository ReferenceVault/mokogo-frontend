import { useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '@/hooks/useNotifications'
import { NotificationResponse } from '@/services/api'

/**
 * Formats a date to a relative time string (e.g., "2 minutes ago", "1 hour ago")
 */
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`
}

/**
 * Gets the navigation path based on notification type and data
 */
const getNotificationPath = (notification: NotificationResponse): string | null => {
  const { type, data } = notification

  switch (type) {
    case 'message.received':
      if (data?.conversationId) {
        return `/dashboard?view=messages&conversation=${data.conversationId}`
      }
      return '/dashboard?view=messages'
    
    case 'request.sent':
    case 'request.approved':
    case 'request.rejected':
      if (data?.requestId) {
        return `/dashboard?view=requests`
      }
      if (data?.listingId) {
        return `/listing/${data.listingId}`
      }
      return '/dashboard?view=requests'
    
    default:
      return null
  }
}

interface BellNotificationProps {
  className?: string
}

const BellNotification = ({ className = '' }: BellNotificationProps) => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllRead,
    refresh,
  } = useNotifications({ autoFetch: true, limit: 20 })

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleNotificationClick = async (notification: NotificationResponse) => {
    // Mark as read if unread
    if (!notification.read) {
      await markAsRead(notification.id || notification._id)
    }

    // Navigate to relevant page
    const path = getNotificationPath(notification)
    if (path) {
      navigate(path)
      setIsOpen(false)
    }
  }

  const handleMarkAllRead = async () => {
    await markAllRead()
  }

  return (
    <div className={`relative ${className}`}>
      {/* Bell Icon Button */}
      <button
        ref={buttonRef}
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) {
            refresh()
          }
        }}
        className="relative p-2.5 text-gray-600 hover:text-orange-500 transition-all duration-300 hover:bg-orange-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-orange-500 text-white text-xs font-semibold rounded-full flex items-center justify-center ring-2 ring-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-orange-200/50 z-50 max-h-[500px] flex flex-col"
          role="menu"
          aria-orientation="vertical"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-orange-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-xs font-normal text-orange-600">
                  ({unreadCount} unread)
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-orange-600 hover:text-orange-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 rounded px-2 py-1"
                aria-label="Mark all as read"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {loading && notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              <div className="divide-y divide-orange-100">
                {notifications.map((notification) => (
                  <button
                    key={notification.id || notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors focus:outline-none focus:bg-orange-50 ${
                      !notification.read ? 'bg-orange-50/50' : ''
                    }`}
                    role="menuitem"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`text-sm font-medium ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                          {notification.body}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {/* {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-orange-100 text-center">
              <button
                onClick={() => {
                  navigate('/dashboard?view=notifications')
                  setIsOpen(false)
                }}
                className="text-xs text-orange-600 hover:text-orange-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 rounded px-2 py-1"
              >
                View all notifications
              </button>
            </div>
          )} */}
        </div>
      )}

      {/* Click outside overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export default BellNotification
