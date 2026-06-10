import { defineType, defineField, defineArrayMember } from 'sanity'

// Full-width band (selectable bg) with a constrained max-w-6xl column: a centered
// header, then a 4-up grid of top-border-accent value cards. Reproduces verbatim
// the about page "Our Values" section:
//   <section className="py-16 bg-white">
//     <div className="container mx-auto px-4">
//       <div className="max-w-6xl mx-auto">
//         <div className="text-center mb-12"> <h2/> <p/> </div>
//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//           <Card className="text-center border-t-4 border-t-{accent}">
//             <CardHeader>
//               <div className="w-12 h-12 bg-{tint} rounded-lg flex items-center justify-center mx-auto mb-4">
//                 <Icon className="w-6 h-6 text-{iconColor}" />
//               </div>
//               <CardTitle className="text-xl">{title}</CardTitle>
//             </CardHeader>
//             <CardContent><p className="text-gray-600">{body}</p></CardContent>
// Per-card accent: blue/green/purple/orange (static maps in the renderer).
// Reusable for any "values / pillars" card grid.

export const valueCardsGrid = defineType({
  name: 'valueCardsGrid',
  title: 'Value cards grid (top-border accent)',
  type: 'object',
  fields: [
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
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'valueCard',
          type: 'object',
          fields: [
            { name: 'icon', type: 'string', title: 'Icon (lucide name)' },
            {
              name: 'accent',
              type: 'string',
              title: 'Accent',
              options: {
                list: [
                  { title: 'Blue (#1b75bc)', value: 'blue' },
                  { title: 'Green (#02c39a / #007a5e)', value: 'green' },
                  { title: 'Purple', value: 'purple' },
                  { title: 'Orange', value: 'orange' },
                ],
                layout: 'radio',
              },
              initialValue: 'blue',
            },
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'body', type: 'text', rows: 3, title: 'Body' },
          ],
          preview: {
            select: { title: 'title', subtitle: 'accent' },
            prepare: ({ title, subtitle }) => ({ title: title || '(card)', subtitle }),
          },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Value cards: ${title}` }
    },
  },
})
