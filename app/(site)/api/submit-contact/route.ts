import { NextRequest, NextResponse } from "next/server"
import { sendLeadNotification } from "@/lib/email/notify"

// Contact form backend. Previously the contact form only simulated a submission
// (a 2s timeout, no delivery). Now it posts here and the team is notified by email
// via Resend. Delivery is the notification itself — there is no separate webhook for
// general contact inquiries (unlike the mortgage/pre-qual lead routes).
export async function POST(request: NextRequest) {
  let data: Record<string, unknown>
  try {
    data = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 },
    )
  }

  const firstName = typeof data.firstName === "string" ? data.firstName.trim() : ""
  const lastName = typeof data.lastName === "string" ? data.lastName.trim() : ""
  const email = typeof data.email === "string" ? data.email.trim() : ""
  const phone = typeof data.phone === "string" ? data.phone.trim() : ""
  const reason = typeof data.reason === "string" ? data.reason.trim() : ""
  const message = typeof data.message === "string" ? data.message.trim() : ""
  const consent = data.consent === true

  if (!firstName || !lastName || !email || !reason || !message || !consent) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 },
    )
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { success: false, message: "Invalid email format" },
      { status: 400 },
    )
  }

  await sendLeadNotification({
    formName: "Contact",
    fields: { firstName, lastName, email, phone, reason, message, consent },
    subjectHint: `${firstName} ${lastName}`.trim() || email,
    replyTo: email,
  })

  return NextResponse.json({ success: true, message: "Sent" })
}
