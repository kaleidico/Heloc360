import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import TableOfContents from "@/components/blog/table-of-contents"
import BlogCard from "@/components/blog/blog-card"
import ShareButton from "@/components/blog/share-button"
import type { Metadata } from "next"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/contentful"
import { decodeHtmlEntities } from "@/lib/utils"

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Blog Post Not Found - HELOC360",
    }
  }

  // Use seoTitle if available, otherwise fall back to regular title with suffix
  const metaTitle = post.seoTitle || `${post.title} | HELOC360 Blog`
  const ogTitle = post.seoTitle || post.title

  return {
    title: metaTitle,
    description: post.excerpt,
    alternates: {
      canonical: `https://heloc360.com/blog/${post.slug}`,
    },
    openGraph: {
      title: ogTitle,
      description: post.excerpt,
      images: [post.featuredImage],
      type: "article",
      publishedTime: post.publishedDate,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  }
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export const revalidate = 86400

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const allPosts = await getAllBlogPosts()
  const relatedPosts = allPosts.filter((p) => p.category === post.category && p.id !== post.id).slice(0, 3)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Create heading components with sequential IDs
  let headingIndex = 0
  const createHeadingComponent = (Tag: 'h2' | 'h3' | 'h4') => {
    return ({ children, ...props }: any) => {
      const id = `heading-${headingIndex++}`
      return <Tag id={id} {...props}>{children}</Tag>
    }
  }

  // Generate structured data for the blog post
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seoTitle || post.title,
    description: post.excerpt,
    image: post.featuredImage,
    publisher: {
      "@type": "Organization",
      name: "HELOC360",
      logo: {
        "@type": "ImageObject",
        url: "https://heloc360.com/images/heloc360-logo.webp",
      },
    },
    datePublished: post.publishedDate,
    dateModified: post.publishedDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://heloc360.com/blog/${post.slug}`,
    },
  }

  return (
    <>
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* Back Navigation */}
      <section className="py-4 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <Link
            href="/blog"
            className="inline-flex items-center text-[#1b75bc] hover:text-[#1b75bc]/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </section>

      {/* Article Header */}
      <article className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-block bg-[#02c39a] text-white px-3 py-1 rounded-full text-sm font-medium">
                {decodeHtmlEntities(post.category)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishedDate)}</span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min read</span>
              </div>

              <ShareButton
                className="ml-auto bg-transparent"
                title={post.title}
                url={`https://heloc360.com/blog/${post.slug}`}
                text={post.excerpt}
              />
            </div>

            {/* Featured Image */}
            <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={post.featuredImage || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Table of Contents */}
            {post.content && post.content.trim().length > 0 && (
              <TableOfContents content={post.content} />
            )}

            {/* Article Content */}
            {post.content && post.content.trim().length > 0 ? (
              <div className="prose-custom" style={{ lineHeight: "1.8" }}>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: createHeadingComponent('h2'),
                    h3: createHeadingComponent('h3'),
                    h4: createHeadingComponent('h4'),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Content coming soon...</p>
              </div>
            )}

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <section className="mt-16">
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((related) => (
                    <BlogCard key={related.id} post={related} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </article>
    </>
  )
}
