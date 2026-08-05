# HELOC360 Lender Ranking Methodology

**Data vintage:** FFIEC HMDA Modified LAR, 2025 combined file (released 2026-06-14)
**Built:** 2026-07-22
**Rows scanned:** 13,543,596
**Status:** Draft for review — not yet published

---

## Why this exists

Every "best HELOC lenders" list on the internet is either an affiliate payout order or an
editor's opinion. Neither is verifiable, and neither survives a reader asking "says who?"

This ranking is built entirely from **HMDA** — the loan-level data every mortgage lender above
the reporting threshold is legally required to file. It is public, auditable, and identical no
matter who runs it. A reader can download the same file and reproduce every number on the page.

**No lender pays for placement, and no lender can.** The inputs are regulatory filings.

---

## The universe

From the 2025 combined Modified LAR we keep records where:

| Filter | Value | Why |
| --- | --- | --- |
| `action_taken` | 1 (originated) or 3 (denied) | Originations only for terms; denials only for approval rate. Excludes purchased loans so nothing is double-counted. |
| `occupancy_type` | 1 — principal residence | This is a consumer product. |
| `business_or_commercial_purpose` | 2 — not business purpose | Excludes DSCR/investor lines. |
| `reverse_mortgage` | 2 — not reverse | Different product entirely. |
| `construction_method` | 1 — site-built | Excludes manufactured housing. |
| `total_units` | 1–4 | Single-family through fourplex. |

Records are then split into three segments:

| Segment | Definition | 2025 originations | 2025 volume |
| --- | --- | --- | --- |
| **HELOC (subordinate lien)** | `open_end_line_of_credit=1`, `lien_status=2` | 896,331 | $118.7B |
| **HELOC (first lien)** | `open_end_line_of_credit=1`, `lien_status=1` | 248,737 | $47.7B |
| **Home equity loan (closed-end second)** | `open_end_line_of_credit=2`, `lien_status=2` | 382,299 | $31.0B |

"HELOC" on the site means either open-end segment. A lender is scored on whichever open-end
segment it leads with.

**Reproducibility cross-check:** total 2025 open-end subordinate-lien originations across all
occupancy and purpose types reconstruct to ~929,280. Our consumer-filtered figure of 896,331 is
96.5% of that — the ~3.5% difference is exactly the second homes, investment properties,
business-purpose lines, and manufactured housing the filters remove.

---

## Eligibility gate (objective, applied before scoring)

A lender appears on the **national** list only if a reader could plausibly use it:

- **≥ 25 states** of observed 2025 lending, and
- **≥ 1,000 HELOC originations** in 2025.

Both bars are observed behavior, not marketing claims — a lender that says it "lends nationwide"
but originated in six states does not clear the gate.

This gate also handles a genuine HMDA blind spot: **HMDA does not report credit-union membership
eligibility.** An unscreened ranking put Bank-Fund Staff Federal Credit Union — open only to World
Bank and IMF employees — in the national top ten on 529 loans. Requiring national footprint *and*
scale together removes restricted-field institutions without us having to guess at membership
rules we cannot see.

Credit unions that *do* clear the gate (Navy Federal, PenFed, Tower, Quorum, First Tech) are
flagged **"membership required"** on every surface they appear on. That flag is definitional —
every credit union requires membership — not an inference.

**Regional and single-state lenders are not penalized. They are ranked on state pages**, where a
strong local credit union is frequently the correct answer.

---

## The four scored dimensions

Each is percentile-ranked within the qualified pool, then weighted. Percentile-ranking means no
single dimension can run away with the scale.

| Dimension | Weight | Measured as | What it tells a reader |
| --- | --- | --- | --- |
| **Scale** | 30% | 2025 HELOC originations | Has this lender actually done this, at volume, recently? |
| **Reach** | 25% | Distinct states with observed originations | Can I get one where I live? |
| **Equity access** | 25% | 90th-percentile combined LTV | How deep into my equity will they actually go? |
| **Approval** | 20% | Denial rate (originated vs. denied) | What are my odds? *Lower is better.* |

Weights are renormalized over whichever dimensions a lender actually disclosed, so a lender
missing one field is not silently penalized.

### Why "equity access" is measured at the 90th percentile

