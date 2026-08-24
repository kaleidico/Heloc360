import * as Icons from 'lucide-react'
import { PortableText as BasePortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

type CardRow = {
  _key: string
  icon?: string
  label?: string
  lines?: string[]
  linkLabel?: string
  linkHref?: string
}

export type InfoCardValue = {
  _type: 'infoCard'
  _key: string
  variant?: 'grayRows' | 'blueStatement' | 'grayProse'
  icon?: string
  heading?: string
  rows?: CardRow[]
  body?: PortableTextBlock[]
}

function Icon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null
  const Comp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
  if (!Comp) return null
  return <Comp className={className} />
}

// Shared link mark for the prose-bearing variants. Honors an optional
// `underline` flag (the consent statement underlines its Terms/Privacy links).
function linkMark(value: { href?: string; underline?: boolean } | undefined, children: React.ReactNode) {
  const href = value?.href || '#'
  const cls = value?.underline
    ? 'text-[#1a71b6] hover:text-[#007a5e] transition-colors underline'
    : 'text-[#1a71b6] hover:text-[#007a5e] transition-colors'
  const external = href.startsWith('http')
  return external ? (
    <a href={href} target="_blank" rel="noreferrer noopener" className={cls}>
      {children}
    </a>
  ) : (
    <a href={href} className={cls}>
      {children}
    </a>
  )
}

// --- gray rows (terms DMCA contact card) ------------------------------------

function GrayRowsCard({ value }: { value: InfoCardValue }) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      {value.heading && <h3 className="text-lg font-semibold text-[#1a71b6] mb-4">{value.heading}</h3>}
      <div className="space-y-3">
        {(value.rows || []).map((row) => {
          // Mail-style rows (link, no multi-line address) center vertically;
          // address rows align to the top with `items-start` + `<br/>` lines.
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
  )
}

// --- blue statement (consent main consent statement) ------------------------

function BlueStatementCard({ value }: { value: InfoCardValue }) {
  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => <p className="text-lg leading-relaxed text-gray-700">{children}</p>,
    },
    marks: {
      strong: ({ children }) => <strong>{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
      link: ({ value: mark, children }) => linkMark(mark as { href?: string; underline?: boolean }, children),
    },
  }
  return (
    <div className="bg-blue-50 border-l-4 border-l-[#1a71b6] p-8 rounded-lg mb-12">
      <div className="flex items-start gap-4">
        <Icon name={value.icon} className="w-8 h-8 text-[#1a71b6] mt-1 flex-shrink-0" />
        <div>
          {value.heading && <h2 className="text-xl font-semibold text-[#1a71b6] mb-4">{value.heading}</h2>}
          {value.body && value.body.length > 0 && <BasePortableText value={value.body} components={components} />}
        </div>
      </div>
    </div>
  )
}

// --- gray prose (affiliate "Editorial Independence") ------------------------

function GrayProseCard({ value }: { value: InfoCardValue }) {
  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => <p className="text-gray-700 leading-relaxed">{children}</p>,
    },
    marks: {
      strong: ({ children }) => <strong>{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
      link: ({ value: mark, children }) => linkMark(mark as { href?: string; underline?: boolean }, children),
    },
  }
  return (
    <div className="bg-gray-50 p-8 rounded-lg mb-12">
      {value.heading && (
        <h2 className="text-2xl font-bold text-[#1a71b6] mb-6 flex items-center gap-3">
          <Icon name={value.icon} className="w-6 h-6" />
          {value.heading}
        </h2>
      )}
      <div className="space-y-4">
        {value.body && value.body.length > 0 && <BasePortableText value={value.body} components={components} />}
      </div>
    </div>
  )
}

export function InfoCardSection({ value }: { value: InfoCardValue }) {
  if (value.variant === 'blueStatement') return <BlueStatementCard value={value} />
  if (value.variant === 'grayProse') return <GrayProseCard value={value} />
  return <GrayRowsCard value={value} />
}
