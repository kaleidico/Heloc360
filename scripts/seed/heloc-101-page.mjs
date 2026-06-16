import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '2a445j5i',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-12-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// Deterministic key helper so re-runs don't churn keys.
let n = 0
const k = (p) => `${p}-${n++}`

// Blur placeholder for the "What is a HELOC?" image — verbatim from
// app/(site)/heloc-101/page.tsx.
const BLUR =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='

// --- Top-level sections, in source order -------------------------------------
const sections = [
  // 1. Hero — centered gradient band (full-width).
  {
    _type: 'centeredHeroBand',
    _key: k('sec'),
    heading: 'HELOC 101: Your Complete Guide to Home Equity Lines of Credit',
    body: "Everything you need to know about HELOCs - from basics to advanced strategies. Make informed decisions about accessing your home's equity.",
    primaryCta: { label: 'Get Pre-Qualified', href: 'https://get-started.heloc360.com/' },
    secondaryCta: { label: 'Use Our Calculator', href: '/calculators/home-equity-estimator' },
  },

  // 2. Table of Contents — gray-50 band, 2-col anchor nav (full-width).
  {
    _type: 'tableOfContents',
    _key: k('sec'),
    heading: "What You'll Learn",
    items: [
      { _key: k('toc'), label: 'What is a HELOC?', href: '#what-is-heloc' },
      { _key: k('toc'), label: 'How HELOCs Work', href: '#how-helocs-work' },
      { _key: k('toc'), label: 'Benefits of HELOCs', href: '#benefits' },
      { _key: k('toc'), label: 'Risks to Consider', href: '#risks' },
      { _key: k('toc'), label: 'Qualification Requirements', href: '#qualification' },
      { _key: k('toc'), label: 'Common Uses for HELOCs', href: '#uses' },
      { _key: k('toc'), label: 'HELOC Alternatives', href: '#alternatives' },
      { _key: k('toc'), label: 'Getting Started', href: '#getting-started' },
    ],
  },

  // 3. What is a HELOC — white band, max-w-4xl, intro + blue-50 feature box + image.
  {
    _type: 'definitionWithImage',
    _key: k('sec'),
    anchorId: 'what-is-heloc',
    heading: 'What is a HELOC?',
    paragraph:
      "A Home Equity Line of Credit (HELOC) is a revolving credit line that uses your home's equity as collateral. Think of it as a credit card secured by your home - you can borrow, repay, and borrow again up to your credit limit.",
    featuresHeading: 'Key Features:',
    features: [
      { _key: k('feat'), text: 'Revolving credit line (borrow as needed)' },
      { _key: k('feat'), text: 'Variable interest rates' },
      { _key: k('feat'), text: 'Interest-only payments during draw period' },
      { _key: k('feat'), text: 'Your home serves as collateral' },
    ],
    imageSrc: '/images/sygvwxiqnki.jpg',
    imageAlt:
      'Happy people taking a selfie together, representing the joy and satisfaction of achieving financial goals with HELOC',
    imageBlurDataURL: BLUR,
  },

  // 4. How HELOCs Work — gray-50 band, 2 icon-tile cards + credit-limit formula box.
  {
    _type: 'processCardsWithFormula',
    _key: k('sec'),
    anchorId: 'how-helocs-work',
    heading: 'How HELOCs Work',
    cards: [
      {
        _key: k('card'),
        icon: 'TrendingUp',
        tint: 'blue',
        title: 'Draw Period (Usually 10 Years)',
        points: [
          { _key: k('pt'), text: 'Access funds as needed up to your credit limit' },
          { _key: k('pt'), text: 'Make interest-only payments on amount borrowed' },
          { _key: k('pt'), text: 'Repay and re-borrow as needed' },
        ],
      },
      {
        _key: k('card'),
        icon: 'DollarSign',
        tint: 'green',
        title: 'Repayment Period (Usually 20 Years)',
        points: [
          { _key: k('pt'), text: 'No longer able to borrow from the line' },
          { _key: k('pt'), text: 'Make principal and interest payments' },
          { _key: k('pt'), text: 'Payments typically higher than draw period' },
        ],
      },
    ],
    formulaHeading: 'HELOC Credit Limit Calculation',
    formulaIntro: 'Your HELOC credit limit is typically calculated as:',
    formula: '(Home Value × 80-85%) - Existing Mortgage Balance = Available Credit',
    formulaNote:
      '*Actual credit limit depends on your creditworthiness, income, and lender requirements.',
  },

  // 5. Benefits — white band, 6 left-border accent cards, 3-up (gap-6).
  {
    _type: 'borderAccentCards',
    _key: k('sec'),
    anchorId: 'benefits',
    background: 'white',
    heading: 'Benefits of HELOCs',
    columns: 3,
    coloredTitles: false,
    cards: [
      {
        _key: k('card'),
        icon: 'TrendingUp',
        accent: 'green',
        title: 'Lower Interest Rates',
        body: 'HELOCs typically offer lower interest rates than credit cards or personal loans because your home secures the debt.',
      },
      {
        _key: k('card'),
        icon: 'Clock',
        accent: 'blue',
        title: 'Flexible Access',
        body: 'Borrow only what you need, when you need it. Pay interest only on the amount you actually use.',
      },
      {
        _key: k('card'),
        icon: 'DollarSign',
        accent: 'purple',
        title: 'Potential Tax Benefits',
        body: 'Interest may be tax-deductible if used for home improvements (consult your tax advisor).',
      },
      {
        _key: k('card'),
        icon: 'Home',
        accent: 'teal',
        title: 'Large Credit Limits',
        body: "Access significant amounts of money based on your home's equity - often much more than unsecured loans.",
      },
      {
        _key: k('card'),
        icon: 'Calculator',
        accent: 'orange',
        title: 'Interest-Only Payments',
        body: 'During the draw period, you can make interest-only payments, keeping monthly costs lower.',
      },
      {
        _key: k('card'),
        icon: 'Shield',
        accent: 'green',
        title: 'No Prepayment Penalties',
        body: 'Most HELOCs allow you to pay off the balance early without penalties, saving on interest costs.',
      },
    ],
  },

  // 6. Risks — red-50 band, 4 left-border accent cards, 2-up (gap-8), colored titles.
  {
    _type: 'borderAccentCards',
    _key: k('sec'),
    anchorId: 'risks',
    background: 'red',
    heading: 'Risks to Consider',
    columns: 2,
    coloredTitles: true,
    cards: [
      {
        _key: k('card'),
        icon: 'AlertTriangle',
        accent: 'red',
        title: 'Your Home is at Risk',
        body: "Since your home secures the HELOC, you could lose it if you can't make payments. Only borrow what you can afford to repay.",
      },
      {
        _key: k('card'),
        icon: 'TrendingUp',
        accent: 'orange',
        title: 'Variable Interest Rates',
        body: 'HELOC rates can increase over time, making your payments higher. Budget for potential rate increases.',
      },
      {
        _key: k('card'),
        icon: 'Clock',
        accent: 'yellow',
        title: 'Payment Shock',
        body: 'When the draw period ends, payments can increase significantly as you begin paying principal and interest.',
      },
      {
        _key: k('card'),
        icon: 'Home',
        accent: 'purple',
        title: 'Reduced Home Equity',
        body: 'Using your HELOC reduces your home equity, which could limit future borrowing options or affect your net worth.',
      },
    ],
  },

  // 7. Common Uses — white band, 2 columns (smart uses / uses to avoid).
  {
    _type: 'dosAndDontsColumns',
    _key: k('sec'),
    anchorId: 'uses',
    heading: 'Common Uses for HELOCs',
    dosHeading: 'Smart Uses',
    dos: [
      {
        _key: k('use'),
        title: 'Home Improvements',
        body: "Renovations that increase your home's value, like kitchen remodels or additions.",
      },
      {
        _key: k('use'),
        title: 'Debt Consolidation',
        body: 'Pay off high-interest credit cards or other debts with lower HELOC rates.',
      },
      {
        _key: k('use'),
        title: 'Education Expenses',
        body: 'Fund college tuition or other educational investments for you or your family.',
      },
      {
        _key: k('use'),
        title: 'Emergency Fund',
        body: 'Keep as a backup for unexpected major expenses (use sparingly).',
      },
    ],
    dontsHeading: 'Uses to Avoid',
    donts: [
      {
        _key: k('avoid'),
        title: 'Vacations or Luxury Items',
        body: "Don't risk your home for discretionary spending that doesn't build wealth.",
      },
      {
        _key: k('avoid'),
        title: 'Daily Living Expenses',
        body: 'Using a HELOC for regular bills indicates a budget problem that needs addressing.',
      },
      {
        _key: k('avoid'),
        title: 'Risky Investments',
        body: "Don't gamble with your home equity on speculative investments.",
      },
      {
        _key: k('avoid'),
        title: 'Business Ventures (High Risk)',
        body: 'Only use for business if you have a solid plan and can afford to lose the money.',
      },
    ],
  },

  // 8. Qualification — gray-50 band, 2 plain cards (detailed + simple items).
  {
    _type: 'requirementCards',
    _key: k('sec'),
    anchorId: 'qualification',
    heading: 'HELOC Qualification Requirements',
    cards: [
      {
        _key: k('card'),
        title: 'Typical Requirements',
        itemStyle: 'detailed',
        items: [
          { _key: k('req'), title: 'Credit Score: 680+', body: 'Higher scores get better rates and terms' },
          { _key: k('req'), title: 'Home Equity: 15-20%+', body: 'Most lenders want you to keep 15-20% equity' },
          { _key: k('req'), title: 'Debt-to-Income: Under 43%', body: 'Including the new HELOC payment' },
          { _key: k('req'), title: 'Stable Income', body: 'Proof of consistent employment or income' },
        ],
      },
      {
        _key: k('card'),
        title: 'Required Documentation',
        itemStyle: 'simple',
        items: [
          { _key: k('doc'), title: 'Recent pay stubs or tax returns' },
          { _key: k('doc'), title: 'Bank statements' },
          { _key: k('doc'), title: 'Property tax records' },
          { _key: k('doc'), title: 'Homeowners insurance information' },
          { _key: k('doc'), title: 'Current mortgage statement' },
          { _key: k('doc'), title: 'Home appraisal (arranged by lender)' },
        ],
      },
    ],
  },

  // 9. FAQ — white band, Plus/Minus accordion + contact CTA (full-width).
  {
    _type: 'faqAccordion',
    _key: k('sec'),
    title: 'HELOC 101 FAQ',
    subtitle: 'Get answers to the most common questions about Home Equity Lines of Credit',
    background: 'white',
    showContactCTA: true,
    contactCTAText: 'Need personalized HELOC guidance?',
    contactCTALink: '/pre-qual',
    items: [
      {
        _key: k('faq'),
        question: "What's the difference between a HELOC and a home equity loan?",
        answer:
          'A HELOC is a revolving line of credit that works like a credit card, allowing you to borrow and repay repeatedly during the draw period. A home equity loan gives you a lump sum upfront with fixed monthly payments.',
      },
      {
        _key: k('faq'),
        question: 'How much can I borrow with a HELOC?',
        answer:
          "Most lenders allow you to borrow up to 80-85% of your home's value minus what you owe on your mortgage. The exact amount depends on your credit score, income, and debt-to-income ratio.",
      },
      {
        _key: k('faq'),
        question: 'What are typical HELOC interest rates?',
        answer:
          "HELOC rates are typically variable and tied to the prime rate. They're usually lower than credit cards but higher than first mortgages. Rates can change monthly based on market conditions.",
      },
      {
        _key: k('faq'),
        question: 'Can I pay off my HELOC early?',
        answer:
          'Yes, you can pay off your HELOC early without prepayment penalties from most lenders. Paying early can save you significant interest costs over time.',
      },
      {
        _key: k('faq'),
        question: "What happens if I can't make my HELOC payments?",
        answer:
          "Since your home secures the HELOC, failing to make payments could result in foreclosure. It's important to have a repayment plan and only borrow what you can afford to repay.",
      },
      {
        _key: k('faq'),
        question: 'Are HELOC interest payments tax deductible?',
        answer:
          'HELOC interest may be tax deductible if you use the funds to buy, build, or substantially improve your home. Consult with a tax professional for your specific situation.',
      },
    ],
  },

  // 10. CTA — gradient band, link-less primary button + fine print (full-width).
  {
    _type: 'gradientCtaBand',
    _key: k('sec'),
    heading: 'Ready to Explore Your HELOC Options?',
    body: "Now that you understand HELOCs, let's help you find the right lender and terms for your situation.",
    primaryCta: { label: 'Get Pre-Qualified Now' },
    secondaryCta: { label: 'Calculate Your Equity', href: '/calculators/home-equity-estimator' },
    finePrint: "Free consultation • No obligation • Won't affect your credit score",
  },
]

const doc = {
  // Dot-free _id so the dataset's anonymous read grant (`_id in path("*")`,
  // single-segment only) covers it — a dotted id would 404 for the token-less client.
  _id: 'page-heloc-101',
  _type: 'page',
  title: 'HELOC 101: Complete Guide to Home Equity Lines of Credit',
  // Temporary slug so it does not collide with the live hardcoded /heloc-101 route.
  slug: { _type: 'slug', current: 'heloc-101' },
  sections,
  seoTitle: 'HELOC 101: Complete Guide to Home Equity Lines of Credit',
  seoDescription:
    'Learn everything about HELOCs - how they work, benefits, risks, qualification requirements, and whether a Home Equity Line of Credit is right for you.',
  canonicalUrl: 'https://heloc360.com/heloc-101',
  noindex: false,
}

const res = await client.createOrReplace(doc)
console.log('Seeded page doc:', res._id, '→ slug', res.slug?.current)
console.log('top-level sections:', res.sections.map((x) => x._type).join(', '))
