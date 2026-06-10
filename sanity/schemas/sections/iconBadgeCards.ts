import { defineType, defineField, defineArrayMember } from 'sanity'

// Consent's 3-up "Who May Contact You" cards. Reproduces verbatim:
//   <div className="grid md:grid-cols-3 gap-6">
//     <div className="text-center p-6 border border-gray-200 rounded-lg">
//       <div className="w-12 h-12 bg-{tint}/10 rounded-full flex items-center justify-center mx-auto mb-4">
//         <Icon className="w-6 h-6 text-{tint}" />
//       </div>
//       <h3 className="text-lg font-semibold text-[#1b75bc] mb-2">{title}</h3>
//       <p className="text-gray-600 text-sm">{body}</p>
//     </div>
//   </div>
// Per-card tint: blue (#1b75bc), green (#02c39a) use bg-{hex}/10 + text-{hex};
// purple uses bg-purple-100 + text-purple-600 (verbatim from source).

export const iconBadgeCards = defineType({
  name: 'iconBadgeCards',
  title: 'Icon badge cards',
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
      initialValue: 3,
    }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'iconBadgeCard',
          type: 'object',
          fields: [
            { name: 'icon', type: 'string', title: 'Icon (lucide name)' },
            {
              name: 'iconTint',
              type: 'string',
              title: 'Icon tint',
              options: {
                list: [
                  { title: 'Blue (#1b75bc)', value: 'blue' },
                  { title: 'Green (#02c39a)', value: 'green' },
                  { title: 'Purple', value: 'purple' },
                ],
                layout: 'radio',
              },
              initialValue: 'blue',
            },
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'body', type: 'text', rows: 3, title: 'Body' },
          ],
          preview: {
            select: { title: 'title', subtitle: 'iconTint' },
            prepare: ({ title, subtitle }) => ({ title: title || '(card)', subtitle }),
          },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Icon badge cards' }
    },
  },
})
