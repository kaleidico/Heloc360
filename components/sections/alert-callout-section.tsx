import * as Icons from 'lucide-react'
import { PortableText as BasePortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

export type AlertCalloutValue = {
  _type: 'alertCallout'
  _key: string
  variant?: 'warning' | 'info'
  icon?: string
  rounded?: boolean
  outerMargin?: '6' | '12'
  heading?: string
  body?: PortableTextBlock[]
  rows?: { _key?: string; label?: string; value?: string }[]
}

function Icon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null
  const Comp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
  if (!Comp) return null
  return <Comp className={className} />
}

// Variant-specific markup copied verbatim from the source pages.
const VARIANTS = {
  warning: {
    box: 'bg-yellow-50 border-l-4 border-l-yellow-400 p-6',
    icon: 'w-5 h-5 text-yellow-600 mt-1 flex-shrink-0',
    heading: 'font-semibold text-yellow-800 mb-2',
    para: 'text-yellow-700 text-sm',
    link: 'text-yellow-800 hover:text-yellow-900 underline',
    rowLabel: 'font-medium text-yellow-800',
    rowValue: 'text-yellow-700 text-sm',
  },
  info: {
    box: 'bg-green-50 border-l-4 border-l-[#02c39a] p-6',
    icon: 'w-6 h-6 text-[#02c39a] mt-1 flex-shrink-0',
    heading: 'text-lg font-semibold text-[#007a5e] mb-2',
    para: 'text-gray-700 leading-relaxed',
    link: 'text-[#1b75bc] hover:text-[#007a5e] transition-colors',
    rowLabel: 'font-medium text-[#007a5e]',
    rowValue: 'text-gray-700 text-sm',
  },
} as const

export function AlertCalloutSection({ value }: { value: AlertCalloutValue }) {
  const v = VARIANTS[value.variant === 'info' ? 'info' : 'warning']
  const rounded = value.rounded ? ' rounded-lg' : ''
  const margin = value.outerMargin === '12' ? ' mb-12' : ' mb-6'

  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => <p className={v.para}>{children}</p>,
    },
    marks: {
      strong: ({ children }) => <strong>{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
      link: ({ value: mark, children }) => {
        const href = (mark as { href?: string })?.href || '#'
        const external = href.startsWith('http')
        return external ? (
          <a href={href} target="_blank" rel="noreferrer noopener" className={v.link}>
            {children}
          </a>
        ) : (
          <a href={href} className={v.link}>
            {children}
          </a>
        )
      },
    },
  }

  return (
    <div className={`${v.box}${rounded}${margin}`}>
      <div className="flex items-start gap-3">
        <Icon name={value.icon} className={v.icon} />
        <div>
          {value.heading && <h3 className={v.heading}>{value.heading}</h3>}
          {value.body && value.body.length > 0 && (
            <BasePortableText value={value.body} components={components} />
          )}
          {value.rows && value.rows.length > 0 && (
            <div className="space-y-3">
              {value.rows.map((row, i) => (
                <div key={row._key ?? i}>
                  {row.label && <h4 className={v.rowLabel}>{row.label}</h4>}
                  {row.value && <p className={v.rowValue}>{row.value}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
