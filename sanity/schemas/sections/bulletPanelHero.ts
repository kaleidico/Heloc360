import { defineType, defineField, defineArrayMember } from 'sanity'

// Blue gradient hero band (blue-900 → blue-700, NOT the brand gradient) with a
// centered title + subtitle and a translucent left-aligned panel containing a
// small heading and a bullet list. Reproduces the debt-consolidation
// calculator hero.
export const bulletPanelHero = defineType({
  name: 'bulletPanelHero',
  title: 'Bullet panel hero (blue gradient)',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 2 }),
    defineField({ name: 'panelHeading', title: 'Panel heading', type: 'string' }),
    defineField({
      name: 'bullets',
      title: 'Panel bullets',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Bullet panel hero: ${title}` }
    },
  },
})
