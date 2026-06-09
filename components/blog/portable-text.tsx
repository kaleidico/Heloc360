'use client'

import { PortableText as BasePortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { imageUrl } from '@/lib/sanity/image'

// IDs match the contract used by TableOfContents: heading-{N} sequentially across h2/h3/h4.
function makeHeadingComponents(): PortableTextComponents['block'] {
  let counter = 0
  const headingFor = (Tag: 'h2' | 'h3' | 'h4') => ({ children }: { children?: React.ReactNode }) => {
    const id = `heading-${counter++}`
    return <Tag id={id}>{children}</Tag>
  }
  return {
    h2: headingFor('h2'),
    h3: headingFor('h3'),
    h4: headingFor('h4'),
  }
}

const components: PortableTextComponents = {
  block: makeHeadingComponents(),
  types: {
    image: ({ value }) => {
      if (!value) return null
      const src = imageUrl(value)
      const alt = (value as { alt?: string }).alt || ''
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={src} alt={alt} loading="lazy" />
    },
  },
  marks: {
    link: ({ value, children }) => {
      const href = (value as { href?: string })?.href || '#'
      const external = href.startsWith('http')
      return external ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <a href={href}>{children}</a>
      )
    },
  },
}

export function PortableText({ value }: { value: PortableTextBlock[] }) {
  // Recreate the heading counter on every render so navigations don't leak.
  const renderComponents: PortableTextComponents = { ...components, block: makeHeadingComponents() }
  return <BasePortableText value={value} components={renderComponents} />
}
