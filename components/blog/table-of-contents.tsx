"use client"

import { useState, useEffect } from "react"
import { List, ChevronRight } from "lucide-react"

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Extract headings from content
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = content

    const headings = tempDiv.querySelectorAll("h2, h3, h4")
    const items: TOCItem[] = []

    headings.forEach((heading, index) => {
      const id = heading.id || `heading-${index}`
      const text = heading.textContent || ""
      const level = Number.parseInt(heading.tagName.charAt(1))

      // Ensure heading has an ID for linking
      if (!heading.id) {
        heading.id = id
      }

      items.push({ id, text, level })
    })

    setTocItems(items)

    // Set up intersection observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0% -35% 0%" },
    )

    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [content])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  if (tocItems.length === 0) return null

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <List className="w-5 h-5 text-[#1b75bc]" />
        <h3 className="text-lg font-semibold text-[#1b75bc]">Table of Contents</h3>
      </div>

      <nav className="space-y-2">
        {tocItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToHeading(item.id)}
            className={`flex items-center gap-2 w-full text-left py-2 px-3 rounded-md transition-colors ${
              activeId === item.id ? "bg-[#1b75bc] text-white" : "text-gray-700 hover:bg-gray-100 hover:text-[#1b75bc]"
            }`}
            style={{ paddingLeft: `${(item.level - 2) * 16 + 12}px` }}
          >
            <ChevronRight
              className={`w-3 h-3 flex-shrink-0 ${activeId === item.id ? "text-white" : "text-gray-400"}`}
            />
            <span className="text-sm leading-relaxed">{item.text}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
