import { notFound, permanentRedirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getPageBySlug, getAllPageSlugs } from '@/lib/sanity/page-api'
import { getBlogPostBySlug, getTeamMemberBySlug } from '@/lib/sanity/api'
import { SectionRenderer } from '@/components/sections/section-renderer'

type Props = { params: Promise<{ slug?: string[] }> }

function slugFromSegments(segments: string[]): string {
  if (segments.length === 0) return 'home'
  return segments.join('/')
}

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs()
  return slugs.map((slug) => ({ slug: slug === 'home' ? [] : slug.split('/') }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params
  const page = await getPageBySlug(slugFromSegments(slug))
  if (!page) return {}
  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription,
    alternates: page.canonicalUrl ? { canonical: page.canonicalUrl } : undefined,
    robots: page.noindex ? { index: false, follow: true } : undefined,
  }
}

export default async function SanityCatchAllPage({ params }: Props) {
  const { slug = [] } = await params

  // 1) A Sanity `page` document wins (single- or multi-segment).
  const page = await getPageBySlug(slugFromSegments(slug))
  if (page) return <SectionRenderer sections={page.sections} />

  // 2) Legacy single-segment redirects: old root-level blog/team URLs → their
  //    current homes. Preserves backward-compatible links from before the move
  //    to /blog/* and /meet-our-team/*. (Folded in from the former [slug] route.)
  if (slug.length === 1) {
    const [post, member] = await Promise.all([
      getBlogPostBySlug(slug[0]),
      getTeamMemberBySlug(slug[0]),
    ])
    if (post) permanentRedirect(`/blog/${post.slug}`)
    if (member) permanentRedirect(`/meet-our-team/${member.slug}`)
  }

  notFound()
}
