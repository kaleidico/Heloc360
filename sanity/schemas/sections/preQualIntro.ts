import { defineType, defineField, defineArrayMember } from 'sanity'

// Verbatim reproduction of the /pre-qual page chrome: a `bg-surface-50 min-h-[80vh]`
// main with a constrained header (eyebrow + h1 + description) and a white card that
// hosts the interactive pre-qual form. The form and the StickyCtaSuppress side-effect
// are nested `componentEmbed`s so their client logic stays intact (the host owns only
// the surrounding copy + card wrapper). Reproduces app/(site)/pre-qual/page.tsx:
//   <main className="bg-surface-50 min-h-[80vh]">
//     <StickyCtaSuppress />
//     <div className="container mx-auto px-4 py-12 lg:py-16">
//       <div className="max-w-2xl mx-auto">
//         <header className="mb-6">
//           <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue mb-2">{eyebrow}</p>
//           <h1 className="text-display-lg text-ink-900">{heading}</h1>
//           <p className="text-base text-ink-700 mt-3">{description}</p>
//         </header>
//         <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 lg:p-8">
//           <PreQualForm useCase="universal" />
//         </div>
export const preQualIntro = defineType({
  name: 'preQualIntro',
  title: 'Pre-qual intro (header + carded form)',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'heading', title: 'Heading (h1)', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({
      name: 'embeds',
      title: 'Embedded components (rendered inside the card)',
      type: 'array',
      of: [defineArrayMember({ type: 'componentEmbed' })],
      description: 'Typically a single preQualForm. The StickyCtaSuppress side-effect is rendered separately above.',
    }),
    defineField({
      name: 'suppressStickyCta',
      title: 'Suppress sticky CTA while mounted',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Pre-qual intro: ${title}` }
    },
  },
})
