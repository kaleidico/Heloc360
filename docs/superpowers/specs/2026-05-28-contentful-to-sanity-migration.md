# HELOC360 — Contentful → Sanity Migration Spec

**Date:** 2026-05-28
**Status:** Draft — discovery complete, 4 architectural decisions locked, plan-writing pending
**Stack:** Next.js 15.4 (App Router) · TypeScript · Tailwind v3 · React 18
**Repo:** `nextjs-heloc360` · remote `git@github.com:kaleidico/Heloc360.git`
**Session:** Background HQ session (job `9753df23`), invoked from `/Volumes/ExternalSSD/Sites/hq`. Renamed mid-session to `sanity-heloc360`.

---

## 1. Goal

Migrate all content management for HELOC360 from **Contentful** (current CMS) to **Sanity**. Cutover is hard: after parity verification, Contentful is archived and removed as a dependency. No dual-write phase.

## 2. Why now

- HELOC360 just shipped Plan 1 (Foundation) on 2026-05-28 and tagged `foundation-v1`. Plans 2–6 (pre-qual form, homepage, spokes, analytics, mailing list) all touch content at varying depths; doing the CMS swap **before** content-shaping plans (3, 4, 6) means later plans get to take advantage of Sanity's editorial tooling and on-demand revalidation instead of inheriting Contentful's 24-hour cache lag.
- Contentful is the only managed-SaaS dependency this site has, so eliminating it is also a billing simplification.

## 3. Current Contentful surface (discovery, 2026-05-28)

### 3.1 Content types — exactly two

| Content type ID | Fields | Notes |
|---|---|---|
| `blogPosts` | `title` (Symbol, req), `slug` (Symbol, req), `categories` (Array of Symbol), `content` (Text, **Markdown**), `excerpt` (Text), `publishDate` (Date, req), `featureImage` (Link → Asset), `seoTitle` (Symbol), `seoDescription` (Text), `seoKeyword` (Symbol), `focusKeywords` (Array of Symbol) | Body is plain Markdown in a Long Text field — **not** Contentful Rich Text. Rendered via `react-markdown`. |
| `teamMembers` | `teamMemberName` (Symbol, req, unique), `slug` (Symbol, req, unique), `title` (Symbol), `email` (Symbol), `phone` (Symbol), `linkedIn` (Symbol), `twitter` (Symbol), `about` (Text), `photo` (Link → Asset) | `about` is also Markdown-friendly Long Text in practice. |

Field-definition JSON archived at:
- `docs/contentful-blog.md` (blogPosts content-type export)
- `docs/team-members.md` (teamMembers content-type export)

### 3.2 Assets

All Contentful assets live on the standard hosts and are already whitelisted in `next.config.mjs`:

```js
remotePatterns: [
  { protocol: "https", hostname: "images.ctfassets.net" },
  { protocol: "https", hostname: "assets.ctfassets.net" },
  { protocol: "https", hostname: "downloads.ctfassets.net" },
  { protocol: "https", hostname: "sjc.microlink.io" },
]
```

Assets need to be **downloaded and re-uploaded** into Sanity during migration — this is a deliberate decision (decision 4 of §5) not to leave the site tethered to `ctfassets.net` after cutover.

### 3.3 Integration code

- **`lib/contentful.ts`** (365 lines) — the entire integration. Hand-rolled REST calls to `cdn.contentful.com` (no `contentful` SDK in `package.json`). Exposes 4 functions:
  - `getAllBlogPosts()` — list, with local-fallback to `data/blog-posts.ts`
  - `getBlogPostBySlug(slug)` — detail, with local fallback
  - `getAllTeamMembers()` — list, no fallback
  - `getTeamMemberBySlug(slug)` — detail, no fallback
  - Markdown body is returned as a plain string in `BlogPost.content`. Featured-image URL resolved from the included Assets in the collection response, with a direct `/assets/:id` fallback fetch when not included.
  - Heuristic: `featured: true` if any category equals `"Featured"` (case-insensitive). Category normalization happens via `ALLOWED_CATEGORIES` + `pickFirstAllowedCategory` in `config/blog.ts`.
  - Revalidation: `next: { revalidate: 86400 }` in production, `cache: 'no-store'` in dev. Page-level `export const revalidate = 86400` reinforces this.
  - Retry: 3 attempts with exponential backoff on 429/5xx.

- **`data/blog-posts.ts`** — static local fallback array. Currently used when Contentful returns 0 items or errors. Retained through cutover as a safety net, deleted post-cutover.

