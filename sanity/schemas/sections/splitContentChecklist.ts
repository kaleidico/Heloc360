import { defineType, defineField, defineArrayMember } from 'sanity'

// Two-column band: left column has a blue H2, a lead paragraph, and a CheckCircle
// bullet list (green icons, plain paragraph items); right column is an image.
// Reproduces verbatim the homepage "What is HELOC360?" section:
//   <section className="py-16 bg-gray-50" aria-labelledby={anchorId}>
//     <div className="container mx-auto px-4">
//       <div className="grid lg:grid-cols-2 gap-12 items-center">
//         <div> <h2 className="text-3xl md:text-4xl font-bold text-[#1b75bc] mb-6"/> <p className="text-lg text-gray-700 mb-6 leading-relaxed"/>
//           <ul className="space-y-4"> <li className="flex items-start gap-3"><CheckCircle .../> <p className="text-gray-700"/></li> </ul>
//         <div className="relative"><Image className="rounded-lg shadow-lg" .../></div>
export const splitContentChecklist = defineType({
  name: 'splitContentChecklist',
  title: 'Split content + checklist (image right)',
  type: 'object',
  fields: [
    defineField({ name: 'anchorId', title: 'Anchor id (aria-labelledby / h2 id)', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'lead', title: 'Lead paragraph', type: 'text', rows: 4 }),
    defineField({
      name: 'checklist',
      title: 'Checklist items',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({ name: 'imageSrc', title: 'Image path', type: 'string' }),
    defineField({ name: 'imageAlt', title: 'Image alt', type: 'string' }),
    defineField({ name: 'imageBlurDataURL', title: 'Blur data URL', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Split + checklist: ${title}` }
    },
  },
})
