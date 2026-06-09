#!/usr/bin/env node
// Transforms _archive/contentful-export.json → _archive/out.ndjson.
// - Maps blogPosts → blogPost docs with body as Portable Text.
// - Maps teamMembers → teamMember docs.
// - Resolves asset references via _archive/asset-map.json.
// - Normalizes categories via the ported findBestMatch from config/blog.ts.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { JSDOM } from 'jsdom'
import { marked } from 'marked'
import { htmlToBlocks } from '@portabletext/block-tools'
import { Schema } from '@sanity/schema'

const __dirname = dirname(fileURLToPath(import.meta.url))
const archiveDir = resolve(__dirname, '_archive')

const exportPath = resolve(archiveDir, 'contentful-export.json')
const assetMapPath = resolve(archiveDir, 'asset-map.json')
const outPath = resolve(archiveDir, 'out.ndjson')

if (!existsSync(exportPath) || !existsSync(assetMapPath)) {
  console.error('Missing _archive/contentful-export.json or asset-map.json. Run 01 and 02 first.')
  process.exit(1)
}

const exportData = JSON.parse(readFileSync(exportPath, 'utf8'))
const assetMap = JSON.parse(readFileSync(assetMapPath, 'utf8'))

// === Category normalization (ported verbatim from config/blog.ts findBestMatch) ===

const ALLOWED_CATEGORIES = [
  'General',
  'HELOC Fundamentals',
  'HELOC Tips & Success Stories',
  'Home Upgrades & Renovations',
  'Rates & Terms Insights',
  'Smart Equity Strategies',
]

function decodeHtmlEntities(text) {
  if (!text) return text
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
}

