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

// Track if script is fully loaded and ready
let isGAScriptReady = false

// Load Google Analytics script and initialize (matches Google's standard implementation)
export const loadGAScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is undefined'))
      return
    }
    if (!hasAnalyticsConsent()) {
      reject(new Error('No analytics consent'))
      return
    }
    
    // Check if already initialized and ready
    if (isGAScriptReady && typeof window.gtag === 'function') {
      resolve()
      return
    }

    // Step 1: Initialize dataLayer FIRST (critical - must be before script)
    // This matches Google's exact pattern
    window.dataLayer = window.dataLayer || []
    
    // Step 2: Define gtag function BEFORE script loads (matches Google's exact pattern)
    // This ensures commands are queued in dataLayer before script processes them
    if (typeof window.gtag !== 'function') {
      // Use the exact pattern from Google's documentation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function gtag(...args: any[]) {
        // Push arguments directly to dataLayer (not as array)
        // This is how Google's implementation works
        window.dataLayer.push(args as never)
      }
      window.gtag = gtag
    }

    // Check if script is already in DOM
    const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)
    
    if (existingScript && existingScript.getAttribute('data-loaded') === 'true') {
      isGAScriptReady = true
      // Re-initialize config
      if (window.gtag) {
        window.gtag('js', new Date())
        window.gtag('config', GA_MEASUREMENT_ID)
      }
      resolve()
      return
    }

    if (existingScript) {
      // Script is loading, wait for it
      const checkInterval = setInterval(() => {
        if (existingScript.getAttribute('data-loaded') === 'true') {
          clearInterval(checkInterval)
          isGAScriptReady = true
          resolve()
        }
      }, 100)
      return
    }

    // Step 3: Load the async script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    
    script.onload = () => {
      script.setAttribute('data-loaded', 'true')
      
      // Wait for the real gtag.js to fully initialize
      // The script should have replaced our custom function by now
      setTimeout(() => {
        // The real gtag.js script should have loaded and processed dataLayer
        // Check if gtag exists and is the real one (not our custom function)
        if (window.gtag) {
          isGAScriptReady = true
          
          // Call config - the real gtag should send requests immediately
          // The real gtag.js should have already processed existing dataLayer
          // But we call config again to ensure it's properly initialized
          try {
            // Call js initialization (required by GA)
            window.gtag('js', new Date())
            
            // The real gtag.js script processes existing dataLayer automatically
            // But we need to call config explicitly to ensure it sends the initial page view
            window.gtag('config', GA_MEASUREMENT_ID, {
              send_page_view: true,
              page_path: window.location.pathname,
              page_location: window.location.href,
            })
            
            console.log('[GA] ✅ Script loaded and configured:', GA_MEASUREMENT_ID)
            console.log('[GA] DataLayer length:', window.dataLayer.length)
            console.log('[GA] Current URL:', window.location.href)
            
            // Verify gtag is the real function (should have been replaced by gtag.js)
            console.log('[GA] Gtag function:', typeof window.gtag === 'function' ? 'available' : 'missing')
            
            // Set up network monitoring
            setTimeout(() => {
              const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
              const collectRequests = resources.filter(r => 
                r.name.includes('/g/collect') || 
                r.name.includes('google-analytics.com/g/collect')
              )
              
              if (collectRequests.length > 0) {
                console.log('[GA] ✅ Found', collectRequests.length, 'data collection requests')
                collectRequests.forEach(req => {
                  console.log('[GA]   Request:', req.name.substring(0, 100) + '...')
                })
              } else {
                console.warn('[GA] ⚠️ No data collection requests yet. They should appear shortly.')
                console.warn('[GA] Check Network tab and filter by "collect"')
              }
            }, 1000)
            
            resolve()
          } catch (error) {
            console.error('[GA] ❌ Error configuring GA:', error)
            reject(error)
          }
        } else {
          console.error('[GA] ❌ Gtag function not found after script load')
          reject(new Error('Gtag function not available'))
        }
      }, 300) // Give the script time to fully execute
    }
    
    script.onerror = () => {
      console.error('[GA] ❌ Failed to load script')
      isGAScriptReady = false
      reject(new Error('Failed to load GA script'))
    }
    
    document.head.appendChild(script)
    console.log('[GA] Loading Google Analytics script...')
  })
}

// Initialize Google Analytics (for backward compatibility)
export const initGA = (): void => {
  loadGAScript().catch(err => {
    console.error('[GA] Initialization error:', err)
  })
}

// Track page view
export const trackPageView = (path: string): void => {
  if (!hasAnalyticsConsent()) {
    console.log('[GA] Page view not tracked - no consent:', path)
    return
  }
  
  // Ensure script is loaded first, then track
  if (!isGAScriptReady || !window.gtag) {
    loadGAScript()
      .then(() => {
        if (window.gtag) {
          window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: path,
            send_page_view: true,
          })
          console.log('[GA] ✅ Page view tracked:', path)
        }
      })
      .catch(err => {
        console.error('[GA] Failed to track page view:', err)
      })
    return
  }
  
  // Script is ready, track immediately
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    send_page_view: true,
  })
  console.log('[GA] ✅ Page view tracked:', path)
}

// Track custom event
export const trackEvent = (eventName: string, eventParams?: Record<string, any>): void => {
  if (!hasAnalyticsConsent()) {
    console.log('[GA] Event not tracked - no consent:', eventName)
    return
  }
  
  // Ensure script is loaded first, then track
  if (!isGAScriptReady || !window.gtag) {
    loadGAScript()
      .then(() => {
        if (window.gtag) {
          window.gtag('event', eventName, eventParams)
          console.log('[GA] ✅ Event tracked:', eventName, eventParams)
        }
      })
      .catch(err => {
        console.error('[GA] Failed to track event:', err)
      })
    return
  }
  
  // Script is ready, track immediately
  window.gtag('event', eventName, eventParams)
  console.log('[GA] ✅ Event tracked:', eventName, eventParams)
}

// Helper function to check if GA is actually sending requests
export const checkGANetworkRequests = (): void => {
  if (typeof window === 'undefined') return
  
  console.log('[GA] Checking for network requests...')
  console.log('[GA] Open Network tab and filter by "collect" or "analytics"')
  console.log('[GA] You should see requests to google-analytics.com/g/collect')
  
  // Check Performance API for recent requests
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  const gaRequests = resources.filter(r => 
    r.name.includes('google-analytics.com') || 
    r.name.includes('analytics.google.com') ||
    r.name.includes('googletagmanager.com')
  )
  
  if (gaRequests.length > 0) {
    console.log('[GA] ✅ Found', gaRequests.length, 'GA-related network requests:')
    gaRequests.forEach((req, i) => {
      console.log(`[GA]   ${i + 1}. ${req.name} - Status: ${req.responseStatus || 'pending'}`)
    })
  } else {
    console.warn('[GA] ⚠️ No GA network requests found. This could mean:')
    console.warn('[GA]   1. Requests are blocked by browser/adblocker')
    console.warn('[GA]   2. localhost traffic is being filtered')
    console.warn('[GA]   3. Script is not fully initialized')
    console.warn('[GA]   4. Check Network tab manually with filter "collect"')
  }
}

// Declare gtag types for TypeScript
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

