import { defineType, defineField, defineArrayMember } from 'sanity'

// The closing gradient contact box, promoted from an inline field on
// `legalProse` to a standalone block. Reproduces the
// `bg-gradient-to-r from-[#1b75bc]/10 to-[#007a5e]/10 p-8 rounded-lg mt-12`
// box verbatim, with a heading, body text, and a row of primary/outline
// buttons.

export const contactCallout = defineType({
  name: 'contactCallout',
  title: 'Contact callout (gradient box)',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'bodyText', title: 'Body text', type: 'text', rows: 3 }),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'button',
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label', validation: (R) => R.required() },
            {
              name: 'href',
              type: 'string',
              title: 'Href',
              description: 'mailto:…, tel:…, https://…, or an internal /path.',
              validation: (R) => R.required(),
            },
            {
              name: 'style',
              type: 'string',
              title: 'Style',
              options: {
                list: [
                  { title: 'Primary', value: 'primary' },
                  { title: 'Outline', value: 'outline' },
                ],
                layout: 'radio',
              },
              initialValue: 'primary',
            },
          ],
          preview: {
            select: { title: 'label', subtitle: 'style' },
            prepare: ({ title, subtitle }) => ({ title, subtitle }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Contact callout: ${title || ''}` }
    },
  },
})
