import { decodeHtmlEntities } from '@/lib/utils'

export const ALLOWED_CATEGORIES = [
  'General',
  'HELOC Fundamentals',
  'HELOC Tips & Success Stories',
  'Home Upgrades & Renovations',
  'Rates & Terms Insights',
  'Smart Equity Strategies',
] as const

export type AllowedCategory = (typeof ALLOWED_CATEGORIES)[number]

function canonicalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

// More flexible matching for Contentful categories
function findBestMatch(input: string): AllowedCategory {
  if (!input) return 'General'
  
  // Decode HTML entities first
  const decodedInput = decodeHtmlEntities(input)
  const normalized = canonicalize(decodedInput)
  
  // First try exact match with decoded input
  const exactMatch = ALLOWED_CATEGORIES.find(c => c === decodedInput)
  if (exactMatch) {
    return exactMatch
  }
  
  // Then try exact match with original input
  const exactMatchOriginal = ALLOWED_CATEGORIES.find(c => c === input)
  if (exactMatchOriginal) {
    return exactMatchOriginal
  }
  
  // Then try canonicalized match
  const canonicalMatch = ALLOWED_CATEGORIES.find(c => canonicalize(c) === normalized)
  if (canonicalMatch) {
    return canonicalMatch
  }
  
  // Finally try partial matching
  const partialMatch = ALLOWED_CATEGORIES.find(c => 
    canonicalize(c).includes(normalized) || normalized.includes(canonicalize(c))
  )
  if (partialMatch) {
    return partialMatch
  }
  
  return 'General'
}

export function toAllowedCategoryOrDefault(value: string | undefined | null): AllowedCategory {
  if (!value) return 'General'
  return findBestMatch(value)
}

export function pickFirstAllowedCategory(values: Array<string | undefined> | undefined): AllowedCategory {
  if (!values || values.length === 0) {
    return 'General'
  }
  
  // Find the best available category (prioritize non-General)
  let bestCategory: AllowedCategory = 'General'
  
  for (const v of values) {
    if (v && v.trim()) {
      const c = toAllowedCategoryOrDefault(v)
      
      // If we find a non-General category, use it
      if (c && c !== 'General') {
        return c
      }
      
      // Keep track of the first valid category we find (even if it's General)
      if (bestCategory === 'General' && c) {
        bestCategory = c
      }
    }
  }
  
  return bestCategory
}


