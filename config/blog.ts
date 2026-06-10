// Canonical category list. After the Sanity migration, posts arrive with
// categories already canonicalized (the migration ran the old findBestMatch
// once at import time). Editors in Sanity Studio author against this list.
//
// Keep this exported so UI components can render a category picker / filter
// against it.

export const CATEGORIES = [
  'General',
  'HELOC Fundamentals',
  'HELOC Tips & Success Stories',
  'Home Upgrades & Renovations',
  'Rates & Terms Insights',
  'Smart Equity Strategies',
] as const

export type Category = (typeof CATEGORIES)[number]
