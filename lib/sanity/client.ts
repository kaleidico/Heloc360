import 'server-only'
import { createClient, type SanityClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.SANITY_API_VERSION || '2024-12-01'

if (!projectId) {
  console.warn('NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Sanity fetches will fail at runtime.')
}

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
  projectId: projectId || 'missing-project-id',
  dataset,
  apiVersion,
  // Drafts are never on the CDN and require auth.
  useCdn: !previewDrafts,
  perspective,
  token: previewDrafts ? process.env.SANITY_API_READ_TOKEN : undefined,
})

// Server-side authenticated client — used when we need draft access or to bypass CDN.
export const sanityServerClient: SanityClient = createClient({
  projectId: projectId || 'missing-project-id',
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective,
})