### 3.4 Consumers — 11 files import from `@/lib/contentful`

```
app/[slug]/page.tsx                              (legacy slug catcher → 301 redirect)
app/about/page.tsx                               (team list, likely)
app/api/debug/blog/route.ts                      (debug endpoint)
app/blog/page.tsx                                (blog index)
app/blog/[slug]/page.tsx                         (blog detail — also renders <ReactMarkdown>)
app/blog/page/[page]/page.tsx                    (paginated blog)
app/meet-our-team/[slug]/page.tsx                (team detail)
app/sitemap.ts
app/sitemap-blog-pagination.xml/route.ts
app/sitemap-posts.xml/route.ts
app/sitemap-team.xml/route.ts
```

**Only one place renders the markdown body:** `app/blog/[slug]/page.tsx` lines 10 & 183-192 (`import ReactMarkdown from "react-markdown"` + `<ReactMarkdown>{post.content}</ReactMarkdown>`). After migration this becomes `<PortableText value={post.body} />`.

### 3.5 Type contract

`types/blog.ts` defines `BlogPost` already with the shape the migration will preserve:

```ts
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string         // markdown today; will be PortableText[] post-migration (breaking shape change)
  author?: { name: string; image: string }   // unused today
  publishedDate: string
  readTime: number
  category: string
  tags: string[]
  featuredImage: string
  featureImageAlt?: string
  featured: boolean
  seoTitle?: string
}
```

**Decision: rename `content` to `body` and retype as `PortableTextBlock[]`** when swapping the data layer, since the string-→-PT shape change is breaking enough that a rename is clearer than overloading the same field name with two types.

---

## 4. Why Sanity (vs. alternatives)

Considered: stay on Contentful, move to Payload, move to Sanity, file-based MDX.

