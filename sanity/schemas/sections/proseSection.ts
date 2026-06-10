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
            { title: 'Normal (mb-4)', value: 'normalMb4' },
            { title: 'Normal (flush)', value: 'normalFlush' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
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
                  { name: 'href', type: 'string', title: 'URL', validation: (R) => R.custom((v) => !v || /^(https?:\/\/|mailto:|tel:|\/|#)/.test(v) || 'Use an absolute URL, a /relative path, #anchor, mailto: or tel:') },
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
    defineField({
      name: 'bare',
      title: 'Bare (no wrapping shell)',
      type: 'boolean',
      description:
        'When true, renders only the PortableText — no section/container/max-width/prose wrapper. Use inside a contentSection that already provides the shell.',
      initialValue: false,
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Prose section' }
    },
  },
})
