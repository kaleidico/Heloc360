# HELOC360 — Worklog

Per-session work log. Most recent session at the top. Append after each session.

---

## 2026-05-28 PM — Plan 2 (Pre-Qual Form) written, executed, shipped, tagged `prequal-v1`

### Session goal
Plan 2 was the next move per the spec phasing — replace the leaky external `get-started.heloc360.com` 9-step form with an on-domain 2-step / 5-question pre-qual form. Goal of the session: write the plan, then execute it end-to-end via Subagent-Driven Development with two-stage review per task, then close out.

### Outcome
Plan 2 is shipped. The plan file (1650 lines) was written, then all 11 tasks executed with three review-driven fix commits landing in-loop. One post-tag hotfix (`dc25d89`) followed after a browser smoke test surfaced a real bug in the pre-existing `components/ui/hcaptcha.tsx`. Local `main` is **15 commits ahead of `origin/main`** (Plan 2 = 14 commits + hotfix), tagged `prequal-v1` at the 11-task milestone, push decision pending Robert.

### What was written before any task executed

**Plan 2 — `docs/superpowers/plans/2026-05-28-heloc360-prequal-form.md` (1650 lines)** — committed at `9fbaf1e`.

Plan structure: header → architectural decisions table (locked at plan-write time) → file structure (15 paths) → 11 tasks with verbatim code blocks for every file → self-review.

Key architectural decisions documented at plan-write time:
- New `/pre-qual` route (standalone) + form component reusable for spoke/homepage embeds (Plans 3/4)
- Single API route at `/api/submit-prequal`, NOT Server Action (codebase doesn't use Server Actions; don't introduce mid-plan)
- Same lender webhook URL as legacy `submit-mortgage`, discriminated by `formType: "pre-qual-v1"` (single ingestion point on lender side)
- hCaptcha sitekey optional prop with default test key; server verify env-gated on `HCAPTCHA_SECRET` (matches legacy dev-skip)
- Single Zod schema validated incrementally via `trigger(['zipCode', 'homeValue', 'mortgageBalance'])`; same schema enforced on server side
- Borrower-type / employment / income / credit / DTI **not asked** (spec §7/§8 explicit drop)
- Legacy 9-step form **left in place as dead code** — cleanup deferred to tech-debt pass
- Sticky CTA suppression via `body[data-suppress-sticky-cta]` data attribute + MutationObserver — avoids forcing `app/layout.tsx` to Client

The plan-writing surface itself was paused once by a mid-stream API error (likely output-token limit on a single big Write). Recovery: split the plan file write into multiple Edits (header + scaffolding + Tasks 1-3 in first Write; Tasks 4-5 appended; Task 6 appended; Tasks 7-9 appended; Tasks 10-11 + self-review appended). No code lost, no retry corrupted state.

### Tasks executed today (all via Subagent-Driven Development)

Each task: implementer (sonnet) → spec-compliance reviewer → code-quality reviewer (`superpowers:code-reviewer`). Re-dispatch on Critical/Important issues; mark complete on dual approval.

