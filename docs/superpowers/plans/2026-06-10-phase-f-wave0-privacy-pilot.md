# Phase F · Wave 0 — Privacy Page Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the hardcoded `/privacy` page into a Sanity `page` document rendered from blocks, pixel-perfect to the current page, and prove the full conversion pipeline (block build → seed doc → visual verify → route cutover) that all later Phase F waves reuse.

**Architecture:** Two new bespoke-but-reusable "legal" section blocks (`legalHeader`, `legalProse`) port the privacy page's exact markup + Tailwind classes. A seed script authors the `privacy` page document (content ported verbatim) via the Sanity write client at a temporary preview slug. We verify pixel parity locally (current hardcoded `/privacy` vs. the Sanity render), then cut over by renaming the slug to `privacy` and deleting the hardcoded route so the existing `[...slug]` catch-all serves it.

**Tech Stack:** Next.js 15.4 App Router, TypeScript, Tailwind v3, Sanity v3, `@portabletext/react`, `@sanity/client`. No unit-test runner exists in this repo — verification is `npm run build`, on-page render, and screenshot comparison (the established pattern from Phases A–E).

**Branch:** Work on `sanity-migration` (the Phase E/F base; the page-builder foundation lives only here, not on `main`). Confirm with `git branch --show-current`.

**Reference (authoritative content source):** `app/(site)/privacy/page.tsx` is the exact source of truth for all copy, headings, lists, links, the contact callout, and the footer. "Port verbatim" below means copy that file's text/structure exactly.

---

## File Structure

- **Create** `sanity/schemas/sections/legalHeader.ts` — schema: gradient banner (`heading`, `subheading`).
- **Create** `sanity/schemas/sections/legalProse.ts` — schema: prose body (`body` Portable Text) + optional `contactCallout` object + optional `footer` object.
- **Create** `components/sections/legal-portable-text.tsx` — PortableText serializers with the legal page's exact element classes.
- **Create** `components/sections/legal-header-section.tsx` — renderer for `legalHeader`.
- **Create** `components/sections/legal-prose-section.tsx` — renderer for `legalProse` (body + callout + footer).
- **Modify** `sanity/schemas/index.ts` — import + register `legalHeader`, `legalProse`.
- **Modify** `sanity/schemas/page.ts` — add both to the `sections` array `of: [...]`.
- **Modify** `components/sections/section-renderer.tsx` — add both to the `Section` union + `switch`.
- **Create** `scripts/seed/privacy-page.mjs` — idempotent seed of the `privacy` page doc.
- **Delete (at cutover)** `app/(site)/privacy/page.tsx`.

---

## Task 1: Legal block schemas + registration

**Files:**
- Create: `sanity/schemas/sections/legalHeader.ts`
- Create: `sanity/schemas/sections/legalProse.ts`
- Modify: `sanity/schemas/index.ts`
- Modify: `sanity/schemas/page.ts`

- [ ] **Step 1: Create `legalHeader.ts`**

```ts
import { defineType, defineField } from 'sanity'

export const legalHeader = defineType({
  name: 'legalHeader',
  title: 'Legal header (gradient banner)',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'subheading' },
    prepare({ title, subtitle }) {
      return { title: `Legal header: ${title || '(none)'}`, subtitle }
    },
  },
})
```

- [ ] **Step 2: Create `legalProse.ts`**

