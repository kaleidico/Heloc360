'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

export type FaqAccordionValue = {
  _type: 'faqAccordion'
  _key: string
  title?: string
  subtitle?: string
  background?: 'white' | 'gray'
  items: Array<{ _key: string; question: string; answer: string }>
  showContactCTA?: boolean
  contactCTAText?: string
  contactCTALink?: string
}

const BG: Record<string, string> = { white: 'bg-white', gray: 'bg-gray-50' }

// Generate FAQ structured data for SEO — verbatim from components/ui/faq.tsx.
function generateFAQStructuredData(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

// Verbatim reproduction of the shared <FAQ> component (components/ui/faq.tsx):
// a centered header, a Plus/Minus expand-collapse list with smooth max-height
// transition, JSON-LD FAQ structured data, and an optional contact CTA.
// Distinct from `faqSection`, which uses the shadcn Accordion primitive.
export function FaqAccordionSection({ value }: { value: FaqAccordionValue }) {
  const [openItems, setOpenItems] = useState<number[]>([])
  const items = value.items || []
  const showContactCTA = value.showContactCTA ?? true
  const contactCTAText = value.contactCTAText ?? 'Still have questions?'
  const contactCTALink = value.contactCTALink ?? '/pre-qual'
  const bg = BG[value.background || 'white']

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]
    )
  }

  const structuredData = generateFAQStructuredData(items)

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      <div className={`py-16 ${bg}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {(value.title || value.subtitle) && (
              <div className="text-center mb-12">
                {value.title && (
                  <h2 className="text-3xl md:text-4xl font-bold text-[#1a71b6] mb-4">
                    {value.title}
                  </h2>
                )}
                {value.subtitle && <p className="text-lg text-gray-600">{value.subtitle}</p>}
              </div>
            )}

            <div className="space-y-0">
              {items.map((faq, index) => {
                const isOpen = openItems.includes(index)
                return (
                  <div key={faq._key} className="border-b border-gray-200 last:border-b-0">
                    <button
                      className="w-full text-left py-6 focus:outline-none focus:ring-2 focus:ring-[#1a71b6] focus:ring-offset-2 rounded-sm"
                      onClick={() => toggleItem(index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${index}`}
                      id={`faq-question-${index}`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 rounded-full bg-[#1a71b6] flex items-center justify-center">
                            {isOpen ? (
                              <Minus className="w-3 h-3 text-white" aria-hidden="true" />
                            ) : (
                              <Plus className="w-3 h-3 text-white" aria-hidden="true" />
                            )}
                          </div>
                        </div>
                      </div>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-96 pb-6' : 'max-h-0'
                      }`}
                    >
                      <div
                        id={`faq-answer-${index}`}
                        role="region"
                        aria-labelledby={`faq-question-${index}`}
                        className="text-gray-700 leading-relaxed pl-0"
                      >
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {showContactCTA && (
              <div className="text-center mt-12 pt-8 border-t border-gray-200">
                <p className="text-gray-600 mb-4">{contactCTAText}</p>
                <a
                  href={contactCTALink}
                  className="inline-flex items-center px-6 py-3 bg-[#1a71b6] hover:bg-[#1a71b6]/90 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a71b6] focus:ring-offset-2"
                >
                  Contact Us
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
