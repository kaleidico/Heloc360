# HELOC360 — Repositioning & Redesign Design Spec

**Date:** 2026-05-27
**Status:** Draft — pending user review
**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind v3 · React 18
**Repo:** `nextjs-heloc360` · remote `git@github.com:kaleidico/Heloc360.git`

---

## 1. Overview & strategic position

HELOC360 is repositioning from a generic HELOC-matching service into **a vertical-by-vertical educator-advisor marketplace**. The site stops competing with LendingTree/Bankrate on rate-table breadth and starts competing on use-case specialization and educator voice.

| Layer | Position |
|---|---|
| Strategic | Vertical use-case marketplace (5 verticals) |
| Brand voice | Educator-advisor — *"The HELOC advisor, not the HELOC salesman."* |
| Homepage pattern | Hybrid hero — use-case pills + universal borrowing-power calculator |
| Conversion pattern | Calculator-as-form, progressive disclosure, single CTA per page |

**Why this combination:** LendingTree/Bankrate cannot adopt educator voice without burning their rate-marketplace brand. Figure/Aven cannot adopt multi-lender match without becoming a marketplace themselves. Vertical specialization compounds CPL efficiency on paid channels and lets each spoke own its own SEO cluster.

---

## 2. Goals & success metrics

**Primary goal:** Increase qualified HELOC lead volume from the site.

**Secondary goals:**
- Lower blended cost-per-lead on paid channels (via better post-click conversion + use-case Quality Score gains)
- Build organic traffic foundation across 5 vertical content clusters
- Establish measurable lead funnel from day one of relaunch

**Success metrics (Phase 1 baseline → tracked thereafter):**
- Funnel step conversion: `pageview → pill_click → calc_start → calc_complete → email_capture → lender_match`
- Lead value per source/medium
- Pages-per-session and time-to-first-key-event by source
- Organic impressions/clicks per spoke (Search Console)

There is no historical baseline — GA4 currently has no useful data. Phase 1 deliverables include re-instrumentation so the first 30 days post-relaunch establish the measurement floor.

---

## 3. Non-goals

- Not becoming a direct lender. Routing stays through the existing lender network.
- Not maintaining the external `get-started.heloc360.com` subdomain. The on-domain calculator-as-form replaces it.
- Not preserving the 9-step monolithic form (`app/mortgage-application`). Field-level logic salvaged; UX retired.
- Not building investor/broker B2B funnels in this scope. "Broker" borrower type is dropped from the site.
- Not changing the lender network commercial structure in this scope.

---

## 4. Information architecture

```
heloc360.com/                              brand hub + universal calculator
├── /debt-consolidation                    PHASE 1
│   ├── /calculator
│   ├── /vs-personal-loan
│   ├── /vs-balance-transfer
│   ├── /credit-card-payoff
│   ├── /medical-debt
│   └── /[state]                           PHASE 3 (programmatic)
├── /home-renovation                       PHASE 1
│   ├── /calculator
│   ├── /vs-cash-out-refi
│   ├── /kitchen-remodel
│   ├── /adu-construction
│   ├── /roi-by-project
│   └── /[state]                           PHASE 3 (programmatic)
├── /retirement-equity                     PHASE 2
│   ├── /calculator
│   ├── /vs-reverse-mortgage
│   ├── /aging-in-place-remodel
│   └── /social-security-bridge
├── /heloc-101                             PHASE 2 (revamp existing)
│   ├── /how-it-works
│   ├── /draw-period-explained
│   ├── /qualification-requirements
│   ├── /rate-types
│   └── /heloc-vs-[X]                      (comparison cluster)
├── /self-employed-heloc                   PHASE 3
│   ├── /calculator
│   ├── /bank-statement-loans
│   └── /1099-borrowers
├── /calculators                           hub of all calculators
├── /rates                                 PHASE 2 (today's HELOC rates widget)
├── /blog                                  keep — retag content into spokes
├── /meet-our-team                         keep — refresh
└── /about, /contact, /privacy, /terms, /affiliate-disclosure, /communication-consent
```

