import { NextRequest, NextResponse } from "next/server"
import { PreQualSubmissionSchema } from "@/lib/pre-qual/schema"

// Same webhook destination the legacy submit-mortgage endpoint uses
// (app/api/submit-mortgage/route.ts line 11). Hardcoded here to match
// the existing pattern; both should move to an env var in a future
// tooling pass.
const LENDER_WEBHOOK_URL =
  "https://webhooks-listener-woad.vercel.app/api/webhook/f129713b-67b2-4302-9ca0-b2884e21d682"

const HCAPTCHA_VERIFY_URL = "https://api.hcaptcha.com/siteverify"

interface HCaptchaVerifyResponse {
  success: boolean
  "error-codes"?: string[]
}

async function verifyHCaptcha(token: string, secret: string): Promise<boolean> {
  try {
    const body = new URLSearchParams({ response: token, secret })
    const response = await fetch(HCAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    })
    if (!response.ok) return false
    const data = (await response.json()) as HCaptchaVerifyResponse
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

  // hCaptcha verification — only enforced when HCAPTCHA_SECRET is set.
  // Mirrors the existing 9-step form's dev-skip pattern.
  const hcaptchaSecret = process.env.HCAPTCHA_SECRET
  if (hcaptchaSecret) {
    if (!data.hcaptchaToken) {
      return NextResponse.json(
        { success: false, message: "hCaptcha required" },
        { status: 400 },
      )
    }
    const ok = await verifyHCaptcha(data.hcaptchaToken, hcaptchaSecret)
    if (!ok) {
      return NextResponse.json(
        { success: false, message: "hCaptcha verification failed" },
        { status: 400 },
      )
    }
  }

  // Forward to the lender webhook. Strip the token from the outbound payload
  // since the lender side doesn't need it after we've verified.
  const { hcaptchaToken: _drop, ...outbound } = data

  try {
    const response = await fetch(LENDER_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...outbound,
        submittedAt: new Date().toISOString(),
        userAgent: request.headers.get("user-agent") || undefined,
      }),
    })
    if (!response.ok) {
      const errorText = await response.text().catch(() => "")
      console.error("Lender webhook returned non-OK:", response.status, errorText)
      return NextResponse.json(
        { success: false, message: "Lead routing failed. Please try again." },
        { status: 502 },
      )
    }
    return NextResponse.json({ success: true, message: "Submitted" })
  } catch (error) {
    console.error("Lender webhook error:", error)
    return NextResponse.json(
      { success: false, message: "Lead routing failed. Please try again." },
      { status: 502 },
    )
  }
}
