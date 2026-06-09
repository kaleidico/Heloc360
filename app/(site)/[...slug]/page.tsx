import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPageBySlug, getAllPageSlugs } from '@/lib/sanity/page-api'
import { SectionRenderer } from '@/components/sections/section-renderer'

type Props = { params: { slug?: string[] } }

function slugFromParams(params: Props['params']): string {
  const segments = params.slug || []
  if (segments.length === 0) return 'home'
  return segments.join('/')
}

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs()
  return slugs.map((slug) => ({ slug: slug === 'home' ? [] : slug.split('/') }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPageBySlug(slugFromParams(params))
  if (!page) return {}
  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription,
    alternates: page.canonicalUrl ? { canonical: page.canonicalUrl } : undefined,
    robots: page.noindex ? { index: false, follow: true } : undefined,
  }
}

export default async function SanityCatchAllPage({ params }: Props) {
  const page = await getPageBySlug(slugFromParams(params))
  if (!page) notFound()
  return <SectionRenderer sections={page.sections} />
}
