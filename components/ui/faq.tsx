"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"

export interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  title?: string
  subtitle?: string
  items: FAQItem[]
  showContactCTA?: boolean
  contactCTAText?: string
  contactCTALink?: string
  className?: string
  generateStructuredData?: boolean
}

// Generate structured data for SEO
const generateFAQStructuredData = (items: FAQItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

export default function FAQ({
  title = "Frequently Asked Questions",
  subtitle,
  items,
  showContactCTA = true,
  contactCTAText = "Still have questions?",
  contactCTALink = "/contact",
  className = "",
  generateStructuredData = true,
}: FAQProps) {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]))
  }

  const structuredData = generateStructuredData ? generateFAQStructuredData(items) : null

  return (
    <>
      {/* Structured Data for SEO */}
      {structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      )}

      <div className={`py-16 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            {(title || subtitle) && (
              <div className="text-center mb-12">
                {title && <h2 className="text-3xl md:text-4xl font-bold text-[#1b75bc] mb-4">{title}</h2>}
                {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
              </div>
            )}

            {/* FAQ List */}
            <div className="space-y-0">
              {items.map((faq, index) => {
                const isOpen = openItems.includes(index)
                return (
                  <div key={index} className="border-b border-gray-200 last:border-b-0">
                    <button
                      className="w-full text-left py-6 focus:outline-none focus:ring-2 focus:ring-[#1b75bc] focus:ring-offset-2 rounded-sm"
                      onClick={() => toggleItem(index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${index}`}
                      id={`faq-question-${index}`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 rounded-full bg-[#1b75bc] flex items-center justify-center">
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
                        isOpen ? "max-h-96 pb-6" : "max-h-0"
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

            {/* Contact CTA */}
            {showContactCTA && (
              <div className="text-center mt-12 pt-8 border-t border-gray-200">
                <p className="text-gray-600 mb-4">{contactCTAText}</p>
                <a
                  href={contactCTALink}
                  className="inline-flex items-center px-6 py-3 bg-[#1b75bc] hover:bg-[#1b75bc]/90 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#1b75bc] focus:ring-offset-2"
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
