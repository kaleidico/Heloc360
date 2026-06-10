import { defineType, defineField, defineArrayMember } from 'sanity'

// A colored alert box with a leading lucide icon. Reproduces the source
// variants verbatim:
//  - warning (yellow): `bg-yellow-50 border-l-4 border-l-yellow-400 p-6`
//    (terms "Time Sensitive Instructions" box, icon `w-5 h-5 text-yellow-600`,
//    heading `font-semibold text-yellow-800 mb-2`, body `text-yellow-700
//    text-sm`).
//  - info (green): `bg-green-50 border-l-4 border-l-[#02c39a] p-6 rounded-lg`
//    (consent "Your Choice" box, icon `w-6 h-6 text-[#02c39a]`, heading
//    `text-lg font-semibold text-[#007a5e] mb-2`, body `text-gray-700
//    leading-relaxed`).
// `rounded` toggles the `rounded-lg` corner; `outerMargin` toggles the bottom
// margin (terms uses `mb-6`, consent uses `mb-12`).

export const alertCallout = defineType({
  name: 'alertCallout',
  title: 'Alert callout (colored box)',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Warning (yellow)', value: 'warning' },
          { title: 'Info (green)', value: 'info' },
        ],
        layout: 'radio',
      },
      initialValue: 'warning',
    }),
    defineField({
      name: 'icon',
      title: 'Icon (lucide name)',
      type: 'string',
      description: 'e.g. AlertTriangle, AlertCircle, Shield.',
      initialValue: 'AlertTriangle',
    }),
    defineField({
      name: 'rounded',
      title: 'Rounded corners (rounded-lg)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'outerMargin',
      title: 'Bottom margin',
      type: 'string',
      options: {
        list: [
          { title: 'mb-6 (default)', value: '6' },
          { title: 'mb-12', value: '12' },
        ],
        layout: 'radio',
      },
      initialValue: '6',
    }),
    defineField({ name: 'heading', title: 'Heading (optional)', type: 'string' }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'rows',
      title: 'Label rows (optional)',
      description:
        'Renders after the body as stacked label/value pairs (consent "How to Opt Out": <h4> label + <p> value, in the variant color family).',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'labelRow',
          fields: [
            { name: 'label', type: 'string', title: 'Label' },
            { name: 'value', type: 'string', title: 'Value' },
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'variant' },
    prepare({ title, subtitle }) {
      return { title: `Alert: ${title || ''}`, subtitle }
    },
  },
})
