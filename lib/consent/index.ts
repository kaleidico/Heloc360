/**
 * Cookie consent core.
 *
 * One source of truth for: what categories exist, how a visitor's choice is
 * stored, and how that choice is handed to Google Consent Mode v2.
 *
 * The cookie inventory published at /cookie-policy is generated from
 * COOKIE_INVENTORY below, so the policy page cannot drift from the code that
 * actually sets the cookies.
 */

export type ConsentCategory = "necessary" | "analytics" | "marketing" | "fraud"

export type ConsentState = Record<ConsentCategory, boolean>

/**
 * Consent model.
 *
 *   "opt-in"  — nothing outside `necessary` runs until the visitor agrees.
 *               Required for the EU/UK/EEA (GDPR + ePrivacy).
 *   "opt-out" — non-necessary categories run on arrival and the visitor can
 *               switch them off. Permitted for a US-only audience under
 *               CCPA/CPRA.
 *
 * Set to "opt-in" because it is valid in every jurisdiction. If HELOC360
 * confirms it does not serve EU/UK visitors, switching this to "opt-out"
 * restores full analytics coverage on first visit and stays CCPA-compliant.
 * Nothing else needs to change.
 */
export type ConsentMode = "opt-in" | "opt-out"

// Cast keeps the type as the full union: without it TypeScript narrows to the
// literal and flags every comparison against the other mode as unreachable.
export const CONSENT_MODE = "opt-in" as ConsentMode

export const CONSENT_COOKIE = "hl360_consent"
export const CONSENT_VERSION = 1

/** Re-ask after 180 days, per ICO guidance on refreshing consent. */
export const CONSENT_MAX_AGE_DAYS = 180

export const CATEGORY_ORDER: ConsentCategory[] = [
  "necessary",
  "analytics",
  "marketing",
  "fraud",
]

export const CATEGORY_META: Record<
  ConsentCategory,
  { label: string; required: boolean; summary: string }
> = {
  necessary: {
    label: "Strictly necessary",
    required: true,
    summary:
      "Needed for the site to work: remembering your cookie choices, keeping forms secure, and protecting against automated abuse. These cannot be switched off.",
  },
  analytics: {
    label: "Analytics",
    required: false,
    summary:
      "Google Analytics 4, loaded through Google Tag Manager. Tells us which pages people read and where they leave, so we can improve the site. Never used to contact you.",
  },
  marketing: {
    label: "Advertising",
    required: false,
    summary:
      "Lets advertising tags measure which campaigns lead to an enquiry, and may be used to show you HELOC360 ads on other sites.",
  },
  fraud: {
    label: "Fraud prevention",
    required: false,
    summary:
      "Fraud Blocker checks whether traffic arriving from paid advertising is genuine. It protects our advertising spend rather than your visit, so you can switch it off.",
  },
}

/** The actual cookies and storage set by this site, by category. */
export const COOKIE_INVENTORY: {
  category: ConsentCategory
  name: string
  provider: string
  purpose: string
  duration: string
  type: string
}[] = [
  {
    category: "necessary",
    name: CONSENT_COOKIE,
    provider: "HELOC360 (heloc360.com)",
    purpose:
      "Stores which cookie categories you agreed to, so we do not ask again on every page.",
    duration: `${CONSENT_MAX_AGE_DAYS} days`,
    type: "First-party cookie",
  },
  {
    category: "necessary",
    name: "_GRECAPTCHA",
    provider: "Google reCAPTCHA (google.com)",
    purpose:
      "Distinguishes a real person from an automated script when you submit a form. Set only on pages with a form.",
    duration: "6 months",
    type: "Third-party cookie",
  },
  {
    category: "necessary",
    name: "tracking_data",
    provider: "HELOC360 (heloc360.com)",
    purpose:
      "Browser storage holding the campaign link you arrived from, so an enquiry can be attributed to the right campaign. Cleared when you clear site data.",
    duration: "Until cleared",
    type: "Local storage",
  },
  {
    category: "analytics",
    name: "_ga",
    provider: "Google Analytics (google-analytics.com)",
    purpose: "Assigns a random ID so repeat visits are counted as one visitor.",
    duration: "13 months",
    type: "First-party cookie",
  },
  {
    category: "analytics",
    name: "_ga_BTKB2FTFFX",
    provider: "Google Analytics (google-analytics.com)",
    purpose: "Keeps track of the current session for the GA4 property.",
    duration: "13 months",
    type: "First-party cookie",
  },
  {
    category: "marketing",
    name: "Tags served via Google Tag Manager (GTM-5G84S7P8)",
    provider: "Google (googletagmanager.com)",
    purpose:
      "Advertising and conversion-measurement tags. With this category off, these tags receive no advertising identifiers.",
    duration: "Varies by tag, up to 24 months",
    type: "Third-party cookie",
  },
  {
    category: "fraud",
    name: "Fraud Blocker",
    provider: "Fraud Blocker (monitor.fraudblocker.com)",
    purpose: "Scores incoming paid-advertising traffic to detect click fraud.",
    duration: "Up to 12 months",
    type: "Third-party cookie / script",
  },
]

