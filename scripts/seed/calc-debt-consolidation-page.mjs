import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '2a445j5i',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-12-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// Staging structure only — NOT cut over. The hardcoded /calculators/debt-consolidation
// route stays live. Reproduces the page chrome (gradient hero, disclaimers) as raw-HTML
// htmlEmbed blocks, with a single placeholder htmlEmbed where the Mortgage Mate
// calculator embed will later go. Chrome is verbatim from
// app/(site)/calculators/debt-consolidation/page.tsx.

const heroHtml = `<section class="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
  <div class="container mx-auto px-4">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-bold mb-6">Debt Consolidation Savings Calculator</h1>
      <p class="text-xl md:text-2xl mb-8 text-blue-100">
        See how much you could save by consolidating high-interest debt with a HELOC
      </p>
      <div class="bg-blue-800/30 rounded-lg p-6 text-left max-w-2xl mx-auto">
        <h2 class="font-semibold mb-3">Calculate Your Potential Savings:</h2>
        <ul class="space-y-2 text-blue-100">
          <li>• Monthly payment reduction</li>
          <li>• Total interest savings over time</li>
          <li>• Payoff timeline comparison</li>
          <li>• Visual charts showing your savings</li>
        </ul>
      </div>
    </div>
  </div>
</section>`

const disclaimerHtml = `<section class="bg-gray-100 py-12">
  <div class="container mx-auto px-4">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-6 text-center">Important Disclaimers</h2>
      <div class="bg-white rounded-lg p-8 shadow-sm">
        <div class="prose max-w-none">
          <p class="text-sm text-gray-600 mb-4"><strong>Educational Tool Only:</strong> This calculator is for educational purposes and provides estimates only. Actual results may vary based on your specific financial situation, credit profile, and market conditions.</p>
          <p class="text-sm text-gray-600 mb-4"><strong>HELOC Risks:</strong> Your home serves as collateral for a HELOC. Failure to repay could result in foreclosure. Interest rates are typically variable and may increase over time, affecting your monthly payments.</p>
          <p class="text-sm text-gray-600 mb-4"><strong>Tax Considerations:</strong> HELOC interest may be tax-deductible if funds are used to buy, build, or substantially improve your home. Consult a tax professional for advice specific to your situation.</p>
          <p class="text-sm text-gray-600 mb-4"><strong>Additional Costs:</strong> HELOCs may include closing costs, annual fees, early termination fees, and other charges not reflected in this calculator. These costs can affect your overall savings.</p>
          <p class="text-sm text-gray-600"><strong>Professional Advice:</strong> Consider consulting with a financial advisor or tax professional before making debt consolidation decisions. This calculator does not constitute financial advice.</p>
        </div>
      </div>
    </div>
  </div>
</section>`

const doc = {
  _id: 'page-calc-debt-consolidation',
  _type: 'page',
  title: 'Debt Consolidation Savings Calculator | HELOC360',
  // Temporary slug; live hardcoded route stays at /calculators/debt-consolidation.
  slug: { _type: 'slug', current: 'calculators/debt-consolidation-sanity' },
  sections: [
    { _type: 'htmlEmbed', _key: 'dcc-hero', html: heroHtml, maxWidth: 'none', paddingY: 'none' },
    {
      _type: 'htmlEmbed',
      _key: 'dcc-calc-placeholder',
      html: '<!-- Mortgage Mate embed pending -->',
      maxWidth: 'none',
      paddingY: 'lg',
    },
    { _type: 'htmlEmbed', _key: 'dcc-disclaimer', html: disclaimerHtml, maxWidth: 'none', paddingY: 'none' },
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
