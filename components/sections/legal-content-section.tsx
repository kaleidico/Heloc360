import Link from 'next/link'
import * as Icons from 'lucide-react'
import { PortableText as BasePortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

// --- shared types -----------------------------------------------------------

type AlertCallout = {
  _type: 'alertCallout'
  _key: string
  icon?: string
  heading?: string
  text?: string
}

type CardRow = {
  _key: string
  icon?: string
  label?: string
  lines?: string[]
  linkLabel?: string
  linkHref?: string
}

type ContactCard = {
  _type: 'contactCard'
  _key: string
  heading?: string
  rows?: CardRow[]
}

type HeadingGroup = {
  _key: string
  icon?: string
  heading: string
  body: Array<PortableTextBlock | AlertCallout | ContactCard>
}

export type LegalContentValue = {
  _type: 'legalContent'
  _key: string
  groups: HeadingGroup[]
  contactCallout?: {
    heading?: string
    bodyText?: string
    emailLabel?: string
    emailHref?: string
    secondaryLabel?: string
    secondaryHref?: string
  } | null
  footer?: {
    text?: string
    showReturnHome?: boolean
  } | null
}

// --- icon helper ------------------------------------------------------------

function Icon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null
  const Comp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
  if (!Comp) return null
  return <Comp className={className} />
}

// --- portable text serialization for a group body ---------------------------
// Reproduces the source markup: paragraphs `text-lg leading-relaxed mb-4`,
// H3 `text-xl font-semibold text-[#1a71b6] mb-4`, ordered list `list-decimal
// pl-6 space-y-2 mb-6`, the small ordered variant `list-decimal pl-6 space-y-2
// text-sm`, bullet list `list-disc pl-6 space-y-2 mb-6`, links in brand blue.

const bodyComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-lg leading-relaxed mb-4">{children}</p>,
    'normal-mb6': ({ children }) => <p className="text-lg leading-relaxed mb-6">{children}</p>,
    'normal-flush': ({ children }) => <p className="text-lg leading-relaxed">{children}</p>,
    h3: ({ children }) => <h3 className="text-xl font-semibold text-[#1a71b6] mb-4">{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 space-y-2 mb-6">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 space-y-2 mb-6">{children}</ol>,
    'number-sm': ({ children }) => <ol className="list-decimal pl-6 space-y-2 text-sm">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
    'number-sm': ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => {
      const href = (value as { href?: string })?.href || '#'
      const external = href.startsWith('http')
      return external ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="text-[#1a71b6] hover:text-[#007a5e] transition-colors"
        >
          {children}
        </a>
      ) : (
        <a href={href} className="text-[#1a71b6] hover:text-[#007a5e] transition-colors">
          {children}
        </a>
      )
    },
  },
  types: {
    alertCallout: ({ value }: { value: AlertCallout }) => (
      <div className="bg-yellow-50 border-l-4 border-l-yellow-400 p-6 mb-6">
        <div className="flex items-start gap-3">
          <Icon name={value.icon || 'AlertTriangle'} className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
          <div>
            {value.heading && <h3 className="font-semibold text-yellow-800 mb-2">{value.heading}</h3>}
            {value.text && <p className="text-yellow-700 text-sm">{value.text}</p>}
          </div>
        </div>
      </div>
    ),
    contactCard: ({ value }: { value: ContactCard }) => (
      <div className="bg-gray-50 p-6 rounded-lg">
        {value.heading && <h3 className="text-lg font-semibold text-[#1a71b6] mb-4">{value.heading}</h3>}
        <div className="space-y-3">
          {(value.rows || []).map((row) => {
            const centered = !!row.linkLabel && (!row.lines || row.lines.length === 0)
            return (
              <div key={row._key} className={centered ? 'flex items-center gap-3' : 'flex items-start gap-3'}>
                <Icon
                  name={row.icon}
                  className={centered ? 'w-5 h-5 text-gray-600' : 'w-5 h-5 text-gray-600 mt-1 flex-shrink-0'}
                />
                <div>
                  {row.label && <p className="font-medium">{row.label}</p>}
                  {row.lines && row.lines.length > 0 && (
                    <p className="text-gray-700">
                      {row.lines.map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < row.lines!.length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  )}
                  {row.linkLabel && row.linkHref && (
                    <a href={row.linkHref} className="text-[#1a71b6] hover:text-[#007a5e] transition-colors">
                      {row.linkLabel}
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    ),
  },
}

// --- main renderer ----------------------------------------------------------

export function LegalContentSection({ value }: { value: LegalContentValue }) {
  const cc = value.contactCallout
  const footer = value.footer
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto prose prose-lg prose-gray">
          {value.groups.map((g) => (
            <div key={g._key} className="mb-12">
              <h2
                className={
                  g.icon
                    ? 'text-2xl font-bold text-[#1a71b6] mb-4 flex items-center gap-3'
                    : 'text-2xl font-bold text-[#1a71b6] mb-4'
                }
              >
                <Icon name={g.icon} className="w-6 h-6" />
                {g.heading}
              </h2>
              <BasePortableText value={g.body as PortableTextBlock[]} components={bodyComponents} />
            </div>
          ))}

          {cc && (cc.heading || cc.bodyText || cc.emailHref || cc.secondaryHref) && (
            <div className="bg-gradient-to-r from-[#1a71b6]/10 to-[#007a5e]/10 p-8 rounded-lg">
              {cc.heading && <h3 className="text-xl font-semibold text-[#1a71b6] mb-4">{cc.heading}</h3>}
              {cc.bodyText && <p className="text-lg leading-relaxed mb-6">{cc.bodyText}</p>}
              <div className="flex flex-col sm:flex-row gap-4">
                {cc.emailHref && cc.emailLabel && (
                  <a
                    href={cc.emailHref}
                    className="inline-flex items-center justify-center px-6 py-3 bg-[#1a71b6] hover:bg-[#1a71b6]/90 text-white font-medium rounded-lg transition-colors"
                  >
                    {cc.emailLabel}
                  </a>
                )}
                {cc.secondaryHref && cc.secondaryLabel && (
                  <Link
                    href={cc.secondaryHref}
                    className="inline-flex items-center justify-center px-6 py-3 border border-[#1a71b6] text-[#1a71b6] hover:bg-[#1a71b6] hover:text-white font-medium rounded-lg transition-colors"
                  >
                    {cc.secondaryLabel}
                  </Link>
                )}
              </div>
            </div>
          )}

          {footer && (footer.text || footer.showReturnHome) && (
            <div className="text-center mt-12 pt-8 border-t border-gray-200">
              {footer.text && <p className="text-sm text-gray-600">{footer.text}</p>}
              {footer.showReturnHome && (
                <p className="text-sm text-gray-600 mt-2">
                  <Link href="/" className="text-[#1a71b6] hover:text-[#007a5e] transition-colors">
                    Return to Home
                  </Link>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
