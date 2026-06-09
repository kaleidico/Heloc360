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
  }
  publishedDate: string
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
