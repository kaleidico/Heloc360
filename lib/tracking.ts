/**
 * Tracking utility for managing UTM parameters and other tracking data
 * that should persist across page navigation
 */

export interface TrackingData {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  gclid?: string
  fbclid?: string
  referral?: string
  userAgent?: string
  ipAddress?: string
}

/**
 * Extract tracking parameters from URL
 */
export function extractTrackingParams(url: string): Partial<TrackingData> {
  const urlParams = new URLSearchParams(url.split('?')[1] || '')
  
  return {
    utmSource: urlParams.get('utm_source') || undefined,
    utmMedium: urlParams.get('utm_medium') || undefined,
    utmCampaign: urlParams.get('utm_campaign') || undefined,
    utmTerm: urlParams.get('utm_term') || undefined,
    utmContent: urlParams.get('utm_content') || undefined,
    gclid: urlParams.get('gclid') || undefined,
    fbclid: urlParams.get('fbclid') || undefined,
  }
}

/**
 * Save tracking data to localStorage
 */
export function saveTrackingData(data: TrackingData): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem('tracking_data', JSON.stringify(data))
  } catch (error) {
    console.warn('Failed to save tracking data to localStorage:', error)
  }
}

/**
 * Get tracking data from localStorage
 */
export function getTrackingData(): Partial<TrackingData> {
  if (typeof window === 'undefined') return {}
  
  try {
    const data = localStorage.getItem('tracking_data')
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.warn('Failed to get tracking data from localStorage:', error)
    return {}
  }
}

/**
 * Merge new tracking data with existing data
 */
export function getMergedTrackingData(): TrackingData {
  const existing = getTrackingData()
  const current = {
    referral: document.referrer || undefined,
    userAgent: navigator.userAgent,
  }
  
  return {
    ...existing,
    ...current,
  }
}

/**
 * Initialize tracking on page load
 */
export function initializeTracking(): void {
  if (typeof window === 'undefined') return
  
  // Extract tracking parameters from current URL
  const urlParams = extractTrackingParams(window.location.href)
  
  // Get existing tracking data
  const existing = getTrackingData()
  
  // Merge with new data, preferring existing data if it exists
  const merged = {
    ...urlParams,
    ...existing,
    referral: existing.referral || document.referrer || undefined,
    userAgent: existing.userAgent || navigator.userAgent,
  }
  
  // Save merged data
  saveTrackingData(merged)
}

/**
 * Get user's IP address
 */
export async function getIpAddress(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch (error) {
    console.warn('Failed to get IP address:', error)
    return ''
  }
}

/**
 * Update tracking data with IP address
 */
export async function updateTrackingWithIp(): Promise<void> {
  const ipAddress = await getIpAddress()
  if (ipAddress) {
    const existing = getTrackingData()
    saveTrackingData({
      ...existing,
      ipAddress,
    })
  }
}
