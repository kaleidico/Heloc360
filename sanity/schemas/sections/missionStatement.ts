import { defineType, defineField, defineArrayMember } from 'sanity'

// Full-width band with a constrained max-w-4xl centered column: a heading, a lead
// paragraph, and a gradient highlight box containing a sub-heading + an N-up grid
// of (heading, body) points. Reproduces verbatim the about page "Our Mission":
//   <section className="py-16 bg-white">
//     <div className="container mx-auto px-4">
//       <div className="max-w-4xl mx-auto text-center">
//         <h2 .../> <p .../>
//         <div className="bg-gradient-to-r from-[#1b75bc]/10 to-[#007a5e]/10 p-8 rounded-lg">
//           <h3 .../>
//           <div className="grid md:grid-cols-3 gap-6 text-left">
//             <div><h4/><p/></div> …
// Reusable for any centered mission / promise statement with highlight points.

export const missionStatement = defineType({
  name: 'missionStatement',
  title: 'Mission statement (centered + highlight box)',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'lead', title: 'Lead paragraph', type: 'text', rows: 3 }),
    defineField({ name: 'boxHeading', title: 'Highlight box heading', type: 'string' }),
    defineField({
      name: 'points',
      title: 'Points',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'point',
          type: 'object',
          fields: [
            { name: 'heading', type: 'string', title: 'Heading' },
            { name: 'body', type: 'text', rows: 3, title: 'Body' },
          ],
          preview: {
            select: { title: 'heading' },
            prepare: ({ title }) => ({ title: title || '(point)' }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Mission: ${title}` }
    },
  },
})
