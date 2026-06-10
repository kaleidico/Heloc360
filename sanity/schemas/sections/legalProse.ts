import { defineType, defineField, defineArrayMember } from 'sanity'

export const legalProse = defineType({
  name: 'legalProse',
  title: 'Legal prose (body)',
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
                fields: [{ name: 'href', type: 'string', title: 'URL', validation: (R) => R.custom((v) => !v || /^(https?:\/\/|mailto:|tel:|\/|#)/.test(v) || 'Use an absolute URL, a /relative path, #anchor, mailto: or tel:') }],
              },
            ],
          },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: 'contactCallout',
      title: 'Contact callout (optional)',
      type: 'object',
      fields: [
        { name: 'heading', type: 'string', title: 'Heading' },
        { name: 'bodyText', type: 'text', rows: 2, title: 'Body text' },
        { name: 'emailLabel', type: 'string', title: 'Email button label' },
        { name: 'emailHref', type: 'string', title: 'Email href (mailto:…)' },
        { name: 'phoneLabel', type: 'string', title: 'Phone button label' },
        { name: 'phoneHref', type: 'string', title: 'Phone href (tel:…)' },
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Footer (optional)',
      type: 'object',
      fields: [
        { name: 'text', type: 'text', rows: 2, title: 'Effective-date text' },
        { name: 'showReturnHome', type: 'boolean', title: 'Show "Return to Home" link', initialValue: true },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Legal prose body' }
    },
  },
})
