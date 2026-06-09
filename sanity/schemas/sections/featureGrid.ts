import { defineType, defineField, defineArrayMember } from 'sanity'

export const featureGridSection = defineType({
  name: 'featureGridSection',
  title: 'Feature grid',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 2 }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: { list: [2, 3, 4] },
      initialValue: 3,
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'feature',
          fields: [
            { name: 'icon', type: 'string', title: 'Icon name (lucide)', description: 'e.g. CheckCircle, Home, Shield' },
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'description', type: 'text', rows: 3, title: 'Description' },
          ],
          preview: { select: { title: 'title', subtitle: 'icon' } },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'heading', features: 'features' },
    prepare({ title, features }) {
      const count = Array.isArray(features) ? features.length : 0
      return { title: `Feature grid: ${title || '(no heading)'}`, subtitle: `${count} feature${count === 1 ? '' : 's'}` }
    },
  },
})
