import 'server-only'

/**
 * The visitor's IP, read from the request our own server already received.
 *
 * Replaces a browser-side call to api.ipify.org, which disclosed every
 * visitor's IP to an unrelated third party to learn something the server
 * already knew.
 *
 * On Vercel `x-forwarded-for` is set by the platform edge and its first entry
 * is the client. Anything further right in that list is a proxy hop, and the
 * header is trivially spoofable when the app is not behind a trusted proxy, so
 * treat the result as informational rather than as an identity.
 */
export function clientIpFromHeaders(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return headers.get('x-real-ip')?.trim() || ''
}
