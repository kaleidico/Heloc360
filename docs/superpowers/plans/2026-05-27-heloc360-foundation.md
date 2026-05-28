# HELOC360 Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install the Palette A design tokens, rebuild the header / footer / sticky bottom CTA, and propagate the new visual identity across existing pages — without yet touching the homepage hero, the spoke pages, or the form. Existing pages keep working under new chrome.

**Architecture:** Add brand color tokens (`brand.navy/blue/green/mint/maize`) to the existing Tailwind v3 config so components reference them as `bg-brand-navy`, `text-brand-blue`, etc. Rewrite `components/header.tsx` and `components/footer.tsx` against the new tokens with the spec'd nav structure (no mega menus, single-level dropdowns only). Add a new `components/sticky-cta.tsx` mounted from `app/layout.tsx` that appears after 30% scroll. Swap the logo from `.webp` to the new `.avif` file. Voice / content touchups limited to chrome copy only — spoke and home content lives in later plans.

**Tech Stack:** Next.js 15.4 (App Router), TypeScript, Tailwind v3.4, React 18, lucide-react, shadcn/ui primitives (already installed). No new dependencies.

**Spec reference:** `docs/superpowers/specs/2026-05-27-heloc360-repositioning-design.md` — sections §3 (non-goals), §10 (color), §11 (nav & frame), §9 (voice).

---

## Prerequisites

Open one terminal tab with:

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
npm run dev
```

Keep `http://localhost:3000` open in your browser for visual verification throughout.

Open a second terminal for git / lint / type-check commands.

---

## File structure

| Path | Action | Responsibility |
|---|---|---|
| `tailwind.config.ts` | Modify | Add `brand.*` color tokens + Inter type scale extensions. |
| `app/globals.css` | Modify | Add brand CSS vars to `:root` and `.dark`. Update focus outline to use brand var. |
| `config/header-nav.json` | Modify | New nav: How it works · HELOC 101 · Calculators ▾ · Blog · [Talk to an advisor]. |
| `types/navigation.ts` | Modify | Extend `FooterNavigation` interface with `useCases`, `calculators`, `resources`, `company`, `legal` columns. |
| `config/footer-nav.json` | Modify | 5-column footer + voice-revised company copy. |
| `components/header.tsx` | Modify | Rewrite against brand tokens, new logo (AVIF), sticky + compact-on-scroll, mobile drawer. |
| `components/footer.tsx` | Modify | Rewrite to 5-column structure with mailing-list-with-lead-magnet row above the columns. |
| `components/sticky-cta.tsx` | **Create** | New client component. Shows after 30% scroll, dismissable, sessionStorage memory. |
| `app/layout.tsx` | Modify | Mount `<StickyCta />` once, after children. |
| `public/images/heloc360-logo.avif` | Already in place | New logo (AVIF, 3.6KB). Referenced by header. |

---

## Task 1: Add brand color tokens to Tailwind

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Open `tailwind.config.ts` and locate the `colors:` block inside `theme.extend`** (lines 15-66).

- [ ] **Step 2: Add the `brand` and `surface` color groups inside `theme.extend.colors`** — paste this block right before the closing `}` of `colors:` (after the `sidebar` group):

```typescript
brand: {
  navy: '#00274C',
  blue: '#1b75bc',
  'blue-dark': '#155a91',
  green: '#007a5e',
  'green-dark': '#006650',
  mint: '#02c39a',
  maize: '#FFCB05',
},
surface: {
  50:  '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
},
ink: {
  900: '#0f172a',
  700: '#374151',
  500: '#6b7280',
  400: '#9ca3af',
},
```

- [ ] **Step 3: Add an extension to `theme.extend.fontFamily`** — Inter is already loaded via `app/layout.tsx`, but Tailwind needs the alias. Add this block inside `theme.extend` (sibling of `colors`):

```typescript
fontFamily: {
  sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
},
```

- [ ] **Step 4: Add `theme.extend.fontSize` for the display scale** the spec calls for headline weight 800 at large sizes:

