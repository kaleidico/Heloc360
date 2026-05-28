// Input-mask helpers salvaged from the legacy 9-step form
// (components/mortgage-application/mortgage-application-form.tsx lines 266-288).
// Factored into a focused module so the new form and any future calculators
// share a single implementation.

// Format a raw user-typed string as US currency: "12345" -> "$12,345".
// Empty input returns "".
export function formatCurrency(value: string): string {
  const digits = value.replace(/\D/g, "")
  if (digits === "") return ""
  const num = parseInt(digits, 10)
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

// Parse a currency-masked string back to a number. "$12,345" -> 12345.
// Returns 0 for empty / non-numeric input.
export function parseCurrency(value: string): number {
  const digits = value.replace(/\D/g, "")
  if (digits === "") return 0
  return parseInt(digits, 10)
}

// Format a phone number as "(NNN) NNN-NNNN". Partial inputs are formatted
// progressively so the user sees the mask as they type.
export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "")
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}

// Strip non-digits and clamp to 10 chars (US ZIP+4 max).
export function normalizeZip(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10)
}
