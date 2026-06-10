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

// --- Portable Text builders (mirror app/(site)/affiliate-disclosure/page.tsx) -
const span = (text, marks = []) => ({ _type: 'span', _key: k('s'), text, marks })
const p = (children, markDefs = []) => ({ _type: 'block', _key: k('b'), style: 'normal', markDefs, children })

// === proseSection 1 — Introduction =========================================
// Source: the `prose prose-lg prose-gray mb-12` intro, four paragraphs. The
// first paragraph links "My Perfect Leads, LLC" to https://myperfectleads.com/
// with the trailing ExternalLink icon — encoded via the link annotation's
// `external: true` flag (see prose-section's LegalPortableText serializer).
const introBody = [
  p(
    [
      span('heloc360.com is a real estate research and education website provided by '),
      span('My Perfect Leads, LLC', ['l0']),
      span('. heloc360.com is not a mortgage lender.'),
    ],
    [{ _key: 'l0', _type: 'link', href: 'https://myperfectleads.com/', external: true }],
  ),
  p([
    span(
      "I'm passionate about teaching and guiding people to a better personal finance situation. To do this, I create an enormous amount of content, which takes time, resources, and money.",
    ),
  ]),
  p([
    span(
      'In order to finance these products and services for you, I use affiliate marketing and link to products and services. If you click on, subscribe, to purchase on these links then I am paid a commission.',
    ),
  ]),
  p([
    span(
      'I diligently review and attempt to only select and recommend products and services that I think are of high quality and value to you, my reader.',
    ),
  ]),
]

// === checkmarkGrid — Our Commitment to You =================================
// Gradient box (`inGradientBox`), Heart icon heading, 2-col CheckCircle items.
const commitment = {
  _type: 'checkmarkGrid',
  _key: k('sec'),
  inGradientBox: true,
  heading: 'Our Commitment to You',
  icon: 'Heart',
  items: [
    {
      _key: k('item'),
      title: 'Quality First',
      body: 'We only recommend products and services that we genuinely believe will benefit our readers.',
    },
    {
      _key: k('item'),
      title: 'Honest Reviews',
      body: 'Our reviews and recommendations are based on thorough research and honest evaluation.',
    },
    {
      _key: k('item'),
      title: 'Clear Disclosure',
      body: 'We clearly identify affiliate links and relationships throughout our content.',
    },
    {
      _key: k('item'),
      title: 'Your Best Interest',
      body: 'Our primary goal is to help you make informed financial decisions, not to earn commissions.',
    },
  ],
}

// === accentNotes — How Affiliate Marketing Works ==========================
// Three left-accent blocks: blue, green, purple (verbatim accent order).
const howItWorks = {
  _type: 'accentNotes',
  _key: k('sec'),
  notes: [
    {
      _key: k('note'),
      accent: 'blue',
      heading: 'What Are Affiliate Links?',
      body: "Affiliate links are special URLs that track when someone clicks from our website to a partner's website. If you make a purchase or sign up for a service through these links, we may receive a commission at no additional cost to you.",
    },
    {
      _key: k('note'),
      accent: 'green',
      heading: 'No Extra Cost to You',
      body: "When you use our affiliate links, you pay the same price you would pay if you went directly to the company's website. The commission comes from the company's marketing budget, not from your pocket.",
    },
    {
      _key: k('note'),
      accent: 'purple',
      heading: 'Supporting Our Mission',
      body: 'These commissions help us maintain our website, create valuable content, and continue providing free educational resources about home equity and financial planning.',
    },
  ],
}

// === twoTierCards — Types of Partnerships =================================
// Four cards, source uses md:grid-cols-2 → columns: 2. Each card: title, body,
// finePrint (the smaller `text-xs text-gray-600` line).
const partnerships = {
  _type: 'twoTierCards',
  _key: k('sec'),
  columns: 2,
  cards: [
    {
      _key: k('card'),
      title: 'Lender Partnerships',
      body: "We partner with reputable lenders who offer competitive HELOC products. When you're matched with a lender through our service, we may receive compensation.",
      finePrint:
        'This compensation never influences our recommendations or the lenders we choose to work with.',
    },
    {
      _key: k('card'),
      title: 'Educational Resources',
      body: 'We may recommend books, courses, or tools that help with financial planning and home equity management.',
      finePrint: "These recommendations are based on quality and relevance to our readers' needs.",
    },
    {
      _key: k('card'),
      title: 'Financial Tools',
      body: 'We may affiliate with companies that provide useful financial calculators, budgeting apps, or investment platforms.',
      finePrint: 'We only recommend tools that we believe genuinely help with financial management.',
    },
    {
      _key: k('card'),
      title: 'Professional Services',
      body: 'We may recommend financial advisors, tax professionals, or real estate services that complement our educational content.',
      finePrint: 'These professionals are vetted for their expertise and commitment to client service.',
    },
  ],
}

