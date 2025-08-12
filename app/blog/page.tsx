import BlogHome from "@/components/blog/blog-home"
import { getAllBlogPosts } from "@/lib/contentful"

export const revalidate = 86400

export default async function BlogPage() {
  const posts = await getAllBlogPosts()
  return <BlogHome initialPosts={posts} />
}
