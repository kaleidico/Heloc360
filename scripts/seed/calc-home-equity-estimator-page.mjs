import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '2a445j5i',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-12-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// Staging structure only — NOT cut over. The hardcoded /calculators/home-equity-estimator
// route stays live. Page chrome is real blocks (pageHeaderBand, infoSplitCard,
// labeledDisclaimers) — the ONLY htmlEmbed is the placeholder where the Mortgage Mate
// calculator embed will later go. Content is verbatim from
// app/(site)/calculators/home-equity-estimator/page.tsx.
//
// Staging caveat: the source page paints one full-height gray-50 background; here each
// chrome block carries its own gray-50 band, so the (currently empty) calculator slot
// renders white. Resolves itself once the Mortgage Mate embed fills the slot — wrap the
// embed HTML in a gray-50 band to match.

const doc = {
  _id: 'page-calc-home-equity-estimator',
  _type: 'page',
  title: 'Home Equity Estimator Calculator | HELOC360',
  // Temporary slug; live hardcoded route stays at /calculators/home-equity-estimator.
  slug: { _type: 'slug', current: 'calculators/home-equity-estimator-sanity' },
  sections: [
    {
      _type: 'pageHeaderBand',
      _key: 'heec-header',
      heading: 'Home Equity Estimator',
      body: "Calculate your current home equity and discover how much you could potentially borrow with a HELOC. Get instant estimates based on your home's current value and existing mortgage balance.",
    },
    {
      _type: 'htmlEmbed',
      _key: 'heec-calc-placeholder',
      html: '<!-- Mortgage Mate embed pending -->',
      maxWidth: '7xl',
      paddingY: 'md',
    },
    {
      _type: 'infoSplitCard',
      _key: 'heec-educational',
      heading: 'Understanding Home Equity',
      topics: [
        {
          _type: 'topic',
          _key: 'heec-topic-what',
          heading: 'What is Home Equity?',
          body: 'Home equity is the difference between your home\'s current market value and the amount you still owe on your mortgage. It represents the portion of your home that you truly "own."',
        },
        {
          _type: 'topic',
          _key: 'heec-topic-how',
          heading: 'How HELOCs Work',
          body: "A Home Equity Line of Credit (HELOC) allows you to borrow against your home's equity. Most lenders allow you to borrow up to 80-90% of your home's value, minus your existing mortgage balance.",
        },
      ],
      listHeading: 'Benefits of Home Equity',
      bullets: [
        'Access to large amounts of credit at competitive rates',
        'Flexible borrowing - use only what you need',
        'Potential tax advantages for home improvements',
        'Lower interest rates compared to credit cards',
        'Build wealth through home appreciation',
      ],
    },
    {
      _type: 'labeledDisclaimers',
      _key: 'heec-disclaimers',
      variant: 'yellowCard',
      heading: 'Important Disclaimers',
      items: [
        {
          _type: 'item',
          _key: 'heec-disc-estimates',
          label: 'Estimates Only',
          body: 'This calculator provides estimates based on the information you provide. Actual home values, equity amounts, and HELOC terms may vary significantly.',
        },
        {
          _type: 'item',
          _key: 'heec-disc-appraisal',
          label: 'Professional Appraisal Required',
          body: 'Lenders require professional appraisals to determine actual home value. Your estimate may differ from an appraised value.',
        },
        {
          _type: 'item',
          _key: 'heec-disc-criteria',
          label: 'Lending Criteria',
          body: 'HELOC approval depends on multiple factors including credit score, income, debt-to-income ratio, and lender-specific requirements.',
        },
        {
          _type: 'item',
          _key: 'heec-disc-market',
          label: 'Market Fluctuations',
          body: 'Home values can fluctuate due to market conditions, local factors, and economic changes, affecting your actual equity.',
        },
        {
          _type: 'item',
          _key: 'heec-disc-risk',
          label: 'Risk Warning',
          body: 'Your home serves as collateral for a HELOC. Failure to repay could result in foreclosure. Consult with financial professionals before making borrowing decisions.',
        },
        {
          _type: 'item',
          _key: 'heec-disc-tax',
          label: 'Tax Implications',
          body: 'Consult a tax professional regarding potential tax benefits or implications of home equity borrowing.',
        },
      ],
    },
  ],
  seoTitle: 'Home Equity Estimator Calculator | HELOC360',
  seoDescription:
    'Calculate your home equity and potential HELOC borrowing power. Get instant estimates based on your home value, mortgage balance, and loan-to-value ratios.',
  canonicalUrl: 'https://heloc360.com/calculators/home-equity-estimator',
  noindex: false,
}

const res = await client.createOrReplace(doc)
console.log('Seeded page doc:', res._id, '→ slug', res.slug?.current)
console.log('top-level sections:', res.sections.map((x) => x._type).join(', '))
