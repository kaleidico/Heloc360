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

// --- Portable Text builders -------------------------------------------------
// Used only by the two prose-bearing blocks (infoCard blueStatement, the green
// "Your Choice" alertCallout). Both serialize `normal` blocks + strong/em/link
// marks; the blueStatement link mark also honors an `underline` flag.
const span = (text, marks = []) => ({ _type: 'span', _key: k('s'), text, marks })
const p = (children, markDefs = []) => ({ _type: 'block', _key: k('b'), style: 'normal', markDefs, children })

// --- 1. Gradient header banner (legalHeader) --------------------------------
const headerSection = {
  _type: 'legalHeader',
  _key: k('sec'),
  heading: 'Communication Consent',
  subheading: 'Understanding how we communicate with you and your consent preferences',
}

// --- 2. Main consent statement (infoCard / blueStatement) -------------------
// Source: bg-blue-50 border-l-4, MessageSquare icon, "Your Communication
// Consent" heading, single long paragraph with underlined Terms/Privacy links.
const mainConsent = {
  _type: 'infoCard',
  _key: k('sec'),
  variant: 'blueStatement',
  icon: 'MessageSquare',
  heading: 'Your Communication Consent',
  body: [
    p(
      [
        span('By submitting your contact information you agree to our '),
        span('Terms of Use', ['l0']),
        span(' and our '),
        span('Security and Privacy Policy', ['l1']),
        span(
          '. You also expressly consent to having us, our affiliates, and our partners contact you about your inquiry by text message or phone (including automatic telephone dialing system or an artificial or prerecorded voice) to the residential or cellular telephone number you have provided, even if that telephone number is on a corporate, state, or national Do Not Call Registry. You do not have to agree to receive such calls or messages as a condition of getting any services from HELOC360 or its affiliates.',
        ),
      ],
      [
        { _key: 'l0', _type: 'link', href: '/terms', underline: true },
        { _key: 'l1', _type: 'link', href: '/privacy', underline: true },
      ],
    ),
  ],
}

// --- 3. "What This Means for You" heading (iconHeading h2) -------------------
const whatThisMeansHeading = {
  _type: 'iconHeading',
  _key: k('sec'),
  level: 'h2',
  marginBottom: '6',
  text: 'What This Means for You',
}

// --- 4. Phone / Text two-up cards (checklistCardGrid) -----------------------
const whatThisMeansCards = {
  _type: 'checklistCardGrid',
  _key: k('sec'),
  cards: [
    {
      _key: k('card'),
      icon: 'Phone',
      iconColor: 'blue',
      title: 'Phone Communications',
      items: [
        'We may call you to discuss your HELOC inquiry',
        'Calls may be made using automated dialing systems',
        'Some calls may use prerecorded messages',
        "We can call even if you're on Do Not Call lists",
      ],
    },
    {
      _key: k('card'),
      icon: 'MessageSquare',
      iconColor: 'green',
      title: 'Text Messages',
      items: [
        'We may send text messages about your inquiry',
        'Messages may include updates and information',
        'Standard message and data rates may apply',
        'You can opt out at any time',
      ],
    },
  ],
}

// --- 5. "Your Choice" green callout (alertCallout / info) -------------------
// Source: bg-green-50 border-l-4 border-l-[#02c39a] rounded-lg mb-12, Shield,
// body opens with a <strong> sentence then continues plain.
const yourChoice = {
  _type: 'alertCallout',
  _key: k('sec'),
  variant: 'info',
  icon: 'Shield',
  rounded: true,
  outerMargin: '12',
  heading: 'Your Choice',
  body: [
    p([
      span(
        'You do not have to agree to receive calls or messages as a condition of getting services from HELOC360.',
        ['strong'],
      ),
      span(
        ' This consent is optional, but it helps us provide you with timely updates and personalized assistance with your home equity needs.',
      ),
    ]),
  ],
}

// --- 6. "Types of Communications You May Receive" heading -------------------
const typesHeading = {
  _type: 'iconHeading',
  _key: k('sec'),
  level: 'h2',
  marginBottom: '6',
  text: 'Types of Communications You May Receive',
}

// --- 7. Initial / Follow-up / Educational cards (titledBulletCards) ---------
const typesCards = {
  _type: 'titledBulletCards',
  _key: k('sec'),
  cards: [
    {
      _key: k('card'),
      title: 'Initial Contact',
      intro: 'After you submit an inquiry, we or our partners may contact you to:',
      bullets: [
        'Confirm your inquiry and gather additional information',
        'Explain our services and how we can help',
        'Schedule a consultation or discussion',
        'Answer any questions you may have',
      ],
    },
    {
      _key: k('card'),
      title: 'Follow-up Communications',
      intro: 'During the process, you may receive communications about:',
      bullets: [
        'Updates on your application or inquiry status',
        'Requests for additional documentation',
        'Lender matches and recommendations',
        'Important deadlines or time-sensitive information',
      ],
    },
    {
      _key: k('card'),
      title: 'Educational Content',
      intro: 'We may also share helpful information such as:',
      bullets: [
        'HELOC tips and best practices',
        'Market updates and rate information',
        'Educational resources and guides',
        'Relevant financial planning content',
      ],
    },
  ],
}

