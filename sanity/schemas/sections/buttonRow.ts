import { defineType, defineField, defineArrayMember } from 'sanity'

// A row of CTA buttons (email / phone / link). Reproduces the legal pages'
// contact-callout button markup verbatim — primary (`bg-[#1b75bc]`) and
// outline (`border border-[#1b75bc]`) styles — inside a `flex flex-col
// sm:flex-row gap-4` row.

export const buttonRow = defineType({
  name: 'buttonRow',
  title: 'Button row',
  type: 'object',
  fields: [
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'button',
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label', validation: (R) => R.required() },
            {
              name: 'href',
              type: 'string',
              title: 'Href',
              description: 'mailto:…, tel:…, https://…, or an internal /path.',
              validation: (R) => R.required(),
            },
            {
              name: 'style',
              type: 'string',
              title: 'Style',
              options: {
                list: [
                  { title: 'Primary', value: 'primary' },
                  { title: 'Outline', value: 'outline' },
                ],
                layout: 'radio',
              },
              initialValue: 'primary',
            },
          ],
          preview: {
            select: { title: 'label', subtitle: 'style' },
            prepare: ({ title, subtitle }) => ({ title, subtitle }),
          },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Button row' }
    },
  },
})
