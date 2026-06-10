import type { PortableTextBlock } from '@portabletext/types'
import { LegalPortableText } from './legal-portable-text'

export type ProseSectionValue = {
  _type: 'proseSection'
  _key: string
  body: PortableTextBlock[]
  maxWidth?: '4xl' | '3xl'
}

export function ProseSection({ value }: { value: ProseSectionValue }) {
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
