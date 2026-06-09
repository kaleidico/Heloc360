import 'server-only'
import type { Section } from '@/components/sections/section-renderer'
import { sanityClient } from './client'
import { PAGE_BY_SLUG_QUERY, ALL_PAGE_SLUGS_QUERY } from './page-queries'

export type SanityPage = {
  id: string
  title: string
  slug: string
  sections: Section[]
  seoTitle?: string
  seoDescription?: string
  canonicalUrl?: string
  noindex?: boolean
}

const PAGE_TAGS = { tags: ['page'] }

export async function getPageBySlug(slug: string): Promise<SanityPage | null> {
  try {
    return await sanityClient.fetch<SanityPage | null>(PAGE_BY_SLUG_QUERY, { slug }, { next: PAGE_TAGS })
  } catch (err) {
    console.error('Failed to load page by slug from Sanity', err)
    return null
  }
}

export async function getAllPageSlugs(): Promise<string[]> {
  try {
    const rows = await sanityClient.fetch<Array<{ slug?: string }>>(ALL_PAGE_SLUGS_QUERY, {}, { next: PAGE_TAGS })
    return rows.map((r) => r.slug).filter((s): s is string => typeof s === 'string')
  } catch (err) {
    console.error('Failed to load page slugs from Sanity', err)
    return []
  }
}
