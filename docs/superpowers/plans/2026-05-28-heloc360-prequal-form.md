# HELOC360 Pre-Qual Form (On-Domain) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the leaky external `get-started.heloc360.com` 9-step form with an on-domain, 2-step / 5-question pre-qual form that captures leads via a single inline progressive-reveal flow.

**Architecture:** New `/pre-qual` standalone route mounts a single `<PreQualForm />` client component. The form uses React Hook Form + Zod (already in deps), with progressive reveal between Step 1 (3 home questions → inline equity readout) and Step 2 (4 contact questions + hCaptcha). Form state persists to `sessionStorage` so back/forward navigation doesn't drop progress. Submission posts to a new `/api/submit-prequal` API route that re-validates server-side with Zod, verifies hCaptcha, and proxies to the existing lender webhook (same destination as the legacy `submit-mortgage` endpoint) with a `formType: "pre-qual-v1"` discriminator. The sticky-CTA modal-suppression carry-forward from Plan 1 is wired via a `body[data-suppress-sticky-cta]` MutationObserver — no Context API, no `app/layout.tsx` server/client boundary disruption.

**Tech Stack:** Next.js 15.4 App Router · React 18 · TypeScript · React Hook Form · Zod · Tailwind v3.4 · lucide-react · shadcn/ui primitives (Input, Button, Label) · existing `@/components/ui/hcaptcha` · existing `@/lib/tracking` (UTM capture). No new dependencies.

**Spec reference:** `docs/superpowers/specs/2026-05-27-heloc360-repositioning-design.md` — §7 (Pre-qual form), §8 (Lead form & legacy retirement decisions), §3 (Non-goals — drops Broker + Investor borrower types).

---

## Prerequisites

Open one terminal tab with:

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
npm run dev
```

If port 3000 is busy, pass `-- -p 3002` (or whatever's free — Plan 1's dev session ran on 3002).

Keep `http://localhost:3002/pre-qual` open in your browser (the page won't exist until Task 9; getting a 404 before then is correct).

Open a second terminal for git / tsc / build commands.

---

## Architectural decisions locked at plan-write time

| Decision | Choice | Rationale |
|---|---|---|
| Single route vs embedded everywhere | **Both — but Plan 2 only builds the standalone route.** | Component is reusable for spoke pages in Plan 4, but Plan 2 ships the dedicated `/pre-qual` route so the header CTA + sticky CTA have a destination. |
| Use case capture | URL/prop-driven, hidden field. Standalone route defaults to `"universal"`. | Spec §7 ("URL-inferred or pre-tagged"). Plan 4's spokes pass their slug. |
| Server-side handler | **New API route**, not Server Action. | Codebase doesn't use Server Actions anywhere yet — don't introduce a new pattern mid-plan. Matches existing `app/api/submit-mortgage/route.ts`. |
| Lender destination | Same webhook URL as `submit-mortgage`, **discriminated by `formType: "pre-qual-v1"`**. | Single ingestion point on the lender side; Plan 2 doesn't change CRM integration (spec §3 non-goal). Webhook URL is hardcoded in the new route — matches existing pattern; moving both to env var is a future tooling task. |
| hCaptcha sitekey | Optional prop on the form component; defaults to existing test sitekey from `@/components/ui/hcaptcha`. | Matches existing form's pattern. Real sitekey gets wired via prop later — not a Plan 2 dependency. |
| hCaptcha server verify | Only when `HCAPTCHA_SECRET` env var is set. Skipped in dev. | Matches the existing form's `process.env.NODE_ENV !== "development"` skip-pattern. Documents the env var as a deployment requirement, not a Plan 2 prereq. |
| Form state shape | Single Zod schema, validated incrementally via `trigger(['zipCode', 'homeValue', 'mortgageBalance'])`. | Simpler than two schemas with merge logic; matches React Hook Form's idioms. |
| Borrower-type field | **Not asked.** | Spec §7: "Borrower type, employment, income range, credit range, DTI — Not asked. Loan officer collects on the first call." Spec §8: Broker + both Investor types dropped from site entirely. |
| 9-step form file | **Left in place, dead code.** Cleanup deferred. | Deleting 1500+ lines mid-Plan-2 risks accidental import breakage. Real cleanup belongs in a separate "tech debt" pass once the new form is proven in production. |
| Sticky CTA suppression | `body[data-suppress-sticky-cta="1"]` data attribute + MutationObserver in `sticky-cta.tsx`. | Plan 1 carry-forward. Avoids making `app/layout.tsx` client. No new Context provider, no new state library. |

---

## File structure

| Path | Action | Responsibility |
|---|---|---|
| `lib/pre-qual/sla.ts` | **Create** | Single source of truth for the SLA copy ("advisor will call you within X hours"). Pure constants. |
| `lib/pre-qual/use-case.ts` | **Create** | Use case enum + URL-to-use-case inference helper. |
| `lib/pre-qual/masks.ts` | **Create** | `formatCurrency`, `formatPhoneNumber`, `normalizeZip` — salvaged from the 9-step form, factored into a focused module. |
| `lib/pre-qual/zip-lookup.ts` | **Create** | `lookupZip(zip)` → `{ city, state } \| null`. Uses zippopotam.us (same as 9-step form). |
| `lib/pre-qual/schema.ts` | **Create** | Zod schema for the 2-step / 5-question form + inferred TypeScript types. |
| `lib/pre-qual/equity.ts` | **Create** | `computeEquity({ homeValue, mortgageBalance })` and `computeBorrowingPower(...)`. Pure functions. |
| `components/pre-qual/equity-readout.tsx` | **Create** | Inline readout displayed after Step 1 validates ("You'd unlock $X"). |
| `components/pre-qual/best-time-chips.tsx` | **Create** | One-tap chip selector (Mornings · Afternoons · Evenings · Anytime). |
| `components/pre-qual/pre-qual-form.tsx` | **Create** | The 2-step progressive form. Client component. |
| `components/pre-qual/sticky-cta-suppress.tsx` | **Create** | Tiny component that sets `body[data-suppress-sticky-cta]` while mounted. Reusable for future modal flows. |
| `components/sticky-cta.tsx` | **Modify** | Subscribe to `body[data-suppress-sticky-cta]` via MutationObserver. Update `/contact` link target → `/pre-qual`. |
| `config/header-nav.json` | **Modify** | Update "Talk to an advisor" CTA URL: `/contact` → `/pre-qual`. |
| `app/pre-qual/page.tsx` | **Create** | Standalone `/pre-qual` route. Mounts the form + the suppression marker. |
| `app/api/submit-prequal/route.ts` | **Create** | POST handler. Zod re-validation, hCaptcha verify, webhook proxy. |

---

## Task 1: Library scaffolding — SLA, use-case, masks

**Files:**
- Create: `lib/pre-qual/sla.ts`
- Create: `lib/pre-qual/use-case.ts`
- Create: `lib/pre-qual/masks.ts`

Three small utility modules. Each has one clear responsibility. Group-committed because they're all dependency-free leaves.

