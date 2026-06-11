import { HeroSection, type HeroSectionValue } from './hero-section'
import { RichTextSection, type RichTextSectionValue } from './rich-text-section'
import { CtaSection, type CtaSectionValue } from './cta-section'
import { FeatureGridSection, type FeatureGridSectionValue } from './feature-grid-section'
import { FaqSection, type FaqSectionValue } from './faq-section'
import { ImageWithTextSection, type ImageWithTextSectionValue } from './image-with-text-section'
import { LegalHeaderSection, type LegalHeaderValue } from './legal-header-section'
import { LegalProseSection, type LegalProseValue } from './legal-prose-section'
import { LegalContentSection, type LegalContentValue } from './legal-content-section'
import { ProseSection, type ProseSectionValue } from './prose-section'
import { IconHeadingSection, type IconHeadingValue } from './icon-heading-section'
import { AlertCalloutSection, type AlertCalloutValue } from './alert-callout-section'
import { InfoCardSection, type InfoCardValue } from './info-card-section'
import { ButtonRowSection, type ButtonRowValue } from './button-row-section'
import { ContactCalloutSection, type ContactCalloutValue } from './contact-callout-section'
import { PageFooterNoteSection, type PageFooterNoteValue } from './page-footer-note-section'
import { ChecklistCardGridSection, type ChecklistCardGridValue } from './checklist-card-grid-section'
import { TitledBulletCardsSection, type TitledBulletCardsValue } from './titled-bullet-cards-section'
import { IconBadgeCardsSection, type IconBadgeCardsValue } from './icon-badge-cards-section'
import { CheckmarkGridSection, type CheckmarkGridValue } from './checkmark-grid-section'
import { AccentNotesSection, type AccentNotesValue } from './accent-notes-section'
import { TwoTierCardsSection, type TwoTierCardsValue } from './two-tier-cards-section'
import { ContentSectionSection, type ContentSectionValue } from './content-section-section'
import { MarketingHeroSection, type MarketingHeroValue } from './marketing-hero-section'
import { StatsBandSection, type StatsBandValue } from './stats-band-section'
import { StorySection, type StorySectionValue } from './story-section'
import { ValueCardsGridSection, type ValueCardsGridValue } from './value-cards-grid-section'
import { TeamSection, type TeamSectionValue } from './team-section'
import { MissionStatementSection, type MissionStatementValue } from './mission-statement-section'
import { AwardsGridSection, type AwardsGridValue } from './awards-grid-section'
import { MarketingCtaBandSection, type MarketingCtaBandValue } from './marketing-cta-band-section'
import { CenteredHeroBandSection, type CenteredHeroBandValue } from './centered-hero-band-section'
import { TableOfContentsSection, type TableOfContentsValue } from './table-of-contents-section'
import { DefinitionWithImageSection, type DefinitionWithImageValue } from './definition-with-image-section'
import { ProcessCardsWithFormulaSection, type ProcessCardsWithFormulaValue } from './process-cards-with-formula-section'
import { BorderAccentCardsSection, type BorderAccentCardsValue } from './border-accent-cards-section'
import { DosAndDontsColumnsSection, type DosAndDontsColumnsValue } from './dos-and-donts-columns-section'
import { RequirementCardsSection, type RequirementCardsValue } from './requirement-cards-section'
import { FaqAccordionSection, type FaqAccordionValue } from './faq-accordion-section'
import { GradientCtaBandSection, type GradientCtaBandValue } from './gradient-cta-band-section'
import { ImageHeroSection, type ImageHeroValue } from './image-hero-section'
import { SplitContentChecklistSection, type SplitContentChecklistValue } from './split-content-checklist-section'
import { NumberedProcessCardsSection, type NumberedProcessCardsValue } from './numbered-process-cards-section'
import { IconFeatureGridSection, type IconFeatureGridValue } from './icon-feature-grid-section'
import { BenefitsWithImageSection, type BenefitsWithImageValue } from './benefits-with-image-section'
import { FormCtaBandSection, type FormCtaBandValue } from './form-cta-band-section'
import { PreQualIntroSection, type PreQualIntroValue } from './pre-qual-intro-section'
import { PageHeaderBandSection, type PageHeaderBandValue } from './page-header-band-section'
import { InfoSplitCardSection, type InfoSplitCardValue } from './info-split-card-section'
import { LabeledDisclaimersSection, type LabeledDisclaimersValue } from './labeled-disclaimers-section'
import { BulletPanelHeroSection, type BulletPanelHeroValue } from './bullet-panel-hero-section'
import { LinkCardsGridSection, type LinkCardsGridValue } from './link-cards-grid-section'
import { HtmlEmbedSection, type HtmlEmbedValue } from './html-embed-section'
import { ComponentEmbedSection, type ComponentEmbedValue } from './component-embed-section'

export type Section =
  | HeroSectionValue
  | RichTextSectionValue
  | CtaSectionValue
  | FeatureGridSectionValue
  | FaqSectionValue
  | ImageWithTextSectionValue
  | LegalHeaderValue
  | LegalProseValue
  | LegalContentValue
  | ProseSectionValue
  | IconHeadingValue
  | AlertCalloutValue
  | InfoCardValue
  | ButtonRowValue
  | ContactCalloutValue
  | PageFooterNoteValue
  | ChecklistCardGridValue
  | TitledBulletCardsValue
  | IconBadgeCardsValue
  | CheckmarkGridValue
  | AccentNotesValue
  | TwoTierCardsValue
  | ContentSectionValue
  | MarketingHeroValue
  | StatsBandValue
  | StorySectionValue
  | ValueCardsGridValue
  | TeamSectionValue
  | MissionStatementValue
  | AwardsGridValue
  | MarketingCtaBandValue
  | CenteredHeroBandValue
  | TableOfContentsValue
  | DefinitionWithImageValue
  | ProcessCardsWithFormulaValue
  | BorderAccentCardsValue
  | DosAndDontsColumnsValue
  | RequirementCardsValue
  | FaqAccordionValue
  | GradientCtaBandValue
  | ImageHeroValue
  | SplitContentChecklistValue
  | NumberedProcessCardsValue
  | IconFeatureGridValue
  | BenefitsWithImageValue
  | FormCtaBandValue
  | PreQualIntroValue
  | PageHeaderBandValue
  | InfoSplitCardValue
  | LabeledDisclaimersValue
  | BulletPanelHeroValue
  | LinkCardsGridValue
  | HtmlEmbedValue
  | ComponentEmbedValue

