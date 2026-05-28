// ZIP → { city, state } lookup. Uses zippopotam.us (free, no key required),
// salvaged from the legacy 9-step form (components/mortgage-application/
// mortgage-application-form.tsx lines 218-263).
//
// Returns null on any failure (network, 404, malformed response). Callers
// should treat null as "no auto-fill" — the user can still type city/state
// manually if we ever surface those fields.

export interface ZipLocation {
  city: string
  state: string // 2-letter abbreviation
}

interface ZippopotamPlace {
  "place name": string
  "state abbreviation": string
}

interface ZippopotamResponse {
  places?: ZippopotamPlace[]
}

export async function lookupZip(zip: string): Promise<ZipLocation | null> {
  if (zip.length < 5) return null
  const fiveDigit = zip.slice(0, 5)
  try {
    const response = await fetch(`https://api.zippopotam.us/US/${fiveDigit}`)
    if (!response.ok) return null
    const data = (await response.json()) as ZippopotamResponse
    if (!data.places || data.places.length === 0) return null
    const first = data.places[0]
    if (!first["place name"] || !first["state abbreviation"]) return null
    return {
      city: first["place name"],
      state: first["state abbreviation"],
    }
  } catch {
    return null
  }
}
