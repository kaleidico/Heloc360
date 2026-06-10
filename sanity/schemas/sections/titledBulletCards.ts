import { defineType, defineField, defineArrayMember } from 'sanity'

// Consent's stacked "Types of Communications You May Receive" cards.
// Reproduces verbatim:
//   <div className="space-y-6">
//     <div className="border border-gray-200 rounded-lg p-6">
//       <h3 className="text-lg font-semibold text-[#1b75bc] mb-3">{title}</h3>
//       <p className="text-gray-700 mb-3">{intro}</p>
//       <ul className="list-disc pl-6 space-y-1 text-gray-700">
//         <li>{bullet}</li>
//       </ul>
//     </div>
//   </div>

export const titledBulletCards = defineType({
  name: 'titledBulletCards',
  title: 'Titled bullet cards',
  type: 'object',
  fields: [
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'titledBulletCard',
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'intro', type: 'text', rows: 2, title: 'Intro paragraph' },
            {
              name: 'bullets',
              type: 'array',
              title: 'Bullets',
              of: [{ type: 'string' }],
            },
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
      return { title: 'Titled bullet cards' }
    },
  },
})
