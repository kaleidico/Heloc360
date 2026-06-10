import { defineType, defineField } from 'sanity'

// Full-width gradient hero band with centered copy and no image. Reproduces the
// heloc-101 page top verbatim:
//   <section className="bg-gradient-to-r from-[#1b75bc] to-[#007a5e] py-16">
//     <div className="container mx-auto px-4">
//       <div className="max-w-4xl mx-auto text-center text-white">
//         <h1 className="text-4xl md:text-5xl font-bold mb-6">{heading}</h1>
//         <p className="text-xl mb-8 opacity-90">{body}</p>
//         <div className="flex flex-col sm:flex-row gap-4 justify-center"> 2 CTAs </div>
// Distinct from `marketingHero` (2-col copy+image) and `heroSection` (bg-image).
export const centeredHeroBand = defineType({
  name: 'centeredHeroBand',
  title: 'Centered hero band (gradient)',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
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
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Centered hero: ${title}` }
    },
  },
})
