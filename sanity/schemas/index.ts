import { blogPost } from './blogPost'
import { teamMember } from './teamMember'
import { page } from './page'
import { heroSection } from './sections/hero'
import { richTextSection } from './sections/richText'
import { ctaSection } from './sections/cta'
import { featureGridSection } from './sections/featureGrid'
import { faqSection } from './sections/faq'
import { imageWithTextSection } from './sections/imageWithText'
import { legalHeader } from './sections/legalHeader'
import { legalProse } from './sections/legalProse'
import { legalContent } from './sections/legalContent'
import { proseSection } from './sections/proseSection'
import { iconHeading } from './sections/iconHeading'
import { alertCallout } from './sections/alertCallout'
import { infoCard } from './sections/infoCard'
import { buttonRow } from './sections/buttonRow'
import { contactCallout } from './sections/contactCallout'
import { pageFooterNote } from './sections/pageFooterNote'

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
  legalHeader,
  legalProse,
  legalContent,
  proseSection,
  iconHeading,
  alertCallout,
  infoCard,
  buttonRow,
  contactCallout,
  pageFooterNote,
]
