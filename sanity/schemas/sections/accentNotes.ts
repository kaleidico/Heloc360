import { defineType, defineField, defineArrayMember } from 'sanity'

// Affiliate's "How Affiliate Marketing Works" blocks. Reproduces verbatim:
//   <div className="space-y-6">
//     <div className="border-l-4 border-l-{accent} pl-6">
//       <h3 className="text-lg font-semibold text-gray-900 mb-2">{heading}</h3>
//       <p className="text-gray-700 leading-relaxed">{body}</p>
//     </div>
//   </div>
// Accent → border color: blue=border-l-[#1b75bc], green=border-l-[#02c39a],
// purple=border-l-purple-500 (verbatim from source).

export const accentNotes = defineType({
  name: 'accentNotes',
  title: 'Accent notes',
  type: 'object',
  fields: [
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'accentNote',
          type: 'object',
          fields: [
            {
              name: 'accent',
              type: 'string',
              title: 'Accent color',
              options: {
                list: [
                  { title: 'Blue (#1b75bc)', value: 'blue' },
                  { title: 'Green (#02c39a)', value: 'green' },
                  { title: 'Purple', value: 'purple' },
                ],
                layout: 'radio',
              },
              initialValue: 'blue',
            },
            { name: 'heading', type: 'string', title: 'Heading' },
            { name: 'body', type: 'text', rows: 3, title: 'Body' },
          ],
          preview: {
            select: { title: 'heading', subtitle: 'accent' },
            prepare: ({ title, subtitle }) => ({ title: title || '(note)', subtitle }),
          },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Accent notes' }
    },
  },
})
