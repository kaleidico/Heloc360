"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import BlogCard from "@/components/blog/blog-card"
import BlogSearch from "@/components/blog/blog-search"
import BlogPagination from "@/components/blog/blog-pagination"
import { blogPosts } from "@/data/blog-posts"
import Link from "next/link"

// Note: Since this is a client component, we'll handle metadata differently
// In a real app, you'd want to make this a server component or use generateMetadata

const POSTS_PER_PAGE = 12

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedTag, setSelectedTag] = useState("")

  // Get all unique tags for filter dropdown
  const availableTags = useMemo(() => {
    const tags = new Set<string>()
    blogPosts.forEach((post) => {
      post.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [])

  // Filter posts based on search and filters
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesSearch =
        !searchTerm ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = !selectedCategory || post.category === selectedCategory

      const matchesTag = !selectedTag || post.tags.includes(selectedTag)

      return matchesSearch && matchesCategory && matchesTag
    })
  }, [searchTerm, selectedCategory, selectedTag])

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const currentPosts = filteredPosts.slice(startIndex, endIndex)

  // Get featured posts (first 3 featured posts)
  const featuredPosts = blogPosts.filter((post) => post.featured).slice(0, 3)

  // Reset to page 1 when filters change
  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setSelectedTag("")
    setCurrentPage(1)
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1b75bc] to-[#02c39a] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">HELOC360 Blog</h1>
            <p className="text-xl mb-8 opacity-90">
              Expert insights, tips, and success stories to help you make the most of your home equity
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-[#1b75bc] hover:bg-gray-100" asChild>
                <Link href="/get-started">Get Pre-Qualified</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 bg-transparent"
                asChild
              >
                <Link href="/heloc-101">Learn HELOC Basics</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-[#1b75bc] mb-8 text-center">Featured Articles</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} featured={true} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Blog Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-[#1b75bc]">All Articles</h2>
              <div className="text-gray-600">
                {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""} found
              </div>
            </div>

            {/* Search and Filters */}
            <BlogSearch
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              selectedTag={selectedTag}
              onSearchChange={handleSearchChange}
              onCategoryChange={handleCategoryChange}
              onTagChange={handleTagChange}
              onClearFilters={handleClearFilters}
              availableTags={availableTags}
            />

            {/* Blog Posts Grid */}
            {currentPosts.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {currentPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                <BlogPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <Button onClick={handleClearFilters} variant="outline">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-r from-[#1b75bc] to-[#02c39a]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Stay Updated with HELOC Insights</h2>
            <p className="text-xl mb-8 opacity-90">
              Get the latest tips, market updates, and success stories delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
              />
              <Button size="lg" className="bg-white text-[#1b75bc] hover:bg-gray-100 px-8">
                Subscribe
              </Button>
            </div>
            <p className="text-sm mt-4 opacity-80">
              No spam, unsubscribe at any time. Read our{" "}
              <Link href="/privacy" className="underline hover:no-underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
