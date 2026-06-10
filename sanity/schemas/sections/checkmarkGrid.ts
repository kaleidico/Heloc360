import { defineType, defineField, defineArrayMember } from 'sanity'

// Affiliate's two-up "Our Commitment to You" grid. Reproduces verbatim:
//   <div className="bg-gradient-to-r from-[#1b75bc]/10 to-[#007a5e]/10 p-8 rounded-lg mb-12">  (when inGradientBox)
//     <h2 className="text-2xl font-bold text-[#1b75bc] mb-6 flex items-center gap-3">
//       <Icon className="w-6 h-6" />{heading}
//     </h2>
//     <div className="grid md:grid-cols-2 gap-6">
//       <div className="flex items-start gap-3">
//         <CheckCircle className="w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0" />
//         <div>
//           <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
//           <p className="text-gray-700 text-sm">{body}</p>
//         </div>
//       </div>
//     </div>
//   </div>

export const checkmarkGrid = defineType({
  name: 'checkmarkGrid',
  title: 'Checkmark grid',
  type: 'object',
  fields: [
    defineField({
      name: 'inGradientBox',
      title: 'Wrap in gradient box',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'heading',
      title: 'Heading (optional)',
      type: 'string',
    }),
    defineField({
      name: 'icon',
      title: 'Heading icon (lucide name, optional)',
      type: 'string',
      description: 'e.g. Heart — rendered at w-6 h-6 beside the heading.',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'checkmarkItem',
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'body', type: 'text', rows: 2, title: 'Body' },
          ],
          preview: {
            select: { title: 'title' },
            prepare: ({ title }) => ({ title: title || '(item)' }),
          },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Checkmark grid${title ? `: ${title}` : ''}` }
    },
  },
})
