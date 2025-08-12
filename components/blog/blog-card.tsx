import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, Tag } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { BlogPost } from "@/types/blog"
import { decodeHtmlEntities } from "@/lib/utils"

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-200 h-full flex flex-col ${featured ? "border-[#1b75bc] border-2" : ""}`}
    >
      <div className="relative overflow-hidden rounded-t-lg">
        <Link href={`/blog/${post.slug}`}>
          <Image
            src={post.featuredImage || "/placeholder.svg"}
            alt={post.title}
            width={500}
            height={300}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </Link>
        {featured && (
          <div className="absolute top-4 left-4 bg-[#1b75bc] text-white px-3 py-1 rounded-full text-sm font-medium">
            Featured
          </div>
        )}
      </div>

      <CardHeader className="flex-shrink-0">
        <div className="mb-2">
          <span className="inline-block bg-[#02c39a] text-white px-2 py-1 rounded-full text-xs font-medium">
            {decodeHtmlEntities(post.category)}
          </span>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1b75bc] transition-colors line-clamp-2 leading-tight">
            {post.title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between pt-0">
        <div>
          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
        </div>

        <div className="space-y-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.publishedDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} min read</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
