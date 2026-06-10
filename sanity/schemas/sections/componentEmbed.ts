import { defineType, defineField } from 'sanity'

// Generic escape hatch for embedding an interactive client component whose logic
// must NOT be reimplemented as content (form state, fetch/submit, toasts, etc.).
// The renderer maps `component` → the real imported React component. Keep this
// block minimal: any surrounding copy/heading/wrapper that the source places
// around the component is modeled by the *host* section (e.g. formCtaBand), not
// here. New embeddable components are added by extending both the enum below and
// the switch in components/sections/component-embed-section.tsx.
//
// Known components:
//   mailingListForm  — the homepage Lead Capture form (components/mailing-list-form.tsx)
//   contactForm      — the full /contact page form + chrome (components/contact/contact-form.tsx)
//   preQualForm      — the two-step pre-qual form (components/pre-qual/pre-qual-form.tsx);
//                      rendered with useCase="universal" by the renderer
//   stickyCtaSuppress — side-effect component that hides the sticky CTA while mounted
export const componentEmbed = defineType({
  name: 'componentEmbed',
  title: 'Component embed (interactive)',
  type: 'object',
  fields: [
    defineField({
      name: 'component',
      title: 'Component',
      type: 'string',
      options: {
        list: [
          { title: 'Mailing list form', value: 'mailingListForm' },
          { title: 'Contact form (full /contact page)', value: 'contactForm' },
          { title: 'Pre-qual form (useCase: universal)', value: 'preQualForm' },
          { title: 'Sticky CTA suppress (side-effect)', value: 'stickyCtaSuppress' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
  ],
  preview: {
    select: { component: 'component' },
    prepare({ component }) {
      return { title: `Embed: ${component || '(none)'}` }
    },
  },
})
