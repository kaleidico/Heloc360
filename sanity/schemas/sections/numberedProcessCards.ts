import { defineType, defineField, defineArrayMember } from 'sanity'

// Full-width band (selectable bg) with a centered header and a 3-up grid of
// bordered cards, each showing a numbered circular badge, a blue title, and body
// copy. Per-card accent drives the badge background + number color (static maps
// in the renderer). Reproduces verbatim the homepage "Our Process" section:
//   <section className="py-16 bg-white" aria-labelledby={anchorId}>
//     <div className="text-center mb-12"><h2 className="...text-[#1b75bc] mb-4"/><p className="text-lg text-gray-600 max-w-2xl mx-auto"/></div>
//     <div className="grid md:grid-cols-3 gap-8" role="list">
//       <Card className="text-center border-2 border-[#1b75bc]/20 hover:border-[#1b75bc]/20 transition-colors" role="listitem">
//         <CardHeader><div className="w-16 h-16 {badgeBg} rounded-full flex items-center justify-center mx-auto mb-4">
//           <span className="text-2xl font-bold {numberColor}" aria-label="Step N">{n}</span></div>
//           <CardTitle className="text-xl text-[#1b75bc]"/></CardHeader>
//         <CardContent><p className="text-gray-600"/></CardContent>
export const numberedProcessCards = defineType({
  name: 'numberedProcessCards',
  title: 'Numbered process cards (3-up)',
  type: 'object',
  fields: [
    defineField({ name: 'anchorId', title: 'Anchor id (aria-labelledby / h2 id)', type: 'string' }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      options: {
        list: [
          { title: 'White', value: 'white' },
          { title: 'Gray 50', value: 'gray' },
        ],
        layout: 'radio',
      },
      initialValue: 'white',
    }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 2 }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'processStep',
          type: 'object',
          fields: [
            { name: 'number', type: 'string', title: 'Number' },
            {
              name: 'accent',
              type: 'string',
              title: 'Accent',
              options: {
                list: [
                  { title: 'Blue (#1b75bc)', value: 'blue' },
                  { title: 'Green (bg #02c39a / text #007a5e)', value: 'green' },
                  { title: 'Teal', value: 'teal' },
                ],
                layout: 'radio',
              },
              initialValue: 'blue',
            },
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'body', type: 'text', rows: 3, title: 'Body' },
          ],
          preview: {
            select: { title: 'title', subtitle: 'number' },
            prepare: ({ title, subtitle }) => ({ title: title || '(step)', subtitle: `Step ${subtitle || ''}` }),
          },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Process cards: ${title}` }
    },
  },
})