**Routing rules:**
- The 5 hero pills route to `/debt-consolidation`, `/home-renovation`, `/retirement-equity`, `/heloc-101` (first-time tappers entry), and `/self-employed-heloc` respectively. Pre-tag URL params so the calculator on the spoke knows its context.
- Every calculator lives at `/[spoke]/calculator` and is also linked from `/calculators`.
- Sitemap routes (`sitemap.ts`, `sitemap-blog-pagination.xml`, `sitemap-posts.xml`, `sitemap-team.xml`) get expanded to include all new URLs.

---

## 5. Homepage design

**Pattern:** Hybrid hero. Use-case pills + universal borrowing-power calculator visible above the fold.

**Above the fold:**
- Eyebrow: `THE HELOC ADVISOR` (small caps, primary blue)
- H1: **What do you want to do with your home equity?**
- Subhead: *"Tell us your reason. We'll match you with vetted lenders who specialize in exactly that — and walk you through the trade-offs before you commit."*
- 5 use-case pills (single row on desktop, wraps on mobile):
  - 💳 Pay off debt → `/debt-consolidation`
  - 🔨 Renovate my home → `/home-renovation`
  - 🌅 Plan for retirement → `/retirement-equity`
  - 🏠 First time tapping equity → `/heloc-101`
  - 📊 I'm self-employed → `/self-employed-heloc`
- Divider line: `— or estimate your borrowing power —`
- Universal calculator widget (collapsed, 2 fields visible):
  - Home value
  - Mortgage balance
  - CTA: `See how much you can unlock →`
- Trust strip (single line, small): `4.8 average · 1,200+ reviews · NMLS-licensed lender network · Free advisor call`

**Below the fold (in order):**
1. "How it works" — 3-step educator framing (Tell us your reason → See your numbers → Get matched).
2. Advisor face strip — real photos linking to `/meet-our-team`.
3. Use-case detail cards — same 5, but expanded: 1-sentence problem + 1-sentence outcome + "Learn more →".
4. "How HELOC360 is different" — 3 bullets, advisor-voice differentiators (no fees, no obligation, real humans).
5. FAQ block — reuse `home-faq.tsx` component, content updated to advisor voice.
6. Footer (see §10).

**Removed from current homepage:**
- The mailing-list-form section as a primary CTA. (Mailing list moves to exit-intent + footer + post-end, with a lead magnet — see §8.)
- The external `https://get-started.heloc360.com/` CTA. (Calculator replaces it.)
- The "Benefits of HELOCs" generic icon grid. (Use-case cards now carry that job, in context.)

---

## 6. Spoke page template

One template, parameterized per vertical. Pattern lives at `app/[spoke]/page.tsx` (or per-route file).

**Above the fold:**
- Breadcrumb: `Home · Use cases · [Vertical name]`
- H1: Use-case-specific outcome (not feature). Examples:
  - `/debt-consolidation`: "Roll your high-interest debt into one lower-interest payment."
  - `/home-renovation`: "Fund your renovation without touching your low-rate mortgage."
  - `/retirement-equity`: "Turn your home into income — without selling it or signing a reverse mortgage."
- Subhead: 1-2 sentences, names the savings/outcome and previews the advisor framing.

**Body (two-column grid, desktop):**

| Left column (1.4fr — educator content) | Right column (1fr — sticky calculator-as-form) |
|---|---|
| **"How much could you save?"** — 1 paragraph explaining the math, invites use of the calc | Use-case-specific calculator. Inputs vary by spoke. |
| **"When [use case] makes sense"** — 3-4 bulleted criteria | Live calculation display ("You'd save $X" / "You could borrow $Y") |
| **"The N risks we'll talk you through"** — explicit risks named. This is the educator-voice differentiator. | Stage 3 contact capture appears in-place after value shown |
| **"Recently helped"** — one in-line testimonial tagged to this use case | "Get matched with a lender →" |
| **Related comparison links** — internal SEO crosslinks (`vs-personal-loan`, `vs-cash-out-refi`, etc.) | Disclosure: "No credit pull. We share your info only after you approve a lender." |

