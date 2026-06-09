// Image URL builder.
//
// IMPORTANT: this file is imported by `components/blog/portable-text.tsx` (a
// Client Component), so it MUST NOT pull in `./client.ts` — that file has
// `import 'server-only'` and would crash the client bundle. `@sanity/image-url`
// only needs `{ projectId, dataset }` config, not the full Sanity client, so
// we pass raw env-var values directly. Same code runs on server (mapBlogPost
// in api.ts) and client (PortableText image renderer).

import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'missing-project-id'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

const builder = imageUrlBuilder({ projectId, dataset })

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export function imageUrl(source: SanityImageSource | undefined | null): string {
  if (!source) return '/placeholder.svg'
  return urlFor(source).auto('format').url()
}