```ts
import { defineType, defineField, defineArrayMember } from 'sanity'

export const legalProse = defineType({
  name: 'legalProse',
  title: 'Legal prose (body)',
  type: 'object',
  fields: [
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
          ],
          lists: [{ title: 'Bullet', value: 'bullet' }],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
            ],
          },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: 'contactCallout',
      title: 'Contact callout (optional)',
      type: 'object',
      fields: [
        { name: 'heading', type: 'string', title: 'Heading' },
        { name: 'bodyText', type: 'text', rows: 2, title: 'Body text' },
        { name: 'emailLabel', type: 'string', title: 'Email button label' },
        { name: 'emailHref', type: 'string', title: 'Email href (mailto:…)' },
        { name: 'phoneLabel', type: 'string', title: 'Phone button label' },
        { name: 'phoneHref', type: 'string', title: 'Phone href (tel:…)' },
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Footer (optional)',
      type: 'object',
      fields: [
        { name: 'text', type: 'text', rows: 2, title: 'Effective-date text' },
        { name: 'showReturnHome', type: 'boolean', title: 'Show "Return to Home" link', initialValue: true },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Legal prose body' }
    },
  },
})
```

- [ ] **Step 3: Register both in `sanity/schemas/index.ts`**

Add these imports after the existing section imports:

```ts
import { legalHeader } from './sections/legalHeader'
import { legalProse } from './sections/legalProse'
```

Add `legalHeader` and `legalProse` to the `schemaTypes` array, in the "Section objects" group (after `imageWithTextSection`):

```ts
  // Section objects
  heroSection,
  richTextSection,
  ctaSection,
  featureGridSection,
  faqSection,
  imageWithTextSection,
  legalHeader,
  legalProse,
```

- [ ] **Step 4: Add both to the `page.sections` array in `sanity/schemas/page.ts`**

In the `sections` field's `of: [...]`, append:

```ts
        defineArrayMember({ type: 'legalHeader' }),
        defineArrayMember({ type: 'legalProse' }),
```

- [ ] **Step 5: Typecheck the schema additions**

Run: `cd /Volumes/ExternalSSD/Sites/nextjs-heloc360 && npx tsc --noEmit 2>&1 | grep -E "schemas/(sections/legal|index|page)" || echo "no new errors in touched schema files"`
Expected: `no new errors in touched schema files` (the repo has ~45 pre-existing unrelated tsc errors; only care that the files we touched are clean).

- [ ] **Step 6: Commit**

```bash
git add sanity/schemas/sections/legalHeader.ts sanity/schemas/sections/legalProse.ts sanity/schemas/index.ts sanity/schemas/page.ts
git commit -m "feat(sanity): legalHeader + legalProse section schemas (Phase F pilot)"
```

---

## Task 2: Legal renderers + SectionRenderer wiring

**Files:**
- Create: `components/sections/legal-portable-text.tsx`
- Create: `components/sections/legal-header-section.tsx`
- Create: `components/sections/legal-prose-section.tsx`
- Modify: `components/sections/section-renderer.tsx`

The exact classes below are lifted verbatim from `app/(site)/privacy/page.tsx`. Do not alter them.