- [ ] **Step 1: Create `lib/pre-qual/sla.ts`** with:

```ts
// Single source of truth for the advisor-call SLA copy.
// Spec §7: "A HELOC360 advisor will call you in [X hours]." — pulled from
// config so we can change it without redeploying any component.

export const SLA_HOURS = 2

export function slaCopy(): string {
  return `A HELOC360 advisor will call you within ${SLA_HOURS} hour${SLA_HOURS === 1 ? "" : "s"}.`
}
```

- [ ] **Step 2: Create `lib/pre-qual/use-case.ts`** with:

```ts
// The 5 use-case verticals + a "universal" fallback for the standalone
// /pre-qual route (when there's no spoke context yet).
// Spec §4 IA: the 5 spoke routes are /debt-consolidation, /home-renovation,
// /retirement-equity, /heloc-101, /self-employed-heloc.

export const USE_CASES = [
  "universal",
  "debt-consolidation",
  "home-renovation",
  "retirement-equity",
  "heloc-101",
  "self-employed-heloc",
] as const

export type UseCase = (typeof USE_CASES)[number]

const PATH_TO_USE_CASE: Record<string, UseCase> = {
  "/debt-consolidation": "debt-consolidation",
  "/home-renovation": "home-renovation",
  "/retirement-equity": "retirement-equity",
  "/heloc-101": "heloc-101",
  "/self-employed-heloc": "self-employed-heloc",
}

// Infer the use case from a URL pathname. Returns "universal" if the path
// isn't a spoke route. Strips trailing /calculator etc. so /debt-consolidation/calculator
// still resolves to "debt-consolidation".
export function inferUseCaseFromPath(pathname: string | null | undefined): UseCase {
  if (!pathname) return "universal"
  for (const prefix of Object.keys(PATH_TO_USE_CASE)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return PATH_TO_USE_CASE[prefix]
    }
  }
  return "universal"
}
```

- [ ] **Step 3: Create `lib/pre-qual/masks.ts`** with:

```ts
// Input-mask helpers salvaged from the legacy 9-step form
// (components/mortgage-application/mortgage-application-form.tsx lines 266-288).
// Factored into a focused module so the new form and any future calculators
// share a single implementation.

// Format a raw user-typed string as US currency: "12345" -> "$12,345".
// Empty input returns "".
export function formatCurrency(value: string): string {
  const digits = value.replace(/\D/g, "")
  if (digits === "") return ""
  const num = parseInt(digits, 10)
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

// Parse a currency-masked string back to a number. "$12,345" -> 12345.
// Returns 0 for empty / non-numeric input.
export function parseCurrency(value: string): number {
  const digits = value.replace(/\D/g, "")
  if (digits === "") return 0
  return parseInt(digits, 10)
}

// Format a phone number as "(NNN) NNN-NNNN". Partial inputs are formatted
// progressively so the user sees the mask as they type.
export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "")
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}

// Strip non-digits and clamp to 10 chars (US ZIP+4 max).
export function normalizeZip(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10)
}
```

- [ ] **Step 4: Verify typecheck.**

```bash
npx tsc --noEmit 2>&1 | grep -E "^lib/pre-qual/" || echo "OK - pre-qual libs clean"
```

Expected: `OK - pre-qual libs clean`.

- [ ] **Step 5: Commit.**

```bash
git add lib/pre-qual/sla.ts lib/pre-qual/use-case.ts lib/pre-qual/masks.ts
git commit -m "feat(prequal): scaffold pre-qual lib — SLA, use case, input masks"
```

(Em dash `—` between "lib" and "SLA". Plan verbatim.)

---

## Task 2: ZIP lookup helper

**Files:**
- Create: `lib/pre-qual/zip-lookup.ts`

Wraps the zippopotam.us call that the legacy form used inline. Factored out so the new form imports a clean async function.

- [ ] **Step 1: Create `lib/pre-qual/zip-lookup.ts`** with:

```ts
// ZIP → { city, state } lookup. Uses zippopotam.us (free, no key required),
// salvaged from the legacy 9-step form (components/mortgage-application/
// mortgage-application-form.tsx lines 218-263).
//
// Returns null on any failure (network, 404, malformed response). Callers
// should treat null as "no auto-fill" — the user can still type city/state
// manually if we ever surface those fields.

export interface ZipLocation {
  city: string
  state: string // 2-letter abbreviation
}

interface ZippopotamPlace {
  "place name": string
  "state abbreviation": string
}

interface ZippopotamResponse {
  places?: ZippopotamPlace[]
}

export async function lookupZip(zip: string): Promise<ZipLocation | null> {
  if (zip.length < 5) return null
  const fiveDigit = zip.slice(0, 5)
  try {
    const response = await fetch(`https://api.zippopotam.us/US/${fiveDigit}`)
    if (!response.ok) return null
    const data = (await response.json()) as ZippopotamResponse
    if (!data.places || data.places.length === 0) return null
    const first = data.places[0]
    if (!first["place name"] || !first["state abbreviation"]) return null
    return {
      city: first["place name"],
      state: first["state abbreviation"],
    }
  } catch {
    return null
  }
}
```

- [ ] **Step 2: Verify typecheck.**

```bash
npx tsc --noEmit 2>&1 | grep -E "^lib/pre-qual/zip-lookup" || echo "OK - zip-lookup clean"
```

Expected: `OK - zip-lookup clean`.

- [ ] **Step 3: Commit.**

```bash
git add lib/pre-qual/zip-lookup.ts
git commit -m "feat(prequal): add ZIP → city/state lookup helper"
```

---

## Task 3: Zod schemas + equity calculator

**Files:**
- Create: `lib/pre-qual/schema.ts`
- Create: `lib/pre-qual/equity.ts`

Defines the form's wire shape (Zod schema → inferred TS types) and the pure equity/borrowing-power calculator that the inline readout consumes.

- [ ] **Step 1: Create `lib/pre-qual/schema.ts`** with:

```ts
// Zod schema for the 2-step / 5-question pre-qual form.
// Spec §7: 5 user-facing fields (zip, home value, mortgage balance, name,
// email, phone+best-time) plus URL-inferred use case + silent UTM context.
// Spec §8: borrower type, employment, income range, credit range, DTI
// are NOT asked; loan officer collects on the first call.

import { z } from "zod"
import { USE_CASES } from "./use-case"

export const BEST_TIME_OPTIONS = ["Mornings", "Afternoons", "Evenings", "Anytime"] as const
export type BestTime = (typeof BEST_TIME_OPTIONS)[number]

// Step 1 — "Tell us about your home".
// homeValue / mortgageBalance arrive as currency-masked strings ("$425,000")
// and are coerced to numbers via parseCurrency before persistence.
export const Step1Schema = z.object({
  zipCode: z
    .string()
    .min(5, "ZIP code must be at least 5 digits")
    .max(10, "ZIP code must be 10 digits or less"),
  city: z.string().optional(),
  state: z.string().optional(),
  homeValue: z
    .number({ invalid_type_error: "Enter your home's estimated value" })
    .int()
    .positive("Enter your home's estimated value"),
  mortgageBalance: z
    .number({ invalid_type_error: "Enter your current mortgage balance" })
    .int()
    .nonnegative("Mortgage balance cannot be negative"),
})

