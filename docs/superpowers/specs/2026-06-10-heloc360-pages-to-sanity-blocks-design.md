# HELOC360 — Phase F: Hardcoded Pages → Sanity Blocks (Pixel-Perfect)

**Date:** 2026-06-10
**Status:** Design approved (verbal), pending written-spec review
**Depends on:** Phase E foundation (the `page` document, `<SectionRenderer>`, 6 section block types, and the `app/(site)/[...slug]` catch-all route) — all present on branch `sanity-migration`.

---

## 1. Goal

Convert every hardcoded page on HELOC360 into a Sanity `page` document rendered entirely from blocks, so that **nothing is hardcoded in the frontend** (master rule: every page content-managed as editable Gutenberg-like blocks). The converted pages must be **pixel-perfect** reproductions of the current pages — visually identical, byte-for-byte where achievable — differing only in that their content now flows from Sanity instead of being inlined in JSX.

This is explicitly the follow-up to Phase E, which built the page-builder scaffolding but deliberately converted zero pages.

## 2. Scope

**In scope — the 12 hardcoded route pages** under `app/(site)`:

| Tier | Pages | Lines | Nature |
|---|---|---|---|
| A — Legal/text | `privacy`, `terms`, `communication-consent`, `affiliate-disclosure` | 526 / 483 / 287 / 280 | Long-form prose |
| B — Marketing | `about`, `heloc-101` | 702 / 852 | Hero, sections, CTAs, FAQ |
| C — Homepage | `/` (`page.tsx`) | 524 | Bespoke hero-with-form, sticky CTA, home-faq |
| D — Interactive | `calculators/home-equity-estimator`, `calculators/debt-consolidation`, `pre-qual`, `contact` | 116 / 109 / 38 / 29 | Live React logic / forms |

**Already dynamic (not in scope):** `blog`, `blog/[slug]`, `blog/page/[page]`, `meet-our-team/[slug]` — these already render from Sanity (Phases A–D).

**Out of scope:** redesigning any page; the live-domain cutover of `heloc360.com` (a separate, owner-controlled step — `heloc360.com` is on the `v0-heloc360-redesign` Vercel project, not the `heloc360` staging project this work deploys to).

## 3. Pixel-Perfect Method

For each page:

1. **Port the markup verbatim.** Lift the existing JSX and its exact Tailwind classes out of the route file and into the block's React renderer component. We do not redesign or "improve" markup — same markup in, same pixels out.
2. **Externalize the content.** The page's current text, headings, links, and images become the block's Sanity field values, populated from what is on the page today.
3. **Decompose into blocks at natural section boundaries.** Each visually distinct section of a page becomes one block instance. Sections that repeat across pages (CTA, FAQ, legal disclaimers) become **reusable** block types; sections unique to one page become **bespoke** block types used only there.

The result is a `page` document whose ordered `sections[]` array, when run through `<SectionRenderer>`, emits the identical DOM + classes the hardcoded page emits today.

## 4. Verification Gate (per page — this is the safety mechanism)

A page does **not** cut over until it passes:

1. **Visual diff.** Screenshot the current hardcoded page and the new Sanity-rendered page at desktop **and** mobile widths; compare. The diff must be clean (allowing only sub-pixel font-rendering noise). Captured via the Playwright MCP browser against the `heloc360.vercel.app` staging deploy (Sanity render) vs. the current hardcoded route.
2. **SEO/metadata parity.** `<title>`, meta description, and canonical URL produced by `generateMetadata` from the page doc's SEO fields must match the current hardcoded `metadata` export.
3. **Build green.** `npm run build` succeeds; no console errors on the rendered page.

Only after all three pass do we perform the route cutover (Section 5). All verification happens on the safe staging project; the live `heloc360.com` is never touched during the build.

## 5. Routing Cutover (per page)