The median CLTV tells you what a typical borrower took, which is mostly a function of what
borrowers wanted — not what the lender allows. The 90th percentile of *approved* CLTV is a much
better read on where the lender's underwriting box actually ends. It is an observed ceiling, not
a published one, and it is frequently more conservative than the "up to 95% CLTV!" language on
the same lender's website.

---

## What we do not measure

**This is the most important section on the page, and it stays on the published version.**

- **Interest rate is deliberately excluded from the score.** HMDA records the *initial* rate on an
  open-end line. A HELOC is a variable product, so a lender running a six-month teaser will show a
  lower HMDA rate than a lender quoting fully-indexed — with no adjustment for margin, index, or
  draw-period behavior. Ranking on that field would be actively misleading. We **report** median
  rate as disclosed context and label it as the initial rate. We never rank on it.
- **Fees, closing costs, and annual charges.** Not in HMDA at any useful granularity.
- **Customer service, servicing quality, funding speed.** Not in HMDA at all.
- **Credit score.** HMDA carries a scoring *model* code, not a FICO. There is no credit-quality
  field in this data, and any list claiming a HMDA-derived "minimum credit score" is fabricating.
- **Non-reporting lenders.** Institutions below the HMDA threshold do not appear. For consumer
  HELOC this is a small share of the market, but it is not zero.
- **Current-year terms.** This is 2025 filed data. A lender's 2026 program may differ. The page
  states its vintage.

Because of the exclusions above, the ranking is best read as **"most capable and most accessible
by 2025 lending record"** — not as a claim that the #1 lender will give any individual reader the
best deal.

---

## Lender classification

Institution names come from the FFIEC filers list (2024 vintage; LEIs are stable across years, and
the filers endpoint does not yet publish 2025). Type is assigned by order-sensitive name matching:
credit union → bank → nonbank.

**Known limitation, disclosed:** 122 institutions carry names truncated at registration
("STATE EMPLOYEES'", "POLICE & FIRE") and cannot be classified from the name. GLEIF returns the
same truncated strings, so it does not resolve them. These are labeled **unclassified** rather
than assumed. Almost all are credit unions, but the file does not assert what it cannot source.
This should be resolved manually before publication for any that surface on a live page.

---

## Reproducing this

```bash
# 1. Aggregate (streams 3.1GB, never held in memory)
unzip -p 2025_combined_mlar_header.zip | node scripts/aggregate-heloc-lenders.mjs > data/raw-lenders.json

# 2. Resolve names, score, rank
node scripts/build-rankings.mjs

# 3. Emit the front-end payload
node scripts/build-web-payload.mjs > data/web-payload.json
```

Field indices were verified empirically against the 2025 header row rather than carried over from
prior-year scripts. Re-verify every year — the column order is not guaranteed stable.

---

## Update cadence

HMDA Modified LAR publishes annually, typically mid-June. The finalized Snapshot follows later and
may revise figures slightly. Recommended: rebuild on the Modified LAR release for freshness, then
rebuild once more on the Snapshot, and stamp the page with which vintage it reflects.

---

# Part II — The approval model (funnel)

**Prototype:** https://claude.ai/code/artifact/501ac5af-50c9-4790-bf24-ff3ebf66e5da

The ranking above answers "who is best." The funnel answers a harder and more valuable question:
**"who is likely to approve *me*, and for how much?"**

## Why this is possible at all

HMDA records both **originated and denied** applications, and — critically — it reports the
underwriting variables on denials too. Verified on the 2025 file:

| Field | Present on denials | Present on originations |
| --- | --- | --- |
| Combined LTV | 94.9% | 97.5% |
| Debt-to-income | 97.4% | 97.1% |
| Income | 99.5% | 98.9% |

That coverage is what makes a *conditional* approval rate computable. Without CLTV and DTI on the
denial side, you could only ever publish a lender's overall approval rate, which is nearly useless
to an individual.

Universe: **1,758,901 open-end HELOC applications** filed for 2025 (owner-occupied, non-business,
site-built, 1–4 unit), of which ~1.14M were originated and the balance denied.

## The estimate

For each lender we take the empirical approval rate in the most specific cell that holds up:

