import { defineType, defineField, defineArrayMember } from 'sanity'
import { isUniqueAcrossAllDocuments } from './utils'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96, isUnique: isUniqueAcrossAllDocuments },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
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
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  { name: 'href', type: 'url', title: 'URL' },
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt text' },
          ],
        }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featureImage',
      title: 'Feature image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt text' },
      ],
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'teamMember' }],
      description:
        'Shown as the byline and emitted in the article schema. Home equity advice counts as YMYL content, where a named, credentialed author carries real ranking weight.',
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last reviewed',
      type: 'datetime',
      description:
        'Set this when the post is revised. It drives dateModified in the article schema and the visible "Reviewed" line — leave it empty and the post reads as untouched since publication.',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'seoKeyword',
      title: 'SEO keyword',
      type: 'string',
    }),
    defineField({
      name: 'focusKeywords',
      title: 'Focus keywords',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
  ],
  preview: {
    select: { title: 'title', date: 'publishDate', media: 'featureImage' },
    prepare({ title, date, media }) {
      return { title, subtitle: date ? new Date(date).toLocaleDateString() : 'No date', media }
    },
  },
})
