import axios from 'axios'
import { VibeTagId } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const retryOnThrottle = async <T>(fn: () => Promise<T>, retries = 2, delayMs = 800): Promise<T> => {
  try {
    return await fn()
  } catch (error: any) {
    if (error?.response?.status === 429 && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs))
      return retryOnThrottle(fn, retries - 1, delayMs * 2)
    }
    throw error
  }
}

let profileCache: UserProfile | null = null
let profileCacheAt = 0
let profileInFlight: Promise<UserProfile> | null = null
const PROFILE_CACHE_TTL = 30000
const REQUESTS_CACHE_TTL = 5000
const requestsCache = new Map<string, { data: any; at: number }>()
const requestsInFlight = new Map<string, Promise<any>>()

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mokogo-access-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Remove Content-Type for FormData - browser will set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const requestUrl = (error.config?.url as string) || ''
    const isAuthEndpoint =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/signup') ||
      requestUrl.includes('/auth/forgot-password') ||
      requestUrl.includes('/auth/reset-password') ||
      requestUrl.includes('/auth/google') ||
      requestUrl.includes('/auth/refresh')

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401) {
      if (isAuthEndpoint) {
        return Promise.reject(error)
      }
      const refreshToken = localStorage.getItem('mokogo-refresh-token')
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          })
          const { accessToken, refreshToken: newRefreshToken } = response.data
          localStorage.setItem('mokogo-access-token', accessToken)
          if (newRefreshToken) {
            localStorage.setItem('mokogo-refresh-token', newRefreshToken)
          }
          error.config.headers.Authorization = `Bearer ${accessToken}`
          return api.request(error.config)
        } catch (refreshError) {
          localStorage.removeItem('mokogo-access-token')
          localStorage.removeItem('mokogo-refresh-token')
          window.location.href = '/auth'
        }
      } else {
        localStorage.removeItem('mokogo-access-token')
        localStorage.removeItem('mokogo-refresh-token')
        window.location.href = '/auth'
      }
    }
    
    // Handle 413 Payload Too Large (from nginx or backend)
    // Nginx might return 413 without a proper JSON body, so normalize it
    if (error.response?.status === 413) {
      // If response data is empty or HTML (nginx default error page), provide user-friendly message
      if (!error.response.data || 
          (typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE')) ||
          (typeof error.response.data === 'string' && error.response.data.includes('<html>'))) {
        error.response.data = {
          message: 'File size is too large. Please upload files smaller than 5MB each. If the problem persists, the server may have size restrictions.',
          error: 'Payload Too Large'
        }
      }
    }
    
    return Promise.reject(error)
  }
)

export interface SignupRequest {
  name: string
  email: string
  phoneNumber?: string
  password: string
  termsAccepted: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken?: string
  user: {
    id: string
    email: string
    name?: string
    roles: string[]
    savedListings?: string[]
  }
}

export interface SignupResponse {
  message: string
  userId: string
  email: string
  name: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

export interface ResetPasswordResponse {
  message: string
}

export const authApi = {
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await api.post<SignupResponse>('/auth/signup', data)
    return response.data
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
    localStorage.removeItem('mokogo-access-token')
    localStorage.removeItem('mokogo-refresh-token')
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    const response = await api.post<ForgotPasswordResponse>('/auth/forgot-password', data)
    return response.data
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const response = await api.post<ResetPasswordResponse>('/auth/reset-password', data)
    return response.data
  },

  getGoogleAuthUrl: async (): Promise<{ url: string }> => {
    const response = await api.get<{ url: string }>('/auth/google/url')
    return response.data
  },

  googleCallback: async (code: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/google/callback', {
      code,
    })
    return response.data
  },
}