| Level | Cell | Used when |
| --- | --- | --- |
| 1 | lender × state × CLTV band × DTI band | n ≥ 20 |
| 2 | lender × CLTV band × DTI band (national) | n ≥ 20 |
| 3 | lender × CLTV band | n ≥ 20 |
| 4 | lender, full year | fallback |

CLTV bands: <60 / 60–70 / 70–80 / 80–85 / 85–90 / 90+.
DTI bands: <36 / 36–43 / 43–50 / 50+.

**Every result states which level answered it and on how many applications.** A result computed
from a national cell is never presented as if it were state-specific.

Rates are reported as **Wilson score lower bounds (95%)**, not raw ratios. A lender that approved
2 of 2 cannot display 100%; thin samples are pulled toward the conservative end in proportion to
their thinness. This is the same small-sample discipline that the ranking's percentile gate
enforces — learned the hard way when an unadjusted first pass put a 529-loan credit union in the
national top ten.

State is additionally a **hard availability filter**: a lender with no observed 2025 originations
in the applicant's state is excluded outright, regardless of how good its rates look elsewhere.

## The one heuristic, disclosed

**HMDA contains no credit score.** It carries a scoring *model* code, not a FICO. Nothing in this
data can compute approval odds by credit tier, and any product claiming otherwise is inventing it.

What HMDA *does* record is **denial reasons**. Full-file distribution across all 757,991 stated
reasons on 2025 HELOC denials:

| Reason | Share | Count |
| --- | --- | --- |
| Debt-to-income | 38.4% | 291,241 |
| Credit history | 27.6% | 209,059 |
| Collateral / property | 13.3% | 100,922 |
| Other | 8.7% | 66,051 |
| Incomplete application | 7.7% | 58,173 |
| Unverifiable information | 3.1% | 23,125 |
| Employment history | 0.9% | 7,036 |
| Insufficient cash | 0.3% | 2,384 |

Two reasons alone — debt-to-income and credit history — account for **66% of every HELOC denial in
the country**. That is the single most useful fact in this dataset for a consumer, and it is why
the funnel conditions on DTI directly and treats credit sensitivity as a per-lender trait.

So a lender whose denials are dominated by credit history is a materially worse bet for a
weak-credit applicant than one whose denials are dominated by DTI. The model scales each lender's
score by that share against the applicant's self-reported credit band:

```
adjusted = wilsonLowerBound × (1 − penalty[creditBand] × lender.creditDenialShare)
penalty = { excellent: 0, good: 0.12, fair: 0.35, rebuilding: 0.60 }
```

This is **directional, not measured**, and the results page says so. It is the only non-empirical
element in the model.

## Presentation constraints (non-negotiable)

- The percentage is labeled **"2025 approval rate for this profile"** — never "your approval odds."
  It is a historical fact about other applicants, not a prediction about the user.
- Display is capped below 100% so no card ever promises certainty, and every result is paired with
  a qualitative band (Strong / Good / Mixed / Long odds / Unlikely).
- A standing disclosure states plainly that this is **not a preapproval**, no lender has seen the
  application, and the estimate rests on prior-year behavior.
- DTI is **estimated** — the new line's payment is approximated as interest-only at 8.5%. A real
  underwriter uses documented income, the actual note rate, and a lender-specific fully-drawn
  payment assumption. Disclosed on the results page.

## The size confound — the most important correction in this model

An early version of the funnel put **Northpointe Bank at #1 because it approved 100% of 133
applications** in the matching cell. That result triggered a validity check that changed the model.

**Approval rate falls monotonically as lender size rises.** Across all 1,095 lenders with 100+
applications:

| Lender size quintile | Applications | Mean approval rate |
| --- | --- | --- |
| Q1 (smallest) | 101–255 | 77.2% |
| Q2 | 255–418 | 76.5% |
| Q3 | 418–764 | 75.0% |
| Q4 | 765–1,691 | 71.9% |
| Q5 (largest) | 1,694–116,710 | 67.8% |

Fitted across the eligible pool: `approval = 1.134 − 0.121 × log₁₀(applications)`. **Every tenfold
increase in lender size costs about 12 points of approval rate.**

### This is an intake artefact, not generosity

