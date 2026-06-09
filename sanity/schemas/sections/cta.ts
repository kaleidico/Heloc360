import { defineType, defineField } from 'sanity'

export const ctaSection = defineType({
  name: 'ctaSection',
  title: 'Call to action',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 2 }),
    defineField({
      name: 'cta',
      title: 'CTA button',
      type: 'object',
      fields: [
        { name: 'label', type: 'string', title: 'Label', validation: (R: any) => R.required() },
        { name: 'href', type: 'string', title: 'URL', validation: (R: any) => R.required() },
      ],
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Primary (maize on blue)', value: 'primary' },
          { title: 'Secondary (light)', value: 'secondary' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'cta.label' },
    prepare({ title, subtitle }) {
      return { title: `CTA: ${title}`, subtitle: subtitle ? `Button: ${subtitle}` : undefined }
    },
  },
})
