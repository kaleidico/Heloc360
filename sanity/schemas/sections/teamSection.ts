import { defineType, defineField, defineArrayMember } from 'sanity'

// Full-width band that fetches team members at render time and renders them in two
// groups (Leadership & Management, Contributors), each a 4-up card grid linking to
// /meet-our-team/<slug>. Reproduces verbatim the about page "Meet the Team"
// section. The member data is NOT stored on the section — the renderer calls
// getAllTeamMembers() — so the section only carries the headings + the ordered
// list of leadership role keywords used to split/sort the two groups.

export const teamSection = defineType({
  name: 'teamSection',
  title: 'Team section (dynamic members)',
  type: 'object',
  fields: [
    defineField({ name: 'anchorId', title: 'Anchor id', type: 'string', initialValue: 'team' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 2 }),
    defineField({ name: 'leadershipHeading', title: 'Leadership group heading', type: 'string', initialValue: 'Leadership & Management' }),
    defineField({ name: 'contributorsHeading', title: 'Contributors group heading', type: 'string', initialValue: 'Contributors' }),
    defineField({
      name: 'leadershipRoles',
      title: 'Leadership role keywords (ordered)',
      description: 'Lowercased title substrings that classify + order leadership members.',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({ name: 'emptyHeading', title: 'Empty-state heading', type: 'string', initialValue: 'Team information coming soon' }),
    defineField({ name: 'emptyBody', title: 'Empty-state body', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Team: ${title}` }
    },
  },
})
