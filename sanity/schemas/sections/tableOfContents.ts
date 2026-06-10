import { defineType, defineField, defineArrayMember } from 'sanity'

// Full-width gray-50 band: centered heading + a 2-column grid of in-page anchor
// links (CheckCircle + label). Items are split evenly across two columns in
// source order. Reproduces the heloc-101 "What You'll Learn" TOC. The `href`
// values must match the anchor ids of the target sections (e.g. "#benefits").
export const tableOfContents = defineType({
  name: 'tableOfContents',
  title: 'Table of contents (anchor nav)',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'tocItem',
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label' },
            { name: 'href', type: 'string', title: 'Anchor href (e.g. #benefits)' },
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
            prepare: ({ title, subtitle }) => ({ title: title || '(item)', subtitle }),
          },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `TOC: ${title}` }
    },
  },
})
