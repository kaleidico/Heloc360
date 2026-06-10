import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPageBySlug } from '@/lib/sanity/page-api'
import { SectionRenderer } from '@/components/sections/section-renderer'

// The homepage is content-managed as a Sanity `page` document (slug "home").
// A non-optional [...slug] catch-all cannot match "/", so the root is served
// here, fetching the same `home` doc and rendering it through SectionRenderer.

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('home')
  if (!page) return {}
  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription,
    alternates: page.canonicalUrl ? { canonical: page.canonicalUrl } : undefined,
    robots: page.noindex ? { index: false, follow: true } : undefined,
  }
}

export default async function HomePage() {
  const page = await getPageBySlug('home')
  if (!page) notFound()
  return <SectionRenderer sections={page.sections} />
}