// Renders a single section, keyed by its `_key`. Exported so container blocks
// (e.g. contentSection) can recursively render their nested children, making
// rendering recursive one level deep.
export function renderBlock(section: Section): React.ReactNode {
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
    case 'legalContent':
      return <LegalContentSection key={section._key} value={section} />
    case 'proseSection':
      return <ProseSection key={section._key} value={section} />
    case 'iconHeading':
      return <IconHeadingSection key={section._key} value={section} />
    case 'alertCallout':
      return <AlertCalloutSection key={section._key} value={section} />
    case 'infoCard':
      return <InfoCardSection key={section._key} value={section} />
    case 'buttonRow':
      return <ButtonRowSection key={section._key} value={section} />
    case 'contactCallout':
      return <ContactCalloutSection key={section._key} value={section} />
    case 'pageFooterNote':
      return <PageFooterNoteSection key={section._key} value={section} />
    case 'checklistCardGrid':
      return <ChecklistCardGridSection key={section._key} value={section} />
    case 'titledBulletCards':
      return <TitledBulletCardsSection key={section._key} value={section} />
    case 'iconBadgeCards':
      return <IconBadgeCardsSection key={section._key} value={section} />
    case 'checkmarkGrid':
      return <CheckmarkGridSection key={section._key} value={section} />
    case 'accentNotes':
      return <AccentNotesSection key={section._key} value={section} />
    case 'twoTierCards':
      return <TwoTierCardsSection key={section._key} value={section} />
    case 'contentSection':
      return <ContentSectionSection key={section._key} value={section} />
    case 'marketingHero':
      return <MarketingHeroSection key={section._key} value={section} />
    case 'statsBand':
      return <StatsBandSection key={section._key} value={section} />
    case 'storySection':
      return <StorySection key={section._key} value={section} />
    case 'valueCardsGrid':
      return <ValueCardsGridSection key={section._key} value={section} />
    case 'teamSection':
      return <TeamSection key={section._key} value={section} />
    case 'missionStatement':
      return <MissionStatementSection key={section._key} value={section} />
    case 'awardsGrid':
      return <AwardsGridSection key={section._key} value={section} />
    case 'marketingCtaBand':
      return <MarketingCtaBandSection key={section._key} value={section} />
    case 'centeredHeroBand':
      return <CenteredHeroBandSection key={section._key} value={section} />
    case 'tableOfContents':
      return <TableOfContentsSection key={section._key} value={section} />
    case 'definitionWithImage':
      return <DefinitionWithImageSection key={section._key} value={section} />
    case 'processCardsWithFormula':
      return <ProcessCardsWithFormulaSection key={section._key} value={section} />
    case 'borderAccentCards':
      return <BorderAccentCardsSection key={section._key} value={section} />
    case 'dosAndDontsColumns':
      return <DosAndDontsColumnsSection key={section._key} value={section} />
    case 'requirementCards':
      return <RequirementCardsSection key={section._key} value={section} />
    case 'faqAccordion':
      return <FaqAccordionSection key={section._key} value={section} />
    case 'gradientCtaBand':
      return <GradientCtaBandSection key={section._key} value={section} />
    case 'imageHero':
      return <ImageHeroSection key={section._key} value={section} />
    case 'splitContentChecklist':
      return <SplitContentChecklistSection key={section._key} value={section} />
    case 'numberedProcessCards':
      return <NumberedProcessCardsSection key={section._key} value={section} />
    case 'iconFeatureGrid':
      return <IconFeatureGridSection key={section._key} value={section} />
    case 'benefitsWithImage':
      return <BenefitsWithImageSection key={section._key} value={section} />
    case 'formCtaBand':
      return <FormCtaBandSection key={section._key} value={section} />
    case 'preQualIntro':
      return <PreQualIntroSection key={section._key} value={section} />
    case 'pageHeaderBand':
      return <PageHeaderBandSection key={section._key} value={section} />
    case 'infoSplitCard':
      return <InfoSplitCardSection key={section._key} value={section} />
    case 'labeledDisclaimers':
      return <LabeledDisclaimersSection key={section._key} value={section} />
    case 'bulletPanelHero':
      return <BulletPanelHeroSection key={section._key} value={section} />
    case 'linkCardsGrid':
      return <LinkCardsGridSection key={section._key} value={section} />
    case 'htmlEmbed':
      return <HtmlEmbedSection key={section._key} value={section} />
    case 'componentEmbed':
      return <ComponentEmbedSection key={section._key} value={section} />
    default:
      // Section type unknown — likely a schema update without a matching renderer.
      // Render nothing in production; surface the type during development.
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Unknown section type:', (section as { _type?: string })._type)
      }
      return null
  }
}

export function SectionRenderer({ sections }: { sections: Section[] }) {
  return <>{sections.map((section) => renderBlock(section))}</>
}
