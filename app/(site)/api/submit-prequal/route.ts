import { NextRequest, NextResponse } from "next/server"
import { PreQualSubmissionSchema } from "@/lib/pre-qual/schema"
import { sendLeadNotification } from "@/lib/email/notify"
import { toLeadBytePayload } from "@/lib/pre-qual/leadbyte"
import { clientIpFromHeaders } from "@/lib/request-ip"

// LeadByte REST API (account: kaleidico). Direct lead delivery — leads post
// here with campid + a valid `key`. This is additive to the woad webhook
// below; both fire on every submission.
const LEADBYTE_LEADS_URL = "https://kaleidico.leadbyte.com/restapi/v1.3/leads"

// Webhook capture/inspection listener (the woad->downstream pipe). Kept as a
// required destination alongside LeadByte.
const LENDER_WEBHOOK_URL =
  "https://webhooks-listener-woad.vercel.app/api/webhook/f129713b-67b2-4302-9ca0-b2884e21d682"

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify"

interface RecaptchaVerifyResponse {
  success: boolean
  "error-codes"?: string[]
}

async function verifyRecaptcha(token: string, secret: string): Promise<boolean> {
  try {
    const body = new URLSearchParams({ response: token, secret })
    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    })
    if (!response.ok) return false
    const data = (await response.json()) as RecaptchaVerifyResponse
    return data.success === true
  } catch {
    return false
  }
}

type DeliveryResult = { dest: string; ok: boolean; message: string }

// POST the JSON payload to the woad webhook listener.
async function postToWoad(body: unknown): Promise<DeliveryResult> {
  try {
    const response = await fetch(LENDER_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      const text = await response.text().catch(() => "")
      return { dest: "woad", ok: false, message: `HTTP ${response.status} ${text.slice(0, 200)}` }
    }
    return { dest: "woad", ok: true, message: "ok" }
  } catch (error) {
    return { dest: "woad", ok: false, message: error instanceof Error ? error.message : "fetch failed" }
  }
}

// POST the mapped lead directly to LeadByte's REST API. LeadByte error
// responses carry status:"Error"; anything else on a 2xx is treated as accepted.
async function postToLeadByte(fields: Record<string, string>, key: string): Promise<DeliveryResult> {
  try {
    const body = new URLSearchParams({ key, ...fields })
    const response = await fetch(LEADBYTE_LEADS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    })
    const text = await response.text()
    let json: { status?: string; message?: string } | null = null
    try {
      json = JSON.parse(text)
    } catch {
      /* non-JSON body */
    }
    const status = String(json?.status ?? "").toLowerCase()
    const ok = response.ok && status !== "error"
    return { dest: "leadbyte", ok, message: json?.message || text.slice(0, 300) || `HTTP ${response.status}` }
  } catch (error) {
    return { dest: "leadbyte", ok: false, message: error instanceof Error ? error.message : "fetch failed" }
  }
}

export async function POST(request: NextRequest) {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 },
    )
  }

  const parsed = PreQualSubmissionSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    )
  }

  const data = parsed.data

  // reCAPTCHA verification — only enforced when RECAPTCHA_SECRET_KEY is set,
  // so local/dev without the secret still works.
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY
  if (recaptchaSecret) {
    if (!data.recaptchaToken) {
      return NextResponse.json(
        { success: false, message: "reCAPTCHA required" },
        { status: 400 },
      )
    }
    const ok = await verifyRecaptcha(data.recaptchaToken, recaptchaSecret)
    if (!ok) {
      return NextResponse.json(
        { success: false, message: "reCAPTCHA verification failed" },
        { status: 400 },
      )
    }
  }

  // Strip the token from anything we forward — it's spent after verification.
  const { recaptchaToken: _drop, ...outbound } = data

  const campid = process.env.LEADBYTE_CAMPID
  const leadByteKey = process.env.LEADBYTE_API_KEY

  // Read the IP from the request we already have rather than asking the
  // browser to fetch it from a third party. Recorded alongside the consent,
  // since "who agreed, from where, and when" is what makes a consent record
  // worth keeping.
  const clientIp = clientIpFromHeaders(request.headers)
  const leadByteFields = {
    ...toLeadBytePayload(outbound),
    ...(clientIp ? { ip_address: clientIp } : {}),
  }

  // The woad webhook gets the LeadByte field shape when a campid is configured
  // (so its downstream forward can pass through), else the legacy flat payload.
  const woadBody = campid
    ? leadByteFields
    : {
        ...outbound,
        submittedAt: new Date().toISOString(),
        userAgent: request.headers.get("user-agent") || undefined,
        ipAddress: clientIp || undefined,
      }

  // Fire both destinations in parallel. The helpers never throw, so a failure
  // in one can't abort the other.
  const deliveries: Promise<DeliveryResult>[] = [postToWoad(woadBody)]
  if (leadByteKey && campid) {
    deliveries.push(postToLeadByte(leadByteFields, leadByteKey))
  }
  const results = await Promise.all(deliveries)

  const failures = results.filter((r) => !r.ok)
  for (const f of failures) {
    console.error(`Lead delivery to ${f.dest} failed:`, f.message)
  }

  // Only error to the visitor if EVERY delivery failed (lead would be lost).
  // A partial failure is logged but still reported as success so the visitor
  // isn't asked to resubmit (which would duplicate into the pipe that worked).
  if (results.every((r) => !r.ok)) {
    return NextResponse.json(
      { success: false, message: "Lead routing failed. Please try again." },
      { status: 502 },
    )
  }

  // Team notification — additive and best-effort; never fails the lead.
  await sendLeadNotification({
    formName: "Pre-Qualification",
    fields: outbound,
    subjectHint:
      [data.firstName, data.lastName].filter(Boolean).join(" ") || data.email,
    replyTo: data.email,
  })

  return NextResponse.json({ success: true, message: "Submitted" })
}
