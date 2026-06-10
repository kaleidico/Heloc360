import { defineType, defineField, defineArrayMember } from 'sanity'

// A wrapper / container primitive that reproduces the legal pages' body shell:
//   <section className="py-16">
//     <div className="container mx-auto px-4">
//       <div className="max-w-4xl mx-auto prose prose-lg prose-gray">…</div>
//     </div>
//   </section>
// It hosts a nested stack of fragment blocks (rendered recursively one level
// deep via renderBlock). `maxWidth`, `paddingY`, and `useProse` toggle the
// inner div / section classes. Container blocks (legalHeader/legalContent/
// legalProse/contentSection) are intentionally NOT nestable here.

export const contentSection = defineType({
  name: 'contentSection',
  title: 'Content section (container)',
  type: 'object',
  fields: [
    defineField({
      name: 'maxWidth',
      title: 'Max width',
      type: 'string',
      options: {
        list: [
          { title: '3xl', value: '3xl' },
          { title: '4xl (default)', value: '4xl' },
          { title: '5xl', value: '5xl' },
          { title: 'Full', value: 'full' },
        ],
        layout: 'radio',
      },
      initialValue: '4xl',
    }),
    defineField({
      name: 'paddingY',
      title: 'Vertical padding',
      type: 'string',
      options: {
        list: [
          { title: 'py-16 (default)', value: '16' },
          { title: 'None', value: '0' },
        ],
        layout: 'radio',
      },
      initialValue: '16',
    }),
    defineField({
      name: 'useProse',
      title: 'Use prose typography',
      description: 'Adds `prose prose-lg prose-gray` to the inner container.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        defineArrayMember({ type: 'proseSection' }),
        defineArrayMember({ type: 'iconHeading' }),
        defineArrayMember({ type: 'alertCallout' }),
        defineArrayMember({ type: 'infoCard' }),
        defineArrayMember({ type: 'buttonRow' }),
        defineArrayMember({ type: 'contactCallout' }),
        defineArrayMember({ type: 'pageFooterNote' }),
        defineArrayMember({ type: 'checklistCardGrid' }),
        defineArrayMember({ type: 'titledBulletCards' }),
        defineArrayMember({ type: 'iconBadgeCards' }),
        defineArrayMember({ type: 'checkmarkGrid' }),
        defineArrayMember({ type: 'accentNotes' }),
        defineArrayMember({ type: 'twoTierCards' }),
      ],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    select: { content: 'content', maxWidth: 'maxWidth' },
    prepare({ content, maxWidth }) {
      const count = Array.isArray(content) ? content.length : 0
      return {
        title: 'Content section',
        subtitle: `max-w-${maxWidth || '4xl'} · ${count} block${count === 1 ? '' : 's'}`,
      }
    },
  },
})
