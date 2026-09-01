import type { PortableTextBlock } from '@portabletext/types'
import type { UseCase } from '@/lib/pre-qual/use-case'

// Picks the pre-qual use case for a blog post's inline CTAs.
//
// Category alone is not a usable signal here: 185 of the 250 published posts sit in
// "General", so keying off it would send nearly every reader down the universal path.
// Slug and title carry the actual topic, so those are matched first and the category is
// only a fallback.

const SLUG_SIGNALS: ReadonlyArray<readonly [UseCase, RegExp]> = [
  ['debt-consolidation', /debt|consolidat|credit-card|payoff|pay-off|interest-rate-debt/],
  ['home-renovation', /renovat|remodel|home-improvement|kitchen|bathroom|addition|upgrade/],
  ['retirement-equity', /retire|senior|fixed-income|social-security|nest-egg/],
  ['self-employed-heloc', /self-employed|freelance|contractor|business-owner|1099|gig/],
]

const CATEGORY_FALLBACK: Record<string, UseCase> = {
  'home upgrades & renovations': 'home-renovation',
  'smart equity strategies': 'debt-consolidation',
  'heloc fundamentals': 'heloc-101',
  'rates & terms insights': 'heloc-101',
}

export function deriveUseCase(post: { slug: string; title: string; category?: string }): UseCase {
  const haystack = `${post.slug} ${post.title}`.toLowerCase().replace(/\s+/g, '-')
  for (const [useCase, pattern] of SLUG_SIGNALS) {
    if (pattern.test(haystack)) return useCase
  }
  const fromCategory = CATEGORY_FALLBACK[(post.category || '').toLowerCase()]
  return fromCategory || 'universal'
}

type CtaCopy = {
  /** Short prompt used mid-article, where the reader is still reading. */
  midHeading: string
  midBody: string
  /** Fuller pitch used after the article, where the reader has finished. */
  endHeading: string
  endBody: string
  action: string
}

const COPY: Record<UseCase, CtaCopy> = {
  universal: {
    midHeading: 'See what your equity could cover',
    midBody: 'Answer five questions and get matched with vetted HELOC lenders. No credit impact to check.',
    endHeading: 'Find out what you could qualify for',
    endBody:
      'Five questions, about two minutes, and no impact to your credit score to see where you stand. We match you with lenders from our vetted panel.',
    action: 'Check my options',
  },
  'debt-consolidation': {
    midHeading: 'See what consolidating could save you',
    midBody: 'Compare your equity against what you owe. Five questions, no credit impact to check.',
    endHeading: 'Put a real number on your savings',
    endBody:
      'Tell us your balance and your equity, and we will match you with lenders who handle consolidation. Five questions, no impact to your credit score to check.',
    action: 'See my savings',
  },
  'home-renovation': {
    midHeading: 'See what your project could draw on',
    midBody: 'Find out how much of your equity a renovation could tap. No credit impact to check.',
    endHeading: 'Fund the project without touching your mortgage rate',
    endBody:
      'A HELOC leaves your first mortgage where it is. Answer five questions to see what you could draw on, with no impact to your credit score to check.',
    action: 'See my available equity',
  },
  'retirement-equity': {
    midHeading: 'See what your equity could support',
    midBody: 'Understand your options before you draw on retirement savings. No credit impact to check.',
    endHeading: 'Understand your equity before you touch your savings',
    endBody:
      'Home equity can sit alongside retirement income rather than replacing it. Five questions to see what you could access, with no impact to your credit score to check.',
    action: 'See my options',
  },
  'heloc-101': {
    midHeading: 'Ready to see your own numbers?',
    midBody: 'Move from the general case to your case. Five questions, no credit impact to check.',
    endHeading: 'See how this applies to your home',
    endBody:
      'You know how a HELOC works. Five questions will show what you could actually qualify for, with no impact to your credit score to check.',
    action: 'See my numbers',
  },
  'self-employed-heloc': {
    midHeading: 'Self-employed? See which lenders fit',
    midBody: 'Our panel includes lenders who understand non-W2 income. No credit impact to check.',
    endHeading: 'Find lenders who understand self-employed income',
    endBody:
      'Non-W2 income narrows the field, but it does not close it. Answer five questions and we will match you with lenders on our panel who work with it.',
    action: 'See which lenders fit',
  },
}

export function ctaCopy(useCase: UseCase): CtaCopy {
  return COPY[useCase] || COPY.universal
}

/**
 * Where to break the article for the mid-article CTA.
 *
 * Aims for roughly 40% of the way in, but snaps to the nearest heading at or after that
 * point so the CTA sits at a section break instead of interrupting a paragraph. Returns 0
 * — meaning "don't place one" — for posts too short to be worth breaking up.
 */
export function splitIndexForCta(blocks: PortableTextBlock[] | undefined): number {
  if (!blocks || blocks.length < 8) return 0

  const target = Math.floor(blocks.length * 0.4)
  const isHeading = (b: PortableTextBlock) =>
    typeof b?.style === 'string' && /^h[234]$/.test(b.style)

  // Prefer the first heading at or after the target, provided it leaves enough article
  // on both sides for the break to read as intentional.
  for (let i = target; i < blocks.length - 3; i++) {
    if (isHeading(blocks[i])) return i
  }
  // Otherwise look backwards for one.
  for (let i = target; i >= 3; i--) {
    if (isHeading(blocks[i])) return i
  }
  return target
}

/**
 * Pre-qual URL carrying the use case plus the originating post, so the source of a lead
 * is visible in the lead record rather than collapsing into "blog".
 */
export function preQualHref(useCase: UseCase, slug: string): string {
  const params = new URLSearchParams({
    use: useCase,
    utm_source: 'blog',
    utm_medium: 'inline-cta',
    utm_content: slug,
  })
  return `/pre-qual?${params.toString()}`
}
