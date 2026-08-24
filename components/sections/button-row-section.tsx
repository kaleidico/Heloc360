import Link from 'next/link'

type Button = {
  _key: string
  label: string
  href: string
  style?: 'primary' | 'outline'
}

export type ButtonRowValue = {
  _type: 'buttonRow'
  _key: string
  buttons: Button[]
}

// Class strings copied verbatim from the legal pages' contact callout.
const PRIMARY =
  'inline-flex items-center justify-center px-6 py-3 bg-[#1a71b6] hover:bg-[#1a71b6]/90 text-white font-medium rounded-lg transition-colors'
const OUTLINE =
  'inline-flex items-center justify-center px-6 py-3 border border-[#1a71b6] text-[#1a71b6] hover:bg-[#1a71b6] hover:text-white font-medium rounded-lg transition-colors'

export function ButtonRowSection({ value }: { value: ButtonRowValue }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {value.buttons.map((b) => {
        const cls = b.style === 'outline' ? OUTLINE : PRIMARY
        // Internal links use next/link; mailto/tel/external use a plain anchor.
        const internal = b.href.startsWith('/')
        return internal ? (
          <Link key={b._key} href={b.href} className={cls}>
            {b.label}
          </Link>
        ) : (
          <a key={b._key} href={b.href} className={cls}>
            {b.label}
          </a>
        )
      })}
    </div>
  )
}
