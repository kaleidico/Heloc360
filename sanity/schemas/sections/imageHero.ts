import { defineType, defineField } from 'sanity'

// Full-bleed background-image hero (min-h-[600px]) with a black/50 overlay and
// centered white copy: a two-line H1 (explicit <br/> between the lines), a lead
// paragraph, a single green pre-qual CTA button, and a fine-print paragraph below.
// Reproduces verbatim the homepage Hero section:
//   <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
//     <div className="absolute inset-0 z-0"> <Image fill .../> <div className="absolute inset-0 bg-black/50"/> </div>
//     <div className="relative z-10 container mx-auto px-4 text-center text-white">
//       <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{line1}<br/>{line2}</h1>
//       <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">{lead}</p>
//       <Button className="bg-[#007a5e] hover:bg-[#00664e] text-white px-8 py-3 text-lg rounded-lg" asChild><Link/></Button>
//       <p className="text-sm mt-4 opacity-90">{finePrint}</p>
// Distinct from `heroSection` (Sanity-asset bg, generic buttons) and `marketingHero`
// (gradient 2-col copy+image). Uses a static public image path + blur placeholder.
export const imageHero = defineType({
  name: 'imageHero',
  title: 'Image hero (overlay, single CTA)',
  type: 'object',
  fields: [
    defineField({ name: 'headingLine1', title: 'Heading line 1', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'headingLine2', title: 'Heading line 2', type: 'string' }),
    defineField({ name: 'lead', title: 'Lead paragraph', type: 'text', rows: 3 }),
    defineField({
      name: 'cta',
      title: 'CTA',
      type: 'object',
      fields: [
        { name: 'label', type: 'string', title: 'Label' },
        { name: 'href', type: 'string', title: 'Href' },
        { name: 'ariaLabel', type: 'string', title: 'Aria label' },
      ],
    }),
    defineField({ name: 'finePrint', title: 'Fine print', type: 'text', rows: 3 }),
    defineField({ name: 'imageSrc', title: 'Background image path', type: 'string' }),
    defineField({ name: 'imageAlt', title: 'Background image alt', type: 'string' }),
    defineField({ name: 'imageBlurDataURL', title: 'Blur data URL', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'headingLine1' },
    prepare({ title }) {
      return { title: `Image hero: ${title}` }
    },
  },
})