// --- 8. "How to Opt Out" yellow callout (alertCallout / warning) ------------
// Source: bg-yellow-50 border-l-4 border-l-yellow-400 rounded-lg mb-12,
// AlertCircle. An intro paragraph, then three label/value sub-rows (Text
// Messages / Phone Calls / Email). The alertCallout block now supports `rows`,
// which the renderer emits as the source's <div className="space-y-3"> stack of
// <h4 className="font-medium text-yellow-800"> label + <p className="text-yellow-700
// text-sm"> value pairs — so these render as distinct heading lines, not inline
// strong. (Remaining unfit markup: the source intro <p> is `text-yellow-700
// mb-4` while the body renders `text-yellow-700 text-sm`; and the Email row's
// value carries a mailto link in the source, but `rows` values are plain
// strings, so the address renders as plain text. See report.)
const optOut = {
  _type: 'alertCallout',
  _key: k('sec'),
  variant: 'warning',
  icon: 'AlertCircle',
  rounded: true,
  outerMargin: '12',
  heading: 'How to Opt Out',
  body: [
    p([span('You can stop receiving communications from us at any time using these methods:')]),
  ],
  rows: [
    {
      _key: k('row'),
      label: 'Text Messages:',
      value: 'Reply "STOP" to any text message to unsubscribe',
    },
    {
      _key: k('row'),
      label: 'Phone Calls:',
      value: 'Ask to be removed from our calling list during any call, or contact us directly',
    },
    {
      _key: k('row'),
      label: 'Email:',
      value: 'Contact us at help@heloc360.com to update your preferences',
    },
  ],
}

// --- 9. "Who May Contact You" heading (iconHeading h2) ----------------------
const whoHeading = {
  _type: 'iconHeading',
  _key: k('sec'),
  level: 'h2',
  marginBottom: '6',
  text: 'Who May Contact You',
}

// --- 10. 3-up badge cards (iconBadgeCards) ----------------------------------
const whoCards = {
  _type: 'iconBadgeCards',
  _key: k('sec'),
  columns: 3,
  cards: [
    {
      _key: k('card'),
      icon: 'Shield',
      iconTint: 'blue',
      title: 'HELOC360 Team',
      body: 'Our customer service and loan specialists may contact you directly about your inquiry.',
    },
    {
      _key: k('card'),
      icon: 'Phone',
      iconTint: 'green',
      title: 'Partner Lenders',
      body: 'Vetted lenders in our network may contact you with loan options and offers.',
    },
    {
      _key: k('card'),
      icon: 'MessageSquare',
      iconTint: 'purple',
      title: 'Service Providers',
      body: 'Third-party services that help process your application may contact you as needed.',
    },
  ],
}

// --- 11. Contact section (contactCallout) -----------------------------------
// Source: bg-gradient-to-r from-[#1b75bc]/10 to-[#007a5e]/10 p-8 rounded-lg
// with heading, body, and a primary/outline button pair — all one box. The
// contactCallout block reproduces this verbatim (its own `buttons` array +
// mt-12), so a separate buttonRow is not used (it would detach the buttons
// into a second row). See report.
const contactSection = {
  _type: 'contactCallout',
  _key: k('sec'),
  heading: 'Questions About Communication Consent?',
  bodyText:
    "If you have questions about our communication practices, want to update your preferences, or need to opt out of communications, we're here to help.",
  buttons: [
    { _key: k('btn'), label: 'Email Support Team', href: 'mailto:help@heloc360.com', style: 'primary' },
    { _key: k('btn'), label: 'Call (313) 264-0470', href: 'tel:3132640470', style: 'outline' },
  ],
}

// --- 12. Effective-date footer (pageFooterNote) -----------------------------
const footerNote = {
  _type: 'pageFooterNote',
  _key: k('sec'),
  text:
    'This communication consent policy is effective as of the date of your use of our website. We may update this policy from time to time, and we will post any changes on this page.',
  showReturnHome: true,
}

// --- contentSection container (the body shell) ------------------------------
// Phase F / Wave 1: hosts every body fragment inside the legal pages' shell:
//   <section className="py-16"><div className="container mx-auto px-4">
//     <div className="max-w-4xl mx-auto">…</div></div></section>
// Source content wrapper is `max-w-4xl mx-auto` with NO prose (it's mostly
// cards), so useProse:false. Previously these fragments sat at the top level
// and rendered bare (full-bleed, no max-width/padding).
const bodyContainer = {
  _type: 'contentSection',
  _key: k('sec'),
  maxWidth: '4xl',
  paddingY: '16',
  useProse: false,
  content: [
    mainConsent,
    whatThisMeansHeading,
    whatThisMeansCards,
    yourChoice,
    typesHeading,
    typesCards,
    optOut,
    whoHeading,
    whoCards,
    contactSection,
    footerNote,
  ],
}

const doc = {
  // Dot-free _id: the dataset's anonymous read grant is `_id in path("*")`,
  // which only covers single-segment IDs. A dotted id is NOT publicly readable,
  // so the token-less frontend client would 404. Hyphenated ids render public
  // like blog posts.
  _id: 'page-communication-consent',
  _type: 'page',
  title: 'Communication Consent',
  // Temporary slug so it does not collide with the live hardcoded
  // /communication-consent route.
  slug: { _type: 'slug', current: 'communication-consent-sanity' },
  sections: [headerSection, bodyContainer],
  seoTitle: 'Communication Consent - HELOC360',
  seoDescription:
    'Understand how HELOC360 communicates with you, including phone calls and text messages. Learn about your consent options and communication preferences.',
  canonicalUrl: 'https://heloc360.com/communication-consent',
  noindex: false,
}

const res = await client.createOrReplace(doc)
console.log('Seeded page doc:', res._id, '→ slug', res.slug?.current)
