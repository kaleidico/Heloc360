"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Phone, X } from "lucide-react"

const DISMISS_KEY = "stickyCta:dismissed"

export default function StickyCta() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [suppressed, setSuppressed] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (sessionStorage.getItem(DISMISS_KEY) === "1") {
      setDismissed(true)
      return
    }

    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return
      const pct = window.scrollY / docHeight
      setVisible(pct >= 0.3)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (typeof document === "undefined") return
    const check = () => {
      setSuppressed(document.body.dataset.suppressStickyCta === "1")
    }
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-suppress-sticky-cta"],
    })
    return () => observer.disconnect()
  }, [])

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1")
    setDismissed(true)
  }

  if (dismissed || suppressed || !visible) return null

  return (
    <div
      role="region"
      aria-label="Quick actions"
      className="fixed bottom-4 inset-x-3 md:inset-x-auto md:right-6 md:bottom-6 z-40 bg-brand-navy text-white shadow-2xl rounded-xl border border-white/10 overflow-hidden"
    >
      <div className="flex items-stretch">
        <Link
          href="/contact"
          className="flex items-center gap-2 px-4 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
        >
          <Phone className="w-4 h-4" aria-hidden="true" />
          <span>Talk to advisor</span>
        </Link>
        <Link
          href="/#calculator"
          className="flex items-center gap-2 px-4 py-3 text-sm font-semibold bg-brand-green hover:bg-brand-green-dark transition-colors"
        >
          See my borrowing power
        </Link>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="px-3 hover:bg-white/10 transition-colors border-l border-white/10"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
