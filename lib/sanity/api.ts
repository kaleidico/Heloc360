import 'server-only'

import type { PortableTextBlock } from '@portabletext/types'
import type { BlogPost } from '@/types/blog'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { sanityClient } from './client'
import { imageUrl } from './image'
import {
  ALL_BLOG_POSTS_QUERY,
  BLOG_POST_BY_SLUG_QUERY,
  BLOG_CARDS_QUERY,
  BLOG_CARDS_COUNT_QUERY,
  BLOG_CATEGORIES_QUERY,
  ALL_TEAM_MEMBERS_QUERY,
  TEAM_MEMBER_BY_SLUG_QUERY,
} from './queries'

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

// Raw shapes that come back from GROQ before mapping into the BlogPost / TeamMember interfaces.
type RawBlogPost = {
  id: string
  title: string
  slug: string
  excerpt?: string
  body?: PortableTextBlock[]
  publishDate: string
  categories: string[]
  featureImage?: SanityImageSource & { alt?: string }
  featureImageAlt?: string
  seoTitle?: string
  seoDescription?: string
}

type RawTeamMember = {
  id: string
  name: string
  slug: string
  title?: string
  email?: string
  phone?: string
  linkedIn?: string
  twitter?: string
  bio?: string
  photo?: SanityImageSource
}

const READ_TAGS = { tags: ['post'] }
const TEAM_TAGS = { tags: ['team'] }

function estimateReadTimeFromBlocks(blocks: PortableTextBlock[] | undefined): number {
  if (!blocks || blocks.length === 0) return 1
  let words = 0
  for (const block of blocks) {
    if ((block as any)._type !== 'block') continue
    const children = (block as any).children || []
    for (const child of children) {
      if (typeof child.text === 'string') {
        words += child.text.trim().split(/\s+/).filter(Boolean).length
      }
    }
  }
  return Math.max(1, Math.ceil(words / 200))
}

function excerptFromBlocks(blocks: PortableTextBlock[] | undefined, max = 220): string {
  if (!blocks) return ''
  let text = ''
  for (const block of blocks) {
    if ((block as any)._type !== 'block') continue
    const children = (block as any).children || []
    for (const child of children) {
      if (typeof child.text === 'string') text += child.text + ' '
      if (text.length >= max) break
    }
    if (text.length >= max) break
  }
  text = text.trim()
  if (text.length > max) text = text.slice(0, max).trim() + '…'
  return text
}

function mapBlogPost(raw: RawBlogPost): BlogPost {
  const categories = Array.isArray(raw.categories) ? raw.categories : []
  const category = categories[0] || 'General'
  const featured = categories.map((c) => c.toLowerCase()).includes('featured')
  const body = raw.body || []
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.seoDescription || raw.excerpt || excerptFromBlocks(body),
    body,
    publishedDate: raw.publishDate,
    readTime: estimateReadTimeFromBlocks(body),
    category,
    tags: [],
    featuredImage: imageUrl(raw.featureImage),
    featureImageAlt: raw.featureImageAlt,
    featured,
    seoTitle: raw.seoTitle,
  }
}

function mapTeamMember(raw: RawTeamMember): TeamMember {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    title: raw.title,
    email: raw.email,
    phone: raw.phone,
    linkedIn: raw.linkedIn,
    twitter: raw.twitter,
    bio: raw.bio,
    image: raw.photo ? imageUrl(raw.photo) : '/placeholder.svg',
  }
}

/** A listing card. Same shape as BlogPost minus the article body. */
export type BlogCard = Omit<BlogPost, 'body'>

type RawBlogCard = Omit<RawBlogPost, 'body'> & {
  wordCount?: number
  autoExcerpt?: string
}