Next.js resolves a concrete route (e.g. `app/(site)/privacy/page.tsx`) ahead of the catch-all `app/(site)/[...slug]/page.tsx`. So while a hardcoded route file exists, it wins and the Sanity version is shadowed. Cutover for a page is therefore:

1. Author the `page` document in Sanity at a **temporary preview slug** (e.g. `privacy-sanity`) so it is reachable through the catch-all without being shadowed by the still-present hardcoded route.
2. Verify on staging by screenshot-diffing the preview URL (`/privacy-sanity`, the Sanity render) against the current hardcoded `/privacy`, plus the SEO/metadata parity check (Section 4).
3. Pass the verification gate (Section 4).
4. **Cut over atomically:** change the doc's slug from `privacy-sanity` → `privacy`, and **delete the hardcoded route file** (`git rm app/(site)/privacy/page.tsx`) in the same deploy. Now `[...slug]` serves `/privacy` from Sanity.
5. Metadata flows from the doc's SEO fields via the existing `generateMetadata` in the catch-all route. Re-confirm `/privacy` post-cutover.

**Homepage special case (Wave 3):** the index path `/` is served by `app/(site)/page.tsx` and a **non-optional** `[...slug]` cannot match `/`. Options, decided in Wave 3: (a) convert `[...slug]` → optional `[[...slug]]` so it matches `/` and maps `[]`→`home` (the catch-all already maps `home`→`[]` in `generateStaticParams`, anticipating this); or (b) keep a thin `app/(site)/page.tsx` that fetches the `home` page doc and renders `<SectionRenderer>`. Approach (a) is preferred for full "nothing hardcoded" consistency; (b) is the low-risk fallback. Resolve during Wave 3 design.

## 6. Block Taxonomy

**Existing (Phase E), reused as-is or extended to match real markup:** `heroSection`, `richTextSection`, `ctaSection`, `featureGridSection`, `faqSection`, `imageWithTextSection`.

**New block types, added as waves require them:**

