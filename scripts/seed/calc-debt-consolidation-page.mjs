import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '2a445j5i',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-12-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// CUT OVER. Renders at /calculators/debt-consolidation (hardcoded React route deleted).
// Chrome is real blocks (bulletPanelHero, labeledDisclaimers); the calculator is the
// MortgageMate HELOC widget via the mortgageMateEmbed block (gray-50 band to match the
// source page's full-height gray background). Content is verbatim from the former route.

const doc = {
  _id: 'page-calc-debt-consolidation',
  _type: 'page',
  title: 'Debt Consolidation Savings Calculator | HELOC360',
  slug: { _type: 'slug', current: 'calculators/debt-consolidation' },
  sections: [
    {
      _type: 'bulletPanelHero',
      _key: 'dcc-hero',
      heading: 'Debt Consolidation Savings Calculator',
      subheading: 'See how much you could save by consolidating high-interest debt with a HELOC',
      panelHeading: 'Calculate Your Potential Savings:',
      bullets: [
        'Monthly payment reduction',
        'Total interest savings over time',
        'Payoff timeline comparison',
        'Visual charts showing your savings',
      ],
    },
    {
      _type: 'mortgageMateEmbed',
      _key: 'dcc-calc',
      calculator: 'heloc',
      dataKey: 'mm_abc426486dba2d3dc15158d91f722a58',
      background: 'gray-50',
      maxWidth: '7xl',
      paddingY: 'lg',
    },
    {
      _type: 'labeledDisclaimers',
      _key: 'dcc-disclaimer',
      variant: 'grayBand',
      heading: 'Important Disclaimers',
      items: [
        {
          _type: 'item',
          _key: 'dcc-disc-educational',
          label: 'Educational Tool Only',
          body: 'This calculator is for educational purposes and provides estimates only. Actual results may vary based on your specific financial situation, credit profile, and market conditions.',
        },
        {
          _type: 'item',
          _key: 'dcc-disc-risks',
          label: 'HELOC Risks',
          body: 'Your home serves as collateral for a HELOC. Failure to repay could result in foreclosure. Interest rates are typically variable and may increase over time, affecting your monthly payments.',
        },
        {
          _type: 'item',
          _key: 'dcc-disc-tax',
          label: 'Tax Considerations',
          body: 'HELOC interest may be tax-deductible if funds are used to buy, build, or substantially improve your home. Consult a tax professional for advice specific to your situation.',
        },
        {
          _type: 'item',
          _key: 'dcc-disc-costs',
          label: 'Additional Costs',
          body: 'HELOCs may include closing costs, annual fees, early termination fees, and other charges not reflected in this calculator. These costs can affect your overall savings.',
        },
        {
          _type: 'item',
          _key: 'dcc-disc-advice',
          label: 'Professional Advice',
          body: 'Consider consulting with a financial advisor or tax professional before making debt consolidation decisions. This calculator does not constitute financial advice.',
        },
      ],
    },
  ],
  seoTitle: 'Debt Consolidation Savings Calculator | HELOC360',
  seoDescription:
    'Calculate potential savings by consolidating high-interest debt with a HELOC. See monthly payment reductions and total interest savings over time.',
  canonicalUrl: 'https://heloc360.com/calculators/debt-consolidation',
  noindex: false,
}

const res = await client.createOrReplace(doc)
console.log('Seeded page doc:', res._id, '→ slug', res.slug?.current)
console.log('top-level sections:', res.sections.map((x) => x._type).join(', '))
