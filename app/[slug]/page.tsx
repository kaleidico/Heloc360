import { notFound, permanentRedirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllBlogPosts, getBlogPostBySlug, getAllTeamMembers, getTeamMemberBySlug } from '@/lib/contentful'

type Props = { params: { slug: string } }

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  return {
    robots: { index: false, follow: true },
  }
}

export async function generateStaticParams() {
  try {
    const [posts, members] = await Promise.all([getAllBlogPosts(), getAllTeamMembers()])
    const postSlugs = posts.map((p) => ({ slug: p.slug }))
    const memberSlugs = members.map((m) => ({ slug: m.slug }))
    return [...postSlugs, ...memberSlugs]
  } catch {
    return []
  }
}

export default async function LegacySlugPage({ params }: Props) {
  const slug = params.slug

  // Try blog post first
  const [post, member] = await Promise.all([
    getBlogPostBySlug(slug),
    getTeamMemberBySlug(slug),
  ])

  if (post) {
    return permanentRedirect(`/blog/${post.slug}`)
  }
  if (member) {
    return permanentRedirect(`/meet-our-team/${member.slug}`)
  }

  notFound()
}


