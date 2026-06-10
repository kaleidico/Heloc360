import { defineType, defineField, defineArrayMember } from 'sanity'

// Full-width band (selectable bg) with a centered header and a responsive 2→4-up
// grid of centered icon features: a round badge holding a lucide icon, a blue H3,
// and body copy. Per-feature accent drives badge background + icon color (static
// maps in the renderer). Reproduces verbatim the homepage "Why Choose HELOC360?"
// section:
//   <section className="py-16 bg-blue-50" aria-labelledby={anchorId}>
//     <div className="text-center mb-12"><h2 .../><p className="text-lg text-gray-600 max-w-2xl mx-auto"/></div>
//     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" role="list">
//       <div className="text-center" role="listitem">
//         <div className="w-16 h-16 {badgeBg} rounded-full flex items-center justify-center mx-auto mb-4"><Icon className="w-8 h-8 {iconColor}"/></div>
//         <h3 className="text-xl font-semibold text-[#1b75bc] mb-3"/><p className="text-gray-600"/>
export const iconFeatureGrid = defineType({
  name: 'iconFeatureGrid',
  title: 'Icon feature grid (centered, 4-up)',
  type: 'object',
  fields: [
    defineField({ name: 'anchorId', title: 'Anchor id (aria-labelledby / h2 id)', type: 'string' }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      options: {
        list: [
          { title: 'Blue 50', value: 'blue' },
          { title: 'White', value: 'white' },
          { title: 'Gray 50', value: 'gray' },
        ],
        layout: 'radio',
      },
      initialValue: 'blue',
    }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 2 }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'iconFeature',
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
                  { title: 'Green (#02c39a)', value: 'green' },
                  { title: 'Teal', value: 'teal' },
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
            select: { title: 'title', subtitle: 'accent' },
            prepare: ({ title, subtitle }) => ({ title: title || '(feature)', subtitle }),
          },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Icon features: ${title}` }
    },
  },
})
