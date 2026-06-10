import { defineType, defineField, defineArrayMember } from 'sanity'

// Affiliate's "Types of Partnerships" cards. Reproduces verbatim:
//   <div className="grid md:grid-cols-2 gap-6">
//     <div className="bg-white border border-gray-200 rounded-lg p-6">
//       <h3 className="text-lg font-semibold text-[#1b75bc] mb-3">{title}</h3>
//       <p className="text-gray-700 text-sm mb-4">{body}</p>
//       <p className="text-xs text-gray-600">{finePrint}</p>
//     </div>
//   </div>
// Note: source uses md:grid-cols-2 for these four cards (two rows of two),
// while the brief calls it "4-up" — `columns` defaults to 4 but supports 2 to
// match the source exactly.

export const twoTierCards = defineType({
  name: 'twoTierCards',
  title: 'Two-tier cards',
  type: 'object',
  fields: [
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: {
        list: [
          { title: '2', value: 2 },
          { title: '3', value: 3 },
          { title: '4', value: 4 },
        ],
        layout: 'radio',
      },
      initialValue: 4,
    }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'twoTierCard',
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'body', type: 'text', rows: 3, title: 'Body' },
            { name: 'finePrint', type: 'text', rows: 2, title: 'Fine print' },
          ],
          preview: {
            select: { title: 'title' },
            prepare: ({ title }) => ({ title: title || '(card)' }),
          },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Two-tier cards' }
    },
  },
})
