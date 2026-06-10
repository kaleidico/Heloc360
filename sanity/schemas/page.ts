import { defineType, defineField, defineArrayMember } from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL path)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      description: 'The URL path without leading slash. Use "home" for the homepage; rendered at /.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        defineArrayMember({ type: 'heroSection' }),
        defineArrayMember({ type: 'richTextSection' }),
        defineArrayMember({ type: 'ctaSection' }),
        defineArrayMember({ type: 'featureGridSection' }),
        defineArrayMember({ type: 'faqSection' }),
        defineArrayMember({ type: 'imageWithTextSection' }),
        defineArrayMember({ type: 'legalHeader' }),
        defineArrayMember({ type: 'legalProse' }),
        defineArrayMember({ type: 'legalContent' }),
      ],
      validation: (R) => R.required().min(1),
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
      name: 'canonicalUrl',
      title: 'Canonical URL (optional override)',
      type: 'url',
    }),
    defineField({
      name: 'noindex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current', sections: 'sections' },
    prepare({ title, slug, sections }) {
      const count = Array.isArray(sections) ? sections.length : 0
      return {
        title,
        subtitle: `/${slug || ''} · ${count} section${count === 1 ? '' : 's'}`,
      }
    },
  },
})
