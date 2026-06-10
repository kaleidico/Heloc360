import { defineType, defineField } from 'sanity'

// Full-width gradient marketing hero: a 2-column band (copy + image) used at the
// top of marketing pages (about, heloc-101, homepage). Reproduces verbatim:
//   <section className="relative py-20 bg-gradient-to-r from-[#1b75bc] to-[#007a5e] overflow-hidden">
//     <div className="container mx-auto px-4">
//       <div className="grid lg:grid-cols-2 gap-12 items-center">
//         <div className="text-white"> …heading/body/2 CTAs… </div>
//         <div className="relative"> <Image rounded-lg shadow-2xl /> </div>
//   …
// The image references a static path under /public (imageSrc), not a Sanity
// asset, so existing local-image art (with blur placeholders) is reused 1:1.

export const marketingHero = defineType({
  name: 'marketingHero',
  title: 'Marketing hero (gradient band)',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 4 }),
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
    defineField({ name: 'imageSrc', title: 'Image src (path under /public)', type: 'string' }),
    defineField({ name: 'imageAlt', title: 'Image alt', type: 'string' }),
    defineField({ name: 'imageBlurDataURL', title: 'Image blur data URL', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Marketing hero: ${title}` }
    },
  },
})
