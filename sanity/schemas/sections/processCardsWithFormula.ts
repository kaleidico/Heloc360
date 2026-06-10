import { defineType, defineField, defineArrayMember } from 'sanity'

// Full-width gray-50 band, constrained max-w-4xl: a 2-up grid of icon-tile cards
// (each a CheckCircle bullet list) followed by a white formula/highlight box
// with a blue-50 emphasized line. Reproduces the heloc-101 "How HELOCs Work"
// section. Card tint: blue (#1b75bc) or green (#02c39a).
export const processCardsWithFormula = defineType({
  name: 'processCardsWithFormula',
  title: 'Process cards + formula box',
  type: 'object',
  fields: [
    defineField({ name: 'anchorId', title: 'Anchor id (e.g. how-helocs-work)', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'processCard',
          type: 'object',
          fields: [
            { name: 'icon', type: 'string', title: 'Icon (lucide name)' },
            {
              name: 'tint',
              type: 'string',
              title: 'Tint',
              options: {
                list: [
                  { title: 'Blue (#1b75bc)', value: 'blue' },
                  { title: 'Green (#02c39a)', value: 'green' },
                ],
                layout: 'radio',
              },
              initialValue: 'blue',
            },
            { name: 'title', type: 'string', title: 'Title' },
            {
              name: 'points',
              type: 'array',
              title: 'Points',
              of: [
                defineArrayMember({
                  name: 'point',
                  type: 'object',
                  fields: [{ name: 'text', type: 'string', title: 'Text' }],
                  preview: { select: { title: 'text' } },
                }),
              ],
            },
          ],
          preview: {
            select: { title: 'title', subtitle: 'tint' },
            prepare: ({ title, subtitle }) => ({ title: title || '(card)', subtitle }),
          },
        }),
      ],
    }),
    defineField({ name: 'formulaHeading', title: 'Formula box heading', type: 'string' }),
    defineField({ name: 'formulaIntro', title: 'Formula intro', type: 'text', rows: 2 }),
    defineField({ name: 'formula', title: 'Formula (emphasized line)', type: 'string' }),
    defineField({ name: 'formulaNote', title: 'Formula note (fine print)', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Process cards: ${title}` }
    },
  },
})
