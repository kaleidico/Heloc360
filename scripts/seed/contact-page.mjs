import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '2a445j5i',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-12-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const doc = {
  // Dot-free _id so the dataset's anonymous read grant (single-segment path) covers it.
  _id: 'page-contact',
  _type: 'page',
  title: 'Contact HELOC360 - Get Help with Your Home Equity Line of Credit',
  // Temporary slug so it does not collide with the live hardcoded /contact route.
  slug: { _type: 'slug', current: 'contact' },
  // The ContactForm component renders the entire page layout (hero, contact methods,
  // form, sidebar, CTA), so a single top-level componentEmbed is the whole page.
  sections: [
    {
      _type: 'componentEmbed',
      _key: 'embed-contact-form',
      component: 'contactForm',
    },
  ],
  seoTitle: 'Contact HELOC360 - Get Help with Your Home Equity Line of Credit',
  seoDescription:
    'Reach out to HELOC360 for personalized guidance on home equity lines of credit. Our team helps you understand your options and find the right HELOC solution.',
  canonicalUrl: 'https://heloc360.com/contact',
  noindex: false,
}

const res = await client.createOrReplace(doc)
console.log('Seeded page doc:', res._id, '→ slug', res.slug?.current)
console.log('top-level sections:', res.sections.map((x) => x._type).join(', '))
