"use client"

import { useEffect, useId, useRef, useState } from "react"
import Link from "next/link"
import { useConsent } from "./consent-provider"
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  COOKIE_INVENTORY,
  NECESSARY_ONLY,
  ALL_GRANTED,
  type ConsentState,
} from "@/lib/consent"

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function CookiePreferencesDialog() {
  const { preferencesOpen, closePreferences, consent, save } = useConsent()
  const [draft, setDraft] = useState<ConsentState>(consent)
  const dialogRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const descId = useId()

  // Re-seed the draft each time the dialog opens.
  useEffect(() => {
    if (preferencesOpen) setDraft(consent)
  }, [preferencesOpen, consent])

  // Focus management + Escape + focus trap.
  useEffect(() => {
    if (!preferencesOpen) return

    previouslyFocused.current = document.activeElement as HTMLElement | null
    const node = dialogRef.current
    const first = node?.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation()
        closePreferences()
        return
      }
      if (e.key !== "Tab" || !node) return

      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (!items.length) return
      const firstItem = items[0]
      const lastItem = items[items.length - 1]

      if (e.shiftKey && document.activeElement === firstItem) {
        e.preventDefault()
        lastItem.focus()
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault()
        firstItem.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown, true)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKeyDown, true)
      document.body.style.overflow = prevOverflow
      previouslyFocused.current?.focus()
    }
  }, [preferencesOpen, closePreferences])

  if (!preferencesOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="presentation"
    >
      {/* Backdrop. Clicking it closes, but Escape and the buttons also do. */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={closePreferences}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-xl bg-white shadow-2xl"
      >
        <div className="p-6 sm:p-8">
          <h2
            id={titleId}
            className="text-2xl font-bold text-brand-navy mb-2"
          >
            Cookie preferences
          </h2>
          <p id={descId} className="text-sm text-ink-700 leading-relaxed mb-6">
            Choose which cookies HELOC360 may use. Strictly necessary cookies
            keep the site working and cannot be turned off. Everything else is
            your choice, and you can change it at any time from the
            &ldquo;Cookie preferences&rdquo; link in the footer. Full detail is
            in our{" "}
            <Link
              href="/cookie-policy"
              className="text-brand-blue-dark underline font-medium"
              onClick={closePreferences}
            >
              Cookie Policy
            </Link>
            .
          </p>

          <ul className="space-y-4 mb-4">
            {CATEGORY_ORDER.map((category) => {
              const meta = CATEGORY_META[category]
              const cookies = COOKIE_INVENTORY.filter(
                (c) => c.category === category,
              )
              const inputId = `consent-${category}`
              return (
                <li
                  key={category}
                  className="border border-surface-200 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={inputId}
                      checked={meta.required ? true : draft[category]}
                      disabled={meta.required}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          [category]: e.target.checked,
                        }))
                      }
                      aria-describedby={`${inputId}-desc`}
                      className="mt-1 h-5 w-5 shrink-0 accent-[#007a5e] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
                    />
                    <div className="min-w-0">
                      <label
                        htmlFor={inputId}
                        className="block font-semibold text-brand-navy cursor-pointer"
                      >
                        {meta.label}
                        {meta.required && (
                          <span className="ml-2 text-xs font-normal text-ink-500">
                            (always on)
                          </span>
                        )}
                      </label>
                      <p
                        id={`${inputId}-desc`}
                        className="text-sm text-ink-700 mt-1 leading-relaxed"
                      >
                        {meta.summary}
                      </p>
                      {cookies.length > 0 && (
                        <p className="text-xs text-ink-500 mt-2">
                          <span className="font-medium">Used for:</span>{" "}
                          {cookies.map((c) => c.name).join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          {/* Sticky, so the choice is always reachable without scrolling the
              category list to the end. Reject is given the same size and
              weight as Accept, so declining is no harder than agreeing. */}
          <div className="sticky bottom-0 -mx-6 sm:-mx-8 px-6 sm:px-8 pt-4 pb-1 bg-white border-t border-surface-200 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => save(draft)}
              className="flex-1 bg-brand-green hover:bg-brand-green-dark text-white font-semibold px-5 py-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
            >
              Save my choices
            </button>
            <button
              type="button"
              onClick={() => save(ALL_GRANTED)}
              className="flex-1 bg-white border-2 border-brand-navy text-brand-navy font-semibold px-5 py-3 rounded-md hover:bg-surface-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={() => save(NECESSARY_ONLY)}
              className="flex-1 bg-white border-2 border-brand-navy text-brand-navy font-semibold px-5 py-3 rounded-md hover:bg-surface-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
            >
              Reject all
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
