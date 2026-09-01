import type { PortableTextBlock } from '@portabletext/types'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  body: PortableTextBlock[]
  author?: {
    name: string
    image: string
    /** Job title, rendered alongside the byline as an expertise signal. */
    role?: string
    /** Links the byline through to the team member's profile page. */
    slug?: string
  }
  publishedDate: string
  /** Set only when the post has been revised since publication. */
  updatedDate?: string
  readTime: number
  category: string
  tags: string[]
  featuredImage: string
  featureImageAlt?: string
  featured: boolean
  seoTitle?: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string
  count: number
}
