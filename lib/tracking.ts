/**
 * Tracking utility for managing UTM parameters and other tracking data
 * that should persist across page navigation
 */

export interface TrackingData {
	utmSource?: string;
	utmMedium?: string;
	utmCampaign?: string;
	utmTerm?: string;
	utmContent?: string;
	gclid?: string;
	fbclid?: string;
	referral?: string;
	userAgent?: string;
	ipAddress?: string;
}

/**
 * Extract tracking parameters from URL
 */
export function extractTrackingParams(url: string): Partial<TrackingData> {
	const urlParams = new URLSearchParams(url.split("?")[1] || "");

	return {
		utmSource: urlParams.get("utm_source") || undefined,
		utmMedium: urlParams.get("utm_medium") || undefined,
		utmCampaign: urlParams.get("utm_campaign") || undefined,
		utmTerm: urlParams.get("utm_term") || undefined,
		utmContent: urlParams.get("utm_content") || undefined,
		gclid: urlParams.get("gclid") || undefined,
		fbclid: urlParams.get("fbclid") || undefined,
	};
}

/**
 * Save tracking data to localStorage
 */
export function saveTrackingData(data: TrackingData): void {
	if (typeof window === "undefined") return;

	try {
		localStorage.setItem("tracking_data", JSON.stringify(data));
	} catch (error) {
		console.warn("Failed to save tracking data to localStorage:", error);
	}
}

/**
 * Get tracking data from localStorage
 */
export function getTrackingData(): Partial<TrackingData> {
	if (typeof window === "undefined") return {};

	try {
		const data = localStorage.getItem("tracking_data");
		return data ? JSON.parse(data) : {};
	} catch (error) {
		console.warn("Failed to get tracking data from localStorage:", error);
		return {};
	}
}

/**
 * Merge new tracking data with existing data
 */
export function getMergedTrackingData(): TrackingData {
	const existing = getTrackingData();
	const current = {
		referral: document.referrer || undefined,
		userAgent: navigator.userAgent,
	};

	return {
		...existing,
		...current,
	};
}

/**
 * Initialize Google Tag Manager
 */
export function initializeGTM(): void {
	if (typeof window === "undefined") return;

	// GTM script
	const gtmScript = document.createElement("script");
	gtmScript.async = true;
	gtmScript.src = "https://www.googletagmanager.com/gtm.js?id=GTM-5G84S7P8";
	document.head.appendChild(gtmScript);

	// GTM noscript fallback
	const gtmNoscript = document.createElement("noscript");
	gtmNoscript.innerHTML =
		'<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5G84S7P8" height="0" width="0" style="display:none;visibility:hidden"></iframe>';
	document.body.insertBefore(gtmNoscript, document.body.firstChild);

	// Initialize dataLayer
	(window as any).dataLayer = (window as any).dataLayer || [];
	(window as any).dataLayer.push({
		"gtm.start": new Date().getTime(),
		event: "gtm.js",
	});
}

/**
 * Initialize Fraud Blocker
 */
export function initializeFraudBlocker(): void {
	if (typeof window === "undefined") return;

	// Fraud Blocker script
	const fbScript = document.createElement("script");
	fbScript.type = "text/javascript";
	fbScript.async = true;
	fbScript.src =
		"https://monitor.fraudblocker.com/fbt.js?sid=EwtPzlQdfbs9uvY_8eTTG";
	document.head.appendChild(fbScript);

	// Fraud Blocker noscript fallback
	const fbNoscript = document.createElement("noscript");
	fbNoscript.innerHTML =
		'<a href="https://fraudblocker.com" rel="nofollow"><img src="https://monitor.fraudblocker.com/fbt.gif?sid=EwtPzlQdfbs9uvY_8eTTG" alt="Fraud Blocker" /></a>';
	document.body.appendChild(fbNoscript);
}

/**
 * Initialize tracking on page load
 */
export function initializeTracking(): void {
	if (typeof window === "undefined") return;

	// Initialize GTM
	initializeGTM();

	// Initialize Fraud Blocker
	initializeFraudBlocker();

	// Extract tracking parameters from current URL
	const urlParams = extractTrackingParams(window.location.href);

	// Get existing tracking data
	const existing = getTrackingData();

	// Merge with new data, preferring existing data if it exists
	const merged = {
		...urlParams,
		...existing,
		referral: existing.referral || document.referrer || undefined,
		userAgent: existing.userAgent || navigator.userAgent,
	};

	// Save merged data
	saveTrackingData(merged);
}

/**
 * Get user's IP address
 */
export async function getIpAddress(): Promise<string> {
	try {
		const response = await fetch("https://api.ipify.org?format=json");
		const data = await response.json();
		return data.ip;
	} catch (error) {
		console.warn("Failed to get IP address:", error);
		return "";
	}
}

/**
 * Update tracking data with IP address
 */
export async function updateTrackingWithIp(): Promise<void> {
	const ipAddress = await getIpAddress();
	if (ipAddress) {
		const existing = getTrackingData();
		saveTrackingData({
			...existing,
			ipAddress,
		});
	}
}