export const usersApi = {
  getSavedListings: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/users/saved-listings')
    return response.data || []
  },
  saveListing: async (listingId: string): Promise<string[]> => {
    const response = await api.post<string[]>(`/users/saved-listings/${listingId}`)
    return response.data || []
  },
  removeSavedListing: async (listingId: string): Promise<string[]> => {
    const response = await api.delete<string[]>(`/users/saved-listings/${listingId}`)
    return response.data || []
  },
  getMyProfile: async (): Promise<UserProfile> => {
    const now = Date.now()
    if (profileCache && now - profileCacheAt < PROFILE_CACHE_TTL) {
      return profileCache
    }
    if (profileInFlight) {
      return profileInFlight
    }

    profileInFlight = retryOnThrottle(async () => {
      const response = await api.get<UserProfile>('/users/profile/me')
      return response.data
    })

    try {
      const data = await profileInFlight
      profileCache = data
      profileCacheAt = Date.now()
      return data
    } finally {
      profileInFlight = null
    }
  },
  updateMyProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await retryOnThrottle(async () => {
      const res = await api.patch<UserProfile>('/users/profile/me', data)
      return res
    })
    profileCache = response.data
    profileCacheAt = Date.now()
    return response.data
  },
  updateMyProfileImage: async (profileImageUrl: string): Promise<UserProfile> => {
    const response = await retryOnThrottle(async () => {
      const res = await api.patch<UserProfile>('/users/profile/profile-image', { profileImageUrl })
      return res
    })
    profileCache = response.data
    profileCacheAt = Date.now()
    return response.data
  },

  getUserById: async (userId: string): Promise<UserProfile> => {
    const response = await api.get<UserProfile>(`/users/${userId}`)
    return response.data
  },
  createUser: async (data: CreateUserRequest): Promise<UserProfile> => {
    return retryOnThrottle(async () => {
      const response = await api.post<UserProfile>('/users', data)
      return response.data
    })
  },
}

// Listing API interfaces
export interface CreateListingRequest {
  title?: string
  city?: string
  locality?: string
  placeId?: string
  latitude?: number
  longitude?: number
  formattedAddress?: string
  societyName?: string
  bhkType?: string
  roomType?: string
  rent?: number
  deposit?: number
  moveInDate?: string
  furnishingLevel?: string
  bathroomType?: string
  flatAmenities?: string[]
  societyAmenities?: string[]
  preferredGender?: string
  foodPreference?: string
  petPolicy?: string
  smokingPolicy?: string
  drinkingPolicy?: string
  description?: string
  photos?: string[]
  mikoTags?: VibeTagId[]
  status?: 'draft' | 'live' | 'archived' | 'fulfilled'
  lgbtqFriendly?: boolean
}

export interface UpdateListingRequest extends Partial<CreateListingRequest> {}

export interface ListingResponse {
  _id: string
  id: string
  title: string
  ownerId: string
  city: string
  locality: string
  placeId?: string
  latitude?: number
  longitude?: number
  formattedAddress?: string
  societyName?: string
  buildingType?: string
  bhkType: string
  roomType: string
  rent: number
  deposit: number
  moveInDate: string
  furnishingLevel: string
  bathroomType?: string
  flatAmenities: string[]
  societyAmenities: string[]
  preferredGender: string
  foodPreference?: string
  petPolicy?: string
  smokingPolicy?: string
  drinkingPolicy?: string
  description?: string
  photos: string[]
  mikoTags?: VibeTagId[]
  status: 'draft' | 'live' | 'archived' | 'fulfilled'
  listingVersion?: number
  createdAt: string
  updatedAt: string
  lgbtqFriendly?: boolean
}