// Step 2 — "How should we reach you?"
export const Step2Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .refine((v) => v.replace(/\D/g, "").length >= 10, {
      message: "Phone number must be at least 10 digits",
    }),
  bestTime: z.enum(BEST_TIME_OPTIONS),
})

// Hidden context fields populated by the form host (not user-visible).
export const ContextSchema = z.object({
  useCase: z.enum(USE_CASES),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  gclid: z.string().optional(),
  fbclid: z.string().optional(),
  referral: z.string().optional(),
})

// The wire shape posted to /api/submit-prequal.
export const PreQualSubmissionSchema = Step1Schema.merge(Step2Schema)
  .merge(ContextSchema)
  .extend({
    hcaptchaToken: z.string().optional(),
    formType: z.literal("pre-qual-v1"),
  })

export type PreQualSubmission = z.infer<typeof PreQualSubmissionSchema>
export type Step1Values = z.infer<typeof Step1Schema>
export type Step2Values = z.infer<typeof Step2Schema>
export type ContextValues = z.infer<typeof ContextSchema>
```

- [ ] **Step 2: Create `lib/pre-qual/equity.ts`** with:

```ts
// Equity + borrowing-power calculator. Pure functions, no side effects.
// Used by the inline readout that surfaces after Step 1 validates.
//
// Borrowing power assumes 85% combined LTV — the typical max for a
// stand-alone HELOC. Real lender caps vary; this is a "rough estimate"
// number, and the spec §7 helper text already frames it as such
// ("Your best guess from Zillow or your last appraisal is fine —
// we'll firm this up later.").

const MAX_CLTV = 0.85

export interface EquityNumbers {
  equity: number
  borrowingPower: number
}

export function computeEquity({
  homeValue,
  mortgageBalance,
}: {
  homeValue: number
  mortgageBalance: number
}): EquityNumbers {
  const equity = Math.max(0, homeValue - mortgageBalance)
  const borrowingPower = Math.max(0, Math.floor(homeValue * MAX_CLTV) - mortgageBalance)
  return { equity, borrowingPower }
}

export function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}
```

- [ ] **Step 3: Verify typecheck.**

```bash
npx tsc --noEmit 2>&1 | grep -E "^lib/pre-qual/" || echo "OK - pre-qual libs clean"
```

Expected: `OK - pre-qual libs clean`.

- [ ] **Step 4: Commit.**

```bash
git add lib/pre-qual/schema.ts lib/pre-qual/equity.ts
git commit -m "feat(prequal): add Zod schemas + equity/borrowing-power calculator"
```

---

## Task 4: Equity readout component

**Files:**
- Create: `components/pre-qual/equity-readout.tsx`

Inline readout shown after Step 1 validates. Two numbers — total equity and borrowing power — framed in advisor voice. No interactive state.

- [ ] **Step 1: Create `components/pre-qual/equity-readout.tsx`** with:

```tsx
import { computeEquity, formatUsd } from "@/lib/pre-qual/equity"

interface EquityReadoutProps {
  homeValue: number
  mortgageBalance: number
}

