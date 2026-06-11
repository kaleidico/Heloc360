import { defineType, defineField, defineArrayMember } from 'sanity'

// Gray-50 band with a centered heading and a grid of clickable cards, each
// linking to an internal page. Card hover styling matches the team member
// cards (brand-blue title, green on hover). Built for the /calculators hub;
// reusable for any "pick a destination" index page.
export const linkCardsGrid = defineType({
  name: 'linkCardsGrid',
  title: 'Link cards grid',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 2 }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      validation: (R) => R.required().min(1),
      of: [
        defineArrayMember({
          name: 'card',
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'body', type: 'text', rows: 3, title: 'Body' },
            {
              name: 'href',
              type: 'string',
              title: 'URL',
              validation: (R) =>
                R.custom(
                  (v) =>
                    !v ||
                    /^(https?:\/\/|mailto:|tel:|\/|#)/.test(v) ||
                    'Use an absolute URL, a /relative path, #anchor, mailto: or tel:'
                ),
            },
            { name: 'ctaLabel', type: 'string', title: 'CTA label (defaults to "Open")' },
          ],
          preview: { select: { title: 'title', subtitle: 'href' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', cards: 'cards' },
    prepare({ title, cards }) {
      const count = Array.isArray(cards) ? cards.length : 0
      return { title: `Link cards: ${title || ''} (${count})` }
    },
  },
})