export const listingsApi = {
  // Retry helper for 429 throttling
  retryOnThrottle: async <T>(fn: () => Promise<T>, retries = 2, delayMs = 800): Promise<T> => {
    try {
      return await fn()
    } catch (error: any) {
      if (error?.response?.status === 429 && retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
        return listingsApi.retryOnThrottle(fn, retries - 1, delayMs * 2)
      }
      throw error
    }
  },

  create: async (data: CreateListingRequest): Promise<ListingResponse> => {
    return listingsApi.retryOnThrottle(async () => {
      const response = await api.post<ListingResponse>('/listings', data)
      return response.data
    })
  },

  getAll: async (status?: string): Promise<ListingResponse[]> => {
    const params = status ? { status } : {}
    try {
      const response = await api.get<ListingResponse[]>('/listings', { 
        params,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      })
      console.log('API response status:', response.status)
      console.log('API response data:', response.data)
      console.log('API response data type:', Array.isArray(response.data) ? 'array' : typeof response.data)
      return response.data || []
    } catch (error: any) {
      console.error('Error in getAll API call:', error)
      console.error('Error response:', error.response?.data)
      throw error
    }
  },

  getAllPublic: async (
    status?: string,
    filters?: {
      city?: string
      area?: string
      areaLat?: number
      areaLng?: number
      maxRent?: number
      minRent?: number
      moveInDate?: string
      roomType?: string
      roomTypes?: string[]
      bhkTypes?: string[]
      furnishingLevels?: string[]
      bathroomTypes?: string[]
      preferredGender?: string
      lgbtqFriendly?: boolean
      radiusKm?: number
    }
  ): Promise<ListingResponse[]> => {
    const searchParams = new URLSearchParams()
    if (status) searchParams.set('status', status)
    if (filters) {
      if (filters.city) searchParams.set('city', filters.city)
      if (filters.area) searchParams.set('area', filters.area)
      if (filters.areaLat != null) searchParams.set('areaLat', String(filters.areaLat))
      if (filters.areaLng != null) searchParams.set('areaLng', String(filters.areaLng))
      if (filters.maxRent != null) searchParams.set('maxRent', String(filters.maxRent))
      if (filters.minRent != null) searchParams.set('minRent', String(filters.minRent))
      if (filters.moveInDate) searchParams.set('moveInDate', filters.moveInDate)
      if (filters.roomType) searchParams.set('roomType', filters.roomType)
      if (filters.roomTypes && filters.roomTypes.length > 0) {
        filters.roomTypes.forEach(value => searchParams.append('roomTypes', value))
      }
      if (filters.bhkTypes && filters.bhkTypes.length > 0) {
        filters.bhkTypes.forEach(value => searchParams.append('bhkTypes', value))
      }
      if (filters.furnishingLevels && filters.furnishingLevels.length > 0) {
        filters.furnishingLevels.forEach(value => searchParams.append('furnishingLevels', value))
      }
      if (filters.bathroomTypes && filters.bathroomTypes.length > 0) {
        filters.bathroomTypes.forEach(value => searchParams.append('bathroomTypes', value))
      }
      if (filters.preferredGender) searchParams.set('preferredGender', filters.preferredGender)
      if (filters.lgbtqFriendly) searchParams.set('lgbtqFriendly', 'true')
      if (filters.radiusKm != null) searchParams.set('radiusKm', String(filters.radiusKm))
    }
    try {
      // Use api instance to include auth token if user is logged in (for block filtering)
      const url = `/listings/public${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
      const response = await api.get<ListingResponse[]>(url, { timeout: 10000 })
      return response.data || []
    } catch (error: any) {
      console.error('Error in getAllPublic API call:', error)
      console.error('Error response:', error.response?.data)
      throw error
    }
  },

  getById: async (id: string): Promise<ListingResponse> => {
    const response = await api.get<ListingResponse>(`/listings/${id}`)
    return response.data
  },

  getByIdPublic: async (id: string): Promise<ListingResponse> => {
    // Use api instance to include auth token if user is logged in (for block filtering)
    // Try /listings/public/:id first, if that doesn't work, use /listings/public with filter
    const url = `/listings/public/${id}`
    console.log('getByIdPublic: Calling URL:', url)
    
    try {
      const response = await api.get<ListingResponse>(url, { timeout: 10000 })
      console.log('getByIdPublic: Success from /listings/public/:id')
      return response.data
    } catch (error: any) {
      // If /listings/public/:id doesn't exist (404), try using /listings/public with status filter
      if (error?.response?.status === 404) {
        console.log('getByIdPublic: /listings/public/:id not found, trying /listings/public?status=live')
        const publicUrl = `/listings/public?status=live`
        console.log('getByIdPublic: Calling URL:', publicUrl)
        
        const publicResponse = await api.get<ListingResponse[]>(publicUrl, { timeout: 10000 })
        const listings = publicResponse.data || []
        const listing = listings.find((l: ListingResponse) => (l._id || l.id) === id)
        
        if (listing) {
          console.log('getByIdPublic: Found listing in public listings array')
          return listing
        } else {
          console.error('getByIdPublic: Listing not found in public listings')
          throw new Error('Listing not found in public listings')
        }
      }
      // Re-throw other errors
      console.error('getByIdPublic: Error:', error?.response?.status, error?.response?.data)
      throw error
    }
  },

  update: async (id: string, data: UpdateListingRequest): Promise<ListingResponse> => {
    return listingsApi.retryOnThrottle(async () => {
      const response = await api.patch<ListingResponse>(`/listings/${id}`, data)
      return response.data
    })
  },

  markAsFulfilled: async (id: string): Promise<ListingResponse> => {
    return listingsApi.retryOnThrottle(async () => {
      const response = await api.post<ListingResponse>(`/listings/${id}/fulfill`)
      return response.data
    })
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/listings/${id}`)
  },
}