export function EquityReadout({ homeValue, mortgageBalance }: EquityReadoutProps) {
  const { equity, borrowingPower } = computeEquity({ homeValue, mortgageBalance })

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-brand-mint/40 bg-brand-mint/10 p-5"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-green mb-3">
        Your rough estimate
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-ink-500 mb-1">Equity in your home</p>
          <p className="text-2xl font-bold text-ink-900">{formatUsd(equity)}</p>
        </div>
        <div>
          <p className="text-xs text-ink-500 mb-1">Estimated borrowing power</p>
          <p className="text-2xl font-bold text-brand-green">{formatUsd(borrowingPower)}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-ink-500 leading-relaxed">
        Based on a typical 85% combined loan-to-value. Real lender caps vary —
        the advisor will firm this up on the call.
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Verify typecheck.**

```bash
npx tsc --noEmit 2>&1 | grep -E "^components/pre-qual/equity-readout" || echo "OK - equity-readout clean"
```

Expected: `OK - equity-readout clean`.

- [ ] **Step 3: Commit.**

```bash
git add components/pre-qual/equity-readout.tsx
git commit -m "feat(prequal): add inline equity + borrowing-power readout"
```

---

## Task 5: Best-time chips

**Files:**
- Create: `components/pre-qual/best-time-chips.tsx`

One-tap selector. Single-select. Spec §7: chips read `Mornings · Afternoons · Evenings · Anytime`. No dropdown — chips are the lowest-friction control.

- [ ] **Step 1: Create `components/pre-qual/best-time-chips.tsx`** with:

```tsx
"use client"

import { BEST_TIME_OPTIONS, type BestTime } from "@/lib/pre-qual/schema"

interface BestTimeChipsProps {
  value: BestTime | undefined
  onChange: (value: BestTime) => void
  error?: string
}

export function BestTimeChips({ value, onChange, error }: BestTimeChipsProps) {
  return (
    <div>
      <p id="bestTime-label" className="text-sm font-medium text-ink-900 mb-2">
        Best time to call
      </p>
      <div
        role="radiogroup"
        aria-labelledby="bestTime-label"
        aria-describedby={error ? "bestTime-error" : undefined}
        className="flex flex-wrap gap-2"
      >
        {BEST_TIME_OPTIONS.map((option) => {
          const selected = value === option
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option)}
              className={
                "px-4 py-2 rounded-full text-sm font-medium transition-colors border " +
                (selected
                  ? "bg-brand-blue text-white border-brand-blue"
                  : "bg-white text-ink-700 border-surface-200 hover:border-brand-blue")
              }
            >
              {option}
            </button>
          )
        })}
      </div>
      {error && (
        <p id="bestTime-error" className="text-sm text-red-600 mt-2">
          {error}
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify typecheck.**

```bash
npx tsc --noEmit 2>&1 | grep -E "^components/pre-qual/best-time-chips" || echo "OK - best-time-chips clean"
```

Expected: `OK - best-time-chips clean`.

- [ ] **Step 3: Commit.**

```bash
git add components/pre-qual/best-time-chips.tsx
git commit -m "feat(prequal): add best-time-to-call chip selector"
```

---

## Task 6: The 2-step pre-qual form component

**Files:**
- Create: `components/pre-qual/pre-qual-form.tsx`

The heart of Plan 2. Single client component that owns Step 1 → equity readout → Step 2 → hCaptcha → submit → confirmation, with sessionStorage persistence so back/forward navigation doesn't drop work.

- [ ] **Step 1: Create `components/pre-qual/pre-qual-form.tsx`** with:

```tsx
"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Phone, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import HCaptcha from "@/components/ui/hcaptcha"
import { getMergedTrackingData } from "@/lib/tracking"
import {
  PreQualSubmissionSchema,
  type PreQualSubmission,
  type Step1Values,
  type BestTime,
} from "@/lib/pre-qual/schema"
import { formatCurrency, parseCurrency, formatPhoneNumber, normalizeZip } from "@/lib/pre-qual/masks"
import { lookupZip } from "@/lib/pre-qual/zip-lookup"
import { EquityReadout } from "./equity-readout"
import { BestTimeChips } from "./best-time-chips"
import { slaCopy } from "@/lib/pre-qual/sla"
import type { UseCase } from "@/lib/pre-qual/use-case"

const STORAGE_KEY = "prequal:state"

interface PersistedState {
  zipCode?: string
  city?: string
  state?: string
  homeValueDisplay?: string
  mortgageBalanceDisplay?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  bestTime?: BestTime
  step1Valid?: boolean
}

interface PreQualFormProps {
  useCase: UseCase
  hcaptchaSiteKey?: string
}

export function PreQualForm({ useCase, hcaptchaSiteKey }: PreQualFormProps) {
  const [step1Valid, setStep1Valid] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [hcaptchaToken, setHcaptchaToken] = useState("")
  const [zipLookupPending, setZipLookupPending] = useState(false)

  // Display strings for the currency-masked inputs (React Hook Form holds the
  // numeric values; these track what the user actually sees in the input).
  const [homeValueDisplay, setHomeValueDisplay] = useState("")
  const [mortgageBalanceDisplay, setMortgageBalanceDisplay] = useState("")

  const {
    register,
    setValue,
    getValues,
    watch,
    trigger,
    formState: { errors },
    handleSubmit,
  } = useForm<PreQualSubmission>({
    resolver: zodResolver(PreQualSubmissionSchema),
    defaultValues: {
      zipCode: "",
      city: "",
      state: "",
      homeValue: 0,
      mortgageBalance: 0,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      bestTime: undefined,
      useCase,
      formType: "pre-qual-v1",
    },
    mode: "onTouched",
  })

  // Rehydrate persisted state on mount.
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const saved = JSON.parse(raw) as PersistedState
      if (saved.zipCode) setValue("zipCode", saved.zipCode)
      if (saved.city) setValue("city", saved.city)
      if (saved.state) setValue("state", saved.state)
      if (saved.homeValueDisplay) {
        setHomeValueDisplay(saved.homeValueDisplay)
        setValue("homeValue", parseCurrency(saved.homeValueDisplay))
      }
      if (saved.mortgageBalanceDisplay) {
        setMortgageBalanceDisplay(saved.mortgageBalanceDisplay)
        setValue("mortgageBalance", parseCurrency(saved.mortgageBalanceDisplay))
      }
      if (saved.firstName) setValue("firstName", saved.firstName)
      if (saved.lastName) setValue("lastName", saved.lastName)
      if (saved.email) setValue("email", saved.email)
      if (saved.phone) setValue("phone", saved.phone)
      if (saved.bestTime) setValue("bestTime", saved.bestTime)
      if (saved.step1Valid) setStep1Valid(true)
    } catch {
      // Corrupted storage — start fresh.
    }
  }, [setValue])

  // Persist on any tracked-field change.
  const tracked = watch([
    "zipCode",
    "city",
    "state",
    "firstName",
    "lastName",
    "email",
    "phone",
    "bestTime",
  ])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (submitted) return
    const state: PersistedState = {
      zipCode: getValues("zipCode"),
      city: getValues("city") ?? undefined,
      state: getValues("state") ?? undefined,
      homeValueDisplay,
      mortgageBalanceDisplay,
      firstName: getValues("firstName"),
      lastName: getValues("lastName"),
      email: getValues("email"),
      phone: getValues("phone"),
      bestTime: getValues("bestTime"),
      step1Valid,
    }
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Quota exceeded or private mode — silently drop.
    }
  }, [tracked, homeValueDisplay, mortgageBalanceDisplay, step1Valid, submitted, getValues])

  const onZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalized = normalizeZip(e.target.value)
    setValue("zipCode", normalized)
    if (normalized.length >= 5) {
      setZipLookupPending(true)
      const loc = await lookupZip(normalized)
      setZipLookupPending(false)
      if (loc) {
        setValue("city", loc.city)
        setValue("state", loc.state)
      } else {
        setValue("city", "")
        setValue("state", "")
      }
    } else {
      setValue("city", "")
      setValue("state", "")
    }
  }

  const onCurrencyChange = (
    setter: (v: string) => void,
    field: "homeValue" | "mortgageBalance",
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value)
    setter(formatted)
    setValue(field, parseCurrency(formatted))
  }

  const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("phone", formatPhoneNumber(e.target.value))
  }

  const onContinue = async () => {
    const ok = await trigger(["zipCode", "homeValue", "mortgageBalance"])
    if (ok) setStep1Valid(true)
  }

  const onSubmitInner = async (data: PreQualSubmission) => {
    setSubmitError(null)
    setSubmitting(true)
    const tracking = (() => {
      try {
        return getMergedTrackingData()
      } catch {
        return {}
      }
    })()
    const payload: PreQualSubmission = {
      ...data,
      useCase,
      formType: "pre-qual-v1",
      hcaptchaToken: hcaptchaToken || undefined,
      ...tracking,
    }
    try {
      const response = await fetch("/api/submit-prequal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await response.json().catch(() => ({}))
      if (!response.ok || json?.success !== true) {
        setSubmitError(json?.message || "Something went wrong. Please try again.")
        setSubmitting(false)
        return
      }
      try {
        sessionStorage.removeItem(STORAGE_KEY)
      } catch {
        // ignore
      }
      setSubmitted(true)
      setSubmitting(false)
    } catch {
      setSubmitError("Network error. Please try again.")
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-brand-green/30 bg-brand-green/10 p-6"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-green mb-2">
          You're in.
        </p>
        <p className="text-2xl font-bold text-ink-900 mb-3">{slaCopy()}</p>
        <p className="text-sm text-ink-700">
          We'll walk you through the trade-offs before any commitment. No credit pull yet.
        </p>
      </div>
    )
  }

  const homeValueNumber = parseCurrency(homeValueDisplay)
  const mortgageBalanceNumber = parseCurrency(mortgageBalanceDisplay)

  return (
    <form onSubmit={handleSubmit(onSubmitInner)} className="space-y-6" noValidate>
      {/* Hidden context fields — written by React Hook Form via defaultValues. */}
      <input type="hidden" {...register("useCase")} />
      <input type="hidden" {...register("formType")} />

      {/* Step 1 — home */}
      <section aria-labelledby="step1-heading" className="space-y-4">
        <div>
          <h2 id="step1-heading" className="text-display-sm text-ink-900">
            Tell us about your home
          </h2>
          <p className="text-sm text-ink-500 mt-1">
            Three quick questions. We'll show you a rough borrowing estimate before asking
            anything else.
          </p>
        </div>

        <div>
          <Label htmlFor="zipCode" className="text-ink-900">
            Property ZIP
          </Label>
          <Input
            id="zipCode"
            inputMode="numeric"
            autoComplete="postal-code"
            value={watch("zipCode") || ""}
            onChange={onZipChange}
            aria-invalid={errors.zipCode ? "true" : "false"}
            aria-describedby={errors.zipCode ? "zipCode-error" : "zipCode-help"}
            className="mt-1"
          />
          <p id="zipCode-help" className="text-xs text-ink-500 mt-1">
            {zipLookupPending
              ? "Looking up city and state…"
              : watch("city") && watch("state")
                ? `${watch("city")}, ${watch("state")}`
                : "We'll auto-fill city and state."}
          </p>
          {errors.zipCode && (
            <p id="zipCode-error" className="text-sm text-red-600 mt-1">
              {errors.zipCode.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="homeValue" className="text-ink-900">
            Home value (rough estimate)
          </Label>
          <Input
            id="homeValue"
            inputMode="numeric"
            value={homeValueDisplay}
            onChange={onCurrencyChange(setHomeValueDisplay, "homeValue")}
            placeholder="$425,000"
            aria-invalid={errors.homeValue ? "true" : "false"}
            aria-describedby={errors.homeValue ? "homeValue-error" : "homeValue-help"}
            className="mt-1"
          />
          <p id="homeValue-help" className="text-xs text-ink-500 mt-1">
            Your best guess from Zillow or your last appraisal is fine — we'll firm this up later.
          </p>
          {errors.homeValue && (
            <p id="homeValue-error" className="text-sm text-red-600 mt-1">
              {errors.homeValue.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="mortgageBalance" className="text-ink-900">
            Mortgage balance
          </Label>
          <Input
            id="mortgageBalance"
            inputMode="numeric"
            value={mortgageBalanceDisplay}
            onChange={onCurrencyChange(setMortgageBalanceDisplay, "mortgageBalance")}
            placeholder="$210,000"
            aria-invalid={errors.mortgageBalance ? "true" : "false"}
            aria-describedby={errors.mortgageBalance ? "mortgageBalance-error" : "mortgageBalance-help"}
            className="mt-1"
          />
          <p id="mortgageBalance-help" className="text-xs text-ink-500 mt-1">
            From your most recent statement — round to the nearest thousand.
          </p>
          {errors.mortgageBalance && (
            <p id="mortgageBalance-error" className="text-sm text-red-600 mt-1">
              {errors.mortgageBalance.message}
            </p>
          )}
        </div>

        {!step1Valid && (
          <Button
            type="button"
            onClick={onContinue}
            className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-semibold py-3"
          >
            See how much you can unlock →
          </Button>
        )}
      </section>

      {/* Readout — visible once Step 1 validates */}
      {step1Valid && homeValueNumber > 0 && (
        <EquityReadout homeValue={homeValueNumber} mortgageBalance={mortgageBalanceNumber} />
      )}

      {/* Step 2 — contact (revealed after Step 1 validates) */}
      {step1Valid && (
        <section aria-labelledby="step2-heading" className="space-y-4 pt-2">
          <div>
            <h2 id="step2-heading" className="text-display-sm text-ink-900">
              How should we reach you?
            </h2>
            <p className="text-sm text-ink-500 mt-1">
              A licensed advisor — not a sales rep — will call to walk you through the trade-offs.
              No credit pull.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-ink-900">First name</Label>
              <Input
                id="firstName"
                autoComplete="given-name"
                {...register("firstName")}
                aria-invalid={errors.firstName ? "true" : "false"}
                aria-describedby={errors.firstName ? "firstName-error" : undefined}
                className="mt-1"
              />
              {errors.firstName && (
                <p id="firstName-error" className="text-sm text-red-600 mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName" className="text-ink-900">Last name</Label>
              <Input
                id="lastName"
                autoComplete="family-name"
                {...register("lastName")}
                aria-invalid={errors.lastName ? "true" : "false"}
                aria-describedby={errors.lastName ? "lastName-error" : undefined}
                className="mt-1"
              />
              {errors.lastName && (
                <p id="lastName-error" className="text-sm text-red-600 mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-ink-900">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="mt-1"
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone" className="text-ink-900">Phone</Label>
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={watch("phone") || ""}
              onChange={onPhoneChange}
              placeholder="(313) 555-0199"
              aria-invalid={errors.phone ? "true" : "false"}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className="mt-1"
            />
            {errors.phone && (
              <p id="phone-error" className="text-sm text-red-600 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <BestTimeChips
            value={watch("bestTime")}
            onChange={(v) => setValue("bestTime", v, { shouldValidate: true })}
            error={errors.bestTime?.message}
          />

          <HCaptcha
            onVerify={setHcaptchaToken}
            onExpire={() => setHcaptchaToken("")}
            sitekey={hcaptchaSiteKey}
          />

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-semibold py-3 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Phone className="w-4 h-4 mr-2" />
                Talk to an advisor
              </>
            )}
          </Button>

          {submitError && (
            <p role="alert" className="text-sm text-red-600">
              {submitError}
            </p>
          )}

          <p className="text-xs text-ink-500 leading-relaxed">
            No credit pull. We share your info only after you approve a specific lender.
          </p>
        </section>
      )}
    </form>
  )
}
```

- [ ] **Step 2: Verify typecheck.**

```bash
npx tsc --noEmit 2>&1 | grep -E "^components/pre-qual/pre-qual-form" || echo "OK - pre-qual-form clean"
```

Expected: `OK - pre-qual-form clean`.

- [ ] **Step 3: Run production build to make sure nothing else broke.**

```bash
npm run build 2>&1 | tail -15
```

Expected: build succeeds. The component isn't mounted yet — Task 9 mounts it — so this is just verifying compilation.

- [ ] **Step 4: Commit.**

```bash
git add components/pre-qual/pre-qual-form.tsx
git commit -m "feat(prequal): build 2-step pre-qual form — progressive reveal, sessionStorage persistence"
```

(Em dash `—` between "form" and "progressive". Plan verbatim.)

---

## Task 7: Sticky CTA suppression — marker + wire-up

**Files:**
- Create: `components/pre-qual/sticky-cta-suppress.tsx`
- Modify: `components/sticky-cta.tsx`

Plan 1 carry-forward. Wire the sticky CTA so it hides while the pre-qual form (or any other modal-flavored UI in the future) is mounted. Uses a `body` data attribute + MutationObserver — no Context provider, no `app/layout.tsx` server/client boundary disruption.

- [ ] **Step 1: Create `components/pre-qual/sticky-cta-suppress.tsx`** with:

```tsx
"use client"

import { useEffect } from "react"

// While this component is mounted, sets body[data-suppress-sticky-cta="1"].
// StickyCta watches that attribute and hides itself when present.
// Reusable: any future modal/full-screen flow can drop this in to suppress
// the sticky CTA without importing the CTA itself.
export function StickyCtaSuppress() {
  useEffect(() => {
    if (typeof document === "undefined") return
    const prev = document.body.dataset.suppressStickyCta
    document.body.dataset.suppressStickyCta = "1"
    return () => {
      if (prev === undefined) {
        delete document.body.dataset.suppressStickyCta
      } else {
        document.body.dataset.suppressStickyCta = prev
      }
    }
  }, [])
  return null
}
```

- [ ] **Step 2: Modify `components/sticky-cta.tsx`** — add a suppression-watching effect alongside the existing scroll effect, and gate the visible-render on the suppression flag.

Read the current file first to identify the exact insertion points. The component already has:
- `"use client"` at the top
- `useState` for `visible` and `dismissed`
- A `useEffect` block for scroll + sessionStorage dismiss

Add a new `useState` for `suppressed`, a second `useEffect` for the MutationObserver, and update the early-return guard.

**Specific edits:**

After the line `const [dismissed, setDismissed] = useState(false)`, add:

```tsx
  const [suppressed, setSuppressed] = useState(false)
```

After the existing scroll `useEffect` closes (the one ending with `}, [])` that handles scroll + sessionStorage), add a second `useEffect`:

```tsx
  useEffect(() => {
    if (typeof document === "undefined") return
    const check = () => {
      setSuppressed(document.body.dataset.suppressStickyCta === "1")
    }
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-suppress-sticky-cta"],
    })
    return () => observer.disconnect()
  }, [])
```

Change the early-return guard from:

```tsx
  if (dismissed || !visible) return null
```

to:

```tsx
  if (dismissed || suppressed || !visible) return null
```

- [ ] **Step 3: Verify typecheck.**

```bash
npx tsc --noEmit 2>&1 | grep -E "^components/(pre-qual/sticky-cta-suppress|sticky-cta)" || echo "OK - sticky-cta + suppress clean"
```

Expected: `OK - sticky-cta + suppress clean`.

- [ ] **Step 4: Run production build.**

```bash
npm run build 2>&1 | tail -10
```

Expected: success.

- [ ] **Step 5: Commit.**

```bash
git add components/pre-qual/sticky-cta-suppress.tsx components/sticky-cta.tsx
git commit -m "feat(prequal): sticky CTA modal-aware suppression via body data attribute"
```

---

## Task 8: Submit-prequal API endpoint

**Files:**
- Create: `app/api/submit-prequal/route.ts`

POST handler. Re-validates with the same Zod schema the client used, optionally verifies hCaptcha against `HCAPTCHA_SECRET`, then proxies to the existing lender webhook with a `formType: "pre-qual-v1"` discriminator so the receiver can route on form shape.

- [ ] **Step 1: Create `app/api/submit-prequal/route.ts`** with:

```ts
import { NextRequest, NextResponse } from "next/server"
import { PreQualSubmissionSchema } from "@/lib/pre-qual/schema"

// Same webhook destination the legacy submit-mortgage endpoint uses
// (app/api/submit-mortgage/route.ts line 11). Hardcoded here to match
// the existing pattern; both should move to an env var in a future
// tooling pass.
const LENDER_WEBHOOK_URL =
  "https://webhooks-listener-woad.vercel.app/api/webhook/f129713b-67b2-4302-9ca0-b2884e21d682"

const HCAPTCHA_VERIFY_URL = "https://api.hcaptcha.com/siteverify"

interface HCaptchaVerifyResponse {
  success: boolean
  "error-codes"?: string[]
}

async function verifyHCaptcha(token: string, secret: string): Promise<boolean> {
  try {
    const body = new URLSearchParams({ response: token, secret })
    const response = await fetch(HCAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    })
    if (!response.ok) return false
    const data = (await response.json()) as HCaptchaVerifyResponse
    return data.success === true
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 },
    )
  }

  const parsed = PreQualSubmissionSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    )
  }

  const data = parsed.data

  // hCaptcha verification — only enforced when HCAPTCHA_SECRET is set.
  // Mirrors the existing 9-step form's dev-skip pattern.
  const hcaptchaSecret = process.env.HCAPTCHA_SECRET
  if (hcaptchaSecret) {
    if (!data.hcaptchaToken) {
      return NextResponse.json(
        { success: false, message: "hCaptcha required" },
        { status: 400 },
      )
    }
    const ok = await verifyHCaptcha(data.hcaptchaToken, hcaptchaSecret)
    if (!ok) {
      return NextResponse.json(
        { success: false, message: "hCaptcha verification failed" },
        { status: 400 },
      )
    }
  }

  // Forward to the lender webhook. Strip the token from the outbound payload
  // since the lender side doesn't need it after we've verified.
  const { hcaptchaToken: _drop, ...outbound } = data
  void _drop

  try {
    const response = await fetch(LENDER_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...outbound,
        submittedAt: new Date().toISOString(),
        userAgent: request.headers.get("user-agent") || undefined,
      }),
    })
    if (!response.ok) {
      const errorText = await response.text().catch(() => "")
      console.error("Lender webhook returned non-OK:", response.status, errorText)
      return NextResponse.json(
        { success: false, message: "Lead routing failed. Please try again." },
        { status: 502 },
      )
    }
    return NextResponse.json({ success: true, message: "Submitted" })
  } catch (error) {
    console.error("Lender webhook error:", error)
    return NextResponse.json(
      { success: false, message: "Lead routing failed. Please try again." },
      { status: 502 },
    )
  }
}
```

- [ ] **Step 2: Verify typecheck.**

```bash
npx tsc --noEmit 2>&1 | grep -E "^app/api/submit-prequal" || echo "OK - submit-prequal clean"
```

Expected: `OK - submit-prequal clean`.

- [ ] **Step 3: Run production build.**

```bash
npm run build 2>&1 | tail -10
```

Expected: success. The new route should appear in the build's route manifest.

- [ ] **Step 4: Smoke-test the validation rejection path** (the success path requires a real webhook reachable; we'll exercise that during the manual browser pass).

```bash
# In one terminal, run the dev server.
npm run dev -- -p 3002

