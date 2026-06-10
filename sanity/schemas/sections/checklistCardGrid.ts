import { defineType, defineField, defineArrayMember } from 'sanity'

// Consent's two-up "What This Means for You" cards. Reproduces verbatim:
//   <div className="grid md:grid-cols-2 gap-6">
//     <div className="bg-white border border-gray-200 rounded-lg p-6">
//       <div className="flex items-start gap-3 mb-4">
//         <Icon className="w-6 h-6 text-[#1b75bc] mt-1 flex-shrink-0" />
//         <h3 className="text-lg font-semibold text-[#1b75bc]">{title}</h3>
//       </div>
//       <ul className="space-y-2 text-gray-700">
//         <li className="flex items-start gap-2">
//           <CheckCircle className="w-4 h-4 text-[#02c39a] mt-1 flex-shrink-0" />
//           <span className="text-sm">{item}</span>
//         </li>
//       </ul>
//     </div>
//   </div>
// Each card carries its own header icon (Phone uses text-[#1b75bc]; the source's
// MessageSquare card uses text-[#02c39a]) via an optional per-card `iconColor`.

export const checklistCardGrid = defineType({
  name: 'checklistCardGrid',
  title: 'Checklist card grid',
  type: 'object',
  fields: [
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'checklistCard',
          type: 'object',
          fields: [
            { name: 'icon', type: 'string', title: 'Header icon (lucide name)' },
            {
              name: 'iconColor',
              type: 'string',
              title: 'Header icon color',
              options: {
                list: [
                  { title: 'Blue (#1b75bc)', value: 'blue' },
                  { title: 'Green (#02c39a)', value: 'green' },
                ],
                layout: 'radio',
              },
              initialValue: 'blue',
            },
            { name: 'title', type: 'string', title: 'Title' },
            {
              name: 'items',
              type: 'array',
              title: 'Checklist items',
              of: [{ type: 'string' }],
            },
          ],
          preview: {
            select: { title: 'title', subtitle: 'icon' },
            prepare: ({ title, subtitle }) => ({ title: title || '(card)', subtitle }),
          },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Checklist card grid' }
    },
  },
})
