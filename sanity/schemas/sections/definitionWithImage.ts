import { defineType, defineField, defineArrayMember } from 'sanity'

// Full-width white band, constrained max-w-4xl, with a 2-column row: a lead
// paragraph + a blue-50 "key features" card (CheckCircle bullets) on the left,
// and a rounded local image on the right. Reproduces the heloc-101 "What is a
// HELOC?" section. `anchorId` provides the in-page anchor target.
export const definitionWithImage = defineType({
  name: 'definitionWithImage',
  title: 'Definition with image (intro + feature box)',
  type: 'object',
  fields: [
    defineField({ name: 'anchorId', title: 'Anchor id (e.g. what-is-heloc)', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'paragraph', title: 'Lead paragraph', type: 'text', rows: 4 }),
    defineField({ name: 'featuresHeading', title: 'Features box heading', type: 'string' }),
    defineField({
      name: 'features',
      title: 'Features (bullet list)',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'feature',
          type: 'object',
          fields: [{ name: 'text', type: 'string', title: 'Text' }],
          preview: { select: { title: 'text' } },
        }),
      ],
    }),
    defineField({ name: 'imageSrc', title: 'Image src (path under /public)', type: 'string' }),
    defineField({ name: 'imageAlt', title: 'Image alt', type: 'string' }),
    defineField({ name: 'imageBlurDataURL', title: 'Image blur data URL', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Definition: ${title}` }
    },
  },
})