| Task | Status | Commit(s) | Notes |
|---|---|---|---|
| Task 1: lib scaffolding (sla + use-case + masks) | ✅ | `c262287` | Implementer caught a real TS bug in plan code: `SLA_HOURS = 2` inferred as literal `2`, breaking the `SLA_HOURS === 1` ternary. Fix: `: number` annotation. Approved by reviewer as legitimate plan-code bug fix. |
| Task 2: ZIP lookup helper | ✅ | `c3ffc82` | Pure async leaf wrapping zippopotam.us. First pass clean; flagged whitespace-input + no-timeout as Minor notes for Task 6's consumer to handle. |
| Task 3: Zod schemas + equity calculator | ✅ | `b14239f` | Two files. Schema uses `.merge().merge().extend()` chain producing `PreQualSubmissionSchema` with `formType: z.literal("pre-qual-v1")` discriminator. Code reviewer's one Minor: cross-reference docstring between `formatUsd` (display) and `formatCurrency` (input mask). Deferred. |
| Task 4: equity readout component | ✅ | `f09a64f` | Server Component, pure render. Reviewer Minor: hardcoded `"85%"` in disclaimer copy could drift if `MAX_CLTV` changes. Acceptable; grep for `85%` catches it. |
| Task 5: best-time chips | ✅ + fix | `9e34bc8`, `ae642e1` | Code-quality reviewer caught real a11y gap: WAI-ARIA radiogroup pattern requires roving tabindex + arrow-key navigation; the prescribed code used default `tabindex="0"` on every chip and no `onKeyDown`. WCAG AA was satisfied but APG pattern wasn't. Fix added the keyboard pattern (24 insertions, 1 deletion). |
| Task 6: pre-qual form (the big one) | ✅ + fix | `d1686bf`, `1abafed` | 491-line component. Code-quality reviewer caught **two Important** issues: (1) the wire payload spread order was `{ ...data, useCase, formType, ..., ...tracking }` — `...tracking` last would silently overwrite the explicit fields if any keys collided, and would send `userAgent`/`ipAddress` (not in schema) onward; (2) the ZIP lookup race condition was unguarded — fast typers could have a stale `48226` result overwrite a fresh `48227` result. Both fixed in `1abafed`: spread reordered to `{ ...tracking, ...data, useCase, formType, hcaptchaToken }`; `pendingZipRef` ref + post-await staleness check added. Bonus cleanup: unused `Step1Values` import dropped. |
| Task 7: sticky CTA suppression | ✅ | `c744936` | Plan 1 carry-forward retired. New `<StickyCtaSuppress />` component + `MutationObserver` watcher in `sticky-cta.tsx`. Approved first pass. |
| Task 8: submit-prequal API endpoint | ✅ + fix | `0882142`, `ef64bc9` | Server-side Zod re-validate + env-gated hCaptcha verify + lender webhook proxy with `formType: "pre-qual-v1"` discriminator. Live curl smoke test confirmed validation rejection path returns all 10 expected required-field errors. Code-quality reviewer flagged two doc-grade Important items: (1) schema's `hcaptchaToken: z.string().optional()` is asymmetric with the handler's runtime requirement when `HCAPTCHA_SECRET` is set — added 3-line clarifying comment to schema; (2) `void _drop` line was redundant (TypeScript's `noUnusedLocals` respects `_`-prefixed bindings). Both fixed in `ef64bc9`. |
| Task 9: `/pre-qual` route page | ✅ | `b315332` | Server Component page with metadata + mount of form + suppression marker. Statically prerenders at 5.04 kB (better than the plan's predicted dynamic). Reviewer's one Minor: no `openGraph`/`twitter` metadata. Deferred. |
| Task 10: retarget header + sticky CTA to `/pre-qual` | ✅ | `16ec8f8` | Two URL swaps (`/contact` → `/pre-qual`) in `config/header-nav.json` + `components/sticky-cta.tsx`. Footer `/contact` reference intentionally preserved (general-inquiry, distinct from lead funnel). |
| Task 11: final verification + tag | ✅ | (no commit) | npm run build succeeds end-to-end. Both new routes (`/pre-qual` static + `/api/submit-prequal` dynamic) in manifest. Stray-`/contact` grep clean across header/sticky/pre-qual paths. Footer `/contact` intact. Legacy 9-step form still dead code. **Tagged `prequal-v1` at `16ec8f8`.** |
| Final whole-plan code review (Opus) | ✅ | (no commit) | Verdict: **"Ship it."** No Critical/Important blockers. 7 Minor notes, all real but appropriate deferrals. |
| Hotfix: hCaptcha strict-mode safe | ✅ | `dc25d89` (post-tag) | Browser smoke test surfaced "Only one captcha is permitted per parent container" when Step 2 mounted in dev. Cause: React 18 StrictMode double-mounts effects, and the existing `components/ui/hcaptcha.tsx` cleanup only called `reset()` (clears state, leaves DOM). Fix: guard render on `childElementCount > 0`, use `hcaptcha.remove()` with `innerHTML = ""` fallback on cleanup, hold `onVerify`/`onExpire` in refs so effect deps reduce to `[sitekey]` (no callback-identity churn). The legacy 9-step form had the same latent bug; never surfaced because it was never mounted in this repo. |

### Incident report — dev server `.next/` collision

During the browser smoke test ("no CSS on the site"), debugging surfaced HTTP 404 on the Tailwind CSS file and webpack `Cannot find module './431.js'` / `'./548.js'` errors in the dev server log. Root cause: **the per-task `npm run build` verifications during Tasks 6-11 wrote into the same `.next/` directory the long-running `npm run dev` was reading from**. Each `next build` rewrote chunk filenames; the dev server kept serving old chunk names from memory; CSS pointers ended up 404ing.

**The committed code was always fine** — `next build` succeeded clean every time, `npx tsc --noEmit` was clean, all routes built correctly. The corruption was purely runtime in the dev server's in-memory state vs disk.

**Recovery (~30 seconds):**
```bash
lsof -nP -iTCP:3002 -sTCP:LISTEN | awk 'NR==2 {print $2}' | xargs kill
rm -rf .next
npm run dev -- -p 3002
```

After restart: dev server ready in 1.7s, `/pre-qual` returned 200, CSS file returned 163 KB of real Tailwind output. Robert's browser session refreshed and styling came back.

**Lesson saved to memory** at `/Users/robert/.claude/projects/-Volumes-ExternalSSD-Sites-hq/memory/feedback_nextjs_dev_build_collision.md`. The rule: if a dev server is running on the project, either tell Robert to kill it before dispatching task implementers, or instruct subagents to skip the `npm run build` verification step and rely on `npx tsc --noEmit` only (build verification then becomes a single end-of-plan check rather than a per-task gate).

### Process notes — what worked and what to keep

- **Three review-driven fix commits landed in-loop.** The two-stage review system caught:
  - Task 5: roving tabindex / arrow-key gap that the prescribed code missed
  - Task 6: wire payload spread order + ZIP lookup race condition
  - Task 8: schema-vs-handler asymmetry doc gap + redundant `void _drop`
  - None of these were caught by spec compliance review — all three came from code-quality review specifically. The split (spec catches content/scope drift, code-quality catches correctness/idiom drift) continues to be load-bearing.
- **The implementer's own escalation on Task 1 (`SLA_HOURS` literal-type fix)** is the right shape: small surgical deviation from prescribed code when the prescribed code is wrong, declared explicitly in the DONE_WITH_CONCERNS report. Approved by spec reviewer. Pattern worth keeping.
- **Live curl smoke tests work great** for API endpoints (Task 8 confirmed the validation path returns exactly the expected 10-field error shape before commit, not after). Cheap and definitive.
- **Plan-doc writes hitting output limits** — splitting big Write calls into multiple Edit appends is the right recovery. Did NOT cost any work and was straightforward. Will pre-emptively split future big plan writes.
- **Time:** about 2.5 hours of agent time across the plan write + 11 task executions + 3 fix commits + final review + hotfix. Robert was hands-off after each kickoff except the smoke-test surfacing.

### Hotfix in detail — hCaptcha strict-mode safety

`dc25d89` rewrote `components/ui/hcaptcha.tsx` (54 insertions, 45 deletions) to be StrictMode-safe. Three changes:

1. **Guard double-mount:** `if (containerRef.current.childElementCount > 0) return` so StrictMode's second mount doesn't try to render a second widget into the same container.
2. **Real cleanup:** `window.hcaptcha.remove(widgetId)` when available (fully detaches widget DOM), with `window.hcaptcha.reset(widgetId) + container.innerHTML = ""` fallback for older hCaptcha builds that don't expose `remove`. The previous `reset()` alone only cleared widget state, leaving DOM that the next mount would clash with.
3. **Stable callbacks via refs:** `onVerifyRef` and `onExpireRef` hold the latest callbacks; the effect's deps reduce to `[sitekey]`, so the form's inline `onExpire={() => setHcaptchaToken("")}` arrow doesn't trigger an effect re-run / widget re-mount on every form render.

The change is in a Plan-1-pre-existing shared UI component, not Plan 2's surface. It would benefit any future captcha consumer (lead-magnet exit-intent in Plan 6, for example).

### Spec gaps surfaced — flag for next spec revision

The Plan 2 code-quality reviews and the final review surfaced these items worth flagging back to the design spec (`docs/superpowers/specs/2026-05-27-heloc360-repositioning-design.md`):

| Item | Status |
|---|---|
| Schema `hcaptchaToken: optional()` vs runtime-required-in-prod | Resolved via 3-line comment in `lib/pre-qual/schema.ts` |
| hCaptcha service-outage vs bad-token disambiguation | Minor — deferred to Phase 2 hardening |
| `AbortSignal` / timeout on outbound fetches (hCaptcha verify + lender webhook) | Minor — Phase 2 polish |
| Focus management on Step 2 reveal (Step 1 button unmounts → focus orphaned) | Minor UX gap — fixable in ~6 lines, pre-public-launch polish |
| No `scrollIntoView` on Step 2 reveal (mobile users may miss the reveal) | Minor UX gap |
| `EquityReadout` hardcoded "85%" in disclaimer (could drift if `MAX_CLTV` changes) | Minor doc-rot risk; grep catches |
| No `openGraph`/`twitter` metadata on `/pre-qual` | Minor — adds social-share polish |
| `userAgent`/`ipAddress` in `getMergedTrackingData()` are silently stripped by server Zod | Minor — `ContextSchema` could add `userAgent`/`ipAddress` as optional for symmetry |

### Carry-forward items for subsequent plans

**Plan 3 (Homepage hybrid hero):**
- Add `#how-it-works` and `#calculator` anchors on `app/page.tsx` (sticky CTA + header nav already link there).
- Embed `<PreQualForm useCase="universal" />` inline above-the-fold for the universal-calculator framing. Form's component API is already designed for this.
- Use `<StickyCtaSuppress />` for any homepage modal/drawer.

**Plan 4 (Spoke pages):**
- Pass `useCase={inferUseCaseFromPath(usePathname())}` to `<PreQualForm>` on each of the 5 spoke pages — the 5 spoke routes match the 5 non-universal values in `USE_CASES` exactly.
- Spoke metadata block: consider lifting `<PreQualPage>`'s metadata pattern into `lib/pre-qual/metadata.ts` if you land more than 2 spokes.

**Plan 5 (GA4 funnel events):**
- The form already calls `getMergedTrackingData()` on submit (UTM/click-id capture). Wire-in points for events: ZIP entered (after `lookupZip` resolves), Step 1 → Step 2 transition (`onContinue` success branch), Step 2 submit success, Step 2 submit fail.
- Add `lib/pre-qual/events.ts` and call from those 4 sites. Plan 2 intentionally left this seam open.

**Plan 6 (Mailing list lead magnet):**
- Footer form `onSubmit` is still `preventDefault()` placeholder. Wire to the API.
- Decide on the PDF asset ("The 7-page HELOC decision guide").
- Resolve the `companyInfo.tagline` and `callToAction` rendering — they're now rendered in the footer company-info row (from Plan 1's polish commit `1b6c600`).
- Plan 1's "tel" value in `FooterNavigationItem.type` is still unused — drop or document.

### Pre-Plan-3 prerequisites (focused tooling sweep)

These are real, none are blocking Plan 2's tag, but each gets cheaper to address before Plan 3 starts adding more surface area:

1. **ESLint adoption decision.** Repo has no ESLint installed (no `eslint` or `eslint-config-next` in devDependencies). Adding `.eslintrc.json` alone won't work — needs the tooling install + a cross-codebase warning sweep. Either adopt explicitly or formally defer to "tech debt backlog." (Carried over from Plan 1.)
2. **Next.js upgrade.** Dev overlay shows "outdated" hint. Current 15.4.11 — Plan 1 commit `140d400` bumped from 15.2.4 to resolve a Vercel CVE. A focused upgrade pass to current stable (15.5+ or 16.x as appropriate) belongs between plans, not mid-feature. App Router patterns are mostly stable across 15.x but spot-check changelogs.
3. **Lender webhook URL → env var.** Hardcoded in both `submit-mortgage/route.ts` and `submit-prequal/route.ts`. ~5 lines, one focused commit. Inline comment in both files already flags this.
4. **Pre-existing tsc errors** in `.next/types/app/**`, `components/blog/blog-home.tsx`, `components/calculators/home-equity-results.tsx`, `components/ui/chart.tsx` — unchanged baseline. Worth a focused tech-debt pass eventually.

### Where we left off

- **Plan 2 is implemented and tagged `prequal-v1`** at commit `16ec8f8`. One post-tag hotfix (`dc25d89`) for hCaptcha strict-mode sits on top of the tag.
- **Local `main` is 15 commits ahead of `origin/main`** — push decision pending Robert. Recommended option: push `main` + `prequal-v1` tag together. The post-tag hotfix would be included in the `main` push but the tag still points to the pre-hotfix milestone (which is fine — `prequal-v1` reflects the 11-task milestone; the captcha hotfix is incremental).
- **Browser smoke test was in progress** when documentation work began. Captcha bug is fixed; Robert can resume testing (form fill → ZIP lookup → Step 1 → equity readout → Step 2 → chips arrow-keys → captcha → submit → confirmation → reload-rehydrate).
- **Working tree:** clean (`.superpowers/` is gitignored).
- **Dev server:** fresh restart on http://localhost:3002 — ready in 1.7s, CSS serving 163 KB Tailwind output.

### Where to start next session

**Immediate first action:**
1. `cd /Volumes/ExternalSSD/Sites/nextjs-heloc360 && git log --oneline -5` to confirm we're at `dc25d89` (or wherever push landed if Robert decides to ship).
2. Decide the pre-Plan-3 tooling sweep order (ESLint adoption + Next.js upgrade + webhook env-var). One focused PR each, or bundle as a single "tooling" PR before Plan 3 begins.
3. Invoke `superpowers:writing-plans` to produce **Plan 3 (Homepage hybrid hero)** — embeds the `<PreQualForm useCase="universal" />` above the fold, adds the `#how-it-works` and `#calculator` section anchors, and replaces the homepage with the 5 use-case pills + universal calculator hybrid pattern. Highest-leverage next move per the spec phasing.

**If smoke test still incomplete:** resume at http://localhost:3002/pre-qual. The captcha widget will now render once per Step 2 reveal cleanly. Sample test ZIP: `48226` (Detroit) → city/state should auto-fill. Sample home value: `$425,000`. Sample mortgage balance: `$210,000` → readout should show roughly Equity `$215,000`, Borrowing power `$151,250`.

### Key artifacts

| Artifact | Path | Purpose |
|---|---|---|
| Plan 2 (Pre-qual form) | `docs/superpowers/plans/2026-05-28-heloc360-prequal-form.md` | 1650-line plan; executed end-to-end today |
| Pre-qual milestone | tag `prequal-v1` → `16ec8f8` | Rollback anchor for the 11-task feature surface |
| Lib layer | `lib/pre-qual/{sla,use-case,masks,zip-lookup,schema,equity}.ts` | Data + utility surface, shared client + server |
| Component layer | `components/pre-qual/{pre-qual-form,equity-readout,best-time-chips,sticky-cta-suppress}.tsx` | UI surface; form + 3 leaves |
| Route | `app/pre-qual/page.tsx` | Landing page for header CTA + sticky CTA |
| API endpoint | `app/api/submit-prequal/route.ts` | Zod re-validate + hCaptcha verify + webhook proxy |
| Memory: dev/build collision | `~/.claude/projects/-Volumes-ExternalSSD-Sites-hq/memory/feedback_nextjs_dev_build_collision.md` | Lesson for future Next.js plan executions |

### Commit trail (this session, on `main`)

```
dc25d89  fix(hcaptcha): strict-mode safe — guard double-mount, clean DOM on unmount   (post-tag hotfix; surfaced in browser smoke)
16ec8f8  feat(prequal): retarget header + sticky CTA Talk-to-advisor to /pre-qual    (Task 10)         ← prequal-v1
b315332  feat(prequal): add /pre-qual standalone route                                (Task 9)
ef64bc9  fix(prequal): document hcaptcha schema/runtime asymmetry; drop redundant void _drop (Task 8 — review-driven)
0882142  feat(prequal): add submit-prequal API route — Zod re-validate, hCaptcha verify, webhook proxy (Task 8)
c744936  feat(prequal): sticky CTA modal-aware suppression via body data attribute   (Task 7)
1abafed  fix(prequal): guard ZIP race + reorder payload spread to protect context fields (Task 6 — review-driven)
d1686bf  feat(prequal): build 2-step pre-qual form — progressive reveal, sessionStorage persistence (Task 6)
ae642e1  fix(prequal): radiogroup roving tabindex + arrow-key selection              (Task 5 — review-driven)
9e34bc8  feat(prequal): add best-time-to-call chip selector                          (Task 5)
f09a64f  feat(prequal): add inline equity + borrowing-power readout                  (Task 4)
b14239f  feat(prequal): add Zod schemas + equity/borrowing-power calculator          (Task 3)
c3ffc82  feat(prequal): add ZIP → city/state lookup helper                           (Task 2)
c262287  feat(prequal): scaffold pre-qual lib — SLA, use case, input masks           (Task 1)
9fbaf1e  docs(plan): add Plan 2 — pre-qual form on-domain (2-step, 5-question)       (Plan-write)
```

### Time/scope reflection

Plan 2's scope was larger than Plan 1's by surface area (15 new files vs 9; 1 new route + 1 new API endpoint vs 0 of either) but the per-task agent time was similar (~2-3 min per implement + 2 reviews). Total session time ~2.5 hours including the plan write, all 11 tasks, 3 fix commits, the final whole-plan review, the dev-server incident debugging, and the captcha hotfix. The two-stage review continues to pay for itself — three real bugs (radiogroup keyboard pattern, payload spread + ZIP race, schema/handler doc gap) caught by code-quality review that spec compliance missed.

---

## 2026-05-28 — Plan 1 (Foundation) shipped end-to-end, tagged `foundation-v1`

### Session goal
Resume Plan 1 at Task 3 (where yesterday left off), drive Tasks 3-10 through Subagent-Driven Development with two-stage review per task, then close out the plan.

### Outcome
Plan 1 is complete. Eight more tasks landed (Tasks 3-10), plus two review-driven fix commits, one plan-doc amendment, and one post-plan polish commit on top of `foundation-v1`. Local `main` is currently **19 commits ahead of `origin/main`** (yesterday's 7 commits + today's 12), pending push.

### Tasks executed today (all via Subagent-Driven Development)

Each task: implementer (sonnet) → spec-compliance reviewer → code-quality reviewer (superpowers:code-reviewer). Re-dispatch on issues; mark complete on dual approval.

| Task | Status | Commit(s) | Notes |
|---|---|---|---|
| Plan doc amendment | ✅ | `5b5a2a9` | Expanded Task 10 grep into `app/layout.tsx`; documented the 3 metadata-API hex literals as accepted exceptions. |
| Task 3: Header nav config rewrite | ✅ | `e96f3fb` | Mechanical JSON edit. Both reviews approved first pass. |
| Task 4: Header component rebuild | ✅ + fix | `42b0345`, `4be09c7` | Code review flagged 2 Important a11y issues in the *prescribed* code: `aria-haspopup="true"` is semantically wrong for a disclosure of links, and Escape inside the open dropdown panel didn't close it. Fixed in `4be09c7` after re-dispatch. |
| Task 5: FooterNavigation types | ✅ | `6e08d52` | Types-first migration. Expected: 13 tsc errors on `footer.tsx` (consumer rewrite is Task 7). |
| Task 6: Footer nav config rewrite | ✅ | `4c52245` | JSON content + voice rewrite. Code review surfaced spec-vs-config gaps (NMLS/BBB/Press/State guides absent from columns — see "spec gaps" below). |
| Task 7: Footer component rebuild | ✅ + fix | `b54613b`, `84389cc` | Code review caught a **Critical** issue the spec reviewer missed: the plan's prescribed code omitted `"use client"`, but the form has inline `onSubmit` — `next build` fails. Fixed in `84389cc`. Build now passes end-to-end. |
| Task 8: StickyCta component | ✅ | `c16bdf2` | New client component, 30% scroll trigger, sessionStorage dismiss, two-button + X markup. Build still clean. |
| Task 9: Mount StickyCta in layout | ✅ | `48ff3dc` | 5-line addition to `app/layout.tsx`. Matches existing `ScrollToTop` dynamic-import pattern. |
| Task 10: Build verify + skip-link fix + tag | ✅ | `82f27fa` | Expanded grep returns ONLY the 3 expected metadata-API matches. `bg-[#1b75bc]` on the skip-to-content link → `bg-brand-blue`. **Tagged `foundation-v1`.** |
| Final whole-plan code review | ✅ | (no commit) | Verdict: **"Ship it."** Opus reviewer. No Critical/Important blockers. |
| Polish: render orphaned tagline + callToAction | ✅ | `1b6c600` | Post-tag polish. Resolved Important item I-1 from the final review. Both fields now render in the company-info row (eyebrow + headline + body). |

### Process notes — what worked and what to keep

- **The two-stage review actually caught real bugs in the prescribed code.** Twice. Headers' `aria-haspopup` and the footer's `"use client"` omission. Both were carried verbatim from the plan; both would have shipped if reviews were skipped. The "Subagent-Driven default" master rule is paying for itself.
- **Mechanical implementer reports on DONE_WITH_CONCERNS were valuable, not noisy.** Task 4's implementer flagged that `npm run lint` couldn't run because no ESLint config exists. That single concern propagated through every subsequent task as a known deferral and surfaced as a "Plan 2 prerequisite" in the final review.
- **Spec reviewer caught content/scope drift; code-quality reviewer caught correctness/idiom drift.** The split was clean. Spec reviewer was wrong once (claimed inline `onSubmit` "technically works" in an RSC — it doesn't) but the code-quality reviewer ran `npm run build` empirically and caught the build failure. Always run the actual build.
- **Total time:** about 90 minutes of agent time across 10 tasks + final review. Robert was hands-off after the morning kickoff.

### Master-rules-derived behavior worth remembering

- **The plan-execution rule from yesterday (`hq/RULES.md`) was applied throughout.** No "should I do Inline or Subagent-Driven?" question — straight to Subagent-Driven. Saved at least 10 minutes of ceremony.
- **Em-dash discipline:** several commit messages and JSON copy strings carry em dashes (U+2014). Every spec-review verified them as real em dashes via byte-level checks. Worth keeping the pattern — autocorrect drift would silently break commit-message conventions.

### Spec gaps surfaced — recommend amending the design spec

The final review identified three spec §11 enumerations that the footer config does not reflect:

| Spec §11 says | Implementation status | Recommended action |
|---|---|---|
| Resources column includes "State guides" | Omitted (no `/[spoke]/[state]` routes until Phase 3) | Amend spec to mark "State guides" as Phase-3-only, OR add a deferred-link footer note |
| Company column includes "Press" | Omitted (no `/press` in §4 IA) | Spec internal inconsistency. Either add `/press` to §4 IA or remove from §11. |
| Legal & disclosures includes "NMLS" and "BBB" | Omitted (typically badges, not text links) | Amend spec to clarify badge-vs-link intent. If badges, Plan 4 or 5 should add the asset. |

Also flagged spec §11 ambiguity: "Use cases — all 5 spokes + `/heloc-101`" reads as 6 items but spec §5 treats `/heloc-101` AS the first-timer spoke. Implementation went with 5 items. Recommend explicit confirmation in a later spec revision.

### Carry-forward items for subsequent plans

**Plan 2 (Pre-qual form on-domain):**
- Sticky-CTA modal suppression (spec §11) — add when forms exist.
- Retarget `/contact` → `/pre-qual` in `components/header.tsx` and `components/sticky-cta.tsx`.
- Decide on a footer-form `name="email"` attribute alongside the existing `aria-label`.

**Plan 3 (Homepage):**
- Add `#how-it-works` section anchor (header nav links to `/#how-it-works`).
- Add `#calculator` anchor (sticky CTA links to `/#calculator`).
- Delete the legacy `public/images/heloc360-logo.webp` once Plan 3 confirms no remaining references.

**Plan 4 (Spokes):**
- Create the 4 currently-404 spoke URLs (`/debt-consolidation`, `/home-renovation`, `/retirement-equity`, `/self-employed-heloc`).

**Plan 5 (Analytics):**
- GA4 hooks for: header CTA click, sticky CTA dual clicks + dismiss, footer mailing-list submit, header dropdown open.
- The sticky CTA's `dismiss()` function is the natural seam.

**Plan 6 (Mailing list + lead magnet):**
- Wire footer form `onSubmit` (currently `preventDefault()`) to the real API.
- Host the "7-page HELOC decision guide" PDF.
- Decide on the `"tel"` value in `FooterNavigationItem.type` — currently unused. Drop it or document the reserve.

### Pre-Plan-2 prerequisites (recommend before next plan starts)

1. **ESLint adoption decision.** The repo has no ESLint installed (no `eslint` or `eslint-config-next` in `devDependencies`). Adding `.eslintrc.json` alone won't help — `next lint` would prompt to install tooling. This is a tooling adoption decision + a likely cross-codebase warning sweep, not a config polish. Defer-or-adopt-explicitly call.
2. **Browser visual click-through pass** (Plan 1 Task 10 Step 3 — deferred per Subagent-Driven workflow). Manual sweep of: `/`, `/about`, `/blog`, `/contact`, `/calculators/debt-consolidation`, `/calculators/home-equity-estimator`, `/heloc-101`. Specifically validate the compact-on-scroll header animation, the mobile drawer, the sticky CTA appearance/dismiss/sessionStorage persistence, and the footer mailing-list responsive grid.
3. **Pre-existing tsc errors** in `.next/types/app/**`, `components/blog/blog-home.tsx`, `components/calculators/home-equity-results.tsx`, `components/ui/chart.tsx` — these are unchanged baseline. Worth addressing in a tech-debt pass, but not Plan 1's responsibility.

### Where we left off

- **Plan 1 is shipped and tagged `foundation-v1`** at commit `82f27fa`. One post-tag polish commit (`1b6c600`) sits on top of the tag.
- **Local `main` is 19 commits ahead of `origin/main`** — push decision pending Robert's call (recommended option: push `main` + tag together).
- **Working tree:** clean (`.superpowers/` is gitignored).

### Where to start next session

**Immediate first action:**
1. `cd /Volumes/ExternalSSD/Sites/nextjs-heloc360 && git log --oneline -3` to confirm we're at `1b6c600` (or wherever push landed).
2. Decide ESLint adoption (the prereq #1 above).
3. Invoke `superpowers:writing-plans` to produce **Plan 2: Pre-qual form on-domain (2-step, 5-question)** — kills the leaky `get-started.heloc360.com` subdomain and restores attribution. Highest-value next move per the design spec's phasing.

### Key artifacts (unchanged from yesterday's session)

| Artifact | Path | Purpose |
|---|---|---|
| Design spec (canonical) | `docs/superpowers/specs/2026-05-27-heloc360-repositioning-design.md` | Source of truth for everything |
| Plan 1 (Foundation) | `docs/superpowers/plans/2026-05-27-heloc360-foundation.md` | Now executed end-to-end |
| Foundation milestone | tag `foundation-v1` → `82f27fa` | Rollback anchor |
| Master rules | `../hq/RULES.md` | Subagent-Driven default applied |

### Commit trail (this session, on `main`)

```
1b6c600  feat(foundation): render footer tagline + callToAction above company description (polish, post-tag)
82f27fa  fix(foundation): route layout skip-link bg through brand token                  ← foundation-v1
48ff3dc  feat(foundation): mount StickyCta in root layout                                (Task 9)
c16bdf2  feat(foundation): add sticky bottom CTA — 30% scroll trigger, sessionStorage dismiss (Task 8)
84389cc  fix(foundation): mark footer as Client Component for inline onSubmit handler   (Task 7 — review-driven)
b54613b  feat(foundation): rebuild footer — 5 cols + lead-magnet mailing list + brand colors (Task 7)
4c52245  feat(foundation): rewrite footer nav — 5 columns + lead-magnet mailing list    (Task 6)
6e08d52  feat(foundation): extend FooterNavigation type for 5-col layout + mailing list (Task 5)
4be09c7  fix(foundation): header dropdown a11y — drop aria-haspopup, close panel on Escape (Task 4 — review-driven)
42b0345  feat(foundation): rebuild header — brand tokens, new logo, compact-on-scroll   (Task 4)
e96f3fb  feat(foundation): rewrite header nav per spec — no megas, advisor CTA          (Task 3)
5b5a2a9  docs(plan): expand Task 10 grep to app/layout.tsx, document metadata exception (Plan amendment)
```

---

## 2026-05-27 — Repositioning + redesign brainstorm, spec, plan, and Plan 1 start

### Session goal
Pull down the current `heloc360.com` repo, take a strategic look at it against the broader home-equity lead-gen market, and start a repositioning + redesign aimed at increasing both traffic and lead conversion.

### Strategic decisions locked in

| Decision | Locked value | Rationale |
|---|---|---|
| **Strategic position** | C — Vertical use-case marketplace (5 verticals) | LendingTree/Bankrate-style rate-table competition is a brutal SEO fight; vertical specialization compounds CPL efficiency |
| **Brand voice** | A overall, refined to **B — Plainspoken expert** (NPR-esque, direct financial-journalist tone) | Pairs with educator-advisor position. Default until Robert overrides at spec review. |
| **Homepage pattern** | **C — Hybrid hero** (5 use-case pills + universal borrowing-power calculator above the fold) | Best optionality without decision paralysis. Pills are the SEO H1 surface. |
| **The 5 verticals (URL spokes)** | `/debt-consolidation`, `/home-renovation`, `/retirement-equity`, `/heloc-101` (first-time tappers), `/self-employed-heloc` | Picked for SEO surface + use-case diversity |
| **Form** | **2-step / 5-question** pre-qual on-domain (was 9-step on external subdomain) | Principle: only ask questions users can answer from memory in 5 seconds. Loan officer collects the rest on the first call. |
| **Color palette** | A — Refined current (deeper navy as anchor) | Lowest design risk, frees budget for structure work |
| **Header nav** | How it works · HELOC 101 · Calculators ▾ · Blog · [Talk to an advisor CTA] | **No mega menus, ever** — explicit sitewide rule. Simple dropdowns only where needed. |
| **Footer** | 5 columns (Use cases · Calculators · Resources · Company · Legal) + mailing-list lead-magnet row above | The 7-page HELOC decision guide is the lead magnet (title locked; content TBD) |
| **`/rates` page** | **Dropped from scope** — no source for real-time rate data | Was a Phase 2 idea; removed entirely from sitemap, header, footer |
| **Retire** | `get-started.heloc360.com` external subdomain · existing 9-step form · `Broker` and `Investor` borrower types | All ride out as part of Plan 2 (pre-qual form) |

### What was created

**Spec (Markdown + HTML render):**
- `docs/superpowers/specs/2026-05-27-heloc360-repositioning-design.md` — canonical, consumed by writing-plans
- `docs/superpowers/specs/2026-05-27-heloc360-repositioning-design.html` — readable rendering with sticky TOC, callouts, palette swatches, 5-column-sitemap, phase pills. Opens in any browser.

**Phase 1 decomposition** (into 6 sequential sub-plans):
1. **Foundation** — tokens, header, footer, sticky CTA *(this plan was written; execution started today)*
2. **Pre-qual form** — 2-step on-domain, retires external subdomain
3. **Homepage** — hybrid hero, full below-the-fold rebuild
4. **Spoke template + 2 verticals** — debt-consolidation + home-renovation
5. **Analytics + tracking foundation** — GA4 funnel events, GTM, Meta CAPI, Vercel Analytics, Clarity, Search Console
6. **Mailing list + exit-intent + lead-magnet**

**Plan 1 written:**
- `docs/superpowers/plans/2026-05-27-heloc360-foundation.md` — 10 tasks, ~10 commits, complete code blocks, verification = `npm run lint` + `npm run build` (no test framework in this project)

**New logo asset:**
- `public/images/heloc360-logo.avif` — Robert provided from `~/Downloads/heloc360-logo.avif`. The existing `heloc360-logo.webp` is left in place for now (deferred deletion to Plan 3 when the homepage rebuild settles).

### Plan 1 execution progress (Subagent-Driven Development)

Tasks executed today via dispatched implementer + spec reviewer + code-quality reviewer subagents. Two-stage review per task. Pattern is working well.

| Plan 1 task | Status | Commit |
|---|---|---|
| Task 1: Brand color tokens in Tailwind config | ✅ Done (spec ✅, quality ✅) | `3b83385` |
| Task 2: Brand CSS vars in `globals.css` + focus outline | ✅ Done (spec ✅, quality ✅) | `d082979` |
| Task 3: Header nav config rewrite | **Next** | — |
| Task 4: Rebuild Header component | Pending | — |
| Task 5: Extend FooterNavigation types | Pending | — |
| Task 6: Rewrite footer-nav config | Pending | — |
| Task 7: Rebuild Footer component | Pending | — |
| Task 8: Create StickyCta component | Pending | — |
| Task 9: Mount StickyCta in layout | Pending | — |
| Task 10: Build + lint verification, tag `foundation-v1` | Pending | — |
| Final review (whole-plan) | Pending | — |
| `superpowers:finishing-a-development-branch` | Pending | — |

### Open issues / findings to address

**1. `app/layout.tsx` carries two hardcoded `#1b75bc` literals** that Plan 1's Task 10 final grep won't catch:

- Line 28: `themeColor` metadata for light mode
- Line 102: `mask-icon` color for Safari pinned tab

**Action needed tomorrow:**
- **Option A (preferred):** Amend Plan 1 Task 10's grep command to include `app/layout.tsx`, and swap the literals to `var(--brand-blue)` in a follow-up commit before tagging `foundation-v1`.
- **Option B:** Defer to Plan 3 when `app/layout.tsx` is being touched anyway for `StickyCta` mounting.

**2. Hex casing inconsistency** in `#FFCB05` (maize) and `#00274C` (navy) vs. lowercase for all other brand colors. Sourced from the spec, faithfully reproduced in both Tailwind config and `globals.css`. Functionally harmless (CSS hex is case-insensitive) but searches for lowercase variants will miss. No action required.

### Master-rules update (propagates to all projects)

Added a new section to `/Volumes/ExternalSSD/Sites/hq/RULES.md`:

> **Rule:** When executing an implementation plan (the handoff from `superpowers:writing-plans` or any equivalent flow), always use **Subagent-Driven execution** — dispatch a fresh subagent per task with two-stage review between tasks. Do not ask; do not offer Inline Execution as an alternative.
> **Why:** Robert prefers the cleaner checkpoint cadence. Asking the question every time is wasted ceremony.

HQ commit: `28c91a6`.

### Where we left off

- **Plan 1, Task 2 just closed.** Both reviewers approved.
- **Plan 1, Task 3 is the next thing to dispatch.** Task 3 rewrites `config/header-nav.json` to the new nav structure (no `About`, no external `Get Started` URL, no mega-menu shapes). The full task text + verification steps are in the plan file at `docs/superpowers/plans/2026-05-27-heloc360-foundation.md` under `## Task 3`.
- **Working tree** at the end of session: clean (except `.superpowers/` which is gitignored). HEAD is `d082979`.
- **Tasks remaining in Plan 1:** 8 (Tasks 3-10) plus the final whole-plan review and the branch-finish skill invocation.

### Where to start tomorrow

**Immediate first action:**
1. `cd /Volumes/ExternalSSD/Sites/nextjs-heloc360 && git log --oneline -5` to confirm we're at `d082979`.
2. Decide on the `app/layout.tsx` issue:
   - If amending Plan 1: edit `docs/superpowers/plans/2026-05-27-heloc360-foundation.md` Task 10 to expand the grep, and add the literal swap as a step.
   - Otherwise: note it as a Plan 3 follow-up.
3. Resume Subagent-Driven Development at **Plan 1 / Task 3** (Header nav config rewrite). Use the task templates from `/Users/robert/.claude/plugins/cache/claude-plugins-official/superpowers/5.0.7/skills/subagent-driven-development/` — implementer, spec reviewer, code quality reviewer prompts.

**Implementer dispatch baseline for Task 3:**
- Subagent type: `frontend-engineer` (or `general-purpose` — Task 3 is a JSON edit, mechanical)
- Model: `sonnet` is enough
- Task text: paste verbatim from plan §Task 3
- Working dir: `/Volumes/ExternalSSD/Sites/nextjs-heloc360`
- BASE_SHA for the code reviewer: `d082979`

**After Plan 1 ships (estimated 1-2 more sessions):**
- Tag `foundation-v1`
- Invoke `superpowers:writing-plans` again to produce **Plan 2: Pre-qual form (2-step on-domain)** — this is the next-highest-value unit because it kills the leaky external `get-started.heloc360.com` subdomain and restores attribution.

### Key artifacts (for fast resume)

| Artifact | Path | Purpose |
|---|---|---|
| Design spec (canonical) | `docs/superpowers/specs/2026-05-27-heloc360-repositioning-design.md` | Source of truth for everything we're building |
| Design spec (readable) | `docs/superpowers/specs/2026-05-27-heloc360-repositioning-design.html` | Pretty-print, sticky-TOC version for review |
| Plan 1 (Foundation) | `docs/superpowers/plans/2026-05-27-heloc360-foundation.md` | The 10-task plan currently in execution |
| New logo | `public/images/heloc360-logo.avif` | Referenced by Plan 1 Task 4 (Header rebuild) |
| Master rules | `../hq/RULES.md` | Includes the new Subagent-Driven default |
| Visual companion session dir | `.superpowers/brainstorm/22834-1779910360/` | Mockups + interactive design doc from the brainstorm phase. Gitignored. Server may need restart tomorrow (30-min idle timeout). |

### Commit trail (this project, today's session, `main`)

```
d082979  feat(foundation): expose brand vars in globals; route focus outline via var       (Plan 1 Task 2)
3b83385  feat(foundation): add brand color tokens + Inter type scale                       (Plan 1 Task 1)
5e84fcf  Add Foundation plan + new logo asset                                              (Plan 1 setup)
011bf11  Apply spec revisions per review feedback                                          (Spec rev: 2-step form, no megas, no rates)
944ad8b  Add HTML rendering of repositioning spec                                          (Spec HTML)
05086ef  Add repositioning + redesign design spec                                          (Spec MD initial)
```

HQ repo (commits today):
```
28c91a6  Add Plan execution rule + commit prior project-structure rules                   (RULES.md)
```

### Time/scope reflection

Did in one session: full strategic alignment → spec write → HTML render → spec revisions → Plan 1 write → 2 of 10 Plan 1 tasks executed with double-review. The Subagent-Driven flow took ~5 minutes per task end-to-end (implementer ~2-3 min + spec review ~30 sec + code quality review ~1.5 min). Projecting ~40 min for the remaining 8 tasks + ~5 min for final review.

**Estimated time to complete Plan 1 tomorrow:** under an hour of agent time, plus Robert's manual visual smoke-test pass (header, footer, sticky CTA across breakpoints).
