import { blogPost } from './blogPost'
import { teamMember } from './teamMember'
import { page } from './page'
import { heroSection } from './sections/hero'
import { richTextSection } from './sections/richText'
import { ctaSection } from './sections/cta'
import { featureGridSection } from './sections/featureGrid'
import { faqSection } from './sections/faq'
import { imageWithTextSection } from './sections/imageWithText'

export const schemaTypes = [
  // Documents
  blogPost,
  teamMember,
  page,
  // Section objects
  heroSection,
  richTextSection,
  ctaSection,
  featureGridSection,
  faqSection,
  imageWithTextSection,
]
