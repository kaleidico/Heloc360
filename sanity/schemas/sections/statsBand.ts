import { defineType, defineField, defineArrayMember } from 'sanity'

// Full-width figures band. Reproduces verbatim:
//   <section className="py-16 bg-white">
//     <div className="container mx-auto px-4">
//       <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//         <div className="text-center">
//           <div className="w-16 h-16 bg-[#1b75bc]/10 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Icon className="w-8 h-8 text-[#1b75bc]" />
//           </div>
//           <div className="text-3xl font-bold text-[#1b75bc] mb-2">{number}</div>
//           <div className="text-gray-600">{label}</div>
//   …
// Reusable for any stat/figure row on marketing pages.

export const statsBand = defineType({
  name: 'statsBand',
  title: 'Stats band (figures)',
  type: 'object',
  fields: [
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'stat',
          type: 'object',
          fields: [
            { name: 'icon', type: 'string', title: 'Icon (lucide name)' },
            { name: 'number', type: 'string', title: 'Number' },
            { name: 'label', type: 'string', title: 'Label' },
          ],
          preview: {
            select: { title: 'number', subtitle: 'label' },
            prepare: ({ title, subtitle }) => ({ title: title || '(stat)', subtitle }),
          },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    select: { stats: 'stats' },
    prepare({ stats }) {
      const count = Array.isArray(stats) ? stats.length : 0
      return { title: 'Stats band', subtitle: `${count} stat${count === 1 ? '' : 's'}` }
    },
  },
})
