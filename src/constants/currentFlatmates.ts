/** Standardized values for “current flatmates” — no free-text entry. */
export const CURRENT_FLATMATES_OPTIONS = ['0', '1', '2', '3', '4', '5', '6'] as const
export type CurrentFlatmatesValue = (typeof CURRENT_FLATMATES_OPTIONS)[number]