```typescript
fontSize: {
  'display-xl': ['3.5rem',  { lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '800' }],
  'display-lg': ['2.75rem', { lineHeight: '1.08', letterSpacing: '-0.020em', fontWeight: '800' }],
  'display-md': ['2.25rem', { lineHeight: '1.10', letterSpacing: '-0.015em', fontWeight: '800' }],
  'display-sm': ['1.75rem', { lineHeight: '1.15', letterSpacing: '-0.010em', fontWeight: '700' }],
},
```

- [ ] **Step 5: Save. Confirm the dev server (already running) reloads with no errors in the terminal.**

If you see a Tailwind parse error, re-check that the new blocks are inside `theme.extend` and that commas separate sibling keys.

- [ ] **Step 6: Commit.**

```bash
git add tailwind.config.ts
git commit -m "feat(foundation): add brand color tokens + Inter type scale"
```

---

## Task 2: Add brand CSS variables + update focus outline

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Open `app/globals.css` and locate the `:root` block at line 12.**

- [ ] **Step 2: Add brand CSS custom properties inside `:root` block** — insert these lines just before the closing `}` of `:root`:

```css
    --brand-navy: #00274C;
    --brand-blue: #1b75bc;
    --brand-blue-dark: #155a91;
    --brand-green: #007a5e;
    --brand-green-dark: #006650;
    --brand-mint: #02c39a;
    --brand-maize: #FFCB05;
```

- [ ] **Step 3: Add the same brand vars to `.dark` block** (currently at line 47) — keep the same values; dark mode uses the same brand identity:

```css
    --brand-navy: #00274C;
    --brand-blue: #1b75bc;
    --brand-blue-dark: #155a91;
    --brand-green: #007a5e;
    --brand-green-dark: #006650;
    --brand-mint: #02c39a;
    --brand-maize: #FFCB05;
```

- [ ] **Step 4: Update the focus outline** — find the existing rule at lines 90-93:

```css
*:focus-visible {
    outline: 2px solid #1b75bc;
    outline-offset: 2px;
}
```

Replace with:

```css
*:focus-visible {
    outline: 2px solid var(--brand-blue);
    outline-offset: 2px;
}
```

- [ ] **Step 5: Save. Visit `http://localhost:3000` and Tab through any link. Confirm the focus outline still shows (same blue color, now via var).**

- [ ] **Step 6: Commit.**

```bash
git add app/globals.css
git commit -m "feat(foundation): expose brand vars in globals; route focus outline via var"
```

---

## Task 3: Update header navigation config

**Files:**
- Modify: `config/header-nav.json`

- [ ] **Step 1: Open `config/header-nav.json`.**

- [ ] **Step 2: Replace the entire file content** with:

```json
[
	{
		"label": "How it works",
		"url": "/#how-it-works",
		"type": "text",
		"icon": null
	},
	{
		"label": "HELOC 101",
		"url": "/heloc-101",
		"type": "text",
		"icon": null
	},
	{
		"label": "Calculators",
		"url": null,
		"type": "text",
		"icon": null,
		"children": [
			{
				"label": "Debt Consolidation Savings",
				"url": "/calculators/debt-consolidation",
				"type": "text",
				"icon": null
			},
			{
				"label": "Home Equity Estimator",
				"url": "/calculators/home-equity-estimator",
				"type": "text",
				"icon": null
			}
		]
	},
	{
		"label": "Blog",
		"url": "/blog",
		"type": "text",
		"icon": null
	},
	{
		"label": "Talk to an advisor",
		"url": "/contact",
		"type": "cta-button",
		"icon": null
	}
]
```

**Notes on changes:**
- Removed `About` (per spec §11, About is only reachable via footer).
- Renamed `HELOC Calculators` → `Calculators` (per spec §11).
- Added `How it works` linking to homepage section anchor (route exists; section will be added in Plan 3).
- Replaced `Get Started` CTA pointing to external `get-started.heloc360.com` with `Talk to an advisor` pointing to `/contact`. (Plan 2 will swap `/contact` for `/pre-qual` when the new form ships.)
- Removed all `icon` references — header relies on text for brand discipline.

