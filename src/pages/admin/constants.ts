/**
 * Admin dashboard constants — single place for page sizes, view ids, and magic numbers.
 */

export const ADMIN_VIEW_IDS = [
  'overview',
  'users',
  'listings',
  'requests',
  'reports',
  'settings',
] as const

export type AdminViewId = (typeof ADMIN_VIEW_IDS)[number]

export const ADMIN_USERS_PAGE_SIZE = 6
export const ADMIN_LISTINGS_PAGE_SIZE = 12
export const ADMIN_SEARCH_DEBOUNCE_MS = 400
export const ADMIN_ADD_USER_SUCCESS_CLOSE_MS = 1200
