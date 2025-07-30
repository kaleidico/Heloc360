import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, User, ArrowLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import TableOfContents from "@/components/blog/table-of-contents"
import BlogFAQ from "@/components/blog/blog-faq"
import BlogCard from "@/components/blog/blog-card"
import { blogPosts } from "@/data/blog-posts"
import type { Metadata } from "next"
import type { FAQItem } from "@/components/ui/faq"

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug)

  if (!post) {
    return {
      title: "Blog Post Not Found - HELOC360",
    }
  }

  return {
    title: `${post.title} | HELOC360 Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `https://heloc360.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
      type: "article",
      publishedTime: post.publishedDate,
      authors: [post.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  }
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

// Sample rich content for demonstration
const sampleContent = `
<h2 id="understanding-helocs">Understanding HELOCs</h2>
<p>A Home Equity Line of Credit (HELOC) is a revolving credit line that uses your home's equity as collateral. Unlike a traditional loan, a HELOC works more like a credit card - you can borrow, repay, and borrow again up to your credit limit during the draw period.</p>

<h3 id="how-helocs-work">How HELOCs Work</h3>
<p>HELOCs typically have two phases:</p>
<ul>
<li><strong>Draw Period (usually 10 years):</strong> You can access funds as needed and typically make interest-only payments</li>
<li><strong>Repayment Period (usually 20 years):</strong> You can no longer borrow and must make principal and interest payments</li>
</ul>

<h2 id="benefits-of-helocs">Benefits of HELOCs</h2>
<p>HELOCs offer several advantages over other forms of credit:</p>

<h3 id="lower-interest-rates">Lower Interest Rates</h3>
<p>Because your home secures the debt, HELOCs typically offer lower interest rates than credit cards or personal loans. This can result in significant savings, especially for large expenses.</p>

<h3 id="flexible-access">Flexible Access to Funds</h3>
<p>You only pay interest on the amount you actually use, not the entire credit line. This flexibility makes HELOCs ideal for projects with varying costs or ongoing expenses.</p>

<h2 id="qualification-requirements">Qualification Requirements</h2>
<p>To qualify for a HELOC, lenders typically look for:</p>

<h3 id="credit-score">Credit Score</h3>
<p>Most lenders require a credit score of 680 or higher, though some may accept lower scores with compensating factors.</p>

<h3 id="home-equity">Sufficient Home Equity</h3>
<p>You'll typically need at least 15-20% equity in your home after the HELOC is established.</p>

<h2 id="smart-uses">Smart Uses for Your HELOC</h2>
<p>While HELOCs provide flexibility, it's important to use them wisely:</p>

<h3 id="home-improvements">Home Improvements</h3>
<p>Using a HELOC for home improvements that increase your property value is often considered a smart investment. Kitchen remodels, bathroom updates, and additions typically offer good returns.</p>

<h3 id="debt-consolidation">Debt Consolidation</h3>
<p>If you have high-interest credit card debt, using a HELOC to consolidate can save you money on interest payments.</p>

<h2 id="risks-to-consider">Risks to Consider</h2>
<p>While HELOCs offer many benefits, there are important risks to understand:</p>

<h3 id="variable-rates">Variable Interest Rates</h3>
<p>Most HELOCs have variable rates that can increase over time, potentially making your payments higher than expected.</p>

<h3 id="home-as-collateral">Your Home as Collateral</h3>
<p>Since your home secures the HELOC, you could lose it if you're unable to make payments. Only borrow what you can afford to repay.</p>
`

// Sample FAQ data for the blog post
const blogFAQItems: FAQItem[] = [
  {
    question: "What's the difference between a HELOC and a home equity loan?",
    answer:
      "A HELOC is a revolving line of credit that works like a credit card, while a home equity loan provides a lump sum with fixed payments. HELOCs offer more flexibility but typically have variable rates.",
  },
  {
    question: "How long does it take to get approved for a HELOC?",
    answer:
      "The HELOC approval process typically takes 30-45 days, depending on the lender and how quickly you provide required documentation. Some lenders offer expedited processing.",
  },
  {
    question: "Can I pay off my HELOC early?",
    answer:
      "Yes, most HELOCs allow early payoff without prepayment penalties. Paying early can save you significant interest costs over the life of the loan.",
  },
  {
    question: "What happens when the draw period ends?",
    answer:
      "When the draw period ends, you enter the repayment period where you can no longer borrow and must make principal and interest payments. Some lenders offer renewal options.",
  },
]

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  // Get related posts (same category, excluding current post)
  const relatedPosts = blogPosts.filter((p) => p.category === post.category && p.id !== post.id).slice(0, 3)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Generate structured data for the blog post
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
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
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="relative w-10 h-10">
                  <Image
                    src={post.author.image || "/placeholder.svg"}
                    alt={post.author.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{post.author.name}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishedDate)}</span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min read</span>
              </div>

              <Button variant="outline" size="sm" className="ml-auto bg-transparent">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
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

            {/* Article Excerpt */}
            <div className="text-xl text-gray-700 leading-relaxed mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-l-[#1b75bc]">
              {post.excerpt}
            </div>

            {/* Table of Contents */}
            <TableOfContents content={sampleContent} />

            {/* Article Content */}
            <div
              className="prose prose-lg prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: sampleContent }}
              style={{
                lineHeight: "1.8",
              }}
            />

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* FAQ Section */}
      <BlogFAQ items={blogFAQItems} />

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-[#1b75bc] mb-8 text-center">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#1b75bc] to-[#02c39a]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Explore Your HELOC Options?</h2>
            <p className="text-xl mb-8 opacity-90">
              Get personalized guidance from our experts and find the right HELOC for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-[#1b75bc] hover:bg-gray-100">
                Get Pre-Qualified
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 bg-transparent"
                asChild
              >
                <Link href="/contact">Speak with an Expert</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
