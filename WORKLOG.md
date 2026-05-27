# HELOC360 — Worklog

Per-session work log. Most recent session at the top. Append after each session.

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