export const NECESSARY_ONLY: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  fraud: false,
}

export const ALL_GRANTED: ConsentState = {
  necessary: true,
  analytics: true,
  marketing: true,
  fraud: true,
}

/** What runs before a visitor has expressed any choice. */
export const IMPLIED_DEFAULT: ConsentState =
  CONSENT_MODE === "opt-out" ? ALL_GRANTED : NECESSARY_ONLY

export type StoredConsent = {
  v: number
  ts: number
  categories: ConsentState
}

function normalise(raw: unknown): ConsentState | null {
  if (!raw || typeof raw !== "object") return null
  const c = raw as Record<string, unknown>
  return {
    necessary: true,
    analytics: c.analytics === true,
    marketing: c.marketing === true,
    fraud: c.fraud === true,
  }
}

/** Read the stored choice, or null if the visitor has not chosen yet. */
export function readConsent(): StoredConsent | null {
  if (typeof document === "undefined") return null
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CONSENT_COOKIE}=`))
  if (!match) return null
  try {
    const parsed = JSON.parse(
      decodeURIComponent(match.slice(CONSENT_COOKIE.length + 1)),
    ) as StoredConsent
    // A bump in CONSENT_VERSION retires old choices and re-asks.
    if (parsed?.v !== CONSENT_VERSION) return null
    const categories = normalise(parsed.categories)
    if (!categories) return null
    return { v: parsed.v, ts: parsed.ts, categories }
  } catch {
    return null
  }
}

export function writeConsent(categories: ConsentState): StoredConsent {
  const payload: StoredConsent = {
    v: CONSENT_VERSION,
    ts: Date.now(),
    categories: { ...categories, necessary: true },
  }
  if (typeof document !== "undefined") {
    const secure = window.location.protocol === "https:" ? "; Secure" : ""
    document.cookie =
      `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(payload))}` +
      `; Path=/; Max-Age=${CONSENT_MAX_AGE_DAYS * 24 * 60 * 60}` +
      `; SameSite=Lax${secure}`
  }
  return payload
}

/**
 * Best-effort removal of cookies belonging to categories the visitor has just
 * withdrawn. Third-party cookies on another domain cannot be deleted from
 * here; those are stopped by not loading the vendor at all on the next load.
 */
export function clearCookiesFor(categories: ConsentCategory[]): void {
  if (typeof document === "undefined") return
  const prefixes: string[] = []
  if (categories.includes("analytics")) prefixes.push("_ga", "_gid", "_gat")
  if (categories.includes("marketing")) prefixes.push("_gcl", "_fbp", "IDE")
  if (!prefixes.length) return

  const host = window.location.hostname
  const domains = [host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`]

  for (const cookie of document.cookie.split("; ")) {
    const name = cookie.split("=")[0]
    if (!prefixes.some((p) => name.startsWith(p))) continue
    for (const domain of domains) {
      document.cookie = `${name}=; Path=/; Domain=${domain}; Max-Age=0`
    }
    document.cookie = `${name}=; Path=/; Max-Age=0`
  }

  if (categories.includes("analytics")) {
    try {
      window.localStorage.removeItem("tracking_data")
    } catch {
      /* storage may be unavailable */
    }
  }
}

type ConsentModeValue = "granted" | "denied"

/** Map our categories onto the Google Consent Mode v2 signals. */
export function toConsentModePayload(
  state: ConsentState,
): Record<string, ConsentModeValue> {
  const grant = (on: boolean): ConsentModeValue => (on ? "granted" : "denied")
  return {
    ad_storage: grant(state.marketing),
    ad_user_data: grant(state.marketing),
    ad_personalization: grant(state.marketing),
    analytics_storage: grant(state.analytics),
    functionality_storage: "granted",
    security_storage: "granted",
  }
}

/**
 * Push an update into the dataLayer so already-loaded Google tags react.
 *
 * This must go through a gtag()-style call, which pushes the `arguments`
 * object. Pushing a plain array instead looks similar in the dataLayer but
 * Google does not read it as a consent command, so the tag silently stays on
 * its previous (denied) state and runs cookieless.
 */
export function pushConsentUpdate(state: ConsentState): void {
  if (typeof window === "undefined") return
  const w = window as unknown as {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
  w.dataLayer = w.dataLayer || []
  if (typeof w.gtag !== "function") {
    w.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments)
    }
  }
  w.gtag("consent", "update", toConsentModePayload(state))
  w.dataLayer.push({ event: "hl360_consent_update", hl360_consent: state })
}

export const CONSENT_CHANGED_EVENT = "hl360:consent-changed"
