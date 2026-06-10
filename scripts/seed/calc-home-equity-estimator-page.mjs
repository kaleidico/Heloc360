import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '2a445j5i',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-12-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// Staging structure only — NOT cut over. The hardcoded /calculators/home-equity-estimator
// route stays live. This reproduces the page chrome (header, educational content,
// disclaimers) as raw-HTML htmlEmbed blocks, with a single placeholder htmlEmbed where
// the Mortgage Mate calculator embed will later go. The page chrome is verbatim from
// app/(site)/calculators/home-equity-estimator/page.tsx.

const headerHtml = `<div class="min-h-screen bg-gray-50">
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Home Equity Estimator</h1>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          Calculate your current home equity and discover how much you could potentially borrow with a HELOC. Get
          instant estimates based on your home's current value and existing mortgage balance.
        </p>
      </div>
    </div>
  </div>
</div>`

const educationalHtml = `<div class="min-h-screen bg-gray-50">
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Understanding Home Equity</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">What is Home Equity?</h3>
            <p class="text-gray-600 mb-4">
              Home equity is the difference between your home's current market value and the amount you still owe
              on your mortgage. It represents the portion of your home that you truly "own."
            </p>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">How HELOCs Work</h3>
            <p class="text-gray-600">
              A Home Equity Line of Credit (HELOC) allows you to borrow against your home's equity. Most lenders
              allow you to borrow up to 80-90% of your home's value, minus your existing mortgage balance.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Benefits of Home Equity</h3>
            <ul class="text-gray-600 space-y-2">
              <li>• Access to large amounts of credit at competitive rates</li>
              <li>• Flexible borrowing - use only what you need</li>
              <li>• Potential tax advantages for home improvements</li>
              <li>• Lower interest rates compared to credit cards</li>
              <li>• Build wealth through home appreciation</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-yellow-800 mb-2">Important Disclaimers</h3>
        <div class="text-sm text-yellow-700 space-y-2">
          <p><strong>Estimates Only:</strong> This calculator provides estimates based on the information you provide. Actual home values, equity amounts, and HELOC terms may vary significantly.</p>
          <p><strong>Professional Appraisal Required:</strong> Lenders require professional appraisals to determine actual home value. Your estimate may differ from an appraised value.</p>
          <p><strong>Lending Criteria:</strong> HELOC approval depends on multiple factors including credit score, income, debt-to-income ratio, and lender-specific requirements.</p>
          <p><strong>Market Fluctuations:</strong> Home values can fluctuate due to market conditions, local factors, and economic changes, affecting your actual equity.</p>
          <p><strong>Risk Warning:</strong> Your home serves as collateral for a HELOC. Failure to repay could result in foreclosure. Consult with financial professionals before making borrowing decisions.</p>
          <p><strong>Tax Implications:</strong> Consult a tax professional regarding potential tax benefits or implications of home equity borrowing.</p>
        </div>
      </div>
    </div>
  </div>
</div>`

const doc = {
  _id: 'page-calc-home-equity-estimator',
  _type: 'page',
  title: 'Home Equity Estimator Calculator | HELOC360',
  // Temporary slug; live hardcoded route stays at /calculators/home-equity-estimator.
  slug: { _type: 'slug', current: 'calculators/home-equity-estimator-sanity' },
  sections: [
    { _type: 'htmlEmbed', _key: 'heec-header', html: headerHtml, maxWidth: 'none', paddingY: 'none' },
    {
      _type: 'htmlEmbed',
      _key: 'heec-calc-placeholder',
      html: '<!-- Mortgage Mate embed pending -->',
      maxWidth: '7xl',
      paddingY: 'md',
    },
    { _type: 'htmlEmbed', _key: 'heec-educational', html: educationalHtml, maxWidth: 'none', paddingY: 'none' },
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
