import 'server-only'

import type { PortableTextBlock } from '@portabletext/types'
import type { BlogPost } from '@/types/blog'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { sanityClient } from './client'
import { imageUrl } from './image'
import {
  ALL_BLOG_POSTS_QUERY,
  BLOG_POST_BY_SLUG_QUERY,
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
  updatedAt?: string
  author?: {
    name?: string
    slug?: string
    title?: string
    photo?: SanityImageSource
  }
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
    updatedDate: raw.updatedAt,
    author: raw.author?.name
      ? {
          name: raw.author.name,
          image: raw.author.photo ? imageUrl(raw.author.photo) : '/placeholder-user.jpg',
          role: raw.author.title,
          slug: raw.author.slug,
        }
      : undefined,
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
