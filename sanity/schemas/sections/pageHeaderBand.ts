import { defineType, defineField } from 'sanity'

// Gray-50 band with a centered page title + lead paragraph. Reproduces the
// home-equity-estimator calculator page header (text-3xl sm:text-4xl heading,
// max-w-3xl lead). Distinct from `legalHeader` (white, larger heading) and
// `centeredHeroBand` (brand gradient).
export const pageHeaderBand = defineType({
  name: 'pageHeaderBand',
  title: 'Page header band (gray)',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'body', title: 'Lead paragraph', type: 'text', rows: 3 }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Header band: ${title}` }
    },
  },
})
