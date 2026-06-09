import { defineType, defineField } from 'sanity'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({
      name: 'teamMemberName',
      title: 'Team member name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'teamMemberName', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'linkedIn', title: 'LinkedIn', type: 'url' }),
    defineField({ name: 'twitter', title: 'Twitter', type: 'url' }),
    defineField({ name: 'about', title: 'About', type: 'text', rows: 6 }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt text' },
      ],
    }),
  ],
  preview: {
    select: { title: 'teamMemberName', subtitle: 'title', media: 'photo' },
  },
})
