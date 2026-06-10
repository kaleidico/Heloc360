import { defineType, defineField } from 'sanity'

// Full-width gradient closing CTA band, constrained max-w-3xl, centered. Like
// `marketingCtaBand` but the primary CTA may be a plain (non-navigating) button
// when its href is omitted. Reproduces the heloc-101 closing CTA section
// (primary "Get Pre-Qualified Now" is a link-less button; secondary links to the
// calculator; fine print below).
export const gradientCtaBand = defineType({
  name: 'gradientCtaBand',
  title: 'Gradient CTA band (link-optional primary)',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 2 }),
    defineField({
      name: 'primaryCta',
      title: 'Primary CTA (href optional → plain button)',
      type: 'object',
      fields: [
        { name: 'label', type: 'string', title: 'Label' },
        { name: 'href', type: 'string', title: 'URL (optional)' },
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
      return { title: `Gradient CTA: ${title}` }
    },
  },
})