function canonicalize(input) {
  return input
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function findBestMatch(input) {
  if (!input) return 'General'
  const decoded = decodeHtmlEntities(input)
  const normalized = canonicalize(decoded)

  if (ALLOWED_CATEGORIES.includes(decoded)) return decoded
  if (ALLOWED_CATEGORIES.includes(input)) return input

  const canonicalMatch = ALLOWED_CATEGORIES.find((c) => canonicalize(c) === normalized)
  if (canonicalMatch) return canonicalMatch

  const partialMatch = ALLOWED_CATEGORIES.find(
    (c) => canonicalize(c).includes(normalized) || normalized.includes(canonicalize(c)),
  )
  if (partialMatch) return partialMatch

  return 'General'
}

function normalizeCategories(raw) {
  const out = new Set()
  for (const c of raw) {
    if (typeof c !== 'string') continue
    out.add(findBestMatch(c))
  }
  return Array.from(out)
}

// === Block content type for htmlToBlocks (mirrors sanity/schemas/blogPost.ts body field) ===

const defaultSchema = Schema.compile({
  name: 'default',
  types: [
    {
      type: 'object',
      name: 'blogPost',
      fields: [
        {
          title: 'Body',
          name: 'body',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
                { title: 'H4', value: 'h4' },
                { title: 'Quote', value: 'blockquote' },
              ],
              lists: [
                { title: 'Bullet', value: 'bullet' },
                { title: 'Numbered', value: 'number' },
              ],
              marks: {
                decorators: [
                  { title: 'Strong', value: 'strong' },
                  { title: 'Emphasis', value: 'em' },
                  { title: 'Code', value: 'code' },
                ],
                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    title: 'Link',
                    fields: [{ name: 'href', type: 'url', title: 'URL' }],
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
})

const blockContentType = defaultSchema.get('blogPost').fields.find((f) => f.name === 'body').type

function markdownToPortableText(markdown) {
  if (!markdown || typeof markdown !== 'string') return []
  const html = marked.parse(markdown)
  return htmlToBlocks(html, blockContentType, {
    parseHtml: (htmlStr) => new JSDOM(htmlStr).window.document,
  })
}

// === Helpers ===

function getLocalized(field) {
  if (field == null) return null
  if (typeof field !== 'object') return field
  return field['en-US'] ?? Object.values(field)[0]
}

// Lookup: Contentful asset ID → en-US description (used as image alt text).
const assetDescriptionMap = Object.fromEntries(
  (exportData.assets || [])
    .map((a) => [a.sys?.id, getLocalized(a.fields?.description)])
    .filter(([id, d]) => id && typeof d === 'string' && d.trim()),
)

function buildImageRef(contentfulAssetLink) {
  if (!contentfulAssetLink) return null
  const cfAssetId = contentfulAssetLink?.sys?.id
  if (!cfAssetId) return null
  const mapped = assetMap[cfAssetId]
  if (!mapped) {
    console.warn(`Asset ${cfAssetId} not in asset-map.json — skipping image`)
    return null
  }
  const alt = assetDescriptionMap[cfAssetId]
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: mapped._id },
    ...(alt ? { alt } : {}),
  }
}

function safeSlug(slug) {
  return { _type: 'slug', current: String(slug || '').slice(0, 96) }
}

// === Walk entries ===

const docs = []
const entries = exportData.entries || []
let blogCount = 0
let teamCount = 0
let skipped = 0

for (const entry of entries) {
  const contentTypeId = entry.sys?.contentType?.sys?.id
  const id = entry.sys?.id
  const fields = entry.fields || {}

  if (contentTypeId === 'blogPosts') {
    const title = getLocalized(fields.title)
    const slug = getLocalized(fields.slug)
    if (!title || !slug) {
      console.warn(`Skipping blogPost ${id}: missing title or slug`)
      skipped += 1
      continue
    }

    const rawCategories =
      getLocalized(fields.categories) ||
      (typeof getLocalized(fields.category) === 'string'
        ? getLocalized(fields.category).split(',').map((s) => s.trim()).filter(Boolean)
        : [])

    const doc = {
      _type: 'blogPost',
      _id: `blogPost-${id}`,
      title: String(title),
      slug: safeSlug(slug),
      categories: normalizeCategories(rawCategories),
      body: markdownToPortableText(getLocalized(fields.content)),
      excerpt: getLocalized(fields.excerpt) || undefined,
      publishDate: getLocalized(fields.publishDate),
      featureImage: buildImageRef(getLocalized(fields.featureImage)) || undefined,
      seoTitle: getLocalized(fields.seoTitle) || undefined,
      seoDescription: getLocalized(fields.seoDescription) || undefined,
      seoKeyword: getLocalized(fields.seoKeyword) || undefined,
      focusKeywords: getLocalized(fields.focusKeywords) || undefined,
    }

    // Strip undefined keys so the NDJSON is clean.
    for (const k of Object.keys(doc)) if (doc[k] === undefined) delete doc[k]
    docs.push(doc)
    blogCount += 1
  } else if (contentTypeId === 'teamMembers') {
    const name = getLocalized(fields.teamMemberName)
    const slug = getLocalized(fields.slug)
    if (!name || !slug) {
      console.warn(`Skipping teamMember ${id}: missing name or slug`)
      skipped += 1
      continue
    }

    const doc = {
      _type: 'teamMember',
      _id: `teamMember-${id}`,
      teamMemberName: String(name),
      slug: safeSlug(slug),
      title: getLocalized(fields.title) || undefined,
      email: getLocalized(fields.email) || undefined,
      phone: getLocalized(fields.phone) || undefined,
      linkedIn: getLocalized(fields.linkedIn) || undefined,
      twitter: getLocalized(fields.twitter) || undefined,
      about: getLocalized(fields.about) || undefined,
      photo: buildImageRef(getLocalized(fields.photo)) || undefined,
    }

    for (const k of Object.keys(doc)) if (doc[k] === undefined) delete doc[k]
    docs.push(doc)
    teamCount += 1
  } else {
    skipped += 1
  }
}

const ndjson = docs.map((d) => JSON.stringify(d)).join('\n') + '\n'
writeFileSync(outPath, ndjson, 'utf8')

console.log(`\nTransform complete.`)
console.log(`  Blog posts: ${blogCount}`)
console.log(`  Team members: ${teamCount}`)
console.log(`  Skipped: ${skipped}`)
console.log(`  NDJSON: ${outPath}`)
