import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'

// Deletes the nine blog posts retired by ClickUp 868kd5nv5 ("Site Cleanup").
//
// Run this ONLY AFTER the 301s in next.config.mjs are live — the redirects are
// what keep these URLs from 404ing once the documents are gone.
//
//   SANITY_API_WRITE_TOKEN=... node scripts/delete-retired-blog-posts.mjs        # dry run
//   SANITY_API_WRITE_TOKEN=... node scripts/delete-retired-blog-posts.mjs --yes  # delete
//
// A full copy of every document lives in docs/backups/2026-09-01-retired-blog-posts.ndjson,
// so a mistaken run is recoverable with `sanity dataset import <that file> production`.

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '2a445j5i',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-12-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const SLUGS = [
  'why-savvy-homeowners-are-turning-to-helocs-in-2025',
  'why-a-heloc-could-be-your-ultimate-financial-safety-net',
  'master-these-heloc-strategies-for-financial-success-2025',
  'unlocking-your-homes-hidden-potential-with-a-heloc',
  'whens-the-perfect-time-to-apply-for-a-heloc',
  'is-a-heloc-right-for-your-financial-future-2025-guide',
  'the-shocking-consequences-of-heloc-default',
  'helocs-in-a-post-covid-world-whats-changed',
  'why-a-heloc-is-your-ultimate-emergency-fund',
]

const BACKUP = 'docs/backups/2026-09-01-retired-blog-posts.ndjson'
const apply = process.argv.includes('--yes')

// Refuse to delete anything the backup file does not actually contain.
const backedUp = new Set(
  readFileSync(BACKUP, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line).slug?.current)
)
const missing = SLUGS.filter((s) => !backedUp.has(s))
if (missing.length) {
  throw new Error(`Backup ${BACKUP} is missing ${missing.length} of the posts: ${missing.join(', ')}`)
}

const docs = await client.fetch(
  `*[_type == "blogPost" && slug.current in $slugs]{_id, title, "slug": slug.current}`,
  { slugs: SLUGS }
)

console.log(`Matched ${docs.length} of ${SLUGS.length} retired slugs in Sanity:`)
for (const d of docs.sort((a, b) => a.slug.localeCompare(b.slug))) {
  console.log(`  ${d._id}  ${d.slug}`)
}

if (!apply) {
  console.log('\nDry run — nothing deleted. Re-run with --yes to apply.')
  process.exit(0)
}

// Drafts share the published id under a `drafts.` prefix; delete both.
const tx = docs.reduce(
  (t, d) => t.delete(d._id).delete(`drafts.${d._id}`),
  client.transaction()
)
await tx.commit({ visibility: 'async' })

const left = await client.fetch(`count(*[_type == "blogPost" && slug.current in $slugs])`, { slugs: SLUGS })
console.log(`\nDeleted ${docs.length} posts. Remaining matches: ${left}`)
