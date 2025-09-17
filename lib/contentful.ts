import 'server-only'

import type { BlogPost } from '@/types/blog'
import { blogPosts as localBlogPosts } from '@/data/blog-posts'
import { ALLOWED_CATEGORIES, pickFirstAllowedCategory, toAllowedCategoryOrDefault } from '@/config/blog'
import { decodeHtmlEntities } from '@/lib/utils'

type ContentfulSysLink = {
  sys: { id: string; linkType: string; type: string }
}

type ContentfulEntry<TFields> = {
  sys: { id: string; type: string; createdAt: string; updatedAt: string }
  fields: TFields
}

type ContentfulAsset = {
  sys: { id: string; type: string }
  fields: {
    title?: string
    description?: string
    file?: { url: string; contentType?: string; fileName?: string; details?: unknown }
  }
}

type BlogPostFields = {
  title: string
  slug: string
  categories?: string[]
  category?: string
  content?: string
  excerpt?: string
  publishDate: string
  featureImage?: ContentfulSysLink
  seoTitle?: string
  seoDescription?: string
  seoKeyword?: string
  focusKeywords?: string[]
}

type TeamMemberFields = {
  teamMemberName: string
  slug: string
  title?: string
  email?: string
  phone?: string
  linkedIn?: string
  twitter?: string
  about?: string
  photo?: ContentfulSysLink
}

export type TeamMember = {
  id: string
  name: string
  slug: string
  title?: string
  email?: string
  phone?: string
  linkedIn?: string
  twitter?: string
  bio?: string
  image?: string
}

type ContentfulCollectionResponse<TFields> = {
  items: Array<ContentfulEntry<TFields>>
  includes?: {
    Asset?: ContentfulAsset[]
  }
}

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const CONTENTFUL_ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master'
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN
const CONTENTFUL_HOST = process.env.CONTENTFUL_HOST || 'cdn.contentful.com'

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
  // Intentionally not throwing to allow local dev without Contentful; callers can handle empty results
  console.warn('Contentful env vars are not fully set. Set CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN.')
}

const BASE_URL = `https://${CONTENTFUL_HOST}/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}`

function estimateReadTimeInMinutes(text: string): number {
  const words = text?.trim().split(/\s+/).length || 0
  return Math.max(1, Math.ceil(words / 200))
}

function getAssetUrlById(assets: ContentfulAsset[] | undefined, id?: string): string | '' {
  if (!assets || !id) return ''
  const asset = assets.find((a) => a.sys.id === id)
  const rawUrl = asset?.fields?.file?.url
  if (!rawUrl) return ''
  // Ensure protocol
  return rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl
}

// Fallback: fetch asset directly if not included in collection response
async function fetchAssetUrlById(assetId: string): Promise<string | ''> {
  try {
    const data = await contentfulFetch<{ fields?: { file?: { url?: string } } }>(`/assets/${assetId}`)
    const rawUrl = data?.fields?.file?.url
    if (!rawUrl) return ''
    return rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl
  } catch {
    return ''
  }
}

async function mapEntryToBlogPost(
  entry: ContentfulEntry<BlogPostFields>,
  assets: ContentfulAsset[] | undefined,
): Promise<BlogPost> {
  const fields = entry.fields

  
  let categories: string[] = Array.isArray(fields.categories) ? fields.categories : []
  if ((!categories || categories.length === 0) && typeof fields.category === 'string') {
    const single = fields.category.trim()
    if (single.length > 0) {
      const parts = single.split(',').map((c) => c.trim()).filter(Boolean)
      categories = parts.length > 0 ? parts : [single]
    }
  }
  // Try content first, then excerpt as fallback
  const content = fields.content || fields.excerpt || ''
  const featuredImageId = fields.featureImage?.sys?.id
  
  // Derive values to fit existing BlogPost type without changing UI
  // Use the first category directly, or fall back to normalization
  let category = categories.length > 0 ? categories[0] : 'General'
  
  // Only normalize if the category isn't already in our allowed list
  if (!ALLOWED_CATEGORIES.includes(category as any)) {
    category = pickFirstAllowedCategory(categories)
  }
  
  // Decode HTML entities in the category
  category = decodeHtmlEntities(category)
  

  // Tags: until you add explicit tags in Contentful, we keep tags empty to avoid noise
  const tags: string[] = []
  const readTime = estimateReadTimeInMinutes(content)
  
  // Try to get featured image from included assets first
  let featuredImage = getAssetUrlById(assets, featuredImageId)
  
  // If no image found and we have an ID, try to fetch it directly
  if (!featuredImage && featuredImageId) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Fetching asset ${featuredImageId} directly for post ${fields.title}`)
    }
    featuredImage = await fetchAssetUrlById(featuredImageId)
  }
  
  // Fallback to placeholder if still no image
  if (!featuredImage) {
    featuredImage = '/placeholder.svg'
  }
  
  // Use seoDescription from Contentful if available, otherwise fall back to content slice or excerpt field
  const excerpt = fields.seoDescription || 
                  fields.excerpt || 
                  (content ? content.slice(0, 220).trim() + (content.length > 220 ? '…' : '') : '')

  // Heuristically mark as featured if a category named "Featured" is present
  const featured = categories.map((c) => c.toLowerCase()).includes('featured')

  return {
    id: entry.sys.id,
    title: fields.title,
    slug: fields.slug,
    excerpt,
    content,
    publishedDate: fields.publishDate,
    readTime,
    category,
    tags,
    featuredImage,
    featured,
    seoTitle: fields.seoTitle,
  }
}

async function mapEntryToTeamMember(
  entry: ContentfulEntry<TeamMemberFields>,
  assets: ContentfulAsset[] | undefined,
): Promise<TeamMember> {
  const fields = entry.fields
  
  // Get photo URL from included assets
  const photoId = fields.photo?.sys?.id
  let image = getAssetUrlById(assets, photoId)
  
  // If no image found and we have an ID, try to fetch it directly
  if (!image && photoId) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Fetching asset ${photoId} directly for team member ${fields.teamMemberName}`)
    }
    image = await fetchAssetUrlById(photoId)
  }
  
  // Fallback to placeholder if still no image
  if (!image) {
    image = '/placeholder.svg'
  }

  return {
    id: entry.sys.id,
    name: fields.teamMemberName,
    slug: fields.slug,
    title: fields.title,
    email: fields.email,
    phone: fields.phone,
    linkedIn: fields.linkedIn,
    twitter: fields.twitter,
    bio: fields.about,
    image,
  }
}

