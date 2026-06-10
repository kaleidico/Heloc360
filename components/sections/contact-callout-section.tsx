import Link from 'next/link'

type Button = {
  _key: string
  label: string
  href: string
  style?: 'primary' | 'outline'
}

export type ContactCalloutValue = {
  _type: 'contactCallout'
  _key: string
  heading?: string
  bodyText?: string
  buttons?: Button[]
}

// Class strings copied verbatim from the legal pages' contact callout.
const PRIMARY =
  'inline-flex items-center justify-center px-6 py-3 bg-[#1b75bc] hover:bg-[#1b75bc]/90 text-white font-medium rounded-lg transition-colors'
const OUTLINE =
  'inline-flex items-center justify-center px-6 py-3 border border-[#1b75bc] text-[#1b75bc] hover:bg-[#1b75bc] hover:text-white font-medium rounded-lg transition-colors'

export function ContactCalloutSection({ value }: { value: ContactCalloutValue }) {
  const buttons = value.buttons || []
  return (
    <div className="bg-gradient-to-r from-[#1b75bc]/10 to-[#007a5e]/10 p-8 rounded-lg mt-12">
      {value.heading && <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">{value.heading}</h3>}
      {value.bodyText && <p className="text-lg leading-relaxed mb-6">{value.bodyText}</p>}
      {buttons.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          {buttons.map((b) => {
            const cls = b.style === 'outline' ? OUTLINE : PRIMARY
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
      )}
    </div>
  )
}
