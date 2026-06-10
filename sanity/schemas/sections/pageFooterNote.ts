import { defineType, defineField } from 'sanity'

// The centered effective-date footer, promoted from an inline field on
// `legalProse` to a standalone block. Reproduces the
// `text-center mt-12 pt-8 border-t border-gray-200` footer verbatim, with an
// optional "Return to Home" link.

export const pageFooterNote = defineType({
  name: 'pageFooterNote',
  title: 'Page footer note',
  type: 'object',
  fields: [
    defineField({ name: 'text', title: 'Effective-date text', type: 'text', rows: 3 }),
    defineField({
      name: 'showReturnHome',
      title: 'Show "Return to Home" link',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Page footer note' }
    },
  },
})