function mapBlogCard(raw: RawBlogCard): BlogCard {
  const categories = Array.isArray(raw.categories) ? raw.categories : []
  const words = raw.wordCount ?? 0
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    // Same precedence as the full mapper; the GROQ-computed autoExcerpt stands
    // in for the body-derived fallback.
    excerpt:
      raw.seoDescription || raw.excerpt || (raw.autoExcerpt ? `${raw.autoExcerpt}…` : ''),
    publishedDate: raw.publishDate,
    readTime: Math.max(1, Math.ceil(words / 200)),
    category: categories[0] || 'General',
    tags: [],
    featuredImage: imageUrl(raw.featureImage),
    featureImageAlt: raw.featureImageAlt,
    featured: categories.map((c) => c.toLowerCase()).includes('featured'),
    seoTitle: raw.seoTitle,
  }
}

export type BlogListing = {
  posts: BlogCard[]
  total: number
  totalPages: number
  page: number
  perPage: number
}

/**
 * One page of blog cards, filtered and paginated in Sanity.
 *
 * Search runs server-side against the body via `pt::text()`, so full-text
 * search still works while the browser only ever receives the current page.
 */
export async function getBlogCards({
  page = 1,
  perPage = 12,
  search = '',
  category = '',
}: {
  page?: number
  perPage?: number
  search?: string
  category?: string
} = {}): Promise<BlogListing> {
  const term = search.trim()
  const params = {
    // GROQ treats an undefined param as "no filter" via !defined().
    q: term ? `${term.replace(/[*"]/g, '')}*` : null,
    category: category.trim() || null,
    from: (Math.max(1, page) - 1) * perPage,
    to: Math.max(1, page) * perPage,
  }

  try {
    const [raws, total] = await Promise.all([
      sanityClient.fetch<RawBlogCard[]>(BLOG_CARDS_QUERY, params, { next: READ_TAGS }),
      sanityClient.fetch<number>(BLOG_CARDS_COUNT_QUERY, params, { next: READ_TAGS }),
    ])
    const count = typeof total === 'number' ? total : 0
    return {
      // An unfinished draft has no slug and no title. It must not render a
      // card, which would link to /blog/null with an unnamed image.
      posts: (raws || [])
        .filter((raw) => typeof raw.slug === 'string' && raw.slug.length > 0)
        .map(mapBlogCard),
      total: count,
      totalPages: Math.max(1, Math.ceil(count / perPage)),
      page: Math.max(1, page),
      perPage,
    }
  } catch (err) {
    console.error('Failed to load blog cards from Sanity', err)
    return { posts: [], total: 0, totalPages: 1, page: 1, perPage }
  }
}

/** Category names actually in use, for the listing filter. */
export async function getBlogCategories(): Promise<string[]> {
  try {
    const cats = await sanityClient.fetch<string[]>(BLOG_CATEGORIES_QUERY, {}, { next: READ_TAGS })
    return (cats || []).filter(Boolean).sort()
  } catch (err) {
    console.error('Failed to load blog categories from Sanity', err)
    return []
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const raws = await sanityClient.fetch<RawBlogPost[]>(ALL_BLOG_POSTS_QUERY, {}, { next: READ_TAGS })
    return (raws || []).map(mapBlogPost)
  } catch (err) {
    console.error('Failed to load blog posts from Sanity', err)
    return []
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const raw = await sanityClient.fetch<RawBlogPost | null>(
      BLOG_POST_BY_SLUG_QUERY,
      { slug },
      { next: READ_TAGS },
    )
    return raw ? mapBlogPost(raw) : null
  } catch (err) {
    console.error('Failed to load blog post by slug from Sanity', err)
    return null
  }
}

export async function getAllTeamMembers(): Promise<TeamMember[]> {
  try {
    const raws = await sanityClient.fetch<RawTeamMember[]>(ALL_TEAM_MEMBERS_QUERY, {}, { next: TEAM_TAGS })
    return (raws || []).map(mapTeamMember)
  } catch (err) {
    console.error('Failed to load team members from Sanity', err)
    return []
  }
}

export async function getTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  try {
    const raw = await sanityClient.fetch<RawTeamMember | null>(
      TEAM_MEMBER_BY_SLUG_QUERY,
      { slug },
      { next: TEAM_TAGS },
    )
    return raw ? mapTeamMember(raw) : null
  } catch (err) {
    console.error('Failed to load team member by slug from Sanity', err)
    return null
  }
}
