import { defineType, defineField } from 'sanity'

// Full-width gradient CTA band with a centered column: heading, body, two buttons,
// and a fine-print line. Reproduces verbatim the about page closing CTA:
//   <section className="py-16 bg-gradient-to-r from-[#1b75bc] to-[#007a5e]">
//     <div className="container mx-auto px-4">
//       <div className="max-w-3xl mx-auto text-center text-white">
//         <h2 className="text-3xl font-bold mb-4">{heading}</h2>
//         <p className="text-xl mb-8 opacity-90">{body}</p>
//         <div className="flex flex-col sm:flex-row gap-4 justify-center">
//           <Button bg-white text-[#1b75bc] /> <Button outline /></div>
//         <p className="text-sm mt-4 opacity-80">{finePrint}</p>
// Reusable as a marketing page closer.

export const marketingCtaBand = defineType({
  name: 'marketingCtaBand',
  title: 'Marketing CTA band (gradient)',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 2 }),
    defineField({
      name: 'primaryCta',
      title: 'Primary CTA',
      type: 'object',
      fields: [
        { name: 'label', type: 'string', title: 'Label' },
        { name: 'href', type: 'string', title: 'URL' },
      ],
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Secondary CTA',
      type: 'object',
      fields: [
        { name: 'label', type: 'string', title: 'Label' },
        { name: 'href', type: 'string', title: 'URL' },
      ],
    }),
    defineField({ name: 'finePrint', title: 'Fine print', type: 'string' }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Marketing CTA: ${title}` }
    },
  },
})
