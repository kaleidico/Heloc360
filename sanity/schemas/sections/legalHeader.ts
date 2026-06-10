import { defineType, defineField } from 'sanity'

export const legalHeader = defineType({
  name: 'legalHeader',
  title: 'Legal header (gradient banner)',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'subheading' },
    prepare({ title, subtitle }) {
      return { title: `Legal header: ${title || '(none)'}`, subtitle }
    },
  },
})
