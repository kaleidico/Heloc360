/**
 * TCPA consent for the pre-qual form.
 *
 * The text a visitor agreed to is stored with the lead, so this file is the
 * single source of truth: the words rendered on the form and the words written
 * to the CRM come from the same constant and cannot drift apart. In a TCPA
 * dispute the stored record is the defence, and a record of consent to text
 * nobody can reproduce is worth very little.
 *
 * Bump CONSENT_TEXT_VERSION whenever the wording changes, so leads can be tied
 * back to the exact version they saw.
 */

export const CONSENT_TEXT_VERSION = "tcpa-v1"

export const TCPA_CONSENT_TEXT =
  "By checking this box and clicking “Talk to an advisor”, I give my prior " +
  "express written consent for HELOC360, a service of My Perfect Leads, LLC, and its " +
  "network of lender partners to contact me at the phone number and email address I " +
  "provided. I understand these calls and text messages may be made using an automatic " +
  "telephone dialing system or an artificial or prerecorded voice, including where my " +
  "number is on a state or national Do Not Call list. I understand that my consent is " +
  "NOT a condition of purchasing any property, goods or services, and that I may " +
  "instead call HELOC360 directly. Message and data rates may apply. I may revoke this " +
  "consent at any time by replying STOP to a text, telling the caller to stop, or " +
  "emailing compliance@heloc360.com."

/**
 * Shown beneath the button. Replaces an earlier line that read "We share your
 * info only after you approve a specific lender", which described a lender
 * approval step the site does not have: leads are transmitted on submit.
 */
export const POST_SUBMIT_DISCLOSURE =
  "No credit pull is performed to see your options. When you submit this form we share " +
  "your details with our lender partners so they can contact you about a HELOC."
