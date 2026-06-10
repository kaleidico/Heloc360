import MailingListForm from '@/components/mailing-list-form'
import ContactForm from '@/components/contact/contact-form'
import { PreQualForm } from '@/components/pre-qual/pre-qual-form'
import { StickyCtaSuppress } from '@/components/pre-qual/sticky-cta-suppress'

export type ComponentEmbedValue = {
  _type: 'componentEmbed'
  _key: string
  component?: 'mailingListForm' | 'contactForm' | 'preQualForm' | 'stickyCtaSuppress'
}

// Renders a real interactive client component by key, preserving its own client
// logic (state, fetch/submit, toasts). The component is imported and rendered
// verbatim — this block only governs *which* component appears and *where*, while
// any surrounding copy/wrapper is owned by the host section. This is also the
// mechanism Wave 4 will reuse for the pre-qual / contact forms.
export function ComponentEmbedSection({ value }: { value: ComponentEmbedValue }) {
  switch (value.component) {
    case 'mailingListForm':
      return <MailingListForm />
    case 'contactForm':
      // Renders its own full page layout (hero, contact methods, form, sidebar, CTA).
      return <ContactForm />
    case 'preQualForm':
      // Source page hardcodes useCase="universal"; mirror that here.
      return <PreQualForm useCase="universal" />
    case 'stickyCtaSuppress':
      // Side-effect only — sets body[data-suppress-sticky-cta] while mounted.
      return <StickyCtaSuppress />
    default:
      return null
  }
}