A small bank or credit union takes a formal application only after a loan officer has already
qualified the borrower by phone. A large lender with an online funnel accepts everyone's
application and declines in underwriting. **The denominators are not measuring the same event.** A
small lender's approval rate substantially measures its intake policy; a large lender's
substantially measures its underwriting.

### Statistical correction does not fix it

Empirical Bayes shrinkage toward the market base rate was implemented and rejected. Method-of-
moments on the beta-binomial returns a prior strength of **k = 13 pseudo-applications** — i.e. the
between-lender variance is genuinely large, so the correct Bayesian answer is "trust each lender's
own data." At k=13 a 133-of-133 record still reports 97%.

That is the right answer to the question shrinkage asks, and the wrong answer to the question we
have. **Wilson bounds and shrinkage both address sampling error. This is a validity problem — the
number measures the wrong construct — and no variance correction repairs it.**

A volume floor alone does not repair it either. The gradient survives every cut tested:

| Cohort | Smallest → largest quintile | Spread |
| --- | --- | --- |
| All lenders | 85.6% → 68.3% | 17.3 pts |
| Top 20% by originations | 80.0% → 64.7% | 15.3 pts |
| Top 5% by originations | 74.3% → 55.2% | 19.1 pts |

### What we actually do

Three changes, together:

1. **Eligibility floor — top quintile by originations.** 220 lenders with ≥940 2025 HELOC
   originations, together **80.7% of all HELOC volume**. This is for consumer viability, not bias
   repair: below this line the lender is unlikely to be a real option.
2. **Size-relative comparison.** Each lender is scored against lenders *of its own size* on *the
   same borrower profile*. The fitted slope supplies the size effect; the intercept is recentred on
   the mean rate the eligible pool actually shows for that specific profile, so the residual reads
   as "better or worse than peers its size" rather than absorbing how easy the profile is.
3. **Scale is an explicit ranking input** — 65% size-adjusted approval, 35% lending scale. This is
   a product judgment, stated rather than buried: a large lender that declines 30% is a more
   reliable option for a consumer than a boutique that declines nobody because it only accepts
   pre-qualified applicants. It also partially counteracts the residual bias.

The displayed percentage remains the **honest observed rate for the profile**. The size residual is
a ranking input only — surfacing it to consumers invited more confusion than it resolved. Lending
scale is shown on every result instead.

## Speed, digital origination, and instant decisions — not available

Tested directly against the 2025 file on 89,472 HELOC application records:

| Signal | Coverage | Usable? |
| --- | --- | --- |
| `aus_1` (automated underwriting) | 3.2% | No — effectively unreported on open-end |
| `submission_of_application` | 98.6% one value | No — no variation |
| `initially_payable_to_institution` | 99.4% one value | No — no variation |

**HMDA has no funding-time, decision-time, or channel field that discriminates.** There is no
honest way to derive "instant decision" or "funds in 5 days" from this data, and inferring it from
lender type would be fabrication.

If speed is to be a ranking factor — and for this audience it likely should be — it has to come
from a **separate, manually-sourced attribute layer**: each lender's own published disclosures on
decision time, funding time, and whether the application is fully online, recorded per lender with
a source URL and a refresh date, and labelled on the page as lender-reported rather than
HMDA-derived. That keeps the compliance story intact, because the page can state exactly which
facts come from regulatory filings and which come from the lender's own marketing.

Recommended schema addition (unpopulated in this build):
`{ lei, fullyOnline, instantDecision, medianDaysToFund, sourceUrl, verifiedOn }`

## Known weaknesses

- **Membership-restricted credit unions repeatedly surfaced at #1** (Bank-Fund Staff FCU serves
  only World Bank and IMF employees). The "only lenders open to anyone" filter now defaults **on**
  for this reason; credit unions remain available one click away and are flagged wherever shown.
- **Approval rates of 100% in easy cells are real, not bugs** — low CLTV plus low DTI genuinely
  clears almost everywhere. They are nonetheless capped in display and softened by the band label.
- Withdrawn, incomplete, and approved-but-not-accepted applications (action_taken 2, 4, 5) are
  excluded. Only originated (1) and denied (3) are counted, so the denominator is decisions, not
  inquiries.
- 523 lenders carry enough volume (≥400 applications) to model. Smaller lenders are absent
  entirely rather than shown on thin data.
