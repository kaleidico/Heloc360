import { defineType, defineField, defineArrayMember } from 'sanity'

// White rounded card on a gray-50 band with a heading and a 2-column split:
// left column stacks heading+paragraph topics, right column is a heading +
// bullet list. Reproduces the home-equity-estimator "Understanding Home
// Equity" educational section.
export const infoSplitCard = defineType({
  name: 'infoSplitCard',
  title: 'Info split card (topics + bullets)',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Card heading', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'topics',
      title: 'Left column topics',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'topic',
          type: 'object',
          fields: [
            { name: 'heading', type: 'string', title: 'Topic heading' },
            { name: 'body', type: 'text', rows: 3, title: 'Topic body' },
          ],
          preview: { select: { title: 'heading' } },
        }),
      ],
    }),
    defineField({ name: 'listHeading', title: 'Right column heading', type: 'string' }),
    defineField({
      name: 'bullets',
      title: 'Right column bullets',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Info split card: ${title}` }
    },
  },
})
