import { defineType, defineField, defineArrayMember } from 'sanity'

// Two-column band: left column has a blue H2, a lead paragraph, and a 2-up grid of
// small icon-badge benefit items (round badge w-8 h-8 with a w-4 h-4 lucide icon,
// a dark H4, and small gray body); right column is an image. Per-item accent
// drives badge background + icon color (static maps in the renderer). Reproduces
// verbatim the homepage "Benefits of HELOCs" section:
//   <section className="py-16 bg-white" aria-labelledby={anchorId}>
//     <div className="grid lg:grid-cols-2 gap-12 items-center">
//       <div><h2 .../><p className="text-lg text-gray-700 mb-8"/>
//         <div className="grid sm:grid-cols-2 gap-6" role="list">
//           <div className="flex items-start gap-3" role="listitem">
//             <div className="w-8 h-8 {badgeBg} rounded-full flex items-center justify-center flex-shrink-0"><Icon className="w-4 h-4 {iconColor}"/></div>
//             <div><h4 className="font-semibold text-gray-900 mb-1"/><p className="text-sm text-gray-600"/></div>
//       <div className="relative"><Image className="rounded-lg shadow-lg" .../></div>
export const benefitsWithImage = defineType({
  name: 'benefitsWithImage',
  title: 'Benefits + image (icon-badge items)',
  type: 'object',
  fields: [
    defineField({ name: 'anchorId', title: 'Anchor id (aria-labelledby / h2 id)', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'lead', title: 'Lead paragraph', type: 'text', rows: 3 }),
    defineField({
      name: 'items',
      title: 'Benefit items',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'benefitItem',
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
            { name: 'body', type: 'text', rows: 2, title: 'Body' },
          ],
          preview: {
            select: { title: 'title', subtitle: 'accent' },
            prepare: ({ title, subtitle }) => ({ title: title || '(item)', subtitle }),
          },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
    defineField({ name: 'imageSrc', title: 'Image path', type: 'string' }),
    defineField({ name: 'imageAlt', title: 'Image alt', type: 'string' }),
    defineField({ name: 'imageBlurDataURL', title: 'Blur data URL', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Benefits + image: ${title}` }
    },
  },
})
