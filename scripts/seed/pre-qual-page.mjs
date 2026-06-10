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
  _id: 'page-pre-qual',
  _type: 'page',
  title: 'Talk to a HELOC advisor — free, no obligation',
  // Temporary slug so it does not collide with the live hardcoded /pre-qual route.
  slug: { _type: 'slug', current: 'pre-qual-sanity' },
  // preQualIntro reproduces the page chrome (bg-surface-50 main, header, white card)
  // verbatim and hosts the interactive PreQualForm via a nested componentEmbed. It also
  // renders the StickyCtaSuppress side-effect (suppressStickyCta defaults true).
  sections: [
    {
      _type: 'preQualIntro',
      _key: 'prequal-intro',
      eyebrow: 'The HELOC advisor',
      heading: 'See what your home equity can do — in under a minute.',
      description:
        "Three quick questions about your home. We'll show you a rough borrowing estimate, then a licensed advisor (not a sales rep) calls you to walk through the trade-offs.",
      suppressStickyCta: true,
      embeds: [
        {
          _type: 'componentEmbed',
          _key: 'embed-prequal-form',
          component: 'preQualForm',
        },
      ],
    },
  ],
  seoTitle: 'Talk to a HELOC advisor — free, no obligation',
  seoDescription:
    'Two-step pre-qual: tell us about your home, see a rough borrowing estimate, then a licensed advisor walks you through the trade-offs. No credit pull.',
  canonicalUrl: 'https://heloc360.com/pre-qual',
  noindex: false,
}

const res = await client.createOrReplace(doc)
console.log('Seeded page doc:', res._id, '→ slug', res.slug?.current)
console.log('top-level sections:', res.sections.map((x) => x._type).join(', '))
