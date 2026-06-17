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

// Shared blur placeholder used by the static homepage images (verbatim from
// app/(site)/page.tsx).
const BLUR =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='

// --- Top-level sections, in source order -------------------------------------
const sections = [
  // 1. Hero — full-bleed background image, overlay, single green CTA, fine print.
  {
    _type: 'imageHero',
    _key: k('sec'),
    headingLine1: "Turn Your Home's Value Into",
    headingLine2: 'Opportunities That Work for You',
    lead:
      "Welcome to HELOC360—your trusted partner in turning home equity into opportunity. Whether it's funding a major renovation, consolidating debt, or creating financial flexibility, we make it easier to achieve your goals.",
    cta: {
      label: 'Get Pre-Qualified',
      href: '/pre-qual',
      ariaLabel: 'Get pre-qualified for a HELOC - Free and confidential',
    },
    finePrint:
      'At HELOC360, we simplify the process, empower you with knowledge, and connect you with lenders tailored to meet your unique needs. Your home has the potential to open doors—let us show you how.',
    imageSrc: '/images/optimized/home-hero.webp',
    imageAlt:
      'Beautiful suburban neighborhood home with stone exterior and well-maintained landscaping',
    imageBlurDataURL: BLUR,
  },

  // 2. What is HELOC360 — gray-50 band, copy + checklist (left) + image (right).
  {
    _type: 'splitContentChecklist',
    _key: k('sec'),
    anchorId: 'what-is-heloc360',
    heading: 'What is HELOC360?',
    lead:
      "HELOC360 is more than a matching service—it's your guide to making smart financial choices. Specializing in Home Equity Lines of Credit, we help homeowners access the funds they need to achieve their goals while providing resources and personalized lender matches.",
    checklist: [
      'Expert guidance through the entire HELOC process',
      'Personalized matches with vetted lenders',
      'Educational resources and tools to make informed decisions',
    ],
    imageSrc: '/images/optimized/home-what-is-a-heloc360.webp',
    imageAlt:
      'Classic Victorian home with wraparound porch representing established homeownership and built equity',
    imageBlurDataURL: BLUR,
  },

  // 3. Our Process — white band, 3-up numbered cards.
  {
    _type: 'numberedProcessCards',
    _key: k('sec'),
    anchorId: 'our-process',
    background: 'white',
    heading: 'Our Process',
    subheading:
      "We've simplified the HELOC process into three easy steps to help you unlock your home's potential.",
    steps: [
      {
        _key: k('step'),
        number: '1',
        accent: 'blue',
        title: 'Explore Resources',
        body:
          "Learn about HELOCs through our comprehensive guides, calculators, and educational content to understand if it's right for you.",
      },
      {
        _key: k('step'),
        number: '2',
        accent: 'green',
        title: 'Share Your Needs',
        body:
          "Tell us about your financial goals and situation through our simple pre-qualification form. It's quick, secure, and confidential.",
      },
      {
        _key: k('step'),
        number: '3',
        accent: 'teal',
        title: 'Get Connected',
        body:
          "We'll match you with vetted lenders who specialize in your situation and can offer competitive rates and terms.",
      },
    ],
  },

  // 4. Why Choose HELOC360 — blue-50 band, 4-up centered icon features.
  {
    _type: 'iconFeatureGrid',
    _key: k('sec'),
    anchorId: 'why-choose-heloc360',
    background: 'blue',
    heading: 'Why Choose HELOC360?',
    subheading:
      "We're committed to making your HELOC journey as smooth and successful as possible.",
    features: [
      {
        _key: k('feat'),
        icon: 'Home',
        accent: 'blue',
        title: 'Tailored Solutions',
        body:
          "Every homeowner's situation is unique. We provide personalized recommendations based on your specific needs.",
      },
      {
        _key: k('feat'),
        icon: 'Users',
        accent: 'green',
        title: 'Vetted Lenders',
        body:
          'We work only with reputable, licensed lenders who have proven track records of excellent service.',
      },
      {
        _key: k('feat'),
        icon: 'Clock',
        accent: 'teal',
        title: 'Simplified Process',
        body:
          "We've streamlined the traditionally complex HELOC process to save you time and reduce stress.",
      },
      {
        _key: k('feat'),
        icon: 'Shield',
        accent: 'purple',
        title: 'Free & Confidential',
        body:
          'Our service is completely free to use, and we protect your personal information with bank-level security.',
      },
    ],
  },

  // 5. Benefits of HELOCs — white band, copy + 2x2 icon-badge items + image.
  {
    _type: 'benefitsWithImage',
    _key: k('sec'),
    anchorId: 'benefits-of-helocs',
    heading: 'Benefits of HELOCs',
    lead:
      'A Home Equity Line of Credit can be a powerful financial tool when used wisely. Here are some common ways homeowners leverage their equity:',
    items: [
      {
        _key: k('item'),
        icon: 'Home',
        accent: 'blue',
        title: 'Home Improvements',
        body: "Renovations that increase your home's value",
      },
      {
        _key: k('item'),
        icon: 'CheckCircle',
        accent: 'green',
        title: 'Debt Consolidation',
        body: 'Combine high-interest debts into one lower payment',
      },
      {
        _key: k('item'),
        icon: 'Shield',
        accent: 'teal',
        title: 'Emergency Fund',
        body: 'Access to funds when unexpected expenses arise',
      },
      {
        _key: k('item'),
        icon: 'Users',
        accent: 'purple',
        title: 'Education Costs',
        body: 'Fund college tuition or other educational expenses',
      },
    ],
    imageSrc: '/images/v48rryfvnyc.jpg',
    imageAlt:
      'Construction workers on a house roof, representing home improvement projects that can be funded with HELOC',
    imageBlurDataURL: BLUR,
  },

  // 6. FAQ — gray-50 band, Plus/Minus accordion + contact CTA (HomeFAQ data).
  {
    _type: 'faqAccordion',
    _key: k('sec'),
    title: 'Frequently Asked Questions',
    subtitle: 'Get answers to common questions about HELOCs and our services.',
    background: 'gray',
    showContactCTA: true,
    contactCTAText: 'Still have questions?',
    contactCTALink: '/pre-qual',
    items: [
      {
        _key: k('faq'),
        question: 'What is a HELOC?',
        answer:
          "A Home Equity Line of Credit lets you borrow against your home's value for flexible spending.",
      },
      {
        _key: k('faq'),
        question: 'How does HELOC360 work?',
        answer: 'We match you with lenders that fit your financial needs and goals.',
      },
      {
        _key: k('faq'),
        question: 'How long does it take?',
        answer: 'We connect you with lenders quickly—often within minutes.',
      },
      {
        _key: k('faq'),
        question: 'How much does it cost?',
        answer: 'Our service is completely free to homeowners.',
      },
    ],
  },

  // 7. Lead Capture — gradient band, frosted Card hosting the embedded form.
  {
    _type: 'formCtaBand',
    _key: k('sec'),
    anchorId: 'get-started',
    heading: "Ready to Unlock Your Home's Potential?",
    lead:
      "Get started with a free, no-obligation pre-qualification. It takes just a few minutes and won't affect your credit score.",
    cardTitle: 'Stay Connected with HELOC360',
    cardDescription:
      'Get the latest HELOC tips, market updates, and success stories delivered to your inbox.',
    embed: { _type: 'componentEmbed', _key: k('embed'), component: 'mailingListForm' },
    finePrint: {
      before: 'By submitting this form, you agree to our',
      termsLabel: 'Terms of Service',
      termsHref: '/terms',
      middle: 'and',
      privacyLabel: 'Privacy Policy',
      privacyHref: '/privacy',
      after: ". We'll never share your information with third parties.",
    },
  },
]

const doc = {
  // Dot-free _id so the dataset's anonymous read grant (`_id in path("*")`,
  // single-segment only) covers it — a dotted id would 404 for the token-less client.
  _id: 'page-home',
  _type: 'page',
  title: 'Home Equity Line of Credit Services - HELOC360',
  // Temporary preview slug — does NOT collide with the live hardcoded `/` route.
  // The /-root cutover is performed by the controller after visual verification.
  slug: { _type: 'slug', current: 'home' },
  sections,
  seoTitle: 'Home Equity Line of Credit Services - HELOC360',
  seoDescription:
    "Turn your home's value into opportunities that work for you. Get pre-qualified for a HELOC with vetted lenders. Expert guidance, simplified process, free & confidential.",
  canonicalUrl: 'https://heloc360.com',
  noindex: false,
}

const res = await client.createOrReplace(doc)
console.log('Seeded page doc:', res._id, '→ slug', res.slug?.current)
console.log('top-level sections:', res.sections.map((x) => x._type).join(', '))
