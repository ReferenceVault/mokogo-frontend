/**
 * Shared helpers for lister contact fields (Preview + Concierge) aligned with user Profile phone rules.
 */

/** Indian mobile: exactly 10 digits, first digit 6–9 (same as ProfileContent). */
export function isValidIndianMobile10Digits(input: string): boolean {
  const digits = (input || '').replace(/\D/g, '')
  return /^[6-9]\d{9}$/.test(digits)
}

/** Keep only digits, max 10 (for controlled tel input). */
export function sanitizeIndianMobileInput(raw: string): string {
  return (raw || '').replace(/\D/g, '').slice(0, 10)
}

export const INDIAN_MOBILE_HINT =
  'Enter a valid 10-digit Indian mobile number (starts with 6–9).'

export function splitFullName(full: string): { first: string; last: string } {
  const t = (full || '').trim()
  if (!t) return { first: '', last: '' }
  const parts = t.split(/\s+/)
  return {
    first: parts[0] || '',
    last: parts.slice(1).join(' ') || '',
  }
}

export function joinFullName(first: string, last: string): string {
  return `${(first || '').trim()} ${(last || '').trim()}`.trim()
}