- **`htmlEmbed`** — a raw HTML snippet field rendered into the page. Backs the Tier D calculators (paste the Mortgage Mate embed snippet — iframe or script — directly), and any future third-party embed. Rendered via `dangerouslySetInnerHTML`. **Security note:** snippets are authored only by trusted Studio editors; we accept raw HTML on that basis (document the trust assumption). Consider a server-side sanitization pass only if untrusted editors are ever added.
- **Bespoke per-page blocks** — created only where a page section is genuinely one-of-a-kind (e.g. homepage hero-with-lead-form). Named for their page + purpose.
- **Likely reusable additions** (confirm when first needed, don't pre-build — YAGNI): a legal/disclaimer rich-text block variant, a stats/figures strip, a steps/process block, a testimonial block, and a **component-embed** block for forms (Section 7).

Each new type: define the schema (`sanity/schemas/sections/<name>.ts`), register it in `sanity/schemas/index.ts` and in the `page.sections` array, build its renderer (`components/sections/<name>-section.tsx`), and add a `case` to `<SectionRenderer>` + the `Section` union type.

## 7. Interactive Pages (Tier D)

- **Calculators** → `htmlEmbed` block carrying the **Mortgage Mate** snippet. The current React calculator widgets (`components/calculators/*`) are retired once their Mortgage Mate equivalents render. (Embed mechanism — iframe vs script — is not yet finalized by Mortgage Mate; the raw-HTML block is deliberately agnostic so the decision can be deferred.)
- **Forms** (`pre-qual`, `contact`) carry lead-capture and tracking logic that must remain code. Modeled as a **component-embed** block: a block whose schema selects which internal form component to mount (by a known key), with editable surrounding copy/order in Sanity. This keeps the page fully block-managed while the form's logic + tracking stay intact. (Alternative, if these move to Mortgage Mate later: use `htmlEmbed` instead.) Finalized in Wave 4.

## 8. Decomposition Into Waves

Each wave is its own spec→plan→subagent-driven build, and every page within it passes the Section 4 gate before cutover.

- **Wave 0 — Pilot: `privacy`.** Proves the entire pipeline end-to-end on the lowest-risk page: author the doc, build/extend the rich-text (legal) block to match the page's exact markup, render on staging, run the screenshot-diff + SEO parity check, cut over the route. Establishes the reusable screenshot-diff harness and the route-cutover pattern that every later wave reuses.
- **Wave 1 — Remaining legal:** `terms`, `communication-consent`, `affiliate-disclosure`. Mostly the same legal block as the pilot; high reuse, low risk.
- **Wave 2 — Marketing:** `about`, `heloc-101`. Exercises hero/featureGrid/cta/faq/imageWithText and adds reusable blocks as their sections demand.
- **Wave 3 — Homepage:** `/`. Bespoke hero-with-lead-form, sticky CTA, home-faq; resolve the `/` routing question (Section 5).
- **Wave 4 — Interactive:** calculators (via `htmlEmbed`/Mortgage Mate) and forms (via component-embed). Retire the old React calculator widgets.

## 9. Wave 0 Pilot — Detailed Spec

**Target:** `app/(site)/privacy/page.tsx` (526 lines) → a `page` document with slug `privacy`.

1. **Audit the page.** Read `privacy/page.tsx`; catalog its wrapper layout (container/prose classes), heading hierarchy, body copy, and its `metadata` export (title/description/canonical).
2. **Block choice.** A privacy policy is one long structured prose section. Either (a) the existing `richTextSection` if its renderer already reproduces the page's exact wrapper + typography, or (b) a bespoke **`legalSection`** block that ports the privacy page's exact wrapper markup + a Portable Text body. Decide by comparing the current markup to `rich-text-section.tsx`; prefer extending `richTextSection` if the gap is small, else add `legalSection`. The page's heading/paragraph content is converted to Portable Text and stored in the field.
3. **Author the document.** Create the `privacy` page doc (programmatically via the Sanity write client or a seed script, so it is reproducible) with the SEO fields populated from the current `metadata` export.
4. **Render + verify on staging.** Deploy to `heloc360.vercel.app`; screenshot-diff the Sanity render vs. the current hardcoded `/privacy` (desktop + mobile); confirm `<title>`/description/canonical parity; build green.
5. **Cut over.** `git rm app/(site)/privacy/page.tsx`; redeploy; confirm `/privacy` now serves from Sanity and still matches.
6. **Document** the screenshot-diff harness + cutover steps in the wave's plan so Waves 1–4 reuse them verbatim.

**Acceptance:** `/privacy` renders from a Sanity `page` document, is visually indistinguishable from the pre-conversion page at desktop and mobile, preserves its SEO metadata and canonical, the hardcoded route file is gone, and the build is green.

## 10. Risks & Mitigations

- **Visual regressions.** Mitigated by the mandatory per-page screenshot-diff gate before cutover, and by porting markup verbatim rather than rebuilding.
- **`ignoreBuildErrors`/`ignoreDuringBuilds` mask type/lint errors.** The build passing is necessary but not sufficient; rely on the rendered-page + screenshot checks, not just a green build.
- **Homepage `/` routing.** Isolated to Wave 3 with a documented fallback (thin root page).
- **Raw HTML embed (XSS).** Accepted under the trusted-editor assumption; documented. Revisit if untrusted editors are added.
- **Tracking/lead logic in forms.** Preserved by mounting the existing React components via the component-embed block rather than reimplementing.
- **Live domain.** Untouched — all work is on the `heloc360` staging project; `heloc360.com` cutover is a separate owner-controlled step.

## 11. What Ships at the End of Phase F

All 12 hardcoded pages removed from `app/(site)` (except whatever thin homepage shim Wave 3 may keep) and served as Sanity `page` documents; the block taxonomy grown to cover every real section; the old React calculator widgets retired; a documented, repeatable pixel-perfect-conversion + screenshot-diff + route-cutover pipeline. The site is then fully content-managed: nothing hardcoded.
