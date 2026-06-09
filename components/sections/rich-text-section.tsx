import type { PortableTextBlock } from '@portabletext/types'
import { PortableText } from '@/components/blog/portable-text'

export type RichTextSectionValue = {
  _type: 'richTextSection'
  _key: string
  heading?: string
  body: PortableTextBlock[]
}

export function RichTextSection({ value }: { value: RichTextSectionValue }) {
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="max-w-3xl mx-auto">
        {value.heading && <h2 className="text-3xl font-bold mb-6">{value.heading}</h2>}
        <div className="prose-custom" style={{ lineHeight: '1.8' }}>
          <PortableText value={value.body} />
        </div>
      </div>
    </section>
  )
}
