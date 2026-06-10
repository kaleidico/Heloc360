import { defineType, defineField, defineArrayMember } from 'sanity'

// Full-width band (selectable bg) with a constrained max-w-4xl column: a centered
// header, then a 3-up grid of award cards (round tinted icon badge + title +
// subtitle). Reproduces verbatim the about page "Awards & Recognition":
//   <section className="py-16 bg-gray-50">
//     <div className="container mx-auto px-4">
//       <div className="max-w-4xl mx-auto">
//         <div className="text-center mb-12"> <h2/> <p/> </div>
//         <div className="grid md:grid-cols-3 gap-8">
//           <Card className="text-center"><CardHeader>
//             <div className="w-16 h-16 bg-{tint} rounded-full flex items-center justify-center mx-auto mb-4">
//               <Icon className="w-8 h-8 text-{iconColor}" /></div>
//             <CardTitle className="text-lg">{title}</CardTitle>
//             <p className="text-gray-600">{subtitle}</p>
//           </CardHeader></Card>
// Per-card tint: yellow/blue/green (static maps in the renderer).

export const awardsGrid = defineType({
  name: 'awardsGrid',
  title: 'Awards grid',
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
      initialValue: 'gray',
    }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 2 }),
    defineField({
      name: 'awards',
      title: 'Awards',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'award',
          type: 'object',
          fields: [
            { name: 'icon', type: 'string', title: 'Icon (lucide name)' },
            {
              name: 'tint',
              type: 'string',
              title: 'Tint',
              options: {
                list: [
                  { title: 'Yellow', value: 'yellow' },
                  { title: 'Blue', value: 'blue' },
                  { title: 'Green', value: 'green' },
                ],
                layout: 'radio',
              },
              initialValue: 'yellow',
            },
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'subtitle', type: 'string', title: 'Subtitle' },
          ],
          preview: {
            select: { title: 'title', subtitle: 'subtitle' },
            prepare: ({ title, subtitle }) => ({ title: title || '(award)', subtitle }),
          },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Awards: ${title}` }
    },
  },
})
