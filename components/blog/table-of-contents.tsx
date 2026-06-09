"use client"

import { useState, useEffect } from "react"
import { List, ChevronRight } from "lucide-react"
import type { PortableTextBlock } from "@portabletext/types"

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  blocks: PortableTextBlock[]
}

export default function TableOfContents({ blocks }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")

  // Derive headings synchronously from the PortableText blocks.
  // The counter increments ONLY for heading blocks (h2/h3/h4) in document
  // order, starting at 0 — matching the renderer's heading-{N} contract.
  const tocItems: TOCItem[] = []
  let index = 0
  for (const block of blocks) {
    if ((block as any)._type !== "block") continue
    const style = (block as any).style as string | undefined
    if (style !== "h2" && style !== "h3" && style !== "h4") continue

    const id = `heading-${index++}`
    const level = parseInt(style.slice(1), 10)
    const children = ((block as any).children ?? []) as Array<{ text?: unknown }>
    const text = children
      .filter((child) => typeof child.text === "string")
      .map((child) => child.text as string)
      .join("")

    tocItems.push({ id, text, level })
  }

  useEffect(() => {
    // Set up intersection observer for active heading after content renders.
    // The observer is created inside a timeout, so capture it in the effect
    // scope and disconnect it from the effect's own cleanup — returning the
    // disconnect from the setTimeout callback would never reach React.
    let observer: IntersectionObserver | null = null
    const timer = setTimeout(() => {
      const headings = document.querySelectorAll("h2, h3, h4")
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id)
            }
          })
        },
        { rootMargin: "-20% 0% -35% 0%" },
      )

      headings.forEach((heading) => observer!.observe(heading))
    }, 100)

    return () => {
      clearTimeout(timer)
      observer?.disconnect()
    }
  }, [blocks])

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
