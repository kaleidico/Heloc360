import { CheckCircle } from 'lucide-react'

type TocItem = { _key: string; label: string; href: string }

export type TableOfContentsValue = {
  _type: 'tableOfContents'
  _key: string
  heading: string
  items: TocItem[]
}

// Full-width gray-50 band with a centered heading and a 2-column grid of
// in-page anchor links (CheckCircle + text). Items split evenly across two
// columns in source order. Reproduces the heloc-101 "What You'll Learn" TOC.
export function TableOfContentsSection({ value }: { value: TableOfContentsValue }) {
  const items = value.items || []
  const half = Math.ceil(items.length / 2)
  const cols = [items.slice(0, half), items.slice(half)]
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1a71b6] mb-6 text-center">{value.heading}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {cols.map((col, ci) => (
              <div key={ci} className="space-y-2">
                {col.map((item) => (
                  <a
                    key={item._key}
                    href={item.href}
                    className="flex items-center text-gray-700 hover:text-[#1a71b6] transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 mr-2 text-[#02c39a]" />
                    {item.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
