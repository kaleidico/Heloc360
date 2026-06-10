import { defineType, defineField, defineArrayMember } from 'sanity'

// Full-width band (selectable bg) with a constrained max-w-4xl column holding a
// centered header, then a 2-column grid: a text column (subheading + paragraphs
// + a green-check list) and a static image column. Reproduces verbatim the
// about page "Our Story" section:
//   <section className="py-16 bg-gray-50">
//     <div className="container mx-auto px-4">
//       <div className="max-w-4xl mx-auto">
//         <div className="text-center mb-12"> <h2/> <p/> </div>
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           <div> <h3/> <p mb-6/>… <div className="space-y-3"> check rows </div> </div>
//           <div> <Image rounded-lg shadow-lg /> </div>
// Reusable for any "story / origin" two-column narrative.

export const storySection = defineType({
  name: 'storySection',
  title: 'Story section (header + text/checklist + image)',
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
    defineField({ name: 'columnHeading', title: 'Text column heading', type: 'string' }),
    defineField({
      name: 'paragraphs',
      title: 'Paragraphs',
      type: 'array',
      of: [defineArrayMember({ type: 'text' })],
    }),
    defineField({
      name: 'checklist',
      title: 'Checklist items',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({ name: 'imageSrc', title: 'Image src (path under /public)', type: 'string' }),
    defineField({ name: 'imageAlt', title: 'Image alt', type: 'string' }),
    defineField({ name: 'imageBlurDataURL', title: 'Image blur data URL', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Story: ${title}` }
    },
  },
})