- [ ] **Step 3: Verify the JSON parses.** In a second terminal:

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
node -e "JSON.parse(require('fs').readFileSync('config/header-nav.json','utf-8')); console.log('OK')"
```

Expected output: `OK`

- [ ] **Step 4: Run type-check to catch any consumer that requires the removed icons.**

```bash
npx tsc --noEmit
```

Expected: 0 errors. If errors point at `header.tsx` using icon mappings, ignore for now — we rewrite that file in Task 4.

- [ ] **Step 5: Commit.**

```bash
git add config/header-nav.json
git commit -m "feat(foundation): rewrite header nav per spec — no megas, advisor CTA"
```

---

## Task 4: Rebuild the Header component

**Files:**
- Modify: `components/header.tsx`

The new header uses brand tokens, the AVIF logo, single-level dropdowns only, sticky positioning with a compact mode on scroll, and a mobile drawer.

- [ ] **Step 1: Replace the entire content of `components/header.tsx`** with:

```tsx
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import headerNavData from "@/config/header-nav.json"
import type { NavigationItem } from "@/types/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const [isCompact, setIsCompact] = useState(false)

  // Compact on scroll past 200px (per spec §11).
  useEffect(() => {
    const onScroll = () => setIsCompact(window.scrollY > 200)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const items: NavigationItem[] = (headerNavData as NavigationItem[]).filter(
    (item) => item.type !== "cta-button"
  )
  const ctas: NavigationItem[] = (headerNavData as NavigationItem[]).filter(
    (item) => item.type === "cta-button"
  )

  const handleDropdownKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setOpenDropdown(openDropdown === index ? null : index)
    } else if (e.key === "Escape") {
      setOpenDropdown(null)
    }
  }

  return (
    <header
      className={`bg-white shadow-sm sticky top-0 z-50 transition-all duration-200 ${
        isCompact ? "py-1" : "py-0"
      }`}
    >
      <div className="container mx-auto px-4">
        <div
          className={`flex items-center justify-between transition-all duration-200 ${
            isCompact ? "h-12" : "h-16"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="HELOC360 home">
            <Image
              src="/images/heloc360-logo.avif"
              alt="HELOC360"
              width={180}
              height={40}
              className={`w-auto transition-all duration-200 ${
                isCompact ? "h-7" : "h-9"
              }`}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" aria-label="Primary">
            {items.map((item, index) => (
              <div key={index} className="relative">
                {item.children ? (
                  <>
                    <button
                      className="flex items-center text-ink-700 hover:text-brand-blue transition-colors font-medium"
                      aria-haspopup="true"
                      aria-expanded={openDropdown === index}
                      onClick={() =>
                        setOpenDropdown(openDropdown === index ? null : index)
                      }
                      onKeyDown={(e) => handleDropdownKeyDown(e, index)}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 ml-1 transition-transform ${
                          openDropdown === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-surface-200 transition-all duration-150 ${
                        openDropdown === index
                          ? "opacity-100 visible"
                          : "opacity-0 invisible"
                      }`}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <div className="p-2">
                        {item.children.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            href={child.url || "#"}
                            className="block px-4 py-2 text-ink-700 hover:bg-surface-50 hover:text-brand-blue rounded transition-colors"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.url || "#"}
                    className="text-ink-700 hover:text-brand-blue transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button (desktop) */}
          {ctas.map((cta, index) => (
            <Button
              key={index}
              className="hidden lg:flex items-center bg-brand-green hover:bg-brand-green-dark text-white font-semibold"
              asChild
            >
              <Link href={cta.url || "#"}>{cta.label} →</Link>
            </Button>
          ))}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-ink-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-surface-200">
            <nav className="space-y-3" aria-label="Mobile primary">
              {items.map((item, index) => (
                <div key={index}>
                  {item.children ? (
                    <div className="space-y-2">
                      <div className="font-semibold text-ink-900">
                        {item.label}
                      </div>
                      {item.children.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          href={child.url || "#"}
                          className="block pl-4 py-1 text-ink-700 hover:text-brand-blue"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      href={item.url || "#"}
                      className="block py-1 text-ink-900 font-medium hover:text-brand-blue"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              {ctas.map((cta, index) => (
                <Button
                  key={index}
                  className="w-full flex items-center justify-center bg-brand-green hover:bg-brand-green-dark text-white font-semibold mt-3"
                  asChild
                >
                  <Link
                    href={cta.url || "#"}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {cta.label} →
                  </Link>
                </Button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Save and visit `http://localhost:3000`.** Confirm:
  - New logo (slightly different artwork from the .webp version) renders in the top-left.
  - Nav reads: **How it works · HELOC 101 · Calculators · Blog · [Talk to an advisor →]**.
  - "Calculators" shows a dropdown on click with two child links.
  - The CTA button is brand-green (`#007a5e`), not blue.
  - Tab order works; focus outlines visible.

- [ ] **Step 3: Test the compact-on-scroll.** Scroll past 200px. Confirm the header collapses (smaller logo, tighter height) smoothly.

- [ ] **Step 4: Test mobile.** Resize the browser to <1024px. Confirm:
  - Logo + hamburger + (hidden CTA) layout.
  - Hamburger opens the drawer.
  - "Calculators" shows as a labeled group with both children indented.
  - The CTA appears as a full-width button at the bottom of the drawer.

- [ ] **Step 5: Run lint.**

```bash
npm run lint
```

Expected: pass (warnings allowed; no errors).

- [ ] **Step 6: Commit.**

```bash
git add components/header.tsx
git commit -m "feat(foundation): rebuild header — brand tokens, new logo, compact-on-scroll"
```

---

## Task 5: Extend footer navigation types

**Files:**
- Modify: `types/navigation.ts`

- [ ] **Step 1: Open `types/navigation.ts` and replace the entire file** with:

```typescript
export interface NavigationItem {
  label: string
  url: string | null
  type: "text" | "cta-button"
  icon: string | null
  children?: NavigationItem[]
}

export interface FooterNavigationItem {
  label: string
  url: string
  type: "text" | "tel" | "email"
  icon: string | null
}

export interface FooterCompanyInfo {
  tagline: string
  callToAction: string
  description: string
  legalDisclaimer: string
}

export interface FooterMailingList {
  heading: string
  subheading: string
  ctaLabel: string
}

export interface FooterNavigation {
  companyInfo: FooterCompanyInfo
  mailingList: FooterMailingList
  socialMedia: FooterNavigationItem[]
  useCases: FooterNavigationItem[]
  calculators: FooterNavigationItem[]
  resources: FooterNavigationItem[]
  company: FooterNavigationItem[]
  legal: FooterNavigationItem[]
}
```

**Notes on changes:**
- Extracted `FooterCompanyInfo` for clarity.
- Added `FooterMailingList` for the new lead-magnet signup row above the columns.
- Added `useCases`, `calculators`, `resources`, `company`, `legal` columns (5 total, replaces `learnMore`/`tools`/`aboutUs`/`bottomFooterRow`).
- Kept `socialMedia` and `companyInfo` unchanged.

- [ ] **Step 2: Run type-check.**

```bash
npx tsc --noEmit
```

Expected: errors *only* in `components/footer.tsx` and possibly `config/footer-nav.json` (via type assertion). Both are fixed in Task 6 and Task 7.

- [ ] **Step 3: Commit.**

```bash
git add types/navigation.ts
git commit -m "feat(foundation): extend FooterNavigation type for 5-col layout + mailing list"
```

---

## Task 6: Rewrite footer navigation config

**Files:**
- Modify: `config/footer-nav.json`

- [ ] **Step 1: Replace the entire content of `config/footer-nav.json`** with:

```json
{
	"companyInfo": {
		"tagline": "The HELOC advisor, not the HELOC salesman.",
		"callToAction": "Talk to an advisor — not a sales rep.",
		"description": "HELOC360 helps homeowners decide whether and how to tap their home equity. We connect you with vetted, licensed lenders who specialize in your specific situation — and we'll walk you through the trade-offs before you commit to anything. HELOC360 is provided by My Perfect Leads, LLC.",
		"legalDisclaimer": "This is not an offer to enter into an agreement. Not all customers will qualify. Information, rates, and programs are subject to change without notice. All products are subject to credit and property approval. Other restrictions and limitations may apply. Equal Housing Opportunity."
	},
	"mailingList": {
		"heading": "Get the 7-page HELOC decision guide.",
		"subheading": "Plain-English walkthrough of when a HELOC is the right call — and when it isn't. Free, no sales pitch.",
		"ctaLabel": "Send me the guide"
	},
	"socialMedia": [
		{ "label": "Facebook", "url": "https://facebook.com/heloc360", "type": "text", "icon": "Facebook" },
		{ "label": "Twitter", "url": "https://twitter.com/heloc360", "type": "text", "icon": "Twitter" },
		{ "label": "LinkedIn", "url": "https://linkedin.com/company/heloc360", "type": "text", "icon": "Linkedin" },
		{ "label": "Email", "url": "mailto:info@heloc360.com", "type": "email", "icon": "Mail" }
	],
	"useCases": [
		{ "label": "Pay off debt", "url": "/debt-consolidation", "type": "text", "icon": null },
		{ "label": "Renovate my home", "url": "/home-renovation", "type": "text", "icon": null },
		{ "label": "Plan for retirement", "url": "/retirement-equity", "type": "text", "icon": null },
		{ "label": "First time tapping equity", "url": "/heloc-101", "type": "text", "icon": null },
		{ "label": "I'm self-employed", "url": "/self-employed-heloc", "type": "text", "icon": null }
	],
	"calculators": [
		{ "label": "Debt Consolidation Savings", "url": "/calculators/debt-consolidation", "type": "text", "icon": null },
		{ "label": "Home Equity Estimator", "url": "/calculators/home-equity-estimator", "type": "text", "icon": null },
		{ "label": "All calculators", "url": "/calculators", "type": "text", "icon": null }
	],
	"resources": [
		{ "label": "HELOC 101", "url": "/heloc-101", "type": "text", "icon": null },
		{ "label": "Blog", "url": "/blog", "type": "text", "icon": null },
		{ "label": "Glossary", "url": "/glossary", "type": "text", "icon": null }
	],
	"company": [
		{ "label": "About", "url": "/about", "type": "text", "icon": null },
		{ "label": "Meet our team", "url": "/meet-our-team", "type": "text", "icon": null },
		{ "label": "Contact", "url": "/contact", "type": "text", "icon": null }
	],
	"legal": [
		{ "label": "Privacy Policy", "url": "/privacy", "type": "text", "icon": null },
		{ "label": "Terms of Use", "url": "/terms", "type": "text", "icon": null },
		{ "label": "Affiliate Disclosure", "url": "/affiliate-disclosure", "type": "text", "icon": null },
		{ "label": "Communication Consent", "url": "/communication-consent", "type": "text", "icon": null }
	]
}
```

**Notes:**
- Use cases link to spoke URLs that don't exist yet — that's intentional. Plans 3 and 4 create the spokes. Until then, those links 404 (the live site routing layer can be configured to soft-404 or redirect home if needed, but for local dev it's fine).
- `/glossary` is also a future page — keep the link; Plan 2 phase will add a stub.
- Voice on `companyInfo.description` rewritten to plainspoken expert (see spec §9).

- [ ] **Step 2: Verify JSON parses.**

```bash
node -e "JSON.parse(require('fs').readFileSync('config/footer-nav.json','utf-8')); console.log('OK')"
```

Expected: `OK`.

- [ ] **Step 3: Commit.**

```bash
git add config/footer-nav.json
git commit -m "feat(foundation): rewrite footer nav — 5 columns + lead-magnet mailing list"
```

---

## Task 7: Rebuild the Footer component

**Files:**
- Modify: `components/footer.tsx`

- [ ] **Step 1: Replace the entire content of `components/footer.tsx`** with:

```tsx
import Link from "next/link"
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react"
import footerNavData from "@/config/footer-nav.json"
import type { FooterNavigation, FooterNavigationItem } from "@/types/navigation"

const socialIconMap = { Facebook, Twitter, Linkedin, Mail }

function FooterColumn({
  heading,
  items,
}: {
  heading: string
  items: FooterNavigationItem[]
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-maize mb-3">
        {heading}
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i}>
            <Link
              href={item.url}
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  const data: FooterNavigation = footerNavData as FooterNavigation

  return (
    <footer className="bg-brand-navy text-white">
      {/* Mailing list row (lead magnet) */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-10">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-display-sm text-white mb-2">
                {data.mailingList.heading}
              </h2>
              <p className="text-sm text-white/70">{data.mailingList.subheading}</p>
            </div>
            <form
              className="flex flex-col sm:flex-row gap-2"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Mailing list signup"
            >
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="flex-1 px-4 py-3 rounded-md bg-white text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="bg-brand-green hover:bg-brand-green-dark text-white font-semibold px-6 py-3 rounded-md transition-colors"
              >
                {data.mailingList.ctaLabel}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 5-column nav */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <FooterColumn heading="Use cases" items={data.useCases} />
          <FooterColumn heading="Calculators" items={data.calculators} />
          <FooterColumn heading="Resources" items={data.resources} />
          <FooterColumn heading="Company" items={data.company} />
          <FooterColumn heading="Legal" items={data.legal} />
        </div>
      </div>

      {/* Company info + legal */}
      <div className="bg-black/20 border-t border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="md:col-span-2">
              <p className="text-white/80 leading-relaxed">{data.companyInfo.description}</p>
            </div>
            <div>
              <p className="text-white/50 text-xs leading-relaxed">
                {data.companyInfo.legalDisclaimer}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-black/30">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <p className="text-xs text-white/60">
              © {new Date().getFullYear()} HELOC360 · My Perfect Leads, LLC. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs">
              {data.socialMedia.map((s, i) => {
                const Icon = socialIconMap[s.icon as keyof typeof socialIconMap]
                return (
                  <a
                    key={i}
                    href={s.url}
                    className="text-white/60 hover:text-white transition-colors"
                    aria-label={s.label}
                  >
                    {Icon ? <Icon className="w-4 h-4" /> : s.label}
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Visit `http://localhost:3000` and scroll to the bottom.** Confirm:
  - Top of footer is a mailing-list signup with lead-magnet copy ("Get the 7-page HELOC decision guide.").
  - Below it: 5 column grid (Use cases · Calculators · Resources · Company · Legal).
  - Column headers in brand-maize (`#FFCB05`).
  - Background is brand-navy (`#00274C`).
  - Submit button is brand-green; hover darkens.

- [ ] **Step 3: Resize browser to mobile.** Confirm:
  - Columns collapse to 2 → 3 → 5 across breakpoints.
  - Mailing list form stacks vertically (input above button).

- [ ] **Step 4: Run lint.**

```bash
npm run lint
```

Expected: pass.

- [ ] **Step 5: Run type-check.**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 6: Commit.**

```bash
git add components/footer.tsx
git commit -m "feat(foundation): rebuild footer — 5 cols + lead-magnet mailing list + brand colors"
```

---

## Task 8: Create the StickyCta component

**Files:**
- Create: `components/sticky-cta.tsx`

- [ ] **Step 1: Create the file `components/sticky-cta.tsx`** with:

```tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Phone, X } from "lucide-react"

const DISMISS_KEY = "stickyCta:dismissed"

export default function StickyCta() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (sessionStorage.getItem(DISMISS_KEY) === "1") {
      setDismissed(true)
      return
    }

    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return
      const pct = window.scrollY / docHeight
      setVisible(pct >= 0.3)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1")
    setDismissed(true)
  }

  if (dismissed || !visible) return null

  return (
    <div
      role="region"
      aria-label="Quick actions"
      className="fixed bottom-4 inset-x-3 md:inset-x-auto md:right-6 md:bottom-6 z-40 bg-brand-navy text-white shadow-2xl rounded-xl border border-white/10 overflow-hidden"
    >
      <div className="flex items-stretch">
        <Link
          href="/contact"
          className="flex items-center gap-2 px-4 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
        >
          <Phone className="w-4 h-4" aria-hidden="true" />
          <span>Talk to advisor</span>
        </Link>
        <Link
          href="/#calculator"
          className="flex items-center gap-2 px-4 py-3 text-sm font-semibold bg-brand-green hover:bg-brand-green-dark transition-colors"
        >
          See my borrowing power
        </Link>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="px-3 hover:bg-white/10 transition-colors border-l border-white/10"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
```

**Notes:**
- Show threshold is 30% scroll depth, per spec §11.
- `/contact` and `/#calculator` are placeholders — Plan 2 retargets to `/pre-qual` and Plan 3 adds the homepage anchor.
- Dismissal persists in `sessionStorage` — re-appears in next session per spec.
- Modal-open suppression is **out of scope for this plan** and will be added in Plan 2 when forms exist.

- [ ] **Step 2: Run lint.**

```bash
npm run lint
```

Expected: pass.

- [ ] **Step 3: Commit.**

```bash
git add components/sticky-cta.tsx
git commit -m "feat(foundation): add sticky bottom CTA — 30% scroll trigger, sessionStorage dismiss"
```

---

## Task 9: Mount StickyCta in the layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Open `app/layout.tsx` and locate the imports at the top of the file.**

- [ ] **Step 2: Add the StickyCta import** alongside the existing `ScrollToTop` dynamic import. After the `const ScrollToTop = dynamic(...)` line (around line 10), add:

```tsx
const StickyCta = dynamic(() => import("@/components/sticky-cta"), {
  loading: () => null,
})
```

- [ ] **Step 3: Find the JSX block that wraps `{children}` between `<Header />` and `<Footer />`** (search for `<Footer />`) and add `<StickyCta />` as a sibling **after** `<Footer />` (so it's outside the main content stream but inside the body):

```tsx
        <Header />
        {children}
        <Footer />
        <StickyCta />
        <ScrollToTop />
```

(If the existing layout doesn't have `<ScrollToTop />` next to `<Footer />` already, just place `<StickyCta />` after `<Footer />`.)

- [ ] **Step 4: Visit `http://localhost:3000`.** Scroll down at least 30% of the page. Confirm the floating CTA bar appears at the bottom-right (desktop) or bottom-edge (mobile).

- [ ] **Step 5: Click the X to dismiss.** Confirm it disappears. Refresh the page. Confirm it stays hidden (sessionStorage).

- [ ] **Step 6: Open a new tab to `http://localhost:3000`.** Confirm it appears again (new session).

- [ ] **Step 7: Run lint + type-check.**

```bash
npm run lint && npx tsc --noEmit
```

Expected: both pass.

- [ ] **Step 8: Commit.**

```bash
git add app/layout.tsx
git commit -m "feat(foundation): mount StickyCta in root layout"
```

---

## Task 10: Final build verification + delete legacy logo reference

**Files:**
- Modify: none (verification only)
- Note: leave `public/images/heloc360-logo.webp` in place for now — Plan 3 may reference it during the homepage rebuild and deciding to delete it cleanly is part of that plan's scope.

- [ ] **Step 1: Run a full production build.**

```bash
npm run build
```

Expected: build succeeds with no errors. Warnings about unused images (`heloc360-logo.webp`) are OK.

- [ ] **Step 2: Run lint.**

```bash
npm run lint
```

Expected: pass.

- [ ] **Step 3: Visit `http://localhost:3000`** and click through:
  - `/` — new header, new footer, sticky CTA after scroll
  - `/about` — new chrome wraps existing content
  - `/blog` — new chrome wraps existing content
  - `/contact` — new chrome wraps existing content
  - `/calculators/debt-consolidation` — accessed via Calculators dropdown
  - `/calculators/home-equity-estimator` — accessed via Calculators dropdown
  - `/heloc-101` — accessed via top nav
  - Footer links — confirm they point at the right routes (some 404, that's expected and listed in Task 6 notes)

- [ ] **Step 4: Search for any hardcoded brand-color hexes left in components/layout touched by this plan.**

```bash
grep -nE '#1b75bc|#1B75BC|#007a5e|#00274C|#02c39a|#FFCB05' components/header.tsx components/footer.tsx components/sticky-cta.tsx app/layout.tsx
```

Expected results — **only** these three intentional matches in `app/layout.tsx`:
- Line ~28: `themeColor` metadata, light scheme (`#1b75bc`)
- Line ~29: `themeColor` metadata, dark scheme (`#02c39a`)
- Line ~102: `mask-icon` rel link `color` (`#1b75bc`)

These three are Next.js `Metadata` API values that are serialized into static `<meta>` tags at build time; CSS variables / Tailwind tokens are not resolved in that context, so the hex literals must stay. They are an accepted exception.

**Any other match — including arbitrary-value Tailwind classes like `bg-[#1b75bc]` — is a bug.** Replace with the corresponding `brand-*` Tailwind class and commit a fix.

- [ ] **Step 4a: Verify the known offender in `app/layout.tsx` has been fixed.** The skip-to-content link near line 195 used the arbitrary `bg-[#1b75bc]` Tailwind class — swap it to `bg-brand-blue`:

```bash
# Before / verification:
grep -n 'bg-\[#1b75bc\]\|bg-brand-blue' app/layout.tsx
```

If the `bg-[#1b75bc]` arbitrary-value class is still present, replace it with `bg-brand-blue` and commit:

```bash
git add app/layout.tsx
git commit -m "fix(foundation): route layout skip-link bg through brand token"
```

- [ ] **Step 5: Confirm the working tree is clean.**

```bash
git status
```

Expected: `nothing to commit, working tree clean`.

- [ ] **Step 6: Tag the foundation milestone (optional but useful for rollback later).**

```bash
git tag foundation-v1
```

---

## Done

At this point:
- Brand palette tokens (`brand-navy`, `brand-blue`, `brand-green`, `brand-mint`, `brand-maize`) are available across the codebase as Tailwind classes.
- The site has a new chrome: header with the new logo + spec'd nav, footer with 5 columns + lead-magnet mailing list, and a sticky bottom CTA.
- The 9-step pre-qual form, the homepage hero, and the use-case spokes are still untouched — they're the subjects of Plans 2, 3, and 4.

**Hand off:** When ready, run the writing-plans skill again to produce Plan 2 (Pre-qual form on-domain).

---

## Plan self-review

**Spec coverage (Phase 1 foundation subset):**
- ✅ Tailwind tokens for Palette A — Task 1 (spec §10)
- ✅ Header rebuild (no mega menus) — Tasks 3, 4 (spec §11)
- ✅ Footer rebuild (5 columns) — Tasks 5, 6, 7 (spec §11)
- ✅ Sticky bottom-CTA — Tasks 8, 9 (spec §11)
- ✅ Inter type scale — Task 1 (spec §10 typography)
- ✅ Voice touchups on chrome copy — Task 6 (companyInfo description) (spec §9)
- ✅ Logo swap to AVIF — Task 4
- ❌ Mailing list lead-magnet PDF stub — **deliberately deferred to Plan 6** (per the original decomposition). The footer mailing list form exists structurally but does not yet POST anywhere; the form's `onSubmit` is `preventDefault()`. Plan 6 wires it up.
- ❌ Analytics tagging on new components — **deferred to Plan 5** per the decomposition.

**Placeholder scan:** No `TBD` / `TODO` markers in the plan text. Where placeholder routes exist (e.g., `/contact` as a stand-in for `/pre-qual`), they're called out explicitly in task notes so the next plan can swap them.

**Type consistency:** `NavigationItem` and `FooterNavigation` shapes used in Tasks 4, 6, 7 match the type definitions added in Task 5. `socialIconMap` references match `socialMedia` JSON keys.

**Scope check:** The plan touches 9 files and produces approximately 10 commits. Each task is independently revertable. The plan does NOT touch `app/page.tsx`, `app/mortgage-application/*`, any spoke page, the calculator pages, or the existing get-started.heloc360.com integration — those are owned by Plans 2, 3, and 4.
