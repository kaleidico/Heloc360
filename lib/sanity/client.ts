import 'server-only'
import { createClient, type SanityClient } from '@sanity/client'

/**
 * HELOC360's Sanity project id.
 *
 * Not a secret. It is public by construction: it appears in the URL of every
 * image this site serves (`cdn.sanity.io/images/2a445j5i/production/...`), and
 * in the client bundle of any Sanity front end.
 *
 * It is hardcoded because `dataset` and `apiVersion` below already have
 * defaults and this one did not, which made the build depend on an environment
 * variable that is absent in the Vercel project's Production environment. A
 * production build would otherwise come up with no project id and render every
 * page empty. The environment variable still takes precedence wherever it is
 * set, so other datasets and environments stay configurable.
 */
const DEFAULT_PROJECT_ID = '2a445j5i'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || DEFAULT_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.SANITY_API_VERSION || '2024-12-01'

/**
 * Local content preview.
 *
 * Set SANITY_PREVIEW_DRAFTS=1 to read unpublished drafts instead of published
 * documents. Intended for reviewing content edits on localhost before anyone
 * publishes them.
 *
 * Unset (the default, and what production runs) means 'published': drafts are
 * invisible to the live site, so staging a content change as a draft cannot
 * leak to visitors. Reading drafts needs a token and bypasses the CDN, so this
 * is deliberately opt-in rather than automatic.
 */
const previewDrafts = process.env.SANITY_PREVIEW_DRAFTS === '1'
const perspective = previewDrafts ? 'drafts' : 'published'

if (previewDrafts) {
  console.warn(
    'SANITY_PREVIEW_DRAFTS=1 — serving UNPUBLISHED drafts. Never set this in production.',
  )
}

// Public read client — uses CDN for fast cached reads.
export const sanityClient: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // Drafts are never on the CDN and require auth.
  useCdn: !previewDrafts,
  perspective,
  token: previewDrafts ? process.env.SANITY_API_READ_TOKEN : undefined,
})

// Server-side authenticated client — used when we need draft access or to bypass CDN.
export const sanityServerClient: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective,
})
