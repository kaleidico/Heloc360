"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Home, BookOpen, Calculator, Users, Mail, ExternalLink, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

// Common pages and their variations for "Did you mean?" suggestions
const commonPages = [
  {
    path: "/heloc-101",
    title: "HELOC 101 Guide",
    description: "Learn the basics of Home Equity Lines of Credit",
    keywords: ["heloc", "101", "guide", "basics", "learn", "education"],
  },
  {
    path: "/about",
    title: "About Us",
    description: "Learn about our team and mission",
    keywords: ["about", "team", "company", "mission", "story"],
  },
  {
    path: "/blog",
    title: "HELOC Blog",
    description: "Expert insights and tips about home equity",
    keywords: ["blog", "articles", "news", "insights", "tips"],
  },
  {
    path: "/calculators/debt-consolidation",
    title: "Debt Consolidation Calculator",
    description: "Calculate potential savings from debt consolidation",
    keywords: ["calculator", "debt", "consolidation", "savings", "tool"],
  },
  {
    path: "/calculators/home-equity",
    title: "Home Equity Estimator",
    description: "Estimate your available home equity",
    keywords: ["calculator", "equity", "estimate", "home", "value"],
  },
  {
    path: "/contact",
    title: "Contact Us",
    description: "Get in touch with our team",
    keywords: ["contact", "support", "help", "phone", "email"],
  },
  {
    path: "/privacy",
    title: "Privacy Policy",
    description: "Our privacy and data protection policies",
    keywords: ["privacy", "policy", "data", "protection", "legal"],
  },
  {
    path: "/terms",
    title: "Terms of Use",
    description: "Terms and conditions for using our website",
    keywords: ["terms", "conditions", "legal", "agreement", "use"],
  },
]

// Popular pages to always show
const popularPages = [
  {
    path: "/heloc-101",
    title: "HELOC 101 Guide",
    icon: BookOpen,
    description: "Learn the fundamentals",
  },
  {
    path: "/calculators/debt-consolidation",
    title: "Debt Calculator",
    icon: Calculator,
    description: "Calculate your savings",
  },
  {
    path: "/about",
    title: "About Us",
    icon: Users,
    description: "Meet our team",
  },
  {
    path: "/contact",
    title: "Contact Support",
    icon: Mail,
    description: "Get help from experts",
  },
]

// Simple string similarity function
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1

  if (longer.length === 0) return 1.0

  const editDistance = levenshteinDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
      }
    }
  }

  return matrix[str2.length][str1.length]
}

export default function NotFound() {
  const pathname = usePathname()
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<typeof commonPages>([])
  const [reportSent, setReportSent] = useState(false)

  useEffect(() => {
    if (pathname) {
      // Find suggestions based on URL similarity
      const pathSegments = pathname.toLowerCase().split("/").filter(Boolean)
      const pathString = pathSegments.join(" ")

      const scoredPages = commonPages.map((page) => {
        let maxScore = 0

        // Check similarity with path
        const pathScore = calculateSimilarity(pathname.toLowerCase(), page.path.toLowerCase())
        maxScore = Math.max(maxScore, pathScore)

        // Check similarity with keywords
        page.keywords.forEach((keyword) => {
          pathSegments.forEach((segment) => {
            const keywordScore = calculateSimilarity(segment, keyword)
            maxScore = Math.max(maxScore, keywordScore)
          })
        })

        return { ...page, score: maxScore }
      })

      // Sort by score and take top 3
      const topSuggestions = scoredPages
        .filter((page) => page.score > 0.3) // Only show if reasonably similar
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)

      setSuggestions(topSuggestions)
    }
  }, [pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Redirect to blog with search term
      window.location.href = `/blog?search=${encodeURIComponent(searchTerm.trim())}`
    }
  }

  const handleReportBrokenLink = async () => {
    // In a real app, this would send to an API endpoint
    setReportSent(true)
    setTimeout(() => setReportSent(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Header */}
          <div className="mb-12">
            <div className="text-8xl font-bold text-[#1b75bc] mb-4">404</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p className="text-xl text-gray-600 mb-8">
              Sorry, we couldn't find the page you're looking for at{" "}
              <code className="bg-gray-200 px-2 py-1 rounded text-sm font-mono">{pathname}</code>
            </p>
          </div>

          {/* Did You Mean Section */}
          {suggestions.length > 0 && (
            <Card className="mb-12 text-left">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1b75bc] flex items-center gap-2">
                  <Search className="w-6 h-6" />
                  Did you mean...?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestions.map((suggestion, index) => (
                    <Link
                      key={index}
                      href={suggestion.path}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-[#1b75bc] hover:shadow-md transition-all group"
                    >
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#1b75bc] mb-2">
                        {suggestion.title}
                      </h3>
                      <p className="text-sm text-gray-600">{suggestion.description}</p>
                      <div className="flex items-center text-[#1b75bc] text-sm mt-2">
                        <span>Visit page</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-[#1b75bc]">Search Our Site</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-4 max-w-md mx-auto">
                <Input
                  type="text"
                  placeholder="Search for articles, guides, or tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" className="bg-[#1b75bc] hover:bg-[#1b75bc]/90">
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Popular Pages */}
          <Card className="mb-12 text-left">
            <CardHeader>
              <CardTitle className="text-2xl text-[#1b75bc]">Popular Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {popularPages.map((page, index) => (
                  <Link
                    key={index}
                    href={page.path}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-[#1b75bc] hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 bg-[#1b75bc]/10 rounded-lg flex items-center justify-center group-hover:bg-[#1b75bc]/20 transition-colors">
                      <page.icon className="w-6 h-6 text-[#1b75bc]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#1b75bc]">{page.title}</h3>
                      <p className="text-sm text-gray-600">{page.description}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#1b75bc]" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-[#1b75bc] hover:bg-[#1b75bc]/90" asChild>
              <Link href="/">
                <Home className="w-5 h-5 mr-2" />
                Go to Homepage
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/blog">
                <BookOpen className="w-5 h-5 mr-2" />
                Browse Articles
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">
                <Mail className="w-5 h-5 mr-2" />
                Contact Support
              </Link>
            </Button>
          </div>

          {/* Report Broken Link */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-semibold text-yellow-800 mb-2">Found a broken link?</h3>
                  <p className="text-yellow-700 text-sm mb-4">
                    Help us improve by reporting this broken link. We'll investigate and fix it as soon as possible.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleReportBrokenLink}
                    disabled={reportSent}
                    className="border-yellow-600 text-yellow-700 hover:bg-yellow-100 bg-transparent"
                  >
                    {reportSent ? "Report Sent!" : "Report Broken Link"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Help */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Still can't find what you're looking for?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <Link href="/contact" className="text-[#1b75bc] hover:text-[#02c39a] transition-colors">
                Contact our support team
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link href="/heloc-101" className="text-[#1b75bc] hover:text-[#02c39a] transition-colors">
                Start with HELOC basics
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link href="/blog" className="text-[#1b75bc] hover:text-[#02c39a] transition-colors">
                Browse our blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
