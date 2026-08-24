"use client"

import { useState } from "react"
import { useConsent } from "@/components/consent/consent-provider"

/**
 * Consumer privacy request form (CCPA/CPRA and the state equivalents).
 *
 * A "Do Not Sell or Share" link is only meaningful if it leads somewhere that
 * actually records a request. This posts to /api/privacy-request, which
 * notifies compliance@heloc360.com.
 *
 * The "stop selling or sharing" option also switches this browser's advertising
 * cookies off immediately, so the visitor gets an effect now rather than only
 * once someone processes the request.
 */

const REQUEST_TYPES = [
  {
    id: "do-not-sell",
    label: "Do not sell or share my personal information",
    help: "Stops us passing your details to lender partners for their own marketing, and turns off advertising cookies in this browser straight away.",
  },
  {
    id: "know",
    label: "Tell me what personal information you hold about me",
    help: "We will send you the categories of information we hold, where it came from, and who we have shared it with.",
  },
  {
    id: "delete",
    label: "Delete my personal information",
    help: "We will delete what we hold, except anything we are legally required to keep.",
  },
  {
    id: "correct",
    label: "Correct my personal information",
    help: "Tell us what is wrong and what it should say.",
  },
  {
    id: "opt-out-contact",
    label: "Stop contacting me",
    help: "Withdraws any consent to calls, texts and email.",
  },
] as const

export default function PrivacyRequestForm() {
  const { consent, save } = useConsent()
  const [types, setTypes] = useState<string[]>([])
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [details, setDetails] = useState("")
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle")
  const [message, setMessage] = useState("")

  function toggle(id: string) {
    setTypes((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]))
    if (state === "error") setState("idle")
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (state === "sending") return

    if (!types.length) {
      setState("error")
      setMessage("Please choose at least one request.")
      return
    }
    if (!email.trim()) {
      setState("error")
      setMessage("Please give us an email address so we can reply.")
      return
    }

    setState("sending")
    setMessage("")
    try {
      const response = await fetch("/api/privacy-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestTypes: types,
          email: email.trim(),
          name: name.trim(),
          details: details.trim(),
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data?.success !== true) {
        setState("error")
        setMessage(data?.message || "That didn't go through. Please try again, or email compliance@heloc360.com.")
        return
      }

      // Give the opt-out an immediate effect in this browser.
      if (types.includes("do-not-sell")) {
        save({ ...consent, marketing: false })
      }

      setState("done")
      setMessage(
        "Request received. We will confirm by email within 10 business days, and complete it within 45 days as the law requires.",
      )
      setTypes([])
      setDetails("")
    } catch {
      setState("error")
      setMessage("That didn't go through. Please check your connection, or email compliance@heloc360.com.")
    }
  }

  if (state === "done") {
    return (
      <div
        role="status"
        className="rounded-lg border-2 border-brand-green bg-white p-6"
      >
        <h2 className="text-xl font-bold text-brand-green mb-2">
          Your request has been logged
        </h2>
        <p className="text-ink-700">{message}</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-surface-200 bg-white p-6">
      <fieldset className="mb-6">
        <legend className="text-base font-semibold text-brand-navy mb-3">
          What would you like us to do?
        </legend>
        <ul className="space-y-3">
          {REQUEST_TYPES.map((r) => (
            <li key={r.id}>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id={`req-${r.id}`}
                  checked={types.includes(r.id)}
                  onChange={() => toggle(r.id)}
                  aria-describedby={`req-${r.id}-help`}
                  className="mt-1 h-5 w-5 shrink-0 accent-[#007a5e] focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
                />
                <div>
                  <label
                    htmlFor={`req-${r.id}`}
                    className="font-medium text-ink-900 cursor-pointer"
                  >
                    {r.label}
                  </label>
                  <p id={`req-${r.id}-help`} className="text-sm text-ink-700 mt-0.5">
                    {r.help}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </fieldset>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="pr-email" className="block font-medium text-ink-900 mb-1">
            Email address <span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="pr-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (state === "error") setState("idle")
            }}
            className="w-full px-3 py-2 rounded-md border border-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
          <p className="text-xs text-ink-500 mt-1">
            Use the address you gave us, so we can match your request.
          </p>
        </div>
        <div>
          <label htmlFor="pr-name" className="block font-medium text-ink-900 mb-1">
            Name
          </label>
          <input
            id="pr-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="pr-details" className="block font-medium text-ink-900 mb-1">
          Anything else we should know?
        </label>
        <textarea
          id="pr-details"
          rows={3}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />
      </div>

      {message && state === "error" && (
        <p role="alert" className="text-sm text-red-600 mb-4">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="bg-brand-green hover:bg-brand-green-dark disabled:opacity-70 text-white font-semibold px-6 py-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
      >
        {state === "sending" ? "Sending…" : "Submit request"}
      </button>

      <p className="text-xs text-ink-500 mt-4 leading-relaxed">
        We will not discriminate against you for exercising these rights: your
        rate, your service and the lenders we introduce you to do not change
        because you made a request. You may also authorise someone to make a
        request on your behalf by emailing compliance@heloc360.com.
      </p>
    </form>
  )
}
