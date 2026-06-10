import type { PortableTextBlock } from '@portabletext/types'
import { LegalPortableText } from './legal-portable-text'

export type ProseSectionValue = {
  _type: 'proseSection'
  _key: string
  body: PortableTextBlock[]
  maxWidth?: '4xl' | '3xl'
  bare?: boolean
}

export function ProseSection({ value }: { value: ProseSectionValue }) {
  // When `bare`, emit only the PortableText — the enclosing contentSection
  // already supplies the section/container/max-width/prose shell.
  if (value.bare) {
    return <LegalPortableText value={value.body} />
  }
  const maxW = value.maxWidth === '3xl' ? 'max-w-3xl' : 'max-w-4xl'
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className={`${maxW} mx-auto prose prose-lg prose-gray`}>
          <LegalPortableText value={value.body} />
        </div>
      </div>
    </section>
  )
}
