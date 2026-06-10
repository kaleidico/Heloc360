import { renderBlock, type Section } from './section-renderer'

// Static class map so Tailwind keeps the max-width classes (no interpolation
// it can't see at build time).
const MAX_WIDTH = {
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  full: 'max-w-full',
} as const

export type ContentSectionValue = {
  _type: 'contentSection'
  _key: string
  maxWidth?: '3xl' | '4xl' | '5xl' | 'full'
  paddingY?: '16' | '0'
  useProse?: boolean
  content: Section[]
}

export function ContentSectionSection({ value }: { value: ContentSectionValue }) {
  const maxWidth = MAX_WIDTH[value.maxWidth ?? '4xl']
  const paddingY = value.paddingY ?? '16'
  const useProse = value.useProse ?? true
  return (
    <section className={paddingY === '0' ? '' : 'py-16'}>
      <div className="container mx-auto px-4">
        <div className={`${maxWidth} mx-auto${useProse ? ' prose prose-lg prose-gray' : ''}`}>
          {value.content.map((child) => renderBlock(child))}
        </div>
      </div>
    </section>
  )
}
