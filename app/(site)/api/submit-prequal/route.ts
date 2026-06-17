import { NextRequest, NextResponse } from "next/server"
import { PreQualSubmissionSchema } from "@/lib/pre-qual/schema"
import { sendLeadNotification } from "@/lib/email/notify"
import { toLeadBytePayload } from "@/lib/pre-qual/leadbyte"

// LeadByte REST API (account: kaleidico). Leads post here directly with a
// campaign id + API key; LeadByte rejects anything without a valid `key`.
const LEADBYTE_LEADS_URL = "https://kaleidico.leadbyte.com/restapi/v1.3/leads"

// Legacy webhook capture/inspection listener. NOT LeadByte — it does not
// forward leads anywhere. Kept as a best-effort mirror per request; failures
// here never affect the response.
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

// POST the mapped lead to LeadByte. Returns ok=false (with a message for the
// logs) on any transport error or LeadByte-side "Error" status.
async function postToLeadByte(
  fields: Record<string, string>,
  key: string,
): Promise<{ ok: boolean; message: string }> {
  try {
    const body = new URLSearchParams({ key, ...fields })
    const response = await fetch(LEADBYTE_LEADS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    })
    const text = await response.text()
    let json: { status?: string; code?: string; message?: string } | null = null
    try {
      json = JSON.parse(text)
    } catch {
      /* non-JSON body */
    }
    const status = String(json?.status ?? "").toLowerCase()
    // LeadByte error responses carry status:"Error". Treat anything else on a
    // 2xx as accepted.
    const ok = response.ok && status !== "error"
    return { ok, message: json?.message || text.slice(0, 300) || `HTTP ${response.status}` }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "fetch failed" }
  }
}

// Best-effort mirror to the legacy capture listener. Fire-and-forget — never
// throws, never blocks the response.
async function mirrorToWoad(payload: Record<string, unknown>): Promise<void> {
  try {
    await fetch(LENDER_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  } catch {
    /* ignore — non-critical */
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
  const mirror = {
    ...outbound,
    submittedAt: new Date().toISOString(),
    userAgent: request.headers.get("user-agent") || undefined,
  }

  const leadByteKey = process.env.LEADBYTE_API_KEY
  const campid = process.env.LEADBYTE_CAMPID

  // Primary delivery path: direct to LeadByte's REST API. Requires both the
  // API key and a campaign id; without them we fall back to the legacy
  // webhook-only behavior so an unconfigured deploy can't drop leads.
  if (leadByteKey && campid) {
    const result = await postToLeadByte(toLeadBytePayload(outbound), leadByteKey)
    if (!result.ok) {
      console.error("LeadByte rejected lead:", result.message)
      return NextResponse.json(
        { success: false, message: "Lead routing failed. Please try again." },
        { status: 502 },
      )
    }
    // Mirror + notify are additive and best-effort; never fail the lead on them.
    await mirrorToWoad(mirror)
    await sendLeadNotification({
      formName: "Pre-Qualification",
      fields: outbound,
      subjectHint:
        [data.firstName, data.lastName].filter(Boolean).join(" ") || data.email,
      replyTo: data.email,
    })
    return NextResponse.json({ success: true, message: "Submitted" })
  }

  // Fallback: LeadByte not configured — post to the legacy webhook listener.
  try {
    const response = await fetch(LENDER_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mirror),
    })
    if (!response.ok) {
      const errorText = await response.text().catch(() => "")
      console.error("Lender webhook returned non-OK:", response.status, errorText)
      return NextResponse.json(
        { success: false, message: "Lead routing failed. Please try again." },
        { status: 502 },
      )
    }
    await sendLeadNotification({
      formName: "Pre-Qualification",
      fields: outbound,
      subjectHint:
        [data.firstName, data.lastName].filter(Boolean).join(" ") || data.email,
      replyTo: data.email,
    })
    return NextResponse.json({ success: true, message: "Submitted" })
  } catch (error) {
    console.error("Lender webhook error:", error)
    return NextResponse.json(
      { success: false, message: "Lead routing failed. Please try again." },
      { status: 502 },
    )
  }
}