async function contentfulFetch<T>(pathnameAndQuery: string, init?: RequestInit) {
  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
    return null as unknown as T
  }

  const url = `${BASE_URL}${pathnameAndQuery}`
  const isDev = process.env.NODE_ENV !== 'production'
  // Simple retry with exponential backoff for rate limits and transient errors
  const maxAttempts = 3
  let attempt = 0
  let lastError: any

  while (attempt < maxAttempts) {
    attempt += 1
    const res = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
        ...(init?.headers || {}),
      },
      ...(isDev
        ? { cache: 'no-store' as const }
        : { next: { revalidate: 86400 } }),
    })

    if (res.ok) {
      return (await res.json()) as T
    }

    const status = res.status
    const body = await res.text()
    lastError = new Error(`Contentful request failed: ${status} - ${body}`)

    // Retry on 429/5xx
    if (status === 429 || (status >= 500 && status < 600)) {
      const backoffMs = Math.min(2000 * attempt, 5000)
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`Contentful retry ${attempt}/${maxAttempts} after ${status}. Backing off ${backoffMs}ms`)
      }
      await new Promise((r) => setTimeout(r, backoffMs))
      continue
    }

    console.error('Contentful fetch failed', status, body)
    throw lastError
  }

  console.error('Contentful fetch failed after retries', lastError)
  throw lastError
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const data = await contentfulFetch<ContentfulCollectionResponse<BlogPostFields>>(
      `/entries?content_type=blogPosts&include=1&order=-fields.publishDate&limit=1000`,
    )
    if (!data) {
      console.warn('Contentful returned null; falling back to local blog posts')
      return localBlogPosts
    }
    

    
    const assets = data.includes?.Asset
    const mapped = await Promise.all(data.items.map((entry) => mapEntryToBlogPost(entry, assets)))
    if (mapped.length === 0) {
      console.warn('No Contentful blog posts found; falling back to local blog posts')
      return localBlogPosts
    }
    return mapped
  } catch (err) {
    console.error('Failed to load blog posts from Contentful', err)
    return localBlogPosts
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const data = await contentfulFetch<ContentfulCollectionResponse<BlogPostFields>>(
      `/entries?content_type=blogPosts&fields.slug=${encodeURIComponent(slug)}&include=1&limit=1`,
    )
    if (!data || data.items.length === 0) {
      const local = localBlogPosts.find((p) => p.slug === slug)
      return local || null
    }
    const assets = data.includes?.Asset
    return await mapEntryToBlogPost(data.items[0], assets)
  } catch (err) {
    console.error('Failed to load blog post by slug from Contentful', err)
    const local = localBlogPosts.find((p) => p.slug === slug)
    return local || null
  }
}

export async function getAllTeamMembers(): Promise<TeamMember[]> {
  try {
    const data = await contentfulFetch<ContentfulCollectionResponse<TeamMemberFields>>(
      `/entries?content_type=teamMembers&include=1&order=fields.teamMemberName`,
    )
    if (!data) {
      console.warn('Contentful returned null for team members; returning empty array')
      return []
    }
    
    const assets = data.includes?.Asset
    const mapped = await Promise.all(data.items.map((entry) => mapEntryToTeamMember(entry, assets)))
    return mapped
  } catch (err) {
    console.error('Failed to load team members from Contentful', err)
    return []
  }
}

export async function getTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  try {
    const data = await contentfulFetch<ContentfulCollectionResponse<TeamMemberFields>>(
      `/entries?content_type=teamMembers&fields.slug=${encodeURIComponent(slug)}&include=1&limit=1`,
    )
    if (!data || data.items.length === 0) {
      return null
    }
    const assets = data.includes?.Asset
    return await mapEntryToTeamMember(data.items[0], assets)
  } catch (err) {
    console.error('Failed to load team member by slug from Contentful', err)
    return null
  }
}


