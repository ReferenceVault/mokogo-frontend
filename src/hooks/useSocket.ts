import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Get WebSocket base URL - strip /api if present, or use VITE_WS_URL if set
const getWebSocketBaseURL = (): string => {
  const wsUrl = import.meta.env.VITE_WS_URL
  if (wsUrl) {
    return wsUrl
  }
  
  // Remove /api suffix if present
  const baseUrl = API_BASE_URL.replace(/\/api\/?$/, '')
  return baseUrl
}

const WS_BASE_URL = getWebSocketBaseURL()

/**
 * Hook to manage Socket.IO connection for notifications
 * Connects to /notifications namespace with JWT authentication
 */
export const useSocket = (
  token: string | null,
  onNotification?: (notification: any) => void,
  onNotificationSummary?: (summary: { unreadCount: number; recentNotifications: any[] }) => void,
) => {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!token) {
      // Disconnect if no token
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
      return
    }

    // Connect to notifications namespace
    const socket = io(`${WS_BASE_URL}/notifications`, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    })

    socket.on('connect', () => {
      console.log('Notifications WebSocket connected')
    })

    socket.on('disconnect', () => {
      console.log('Notifications WebSocket disconnected')
    })

    socket.on('connect_error', (error) => {
      console.error('Notifications WebSocket connection error:', error)
    })

    // Listen for notifications
    const notificationHandler = onNotification ? (notification: any) => {
      console.log('Received notification:', notification)
      onNotification(notification)
    } : undefined

    // Listen for notification summary (sent on connect)
    const summaryHandler = onNotificationSummary ? (summary: any) => {
      console.log('Received notification summary:', summary)
      onNotificationSummary(summary)
    } : undefined

    if (notificationHandler) {
      socket.on('notification', notificationHandler)
    }

    if (summaryHandler) {
      socket.on('notification_summary', summaryHandler)
    }

    socketRef.current = socket

    // Cleanup on unmount or dependency change
    return () => {
      if (socketRef.current) {
        // Remove event listeners
        if (notificationHandler) {
          socketRef.current.off('notification', notificationHandler)
        }
        if (summaryHandler) {
          socketRef.current.off('notification_summary', summaryHandler)
        }
        // Disconnect socket
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [token, onNotification, onNotificationSummary])

  return socketRef.current
}
