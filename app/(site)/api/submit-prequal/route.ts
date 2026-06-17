import { NextRequest, NextResponse } from "next/server"
import { PreQualSubmissionSchema } from "@/lib/pre-qual/schema"
import { sendLeadNotification } from "@/lib/email/notify"
import { toLeadBytePayload } from "@/lib/pre-qual/leadbyte"

// Same webhook destination the legacy submit-mortgage endpoint uses
// (app/api/submit-mortgage/route.ts line 11). Hardcoded here to match
// the existing pattern; both should move to an env var in a future
// tooling pass.
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

  // Forward to the lender webhook. Strip the token from the outbound payload
  // since the lender side doesn't need it after we've verified.
  const { recaptchaToken: _drop, ...outbound } = data

  // Posted to the woad webhook listener (NOT LeadByte directly — that wiring
  // is handled downstream of woad). When LEADBYTE_CAMPID is set we send the
  // LeadByte f_<id>_<name> field shape so the downstream forward can pass it
  // straight through; otherwise we post the legacy flat payload.
  const webhookBody = process.env.LEADBYTE_CAMPID
    ? toLeadBytePayload(outbound)
    : {
        ...outbound,
        submittedAt: new Date().toISOString(),
        userAgent: request.headers.get("user-agent") || undefined,
      }

  try {
    const response = await fetch(LENDER_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(webhookBody),
    })
    if (!response.ok) {
      const errorText = await response.text().catch(() => "")
      console.error("Lender webhook returned non-OK:", response.status, errorText)
      return NextResponse.json(
        { success: false, message: "Lead routing failed. Please try again." },
        { status: 502 },
      )
    }
    // Notify the team. Additive and best-effort — sendLeadNotification never
    // throws, so a mail failure cannot turn a delivered lead into an error.
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
