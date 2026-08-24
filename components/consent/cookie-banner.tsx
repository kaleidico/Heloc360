"use client"

import Link from "next/link"
import { useId } from "react"
import { useConsent } from "./consent-provider"
import { CONSENT_MODE } from "@/lib/consent"

/**
 * First-visit cookie notice.
 *
 * Deliberately NOT a modal: it does not trap focus or block the page, so a
 * visitor who ignores it can still read the site. Accept and Reject are given
 * identical size and weight, because a consent choice is not freely given if
 * declining is harder than agreeing.
 */
export default function CookieBanner() {
  const { ready, decided, acceptAll, rejectAll, openPreferences } = useConsent()
  const headingId = useId()

  // Nothing during SSR/hydration, and nothing once a choice exists.
  if (!ready || decided) return null

  return (
    <div
      role="region"
      aria-labelledby={headingId}
      className="fixed inset-x-0 bottom-0 z-[90] border-t-4 border-brand-maize bg-brand-navy text-white shadow-2xl"
    >
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
          <div className="flex-1 min-w-0">
            <h2 id={headingId} className="text-base font-semibold mb-1">
              We use cookies
            </h2>
            <p className="text-sm text-white/90 leading-relaxed">
              {CONSENT_MODE === "opt-out"
                ? "We use cookies to keep the site secure, understand how it is used, and measure our advertising. You can turn off anything that is not strictly necessary."
                : "We use cookies to keep the site secure and, with your permission, to understand how the site is used and measure our advertising. Nothing optional runs until you agree."}{" "}
              Read our{" "}
              <Link
                href="/cookie-policy"
                className="underline font-medium text-white hover:text-brand-maize"
              >
                Cookie Policy
              </Link>
              .
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 lg:shrink-0">
            <button
              type="button"
              onClick={acceptAll}
              className="bg-brand-green hover:bg-brand-green-dark text-white font-semibold px-6 py-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-navy"
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={rejectAll}
              className="bg-white text-brand-navy hover:bg-surface-100 font-semibold px-6 py-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-navy"
            >
              Reject all
            </button>
            <button
              type="button"
              onClick={openPreferences}
              className="bg-transparent border-2 border-white/70 text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-navy"
            >
              Manage preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
