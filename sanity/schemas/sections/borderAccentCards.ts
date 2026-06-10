import { defineType, defineField, defineArrayMember } from 'sanity'

// Full-width band (white or red-50), constrained max-w-4xl: a grid of
// left-border-accent cards, each with a rounded icon tile, title, and body.
// Configurable columns (2 or 3) and optional colored titles (the "risks"
// variant). Reproduces both the heloc-101 "Benefits" (white, 3-up, gap-6,
// default titles, gray-600 body) and "Risks" (red-50, 2-up, gap-8, colored
// titles, gray-700 body) sections.
const ACCENTS = [
  { title: 'Green (#02c39a)', value: 'green' },
  { title: 'Blue (#1b75bc)', value: 'blue' },
  { title: 'Purple', value: 'purple' },
  { title: 'Teal', value: 'teal' },
  { title: 'Orange', value: 'orange' },
  { title: 'Red', value: 'red' },
  { title: 'Yellow', value: 'yellow' },
]

export const borderAccentCards = defineType({
  name: 'borderAccentCards',
  title: 'Border-accent cards (left border)',
  type: 'object',
  fields: [
    defineField({ name: 'anchorId', title: 'Anchor id (e.g. benefits)', type: 'string' }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      options: {
        list: [
          { title: 'White', value: 'white' },
          { title: 'Red 50', value: 'red' },
        ],
        layout: 'radio',
      },
      initialValue: 'white',
    }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: {
        list: [
          { title: '2 (gap-8)', value: 2 },
          { title: '3 (gap-6)', value: 3 },
        ],
        layout: 'radio',
      },
      initialValue: 3,
    }),
    defineField({
      name: 'coloredTitles',
      title: 'Colored card titles (risks variant)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'borderAccentCard',
          type: 'object',
          fields: [
            { name: 'icon', type: 'string', title: 'Icon (lucide name)' },
            {
              name: 'accent',
              type: 'string',
              title: 'Accent',
              options: { list: ACCENTS, layout: 'dropdown' },
              initialValue: 'green',
            },
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'body', type: 'text', rows: 3, title: 'Body' },
          ],
          preview: {
            select: { title: 'title', subtitle: 'accent' },
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
      return { title: `Border-accent cards: ${title}` }
    },
  },
})
