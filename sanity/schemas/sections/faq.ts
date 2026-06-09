import { defineType, defineField, defineArrayMember } from 'sanity'

export const faqSection = defineType({
  name: 'faqSection',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: 'Frequently asked questions' }),
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          fields: [
            { name: 'question', type: 'string', title: 'Question', validation: (R: any) => R.required() },
            {
              name: 'answer',
              type: 'array',
              title: 'Answer',
              of: [{ type: 'block' }],
              validation: (R: any) => R.required().min(1),
            },
          ],
          preview: { select: { title: 'question' } },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'heading', items: 'items' },
    prepare({ title, items }) {
      const count = Array.isArray(items) ? items.length : 0
      return { title: `FAQ: ${title}`, subtitle: `${count} question${count === 1 ? '' : 's'}` }
    },
  },
})
