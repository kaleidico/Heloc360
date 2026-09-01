import type { MetadataRoute } from 'next'
import { getAllBlogPosts } from '@/lib/sanity/api'
import { getAllTeamMembers } from '@/lib/sanity/api'

const BASE_URL = 'https://heloc360.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes carry no lastModified. Stamping them with the current time told crawlers
  // every page changed on every fetch, which is the fastest way to train Google to ignore
  // the field entirely. Omitting it is honest; the blog entries below carry real dates.
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/pre-qual`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/heloc-101`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/blog`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/calculators`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/calculators/debt-consolidation`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/calculators/home-equity-estimator`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/meet-our-team`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/affiliate-disclosure`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/communication-consent`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const [blogPosts, teamMembers] = await Promise.all([
    getAllBlogPosts(),
    getAllTeamMembers(),
  ])

  // Real dates: the review date when the post has one, otherwise its publish date.
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedDate || post.publishedDate || undefined,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const teamPages: MetadataRoute.Sitemap = teamMembers.map((member) => ({
    url: `${BASE_URL}/meet-our-team/${member.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...blogPages, ...teamPages]
}
