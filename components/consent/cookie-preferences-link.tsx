"use client"

import { useConsent } from "./consent-provider"

/**
 * Footer entry point for changing a stored choice. Consent has to be as easy
 * to withdraw as it was to give, so this sits with the other legal links and
 * is always present, including after the banner has been dismissed.
 */
export default function CookiePreferencesLink({
  // py-1 keeps the target at the 24px WCAG 2.2 (2.5.8) minimum, matching the
  // other footer links.
  className = "inline-block py-1 text-sm text-white/80 hover:text-white transition-colors underline-offset-2 hover:underline text-left",
}: {
  className?: string
}) {
  const { openPreferences } = useConsent()

  return (
    <button type="button" onClick={openPreferences} className={className}>
      Cookie preferences
    </button>
  )
}
