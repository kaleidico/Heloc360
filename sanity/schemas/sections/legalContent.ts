import { defineType, defineField, defineArrayMember } from 'sanity'

// Reusable rich legal-content body for Terms / Communication Consent / Affiliate
// Disclosure. Unlike `legalProse` (a single flat Portable Text run), this block
// reproduces the structured terms-page content area: a sequence of `mb-12`
// heading groups (optionally icon-decorated H2s) whose bodies support ordered +
// bullet lists, plus special callout cards (yellow alert, gray contact card) and
// a closing gradient contact section + effective-date footer.

const richBody = defineArrayMember({
  type: 'block',
  styles: [
    { title: 'Normal (mb-4)', value: 'normal' },
    { title: 'Normal (mb-6)', value: 'normal-mb6' },
    { title: 'Normal (flush, no margin)', value: 'normal-flush' },
    { title: 'H3', value: 'h3' },
  ],
  lists: [
    { title: 'Bullet', value: 'bullet' },
    { title: 'Numbered', value: 'number' },
    // `number-sm` renders the smaller `text-sm` ordered list variant on the page.
    { title: 'Numbered (small)', value: 'number-sm' },
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
        fields: [{ name: 'href', type: 'string', title: 'URL', validation: (R) => R.custom((v) => !v || /^(https?:\/\/|mailto:|tel:|\/|#)/.test(v) || 'Use an absolute URL, a /relative path, #anchor, mailto: or tel:') }],
      },
    ],
  },
})

export const legalContent = defineType({
  name: 'legalContent',
  title: 'Legal content (structured body)',
  type: 'object',
  fields: [
    defineField({
      name: 'groups',
      title: 'Heading groups',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'headingGroup',
          title: 'Heading group',
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Leading icon (lucide name, optional)',
              type: 'string',
              description: 'e.g. FileText, Shield, Scale — leave blank for no icon.',
            }),
            defineField({ name: 'heading', title: 'Heading (H2)', type: 'string', validation: (R) => R.required() }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'array',
              of: [
                richBody,
                // Yellow AlertTriangle callout.
                defineArrayMember({
                  name: 'alertCallout',
                  title: 'Alert callout (yellow)',
                  type: 'object',
                  fields: [
                    { name: 'icon', type: 'string', title: 'Icon (lucide name)', initialValue: 'AlertTriangle' },
                    { name: 'heading', type: 'string', title: 'Heading' },
                    { name: 'text', type: 'text', rows: 4, title: 'Text' },
                  ],
                  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: `Alert: ${title || ''}` }) },
                }),
                // Gray contact card (DMCA agent block) with mail/address rows.
                defineArrayMember({
                  name: 'contactCard',
                  title: 'Contact card (gray)',
                  type: 'object',
                  fields: [
                    { name: 'heading', type: 'string', title: 'Heading' },
                    {
                      name: 'rows',
                      title: 'Rows',
                      type: 'array',
                      of: [
                        defineArrayMember({
                          name: 'cardRow',
                          type: 'object',
                          fields: [
                            { name: 'icon', type: 'string', title: 'Icon (lucide name)' },
                            { name: 'label', type: 'string', title: 'Label (bold line)' },
                            { name: 'lines', type: 'array', title: 'Plain text lines', of: [{ type: 'string' }] },
                            { name: 'linkLabel', type: 'string', title: 'Link label' },
                            { name: 'linkHref', type: 'string', title: 'Link href' },
                          ],
                        }),
                      ],
                    },
                  ],
                  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: `Card: ${title || ''}` }) },
                }),
              ],
              validation: (R) => R.required().min(1),
            }),
          ],
          preview: {
            select: { title: 'heading', subtitle: 'icon' },
            prepare: ({ title, subtitle }) => ({ title, subtitle: subtitle ? `icon: ${subtitle}` : undefined }),
          },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: 'contactCallout',
      title: 'Closing contact callout (gradient)',
      type: 'object',
      fields: [
        { name: 'heading', type: 'string', title: 'Heading' },
        { name: 'bodyText', type: 'text', rows: 2, title: 'Body text' },
        { name: 'emailLabel', type: 'string', title: 'Email button label' },
        { name: 'emailHref', type: 'string', title: 'Email href (mailto:…)' },
        { name: 'secondaryLabel', type: 'string', title: 'Secondary button label' },
        { name: 'secondaryHref', type: 'string', title: 'Secondary button href (internal link)' },
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
      return { title: 'Legal content (structured body)' }
    },
  },
})
