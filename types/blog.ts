export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author?: {
    name: string
    image: string
  }
  publishedDate: string
  readTime: number
  category: string
  tags: string[]
  featuredImage: string
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
