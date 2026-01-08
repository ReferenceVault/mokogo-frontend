// Google Analytics utility
// Only loads and tracks if user has consented to analytics cookies

const GA_MEASUREMENT_ID = 'G-0SV39SG3DG'

// Check if analytics consent is given
export const hasAnalyticsConsent = (): boolean => {
  if (typeof window === 'undefined') return false
  
  const consent = localStorage.getItem('mokogo_cookie_consent')
  if (!consent) return false
  
  try {
    const consentData = JSON.parse(consent)
    return consentData.analytics === true
  } catch {
    return false
  }
}

// Initialize dataLayer and gtag function (matches Google's standard implementation)
const initGtagFunction = (): void => {
  if (typeof window === 'undefined') return
  
  // Initialize dataLayer if not already done
  window.dataLayer = window.dataLayer || []
  
  // Initialize gtag function if not already done (matches Google's standard pattern)
  if (typeof window.gtag !== 'function') {
    function gtag(...args: any[]) {
      // Push arguments array to dataLayer (matches Google's pattern: dataLayer.push(arguments))
      window.dataLayer.push(args)
    }
    window.gtag = gtag
  }
}

// Load Google Analytics script and initialize (matches Google's standard implementation)
export const loadGAScript = (): void => {
  if (typeof window === 'undefined') return
  if (!hasAnalyticsConsent()) return
  
  // Check if already initialized
  const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)
  if (existingScript && typeof window.gtag === 'function') {
    // Already loaded and initialized
    return
  }

  // Step 1: Initialize dataLayer and gtag function (matches Google's inline script)
  initGtagFunction()

  // Step 2: Call gtag commands immediately (they'll be processed when script loads)
  if (window.gtag) {
    window.gtag('js', new Date())
    window.gtag('config', GA_MEASUREMENT_ID)
    console.log('[GA] Initialized Google Analytics:', GA_MEASUREMENT_ID)
  }

  // Step 3: Load the async script (if not already loading/loaded)
  if (!existingScript) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    
    script.onload = () => {
      console.log('[GA] Script loaded successfully')
    }
    
    script.onerror = () => {
      console.error('[GA] Failed to load script')
    }
    
    document.head.appendChild(script)
    console.log('[GA] Loading Google Analytics script...')
  }
}

// Initialize Google Analytics (for backward compatibility)
export const initGA = (): void => {
  loadGAScript()
}

// Track page view
export const trackPageView = (path: string): void => {
  if (!hasAnalyticsConsent()) {
    console.log('[GA] Page view not tracked - no consent:', path)
    return
  }
  if (!window.gtag) {
    loadGAScript()
    return
  }
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
  })
  console.log('[GA] Page view tracked:', path)
}

// Track custom event
export const trackEvent = (eventName: string, eventParams?: Record<string, any>): void => {
  if (!hasAnalyticsConsent()) {
    console.log('[GA] Event not tracked - no consent:', eventName)
    return
  }
  if (!window.gtag) {
    loadGAScript()
    return
  }
  
  window.gtag('event', eventName, eventParams)
  console.log('[GA] Event tracked:', eventName, eventParams)
}

// Declare gtag types for TypeScript
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

