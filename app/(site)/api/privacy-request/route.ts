import { NextRequest, NextResponse } from "next/server"
import { sendLeadNotification } from "@/lib/email/notify"
import { clientIpFromHeaders } from "@/lib/request-ip"

/**
 * Consumer privacy requests (CCPA/CPRA "Do Not Sell or Share", access,
 * deletion, correction, contact opt-out).
 *
 * These carry a statutory clock, so the request has to land somewhere a person
 * will see it. It notifies compliance@heloc360.com via the existing Resend
 * helper and logs the request server-side as a fallback if mail is not
 * configured.
 *
 * A request is never rejected for a missing optional field. Losing a privacy
 * request on a validation technicality is worse than accepting a vague one.
 */

const VALID_TYPES = new Set([
  "do-not-sell",
  "know",
  "delete",
  "correct",
  "opt-out-contact",
])

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 },
    )
  }

  const email = typeof body.email === "string" ? body.email.trim() : ""
  const name = typeof body.name === "string" ? body.name.trim() : ""
  const details = typeof body.details === "string" ? body.details.trim() : ""
  const requestTypes = Array.isArray(body.requestTypes)
    ? body.requestTypes.filter(
        (t): t is string => typeof t === "string" && VALID_TYPES.has(t),
      )
    : []

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { success: false, message: "Please enter a valid email address" },
      { status: 400 },
    )
  }
  if (!requestTypes.length) {
    return NextResponse.json(
      { success: false, message: "Please choose at least one request" },
      { status: 400 },
    )
  }

  const received = new Date().toISOString()
  const record = {
    requestTypes: requestTypes.join(", "),
    email,
    name: name || "(not given)",
    details: details || "(none)",
    receivedAt: received,
    sourceIp: clientIpFromHeaders(request.headers) || "(unknown)",
    // CCPA allows 45 days, extendable once. Stated here so the deadline
    // travels with the request rather than being worked out later.
    respondBy: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
  }

  // Always log it: if Resend is unconfigured or the sending domain is not
  // verified, the server log is the only remaining record.
  console.info("[privacy-request]", JSON.stringify(record))

  await sendLeadNotification({
    formName: "Consumer privacy request (CCPA/CPRA)",
    fields: record,
    subjectHint: `${requestTypes.join(", ")} — ${email}`,
    replyTo: email,
  })

  return NextResponse.json({ success: true, message: "Request received" })
}