- [ ] **Step 1: Create `legal-portable-text.tsx`** (serializers matching the legal page's typography)

```tsx
import { PortableText as BasePortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-lg leading-relaxed mb-6">{children}</p>,
    h2: ({ children }) => <h2 className="text-2xl font-bold text-[#1b75bc] mb-6">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-8 space-y-2">{children}</ul>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => {
      const href = (value as { href?: string })?.href || '#'
      const external = href.startsWith('http')
      return external ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="text-[#1b75bc] hover:text-[#007a5e] transition-colors"
        >
          {children}
        </a>
      ) : (
        <a href={href} className="text-[#1b75bc] hover:text-[#007a5e] transition-colors">
          {children}
        </a>
      )
    },
  },
}

export function LegalPortableText({ value }: { value: PortableTextBlock[] }) {
  return <BasePortableText value={value} components={components} />
}
```

- [ ] **Step 2: Create `legal-header-section.tsx`**

```tsx
export type LegalHeaderValue = {
  _type: 'legalHeader'
  _key: string
  heading: string
  subheading?: string
}

export function LegalHeaderSection({ value }: { value: LegalHeaderValue }) {
  return (
    <section className="bg-gradient-to-r from-[#1b75bc] to-[#007a5e] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{value.heading}</h1>
          {value.subheading && <p className="text-lg opacity-90">{value.subheading}</p>}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create `legal-prose-section.tsx`**

```tsx
import Link from 'next/link'
import type { PortableTextBlock } from '@portabletext/types'
import { LegalPortableText } from './legal-portable-text'

export type LegalProseValue = {
  _type: 'legalProse'
  _key: string
  body: PortableTextBlock[]
  contactCallout?: {
    heading?: string
    bodyText?: string
    emailLabel?: string
    emailHref?: string
    phoneLabel?: string
    phoneHref?: string
  } | null
  footer?: {
    text?: string
    showReturnHome?: boolean
  } | null
}

export function LegalProseSection({ value }: { value: LegalProseValue }) {
  const cc = value.contactCallout
  const footer = value.footer
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto prose prose-lg prose-gray">
          <LegalPortableText value={value.body} />

          {cc && (cc.heading || cc.bodyText || cc.emailHref || cc.phoneHref) && (
            <div className="bg-gradient-to-r from-[#1b75bc]/10 to-[#007a5e]/10 p-8 rounded-lg mt-12">
              {cc.heading && <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">{cc.heading}</h3>}
              {cc.bodyText && <p className="text-lg leading-relaxed mb-4">{cc.bodyText}</p>}
              <div className="flex flex-col sm:flex-row gap-4">
                {cc.emailHref && cc.emailLabel && (
                  <a
                    href={cc.emailHref}
                    className="inline-flex items-center justify-center px-6 py-3 bg-[#1b75bc] hover:bg-[#1b75bc]/90 text-white font-medium rounded-lg transition-colors"
                  >
                    {cc.emailLabel}
                  </a>
                )}
                {cc.phoneHref && cc.phoneLabel && (
                  <a
                    href={cc.phoneHref}
                    className="inline-flex items-center justify-center px-6 py-3 border border-[#1b75bc] text-[#1b75bc] hover:bg-[#1b75bc] hover:text-white font-medium rounded-lg transition-colors"
                  >
                    {cc.phoneLabel}
                  </a>
                )}
              </div>
            </div>
          )}

          {footer && (footer.text || footer.showReturnHome) && (
            <div className="text-center mt-12 pt-8 border-t border-gray-200">
              {footer.text && <p className="text-sm text-gray-600">{footer.text}</p>}
              {footer.showReturnHome && (
                <p className="text-sm text-gray-600 mt-2">
                  <Link href="/" className="text-[#1b75bc] hover:text-[#007a5e] transition-colors">
                    Return to Home
                  </Link>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Wire both into `components/sections/section-renderer.tsx`**

Add imports after the existing section imports:

```tsx
import { LegalHeaderSection, type LegalHeaderValue } from './legal-header-section'
import { LegalProseSection, type LegalProseValue } from './legal-prose-section'
```

Add to the `Section` union:

```tsx
  | LegalHeaderValue
  | LegalProseValue
```

Add cases before `default:` in the `switch`:

```tsx
          case 'legalHeader':
            return <LegalHeaderSection key={section._key} value={section} />
          case 'legalProse':
            return <LegalProseSection key={section._key} value={section} />
```

- [ ] **Step 5: Build to confirm the renderers compile**

Run: `cd /Volumes/ExternalSSD/Sites/nextjs-heloc360 && npm run build 2>&1 | tail -5`
Expected: build completes (`Compiled successfully` / route table printed, no error exit). Do **not** run this while a `npm run dev` is alive (it corrupts the dev `.next` chunk map — kill dev first).

- [ ] **Step 6: Commit**

```bash
git add components/sections/legal-portable-text.tsx components/sections/legal-header-section.tsx components/sections/legal-prose-section.tsx components/sections/section-renderer.tsx
git commit -m "feat(sanity): legal header + prose renderers wired into SectionRenderer"
```

---

## Task 3: Seed the privacy page document (temp preview slug)

**Files:**
- Create: `scripts/seed/privacy-page.mjs`

The seed script authors a published `page` doc with a fixed `_id` (`page.privacy`) so re-runs are idempotent. It reads the write token from `.env.local` (var `SANITY_API_WRITE_TOKEN`). The slug starts as `privacy-sanity` so the existing hardcoded `/privacy` route is not yet shadowed and both can be compared.

- [ ] **Step 1: Create `scripts/seed/privacy-page.mjs`**

```js
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

// --- Portable Text body, ported VERBATIM from app/(site)/privacy/page.tsx ---
// Encoding patterns (use these for every element in the source page, in order):
//   paragraph:  { _type:'block', _key:k('b'), style:'normal', markDefs:[], children:[{ _type:'span', _key:k('s'), text:'…', marks:[] }] }
//   h2:         { ...same…, style:'h2' }
//   h3:         { ...same…, style:'h3' }
//   bullet item:{ _type:'block', _key:k('b'), style:'normal', listItem:'bullet', level:1, markDefs:[], children:[{ _type:'span', _key:k('s'), text:'…', marks:[] }] }
//   inline link:{ _type:'block', ..., markDefs:[{ _key:'l0', _type:'link', href:'https://…' }],
//                 children:[ {span text before}, { _type:'span', text:'My Perfect Leads, LLC', marks:['l0'] }, {span text after} ] }
const body = [
  // FIRST paragraph (exact text from the source, including the inline external link to My Perfect Leads):
  {
    _type: 'block', _key: k('b'), style: 'normal',
    markDefs: [{ _key: 'l0', _type: 'link', href: 'https://myperfectleads.com/' }],
    children: [
      { _type: 'span', _key: k('s'), text: 'heloc360.com is a mortgage research and education website provided by ', marks: [] },
      { _type: 'span', _key: k('s'), text: 'My Perfect Leads, LLC', marks: ['l0'] },
      { _type: 'span', _key: k('s'), text: '. At My Perfect Leads, we have dedicated ourselves to making the home loan process as convenient as possible while helping individuals use their home financing options as a tool to manage their financial lives. In that effort, we respect and protect the privacy of those who visit or use our website. When we collect information from you, we want you to know how it is used. To demonstrate our commitment to fair information practices, we have adopted leading industry privacy guidelines.', marks: [] },
    ],
  },
  // PORT THE REMAINDER: every <p>, <h2>, <h3>, and <ul><li> in app/(site)/privacy/page.tsx,
  // in source order, using the patterns above. Do NOT include the contact-callout box or the
  // "Last Updated" footer here — those are separate fields below.
]

const doc = {
  _id: 'page.privacy',
  _type: 'page',
  title: 'Privacy Policy',
  slug: { _type: 'slug', current: 'privacy-sanity' }, // temp preview slug; renamed to 'privacy' at cutover
  sections: [
    {
      _type: 'legalHeader', _key: k('sec'),
      heading: 'Your Security, Our Priority Understanding Our Policies',
      subheading: 'We respect and protect the privacy of those who visit or use our website',
    },
    {
      _type: 'legalProse', _key: k('sec'),
      body,
      contactCallout: {
        heading: 'Questions About This Policy?',
        bodyText:
          "If you have any questions about our privacy policy or how we handle your personal information, please don't hesitate to contact us.",
        emailLabel: 'Email Compliance Team',
        emailHref: 'mailto:compliance@heloc360.com',
        phoneLabel: 'Call (313) 264-0470',
        phoneHref: 'tel:3132640470',
      },
      footer: {
        text:
          'This privacy policy is effective as of the date of your use of our website. We may update this policy from time to time, and we will post any changes on this page.',
        showReturnHome: true,
      },
    },
  ],
  seoTitle: 'Privacy Policy - HELOC360',
  seoDescription:
    'Learn how HELOC360 protects your privacy and personal information. Our comprehensive privacy policy outlines our data collection, usage, and security practices.',
  canonicalUrl: 'https://heloc360.com/privacy',
  noindex: false,
}

const res = await client.createOrReplace(doc)
console.log('Seeded page doc:', res._id, '→ slug', res.slug?.current)
```

- [ ] **Step 2: Port the full body**

Open `app/(site)/privacy/page.tsx` and transcribe every remaining `<p>`, `<h2>`, `<h3>`, and bullet `<li>` (in source order, lines ~54–484) into the `body` array using the documented patterns. Preserve text exactly, including punctuation. The contact callout and footer are already represented as fields — do not duplicate them in `body`.

- [ ] **Step 3: Run the seed**

Run: `cd /Volumes/ExternalSSD/Sites/nextjs-heloc360 && node --env-file=.env.local scripts/seed/privacy-page.mjs`
Expected: `Seeded page doc: page.privacy → slug privacy-sanity`. (Node ≥20 supports `--env-file`. If the token is missing/invalid you'll get a 401 from Sanity — confirm `SANITY_API_WRITE_TOKEN` is set in `.env.local`.)

- [ ] **Step 4: Verify the doc exists via the read API**

Run: `cd /Volumes/ExternalSSD/Sites/nextjs-heloc360 && node --env-file=.env.local -e "import('@sanity/client').then(async ({createClient})=>{const c=createClient({projectId:'2a445j5i',dataset:'production',apiVersion:'2024-12-01',useCdn:false});const d=await c.fetch('*[_id==\"page.privacy\"][0]{title,\"slug\":slug.current,\"sections\":count(sections)}');console.log(d)})"`
Expected: `{ title: 'Privacy Policy', slug: 'privacy-sanity', sections: 2 }`.

- [ ] **Step 5: Commit the seed script**

```bash
git add scripts/seed/privacy-page.mjs
git commit -m "chore(seed): privacy page document seed (temp slug privacy-sanity)"
```

---

## Task 4: Local pixel-parity verification + tuning loop

**Files:** none created; this task tunes the renderers/serializers from Task 2 if the diff is not clean.

Verify locally (no deploy needed): the dev server reads the production Sanity dataset via the public client, so the seeded doc renders at `/privacy-sanity`, and the current hardcoded page is still at `/privacy`.

- [ ] **Step 1: Start the dev server**

Run (background): `cd /Volumes/ExternalSSD/Sites/nextjs-heloc360 && npm run dev`
Wait for `Ready` on `http://localhost:3000`. Do not run `npm run build` while this is alive.

- [ ] **Step 2: Screenshot both pages at desktop width**

Using the Playwright MCP browser: navigate to `http://localhost:3000/privacy`, set viewport 1280×900, capture a full-page screenshot (label `privacy-current-desktop`). Then navigate to `http://localhost:3000/privacy-sanity`, same viewport, full-page screenshot (label `privacy-sanity-desktop`).

- [ ] **Step 3: Screenshot both pages at mobile width**

Repeat at viewport 390×844: `privacy-current-mobile` and `privacy-sanity-mobile`.

- [ ] **Step 4: Compare and judge**

View the screenshot pairs side by side. They must be visually indistinguishable (header gradient + text, all body paragraphs/headings/lists, the inline My Perfect Leads link, the contact callout box with both buttons, the footer). Allowed difference: none of substance — only sub-pixel font antialiasing.

- [ ] **Step 5: Tune until clean**

If anything differs (spacing, color, a missing/extra paragraph, wrong heading weight), fix the cause and re-screenshot:
- Missing/extra/:reordered text → fix the `body` array in `scripts/seed/privacy-page.mjs`, re-run the seed (Task 3 Step 3), reload.
- Wrong element styling → fix the class in `legal-portable-text.tsx` / `legal-prose-section.tsx` / `legal-header-section.tsx` to match `app/(site)/privacy/page.tsx` exactly.
Repeat Steps 2–4 until both viewports are clean. Note: the source page applies `mb-8` to a few paragraphs and `mb-6` to most; the serializer uses `mb-6` uniformly. If the diff shows a material gap from this, report it as DONE_WITH_CONCERNS rather than over-engineering per-paragraph spacing — Robert reviews the final diff.

- [ ] **Step 6: Stop the dev server** (so later `npm run build` is safe). Commit any renderer/seed tuning.

```bash
git add -A
git commit -m "fix(sanity): tune legal renderers to pixel-match /privacy" || echo "nothing to tune — already matched"
```

---

## Task 5: Cutover — swap slug, delete hardcoded route, deploy, re-verify

**Files:**
- Modify: `scripts/seed/privacy-page.mjs` (slug → `privacy`)
- Delete: `app/(site)/privacy/page.tsx`

- [ ] **Step 1: Point the doc at the real slug**

In `scripts/seed/privacy-page.mjs`, change `current: 'privacy-sanity'` to `current: 'privacy'`. Re-run the seed:
Run: `cd /Volumes/ExternalSSD/Sites/nextjs-heloc360 && node --env-file=.env.local scripts/seed/privacy-page.mjs`
Expected: `Seeded page doc: page.privacy → slug privacy`.

- [ ] **Step 2: Delete the hardcoded route**

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
git rm "app/(site)/privacy/page.tsx"
```

- [ ] **Step 3: Build to confirm `/privacy` now resolves via the catch-all**

Run: `cd /Volumes/ExternalSSD/Sites/nextjs-heloc360 && rm -rf .next && npm run build 2>&1 | grep -E "/privacy|Compiled|error" | head`
Expected: build succeeds; `/privacy` no longer appears as its own static route (it is now served by `/[...slug]`). No build error.

- [ ] **Step 4: Commit the cutover**

```bash
git add -A
git commit -m "feat(sanity): cut /privacy over to Sanity page document (Phase F Wave 0)"
```

- [ ] **Step 5: Deploy to staging (Robert-gated)**

This step runs `vercel --prod` on the `heloc360` staging project and requires Robert's authorization (the controller requests it; do not bypass). After deploy:
Run: `curl -s -o /dev/null -w "%{http_code}\n" https://heloc360.vercel.app/privacy` → expect `200`.
Run: `curl -s https://heloc360.vercel.app/privacy | grep -oE "from-\[#1b75bc\]|Email Compliance Team" | head` → expect the gradient class and callout button text present (confirming the Sanity render is live).

- [ ] **Step 6: Final staging visual re-check**

Screenshot `https://heloc360.vercel.app/privacy` (desktop + mobile) and confirm it matches the pre-cutover page. Confirm `<title>` = `Privacy Policy - HELOC360` and the canonical is `https://heloc360.com/privacy` (`curl -s https://heloc360.vercel.app/privacy | grep -oE '<title>[^<]+</title>|rel="canonical" href="[^"]+"'`).

---

## Acceptance Criteria

- `/privacy` renders from the Sanity `page` document (`_id: page.privacy`, slug `privacy`) via the `[...slug]` catch-all.
- Visually indistinguishable from the pre-conversion page at desktop and mobile (header, body, inline link, contact callout, footer).
- SEO `<title>`, meta description, and canonical (`https://heloc360.com/privacy`) preserved.
- Hardcoded `app/(site)/privacy/page.tsx` deleted; `npm run build` green.
- The `legalHeader` + `legalProse` blocks and the seed/cutover pattern are reusable by Wave 1 (the other three legal pages).

## Notes for Later Waves (not in scope here)

- Wave 1 reuses `legalHeader` + `legalProse` for `terms`, `communication-consent`, `affiliate-disclosure` — likely only new seed scripts + content, no new blocks.
- The seed-script + temp-slug + visual-diff + route-delete pattern established here is the template for every later page.