// === infoCard (grayProse) — Editorial Independence ========================
// `bg-gray-50 p-8 rounded-lg`, Shield icon heading, three prose paragraphs.
const editorial = {
  _type: 'infoCard',
  _key: k('sec'),
  variant: 'grayProse',
  icon: 'Shield',
  heading: 'Editorial Independence',
  body: [
    p([
      span(
        'Our editorial content is created independently of our affiliate relationships. We maintain strict editorial standards and never allow affiliate partnerships to influence our educational content, reviews, or recommendations.',
      ),
    ]),
    p([
      span(
        "When we write about financial products or services, our primary consideration is always what's best for our readers, not what generates the highest commission.",
      ),
    ]),
    p([
      span(
        'We regularly review our affiliate partnerships to ensure they continue to align with our values and provide genuine value to our audience.',
      ),
    ]),
  ],
}

// === proseSection 2 — FTC Compliance ======================================
// Heading + three paragraphs. The source heading is `text-2xl font-bold
// text-[#1b75bc] mb-6` with no icon — reproduced here as an H2 inside the
// prose body (LegalPortableText renders h2 with that exact class), so the
// heading and its paragraphs share the same constrained prose container.
const ftcBody = [
  { _type: 'block', _key: k('b'), style: 'h2', markDefs: [], children: [span('FTC Compliance')] },
  p([
    span(
      'In accordance with Federal Trade Commission (FTC) guidelines, we disclose that we may receive compensation when you click on certain links or make purchases through our website.',
    ),
  ]),
  p([
    span(
      'This disclosure is made in the interest of full transparency and in compliance with FTC regulations regarding endorsements and testimonials in advertising.',
    ),
  ]),
  p([
    span(
      'We are committed to honest and transparent communication with our readers about all aspects of our business model.',
    ),
  ]),
]

const doc = {
  // Dot-free _id: the dataset's anonymous read grant is `_id in path("*")`,
  // which only covers single-segment IDs. A dotted id is NOT publicly readable,
  // so the token-less frontend client would 404. Hyphenated ids render public.
  _id: 'page-affiliate-disclosure',
  _type: 'page',
  title: 'Affiliate Disclosure',
  // Temporary slug so it does not collide with the live hardcoded
  // /affiliate-disclosure route.
  slug: { _type: 'slug', current: 'affiliate-disclosure-sanity' },
  sections: [
    // 1. Gradient banner header
    {
      _type: 'legalHeader',
      _key: k('sec'),
      heading: 'Transparency Matters Explore Affiliate Disclosures in Detail',
      subheading:
        'We believe in complete transparency about our affiliate relationships and recommendations',
    },
    // 2. Introduction prose (external MPL link with trailing icon)
    { _type: 'proseSection', _key: k('sec'), body: introBody, maxWidth: '4xl' },
    // 3. Our Commitment to You (checkmark grid in gradient box)
    commitment,
    // 4. How Affiliate Marketing Works — heading + accent notes
    {
      _type: 'iconHeading',
      _key: k('sec'),
      level: 'h2',
      marginBottom: '6',
      text: 'How Affiliate Marketing Works',
    },
    howItWorks,
    // 5. Types of Partnerships — heading + two-tier cards
    {
      _type: 'iconHeading',
      _key: k('sec'),
      level: 'h2',
      marginBottom: '6',
      text: 'Types of Partnerships',
    },
    partnerships,
    // 6. Editorial Independence (gray prose info card)
    editorial,
    // 7. FTC Compliance — heading + prose
    { _type: 'proseSection', _key: k('sec'), body: ftcBody, maxWidth: '4xl' },
    // 8. Contact callout (gradient box) + buttons
    {
      _type: 'contactCallout',
      _key: k('sec'),
      heading: 'Questions About Our Affiliate Relationships?',
      bodyText:
        "If you have any questions about our affiliate relationships, how we select partners, or our editorial policies, we're here to help.",
      buttons: [
        {
          _key: k('btn'),
          label: 'Contact Our Team',
          href: 'mailto:compliance@heloc360.com',
          style: 'primary',
        },
        { _key: k('btn'), label: 'View Privacy Policy', href: '/privacy', style: 'outline' },
      ],
    },
    // 9. Effective-date footer + Return to Home
    {
      _type: 'pageFooterNote',
      _key: k('sec'),
      text: 'This affiliate disclosure is effective as of the date of your use of our website. We may update this disclosure from time to time, and we will post any changes on this page.',
      showReturnHome: true,
    },
  ],
  seoTitle: 'Affiliate Disclosure - HELOC360',
  seoDescription:
    "Learn about HELOC360's affiliate relationships and how we maintain transparency in our recommendations. We only recommend products and services we believe provide value.",
  canonicalUrl: 'https://heloc360.com/affiliate-disclosure',
  noindex: false,
}

const res = await client.createOrReplace(doc)
console.log('Seeded page doc:', res._id, '→ slug', res.slug?.current)
