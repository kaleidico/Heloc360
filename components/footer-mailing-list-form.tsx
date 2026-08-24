"use client"

import { useState } from "react"

/**
 * Footer newsletter signup.
 *
 * Replaces an inline <form> whose only handler was `e.preventDefault()`. It
 * looked and behaved like a working form, showed no error, and delivered every
 * address to nothing, on every page of the site.
 *
 * Posts to the same /api/subscribe-mailing-list endpoint the homepage form
 * uses. Email only: a name field on a footer signup costs conversions, and the
 * route treats the name as optional.
 */
export default function FooterMailingListForm({
  ctaLabel,
}: {
  ctaLabel: string
}) {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle")
  const [message, setMessage] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (state === "sending") return

    const value = email.trim()
    if (!value) {
      setState("error")
      setMessage("Please enter your email address.")
      return
    }

    setState("sending")
    setMessage("")
    try {
      const response = await fetch("/api/subscribe-mailing-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, source: "footer" }),
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setState("error")
        setMessage(data?.error || "That didn't go through. Please try again.")
        return
      }
      setState("done")
      setMessage("You're on the list. The guide is on its way.")
      setEmail("")
    } catch {
      setState("error")
      setMessage("That didn't go through. Please check your connection and try again.")
    }
  }

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={onSubmit}
      aria-label="Mailing list signup"
      noValidate
    >
      <div className="flex flex-col sm:flex-row gap-2">
        <label htmlFor="footer-email" className="sr-only">
          Email address
        </label>
        <input
          id="footer-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (state === "error") setState("idle")
          }}
          placeholder="you@example.com"
          aria-invalid={state === "error"}
          aria-describedby={message ? "footer-email-status" : undefined}
          className="flex-1 px-4 py-3 rounded-md bg-white text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="bg-brand-green hover:bg-brand-green-dark disabled:opacity-70 text-white font-semibold px-6 py-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-navy"
        >
          {state === "sending" ? "Sending…" : ctaLabel}
        </button>
      </div>

      {message && (
        <p
          id="footer-email-status"
          role={state === "error" ? "alert" : "status"}
          className={
            state === "error"
              ? "text-sm text-red-300"
              : "text-sm text-brand-mint"
          }
        >
          {message}
        </p>
      )}
    </form>
  )
}
