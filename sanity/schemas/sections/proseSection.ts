import { defineType, defineField, defineArrayMember } from 'sanity'

// A constrained-width rich-text run that mirrors the legal pages' content
// container: `container mx-auto px-4` → inner `max-w-{maxWidth} mx-auto prose
// prose-lg prose-gray`. Reuses the legal PortableText serializers. Optional
// `maxWidth` toggles `max-w-4xl` (default) vs `max-w-3xl`.

export const proseSection = defineType({
  name: 'proseSection',
  title: 'Prose section (rich text run)',
  type: 'object',
  fields: [
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
          ],
          lists: [{ title: 'Bullet', value: 'bullet' }],
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
                  {
                    name: 'external',
                    type: 'boolean',
                    title: 'Show trailing external-link icon',
                    description:
                      'Renders the link as an inline-flex anchor with a trailing ExternalLink icon (matches the affiliate intro "My Perfect Leads" link).',
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: 'maxWidth',
      title: 'Max width',
      type: 'string',
      options: {
        list: [
          { title: '4xl (default)', value: '4xl' },
          { title: '3xl', value: '3xl' },
        ],
        layout: 'radio',
      },
      initialValue: '4xl',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Prose section' }
    },
  },
})