**Sanity selected** because:
1. **Self-hostable Studio**, embedded into the Next app — editors get a single URL (`heloc360.com/studio`) instead of a separate SaaS login.
2. **Portable Text** is structurally richer than markdown without locking into vendor-proprietary rich text (it's an open spec maintained by Sanity).
3. **GROQ** + `next-sanity` gives clean Next 15 RSC integration with tag-based revalidation and built-in draft-mode preview.
4. **Asset pipeline** has on-the-fly transformation URLs (`?w=800&fm=webp` etc.) on par with Contentful's.
5. **Webhooks** ship a built-in HMAC-signed payload format that's easy to verify in a Next API route.
6. Pricing scales more predictably than Contentful for low-edit-volume marketing sites.

Tradeoffs accepted: one-time markdown→PT conversion cost, asset re-upload cost, editor learning curve for the Sanity Studio UI.

---

## 5. The four locked decisions (2026-05-28)

These are the decisions that shaped the plan. **Already approved by Robert** — do not relitigate without explicit ask.

### Decision 1 — Studio location: embedded in Next app

The Sanity Studio mounts at `app/studio/[[...tool]]/page.tsx` inside `nextjs-heloc360`. Editors access it at `/studio`. The Sanity **cloud project** is named `heloc360` (separate billable entity), but there is **no `sanity-heloc360` sibling directory** — the `nextjs-` prefix on the repo stays accurate because Next is the primary stack and Sanity is an embedded library.

**Migration scripts** (one-time tooling: Contentful export, transform, asset upload, import) live at `scripts/migration/` inside the Next app. Deleted post-cutover.

### Decision 2 — Schemas: 1:1 mirror of Contentful

No field additions, no SEO object collapse, no author refs, no category-as-document upgrade. Field names, types, and required-flags match Contentful exactly with two surgical exceptions:

1. `blogPosts.content` (Markdown string) → `blogPost.body` (Portable Text array). **Rename forced by type change.**
2. `featureImage` (Link → Asset) → `featureImage` (Image). Same field name, Sanity-native type.

Sanity document type IDs use **singular camelCase** (`blogPost`, `teamMember`) — Contentful's plural-camelCase (`blogPosts`, `teamMembers`) is a convention quirk, not a contract. This is invisible to consumers since GROQ queries hide the type ID behind a function call.

### Decision 3 — Markdown → Portable Text: convert during import

Body content gets transformed once, at migration time, via:

```
Contentful markdown string
  → marked.parse() → HTML
  → JSDOM
  → @sanity/block-tools.htmlToBlocks(html, blockContentType)
  → Portable Text JSON
  → ndjson row in import file
```

This is the only Sanity-supported bulk path. Post-migration, editors author in the Sanity PT editor; the migration script runs **once** and is deleted.

### Decision 4 — Revalidation: Sanity webhook → `revalidateTag()`

Time-based revalidation (`export const revalidate = 86400`) is **removed** from all page files. Replaced with:

- `fetch()` calls in `lib/sanity/*` use `next: { tags: ['post', 'team'] }`.
- Sanity Studio publish-event webhook hits `app/api/revalidate/route.ts`.
- That route verifies HMAC signature, parses the payload to determine which document type changed, and calls `revalidateTag('post')` or `revalidateTag('team')`.

Editors see their changes propagate in seconds, not 24 hours.

---

## 6. Architecture after cutover

### 6.1 File layout (Next app)

```
nextjs-heloc360/
├── sanity.config.ts                  # Studio config (embedded mode)
├── sanity.cli.ts                     # CLI config (for `sanity dataset import` etc.)
├── sanity/
│   └── schemas/
│       ├── index.ts                  # schemaTypes array
│       ├── blogPost.ts               # 1:1 mirror of Contentful blogPosts
│       └── teamMember.ts             # 1:1 mirror of Contentful teamMembers
├── app/
│   ├── studio/[[...tool]]/
│   │   ├── layout.tsx                # `export const dynamic = 'force-static'`, disables Next chrome
│   │   └── page.tsx                  # `<NextStudio config={config} />`
│   └── api/
│       └── revalidate/
│           └── route.ts              # webhook receiver
├── lib/
│   └── sanity/
│       ├── client.ts                 # createClient({ projectId, dataset, apiVersion, useCdn })
│       ├── image.ts                  # urlFor() via @sanity/image-url
│       ├── queries.ts                # GROQ query strings, exported as const
│       └── api.ts                    # getAllBlogPosts/getBlogPostBySlug/getAllTeamMembers/getTeamMemberBySlug
│                                     # (drop-in replacements — same 4 names as lib/contentful.ts)
├── components/
│   └── blog/
│       └── portable-text.tsx         # <PortableText> wrapper with custom serializers
└── scripts/migration/                # deleted after cutover
    ├── 01-export.mjs                 # contentful-export programmatic
    ├── 02-upload-assets.mjs          # downloads ctfassets, uploads to Sanity, writes asset-map.json
    ├── 03-transform.mjs              # JSON → NDJSON, MD→PT, asset-ID swap
    ├── 04-import.sh                  # `npx sanity dataset import out.ndjson production --replace`
    ├── README.md                     # one-shot runbook
    └── _archive/                     # contentful-export.json + assets/ tree (gitignored)
```

### 6.2 Dependencies added to `package.json`

Runtime:
- `sanity` (Studio + schema types)
- `next-sanity` (server helpers, draft mode, Studio mount)
- `@sanity/client`
- `@sanity/image-url`
- `@sanity/vision` (dev-time Studio plugin for GROQ queries)
- `@portabletext/react` (renderer)
- `styled-components` (Studio dependency)

Migration-only (devDependencies, removed after cutover):
- `contentful-export`
- `@sanity/block-tools`
- `@sanity/schema`
- `marked`
- `jsdom`

### 6.3 Dependencies removed at cutover

- `react-markdown`
- `remark-gfm`

(Both currently used only by the one `<ReactMarkdown>` call in `app/blog/[slug]/page.tsx`.)

### 6.4 Environment variables

Added to `.env.local`, Vercel preview, and Vercel production:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=<from sanity init>
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_VERSION=2024-12-01
SANITY_API_READ_TOKEN=<viewer token, server-only>
SANITY_WEBHOOK_SECRET=<random 32-byte hex>
```

Removed at cutover:

```
CONTENTFUL_SPACE_ID
CONTENTFUL_ENVIRONMENT
CONTENTFUL_ACCESS_TOKEN
CONTENTFUL_HOST
```

---

## 7. Phased plan summary (full task-by-task plan to be written in next step)

12 tasks total, four phases. Each task ends in a clean commit.

### Phase A — Provision (Tasks 1-4)
1. Provision Sanity project + dataset (**interactive — Robert at keyboard**). `npx sanity@latest init` in the Next app, choose project name `heloc360`, dataset `production`.
2. Install Sanity dependencies, write `sanity.config.ts` + `sanity.cli.ts` + `sanity/schemas/{index,blogPost,teamMember}.ts`.
3. Mount embedded Studio at `app/studio/[[...tool]]/page.tsx`. Verify `localhost:3000/studio` loads, create a throwaway test doc, delete it.
4. Commit Phase A + tag `sanity-studio-ready`.

### Phase B — Migrate data (Tasks 5-7)
5. Export from Contentful — write & run `scripts/migration/01-export.mjs` using `contentful-export` programmatic API. Requires `CONTENTFUL_MANAGEMENT_TOKEN` (different from the CDN delivery token already in `.env`). Output committed to `scripts/migration/_archive/contentful-export.json` (gitignored). Assets to `_archive/assets/`.
6. Upload assets — write & run `scripts/migration/02-upload-assets.mjs`. Reads `_archive/assets/`, uploads each via `@sanity/client.assets.upload`, writes `_archive/asset-map.json` (Contentful asset ID → Sanity asset `_id`).
7. Transform + import — write `scripts/migration/03-transform.mjs` (the marked → HTML → `htmlToBlocks` pipeline) and `04-import.sh`. **This is where Robert writes the 5-10 line category-normalization function** — his domain knowledge about which categories matter shapes the canonicalization. Run import to `production` dataset. Verify counts: Contentful blogPosts == Sanity blogPost docs, Contentful teamMembers == Sanity teamMember docs.

### Phase C — Swap data layer (Tasks 8-10)
8. Write `lib/sanity/{client,image,queries,api}.ts`. The 4 exported functions in `api.ts` match the names and signatures of the existing `lib/contentful.ts` exports — drop-in replacement.
9. Swap consumers — update imports in all 11 consumer files from `@/lib/contentful` → `@/lib/sanity/api`. In `app/blog/[slug]/page.tsx` only: also swap `<ReactMarkdown>{post.content}</ReactMarkdown>` → `<PortableText value={post.body} />`. Run `npm run build`, must pass.
10. Update `next.config.mjs` `remotePatterns`: remove `*.ctfassets.net` entries, add `cdn.sanity.io`. Remove all `export const revalidate = 86400` lines from page files (replaced by tag-based revalidation).

### Phase D — Webhook + cutover (Tasks 11-12)
11. Write `app/api/revalidate/route.ts` with HMAC-SHA256 signature verification using `SANITY_WEBHOOK_SECRET`. Configure webhook in Sanity Studio settings: URL `https://heloc360.com/api/revalidate`, secret matches env, fires on `_type in ['blogPost', 'teamMember']`. Test end-to-end by publishing a Studio edit and watching the live page update.
12. **Parity verification + cutover.** Manual click-through of every blog and team URL against pre-cut baseline (open both in side-by-side browser tabs). On Robert's go: delete `lib/contentful.ts`, delete `data/blog-posts.ts`, delete `scripts/migration/`, remove `CONTENTFUL_*` env vars from `.env.local` + Vercel, remove `contentful-export` / `@sanity/block-tools` / `@sanity/schema` / `marked` / `jsdom` from `devDependencies`, remove `react-markdown` + `remark-gfm` from `dependencies`. Tag `sanity-cutover-v1`. Archive the Contentful space (keep for 90 days as insurance, then delete).

---

## 8. Execution model

Per `RULES.md` master rule on plan execution: **Subagent-Driven** is the default. One subagent per task, two-stage review (spec-compliance reviewer + code-quality reviewer) between tasks. No inline-execution alternative offered.

### 8.1 Worktree strategy

Each subagent gets its own worktree off `main`. Shared worktree across all 12 tasks is acceptable because the tasks are strictly sequential and the worktree state at the end of task N is the input to task N+1.

### 8.2 Manual-input tasks (cannot be subagent-executed)

- **Task 1** — `sanity init` is interactive (SSO login, project name confirmation).
- **Task 5** — requires `CONTENTFUL_MANAGEMENT_TOKEN` (not in `.env`; Robert needs to generate one in the Contentful UI: Settings → API keys → Content management tokens).
- **Task 7 micro-step** — the category-normalization function (intentionally left to Robert).
- **Task 11** — webhook URL + secret pasted into Sanity Studio web UI.
- **Task 12 go/no-go** — visual parity check.

Plan doc should flag each of these with a **`[MANUAL]`** marker so the dispatching agent stops and waits.

### 8.3 Execution caveats (learned from prior plans)

- **Do not run `npm run build` while `npm run dev` is alive** — corrupts the dev server's chunk map (memory `feedback_nextjs_dev_build_collision.md`). Subagents should kill any running dev server before `next build`.
- Em-dashes in commit messages and content strings should be real `U+2014`, not `--`. Verify via byte-level check.
- Final whole-plan code review (Opus) after task 12 before pushing to remote. Don't push intermediate commits during execution.

---

## 9. Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Markdown → PT conversion drops formatting (nested lists, custom HTML in markdown) | Medium | Medium — visible regression in blog posts | Diff 3 representative posts pre-/post-conversion before bulk import. If issues, tune `htmlToBlocks` rules in the transform script. |
| Asset upload hits Sanity rate limits | Low | Low — slows migration | Built-in rate-limit handling in `@sanity/client`. If hit, batch with 100ms sleeps. |
| Webhook revalidation flakes silently | Medium | Medium — editors think their edits aren't taking | Webhook handler logs every invocation with `console.log`. Add `/api/revalidate?test=1` GET endpoint that exercises the signature path for manual smoke test. |
| Contentful CDN content drifts during migration window | Low | Low — migration window is hours not days | Export is point-in-time; freeze editorial in Contentful from start of Task 5 through cutover. Communicate window to any human editors. |
| Sanity Studio CSS conflicts with site Tailwind | Low | Medium — Studio chrome looks broken | `app/studio/[[...tool]]/layout.tsx` overrides root layout (no global Tailwind imports). next-sanity docs cover this pattern. |
| Vercel preview deployments don't receive new env vars | Medium | Low — preview builds fail | Push env to all three Vercel environments (development/preview/production) before swapping consumers in Task 9. |

---

## 10. What "done" looks like

- `localhost:3000/studio` loads, editor can create/edit/publish a blog post and a team member.
- All 11 consumer files import from `@/lib/sanity/api`. `lib/contentful.ts` and `data/blog-posts.ts` deleted.
- `npm run build` passes clean (no Contentful references).
- `app/blog/[slug]/page.tsx` renders Portable Text bodies (no `<ReactMarkdown>`).
- `next.config.mjs` `remotePatterns` references `cdn.sanity.io`, no `ctfassets`.
- Sanity webhook fires on publish, `app/api/revalidate/route.ts` returns 200, the published change appears on the live page within ~5 seconds.
- All blog and team URLs render with parity to the pre-migration baseline.
- `CONTENTFUL_*` env vars removed from `.env.local` + Vercel + GitHub repo secrets (if any).
- Contentful space archived.
- Tag `sanity-cutover-v1` pushed.
- WORKLOG.md updated.

---

## 11. Open questions for next session

1. **Existing Sanity account?** — Does Robert already have a Sanity org (e.g. for another Kaleidico site)? If yes, the new project gets nested under that org for billing; if no, Task 1 also creates the org.
2. **Vercel project name** — confirm the production deployment for HELOC360 is on Vercel and what the project name is, so env vars and webhook URL go to the right place.
3. **Production URL for webhook** — is the live domain `heloc360.com`, `www.heloc360.com`, or a subdomain? The webhook URL must hit the production deployment, not a preview.
4. **Editorial freeze window** — when does Robert want the Contentful freeze + cutover window to fall? Migration runtime is ~2-3 hours of focused work but the freeze should ideally fall outside business hours for any human editors.
5. **Category list** — for the Task 7 micro-step, Robert will need to list which category strings should canonicalize to which canonical labels (e.g. "Home Equity" + "home-equity" + "Home-Equity" → "Home Equity"). The `ALLOWED_CATEGORIES` array in `config/blog.ts` is the current source of truth.

---

## 12. Where to resume

**Start next session by:**

1. Read this spec doc.
2. Confirm the 4 decisions in §5 are still locked.
3. Resolve the 5 open questions in §11 (especially Q1 and Q5 — both block Task 1 and Task 7 respectively).
4. Invoke `superpowers:writing-plans` to expand §7's 12-task summary into the full task-by-task plan document at `docs/superpowers/plans/2026-05-XX-heloc360-sanity-migration.md`. Each task gets exact paths, exact code, exact commands, exact commit messages — per the writing-plans skill convention used in `docs/superpowers/plans/2026-05-27-heloc360-foundation.md` and `2026-05-28-heloc360-prequal-form.md`.
5. Execute via Subagent-Driven Development per the master rule.

**Estimated total runtime once execution begins:** 6-10 hours of agent time across the 12 tasks, plus ~1 hour of Robert's keyboard time for the manual-input tasks in §8.2.
