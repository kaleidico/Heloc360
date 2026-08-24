import Link from 'next/link'
import type { PortableTextBlock } from '@portabletext/types'
import { LegalPortableText } from './legal-portable-text'

export type LegalProseValue = {
  _type: 'legalProse'
  _key: string
  body: PortableTextBlock[]
  contactCallout?: {
    heading?: string
    bodyText?: string
    emailLabel?: string
    emailHref?: string
    phoneLabel?: string
    phoneHref?: string
  } | null
  footer?: {
    text?: string
    showReturnHome?: boolean
  } | null
}

export function LegalProseSection({ value }: { value: LegalProseValue }) {
  const cc = value.contactCallout
  const footer = value.footer
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto prose prose-lg prose-gray">
          <LegalPortableText value={value.body} />

          {cc && (cc.heading || cc.bodyText || cc.emailHref || cc.phoneHref) && (
            <div className="bg-gradient-to-r from-[#1a71b6]/10 to-[#007a5e]/10 p-8 rounded-lg mt-12">
              {cc.heading && <h3 className="text-xl font-semibold text-[#1a71b6] mb-4">{cc.heading}</h3>}
              {cc.bodyText && <p className="text-lg leading-relaxed mb-4">{cc.bodyText}</p>}
              <div className="flex flex-col sm:flex-row gap-4">
                {cc.emailHref && cc.emailLabel && (
                  <a
                    href={cc.emailHref}
                    className="inline-flex items-center justify-center px-6 py-3 bg-[#1a71b6] hover:bg-[#1a71b6]/90 text-white font-medium rounded-lg transition-colors"
                  >
                    {cc.emailLabel}
                  </a>
                )}
                {cc.phoneHref && cc.phoneLabel && (
                  <a
                    href={cc.phoneHref}
                    className="inline-flex items-center justify-center px-6 py-3 border border-[#1a71b6] text-[#1a71b6] hover:bg-[#1a71b6] hover:text-white font-medium rounded-lg transition-colors"
                  >
                    {cc.phoneLabel}
                  </a>
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
