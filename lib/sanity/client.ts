import 'server-only'
import { createClient, type SanityClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.SANITY_API_VERSION || '2024-12-01'

if (!projectId) {
  console.warn('NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Sanity fetches will fail at runtime.')
}

// Public read client — uses CDN for fast cached reads.
export const sanityClient: SanityClient = createClient({
  projectId: projectId || 'missing-project-id',
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})

// Server-side authenticated client — used when we need draft access or to bypass CDN.
export const sanityServerClient: SanityClient = createClient({
  projectId: projectId || 'missing-project-id',
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: 'published',
})
