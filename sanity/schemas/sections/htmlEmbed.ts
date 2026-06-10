import { defineType, defineField } from 'sanity'

// Raw HTML embed. The `html` field is injected verbatim via dangerouslySetInnerHTML
// in the renderer. SECURITY: this trusts the editor completely — the markup is NOT
// sanitized. Only enable this block for trusted internal authors. Intended for
// third-party embed snippets (e.g. Mortgage Mate calculator widgets) that can't be
// modeled as content. Optional wrapper controls (heading / maxWidth / paddingY)
// provide a constrained, consistent container around the raw markup.
export const htmlEmbed = defineType({
  name: 'htmlEmbed',
  title: 'HTML embed (raw snippet)',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading (optional)',
      type: 'string',
    }),
    defineField({
      name: 'html',
      title: 'Raw HTML',
      type: 'text',
      rows: 8,
      description: 'Injected verbatim (not sanitized). Trusted editors only.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'maxWidth',
      title: 'Max width',
      type: 'string',
      options: {
        list: [
          { title: 'None (full width)', value: 'none' },
          { title: '2xl', value: '2xl' },
          { title: '4xl', value: '4xl' },
          { title: '6xl', value: '6xl' },
          { title: '7xl', value: '7xl' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'paddingY',
      title: 'Vertical padding',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Small (py-8)', value: 'sm' },
          { title: 'Medium (py-12)', value: 'md' },
          { title: 'Large (py-16)', value: 'lg' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),
  ],
  preview: {
    select: { heading: 'heading', html: 'html' },
    prepare({ heading, html }) {
      const snippet = (html || '').replace(/\s+/g, ' ').trim().slice(0, 40)
      return { title: heading ? `HTML embed: ${heading}` : 'HTML embed', subtitle: snippet }
    },
  },
})
