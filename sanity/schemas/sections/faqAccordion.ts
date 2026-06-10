import { defineType, defineField, defineArrayMember } from 'sanity'

// Full-width band (white or gray-50), constrained max-w-3xl: a centered header,
// a Plus/Minus expand-collapse FAQ list (with JSON-LD FAQ structured data), and
// an optional contact CTA. Verbatim reproduction of the shared <FAQ> component
// (components/ui/faq.tsx). Distinct from `faqSection`, which uses the shadcn
// Accordion primitive and Portable Text answers.
export const faqAccordion = defineType({
  name: 'faqAccordion',
  title: 'FAQ accordion (Plus/Minus + contact CTA)',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      options: {
        list: [
          { title: 'White', value: 'white' },
          { title: 'Gray 50', value: 'gray' },
        ],
        layout: 'radio',
      },
      initialValue: 'white',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'faqItem',
          type: 'object',
          fields: [
            { name: 'question', type: 'string', title: 'Question' },
            { name: 'answer', type: 'text', rows: 3, title: 'Answer' },
          ],
          preview: { select: { title: 'question' } },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: 'showContactCTA',
      title: 'Show contact CTA',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ name: 'contactCTAText', title: 'Contact CTA text', type: 'string' }),
    defineField({ name: 'contactCTALink', title: 'Contact CTA link', type: 'string' }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: `FAQ: ${title || '(untitled)'}` }
    },
  },
})
