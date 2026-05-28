"use client"

import { useEffect } from "react"

// While this component is mounted, sets body[data-suppress-sticky-cta="1"].
// StickyCta watches that attribute and hides itself when present.
// Reusable: any future modal/full-screen flow can drop this in to suppress
// the sticky CTA without importing the CTA itself.
export function StickyCtaSuppress() {
  useEffect(() => {
    if (typeof document === "undefined") return
    const prev = document.body.dataset.suppressStickyCta
    document.body.dataset.suppressStickyCta = "1"
    return () => {
      if (prev === undefined) {
        delete document.body.dataset.suppressStickyCta
      } else {
        document.body.dataset.suppressStickyCta = prev
      }
    }
  }, [])
  return null
}
