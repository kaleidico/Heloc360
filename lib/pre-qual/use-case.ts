// The 5 use-case verticals + a "universal" fallback for the standalone
// /pre-qual route (when there's no spoke context yet).
// Spec §4 IA: the 5 spoke routes are /debt-consolidation, /home-renovation,
// /retirement-equity, /heloc-101, /self-employed-heloc.

export const USE_CASES = [
  "universal",
  "debt-consolidation",
  "home-renovation",
  "retirement-equity",
  "heloc-101",
  "self-employed-heloc",
] as const

export type UseCase = (typeof USE_CASES)[number]

const PATH_TO_USE_CASE: Record<string, UseCase> = {
  "/debt-consolidation": "debt-consolidation",
  "/home-renovation": "home-renovation",
  "/retirement-equity": "retirement-equity",
  "/heloc-101": "heloc-101",
  "/self-employed-heloc": "self-employed-heloc",
}

// Infer the use case from a URL pathname. Returns "universal" if the path
// isn't a spoke route. Strips trailing /calculator etc. so /debt-consolidation/calculator
// still resolves to "debt-consolidation".
export function inferUseCaseFromPath(pathname: string | null | undefined): UseCase {
  if (!pathname) return "universal"
  for (const prefix of Object.keys(PATH_TO_USE_CASE)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return PATH_TO_USE_CASE[prefix]
    }
  }
  return "universal"
}
