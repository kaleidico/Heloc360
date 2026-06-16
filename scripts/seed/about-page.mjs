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

// Shared blur placeholder used by both static hero/story images (verbatim from
// app/(site)/about/page.tsx).
const BLUR =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='

// --- Top-level sections, in source order -------------------------------------
const sections = [
  // 1. Hero — gradient band (full-width).
  {
    _type: 'marketingHero',
    _key: k('sec'),
    heading: 'Turning Home Equity Into Opportunity',
    body: "At HELOC360, we believe every homeowner should have access to their home's equity. We're here to simplify the process, provide expert guidance, and connect you with the right lenders.",
    primaryCta: { label: 'Get Started Today', href: 'https://get-started.heloc360.com/' },
    secondaryCta: { label: 'Learn About HELOCs', href: '/heloc-101' },
    imageSrc: '/images/nbryw-mr6_w.jpg',
    imageAlt:
      'Happy couple taking a selfie together, representing the joy and satisfaction of achieving financial goals with HELOC360',
    imageBlurDataURL: BLUR,
  },

  // 2. Company Stats — white figures band (full-width).
  {
    _type: 'statsBand',
    _key: k('sec'),
    stats: [
      { _key: k('stat'), icon: 'Home', number: '10,000+', label: 'Homeowners Helped' },
      { _key: k('stat'), icon: 'TrendingUp', number: '$500M+', label: 'In Home Equity Accessed' },
      { _key: k('stat'), icon: 'Award', number: '98%', label: 'Customer Satisfaction' },
      { _key: k('stat'), icon: 'Users', number: '50+', label: 'Vetted Lender Partners' },
    ],
  },

  // 3. Our Story — gray-50 band, constrained max-w-4xl (full-width band).
  {
    _type: 'storySection',
    _key: k('sec'),
    background: 'gray',
    heading: 'Our Story',
    subheading:
      'Founded on the belief that homeownership should unlock opportunities, not create barriers.',
    columnHeading: 'Why We Started HELOC360',
    paragraphs: [
      'After years of working in traditional mortgage lending, our founders saw how complicated and intimidating the home equity process had become. Homeowners with significant equity were struggling to access it, often getting lost in complex paperwork and confusing terms.',
      "We knew there had to be a better way. That's why we created HELOC360 - to be the bridge between homeowners and the equity they've built, making the process transparent, educational, and accessible.",
    ],
    checklist: [
      'Founded in 2020 by mortgage industry veterans',
      'Helped over 10,000 homeowners access their equity',
      'Partnered with 50+ vetted lenders nationwide',
    ],
    imageSrc: '/images/2h5yw_eaqga.jpg',
    imageAlt:
      'Happy family enjoying a meal together, representing the warmth and satisfaction of achieving financial goals with HELOC360',
    imageBlurDataURL: BLUR,
  },

  // 4. Our Values — white band, constrained max-w-6xl, 4-up accent cards.
  {
    _type: 'valueCardsGrid',
    _key: k('sec'),
    background: 'white',
    heading: 'Our Values',
    subheading: 'The principles that guide everything we do',
    cards: [
      {
        _key: k('card'),
        icon: 'Shield',
        accent: 'blue',
        title: 'Transparency',
        body: "We believe in clear communication, honest advice, and no hidden fees. You'll always know exactly what to expect.",
      },
      {
        _key: k('card'),
        icon: 'Heart',
        accent: 'green',
        title: 'Customer First',
        body: "Your success is our success. Every decision we make is guided by what's best for our customers and their financial goals.",
      },
      {
        _key: k('card'),
        icon: 'Target',
        accent: 'purple',
        title: 'Excellence',
        body: "We're committed to providing exceptional service, expert guidance, and the best possible outcomes for every customer.",
      },
      {
        _key: k('card'),
        icon: 'Users',
        accent: 'orange',
        title: 'Education',
        body: 'We empower homeowners with knowledge, providing the education and tools needed to make informed financial decisions.',
      },
    ],
  },

  // 5. Meet the Team — gray-50 band, dynamic members (full-width band).
  {
    _type: 'teamSection',
    _key: k('sec'),
    anchorId: 'team',
    heading: 'Meet Our Team',
    subheading: "The experts dedicated to helping you unlock your home's potential",
    leadershipHeading: 'Leadership & Management',
    contributorsHeading: 'Contributors',
    leadershipRoles: ['ceo', 'founder', 'content studio director', 'senior account manager'],
    emptyHeading: 'Team information coming soon',
    emptyBody:
      "We're currently setting up our team profiles. Check back soon to meet our experts.",
  },

  // 6. Our Mission — white band, centered max-w-4xl + gradient highlight box.
  {
    _type: 'missionStatement',
    _key: k('sec'),
    heading: 'Our Mission',
    lead: 'To democratize access to home equity by providing homeowners with the education, tools, and connections they need to make informed financial decisions and achieve their goals.',
    boxHeading: 'What This Means for You',
    points: [
      {
        _key: k('pt'),
        heading: 'Expert Guidance',
        body: 'Our team of mortgage professionals provides personalized advice tailored to your unique situation.',
      },
      {
        _key: k('pt'),
        heading: 'Vetted Partners',
        body: 'We work only with reputable, licensed lenders who meet our strict standards for service and rates.',
      },
      {
        _key: k('pt'),
        heading: 'No Hidden Costs',
        body: "Our service is completely free to homeowners. We're compensated by our lender partners, not you.",
      },
    ],
  },

  // 7. Awards & Recognition — gray-50 band, 3-up cards.
  {
    _type: 'awardsGrid',
    _key: k('sec'),
    background: 'gray',
    heading: 'Awards & Recognition',
    subheading: 'Recognized for excellence in customer service and innovation',
    awards: [
      { _key: k('award'), icon: 'Award', tint: 'yellow', title: 'Best Customer Service', subtitle: 'FinTech Awards 2023' },
      { _key: k('award'), icon: 'TrendingUp', tint: 'blue', title: 'Fastest Growing', subtitle: 'Mortgage Tech 2023' },
      { _key: k('award'), icon: 'Shield', tint: 'green', title: 'Top Rated Platform', subtitle: 'Consumer Choice 2023' },
    ],
  },

  // 8. CTA — gradient band (full-width).
  {
    _type: 'marketingCtaBand',
    _key: k('sec'),
    heading: 'Ready to Work With Us?',
    body: "Join thousands of homeowners who have successfully accessed their home equity with HELOC360's help.",
    primaryCta: { label: 'Get Pre-Qualified', href: '/pre-qual' },
    secondaryCta: { label: 'Meet Our Team', href: '/meet-our-team' },
    finePrint: 'Free consultation • No obligation • Expert guidance every step of the way',
  },

  // 9. Mailing/legal address — small centered closing note.
  {
    _type: 'pageFooterNote',
    _key: k('sec'),
    text: 'HELOC360 is provided by My Perfect Leads, LLC · 1121 Annapolis RD #218 · Odenton, MD 21113',
    showReturnHome: false,
  },
]

const doc = {
  // Dot-free _id so the dataset's anonymous read grant (`_id in path("*")`,
  // single-segment only) covers it — a dotted id would 404 for the token-less client.
  _id: 'page-about',
  _type: 'page',
  title: 'About HELOC360 - Your Trusted Home Equity Partner',
  // Temporary slug so it does not collide with the live hardcoded /about route.
  slug: { _type: 'slug', current: 'about' },
  sections,
  seoTitle: 'About HELOC360 - Your Trusted Home Equity Partner',
  seoDescription:
    "Learn about HELOC360's mission to simplify home equity access. Meet our team of experts dedicated to helping homeowners unlock their home's potential.",
  canonicalUrl: 'https://heloc360.com/about',
  noindex: false,
}

const res = await client.createOrReplace(doc)
console.log('Seeded page doc:', res._id, '→ slug', res.slug?.current)
console.log('top-level sections:', res.sections.map((x) => x._type).join(', '))
