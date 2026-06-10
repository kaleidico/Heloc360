import { ExternalLink } from 'lucide-react'
import { PortableText as BasePortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-lg leading-relaxed mb-6">{children}</p>,
    h2: ({ children }) => <h2 className="text-2xl font-bold text-[#1b75bc] mb-6">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-8 space-y-2">{children}</ul>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => {
      const mark = value as { href?: string; external?: boolean }
      const href = mark?.href || '#'
      const isHttp = href.startsWith('http')
      // When the annotation opts into the trailing-icon treatment, render an
      // inline-flex anchor with a trailing ExternalLink icon — matching the
      // affiliate intro's "My Perfect Leads, LLC" link verbatim.
      if (mark?.external) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className="text-[#1b75bc] hover:text-[#007a5e] transition-colors inline-flex items-center gap-1"
          >
            {children}
            <ExternalLink className="w-4 h-4" />
          </a>
        )
      }
      return isHttp ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="text-[#1b75bc] hover:text-[#007a5e] transition-colors"
        >
          {children}
        </a>
      ) : (
        <a href={href} className="text-[#1b75bc] hover:text-[#007a5e] transition-colors">
          {children}
        </a>
      )
    },
  },
}

export function LegalPortableText({ value }: { value: PortableTextBlock[] }) {
  return <BasePortableText value={value} components={components} />
}
