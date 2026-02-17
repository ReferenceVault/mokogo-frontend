# Admin Dashboard — Code Quality & Production Readiness

## Changes Made

### 1. **Error handling & loading safety**
- **AdminOverviewTab**: Wrapped fetch in `try/catch/finally` so `setOverviewLoading(false)` always runs; added catch for unexpected errors with user-visible message.
- **AdminUsersTab**: Added `usersError` state; fetch and status-update failures show an amber banner with Retry. Uses constants for page size, debounce, and modal close delay.
- **AdminListingsTab**: Added `listingTabError` state; fetch and listing-action failures show an amber banner with Retry. Uses `ADMIN_LISTINGS_PAGE_SIZE` from constants.
- **AdminReportsTab**: Added `reportsError` state; fetch and report-action failures show an amber banner with Retry.

### 2. **Constants & typing**
- **`constants.ts`**: Centralized `ADMIN_VIEW_IDS`, `AdminViewId`, `ADMIN_USERS_PAGE_SIZE`, `ADMIN_LISTINGS_PAGE_SIZE`, `ADMIN_SEARCH_DEBOUNCE_MS`, `ADMIN_ADD_USER_SUCCESS_CLOSE_MS`.
- **AdminDashboard**: `activeView` typed as `AdminViewId`; fallback check uses `ADMIN_VIEW_IDS.includes(activeView)`; removed redundant `activeView === 'overview' ? 'overview' : 'overview'` (always `"overview"`).

### 3. **User-facing errors**
- All data-fetch and mutation failures in Users, Listings, and Reports tabs now surface a message (server message when available) and a Retry button instead of failing silently.

---

## Recommendations for Full Production Readiness

### Security & auth
- **Admin-only route**: Dashboard is behind generic `ProtectedRoute` (redirects to `/auth`). Consider an admin-specific guard that checks `user.roles?.includes('admin')` and redirects to `/admin/login` when not admin.
- **User/email in header**: `userName` and `userEmail` are hardcoded. Source them from auth/session (e.g. stored user after admin login) so the header reflects the logged-in admin.

### Accessibility
- Add `aria-label` to icon-only or context-dependent buttons (e.g. time period dropdown, pagination).
- Ensure modals trap focus and close on Escape; consider `aria-modal="true"` and `role="dialog"`.
- Tables: use `<th scope="col">` and optionally `scope="row"` for screen readers.

### Observability
- In production, consider replacing or complementing `console.error` with a logging/monitoring service (e.g. Sentry) for admin API failures.
- Optional: track admin actions (e.g. user status change, report action, listing approve/archive) for audit.

### Data & UX
- **Overview**: "Weekly Product Review - Week of Jan 27, 2025" is hardcoded; derive from selected time period or current date.
- **Settings tab**: Form inputs use `defaultValue` and are not wired to API; implement load/save and validation before treating as production-ready.
- **Export Report**: Button is present but has no implementation; add export (e.g. CSV/PDF) when needed.

### Performance
- Tabs mount/unmount on view switch; data refetches when revisiting. Consider keeping tab content mounted but hidden (e.g. `display: none`) if refetch cost is high, or add short-lived cache.
- Overview runs 18 requests in parallel; already uses `Promise.allSettled` so partial failure is handled. No change required unless you need to reduce concurrency.

### Testing
- Add unit tests for tab components (loading, error, empty, success).
- Add an E2E smoke test for admin login → dashboard → at least one tab (e.g. Overview or Users).

---

## File summary

| File | Purpose |
|------|---------|
| `constants.ts` | View IDs, page sizes, debounce, and other admin magic numbers |
| `AdminDashboard.tsx` | Layout, `activeView` state, tab routing; uses `AdminViewId` and `ADMIN_VIEW_IDS` |
| `tabs/AdminOverviewTab.tsx` | try/catch/finally for fetch; user-visible error + retry |
| `tabs/AdminUsersTab.tsx` | `usersError` + Retry; constants for page size, debounce, close delay |
| `tabs/AdminListingsTab.tsx` | `listingTabError` + Retry; `ADMIN_LISTINGS_PAGE_SIZE` |
| `tabs/AdminReportsTab.tsx` | `reportsError` + Retry |
