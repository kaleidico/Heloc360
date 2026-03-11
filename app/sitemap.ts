import type { MetadataRoute } from 'next'
import { getAllBlogPosts } from '@/lib/contentful'
import { getAllTeamMembers } from '@/lib/contentful'

const BASE_URL = 'https://heloc360.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/heloc-101`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/calculators/debt-consolidation`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/calculators/home-equity-estimator`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/affiliate-disclosure`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/communication-consent`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const [blogPosts, teamMembers] = await Promise.all([
    getAllBlogPosts(),
    getAllTeamMembers(),
  ])

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.publishedDate || now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const teamPages: MetadataRoute.Sitemap = teamMembers.map((member) => ({
    url: `${BASE_URL}/meet-our-team/${member.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...blogPages, ...teamPages]
}