# In another terminal, post an empty body — expect 400 with field errors.
curl -s -X POST http://localhost:3002/api/submit-prequal \
  -H "Content-Type: application/json" \
  -d '{}' | head -200
```

Expected: JSON response with `"success": false`, `"message": "Validation failed"`, and an `errors` object naming several required fields (zipCode, homeValue, mortgageBalance, firstName, lastName, email, phone, bestTime, useCase, formType).

- [ ] **Step 5: Commit.**

```bash
git add app/api/submit-prequal/route.ts
git commit -m "feat(prequal): add submit-prequal API route — Zod re-validate, hCaptcha verify, webhook proxy"
```

---

## Task 9: Standalone `/pre-qual` route

**Files:**
- Create: `app/pre-qual/page.tsx`

The landing surface for the header CTA and the sticky CTA. Mounts the form with `useCase="universal"` (no specific spoke context). Also mounts the suppress marker so the sticky CTA hides while the user's on this page.

- [ ] **Step 1: Create `app/pre-qual/page.tsx`** with:

```tsx
import type { Metadata } from "next"
import { PreQualForm } from "@/components/pre-qual/pre-qual-form"
import { StickyCtaSuppress } from "@/components/pre-qual/sticky-cta-suppress"

export const metadata: Metadata = {
  title: "Talk to a HELOC advisor — free, no obligation",
  description:
    "Two-step pre-qual: tell us about your home, see a rough borrowing estimate, then a licensed advisor walks you through the trade-offs. No credit pull.",
  alternates: { canonical: "/pre-qual" },
}