export const uploadApi = {
  uploadPhotos: async (files: File[]): Promise<string[]> => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    // Use api instance to get automatic token handling and refresh
    // The interceptor will automatically remove Content-Type for FormData
    const response = await api.post<{ urls: string[] }>(
      '/upload/photos',
      formData
    )
    return response.data.urls
  },

  uploadProfileImage: async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post<{ url: string }>(
      '/upload/profile-image',
      formData
    )
    return response.data.url
  },
}

export interface UserProfile {
  _id: string
  name: string
  email: string
  phoneNumber?: string
  profileImageUrl?: string
  dateOfBirth?: string
  gender?: string
  occupation?: string
  companyName?: string
  currentCity?: string
  area?: string
  about?: string
  smoking?: string
  drinking?: string
  foodPreference?: string
  messagingRestricted?: boolean
}

export interface UpdateProfileRequest {
  name?: string
  phoneNumber?: string
  profileImageUrl?: string
  dateOfBirth?: string
  gender?: string
  occupation?: string
  companyName?: string
  currentCity?: string
  area?: string
  about?: string
  smoking?: string
  drinking?: string
  foodPreference?: string
}

export interface CreateUserRequest {
  name: string
  email: string
  phoneNumber?: string
  password: string
}

// Request API interfaces
export interface CreateRequestRequest {
  listingId: string
  message?: string
  moveInDate?: string
}

export interface RequestResponse {
  _id: string
  id: string
  listingId: string | { _id: string; title: string; city: string; locality: string; photos?: string[] }
  ownerId: string | { _id: string; name: string; email: string; profileImageUrl?: string }
  requesterId: string | { _id: string; name: string; email: string; profileImageUrl?: string }
  listingVersion?: number
  message?: string
  moveInDate?: string
  status: 'pending' | 'approved' | 'rejected'
  conversationId?: string
  createdAt: string
  updatedAt: string
}

export interface UpdateRequestRequest {
  status: 'pending' | 'approved' | 'rejected'
}

