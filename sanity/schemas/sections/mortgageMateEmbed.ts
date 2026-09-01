import { defineType, defineField } from 'sanity'

// MortgageMate calculator embed. Typed block (NOT raw HTML) — the renderer loads
// mortgagemate.app/embed.js and mounts the chosen calculator into a
// `<div data-mortgagemate=… data-key=…>`. The `<script>` cannot live in an htmlEmbed
// block: markup injected via dangerouslySetInnerHTML never executes its scripts, so the
// widget would never mount. Choosing the calculator + key as structured fields also keeps
// the dataset free of raw HTML.
const CALCULATORS = [
  { title: 'HELOC', value: 'heloc' },
  { title: 'Affordability', value: 'affordability' },
  { title: 'Mortgage Payment', value: 'mortgage-payment' },
  { title: 'Refinance', value: 'refinance' },
  { title: 'Rent vs Buy', value: 'rent-vs-buy' },
  { title: 'Buydown', value: 'buydown' },
  { title: 'Net Proceeds', value: 'net-proceeds' },
  { title: 'Closing Costs', value: 'closing-costs' },
  { title: 'FHA', value: 'fha' },
  { title: 'Bank Statement Income', value: 'bank-statement-income' },
]

export const mortgageMateEmbed = defineType({
  name: 'mortgageMateEmbed',
  title: 'MortgageMate calculator',
  type: 'object',
  fields: [
    defineField({
      name: 'calculator',
      title: 'Calculator',
      type: 'string',
      options: { list: CALCULATORS },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'dataKey',
      title: 'Account key (data-key)',
      type: 'string',
      description: 'The MortgageMate embed key. Same across calculators for one account.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'hideLeadCapture',
      title: 'Hide the follow-up offer',
      type: 'boolean',
      initialValue: false,
      description:
        'By default a short email capture appears under the calculator — someone entering their mortgage balance is the highest-intent visitor on the site, and the vendor widget itself captures nothing. Tick this only if a page needs the calculator with no follow-up.',
    }),
    defineField({
      name: 'heading',
      title: 'Heading (optional)',
      type: 'string',
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      options: {
        list: [
          { title: 'White', value: 'white' },
          { title: 'Gray (gray-50)', value: 'gray-50' },
        ],
        layout: 'radio',
      },
      initialValue: 'white',
    }),
    defineField({
      name: 'maxWidth',
      title: 'Max width',
      type: 'string',
      options: {
        list: [
          { title: 'None (full width)', value: 'none' },
          { title: '4xl', value: '4xl' },
          { title: '6xl', value: '6xl' },
          { title: '7xl', value: '7xl' },
        ],
        layout: 'radio',
      },
      initialValue: '7xl',
    }),
    defineField({
      name: 'paddingY',
      title: 'Vertical padding',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Small (py-8)', value: 'sm' },
          { title: 'Medium (py-12)', value: 'md' },
          { title: 'Large (py-16)', value: 'lg' },
        ],
        layout: 'radio',
      },
      initialValue: 'lg',
    }),
  ],
  preview: {
    select: { calculator: 'calculator', heading: 'heading' },
    prepare({ calculator, heading }) {
      const c = CALCULATORS.find((x) => x.value === calculator)?.title || calculator || '—'
      return { title: heading ? `MortgageMate: ${heading}` : `MortgageMate calculator`, subtitle: c }
    },
  },
})
