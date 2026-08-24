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
 * Load Google Tag Manager.
 *
 * Consent-gated: call this only via the consent provider, never directly.
 * Google Consent Mode v2 defaults are set ahead of this in
 * <ConsentDefaultScript>, so any tag inside the container that does fire
 * already knows what it is allowed to store.
 */
export function initializeGTM(): void {
	if (typeof window === "undefined") return;
	if (document.getElementById("hl360-gtm")) return; // already loaded

	// GTM script
	const gtmScript = document.createElement("script");
	gtmScript.id = "hl360-gtm";
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
 * Load Fraud Blocker.
 *
 * Consent-gated under the "fraud" category: call this only via the consent
 * provider. It protects advertising spend rather than the visit itself, so it
 * is not classed as strictly necessary.
 */
export function initializeFraudBlocker(): void {
	if (typeof window === "undefined") return;
	if (document.getElementById("hl360-fraudblocker")) return; // already loaded

	// Fraud Blocker script
	const fbScript = document.createElement("script");
	fbScript.id = "hl360-fraudblocker";
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

/** Start analytics/advertising. Called by ConsentProvider once permitted. */
export function startAnalytics(): void {
	initializeGTM();
}

/** Start fraud prevention. Called by ConsentProvider once permitted. */
export function startFraudPrevention(): void {
	initializeFraudBlocker();
}

/**
 * First-party campaign capture, which runs regardless of consent.
 *
 * This records only the campaign link the visitor arrived on so an enquiry
 * they choose to submit is attributed correctly. It sets no cookie, contacts
 * no third party, and is not used to build a profile or to track anyone across
 * other sites.
 *
 * Vendor scripts are NOT started here — see startAnalytics /
 * startFraudPrevention, both gated by ConsentProvider.
 */
export function initializeTracking(): void {
	if (typeof window === "undefined") return;

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
 * Deprecated, and now a no-op.
 *
 * This used to call api.ipify.org from the visitor's browser to learn their IP
 * address, which handed a third party the IP of every person who opened the
 * form, for no benefit: our own server already sees the source IP on the
 * request. The API routes read it from the request headers instead (see
 * `clientIpFromHeaders` in lib/request-ip.ts).
 *
 * Kept as a no-op so any remaining caller stops making the third-party
 * request rather than breaking.
 */
export async function updateTrackingWithIp(): Promise<void> {
	return;
}
