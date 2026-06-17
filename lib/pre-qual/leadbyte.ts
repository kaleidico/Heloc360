// Maps our internal pre-qual submission to the LeadByte lead payload shape
// expected by the woad webhook listener (which forwards leads into LeadByte).
//
// LeadByte identifies every field by its own `f_<id>_<name>` key (plus a few
// named keys like Contact_Preference). We only emit the fields we actually
// collect — unmapped LeadByte fields (DOB, credit score, occupancy, etc.) are
// omitted rather than sent as empty placeholders.
//
// `campid` identifies the LeadByte campaign and is REQUIRED by LeadByte; it is
// driven by the LEADBYTE_CAMPID env var. The route only switches to this shape
// when that var is set, so an unconfigured deploy keeps the previous behavior
// instead of posting campid-less (and therefore rejected) leads.

import type { PreQualSubmission } from "./schema"
import { computeEquity } from "./equity"

type OutboundFields = Omit<PreQualSubmission, "recaptchaToken">

export function toLeadBytePayload(data: OutboundFields): Record<string, string> {
  const payload: Record<string, string> = {}

  // Only write non-empty, trimmed string values. Keeps campid-less / blank
  // fields out of the payload entirely.
  const set = (key: string, value: string | number | undefined | null) => {
    if (value === undefined || value === null) return
    const s = String(value).trim()
    if (s) payload[key] = s
  }

  // Campaign + optional sub-id (both env-driven; LeadByte routes on these).
  set("campid", process.env.LEADBYTE_CAMPID)
  set("sid", process.env.LEADBYTE_SID)

  // Borrow amount = estimated HELOC borrowing power (85% CLTV − balance).
  const { borrowingPower } = computeEquity({
    homeValue: data.homeValue,
    mortgageBalance: data.mortgageBalance,
  })

  // Contact
  set("f_1_email", data.email)
  set("f_3_firstname", data.firstName)
  set("f_4_lastname", data.lastName)
  set("f_12_phone1", data.phone.replace(/\D/g, ""))
  set("Contact_Preference", data.bestTime)

  // Property
  set("f_168_property_city", data.city)
  set("f_133_short_state", data.state)
  set("f_166_property_zip", data.zipCode)
  set("f_106_property_worth", data.homeValue)
  set("f_105_borrow_amount", borrowingPower)

  // Attribution
  set("f_113_referer_url", data.referral)
  set("f_114_utm_medium", data.utmMedium)
  set("f_115_utm_term", data.utmTerm)
  set("f_116_utm_content", data.utmContent)
  set("f_117_utm_campaign", data.utmCampaign)

  return payload
}
