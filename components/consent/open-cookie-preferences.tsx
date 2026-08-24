"use client"

import { useConsent } from "./consent-provider"

/** Prominent button used on the Cookie Policy page to open the dialog. */
export default function OpenCookiePreferences() {
  const { openPreferences } = useConsent()

  return (
    <button
      type="button"
      onClick={openPreferences}
      className="bg-brand-green hover:bg-brand-green-dark text-white font-semibold px-6 py-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
    >
      Manage cookie preferences
    </button>
  )
}
