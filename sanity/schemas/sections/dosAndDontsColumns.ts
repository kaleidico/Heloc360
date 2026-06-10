import { defineType, defineField, defineArrayMember } from 'sanity'

// Full-width white band, constrained max-w-4xl, with two columns: a "smart uses"
// column (green CheckCircle, blue heading) and an "avoid" column (red
// AlertTriangle, red heading). Each item is an icon + bold title + small body.
// Reproduces the heloc-101 "Common Uses for HELOCs" section.
const itemArray = (title) =>
  defineField({
    name: title === 'dos' ? 'dos' : 'donts',
    title: title === 'dos' ? 'Smart-use items' : 'Avoid items',
    type: 'array',
    of: [
      defineArrayMember({
        name: 'item',
        type: 'object',
        fields: [
          { name: 'title', type: 'string', title: 'Title' },
          { name: 'body', type: 'text', rows: 2, title: 'Body' },
        ],
        preview: { select: { title: 'title' } },
      }),
    ],
  })

export const dosAndDontsColumns = defineType({
  name: 'dosAndDontsColumns',
  title: "Do's and don'ts columns",
  type: 'object',
  fields: [
    defineField({ name: 'anchorId', title: 'Anchor id (e.g. uses)', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'dosHeading', title: 'Left column heading', type: 'string' }),
    itemArray('dos'),
    defineField({ name: 'dontsHeading', title: 'Right column heading', type: 'string' }),
    itemArray('donts'),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Do's/Don'ts: ${title}` }
    },
  },
})
