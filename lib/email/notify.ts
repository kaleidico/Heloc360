// Lead-notification email via Resend (REST API — no SDK dependency).
//
// Sends an internal "new submission" alert to the team whenever a site form is
// submitted. This is ADDITIVE: forms keep their existing delivery (lender webhook,
// Zapier). A notification failure must never break the user's submission, so every
// path here is wrapped and the function resolves void instead of throwing.
//
// Env-gated like the hCaptcha check: with no RESEND_API_KEY set, this is a silent
// no-op. Recipient/sender are overridable via env but default to the values Robert
// specified. NOTE: the `from` domain (heloc360.com) must be a VERIFIED domain in the
// Resend account or the API call will 4xx — until then this logs and moves on.

const RESEND_API_URL = "https://api.resend.com/emails"
const DEFAULT_TO = "support@kaleidico.com"
const DEFAULT_FROM = "HELOC360 Website <leads@heloc360.com>"

type FieldMap = Record<string, unknown>

function humanizeKey(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—"
  if (typeof value === "boolean") return value ? "Yes" : "No"
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

function buildRows(fields: FieldMap): string {
  return Object.entries(fields)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600;color:#00274C;white-space:nowrap;">${humanizeKey(
          k,
        )}</td><td style="padding:6px 12px;border:1px solid #e5e7eb;color:#111827;">${formatValue(
          v,
        )}</td></tr>`,
    )
    .join("")
}

function buildText(fields: FieldMap): string {
  return Object.entries(fields)
    .map(([k, v]) => `${humanizeKey(k)}: ${formatValue(v)}`)
    .join("\n")
}

/**
 * Send an internal lead-notification email. Resolves void; never throws.
 * @param formName  Human label used in the subject (e.g. "Pre-Qualification").
 * @param fields    Submitted field map, rendered as a key/value table.
 * @param subjectHint  Optional name/email to append to the subject line.
 * @param replyTo   Optional submitter email so the team can reply directly.
 */
export async function sendLeadNotification(opts: {
  formName: string
  fields: FieldMap
  subjectHint?: string
  replyTo?: string
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return // not configured — silent no-op

  const to = process.env.LEAD_NOTIFY_TO || DEFAULT_TO
  const from = process.env.LEAD_NOTIFY_FROM || DEFAULT_FROM
  const subject = opts.subjectHint
    ? `New ${opts.formName} submission — ${opts.subjectHint}`
    : `New ${opts.formName} submission`

  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px;margin:0 auto;">
    <h2 style="color:#00274C;border-bottom:3px solid #FFCB05;padding-bottom:8px;">New ${opts.formName} submission</h2>
    <p style="color:#374151;">A visitor submitted the <strong>${opts.formName}</strong> form on the HELOC360 website.</p>
    <table style="border-collapse:collapse;width:100%;font-size:14px;">${buildRows(opts.fields)}</table>
    <p style="color:#9ca3af;font-size:12px;margin-top:16px;">Sent automatically by the HELOC360 website.</p>
  </div>`

  const text = `New ${opts.formName} submission\n\n${buildText(opts.fields)}\n`

  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        text,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      }),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => "")
      console.error("Resend notification failed:", res.status, body)
    }
  } catch (error) {
    console.error("Resend notification error:", error)
  }
}