**Below the fold:**
- Expanded FAQ for this use case (5-8 Q&As, FAQPage schema).
- Lender network strip (logos / count / NMLS).
- Secondary CTA strip: "Prefer to talk? Schedule a 15-min advisor call →".

**Mobile:** Single column. Calculator sits below H1/subhead but above educator content (so it's reachable without scrolling past prose).

**Required content blocks per spoke (writer brief):**
1. Outcome H1
2. Math-savings subhead
3. 3-4 "When this makes sense" criteria
4. 3 explicit risks (this is non-negotiable — it's the educator voice doing its job)
5. 1 use-case-tagged testimonial
6. 5-8 FAQs
7. Comparison crosslinks

---

## 7. Calculator-as-form — progressive 4-stage flow

The conversion engine. Replaces both the external pre-qual form and the in-repo 9-step form.

| Stage | Inputs | UX | Lead state |
|---|---|---|---|
| **1. Equity** | Home value, mortgage balance, property zip (auto state) | Shown immediately in any hero. No commitment. Calc shows estimated equity + borrowing power. | Anonymous — session-only |
| **2. Vertical** | Use-case-specific. Debt: total debt + avg APR. Reno: project budget + timeline. Retire: monthly income need. | Stage 2 fields appear inline after stage 1 completes. Result panel updates ("You'd save $X" / "You could afford a $Y project"). | Segmented — session + first-party cookie |
| **3. Contact capture** | First name, email, opt-in to "Send my full report" | Email gate appears below the result. hCaptcha fires here only. | Cold lead — pushed to nurture sequence + pixel fires |
| **4. Lender match** | Phone, credit range (self-report), income range, timeline | Inline expand on success of stage 3. Optional escalation. | Hot lead — routed to lender(s) per use case + primary conversion event |

**Implementation notes:**
- Stage 1+2 happen inside the calculator UI; no page navigation between them.
- Stage 3 is the first form-submit event.
- Stage 4 is the optional escalation. A clear "skip — just send me the report" path exists; those leads stay cold.
- All stages persist to session storage so users returning later resume in place.
- Salvage from `app/mortgage-application`: Zod schemas, currency masking, phone masking, zip lookup, hCaptcha integration. Discard the 9-step shell.

**The pre-qual subdomain `get-started.heloc360.com` is retired.** All references in the existing codebase (e.g., the homepage `Get Pre-Qualified` button) get rewritten to point at the universal calculator anchor or the relevant spoke calculator.

---

## 8. Lead form & legacy retirement decisions

| Decision | Action |
|---|---|
| External pre-qual subdomain | Retire `get-started.heloc360.com`. All inbound links rewritten on-domain. |
| Existing 9-step form | Salvage validation + field components; discard 9-step shell. Re-mount inside calculator-as-form. |
| Borrower-type segmentation (current: 6 types) | Drop **Broker** and both **Investor** types (US + non-US) — none have a dedicated spoke in this scope, and §3 excludes investor/broker funnels. Keep **Homeowner** and **Self-employed** (the latter has its own Phase 3 spoke). "Other" becomes a free-form advisor-call CTA. |
| Mailing list capture | Pull off homepage hero. New placement: (a) exit-intent modal with lead magnet *"The 7-page HELOC decision guide"*, (b) footer column, (c) end of every blog post. |
| Phone collection | Optional at stage 3, required at stage 4. Phone-only leads bypass calculator via sticky "Talk to advisor" CTA in nav. |
| hCaptcha | Keep. Applied at stage 3 only — funnel above remains friction-free. |

---

## 9. Brand voice & writing guide

**Selected voice:** *Plainspoken expert* — direct, NPR-esque, financial-journalist tone. Default until user confirms otherwise at spec review.

**Reference headline (homepage):** "What do you want to do with your home equity?"
**Reference subhead:** "Tell us your reason. We'll match you with vetted lenders who specialize in exactly that — and walk you through the trade-offs before you commit."

**Voice rules:**

| Do | Don't |
|---|---|
| Frame decisions ("here's how to know if…") | Frame sales ("apply now in 60 seconds!") |
| Name risks explicitly | Hide risks in fine print |
| Use exact numbers when possible ("at 22% APR, $48k of debt costs you…") | Use vague hype ("save thousands!") |
| Explain finance terms in line | Drop finance jargon untranslated |
| One CTA per page section | Stack competing CTAs |
| Treat users as capable adults | Use "secure your future!" emotional pressure |

**Voice on the spoke pages:** The non-negotiable block is **"The N risks we'll talk you through."** Naming risks is what separates HELOC360 from rate marketplaces. Every spoke must include it.

**Voice on email nurture:** Same rules. Subject lines are statements or questions, not exclamations. CTAs are verbs ("See your numbers") not pleas ("Don't miss out!").

**Voice on legal disclosures:** Plain English first, regulatory language second. The advisor frame extends here too.

---

## 10. Color & visual style

**Selected palette:** A — Refined current. Same hue family as today, deeper navy as primary anchor.

| Role | Token | Hex | Use |
|---|---|---|---|
| Primary (anchor) | `--color-primary-900` | `#00274C` | Headlines, dark backgrounds, footer |
| Primary (accent) | `--color-primary-500` | `#1b75bc` | Links, secondary buttons, section H2s |
| Action (CTA) | `--color-action-600` | `#007a5e` | All primary CTAs |
| Action (success) | `--color-action-400` | `#02c39a` | Success states, savings amounts on spoke calcs |
| Warning / pillar | `--color-pillar-500` | `#FFCB05` | Phase 1 markers, lead-magnet badges (sparingly) |
| Surface | `--color-surface-50` | `#f9fafb` | Section background tones |
| Text | `--color-text-900` | `#0f172a` | Body |
| Text-muted | `--color-text-500` | `#6b7280` | Captions, legal, breadcrumbs |

**Typography:** Inter (already in `app/layout.tsx`). Headline weights: 800. Body: 400/500. Display sizes scale with Tailwind's defaults.

**Component library:** Continue using existing shadcn/ui components in `components/ui/`. No re-platforming.

**Imagery direction:** Replace stock-housing photos with photos that include people — homeowners at kitchen tables, advisors on calls, hands signing. Educator voice depends on humans being visible.

---

## 11. Navigation & site frame

**Header (every page):**
```
[HELOC360 logo]   How it works · HELOC 101 · Calculators · Rates · Blog        [Talk to an advisor →]
```
- No mega-menu for "Use cases" — verticals reachable via homepage pills and footer.
- Sticky on scroll. Compact mode after 200px scroll.

**Sticky bottom-of-viewport CTA (mobile + desktop):**
- Appears after 30% page scroll.
- Two buttons: `📞 Talk to advisor` · `See my borrowing power`.
- Dismissable. Re-appears on next session.
- Suppressed while any modal/form is open.

**Footer (5 columns):**
1. Use cases — all 5 spokes + `/heloc-101`
2. Calculators — every calculator linked
3. Resources — Blog, Rates, Glossary, State guides
4. Company — About, Team, Contact, Press
5. Legal & disclosures — Privacy, Terms, Affiliate disclosure, Communication consent, NMLS, BBB

Above the columns: mailing-list signup with lead magnet ("The 7-page HELOC decision guide").

**Mobile:**
- Header collapses to logo + hamburger + "Advisor" CTA pill.
- Hamburger reveals same nav items + footer items.
- Sticky CTA on bottom of viewport.

---

## 12. Phasing & deliverables

### Phase 1 — 4-6 weeks · "The new HELOC360"

- Homepage hybrid hero
- `/debt-consolidation` spoke (template + content)
- `/home-renovation` spoke (template + content)
- Universal borrowing-power calculator
- 4-stage calculator-as-form pattern
- Lead form replacement (kills 9-step + external subdomain)
- Brand voice applied sitewide on touched pages
- Color/visual style applied via Tailwind config
- Header + footer + sticky CTA
- Analytics + tracking foundation (see §13)
- Retire `get-started.heloc360.com`
- Mailing list lead magnet + exit-intent
- All sitemap routes updated

### Phase 2 — 3-4 weeks · "Scale to four spokes"

- `/retirement-equity` spoke
- `/heloc-101` revamp (new hub + ~6 supporting articles)
- `/rates` page with today's HELOC rates widget
- First wave of comparison pages (~12 articles, "HELOC vs X")
- FAQ schema + AEO/AIO optimization on top-volume pages
- Email nurture sequences per spoke
- Internal lead dashboard (see §13)

### Phase 3 — 3-4 weeks · "Scale + niche"

- `/self-employed-heloc` spoke
- Programmatic `/[spoke]/[state]` pages (~250 URLs)
- Paid landing page templates per spoke
- Short-form video pipeline
- Lender API integration polish
- A/B test infrastructure (Vercel + Edge Config)

**Note on plan scope:** The implementation plan derived from this spec will cover **Phase 1 only**. Phase 2 and Phase 3 are committed at the design level but get their own plans when Phase 1 ships and we have measurement data.

---

## 13. Tracking & analytics foundation (Phase 1)

| Surface | Purpose |
|---|---|
| GA4 (re-instrumented) | Sessions, source/medium, funnel events: `pill_click`, `calc_start`, `calc_complete`, `email_capture`, `lender_match` |
| Google Tag Manager | Tag central. Already on the site (Kaleidico GTM). Add the funnel tags. |
| Server-side conversion API | Meta CAPI + Google Enhanced Conversions, so paid attribution survives ATT/cookie loss. |
| Vercel Analytics + Speed Insights | Core Web Vitals. Finance pages target LCP <2.5s. |
| Microsoft Clarity | Session recording on homepage + spoke calculators. First 2 weeks post-launch are critical. |
| Search Console | Existing property under `kaleidico@gmail.com`. Confirm verification post-relaunch and capture baseline. |
| Internal lead dashboard | Phase 2 — admin view of leads with spoke, value-stage, lender routing. |
| A/B test infra | Phase 3 — Vercel + Edge Config. |

**Event naming convention:** `funnel.{spoke}.{stage}` — e.g., `funnel.debt_consolidation.calc_complete`, `funnel.universal.email_capture`. Spoke "universal" for homepage entries.

**No PII to GA4:** Email/phone are hashed before any third-party send. PII stays in first-party DB + lender CRM only.

---

## 14. Open questions & decisions deferred

| Item | Default | Resolve by |
|---|---|---|
| Brand voice final pick | Plainspoken expert (B) | User confirmation at spec review |
| Lender network changes per use case | No change in scope | Phase 2 (after first-month data) |
| Specific lead-magnet content ("7-page HELOC decision guide") | Title locked; content to be written | Phase 1 mid-build |
| Programmatic `/[state]` legal review (per-state disclosures) | Hold until Phase 3 | Phase 3 kickoff |
| Recent-activity ticker on hero | Not in Phase 1 | Phase 3 (if approved at retro) |

---

## Appendix A — Assets to salvage from current codebase

- `components/ui/*` — shadcn/ui primitives. No changes.
- `app/mortgage-application/*` — Zod schemas, currency mask, phone mask, zip lookup, hCaptcha wiring. Keep field-level logic, discard 9-step shell.
- `components/home-faq.tsx` — keep component, replace content per voice guide.
- `components/header.tsx`, `components/footer.tsx` — rebuild per §11.
- `components/mailing-list-form.tsx` — keep, relocate (see §8).
- `app/calculators/*` (debt-consolidation, home-equity-estimator) — incorporate into spoke calculators; current pages become 301 redirects or absorbed into `/calculators` hub.
- `app/heloc-101/page.tsx` — Phase 2 revamp.
- `app/blog/*` — keep CMS, retag content into spokes.
- `lib/tracking.ts` + `components/tracking-provider.tsx` — extend, don't replace.
- `sitemap.ts` — update for new URLs.

## Appendix B — Out of scope explicitly

- Trust-signal placement matrix as a standalone deliverable. (Signals still appear in mockups inline. Per-page audits happen during Phase 1 content production.)
- Backend lender CRM integration changes.
- Authentication/account creation for returning users.
- Spanish-language version.
- Mobile app.
- Accessibility audit beyond WCAG 2.1 AA baseline (which Phase 1 must hit anyway).

---

*End of design spec.*