export default function PreQualPage() {
  return (
    <main className="bg-surface-50 min-h-[80vh]">
      <StickyCtaSuppress />
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="max-w-2xl mx-auto">
          <header className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue mb-2">
              The HELOC advisor
            </p>
            <h1 className="text-display-lg text-ink-900">
              See what your home equity can do — in under a minute.
            </h1>
            <p className="text-base text-ink-700 mt-3">
              Three quick questions about your home. We'll show you a rough borrowing
              estimate, then a licensed advisor (not a sales rep) calls you to walk
              through the trade-offs.
            </p>
          </header>
          <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 lg:p-8">
            <PreQualForm useCase="universal" />
          </div>
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Verify typecheck.**

```bash
npx tsc --noEmit 2>&1 | grep -E "^app/pre-qual/page" || echo "OK - pre-qual page clean"
```

Expected: `OK - pre-qual page clean`.

- [ ] **Step 3: Run production build.**

```bash
npm run build 2>&1 | tail -10
```

Expected: success. `/pre-qual` should appear in the route manifest.

- [ ] **Step 4: Manual smoke test in the browser.**

With `npm run dev` running, visit `http://localhost:3002/pre-qual`. Verify:
- H1 renders ("See what your home equity can do…")
- Step 1 fields visible: ZIP, Home value, Mortgage balance
- Step 2 fields and CTA are NOT visible yet
- Type a real 5-digit ZIP (e.g., `48226` Detroit) — city/state line should auto-fill within 1–2 seconds
- Type a home value and mortgage balance, then click "See how much you can unlock" — Step 1 should validate, the equity readout should appear, and Step 2 fields should reveal
- The header sticky-on-scroll still works on this page
- The bottom-right sticky CTA does NOT appear (suppression marker working)
- Reload the page — your typed values rehydrate from sessionStorage

- [ ] **Step 5: Commit.**

```bash
git add app/pre-qual/page.tsx
git commit -m "feat(prequal): add /pre-qual standalone route"
```

---

## Task 10: Retarget header + sticky CTA to `/pre-qual`

**Files:**
- Modify: `config/header-nav.json`
- Modify: `components/sticky-cta.tsx`

Plan 1 left both CTAs pointing at `/contact` as placeholders. Now that `/pre-qual` exists, swap them. `/contact` stays in the footer Company column (it's the general-inquiry page — distinct from the lead funnel).

- [ ] **Step 1: Modify `config/header-nav.json`.** Find the entry:

```json
{
    "label": "Talk to an advisor",
    "url": "/contact",
    "type": "cta-button",
    "icon": null
}
```

Change `"url": "/contact"` to `"url": "/pre-qual"`. Leave every other field untouched.

- [ ] **Step 2: Modify `components/sticky-cta.tsx`** — find the first `<Link>` that points at `/contact`:

```tsx
        <Link
          href="/contact"
          className="flex items-center gap-2 px-4 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
        >
```

Change `href="/contact"` to `href="/pre-qual"`. Leave the `/#calculator` Link untouched — that's Plan 3 territory.

- [ ] **Step 3: Verify JSON parses + typecheck.**

```bash
node -e "JSON.parse(require('fs').readFileSync('config/header-nav.json','utf-8')); console.log('OK')"
npx tsc --noEmit 2>&1 | grep -E "^(components/sticky-cta|config/header-nav)" || echo "OK - retargets clean"
```

Expected: `OK` from node, `OK - retargets clean` from grep.

- [ ] **Step 4: Run production build.**

```bash
npm run build 2>&1 | tail -10
```

Expected: success.

- [ ] **Step 5: Browser smoke test.**

With dev server running, on `http://localhost:3002/`:
- Click "Talk to an advisor" in the header → should navigate to `/pre-qual`
- Scroll past 30% on any page (e.g., `/blog`) — the sticky CTA appears — click "Talk to advisor" → should navigate to `/pre-qual`
- On `/pre-qual` itself, the sticky CTA should NOT appear (suppression marker)

- [ ] **Step 6: Commit.**

```bash
git add config/header-nav.json components/sticky-cta.tsx
git commit -m "feat(prequal): retarget header + sticky CTA Talk-to-advisor to /pre-qual"
```

---

## Task 11: Final verification + tag `prequal-v1`

**Files:**
- Modify: none (verification + tag only)

- [ ] **Step 1: Confirm working tree is clean.**

```bash
git status
```

Expected: nothing to commit (apart from gitignored `.superpowers/`).

- [ ] **Step 2: Full production build.**

```bash
npm run build 2>&1 | tail -30
```

Expected: build succeeds. The route manifest should include:
- `ƒ /pre-qual` (or `○` if statically prerendered — both are acceptable)
- `ƒ /api/submit-prequal`

Both are new; the existing routes should still build unchanged.

- [ ] **Step 3: Typecheck the whole pre-qual surface.**

```bash
npx tsc --noEmit 2>&1 | grep -E "^(lib/pre-qual|components/pre-qual|app/pre-qual|app/api/submit-prequal|components/sticky-cta|config/header-nav)" || echo "OK - prequal surface clean"
```

Expected: `OK - prequal surface clean`.

- [ ] **Step 4: Search for any stray `/contact` references that should have been retargeted.**

```bash
grep -nE '"/contact"|href="/contact"|url="/contact"' \
  config/header-nav.json \
  components/header.tsx \
  components/sticky-cta.tsx \
  components/pre-qual/
```

Expected results — **only** the footer-nav `Contact` entry should still point at `/contact`, but the grep is bounded to header/sticky/pre-qual paths so any match here is a bug. Empty output is what we want.

Cross-check the footer separately (where `/contact` is intentional):

```bash
grep -n '"/contact"' config/footer-nav.json
```

Expected: exactly one match — the `Company` column's `Contact` entry. That one stays.

- [ ] **Step 5: Confirm the legacy 9-step form is still dead code** (i.e., still has no callers — Plan 2 doesn't delete it, but we want to confirm it didn't accidentally get wired in during this plan).

```bash
grep -rn "MortgageApplicationForm\|MortgageApplicationWrapper" \
  app/ components/ --include='*.tsx' --include='*.ts' | grep -v "components/mortgage-application/"
```

Expected: no matches.

- [ ] **Step 6: Manual end-to-end smoke test.**

With dev server running:
1. Visit `http://localhost:3002/`
2. Click header "Talk to an advisor" → lands on `/pre-qual`
3. Fill Step 1: ZIP `48226`, home value `$425,000`, mortgage balance `$210,000`
4. Click "See how much you can unlock" → equity readout appears showing roughly Equity `$215,000`, Borrowing power `$151,250` (≈ 85% × 425k − 210k)
5. Fill Step 2: name, email, phone, best-time chip
6. Complete the hCaptcha challenge
7. Click "Talk to an advisor"
8. Confirmation panel shows: "A HELOC360 advisor will call you within 2 hours."
9. Reload the page — confirmation persists? **No** — sessionStorage should have been cleared on success. The form should re-mount empty.

(If the lender webhook is unreachable from local dev, the submit will return 502 — that's expected; the validation+UX flow is what we're confirming, not the actual lead delivery. Real submit test happens post-deploy.)

- [ ] **Step 7: Tag the milestone.**

```bash
git tag prequal-v1
git tag -l 'prequal-v1' -n10
```

(Lightweight tag, no `-m`. Same pattern as `foundation-v1`.)

---

## Done

At this point:
- `/pre-qual` is live on-domain with the 2-step / 5-question form.
- Header "Talk to an advisor" and sticky CTA both route to `/pre-qual`.
- Sticky CTA hides on the `/pre-qual` page (modal-aware suppression).
- Submissions hit `/api/submit-prequal`, get re-validated server-side, optionally hCaptcha-verified, and proxy to the lender webhook with a `formType: "pre-qual-v1"` discriminator.
- The legacy 9-step form file (`components/mortgage-application/*`) is unchanged. Cleanup is a separate concern.

**Plan 1 carry-forward retired by this plan:**
- ✅ Sticky-CTA modal suppression (was: "deferred to Plan 2 when forms exist")
- ✅ Retarget `/contact` placeholder → `/pre-qual` (header CTA + sticky CTA)

**Hand off:** When ready, run `superpowers:writing-plans` again to produce **Plan 3 (Homepage hybrid hero)** — that one will mount the same `<PreQualForm />` inline above-the-fold with the universal calculator framing and add the `#how-it-works` + `#calculator` section anchors that Plan 1's nav already links to.

---

## Plan self-review

**Spec coverage (Phase 1 pre-qual subset of the design spec):**
- ✅ Step 1 — ZIP, home value, mortgage balance with currency masks + ZIP auto-fill — Tasks 2, 3, 6 (spec §7 Step 1)
- ✅ Equity + borrowing-power inline readout after Step 1 — Tasks 3, 4, 6 (spec §7 Step 1 closing)
- ✅ Step 2 — first/last name, email, phone, best-time chips — Tasks 3, 5, 6 (spec §7 Step 2)
- ✅ hCaptcha on Step 2 only — Task 6 (spec §7 hCaptcha behavior; spec §8 hCaptcha row)
- ✅ Use case captured silently from URL/prop, hidden field — Tasks 1, 3, 6 (spec §7 "Context the form never asks")
- ✅ UTM captured silently — Task 6 uses `getMergedTrackingData` from existing `@/lib/tracking` (spec §7 UTM row)
- ✅ Borrower type / employment / income / credit / DTI **not asked** — schema doesn't include them (spec §7 "Not asked")
- ✅ Confirmation copy "advisor will call you in X hours" pulled from single config — Tasks 1, 6 (spec §7 Confirmation)
- ✅ sessionStorage persistence so back/forward doesn't drop progress — Task 6 (spec §7 Implementation notes)
- ✅ Retire `get-started.heloc360.com` references in the in-repo chrome — Task 10 (spec §8 row 1; spec §3 non-goal)
- ✅ Drop Broker + both Investor borrower types — schema doesn't include `borrowerType` at all (spec §8 row 3; spec §3)
- ✅ Sticky CTA suppression while form is open — Task 7 (spec §11 sticky CTA suppression; Plan 1 carry-forward)
- ❌ Mailing list capture — **deliberately deferred to Plan 6** per the original Phase 1 decomposition. The footer mailing list form already exists structurally (Plan 1 Task 7) but doesn't POST anywhere yet.
- ❌ GA4 funnel events on the new form — **deferred to Plan 5**. The form uses `getMergedTrackingData` for UTM capture so Plan 5 can wire events without re-architecting.
- ❌ Embed the form inline on homepage + spoke pages — **deferred to Plans 3 and 4**. The `<PreQualForm useCase={...} />` component API is already designed for those embeds.

**Placeholder scan:** No `TBD`, `TODO`, or `implement later` markers in the plan text. Where future-plan placeholders exist (form is not yet embedded in homepage / spokes; mailing-list form not yet wired), they're called out explicitly so the Plan 3/4/6 writers know to swap them.

**Type consistency:**
- `UseCase` type defined in Task 1, consumed in Tasks 3 (schema), 6 (form prop), 9 (page passes `"universal"`). Same enum throughout.
- `BestTime` type defined in Task 3 (schema), consumed in Tasks 5 (chips) and 6 (form). Single source.
- `PreQualSubmission` type defined in Task 3, consumed in Task 6 (client-side RHF) and Task 8 (server-side re-validate). Same Zod schema imported on both sides.
- `EquityNumbers` type defined in Task 3, consumed in Task 4 (readout component). Single source.
- `formatCurrency`, `parseCurrency`, `formatPhoneNumber`, `normalizeZip` defined in Task 1 (`masks.ts`), consumed in Task 6 only. Single source.
- `lookupZip` defined in Task 2, consumed in Task 6 only. Single source.
- `slaCopy()` defined in Task 1, consumed in Task 6 confirmation panel. Single source.
- `LENDER_WEBHOOK_URL` is hardcoded in Task 8 — explicitly called out as following the existing `submit-mortgage` pattern; both should move to env var in a future tooling pass (not in scope here).

**Scope check:** The plan touches **9 new files and 2 existing files** (header-nav.json, sticky-cta.tsx), producing approximately 11 commits. Each task is independently revertable. The plan does NOT touch:
- `app/page.tsx` (homepage hero — Plan 3)
- Any spoke page (Plan 4)
- The legacy `components/mortgage-application/*` (deferred cleanup)
- The footer mailing list form (Plan 6)
- `lib/tracking.ts` (Plan 5 may extend; Plan 2 only consumes)
- `app/api/submit-mortgage/route.ts` (legacy endpoint, left in place during transition)

**Risk surface to monitor post-merge:**
- Real hCaptcha sitekey isn't wired in this plan — the component falls back to the hCaptcha test sitekey. Form passes test-mode tokens; real production needs the prop set + `HCAPTCHA_SECRET` env var. Document for Vercel env config.
- The lender webhook URL is hardcoded. If the receiving service URL changes, both `submit-mortgage` and `submit-prequal` need updating. Tooling task: factor to a shared constant or env var.
- `getMergedTrackingData()` is called inside a try/catch — if `lib/tracking.ts` throws on a fresh session (no UTM history yet), we want graceful degradation. The catch returns `{}` so the submission still goes through without UTM context — good enough for Plan 2.
