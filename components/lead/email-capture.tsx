"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, Loader2 } from "lucide-react"

type Props = {
  /** Where this capture sits, e.g. "blog-post" or "calculator-home-equity-estimator".
   *  Passed through to the webhook so list growth is attributable per surface. */
  source: string
  heading: string
  body: string
  action?: string
  /** Extra context recorded with the signup, e.g. the post slug. */
  context?: Record<string, string>
}

/**
 * Low-commitment capture for readers who are not ready to pre-qualify. Name + email only,
 * posting to the existing mailing-list endpoint so the leads land in the same Zapier flow
 * as the homepage form, separated by `source`.
 */
export function EmailCapture({ source, heading, body, action = "Send it to me", context }: Props) {
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "sending" | "done">("idle")
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!firstName.trim() || !email.trim()) {
      setError("Add your first name and email and we'll send it over.")
      return
    }

    setState("sending")
    try {
      const response = await fetch("/api/subscribe-mailing-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email: email.trim(),
          source,
          context,
        }),
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || "Request failed")
      }
      setState("done")
    } catch (err) {
      console.error("Email capture failed:", err)
      setState("idle")
      setError("That didn't go through. Try again in a moment.")
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-xl border border-[#007a5e]/30 bg-[#f0f8f5] px-6 py-6 not-prose">
        <p className="flex items-center gap-2 font-semibold text-[#007a5e]">
          <CheckCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
          You're on the list.
        </p>
        <p className="text-gray-700 mt-1">Check your inbox — it's on the way.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-6 not-prose">
      <p className="text-lg font-semibold text-gray-900 mb-1">{heading}</p>
      <p className="text-gray-700 mb-4 leading-relaxed">{body}</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <label className="sr-only" htmlFor={`capture-name-${source}`}>
          First name
        </label>
        <Input
          id={`capture-name-${source}`}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
          autoComplete="given-name"
          className="sm:max-w-[10rem] bg-white"
        />
        <label className="sr-only" htmlFor={`capture-email-${source}`}>
          Email address
        </label>
        <Input
          id={`capture-email-${source}`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="bg-white"
        />
        <Button
          type="submit"
          disabled={state === "sending"}
          className="bg-[#1b75bc] hover:bg-[#12547f] text-white shrink-0"
        >
          {state === "sending" ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
              Sending
            </>
          ) : (
            action
          )}
        </Button>
      </form>
      {error && (
        <p role="alert" className="text-sm text-red-700 mt-2">
          {error}
        </p>
      )}
      <p className="text-xs text-gray-500 mt-3">No spam. Unsubscribe any time.</p>
    </div>
  )
}
