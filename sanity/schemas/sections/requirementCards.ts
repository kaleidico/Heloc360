import { defineType, defineField, defineArrayMember } from 'sanity'

// Full-width gray-50 band, constrained max-w-4xl, with a 2-up grid of plain
// Cards. Each card has a blue title and a CheckCircle list; list items are
// either "detailed" (bold title + small body) or "simple" (plain text only).
// Reproduces the heloc-101 "HELOC Qualification Requirements" section.
export const requirementCards = defineType({
  name: 'requirementCards',
  title: 'Requirement cards (checklist cards)',
  type: 'object',
  fields: [
    defineField({ name: 'anchorId', title: 'Anchor id (e.g. qualification)', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'requirementCard',
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Title' },
            {
              name: 'itemStyle',
              type: 'string',
              title: 'Item style',
              options: {
                list: [
                  { title: 'Detailed (title + body)', value: 'detailed' },
                  { title: 'Simple (plain text)', value: 'simple' },
                ],
                layout: 'radio',
              },
              initialValue: 'detailed',
            },
            {
              name: 'items',
              type: 'array',
              title: 'Items',
              of: [
                defineArrayMember({
                  name: 'requirementItem',
                  type: 'object',
                  fields: [
                    { name: 'title', type: 'string', title: 'Title / text' },
                    { name: 'body', type: 'string', title: 'Body (detailed style only)' },
                  ],
                  preview: { select: { title: 'title', subtitle: 'body' } },
                }),
              ],
            },
          ],
          preview: {
            select: { title: 'title', subtitle: 'itemStyle' },
            prepare: ({ title, subtitle }) => ({ title: title || '(card)', subtitle }),
          },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Requirement cards: ${title}` }
    },
  },
})
