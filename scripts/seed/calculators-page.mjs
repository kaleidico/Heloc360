import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '2a445j5i',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-12-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// Calculators hub at /calculators. The footer's "All calculators" link has
// always 404'd (no index existed on the old live site either). Card copy is
// taken from each calculator page's own meta description — nothing invented.
// app/(site)/calculators/ has no index page.tsx, so this resolves through the
// catch-all route without conflicting with the two hardcoded calculator pages.

const doc = {
  _id: 'page-calculators',
  _type: 'page',
  title: 'HELOC Calculators | HELOC360',
  slug: { _type: 'slug', current: 'calculators' },
  sections: [
    {
      _type: 'centeredHeroBand',
      _key: 'calcs-hero',
      heading: 'HELOC Calculators',
      body: 'Free interactive tools to estimate your home equity and potential savings — run the numbers before you talk to anyone.',
    },
    {
      _type: 'linkCardsGrid',
      _key: 'calcs-grid',
      cards: [
        {
          _type: 'card',
          _key: 'calcs-card-debt',
          title: 'Debt Consolidation Savings',
          body: 'Calculate potential savings by consolidating high-interest debt with a HELOC. See monthly payment reductions and total interest savings over time.',
          href: '/calculators/debt-consolidation',
          ctaLabel: 'Open calculator',
        },
        {
          _type: 'card',
          _key: 'calcs-card-equity',
          title: 'Home Equity Estimator',
          body: 'Calculate your home equity and potential HELOC borrowing power. Get instant estimates based on your home value, mortgage balance, and loan-to-value ratios.',
          href: '/calculators/home-equity-estimator',
          ctaLabel: 'Open calculator',
        },
      ],
    },
  ],
  seoTitle: 'HELOC Calculators | HELOC360',
  seoDescription:
    'Free HELOC calculators — estimate your home equity and borrowing power, or see how much you could save by consolidating high-interest debt.',
  canonicalUrl: 'https://heloc360.com/calculators',
  noindex: false,
}

const res = await client.createOrReplace(doc)
console.log('Seeded page doc:', res._id, '→ slug', res.slug?.current)
console.log('top-level sections:', res.sections.map((x) => x._type).join(', '))
