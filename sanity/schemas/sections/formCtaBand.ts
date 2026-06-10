import { defineType, defineField } from 'sanity'

// Full-width gradient band hosting an interactive form inside a frosted Card. The
// band carries all copy (H2 + lead, Card title + description, and a fine-print
// line with inline Terms/Privacy links); the form itself is a nested
// `componentEmbed` so its client logic stays intact. Reproduces verbatim the
// homepage "Lead Capture" section:
//   <section className="py-16 bg-gradient-to-r from-[#1b75bc] to-teal-600" aria-labelledby={anchorId}>
//     <div className="max-w-2xl mx-auto text-center text-white">
//       <h2 .../><p className="text-lg mb-8 opacity-90"/>
//       <Card className="bg-white/10 backdrop-blur border-white/20">
//         <CardHeader><CardTitle className="text-white"/><CardDescription className="text-white/80"/></CardHeader>
//         <CardContent className="space-y-4"><MailingListForm/><p className="text-xs text-white/70">…Terms…Privacy…</p></CardContent>
export const formCtaBand = defineType({
  name: 'formCtaBand',
  title: 'Form CTA band (gradient + embedded form)',
  type: 'object',
  fields: [
    defineField({ name: 'anchorId', title: 'Anchor id (aria-labelledby / h2 id)', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'lead', title: 'Lead paragraph', type: 'text', rows: 3 }),
    defineField({ name: 'cardTitle', title: 'Card title', type: 'string' }),
    defineField({ name: 'cardDescription', title: 'Card description', type: 'text', rows: 2 }),
    defineField({
      name: 'embed',
      title: 'Embedded component',
      type: 'componentEmbed',
    }),
    defineField({
      name: 'finePrint',
      title: 'Fine print',
      type: 'object',
      description: 'Rendered as: {before} <Terms link> {middle} <Privacy link> {after}',
      fields: [
        { name: 'before', type: 'string', title: 'Text before Terms link' },
        { name: 'termsLabel', type: 'string', title: 'Terms link label' },
        { name: 'termsHref', type: 'string', title: 'Terms link href' },
        { name: 'middle', type: 'string', title: 'Text between links' },
        { name: 'privacyLabel', type: 'string', title: 'Privacy link label' },
        { name: 'privacyHref', type: 'string', title: 'Privacy link href' },
        { name: 'after', type: 'string', title: 'Text after Privacy link' },
      ],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Form CTA band: ${title}` }
    },
  },
})
