import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '2a445j5i',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-12-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// Team index page at /meet-our-team. The footer has always linked here but no
// page ever existed (404 on the old live site too) — member detail pages live
// at /meet-our-team/<slug> (hardcoded route). One self-contained teamSection
// block: it fetches all team members at render time and splits Leadership /
// Contributors, same as the about page's team band.

const doc = {
  _id: 'page-meet-our-team',
  _type: 'page',
  title: 'Meet Our Team | HELOC360',
  slug: { _type: 'slug', current: 'meet-our-team' },
  sections: [
    {
      _type: 'teamSection',
      _key: 'mot-team',
      anchorId: 'team',
      heading: 'Meet Our Team',
      subheading: "The experts dedicated to helping you unlock your home's potential",
      leadershipHeading: 'Leadership & Management',
      contributorsHeading: 'Contributors',
      leadershipRoles: ['ceo', 'founder', 'content studio director', 'senior account manager'],
      emptyHeading: 'Team information coming soon',
      emptyBody: "We're currently setting up our team profiles. Check back soon to meet our experts.",
    },
  ],
  seoTitle: 'Meet Our Team | HELOC360',
  seoDescription:
    "Meet the HELOC360 team — the advisors, writers, and operators dedicated to helping you unlock your home's potential.",
  canonicalUrl: 'https://heloc360.com/meet-our-team',
  noindex: false,
}

const res = await client.createOrReplace(doc)
console.log('Seeded page doc:', res._id, '→ slug', res.slug?.current)
console.log('top-level sections:', res.sections.map((x) => x._type).join(', '))
