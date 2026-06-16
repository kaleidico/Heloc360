'use client'

import { useEffect, useRef } from 'react'

export type MortgageMateEmbedValue = {
  _type: 'mortgageMateEmbed'
  _key: string
  calculator: string
  dataKey: string
  heading?: string
  background?: 'white' | 'gray-50'
  maxWidth?: 'none' | '4xl' | '6xl' | '7xl'
  paddingY?: 'none' | 'sm' | 'md' | 'lg'
}

const EMBED_SRC = 'https://mortgagemate.app/embed.js'

const MAX_WIDTH: Record<NonNullable<MortgageMateEmbedValue['maxWidth']>, string> = {
  none: '',
  '4xl': 'max-w-4xl mx-auto',
  '6xl': 'max-w-6xl mx-auto',
  '7xl': 'max-w-7xl mx-auto',
}

const PADDING_Y: Record<NonNullable<MortgageMateEmbedValue['paddingY']>, string> = {
  none: '',
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
}

// Mounts a MortgageMate calculator. The vendor script scans the DOM for
// `[data-mortgagemate]` containers when it runs, so the script must load *after* our
// container is committed — hence a client component that appends the script in an effect
// (a server-rendered <script> or a build-time injected one cannot guarantee that order,
// and would not re-run on client-side navigation into the page). A fresh script element
// per mount forces the scan to run again each time the page is entered.
export function MortgageMateEmbedSection({ value }: { value: MortgageMateEmbedValue }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Container is already in the DOM by the time the effect runs.
    const script = document.createElement('script')
    script.src = EMBED_SRC
    script.async = true
    document.body.appendChild(script)
    return () => {
      script.remove()
    }
  }, [value.calculator, value.dataKey])

  const widthClass = MAX_WIDTH[value.maxWidth ?? '7xl']
  const padClass = PADDING_Y[value.paddingY ?? 'lg']
  const bgClass = value.background === 'gray-50' ? 'bg-gray-50' : ''

  return (
    <section className={bgClass}>
      <div className={[padClass, 'px-4', widthClass].filter(Boolean).join(' ')}>
        {value.heading && (
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{value.heading}</h2>
        )}
        <div ref={containerRef} data-mortgagemate={value.calculator} data-key={value.dataKey} />
      </div>
    </section>
  )
}