export const requestsApi = {
  create: async (data: CreateRequestRequest): Promise<RequestResponse> => {
    const response = await api.post<RequestResponse>('/requests', data)
    return response.data
  },

  getAllForOwner: async (status?: string): Promise<RequestResponse[]> => {
    const params = status ? { status } : {}
    const cacheKey = `owner:${status || 'all'}`
    const now = Date.now()
    const cached = requestsCache.get(cacheKey)
    if (cached && now - cached.at < REQUESTS_CACHE_TTL) {
      return cached.data
    }
    if (requestsInFlight.has(cacheKey)) {
      return requestsInFlight.get(cacheKey)!
    }
    const requestPromise = retryOnThrottle(async () => {
      const response = await api.get<RequestResponse[]>('/requests/owner', { params })
      return response.data || []
    })
    requestsInFlight.set(cacheKey, requestPromise)
    try {
      const data = await requestPromise
      requestsCache.set(cacheKey, { data, at: Date.now() })
      return data
    } finally {
      requestsInFlight.delete(cacheKey)
    }
  },

  getAllForRequester: async (status?: string): Promise<RequestResponse[]> => {
    const params = status ? { status } : {}
    const cacheKey = `requester:${status || 'all'}`
    const now = Date.now()
    const cached = requestsCache.get(cacheKey)
    if (cached && now - cached.at < REQUESTS_CACHE_TTL) {
      return cached.data
    }
    if (requestsInFlight.has(cacheKey)) {
      return requestsInFlight.get(cacheKey)!
    }
    const requestPromise = retryOnThrottle(async () => {
      const response = await api.get<RequestResponse[]>('/requests/requester', { params })
      return response.data || []
    })
    requestsInFlight.set(cacheKey, requestPromise)
    try {
      const data = await requestPromise
      requestsCache.set(cacheKey, { data, at: Date.now() })
      return data
    } finally {
      requestsInFlight.delete(cacheKey)
    }
  },

  getById: async (id: string): Promise<RequestResponse> => {
    const response = await api.get<RequestResponse>(`/requests/${id}`)
    return response.data
  },

  getStatusByListing: async (listingId: string): Promise<RequestResponse | null> => {
    try {
      const response = await api.get<RequestResponse>(`/requests/status/${listingId}`)
      return response.data
    } catch (error: any) {
      // If 404 or no request exists, return null
      if (error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  update: async (id: string, data: UpdateRequestRequest): Promise<RequestResponse> => {
    const response = await api.patch<RequestResponse>(`/requests/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/requests/${id}`)
  },
}

// Message API interfaces
export interface ConversationResponse {
  _id: string
  id: string
  user1Id: string | { _id: string; name: string; email: string; profileImageUrl?: string; messagingRestricted?: boolean }
  user2Id: string | { _id: string; name: string; email: string; profileImageUrl?: string; messagingRestricted?: boolean }
  listingId: string | { _id: string; title: string; city: string; locality: string; photos?: string[] }
  lastMessageId?: string | MessageResponse
  lastMessageAt: string
  createdAt: string
  updatedAt: string
  unreadCount?: number
  isDisabled?: boolean
}

export interface MessageResponse {
  _id: string
  id: string
  conversationId: string
  senderId: string | { _id: string; name: string; email: string; profileImageUrl?: string }
  text: string
  isRead?: boolean
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateMessageRequest {
  conversationId: string
  text: string
}

export const messagesApi = {
  getAllConversations: async (archived?: boolean, blocked?: boolean): Promise<ConversationResponse[]> => {
    const params = new URLSearchParams()
    if (archived !== undefined) params.append('archived', String(archived))
    if (blocked !== undefined) params.append('blocked', String(blocked))
    const queryParams = params.toString() ? `?${params.toString()}` : ''
    const response = await api.get<ConversationResponse[]>(`/messages/conversations${queryParams}`)
    return response.data || []
  },

  getConversationById: async (id: string): Promise<ConversationResponse> => {
    const response = await api.get<ConversationResponse>(`/messages/conversations/${id}`)
    return response.data
  },

  getMessages: async (conversationId: string): Promise<MessageResponse[]> => {
    const response = await api.get<MessageResponse[]>(`/messages/conversations/${conversationId}/messages`)
    return response.data || []
  },

  sendMessage: async (conversationId: string, text: string): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>(`/messages/conversations/${conversationId}/messages`, {
      conversationId,
      text,
    })
    return response.data
  },

  clearMessages: async (conversationId: string): Promise<void> => {
    await api.delete(`/messages/conversations/${conversationId}/messages`)
  },

  deleteConversation: async (conversationId: string): Promise<void> => {
    await api.delete(`/messages/conversations/${conversationId}`)
  },

  getOnlineUsers: async (): Promise<string[]> => {
    const response = await api.get<{ onlineUsers: string[] }>('/messages/online-users')
    return response.data.onlineUsers || []
  },

  archiveConversation: async (conversationId: string): Promise<void> => {
    await api.post(`/messages/conversations/${conversationId}/archive`)
  },

  unarchiveConversation: async (conversationId: string): Promise<void> => {
    await api.post(`/messages/conversations/${conversationId}/unarchive`)
  },
}

export interface SubscribeRequest {
  email: string
}

export interface SubscribeResponse {
  message: string
}

export interface NotificationResponse {
  _id: string
  id: string
  userId: string
  actorId?: {
    _id: string
    name: string
    email: string
    profileImageUrl?: string
  }
  type: string
  title: string
  body: string
  data: Record<string, any>
  read: boolean
  createdAt: string
  updatedAt: string
}

export interface ListNotificationsResponse {
  notifications: NotificationResponse[]
  total: number
  unreadCount: number
}

export interface MarkAllReadResponse {
  count: number
}

export const notificationsApi = {
  list: async (params?: { limit?: number; skip?: number; unreadOnly?: boolean }): Promise<ListNotificationsResponse> => {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.skip) queryParams.append('skip', params.skip.toString())
    if (params?.unreadOnly !== undefined) queryParams.append('unreadOnly', params.unreadOnly.toString())
    
    const response = await api.get<ListNotificationsResponse>(`/notifications?${queryParams.toString()}`)
    return response.data
  },

  markAsRead: async (notificationId: string): Promise<NotificationResponse> => {
    const response = await api.post<NotificationResponse>(`/notifications/${notificationId}/mark-read`)
    return response.data
  },

  markAllRead: async (): Promise<MarkAllReadResponse> => {
    const response = await api.post<MarkAllReadResponse>('/notifications/mark-all-read')
    return response.data
  },
}

export enum ReportReason {
  SPAM_SCAM = 'spam_scam',
  HARASSMENT = 'harassment',
  FAKE_LISTING = 'fake_listing',
  INAPPROPRIATE_CONTENT = 'inappropriate_content',
  ASKING_MONEY_OUTSIDE = 'asking_money_outside',
  DISCRIMINATION = 'discrimination',
  OTHER = 'other',
}

export interface CreateReportRequest {
  reportedUserId: string
  listingId?: string
  conversationId?: string
  reasonCode: ReportReason
  description?: string
}

export type ReportStatus = 'new' | 'under_review' | 'resolved' | 'escalated'

export interface ReportResponse {
  _id: string
  id: string
  reporterUserId: string
  reportedUserId: string
  listingId?: string
  conversationId?: string
  reasonCode: ReportReason
  description?: string
  severity: string
  reviewed: boolean
  reportStatus?: ReportStatus
  adminNotes?: string
  createdAt: string
  updatedAt: string
}

export interface ReportResponseWithDetails extends Omit<ReportResponse, 'reporterUserId' | 'reportedUserId' | 'listingId'> {
  reporterUserId?: {
    _id: string
    name: string
    email: string
  }
  reportedUserId?: {
    _id: string
    name: string
    email: string
  }
  listingId?: {
    _id: string
    title: string
  }
}

export const reportsApi = {
  create: async (data: CreateReportRequest): Promise<ReportResponse> => {
    const response = await api.post<ReportResponse>('/reports', data)
    return response.data
  },

  getAll: async (userId?: string, reportedUserId?: string): Promise<ReportResponseWithDetails[]> => {
    const queryParams = new URLSearchParams()
    if (userId) queryParams.append('userId', userId)
    if (reportedUserId) queryParams.append('reportedUserId', reportedUserId)
    const queryString = queryParams.toString()
    const response = await api.get<ReportResponseWithDetails[]>(`/reports${queryString ? `?${queryString}` : ''}`)
    return response.data
  },

  getById: async (id: string): Promise<ReportResponseWithDetails> => {
    const response = await api.get<ReportResponseWithDetails>(`/reports/${id}`)
    return response.data
  },
}

export interface AdminStatsActiveListersResponse {
  activeListers: number
}

export interface AdminStatsActiveSeekersResponse {
  activeSeekers: number
}

export const adminApi = {
  getActiveListersCount: async (): Promise<number> => {
    const response = await api.get<AdminStatsActiveListersResponse>('/admin/stats/active-listers')
    return response.data.activeListers
  },

  getActiveSeekersCount: async (): Promise<number> => {
    const response = await api.get<AdminStatsActiveSeekersResponse>('/admin/stats/active-seekers')
    return response.data.activeSeekers
  },

  getLiveListingsCount: async (): Promise<number> => {
    const response = await api.get<{ liveListings: number }>('/admin/stats/live-listings')
    return response.data.liveListings
  },

  getRequestsSentCount: async (days?: number): Promise<number> => {
    const params = days != null ? `?days=${days}` : ''
    const response = await api.get<{ requestsSent: number }>(`/admin/stats/requests-sent${params}`)
    return response.data.requestsSent
  },

  getSuccessfulConnectionsCount: async (days?: number): Promise<number> => {
    const params = days != null ? `?days=${days}` : ''
    const response = await api.get<{ successfulConnections: number }>(`/admin/stats/successful-connections${params}`)
    return response.data.successfulConnections
  },

  getMedianTimeToFulfillment: async (): Promise<number | null> => {
    const response = await api.get<{ medianDays: number | null }>('/admin/stats/median-time-to-fulfillment')
    return response.data.medianDays
  },

  getListingsFulfilledStats: async (): Promise<{ fulfilled: number; total: number }> => {
    const response = await api.get<{ fulfilled: number; total: number }>('/admin/stats/listings-fulfilled')
    return response.data
  },

  getListingsRejectedCount: async (): Promise<number> => {
    const response = await api.get<{ rejected: number }>('/admin/stats/listings-rejected')
    return response.data.rejected
  },

  getTotalUsersCount: async (): Promise<number> => {
    const response = await api.get<{ total: number }>('/admin/stats/total-users')
    return response.data.total
  },

  getListingsCreatedCount: async (days?: number): Promise<number> => {
    const params = days != null ? `?days=${days}` : ''
    const response = await api.get<{ count: number }>(`/admin/stats/listings-created${params}`)
    return response.data.count
  },

  getListingsApprovedCount: async (days?: number): Promise<number> => {
    const params = days != null ? `?days=${days}` : ''
    const response = await api.get<{ count: number }>(`/admin/stats/listings-approved${params}`)
    return response.data.count
  },

  getListingsByCity: async (): Promise<ListingsByCityItem[]> => {
    const response = await api.get<ListingsByCityItem[]>('/admin/stats/listings-by-city')
    return response.data
  },

  getActiveListingsByArea: async (): Promise<ActiveListingsByAreaItem[]> => {
    const response = await api.get<ActiveListingsByAreaItem[]>('/admin/stats/active-listings-by-area')
    return response.data
  },

  getReportedUsersCount: async (): Promise<number> => {
    const response = await api.get<{ count: number }>('/admin/stats/reported-users-count')
    return response.data.count
  },

  getBlockedUsersCount: async (): Promise<number> => {
    const response = await api.get<{ count: number }>('/admin/stats/blocked-users-count')
    return response.data.count
  },

  getMaleUsersCount: async (): Promise<number> => {
    const response = await api.get<{ count: number }>('/admin/stats/male-users-count')
    return response.data.count
  },

  getFemaleUsersCount: async (): Promise<number> => {
    const response = await api.get<{ count: number }>('/admin/stats/female-users-count')
    return response.data.count
  },

  getCompletedProfilesCount: async (): Promise<number> => {
    const response = await api.get<{ count: number }>('/admin/stats/completed-profiles-count')
    return response.data.count
  },

  // Listing tab (admin)
  getListingTabTopBar: async (): Promise<{ pendingReviewCount: number; changesRequestedCount: number; avgApprovalTimeHrs: number | null }> => {
    const response = await api.get('/admin/listing-tab/top-bar')
    return response.data
  },
  getListingTabModerationEfficiency: async (): Promise<{
    avgApprovalTimeHrs: number | null
    listingsPendingOver24h: number
    approvalRatePct: number | null
    pctNeedingRevision: number | null
  }> => {
    const response = await api.get('/admin/listing-tab/moderation-efficiency')
    return response.data
  },
  getListingTabQualityMetrics: async (): Promise<{
    pctReportedAfterApproval: number | null
    pctZeroInquiriesAfter14d: number | null
    avgPhotosPerListing: number | null
    pctCompleteDetails: number | null
  }> => {
    const response = await api.get('/admin/listing-tab/quality-metrics')
    return response.data
  },
  getListingTabMarketplaceHealth: async (): Promise<{
    activeWithAtLeastOneRequest: number
    listingToInquiryRatio: number | null
    pctStaleListings: number | null
    areaWiseDemand: { area: string; activeListings: number; listingsWithRequest: number }[]
  }> => {
    const response = await api.get('/admin/listing-tab/marketplace-health')
    return response.data
  },
  getListingsForAdmin: async (params: { status?: string; page?: number; limit?: number }): Promise<{ listings: AdminListingItem[]; total: number }> => {
    const searchParams = new URLSearchParams()
    if (params.status) searchParams.set('status', params.status)
    if (params.page != null) searchParams.set('page', String(params.page))
    if (params.limit != null) searchParams.set('limit', String(params.limit))
    const response = await api.get(`/admin/listings?${searchParams.toString()}`)
    return response.data
  },
  updateListingStatus: async (
    listingId: string,
    action: 'approve' | 'request_changes' | 'archive' | 'remove',
    payload?: { category?: string; feedback?: string; archiveReason?: string; removalReasons?: string[] }
  ): Promise<void> => {
    await api.patch(`/admin/listings/${listingId}/status`, { action, ...payload })
  },

  // Admin Users tab
  getUsersForAdmin: async (params: { search?: string; status?: string; page?: number; limit?: number }): Promise<{ users: AdminUserItem[]; total: number }> => {
    const searchParams = new URLSearchParams()
    if (params.search) searchParams.set('search', params.search)
    if (params.status) searchParams.set('status', params.status)
    if (params.page != null) searchParams.set('page', String(params.page))
    if (params.limit != null) searchParams.set('limit', String(params.limit))
    const response = await api.get(`/admin/users?${searchParams.toString()}`)
    return response.data
  },
  getUserProfileForAdmin: async (userId: string): Promise<AdminUserProfile> => {
    const response = await api.get(`/admin/users/${userId}`)
    return response.data
  },
  updateUserStatus: async (userId: string, status: 'ACTIVE' | 'PAUSED' | 'SUSPENDED'): Promise<void> => {
    await api.patch(`/admin/users/${userId}/status`, { status })
  },

  reportAction: async (reportId: string, action: 'review' | 'pause_account' | 'suspend_account' | 'mark_resolved', internalNote: string): Promise<void> => {
    await api.patch(`/admin/reports/${reportId}/action`, { action, internalNote })
  },
}

export interface AdminUserItem {
  _id: string
  name: string
  email: string
  phoneNumber?: string
  gender?: string
  currentCity?: string
  area?: string
  createdAt: string
  status: string
  reportCount: number
}

export interface AdminUserProfile extends AdminUserItem {
  profileImageUrl?: string
  dateOfBirth?: string
  occupation?: string
  companyName?: string
  about?: string
  smoking?: string
  drinking?: string
  foodPreference?: string
  listingsCreated: number
  requestsSent: number
  requestsAccepted: number
}

export interface AdminListingItem {
  _id: string
  title: string
  city?: string
  locality?: string
  rent?: number
  photos: string[]
  status: string
  ownerId: { _id: string; name?: string; email?: string }
  createdAt: string
  adminApprovedAt?: string
}

export interface ListingsByCityItem {
  city: string
  activeListings: number
  listingsCreatedLast7Days: number
  listingsFulfilledLast30Days: number
  listingsWithZeroRequests: number
}

export interface ActiveListingsByAreaItem {
  area: string
  activeListings: number
}

export interface CreateBlockRequest {
  blockedUserId: string
}

export interface BlockResponse {
  _id: string
  id: string
  blockerId: string
  blockedId: string
  createdAt: string
  updatedAt: string
}

export interface BlockedUsersResponse {
  blockedUserIds: string[]
}

export interface CheckBlockResponse {
  isBlocked: boolean
}

export const blocksApi = {
  block: async (data: CreateBlockRequest): Promise<BlockResponse> => {
    const response = await api.post<BlockResponse>('/blocks', data)
    return response.data
  },

  unblock: async (blockedUserId: string): Promise<void> => {
    await api.delete(`/blocks/${blockedUserId}`)
  },

  getBlockedUsers: async (): Promise<string[]> => {
    const response = await api.get<BlockedUsersResponse>('/blocks/blocked')
    return response.data.blockedUserIds
  },

  checkBlock: async (userId: string): Promise<boolean> => {
    const response = await api.get<CheckBlockResponse>(`/blocks/check/${userId}`)
    return response.data.isBlocked
  },

  getAllBlockedUserIds: async (): Promise<string[]> => {
    try {
      const response = await api.get<BlockedUsersResponse>('/blocks/all-blocked')
      return response.data.blockedUserIds
    } catch (error) {
      console.error('Error fetching all blocked user IDs:', error)
      return []
    }
  },
}

export const subscriptionsApi = {
  subscribe: async (data: SubscribeRequest): Promise<SubscribeResponse> => {
    const response = await api.post<SubscribeResponse>('/subscriptions', data)
    return response.data
  },
}

// Places API interfaces
export interface AutocompletePrediction {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

export interface PlaceDetails {
  place_id: string
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  address_components: Array<{
    long_name: string
    short_name: string
    types: string[]
  }>
  name: string
}

export const placesApi = {
  getAutocomplete: async (input: string, city: string): Promise<AutocompletePrediction[]> => {
    if (!input || input.trim().length < 2 || !city) {
      return []
    }
    const response = await api.get<AutocompletePrediction[]>('/places/autocomplete', {
      params: { input: input.trim(), city: city.trim() },
    })
    return response.data || []
  },

  getPlaceDetails: async (placeId: string): Promise<PlaceDetails> => {
    const response = await api.get<PlaceDetails>('/places/details', {
      params: { place_id: placeId },
    })
    return response.data
  },
}

export default api

