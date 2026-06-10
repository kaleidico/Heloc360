export type HtmlEmbedValue = {
  _type: 'htmlEmbed'
  _key: string
  heading?: string
  html: string
  maxWidth?: 'none' | '2xl' | '4xl' | '6xl' | '7xl'
  paddingY?: 'none' | 'sm' | 'md' | 'lg'
}

const MAX_WIDTH: Record<NonNullable<HtmlEmbedValue['maxWidth']>, string> = {
  none: '',
  '2xl': 'max-w-2xl mx-auto',
  '4xl': 'max-w-4xl mx-auto',
  '6xl': 'max-w-6xl mx-auto',
  '7xl': 'max-w-7xl mx-auto',
}

const PADDING_Y: Record<NonNullable<HtmlEmbedValue['paddingY']>, string> = {
  none: '',
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
}

// Renders a raw HTML snippet verbatim via dangerouslySetInnerHTML, optionally inside a
// constrained, vertically-padded wrapper.
//
// SECURITY: the `html` is injected without sanitization. This block trusts the editor
// completely and must only be exposed to trusted internal authors. It exists to stage
// third-party embed snippets (e.g. Mortgage Mate calculators) that cannot be modeled as
// structured content.
export function HtmlEmbedSection({ value }: { value: HtmlEmbedValue }) {
  const widthClass = MAX_WIDTH[value.maxWidth ?? 'none']
  const padClass = PADDING_Y[value.paddingY ?? 'none']
  const wrapperClass = [padClass, widthClass].filter(Boolean).join(' ')

  const content = (
    <>
      {value.heading && (
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{value.heading}</h2>
      )}
      <div dangerouslySetInnerHTML={{ __html: value.html }} />
    </>
  )

  if (!wrapperClass) return content
  return <div className={wrapperClass}>{content}</div>
}
