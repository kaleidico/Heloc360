"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  ALL_GRANTED,
  CONSENT_CHANGED_EVENT,
  IMPLIED_DEFAULT,
  NECESSARY_ONLY,
  clearCookiesFor,
  pushConsentUpdate,
  readConsent,
  writeConsent,
  type ConsentCategory,
  type ConsentState,
} from "@/lib/consent"
import { startAnalytics, startFraudPrevention } from "@/lib/tracking"

type ConsentContextValue = {
  /** The categories currently in force. */
  consent: ConsentState
  /** True once the visitor has made an explicit choice. */
  decided: boolean
  /** True after mount, so nothing renders during SSR/hydration. */
  ready: boolean
  acceptAll: () => void
  rejectAll: () => void
  save: (next: ConsentState) => void
  openPreferences: () => void
  closePreferences: () => void
  preferencesOpen: boolean
}

const ConsentContext = createContext<ConsentContextValue | null>(null)

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext)
  if (!ctx) {
    throw new Error("useConsent must be used inside <ConsentProvider>")
  }
  return ctx
}

export default function ConsentProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [consent, setConsent] = useState<ConsentState>(IMPLIED_DEFAULT)
  const [decided, setDecided] = useState(false)
  const [ready, setReady] = useState(false)
  const [preferencesOpen, setPreferencesOpen] = useState(false)

  // Vendors are loaded at most once per page load, even if the visitor
  // toggles a category several times.
  const started = useRef<Record<string, boolean>>({})

  const applyVendors = useCallback((state: ConsentState) => {
    if (state.analytics && !started.current.analytics) {
      started.current.analytics = true
      startAnalytics()
    }
    if (state.fraud && !started.current.fraud) {
      started.current.fraud = true
      startFraudPrevention()
    }
  }, [])

  // Restore any prior choice on mount.
  useEffect(() => {
    const stored = readConsent()
    const state = stored ? stored.categories : IMPLIED_DEFAULT
    setConsent(state)
    setDecided(Boolean(stored))
    setReady(true)
    pushConsentUpdate(state)
    applyVendors(state)
  }, [applyVendors])

  const commit = useCallback(
    (next: ConsentState) => {
      const previous = consent
      writeConsent(next)
      setConsent(next)
      setDecided(true)
      setPreferencesOpen(false)
      pushConsentUpdate(next)
      applyVendors(next)

      // Clean up anything the visitor just withdrew.
      const withdrawn = (
        ["analytics", "marketing", "fraud"] as ConsentCategory[]
      ).filter((c) => previous[c] && !next[c])
      if (withdrawn.length) clearCookiesFor(withdrawn)

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent(CONSENT_CHANGED_EVENT, { detail: next }),
        )
      }
    },
    [applyVendors, consent],
  )

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      decided,
      ready,
      preferencesOpen,
      acceptAll: () => commit(ALL_GRANTED),
      rejectAll: () => commit(NECESSARY_ONLY),
      save: commit,
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
    }),
    [commit, consent, decided, preferencesOpen, ready],
  )

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  )
}
