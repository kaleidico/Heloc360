import { defineType, defineField } from 'sanity'

// A heading with a leading lucide icon. Reproduces the source heading markup
// `text-2xl font-bold text-[#1b75bc] mb-{4|6} flex items-center gap-3` with the
// icon rendered at `w-6 h-6`. Both the terms page (mb-4) and the affiliate
// page (mb-6) variants are supported via `marginBottom`.

export const iconHeading = defineType({
  name: 'iconHeading',
  title: 'Icon heading',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon (lucide name)',
      type: 'string',
      description: 'e.g. FileText, Shield, Scale, MessageSquare, Heart — leave blank for no icon.',
    }),
    defineField({
      name: 'level',
      title: 'Heading level',
      type: 'string',
      options: {
        list: [
          { title: 'H2', value: 'h2' },
          { title: 'H3', value: 'h3' },
        ],
        layout: 'radio',
      },
      initialValue: 'h2',
    }),
    defineField({
      name: 'marginBottom',
      title: 'Bottom margin',
      type: 'string',
      options: {
        list: [
          { title: 'mb-4 (default)', value: '4' },
          { title: 'mb-6', value: '6' },
        ],
        layout: 'radio',
      },
      initialValue: '4',
    }),
    defineField({ name: 'text', title: 'Text', type: 'string', validation: (R) => R.required() }),
  ],
  preview: {
    select: { title: 'text', subtitle: 'icon' },
    prepare({ title, subtitle }) {
      return { title: `Heading: ${title || ''}`, subtitle: subtitle ? `icon: ${subtitle}` : undefined }
    },
  },
})
