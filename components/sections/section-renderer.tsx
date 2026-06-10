import { HeroSection, type HeroSectionValue } from './hero-section'
import { RichTextSection, type RichTextSectionValue } from './rich-text-section'
import { CtaSection, type CtaSectionValue } from './cta-section'
import { FeatureGridSection, type FeatureGridSectionValue } from './feature-grid-section'
import { FaqSection, type FaqSectionValue } from './faq-section'
import { ImageWithTextSection, type ImageWithTextSectionValue } from './image-with-text-section'
import { LegalHeaderSection, type LegalHeaderValue } from './legal-header-section'
import { LegalProseSection, type LegalProseValue } from './legal-prose-section'

export type Section =
  | HeroSectionValue
  | RichTextSectionValue
  | CtaSectionValue
  | FeatureGridSectionValue
  | FaqSectionValue
  | ImageWithTextSectionValue
  | LegalHeaderValue
  | LegalProseValue

export function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case 'heroSection':
            return <HeroSection key={section._key} value={section} />
          case 'richTextSection':
            return <RichTextSection key={section._key} value={section} />
          case 'ctaSection':
            return <CtaSection key={section._key} value={section} />
          case 'featureGridSection':
            return <FeatureGridSection key={section._key} value={section} />
          case 'faqSection':
            return <FaqSection key={section._key} value={section} />
          case 'imageWithTextSection':
            return <ImageWithTextSection key={section._key} value={section} />
          case 'legalHeader':
            return <LegalHeaderSection key={section._key} value={section} />
          case 'legalProse':
            return <LegalProseSection key={section._key} value={section} />
          default:
            // Section type unknown — likely a schema update without a matching renderer.
            // Render nothing in production; surface the type during development.
            if (process.env.NODE_ENV !== 'production') {
              console.warn('Unknown section type:', (section as { _type?: string })._type)
            }
            return null
        }
      })}
    </>
  )
}
