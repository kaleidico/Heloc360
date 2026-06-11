import { defineType, defineField, defineArrayMember } from 'sanity'

// A stack of "Label: body" disclaimer paragraphs in one of two verbatim
// treatments from the calculator pages:
//   yellowCard — yellow-50 bordered card on a gray-50 band (home-equity-estimator)
//   grayBand   — gray-100 band with centered heading + white prose card (debt-consolidation)
export const labeledDisclaimers = defineType({
  name: 'labeledDisclaimers',
  title: 'Labeled disclaimers',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Yellow card (gray band)', value: 'yellowCard' },
          { title: 'Gray band + white card', value: 'grayBand' },
        ],
        layout: 'radio',
      },
      initialValue: 'yellowCard',
    }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'items',
      title: 'Disclaimer items',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'item',
          type: 'object',
          fields: [
            {
              name: 'label',
              type: 'string',
              title: 'Bold label (no trailing colon — it is added automatically)',
            },
            { name: 'body', type: 'text', rows: 3, title: 'Body' },
          ],
          preview: { select: { title: 'label' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', variant: 'variant' },
    prepare({ title, variant }) {
      return { title: `Disclaimers (${variant || 'yellowCard'}): ${title || ''}` }
    },
  },
})
