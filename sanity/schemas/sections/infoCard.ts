import { defineType, defineField, defineArrayMember } from 'sanity'

// A tinted/bordered card. Reproduces the three distinct card shells found in
// the legal pages, verbatim:
//  - grayRows: terms' DMCA contact card `bg-gray-50 p-6 rounded-lg` with
//    icon+text rows in `space-y-3` (MapPin row is `items-start` with <br/>
//    address lines; Mail row is `items-center` with a link).
//  - blueStatement: consent's main statement `bg-blue-50 border-l-4
//    border-l-[#1b75bc] p-8 rounded-lg` — large leading icon (`w-8 h-8`),
//    heading, and rich body.
//  - grayProse: affiliate's "Editorial Independence" card `bg-gray-50 p-8
//    rounded-lg` with an icon heading and a `space-y-4` prose body.

export const infoCard = defineType({
  name: 'infoCard',
  title: 'Info card',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Gray rows (DMCA contact card)', value: 'grayRows' },
          { title: 'Blue statement (left border)', value: 'blueStatement' },
          { title: 'Gray prose (icon heading + body)', value: 'grayProse' },
        ],
        layout: 'radio',
      },
      initialValue: 'grayRows',
    }),
    defineField({
      name: 'icon',
      title: 'Icon (lucide name, optional)',
      type: 'string',
      description: 'Leading icon — used by the blue statement and gray prose variants.',
    }),
    defineField({ name: 'heading', title: 'Heading (optional)', type: 'string' }),
    defineField({
      name: 'rows',
      title: 'Rows (gray rows variant)',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'cardRow',
          type: 'object',
          fields: [
            { name: 'icon', type: 'string', title: 'Icon (lucide name)' },
            { name: 'label', type: 'string', title: 'Label (bold line)' },
            { name: 'lines', type: 'array', title: 'Plain text lines (joined with <br/>)', of: [{ type: 'string' }] },
            { name: 'linkLabel', type: 'string', title: 'Link label' },
            { name: 'linkHref', type: 'string', title: 'Link href' },
          ],
          preview: {
            select: { title: 'label', subtitle: 'icon' },
            prepare: ({ title, subtitle }) => ({ title: title || '(row)', subtitle }),
          },
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body (blue statement / gray prose variants)',
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
                fields: [
                  { name: 'href', type: 'url', title: 'URL' },
                  { name: 'underline', type: 'boolean', title: 'Underline', initialValue: false },
                ],
              },
            ],
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'variant' },
    prepare({ title, subtitle }) {
      return { title: `Card: ${title || ''}`, subtitle }
    },
  },
})
