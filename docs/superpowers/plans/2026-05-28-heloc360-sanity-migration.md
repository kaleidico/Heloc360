# HELOC360 Contentful → Sanity Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Contentful (current CMS) with Sanity (embedded Studio + Portable Text + webhook revalidation) for both blog posts and team members. Hard cutover: after parity verification Contentful is archived and removed as a dependency. No dual-write phase.

**Architecture:** Sanity Studio embeds inside the Next app at `/studio` — no sibling repo. The Sanity cloud project is brand-new and pre-created by Robert in the sanity.io UI; Task 1 fetches its project ID + dataset name and wires env vars rather than running `sanity init`. Two singular-camelCase schemas (`blogPost`, `teamMember`) mirror the Contentful types 1:1 with two surgical exceptions: body content moves from a markdown string field (`content`) to a Portable Text array field (`body`), and `featureImage` becomes a Sanity-native Image type. The migration runs once via Node scripts under `scripts/migration/` (export → asset upload → markdown→PT transform → NDJSON import), then those scripts are deleted post-cutover. Existing 6-canonical-category list and `findBestMatch` logic from `config/blog.ts` is ported into the transform script so data lands clean; a final task removes the runtime fix-up from `config/blog.ts` after migration. Revalidation switches from 24-hour `export const revalidate = 86400` to tag-based: Sanity Studio publish webhook → HMAC-verified `/api/revalidate` route → `revalidateTag('post' | 'team')`.

**Tech Stack:** Next.js 15.4 App Router · React 18 · TypeScript · Sanity v3 (Studio + schemas) · `next-sanity` (Studio mount + helpers) · `@sanity/client` · `@sanity/image-url` · `@portabletext/react` (renderer) · `@portabletext/block-tools` + `marked` + `jsdom` (migration-only) · `contentful-export` (migration-only).

**Spec reference:** `docs/superpowers/specs/2026-05-28-contentful-to-sanity-migration.md` — §3 (Contentful surface), §5 (locked decisions), §6 (post-cutover architecture), §7 (phased plan summary), §11 (open questions — all resolved at plan-write time).

---

## Prerequisites

Open two terminal tabs at `/Volumes/ExternalSSD/Sites/nextjs-heloc360`.

**Tab A** — dev server (kept off during build steps; see note in §Execution caveats):

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
npm run dev
```

**Tab B** — git / installs / build / migration scripts.

Confirm before starting Task 1:

1. You have a Sanity project ready at sanity.io/manage (Robert's brand-new project — see Task 1 [MANUAL] step for the exact values to grab).
2. You can sign into the Sanity Studio with the same account that owns the project.
3. You have access to the Contentful space (for Task 5 you'll need a Content Management API token, generated in Contentful UI).
4. The HELOC360 Vercel project is `homebuyershaven` (deployed at `homebuyershaven.vercel.app`, custom domain swap to `heloc360.com` is post-migration).

---

## Resolved inputs at plan-write time

These were §11 open questions in the spec; resolved with Robert before plan-write.

| Question | Resolution |
|---|---|
| Sanity org/project | **Brand new project, pre-created by Robert in sanity.io UI.** Task 1 fetches project ID + dataset name from sanity.io/manage and wires env vars (no `sanity init`). |
| Vercel project name | `homebuyershaven`. Env vars get pushed there. |
| Production webhook URL | Initially `https://homebuyershaven.vercel.app/api/revalidate`. At domain go-live, update the webhook URL inside Sanity Studio settings (5-second change, no code). |
| Editorial freeze window | **None required** — Robert is the only editor. Migration runs whenever; just don't edit Contentful during the export-to-import window (a couple hours). |
| Category list | Keep the existing 6 canonical categories + `findBestMatch` logic from `config/blog.ts`. Port to migration script (Task 7), then delete the runtime version after migration (Task 13). |

---

## Architectural decisions locked at plan-write time

| Decision | Choice | Rationale |
|---|---|---|
| Studio location | **Embedded** at `app/studio/[[...tool]]/page.tsx` inside `nextjs-heloc360`. | Editors get a single URL (`/studio`) instead of a separate SaaS login. Avoids a sibling `sanity-heloc360` repo. |
| Schema fidelity | **1:1 mirror** of Contentful with two surgical exceptions. | Decision 2 from spec §5: no field additions, no SEO collapse, no author refs, no category-as-document. |
| Markdown → PT pipeline | **Convert once at migration time** via `marked` → JSDOM → `@portabletext/block-tools.htmlToBlocks`. | Decision 3 from spec §5. Editors then author in the Sanity PT editor; migration script is deleted post-cutover. |
| Revalidation | **Webhook → `revalidateTag()`** with HMAC-SHA256 verification. | Decision 4 from spec §5. All `export const revalidate = 86400` lines removed (Task 10). |
| Doc type IDs | **Singular camelCase** (`blogPost`, `teamMember`). | Cleaner; invisible to consumers since GROQ hides type IDs behind function calls. |
| Body field rename | **`content` (string) → `body` (PortableTextBlock[])**. Same field, new name. | Breaking shape change deserves a clearer name. Easier to grep for migration completeness. |
| Asset hosting | **Re-upload to Sanity** during migration (don't tether to `ctfassets.net` post-cutover). | Decision in spec §3.2. `next.config.mjs` remotePatterns swap in Task 10. |
| Category list | **Keep the 6 canonical categories from `config/blog.ts`**, normalize at migration (Task 7), delete the runtime fixer afterwards (Task 13). | Resolved Q5. One-time canonicalization yields clean storage; runtime overhead disappears. |
| TableOfContents component | **Refactor in-place** to consume `PortableTextBlock[]` instead of markdown string. | Discovered at plan-write time — `components/blog/table-of-contents.tsx` parses markdown headings via regex; it needs a PT walker. Same `heading-${N}` ID contract preserved. |
| Static fallback `data/blog-posts.ts` | **Keep through cutover, delete at Task 12.** | Safety net during the swap; once Sanity is verified, dead weight. |
| Contentful space | **Archive, don't delete**, after cutover. | 90-day insurance window. Spec §10. |

---

## File structure

| Path | Action | Responsibility |
|---|---|---|
| `sanity.config.ts` | **Create** | Sanity v3 config: project ID, dataset, plugins (`structureTool`, `visionTool`), schema reference. |
| `sanity.cli.ts` | **Create** | CLI config for `npx sanity dataset import` etc. |
| `sanity/schemas/index.ts` | **Create** | Exports `schemaTypes` array. |
| `sanity/schemas/blogPost.ts` | **Create** | 1:1 mirror of Contentful `blogPosts` content type. |
| `sanity/schemas/teamMember.ts` | **Create** | 1:1 mirror of Contentful `teamMembers` content type. |
| `app/studio/layout.tsx` | **Create** | Disables Next chrome for the Studio route. `force-static` + minimal HTML scaffold. |
| `app/studio/[[...tool]]/page.tsx` | **Create** | `<NextStudio config={config} />` mount. |
| `lib/sanity/client.ts` | **Create** | `createClient({ projectId, dataset, apiVersion, useCdn })` + `serverClient` (with token). |
| `lib/sanity/image.ts` | **Create** | `urlFor()` via `@sanity/image-url`. |
| `lib/sanity/queries.ts` | **Create** | GROQ query string constants. |
| `lib/sanity/api.ts` | **Create** | `getAllBlogPosts`, `getBlogPostBySlug`, `getAllTeamMembers`, `getTeamMemberBySlug` — drop-in replacements for `lib/contentful.ts` exports. |
| `components/blog/portable-text.tsx` | **Create** | `<PortableText>` wrapper with heading components that set `id="heading-{N}"` for TOC scroll. |
| `components/blog/table-of-contents.tsx` | **Modify** | Replace markdown-string heading parser with a Portable Text block walker. Same `id="heading-{N}"` contract. |
| `app/blog/[slug]/page.tsx` | **Modify** | Import swap; `<ReactMarkdown>` → `<PortableText>`; `post.content` → `post.body`; remove `export const revalidate = 86400`. |
| `app/blog/page.tsx` | **Modify** | Import swap; remove `export const revalidate = 86400`. |
| `app/blog/page/[page]/page.tsx` | **Modify** | Import swap; remove `export const revalidate = 86400`. |
| `app/[slug]/page.tsx` | **Modify** | Import swap; remove `export const revalidate = 86400`. |
| `app/meet-our-team/[slug]/page.tsx` | **Modify** | Import swap. |
| `app/about/page.tsx` | **Modify** | Import swap. |
| `app/api/debug/blog/route.ts` | **Modify** | Import swap. |
| `app/sitemap.ts` | **Modify** | Import swap. |
| `app/sitemap-blog-pagination.xml/route.ts` | **Modify** | Import swap. |
| `app/sitemap-posts.xml/route.ts` | **Modify** | Import swap. |
| `app/sitemap-team.xml/route.ts` | **Modify** | Import swap. |
| `types/blog.ts` | **Modify** | `content: string` → `body: PortableTextBlock[]`. |
| `next.config.mjs` | **Modify** | Drop `*.ctfassets.net` remotePatterns; add `cdn.sanity.io`. |
| `app/api/revalidate/route.ts` | **Create** | Webhook receiver: HMAC verify → `revalidateTag()`. |
| `scripts/migration/01-export.mjs` | **Create** (one-time) | `contentful-export` programmatic call → `_archive/contentful-export.json`. |
| `scripts/migration/02-upload-assets.mjs` | **Create** (one-time) | Reads `_archive/assets/`, uploads to Sanity, writes `_archive/asset-map.json`. |
| `scripts/migration/03-transform.mjs` | **Create** (one-time) | Reads `contentful-export.json` + `asset-map.json`, writes NDJSON for `sanity dataset import`. |
| `scripts/migration/04-import.sh` | **Create** (one-time) | One-line `npx sanity dataset import out.ndjson production --replace`. |
| `scripts/migration/_archive/` | **Create** (gitignored, not committed) | Holds raw Contentful export + downloaded assets. |
| `.gitignore` | **Modify** | Add `scripts/migration/_archive/`. |
| `config/blog.ts` | **Modify** (Task 13) | Remove runtime `findBestMatch` and `ALLOWED_CATEGORIES` after migration; switch to passthrough. |
| `lib/contentful.ts` | **Delete** (Task 12) | After parity verification. |
| `data/blog-posts.ts` | **Delete** (Task 12) | Static fallback no longer needed. |
| `scripts/migration/` | **Delete** (Task 12) | One-time tooling, archived to git history. |

---

## Execution caveats

- **Do not run `npm run build` while `npm run dev` is alive.** Memory `feedback_nextjs_dev_build_collision.md` documents that this corrupts the dev server's chunk map; recover with kill + `rm -rf .next` + restart. Before any `next build` step in this plan, kill any running dev server in Tab A.
- **Em-dashes** in commit messages and content strings should be real `U+2014`, not `--`.
- **Don't push intermediate commits during execution.** Push once after the final whole-plan code review (post-Task 13).
- **Studio CSS:** the Studio route uses its own `app/studio/layout.tsx` that bypasses the global Tailwind layout. If Studio looks unstyled or broken, that layout is the first place to look.
- **`@portabletext/block-tools` requires JSDOM at runtime.** Migration scripts run under Node 20+ with `--experimental-vm-modules` not required — `marked` v12+ and `jsdom` v24+ both work cleanly in ESM.

---

## Task 1: Wire up the pre-created Sanity project (env vars + dependencies)

**Files:**
- Modify: `.env.local`
- Modify: `package.json` (via `npm install`)
- Create: `vercel env` entries in `homebuyershaven` project (development + preview + production)

This task does NOT run `npx sanity init` — Robert already created the project in sanity.io/manage. We just fetch its ID and wire env vars.

- [ ] **Step 1: [MANUAL] Fetch the Sanity project credentials.**

In a browser, sign into https://www.sanity.io/manage and open the new HELOC360 project. From the project's dashboard, copy:

- **Project ID** (8-character alphanumeric, visible in the URL and at top of the page).
- **Dataset name** (almost certainly `production`; if Robert created a different one, use that).

Then in the same project's API → Tokens section, create a **Viewer** token (read-only). Copy the token value — it's shown once.

Then create a **second token** with **Editor** scope for the migration import — copy that too. Note: the Editor token is only needed during Task 7's import step and webhook setup; the Viewer token is what the running Next.js site uses at runtime.

Generate a random hex string for the webhook secret:

```bash
openssl rand -hex 32
```

- [ ] **Step 2: Add env vars to `.env.local`.**

Append to `/Volumes/ExternalSSD/Sites/nextjs-heloc360/.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=<paste project ID>
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_VERSION=2024-12-01
SANITY_API_READ_TOKEN=<paste Viewer token>
SANITY_API_WRITE_TOKEN=<paste Editor token — used by migration scripts only>
SANITY_WEBHOOK_SECRET=<paste openssl output>
```

Confirm none of these accidentally landed in source control:

```bash
grep -E 'SANITY_API_(READ|WRITE)_TOKEN' /Volumes/ExternalSSD/Sites/nextjs-heloc360/.env.local
git check-ignore -v .env.local
```

Expected: tokens visible in the file, `git check-ignore` confirms `.env.local` is ignored.

- [ ] **Step 3: [MANUAL] Push the public env vars to Vercel.**

Public-prefixed vars must exist on Vercel for `next build` to bake them into the client bundle:

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
vercel link  # only if not already linked; pick the homebuyershaven project
vercel env add NEXT_PUBLIC_SANITY_PROJECT_ID
# paste value, choose: Production, Preview, Development
vercel env add NEXT_PUBLIC_SANITY_DATASET
# paste "production", choose: Production, Preview, Development
vercel env add SANITY_API_VERSION
# paste "2024-12-01", choose: Production, Preview, Development
vercel env add SANITY_API_READ_TOKEN
# paste Viewer token, choose: Production, Preview
vercel env add SANITY_WEBHOOK_SECRET
# paste secret, choose: Production
```

`SANITY_API_WRITE_TOKEN` does NOT go to Vercel — it's migration-script-only.

Verify:

```bash
vercel env ls | grep SANITY
```

Expected: 5 entries (read token, secret on Prod only; the 3 public vars on all 3 environments).

- [ ] **Step 4: Install Sanity runtime dependencies.**

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
npm install sanity@^3 next-sanity@^9 @sanity/client@^6 @sanity/image-url@^1 @sanity/vision@^3 @portabletext/react@^3 styled-components@^6
```

- [ ] **Step 5: Install migration-only devDependencies.**

These will all be removed at Task 12 cutover:

```bash
npm install --save-dev contentful-export@^7 @portabletext/block-tools@^1 @sanity/schema@^3 marked@^12 jsdom@^24
```

- [ ] **Step 6: Verify install integrity.**

```bash
node -e "console.log(require('sanity/package.json').version)"
node -e "console.log(require('@sanity/client/package.json').version)"
node -e "console.log(require('@portabletext/react/package.json').version)"
node -e "console.log(require('contentful-export/package.json').version)"
node -e "console.log(require('@portabletext/block-tools/package.json').version)"
```

Expected: each prints a real version number (no `Error: Cannot find module`).

- [ ] **Step 7: Commit.**

```bash
git add package.json package-lock.json
git commit -m "feat(sanity): install runtime + migration dependencies"
```

The `.env.local` change is intentionally NOT committed (`.gitignore` keeps it out).

---

## Task 2: Sanity schemas (1:1 mirror of Contentful)

**Files:**
- Create: `sanity/schemas/index.ts`
- Create: `sanity/schemas/blogPost.ts`
- Create: `sanity/schemas/teamMember.ts`
- Create: `sanity/schemas/utils.ts`

- [ ] **Step 0a: Create `sanity/schemas/utils.ts`.** Scopes slug-uniqueness validation per document type (Sanity slugs aren't unique by default; Contentful had `unique: true` on `blogPosts.slug` and `teamMembers.slug`).

```ts
import type { SlugIsUniqueValidator } from 'sanity'

export const isUniqueAcrossAllDocuments: SlugIsUniqueValidator = async (slug, context) => {
  const { document, getClient } = context
  const client = getClient({ apiVersion: '2024-12-01' })
  const id = document?._id?.replace(/^drafts\./, '')
  const type = document?._type
  const params = { draft: `drafts.${id}`, published: id, slug, type }
  const query = `!defined(*[!(_id in [$draft, $published]) && slug.current == $slug && _type == $type][0]._id)`
  return await client.fetch(query, params)
}
```

- [ ] **Step 1: Create `sanity/schemas/blogPost.ts`.**

```ts
import { defineType, defineField, defineArrayMember } from 'sanity'
import { isUniqueAcrossAllDocuments } from './utils'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96, isUnique: isUniqueAcrossAllDocuments },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
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
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  { name: 'href', type: 'url', title: 'URL' },
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt text' },
          ],
        }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featureImage',
      title: 'Feature image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt text' },
      ],
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'seoKeyword',
      title: 'SEO keyword',
      type: 'string',
    }),
    defineField({
      name: 'focusKeywords',
      title: 'Focus keywords',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
  ],
  preview: {
    select: { title: 'title', date: 'publishDate', media: 'featureImage' },
    prepare({ title, date, media }) {
      return { title, subtitle: date ? new Date(date).toLocaleDateString() : 'No date', media }
    },
  },
})
```

- [ ] **Step 2: Create `sanity/schemas/teamMember.ts`.**

```ts
import { defineType, defineField } from 'sanity'
import { isUniqueAcrossAllDocuments } from './utils'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({
      name: 'teamMemberName',
      title: 'Team member name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'teamMemberName', maxLength: 96, isUnique: isUniqueAcrossAllDocuments },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'linkedIn', title: 'LinkedIn', type: 'string' }),
    defineField({ name: 'twitter', title: 'Twitter', type: 'string' }),
    defineField({ name: 'about', title: 'About', type: 'text', rows: 6 }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt text' },
      ],
    }),
  ],
  preview: {
    select: { title: 'teamMemberName', subtitle: 'title', media: 'photo' },
  },
})
```

- [ ] **Step 3: Create `sanity/schemas/index.ts`.**

```ts
import { blogPost } from './blogPost'
import { teamMember } from './teamMember'

export const schemaTypes = [blogPost, teamMember]
```

- [ ] **Step 4: Type-check the schema files in isolation.**

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
npx tsc --noEmit --jsx preserve --moduleResolution bundler --module esnext --target esnext --skipLibCheck sanity/schemas/index.ts sanity/schemas/blogPost.ts sanity/schemas/teamMember.ts sanity/schemas/utils.ts
```

Expected: no output (no errors). If `sanity` doesn't resolve, the install in Task 1 didn't complete — go back.

- [ ] **Step 5: Commit.**

```bash
git add sanity/schemas/
git commit -m "feat(sanity): blogPost + teamMember schemas (1:1 Contentful mirror)"
```

---

## Task 3: Sanity config files (`sanity.config.ts` + `sanity.cli.ts`)

**Files:**
- Create: `sanity.config.ts`
- Create: `sanity.cli.ts`

- [ ] **Step 1: Create `sanity.config.ts`.**

```ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'HELOC360 Content',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
})
```

- [ ] **Step 2: Create `sanity.cli.ts`.**

```ts
import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
})
```

- [ ] **Step 3: Smoke-test by booting the Sanity CLI.**

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
npx sanity --version
npx sanity projects list
```

Expected: version prints; the projects list includes your HELOC360 project (or prompts a login — sign in, then re-run).

- [ ] **Step 4: Commit.**

```bash
git add sanity.config.ts sanity.cli.ts
git commit -m "feat(sanity): config + CLI config for embedded Studio"
```

---

## Task 4: Mount the embedded Studio at `/studio`

**Files:**
- Create: `app/studio/layout.tsx`
- Create: `app/studio/[[...tool]]/page.tsx`
- Modify: `next.config.mjs` (add `transpilePackages: ['sanity']`)

The Studio needs its own layout segment to re-export the `metadata` + `viewport` that `next-sanity` provides (which override the site's metadata for this route). Because the Studio is a **nested** layout under `app/layout.tsx` (which already renders `<html><body>`), this file does NOT re-render html/body — doing so would produce duplicate tags and a hydration mismatch. The site chrome is excluded by virtue of `app/studio/` living outside the `(site)` route group (see Task 4.5).

The `transpilePackages: ['sanity']` config is REQUIRED. Without it, Sanity's source code (which uses `styled-components` internally) renders list children without keys, producing a dev-mode React warning ("Each child in a list should have a unique 'key' prop. Check the render method of StyledBox"). The next-sanity docs document this as a required Next.js setup step for embedded Studio.

- [ ] **Step 1: Create `app/studio/layout.tsx`.**

```tsx
import type { ReactNode } from 'react'

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 2: Create `app/studio/[[...tool]]/page.tsx`.**

```tsx
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config'

export const dynamic = 'force-static'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

- [ ] **Step 2.5: Add `transpilePackages: ['sanity']` to `next.config.mjs`.**

Open `next.config.mjs` and add `transpilePackages: ['sanity'],` near the top of the `nextConfig` object (right after the `trailingSlash` line is a fine spot):

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
	poweredByHeader: false,
	trailingSlash: false,
	// Required for embedded Sanity Studio: transpile Sanity's source so its
	// styled-components internals render correctly (otherwise StyledBox emits
	// list-children without keys and React dev-mode warns).
	transpilePackages: ['sanity'],
	// ... rest of existing config unchanged ...
```

This setting is specifically called out by `next-sanity`'s README for App Router + embedded Studio. Without it, Studio still loads but emits a noisy `Each child in a list should have a unique "key" prop. Check the render method of StyledBox.` warning in the browser console.

- [ ] **Step 3: Boot the dev server and verify the Studio loads.**

In Tab A:

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
npm run dev
```

Open `http://localhost:3000/studio` (or whatever port Tab A reports). Expected behavior:

1. Studio chrome loads (left-nav with "Blog Post" and "Team Member" doc types).
2. Sign-in flow runs if you're not already authenticated.
3. Create a throwaway test Blog Post — title "DELETEME", any slug, future publish date — and hit Publish.
4. Delete it from the Studio's three-dot menu before moving on.

If the Studio shows a blank page or "Project not found": check that `NEXT_PUBLIC_SANITY_PROJECT_ID` actually got read by the running dev server (restart Tab A if you added the env after the server started).

- [ ] **Step 4: Commit.**

```bash
git add app/studio/
git commit -m "feat(sanity): mount embedded Studio at /studio"
```

- [ ] **Step 5: Tag the milestone `sanity-studio-ready`.**

```bash
git tag sanity-studio-ready
git tag -l 'sanity-studio-ready' -n10
```

---

## Task 4.5: Route-group refactor — `app/(site)/` for site chrome, bare `app/studio/`

**Why this exists:** Task 4 mounted the Studio at `/studio`, but a smoke test caught that the root `app/layout.tsx` (which has the site Header, Footer, StickyCta, structured data, and global CSS) wraps every route including `/studio`. Nested layouts nest with the root in Next.js App Router — they don't replace it. So the Studio HTTP response includes site chrome, which both looks broken visually and adds the site's global Tailwind/font CSS on top of the Studio's own UI stack.

The standard fix is route groups: move all site routes into `app/(site)/` with a `(site)/layout.tsx` holding the chrome, and trim `app/layout.tsx` to a minimal `<html><body>{children}</body></html>` shell. Route groups are URL-invisible — every site route keeps its existing URL.

This refactor also benefits Phase E (Tasks 14-15) — the catch-all Sanity page route can live at `app/(site)/[...slug]/page.tsx` and automatically inherit site chrome, rather than needing its own duplicate layout.

**Files:**
- Create: `app/(site)/layout.tsx`
- Modify: `app/layout.tsx` (trim to minimal)
- Move (git mv): every directory and file currently in `app/` EXCEPT `layout.tsx`, `globals.css`, and `studio/` into `app/(site)/`. Specifically:
  - `app/[slug]/` → `app/(site)/[slug]/`
  - `app/about/` → `app/(site)/about/`
  - `app/affiliate-disclosure/` → `app/(site)/affiliate-disclosure/`
  - `app/api/` → `app/(site)/api/`
  - `app/blog/` → `app/(site)/blog/`
  - `app/calculators/` → `app/(site)/calculators/`
  - `app/communication-consent/` → `app/(site)/communication-consent/`
  - `app/contact/` → `app/(site)/contact/`
  - `app/heloc-101/` → `app/(site)/heloc-101/`
  - `app/meet-our-team/` → `app/(site)/meet-our-team/`
  - `app/pre-qual/` → `app/(site)/pre-qual/`
  - `app/privacy/` → `app/(site)/privacy/`
  - `app/terms/` → `app/(site)/terms/`
  - `app/not-found.tsx` → `app/(site)/not-found.tsx`
  - `app/not-found-client.tsx` → `app/(site)/not-found-client.tsx`
  - `app/page.tsx` → `app/(site)/page.tsx`
  - `app/sitemap.ts` → `app/(site)/sitemap.ts`
  - `app/sitemap-blog-pagination.xml/` → `app/(site)/sitemap-blog-pagination.xml/`
  - `app/sitemap-posts.xml/` → `app/(site)/sitemap-posts.xml/`
  - `app/sitemap-team.xml/` → `app/(site)/sitemap-team.xml/`

After the refactor `app/` contains only: `layout.tsx`, `globals.css`, `studio/`, `(site)/`.

- [ ] **Step 1: Create the `(site)` directory.**

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
mkdir -p "app/(site)"
```

- [ ] **Step 2: `git mv` every site route into the group.**

Use `git mv` (not plain `mv`) so git tracks renames and history is preserved:

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
git mv "app/[slug]" "app/(site)/[slug]"
git mv app/about "app/(site)/about"
git mv app/affiliate-disclosure "app/(site)/affiliate-disclosure"
git mv app/api "app/(site)/api"
git mv app/blog "app/(site)/blog"
git mv app/calculators "app/(site)/calculators"
git mv app/communication-consent "app/(site)/communication-consent"
git mv app/contact "app/(site)/contact"
git mv app/heloc-101 "app/(site)/heloc-101"
git mv app/meet-our-team "app/(site)/meet-our-team"
git mv app/pre-qual "app/(site)/pre-qual"
git mv app/privacy "app/(site)/privacy"
git mv app/terms "app/(site)/terms"
git mv app/not-found.tsx "app/(site)/not-found.tsx"
git mv app/not-found-client.tsx "app/(site)/not-found-client.tsx"
git mv app/page.tsx "app/(site)/page.tsx"
git mv app/sitemap.ts "app/(site)/sitemap.ts"
git mv app/sitemap-blog-pagination.xml "app/(site)/sitemap-blog-pagination.xml"
git mv app/sitemap-posts.xml "app/(site)/sitemap-posts.xml"
git mv app/sitemap-team.xml "app/(site)/sitemap-team.xml"
```

Verify what's left at `app/` root:

```bash
ls -1 app/ | sort
```

Expected exactly: `(site)`, `globals.css`, `layout.tsx`, `studio`.

- [ ] **Step 3: Create `app/(site)/layout.tsx` with the chrome.**

Move the chrome out of `app/layout.tsx` into this file. The site layout is a SERVER component (no `'use client'`) — it just composes header/footer/main with children inside.

```tsx
import type React from "react"
import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import dynamic from "next/dynamic"
import TrackingProvider from "@/components/tracking-provider"

const ScrollToTop = dynamic(() => import("@/components/scroll-to-top"), {
  loading: () => null,
})

const StickyCta = dynamic(() => import("@/components/sticky-cta"), {
  loading: () => null,
})

export const metadata: Metadata = {
  metadataBase: new URL("https://heloc360.com"),
  title: {
    default: "HELOC360 - Your Trusted Partner in Home Equity Lines of Credit",
    template: "%s | HELOC360",
  },
  description:
    "Turn your home's value into opportunities that work for you. Get pre-qualified for a HELOC with vetted lenders. Expert guidance, simplified process, free & confidential.",
  keywords: [
    "HELOC",
    "Home Equity Line of Credit",
    "Home Equity",
    "Debt Consolidation",
    "Home Improvement Loans",
    "Second Mortgage",
    "Home Equity Lenders",
    "HELOC Calculator",
    "Home Equity Calculator",
  ],
  authors: [{ name: "HELOC360 Team" }],
  creator: "HELOC360",
  publisher: "My Perfect Leads, LLC",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://heloc360.com",
    siteName: "HELOC360",
    title: "HELOC360 - Your Trusted Partner in Home Equity Lines of Credit",
    description:
      "Turn your home's value into opportunities that work for you. Get pre-qualified for a HELOC with vetted lenders.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HELOC360 - Home Equity Line of Credit Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HELOC360 - Your Trusted Partner in Home Equity Lines of Credit",
    description:
      "Turn your home's value into opportunities that work for you. Get pre-qualified for a HELOC with vetted lenders.",
    images: ["/images/twitter-image.jpg"],
    creator: "@heloc360",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#1b75bc" }],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://heloc360.com",
  },
  verification: {
    google: "KONfGE1Ipq2IMzNtKuAAeIWG-8Nr7FqnIwcwEySOkg0",
    yandex: "",
    yahoo: "",
  },
  category: "finance",
  generator: 'v0.dev'
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "HELOC360",
  description:
    "Your trusted partner in turning home equity into opportunity. We help homeowners access Home Equity Lines of Credit through vetted lenders.",
  url: "https://heloc360.com",
  logo: "https://heloc360.com/images/heloc360-logo.webp",
  image: "https://heloc360.com/images/og-image.jpg",
  telephone: "+1-800-HELOC360",
  email: "info@heloc360.com",
  address: {
    "@type": "PostalAddress",
    addressCountry: "US",
  },
  sameAs: ["https://facebook.com/heloc360", "https://twitter.com/heloc360", "https://linkedin.com/company/heloc360"],
  serviceType: "Home Equity Line of Credit Services",
  areaServed: "United States",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "HELOC Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "HELOC Pre-Qualification",
          description: "Free pre-qualification for Home Equity Lines of Credit",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Lender Matching",
          description: "Connect with vetted HELOC lenders",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "HELOC Education",
          description: "Educational resources and calculators for HELOCs",
        },
      },
    ],
  },
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand-blue text-white px-4 py-2 rounded-md z-50 focus:z-50"
      >
        Skip to main content
      </a>

      <ScrollToTop />
      <Header />

      <main id="main-content" className="min-h-screen">
        <TrackingProvider>{children}</TrackingProvider>
      </main>

      <Footer />
      <StickyCta />
    </>
  )
}
```

- [ ] **Step 4: Trim `app/layout.tsx` to a minimal root.**

Replace the entire file with:

```tsx
import type React from "react"
import type { Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ['system-ui', 'arial'],
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1b75bc" },
    { media: "(prefers-color-scheme: dark)", color: "#02c39a" },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

Note: `metadata`, `structuredData`, the skip-to-content link, ScrollToTop, Header, Footer, StickyCta, TrackingProvider, and the `<main>` wrapper all move to `(site)/layout.tsx`. The Contentful preconnects are gone (Task 10 retires them anyway). The Studio route, having no `(site)` wrapper, gets ONLY the minimal root + Sanity's own UI.

- [ ] **Step 5: Build to verify nothing broke.**

In Tab A: kill the dev server. In Tab B:

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
rm -rf .next
npm run build
```

Expected: build succeeds. Route table prints every existing URL exactly as before (route groups are URL-invisible). The `/studio` route also appears.

- [ ] **Step 6: Smoke-test routes.**

In Tab A:

```bash
npm run dev
```

Capture the chosen port from the dev server log. In Tab B (substitute the port if it auto-incremented):

```bash
PORT=3000  # change if needed
for path in / /blog /about /pre-qual /studio /privacy; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT$path")
  echo "$code $path"
done
```

Expected:
- `/` → 200
- `/blog` → 200
- `/about` → 200
- `/pre-qual` → 200
- `/studio` → 200
- `/privacy` → 200

Then verify Studio response no longer contains site chrome markers:

```bash
curl -s "http://localhost:$PORT/studio" | grep -cE '<header|class="[^"]*footer|StickyCta|Skip to main content' || echo 0
```

Expected: `0` (or grep returns no matches). The Studio now serves with only the minimal root layout.

Kill the dev server before proceeding.

- [ ] **Step 7: Commit.**

```bash
git add app/
git commit -m "$(cat <<'EOF'
refactor(app): route-group split — (site) for chrome, bare root for /studio

Studio at /studio was inheriting the site's Header/Footer/StickyCta/global
CSS via root layout nesting. Standard Next.js App Router fix: move all
site routes into app/(site)/ with a (site)/layout.tsx holding chrome,
trim app/layout.tsx to <html><body>{children}</body></html>. Route groups
are URL-invisible so every public URL stays the same.

Also unblocks Phase E (Tasks 14-15): the Sanity-managed catch-all page
route can live at app/(site)/[...slug]/page.tsx and inherit chrome
without duplicating layout code.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Export from Contentful

**Files:**
- Create: `scripts/migration/01-export.mjs`
- Modify: `.gitignore`

- [ ] **Step 1: [MANUAL] Generate a Contentful Management API token.**

In a browser, sign into https://app.contentful.com. Open the HELOC360 space → Settings (gear icon) → **API keys** → **Content management tokens** tab → **Generate personal token**. Name it `heloc360-sanity-migration`. Copy the token (shown once).

Then grab the Space ID from URL or from the **Content delivery / preview tokens** tab.

- [ ] **Step 2: Add migration-only env vars to `.env.local`.**

Append to `/Volumes/ExternalSSD/Sites/nextjs-heloc360/.env.local`:

```
CONTENTFUL_MANAGEMENT_TOKEN=<paste personal token>
CONTENTFUL_EXPORT_SPACE_ID=<paste space ID — should match CONTENTFUL_SPACE_ID already in this file>
CONTENTFUL_EXPORT_ENVIRONMENT=master
```

(The existing `CONTENTFUL_SPACE_ID` / `CONTENTFUL_ACCESS_TOKEN` are read-only CDN credentials — the management token has different scopes.)

- [ ] **Step 3: Update `.gitignore` to ignore the migration archive.**

Append to `/Volumes/ExternalSSD/Sites/nextjs-heloc360/.gitignore`:

```
# Sanity migration archive (raw Contentful export + assets — never committed)
scripts/migration/_archive/
```

Verify the ignore works:

```bash
mkdir -p scripts/migration/_archive
touch scripts/migration/_archive/ignored.txt
git check-ignore -v scripts/migration/_archive/ignored.txt
rm scripts/migration/_archive/ignored.txt
```

Expected: `git check-ignore` output points at the line we just added.

- [ ] **Step 4: Create `scripts/migration/01-export.mjs`.**

```js
#!/usr/bin/env node
// Exports all entries + assets from the HELOC360 Contentful space.
// Writes to scripts/migration/_archive/{contentful-export.json, assets/}.
// Reads env from .env.local via dotenv-style parsing (no dotenv dep).

import { readFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import contentfulExport from 'contentful-export'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..', '..')
const archiveDir = resolve(__dirname, '_archive')

function loadEnvLocal() {
  const envPath = resolve(repoRoot, '.env.local')
  if (!existsSync(envPath)) return
  const lines = readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
  }
}

loadEnvLocal()

const required = ['CONTENTFUL_MANAGEMENT_TOKEN', 'CONTENTFUL_EXPORT_SPACE_ID']
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing env var: ${key}. Set it in .env.local.`)
    process.exit(1)
  }
}

mkdirSync(archiveDir, { recursive: true })

await contentfulExport({
  spaceId: process.env.CONTENTFUL_EXPORT_SPACE_ID,
  environmentId: process.env.CONTENTFUL_EXPORT_ENVIRONMENT || 'master',
  managementToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
  exportDir: archiveDir,
  contentFile: 'contentful-export.json',
  downloadAssets: true,
  saveFile: true,
  errorLogFile: resolve(archiveDir, 'export-errors.log'),
  // Only blog posts + team members, not editor users or webhooks.
  skipContentModel: false,
  skipContent: false,
  skipRoles: true,
  skipWebhooks: true,
  skipEditorInterfaces: true,
})

console.log(`\nExport complete. Files in ${archiveDir}/`)
```

- [ ] **Step 5: Run the export.**

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
node scripts/migration/01-export.mjs
```

Expected behavior:

1. Console streams progress for content model + entries + assets.
2. `scripts/migration/_archive/contentful-export.json` exists and is non-empty.
3. `scripts/migration/_archive/assets/` exists and contains downloaded image files (organized by asset ID).

Sanity-check the export shape:

```bash
node -e "const data = require('./scripts/migration/_archive/contentful-export.json'); console.log({entries: data.entries?.length || 0, assets: data.assets?.length || 0, contentTypes: data.contentTypes?.map(c => c.sys.id)})"
```

Expected: a count of entries (probably tens of blog posts + a handful of team members), a matching count of assets, and `contentTypes` includes `blogPosts` and `teamMembers`.

- [ ] **Step 6: Commit the export script (NOT the archive).**

```bash
git status scripts/migration/
git add .gitignore scripts/migration/01-export.mjs
git commit -m "feat(migration): script 01 — export from Contentful"
```

Confirm the archive directory is not in the working tree to be committed:

```bash
git status --short | grep _archive
```

Expected: no output.

---

## Task 6: Upload assets to Sanity

**Files:**
- Create: `scripts/migration/02-upload-assets.mjs`

This script reads `_archive/assets/` (downloaded by Task 5), uploads each to Sanity, and produces `_archive/asset-map.json` keyed by Contentful asset ID.

- [ ] **Step 1: Create `scripts/migration/02-upload-assets.mjs`.**

```js
#!/usr/bin/env node
// Uploads every asset in _archive/assets/ to Sanity.
// Writes _archive/asset-map.json: { [contentfulAssetId]: { _id, url } }.
// Idempotent: re-running skips assets already in the map.

import { readFileSync, existsSync, writeFileSync, mkdirSync, createReadStream } from 'node:fs'
import { resolve, dirname, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@sanity/client'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..', '..')
const archiveDir = resolve(__dirname, '_archive')
const assetMapPath = resolve(archiveDir, 'asset-map.json')

function loadEnvLocal() {
  const envPath = resolve(repoRoot, '.env.local')
  if (!existsSync(envPath)) return
  const lines = readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
  }
}

loadEnvLocal()

const required = ['NEXT_PUBLIC_SANITY_PROJECT_ID', 'NEXT_PUBLIC_SANITY_DATASET', 'SANITY_API_WRITE_TOKEN']
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing env var: ${key}. Set it in .env.local.`)
    process.exit(1)
  }
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.SANITY_API_VERSION || '2024-12-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const exportPath = resolve(archiveDir, 'contentful-export.json')
if (!existsSync(exportPath)) {
  console.error(`Missing ${exportPath}. Run 01-export.mjs first.`)
  process.exit(1)
}

const exportData = JSON.parse(readFileSync(exportPath, 'utf8'))
const assets = exportData.assets || []
console.log(`Found ${assets.length} assets to upload.`)

const existingMap = existsSync(assetMapPath) ? JSON.parse(readFileSync(assetMapPath, 'utf8')) : {}

for (const asset of assets) {
  const contentfulId = asset.sys.id
  if (existingMap[contentfulId]) {
    console.log(`SKIP ${contentfulId} (already uploaded as ${existingMap[contentfulId]._id})`)
    continue
  }

  // contentful-export writes assets under _archive/assets/{spaceId}/{envId}/{assetId}/{filename}.
  // The exported asset's fields.file.url has the original CDN path; we need the local download.
  const file = asset.fields?.file?.['en-US'] || Object.values(asset.fields?.file || {})[0]
  if (!file?.url) {
    console.warn(`SKIP ${contentfulId} (no file url)`)
    continue
  }

  // contentful-export downloads to <archiveDir>/images.ctfassets.net/<space>/<asset>/<rev>/<filename>
  // We can read it from the path constructed off the url.
  const urlPath = file.url.replace(/^\/\//, 'https://').replace(/^https?:\/\//, '')
  const localPath = resolve(archiveDir, urlPath)
  if (!existsSync(localPath)) {
    console.warn(`SKIP ${contentfulId} (local file missing at ${localPath})`)
    continue
  }

  const filename = basename(localPath)
  const contentType = file.contentType || 'application/octet-stream'
  const stream = createReadStream(localPath)

  const isImage = contentType.startsWith('image/')
  console.log(`UPLOAD ${contentfulId} (${filename}, ${contentType})`)
  const uploaded = await client.assets.upload(isImage ? 'image' : 'file', stream, {
    filename,
    contentType,
  })

  existingMap[contentfulId] = { _id: uploaded._id, url: uploaded.url }
  // Persist after every upload so a crash mid-run doesn't lose progress.
  mkdirSync(archiveDir, { recursive: true })
  writeFileSync(assetMapPath, JSON.stringify(existingMap, null, 2))
}

console.log(`\nAsset upload complete. Map written to ${assetMapPath}`)
console.log(`Total mapped: ${Object.keys(existingMap).length}`)
```

- [ ] **Step 2: Run the upload.**

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
node scripts/migration/02-upload-assets.mjs
```

Expected behavior:

1. Each asset prints `UPLOAD <contentfulId> (<filename>, <contentType>)`.
2. On completion, `_archive/asset-map.json` exists with one entry per Contentful asset.
3. Re-running the script prints `SKIP` for every asset (idempotency check).

Sanity-check:

```bash
node -e "const m = require('./scripts/migration/_archive/asset-map.json'); const ids = Object.keys(m); console.log({count: ids.length, sample: ids.slice(0, 2).map(id => ({contentfulId: id, sanityId: m[id]._id}))})"
```

Expected: a non-zero count and Sanity IDs of the form `image-abc123-1920x1080-jpg`.

- [ ] **Step 3: Commit the upload script.**

```bash
git status scripts/migration/
git add scripts/migration/02-upload-assets.mjs
git commit -m "feat(migration): script 02 — upload assets to Sanity"
```

(The `asset-map.json` lives inside the gitignored `_archive/` — confirm `git status --short | grep _archive` returns nothing.)

---

## Task 7: Transform Contentful export → Sanity NDJSON + import

**Files:**
- Create: `scripts/migration/03-transform.mjs`
- Create: `scripts/migration/04-import.sh`

This task ports the canonicalization logic from `config/blog.ts` (the 6-canonical-category `findBestMatch`), runs the MD → HTML → htmlToBlocks pipeline, and emits NDJSON ready for `npx sanity dataset import`.

- [ ] **Step 1: Create `scripts/migration/03-transform.mjs`.**

```js
#!/usr/bin/env node
// Transforms _archive/contentful-export.json → _archive/out.ndjson.
// - Maps blogPosts → blogPost docs with body as Portable Text.
// - Maps teamMembers → teamMember docs.
// - Resolves asset references via _archive/asset-map.json.
// - Normalizes categories via the ported findBestMatch from config/blog.ts.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { JSDOM } from 'jsdom'
import { marked } from 'marked'
import { htmlToBlocks } from '@portabletext/block-tools'
import { Schema } from '@sanity/schema'

const __dirname = dirname(fileURLToPath(import.meta.url))
const archiveDir = resolve(__dirname, '_archive')

const exportPath = resolve(archiveDir, 'contentful-export.json')
const assetMapPath = resolve(archiveDir, 'asset-map.json')
const outPath = resolve(archiveDir, 'out.ndjson')

if (!existsSync(exportPath) || !existsSync(assetMapPath)) {
  console.error('Missing _archive/contentful-export.json or asset-map.json. Run 01 and 02 first.')
  process.exit(1)
}

const exportData = JSON.parse(readFileSync(exportPath, 'utf8'))
const assetMap = JSON.parse(readFileSync(assetMapPath, 'utf8'))

// === Category normalization (ported verbatim from config/blog.ts findBestMatch) ===

const ALLOWED_CATEGORIES = [
  'General',
  'HELOC Fundamentals',
  'HELOC Tips & Success Stories',
  'Home Upgrades & Renovations',
  'Rates & Terms Insights',
  'Smart Equity Strategies',
]

function decodeHtmlEntities(text) {
  if (!text) return text
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
}

function canonicalize(input) {
  return input
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function findBestMatch(input) {
  if (!input) return 'General'
  const decoded = decodeHtmlEntities(input)
  const normalized = canonicalize(decoded)

  if (ALLOWED_CATEGORIES.includes(decoded)) return decoded
  if (ALLOWED_CATEGORIES.includes(input)) return input

  const canonicalMatch = ALLOWED_CATEGORIES.find((c) => canonicalize(c) === normalized)
  if (canonicalMatch) return canonicalMatch

  const partialMatch = ALLOWED_CATEGORIES.find(
    (c) => canonicalize(c).includes(normalized) || normalized.includes(canonicalize(c)),
  )
  if (partialMatch) return partialMatch

  return 'General'
}

function normalizeCategories(raw) {
  const out = new Set()
  for (const c of raw) {
    if (typeof c !== 'string') continue
    out.add(findBestMatch(c))
  }
  return Array.from(out)
}

// === Block content type for htmlToBlocks (mirrors sanity/schemas/blogPost.ts body field) ===

const defaultSchema = Schema.compile({
  name: 'default',
  types: [
    {
      type: 'object',
      name: 'blogPost',
      fields: [
        {
          title: 'Body',
          name: 'body',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
                { title: 'H4', value: 'h4' },
                { title: 'Quote', value: 'blockquote' },
              ],
              lists: [
                { title: 'Bullet', value: 'bullet' },
                { title: 'Numbered', value: 'number' },
              ],
              marks: {
                decorators: [
                  { title: 'Strong', value: 'strong' },
                  { title: 'Emphasis', value: 'em' },
                  { title: 'Code', value: 'code' },
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
            },
          ],
        },
      ],
    },
  ],
})

const blockContentType = defaultSchema.get('blogPost').fields.find((f) => f.name === 'body').type

function markdownToPortableText(markdown) {
  if (!markdown || typeof markdown !== 'string') return []
  const html = marked.parse(markdown)
  return htmlToBlocks(html, blockContentType, {
    parseHtml: (htmlStr) => new JSDOM(htmlStr).window.document,
  })
}

// === Helpers ===

function getLocalized(field) {
  if (field == null) return null
  if (typeof field !== 'object') return field
  return field['en-US'] ?? Object.values(field)[0]
}

function buildImageRef(contentfulAssetLink) {
  if (!contentfulAssetLink) return null
  const cfAssetId = contentfulAssetLink?.sys?.id
  if (!cfAssetId) return null
  const mapped = assetMap[cfAssetId]
  if (!mapped) {
    console.warn(`Asset ${cfAssetId} not in asset-map.json — skipping image`)
    return null
  }
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: mapped._id },
  }
}

function safeSlug(slug) {
  return { _type: 'slug', current: String(slug || '').slice(0, 96) }
}

// === Walk entries ===

const docs = []
const entries = exportData.entries || []
let blogCount = 0
let teamCount = 0
let skipped = 0

for (const entry of entries) {
  const contentTypeId = entry.sys?.contentType?.sys?.id
  const id = entry.sys?.id
  const fields = entry.fields || {}

  if (contentTypeId === 'blogPosts') {
    const title = getLocalized(fields.title)
    const slug = getLocalized(fields.slug)
    if (!title || !slug) {
      console.warn(`Skipping blogPost ${id}: missing title or slug`)
      skipped += 1
      continue
    }

    const rawCategories =
      getLocalized(fields.categories) ||
      (typeof getLocalized(fields.category) === 'string'
        ? getLocalized(fields.category).split(',').map((s) => s.trim()).filter(Boolean)
        : [])

    const doc = {
      _type: 'blogPost',
      _id: `blogPost-${id}`,
      title: String(title),
      slug: safeSlug(slug),
      categories: normalizeCategories(rawCategories),
      body: markdownToPortableText(getLocalized(fields.content)),
      excerpt: getLocalized(fields.excerpt) || undefined,
      publishDate: getLocalized(fields.publishDate),
      featureImage: buildImageRef(getLocalized(fields.featureImage)) || undefined,
      seoTitle: getLocalized(fields.seoTitle) || undefined,
      seoDescription: getLocalized(fields.seoDescription) || undefined,
      seoKeyword: getLocalized(fields.seoKeyword) || undefined,
      focusKeywords: getLocalized(fields.focusKeywords) || undefined,
    }

    // Strip undefined keys so the NDJSON is clean.
    for (const k of Object.keys(doc)) if (doc[k] === undefined) delete doc[k]
    docs.push(doc)
    blogCount += 1
  } else if (contentTypeId === 'teamMembers') {
    const name = getLocalized(fields.teamMemberName)
    const slug = getLocalized(fields.slug)
    if (!name || !slug) {
      console.warn(`Skipping teamMember ${id}: missing name or slug`)
      skipped += 1
      continue
    }

    const doc = {
      _type: 'teamMember',
      _id: `teamMember-${id}`,
      teamMemberName: String(name),
      slug: safeSlug(slug),
      title: getLocalized(fields.title) || undefined,
      email: getLocalized(fields.email) || undefined,
      phone: getLocalized(fields.phone) || undefined,
      linkedIn: getLocalized(fields.linkedIn) || undefined,
      twitter: getLocalized(fields.twitter) || undefined,
      about: getLocalized(fields.about) || undefined,
      photo: buildImageRef(getLocalized(fields.photo)) || undefined,
    }

    for (const k of Object.keys(doc)) if (doc[k] === undefined) delete doc[k]
    docs.push(doc)
    teamCount += 1
  } else {
    skipped += 1
  }
}

const ndjson = docs.map((d) => JSON.stringify(d)).join('\n') + '\n'
writeFileSync(outPath, ndjson, 'utf8')

console.log(`\nTransform complete.`)
console.log(`  Blog posts: ${blogCount}`)
console.log(`  Team members: ${teamCount}`)
console.log(`  Skipped: ${skipped}`)
console.log(`  NDJSON: ${outPath}`)
```

- [ ] **Step 2: Run the transform.**

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
node scripts/migration/03-transform.mjs
```

Expected output: a summary line with `Blog posts: N`, `Team members: M`, `Skipped: 0` (or a small number with reasons logged above).

Sanity-check the NDJSON shape:

```bash
head -1 scripts/migration/_archive/out.ndjson | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const o=JSON.parse(s.trim());console.log({_id:o._id,_type:o._type,title:o.title||o.teamMemberName,bodyBlocks:(o.body||[]).length,hasImage:!!o.featureImage||!!o.photo})})"
```

Expected: shows `_id`, `_type: 'blogPost'` (or `'teamMember'`), the title, a non-zero `bodyBlocks` count for blog posts, and `hasImage: true`.

- [ ] **Step 3: Spot-check 3 representative posts for MD→PT fidelity.**

Pick three blog posts that exercise variety: one with H2/H3 headings, one with a bulleted list, one with inline code or links. From the transform log, note their slugs and inspect their `body` arrays directly:

```bash
node -e "
const fs = require('fs');
const path = require('path');
const lines = fs.readFileSync('scripts/migration/_archive/out.ndjson', 'utf8').split('\n').filter(Boolean);
for (const l of lines.slice(0, 3)) {
  const d = JSON.parse(l);
  if (d._type !== 'blogPost') continue;
  console.log('---', d.title, '---');
  for (const block of (d.body || []).slice(0, 6)) {
    console.log(JSON.stringify({style: block.style, listItem: block.listItem, text: (block.children || []).map(c => c.text).join('').slice(0, 80)}));
  }
}
"
```

Expected: blocks with `style: 'h2'`/`'h3'`/`'normal'`, `listItem: 'bullet'` on list rows, recognizable text excerpts. If headings come out wrong or bullets are missing, the `htmlToBlocks` rules in §03-transform.mjs need tuning before bulk import — that's the point of this spot-check.

- [ ] **Step 4: Create `scripts/migration/04-import.sh`.**

```bash
#!/usr/bin/env bash
# Imports the transformed NDJSON into the Sanity production dataset.
# Use --replace ONLY on first run; for re-runs, use --missing to avoid clobbering edits.
# Passes --token explicitly so import works regardless of `sanity login` CLI auth state.
set -euo pipefail

cd "$(dirname "$0")/../.."

# Load .env.local (same pattern as 01-export.mjs / 02-upload-assets.mjs) so this script
# is self-contained — no manual `source .env.local` before invoking.
if [[ -f .env.local ]]; then
  set -o allexport
  # shellcheck disable=SC1091
  source .env.local
  set +o allexport
fi

DATASET="${NEXT_PUBLIC_SANITY_DATASET:-production}"
NDJSON="scripts/migration/_archive/out.ndjson"

if [[ ! -f "$NDJSON" ]]; then
  echo "Missing $NDJSON. Run 03-transform.mjs first." >&2
  exit 1
fi

if [[ -z "${SANITY_API_WRITE_TOKEN:-}" ]]; then
  echo "Missing SANITY_API_WRITE_TOKEN in .env.local — required for import auth." >&2
  exit 1
fi

echo "Importing $NDJSON to dataset '$DATASET'..."
npx sanity dataset import "$NDJSON" "$DATASET" --replace --token "$SANITY_API_WRITE_TOKEN"
echo "Import complete."
```

Make it executable:

```bash
chmod +x scripts/migration/04-import.sh
```

- [ ] **Step 5: Run the import.**

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
./scripts/migration/04-import.sh
```

Expected behavior:

1. Sanity CLI prints progress: documents created, assets resolved.
2. On completion, no errors.

Verify in the Studio: open `http://localhost:3000/studio` (boot the dev server if not running), navigate to "Blog Post" — every post is there with `body` rendered as block content; navigate to "Team Member" — every member is there with `photo` rendered.

Verify counts match the export:

```bash
node -e "
const data = require('./scripts/migration/_archive/contentful-export.json');
const blog = data.entries.filter(e => e.sys.contentType.sys.id === 'blogPosts').length;
const team = data.entries.filter(e => e.sys.contentType.sys.id === 'teamMembers').length;
console.log({contentful: {blog, team}});
"
```

Then query Sanity (Vision plugin inside Studio, or one-shot via curl):

```bash
curl -s "https://${NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2024-12-01/data/query/production?query=count(*%5B_type%3D%3D%22blogPost%22%5D)%2Ccount(*%5B_type%3D%3D%22teamMember%22%5D)" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{console.log(JSON.parse(s).result)})"
```

Expected: the Sanity counts match the Contentful counts from the previous step.

- [ ] **Step 6: Commit the transform + import scripts.**

```bash
git add scripts/migration/03-transform.mjs scripts/migration/04-import.sh
git commit -m "feat(migration): scripts 03/04 — transform + import to Sanity"
```

---

## Task 8: Build the Sanity data layer (`lib/sanity/*`)

**Files:**
- Create: `lib/sanity/client.ts`
- Create: `lib/sanity/image.ts`
- Create: `lib/sanity/queries.ts`
- Create: `lib/sanity/api.ts`
- Modify: `types/blog.ts`
- Create: `components/blog/portable-text.tsx`

The 4 exports in `lib/sanity/api.ts` match the signatures in `lib/contentful.ts` exactly so Task 9 is a pure import-path swap (plus the one `<ReactMarkdown>` → `<PortableText>` change in `app/blog/[slug]/page.tsx`).

- [ ] **Step 1: Update `types/blog.ts` — rename `content` → `body`, retype as `PortableTextBlock[]`.**

Replace the entire file with:

```ts
import type { PortableTextBlock } from '@portabletext/types'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  body: PortableTextBlock[]
  author?: {
    name: string
    image: string
  }
  publishedDate: string
  readTime: number
  category: string
  tags: string[]
  featuredImage: string
  featureImageAlt?: string
  featured: boolean
  seoTitle?: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string
  count: number
}
```

Install the types-only package (the `@portabletext/react` install pulls types in via peer deps, but having `@portabletext/types` explicit makes the import obvious):

```bash
npm install @portabletext/types@^2
```

- [ ] **Step 2: Create `lib/sanity/client.ts`.**

```ts
import 'server-only'
import { createClient, type SanityClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.SANITY_API_VERSION || '2024-12-01'

if (!projectId) {
  console.warn('NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Sanity fetches will fail at runtime.')
}

// Public read client — uses CDN for fast cached reads.
export const sanityClient: SanityClient = createClient({
  projectId: projectId || 'missing-project-id',
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})

// Server-side authenticated client — used when we need draft access or to bypass CDN.
export const sanityServerClient: SanityClient = createClient({
  projectId: projectId || 'missing-project-id',
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: 'published',
})
```

- [ ] **Step 3: Create `lib/sanity/image.ts`.**

```ts
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { sanityClient } from './client'

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export function imageUrl(source: SanityImageSource | undefined | null): string {
  if (!source) return '/placeholder.svg'
  return urlFor(source).auto('format').url()
}
```

- [ ] **Step 4: Create `lib/sanity/queries.ts`.**

```ts
// GROQ query strings.
//
// Field projection mirrors lib/contentful.ts's mapEntryToBlogPost / mapEntryToTeamMember
// output shape so consumers don't need to change anything except their import path.

export const ALL_BLOG_POSTS_QUERY = `
  *[_type == "blogPost"] | order(publishDate desc) {
    "id": _id,
    title,
    "slug": slug.current,
    excerpt,
    body,
    publishDate,
    "categories": coalesce(categories, []),
    featureImage,
    "featureImageAlt": featureImage.alt,
    seoTitle,
    seoDescription
  }
`

export const BLOG_POST_BY_SLUG_QUERY = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    "id": _id,
    title,
    "slug": slug.current,
    excerpt,
    body,
    publishDate,
    "categories": coalesce(categories, []),
    featureImage,
    "featureImageAlt": featureImage.alt,
    seoTitle,
    seoDescription
  }
`

export const ALL_TEAM_MEMBERS_QUERY = `
  *[_type == "teamMember"] | order(teamMemberName asc) {
    "id": _id,
    "name": teamMemberName,
    "slug": slug.current,
    title,
    email,
    phone,
    linkedIn,
    twitter,
    "bio": about,
    photo
  }
`

export const TEAM_MEMBER_BY_SLUG_QUERY = `
  *[_type == "teamMember" && slug.current == $slug][0] {
    "id": _id,
    "name": teamMemberName,
    "slug": slug.current,
    title,
    email,
    phone,
    linkedIn,
    twitter,
    "bio": about,
    photo
  }
`
```

- [ ] **Step 5: Create `lib/sanity/api.ts` — drop-in replacements for the 4 contentful functions.**

```ts
import 'server-only'

import type { PortableTextBlock } from '@portabletext/types'
import type { BlogPost } from '@/types/blog'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { sanityClient } from './client'
import { imageUrl } from './image'
import {
  ALL_BLOG_POSTS_QUERY,
  BLOG_POST_BY_SLUG_QUERY,
  ALL_TEAM_MEMBERS_QUERY,
  TEAM_MEMBER_BY_SLUG_QUERY,
} from './queries'

export type TeamMember = {
  id: string
  name: string
  slug: string
  title?: string
  email?: string
  phone?: string
  linkedIn?: string
  twitter?: string
  bio?: string
  image?: string
}

// Raw shapes that come back from GROQ before mapping into the BlogPost / TeamMember interfaces.
type RawBlogPost = {
  id: string
  title: string
  slug: string
  excerpt?: string
  body?: PortableTextBlock[]
  publishDate: string
  categories: string[]
  featureImage?: SanityImageSource & { alt?: string }
  featureImageAlt?: string
  seoTitle?: string
  seoDescription?: string
}

type RawTeamMember = {
  id: string
  name: string
  slug: string
  title?: string
  email?: string
  phone?: string
  linkedIn?: string
  twitter?: string
  bio?: string
  photo?: SanityImageSource
}

const READ_TAGS = { tags: ['post'] }
const TEAM_TAGS = { tags: ['team'] }

function estimateReadTimeFromBlocks(blocks: PortableTextBlock[] | undefined): number {
  if (!blocks || blocks.length === 0) return 1
  let words = 0
  for (const block of blocks) {
    if ((block as any)._type !== 'block') continue
    const children = (block as any).children || []
    for (const child of children) {
      if (typeof child.text === 'string') {
        words += child.text.trim().split(/\s+/).filter(Boolean).length
      }
    }
  }
  return Math.max(1, Math.ceil(words / 200))
}

function excerptFromBlocks(blocks: PortableTextBlock[] | undefined, max = 220): string {
  if (!blocks) return ''
  let text = ''
  for (const block of blocks) {
    if ((block as any)._type !== 'block') continue
    const children = (block as any).children || []
    for (const child of children) {
      if (typeof child.text === 'string') text += child.text + ' '
      if (text.length >= max) break
    }
    if (text.length >= max) break
  }
  text = text.trim()
  if (text.length > max) text = text.slice(0, max).trim() + '…'
  return text
}

function mapBlogPost(raw: RawBlogPost): BlogPost {
  const categories = Array.isArray(raw.categories) ? raw.categories : []
  const category = categories[0] || 'General'
  const featured = categories.map((c) => c.toLowerCase()).includes('featured')
  const body = raw.body || []
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.seoDescription || raw.excerpt || excerptFromBlocks(body),
    body,
    publishedDate: raw.publishDate,
    readTime: estimateReadTimeFromBlocks(body),
    category,
    tags: [],
    featuredImage: imageUrl(raw.featureImage),
    featureImageAlt: raw.featureImageAlt,
    featured,
    seoTitle: raw.seoTitle,
  }
}

function mapTeamMember(raw: RawTeamMember): TeamMember {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    title: raw.title,
    email: raw.email,
    phone: raw.phone,
    linkedIn: raw.linkedIn,
    twitter: raw.twitter,
    bio: raw.bio,
    image: raw.photo ? imageUrl(raw.photo) : '/placeholder.svg',
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const raws = await sanityClient.fetch<RawBlogPost[]>(ALL_BLOG_POSTS_QUERY, {}, { next: READ_TAGS })
    return (raws || []).map(mapBlogPost)
  } catch (err) {
    console.error('Failed to load blog posts from Sanity', err)
    return []
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const raw = await sanityClient.fetch<RawBlogPost | null>(
      BLOG_POST_BY_SLUG_QUERY,
      { slug },
      { next: READ_TAGS },
    )
    return raw ? mapBlogPost(raw) : null
  } catch (err) {
    console.error('Failed to load blog post by slug from Sanity', err)
    return null
  }
}

export async function getAllTeamMembers(): Promise<TeamMember[]> {
  try {
    const raws = await sanityClient.fetch<RawTeamMember[]>(ALL_TEAM_MEMBERS_QUERY, {}, { next: TEAM_TAGS })
    return (raws || []).map(mapTeamMember)
  } catch (err) {
    console.error('Failed to load team members from Sanity', err)
    return []
  }
}

export async function getTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  try {
    const raw = await sanityClient.fetch<RawTeamMember | null>(
      TEAM_MEMBER_BY_SLUG_QUERY,
      { slug },
      { next: TEAM_TAGS },
    )
    return raw ? mapTeamMember(raw) : null
  } catch (err) {
    console.error('Failed to load team member by slug from Sanity', err)
    return null
  }
}
```

- [ ] **Step 6: Create `components/blog/portable-text.tsx` — the renderer.**

```tsx
'use client'

import { PortableText as BasePortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { imageUrl } from '@/lib/sanity/image'

// IDs match the contract used by TableOfContents: heading-{N} sequentially across h2/h3/h4.
function makeHeadingComponents(): PortableTextComponents['block'] {
  let counter = 0
  const headingFor = (Tag: 'h2' | 'h3' | 'h4') => ({ children }: { children?: React.ReactNode }) => {
    const id = `heading-${counter++}`
    return <Tag id={id}>{children}</Tag>
  }
  return {
    h2: headingFor('h2'),
    h3: headingFor('h3'),
    h4: headingFor('h4'),
  }
}

const components: PortableTextComponents = {
  block: makeHeadingComponents(),
  types: {
    image: ({ value }) => {
      if (!value) return null
      const src = imageUrl(value)
      const alt = (value as { alt?: string }).alt || ''
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={src} alt={alt} loading="lazy" />
    },
  },
  marks: {
    link: ({ value, children }) => {
      const href = (value as { href?: string })?.href || '#'
      const external = href.startsWith('http')
      return external ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <a href={href}>{children}</a>
      )
    },
  },
}

export function PortableText({ value }: { value: PortableTextBlock[] }) {
  // Recreate the heading counter on every render so navigations don't leak.
  const renderComponents: PortableTextComponents = { ...components, block: makeHeadingComponents() }
  return <BasePortableText value={value} components={renderComponents} />
}
```

- [ ] **Step 7: Type-check `lib/sanity/*` + `components/blog/portable-text.tsx` in isolation.**

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
npx tsc --noEmit
```

Expected: no errors mentioning `lib/sanity/` or `components/blog/portable-text.tsx`. Pre-existing errors in unrelated files (the repo has `ignoreBuildErrors: true` for a reason) are OK for now — but the Sanity files must be clean.

If you see "Cannot find name 'React'" inside `portable-text.tsx`, add `import type { ReactNode } from 'react'` and use `ReactNode` instead of `React.ReactNode`.

- [ ] **Step 8: Commit.**

```bash
git add types/blog.ts lib/sanity/ components/blog/portable-text.tsx package.json package-lock.json
git commit -m "feat(sanity): data layer + PortableText renderer (drop-in for lib/contentful.ts)"
```

---

## Task 9: Swap consumers (11 files) + replace ReactMarkdown + refactor TableOfContents

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `app/sitemap-blog-pagination.xml/route.ts`
- Modify: `app/sitemap-posts.xml/route.ts`
- Modify: `app/sitemap-team.xml/route.ts`
- Modify: `app/blog/page.tsx`
- Modify: `app/blog/page/[page]/page.tsx`
- Modify: `app/blog/[slug]/page.tsx`
- Modify: `app/about/page.tsx`
- Modify: `app/meet-our-team/[slug]/page.tsx`
- Modify: `app/api/debug/blog/route.ts`
- Modify: `app/[slug]/page.tsx`
- Modify: `components/blog/table-of-contents.tsx`

All 11 consumer files use the same imports; the only file that needs more than an import-path swap is `app/blog/[slug]/page.tsx` (which also renders the body) and `components/blog/table-of-contents.tsx` (which parses headings).

- [ ] **Step 1: Swap the 10 import-only files via one sed pass.**

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
# macOS sed -i needs '' before the suffix; GNU sed doesn't. This works on macOS.
for f in \
  app/sitemap.ts \
  app/sitemap-blog-pagination.xml/route.ts \
  app/sitemap-posts.xml/route.ts \
  app/sitemap-team.xml/route.ts \
  app/blog/page.tsx \
  "app/blog/page/[page]/page.tsx" \
  app/about/page.tsx \
  "app/meet-our-team/[slug]/page.tsx" \
  app/api/debug/blog/route.ts \
  "app/[slug]/page.tsx"
do
  sed -i '' "s|@/lib/contentful|@/lib/sanity/api|g" "$f"
done
```

Verify no `@/lib/contentful` references remain anywhere except `lib/contentful.ts` itself:

```bash
grep -rn "@/lib/contentful" app/ components/ --include='*.ts' --include='*.tsx'
```

Expected: no matches. (`lib/contentful.ts` still exists; it's deleted in Task 12.)

- [ ] **Step 2: Update `app/blog/[slug]/page.tsx` — swap `<ReactMarkdown>` for `<PortableText>` and `post.content` → `post.body`.**

In `app/blog/[slug]/page.tsx`:

Replace lines 10-11 (the markdown imports):

```tsx
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
```

With:

```tsx
import { PortableText } from "@/components/blog/portable-text"
```

Replace the `createHeadingComponent` block (lines ~80-87) with a single-line removal — the heading-ID logic moved into `components/blog/portable-text.tsx`:

```tsx
  // (removed: createHeadingComponent is now inside <PortableText />)
```

Replace lines 176-198 (the TOC + content render block) with:

```tsx
            {/* Table of Contents */}
            {post.body && post.body.length > 0 && (
              <TableOfContents body={post.body} />
            )}

            {/* Article Content */}
            {post.body && post.body.length > 0 ? (
              <div className="prose-custom" style={{ lineHeight: "1.8" }}>
                <PortableText value={post.body} />
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Content coming soon...</p>
              </div>
            )}
```

- [ ] **Step 3: Refactor `components/blog/table-of-contents.tsx` for Portable Text.**

Replace the entire file with:

```tsx
"use client"

import { useState, useEffect, useMemo } from "react"
import { List, ChevronRight } from "lucide-react"
import type { PortableTextBlock } from "@portabletext/types"

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  body: PortableTextBlock[]
}

function extractTocItems(body: PortableTextBlock[]): TOCItem[] {
  const items: TOCItem[] = []
  let index = 0
  for (const block of body) {
    const b = block as PortableTextBlock & {
      _type: string
      style?: string
      children?: Array<{ text?: string }>
    }
    if (b._type !== "block") continue
    const style = b.style
    if (style !== "h2" && style !== "h3" && style !== "h4") continue
    const level = style === "h2" ? 2 : style === "h3" ? 3 : 4
    const text = (b.children || []).map((c) => c.text || "").join("").trim()
    if (!text) continue
    items.push({ id: `heading-${index}`, text, level })
    index += 1
  }
  return items
}

export default function TableOfContents({ body }: TableOfContentsProps) {
  const tocItems = useMemo(() => extractTocItems(body), [body])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const timer = setTimeout(() => {
      const headings = document.querySelectorAll("h2, h3, h4")
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id)
            }
          })
        },
        { rootMargin: "-20% 0% -35% 0%" },
      )
      headings.forEach((heading) => observer.observe(heading))
      return () => observer.disconnect()
    }, 100)
    return () => clearTimeout(timer)
  }, [tocItems])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  if (tocItems.length === 0) return null

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <List className="w-5 h-5 text-[#1b75bc]" />
        <h3 className="text-lg font-semibold text-[#1b75bc]">Table of Contents</h3>
      </div>

      <nav className="space-y-2">
        {tocItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToHeading(item.id)}
            className={`flex items-center gap-2 w-full text-left py-2 px-3 rounded-md transition-colors ${
              activeId === item.id ? "bg-[#1b75bc] text-white" : "text-gray-700 hover:bg-gray-100 hover:text-[#1b75bc]"
            }`}
            style={{ paddingLeft: `${(item.level - 2) * 16 + 12}px` }}
          >
            <ChevronRight
              className={`w-3 h-3 flex-shrink-0 ${activeId === item.id ? "text-white" : "text-gray-400"}`}
            />
            <span className="text-sm leading-relaxed">{item.text}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
```

- [ ] **Step 4: Verify the build passes.**

In Tab A: kill the dev server (`Ctrl+C`). Then in Tab B:

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
rm -rf .next
npm run build
```

Expected: build succeeds. There will be a banner about TypeScript errors being ignored (the project has `ignoreBuildErrors: true`) — that's pre-existing. Any new error mentioning `lib/contentful` is a missed swap; any error mentioning `PortableText` / `body` / `sanity` is a bug introduced here.

If `next build` fails fetching from Sanity at build time (it will pre-render `/blog/[slug]` pages via `generateStaticParams`), this is fine — the build runs `getAllBlogPosts()` against the real Sanity dataset using the env vars from `.env.local`. The Sanity dataset was populated in Task 7, so fetches should succeed.

If build fails with `NEXT_PUBLIC_SANITY_PROJECT_ID is not set`, the `.env.local` from Task 1 didn't land — re-check that file.

- [ ] **Step 5: Restart the dev server and smoke-test the blog pages.**

In Tab A:

```bash
npm run dev
```

Open these URLs and visually inspect:

- `http://localhost:3000/blog` — list page renders, every post has an image and a title.
- `http://localhost:3000/blog/<pick-a-real-slug>` — detail page renders, body content displays with headings, TOC sidebar lists headings and clicking one scrolls. Featured image loads.
- `http://localhost:3000/about` — team list renders.
- `http://localhost:3000/meet-our-team/<pick-a-real-slug>` — team detail renders.

If a post's body is empty but the title shows, the body field's GROQ projection missed something. If TOC is empty but headings exist, `extractTocItems` doesn't recognize the heading style — check that `body` blocks have `style: 'h2'` (Studio writes them this way).

- [ ] **Step 6: Commit.**

```bash
git add app/ components/blog/
git commit -m "feat(sanity): swap 11 consumers to lib/sanity/api + PortableText renderer"
```

---

## Task 10: `next.config.mjs` remotePatterns + drop time-based revalidation

**Files:**
- Modify: `next.config.mjs`
- Modify: `app/blog/page.tsx`
- Modify: `app/blog/page/[page]/page.tsx`
- Modify: `app/blog/[slug]/page.tsx`
- Modify: `app/[slug]/page.tsx`

- [ ] **Step 1: Update `next.config.mjs` remotePatterns.**

Replace lines 46-51 of `/Volumes/ExternalSSD/Sites/nextjs-heloc360/next.config.mjs`:

```js
		remotePatterns: [
			{ protocol: "https", hostname: "images.ctfassets.net" },
			{ protocol: "https", hostname: "assets.ctfassets.net" },
			{ protocol: "https", hostname: "downloads.ctfassets.net" },
			{ protocol: "https", hostname: "sjc.microlink.io" },
		],
```

With:

```js
		remotePatterns: [
			{ protocol: "https", hostname: "cdn.sanity.io" },
			{ protocol: "https", hostname: "sjc.microlink.io" },
		],
```

- [ ] **Step 2: Remove the 4 `export const revalidate = 86400` declarations.**

Each of these files has one line; remove it (and the blank-line padding around it if any):

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
for f in \
  app/blog/page.tsx \
  "app/blog/page/[page]/page.tsx" \
  "app/blog/[slug]/page.tsx" \
  "app/[slug]/page.tsx"
do
  sed -i '' '/^export const revalidate = 86400;\?$/d' "$f"
done
```

Verify:

```bash
grep -rn "export const revalidate" app/ --include='*.ts' --include='*.tsx'
```

Expected: no matches.

- [ ] **Step 3: Build to confirm nothing broke.**

In Tab A: kill the dev server. In Tab B:

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
rm -rf .next
npm run build
```

Expected: build succeeds. Image-related warnings about `ctfassets.net` should be gone (because there are no more such URLs in the Sanity-backed content).

- [ ] **Step 4: Commit.**

```bash
git add next.config.mjs app/blog/page.tsx "app/blog/page/[page]/page.tsx" "app/blog/[slug]/page.tsx" "app/[slug]/page.tsx"
git commit -m "feat(sanity): swap remotePatterns + drop time-based revalidate"
```

---

## Task 11: Webhook receiver + Sanity Studio webhook config

**Files:**
- Create: `app/api/revalidate/route.ts`

The webhook fires whenever a document is published, updated, or deleted in Sanity. The route verifies the HMAC signature, parses which document type changed, and calls `revalidateTag()` for the affected tag.

- [ ] **Step 1: Create `app/api/revalidate/route.ts`.**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { createHmac, timingSafeEqual } from 'node:crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const TAG_BY_TYPE: Record<string, 'post' | 'team'> = {
  blogPost: 'post',
  teamMember: 'team',
}

function verifySignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false
  // Sanity sends `t=<timestamp>,v1=<hex>` per their HMAC-SHA256 webhook spec.
  const parts = Object.fromEntries(
    header.split(',').map((p) => {
      const idx = p.indexOf('=')
      return idx === -1 ? [p, ''] : [p.slice(0, idx), p.slice(idx + 1)]
    }),
  ) as { t?: string; v1?: string }
  const ts = parts.t
  const sig = parts.v1
  if (!ts || !sig) return false

  const expected = createHmac('sha256', secret).update(`${ts}.${rawBody}`).digest('hex')
  const a = Buffer.from(expected, 'hex')
  const b = Buffer.from(sig, 'hex')
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret) {
    console.error('SANITY_WEBHOOK_SECRET not set; rejecting webhook')
    return NextResponse.json({ ok: false, error: 'secret not configured' }, { status: 500 })
  }

  const rawBody = await req.text()
  const sigHeader = req.headers.get('sanity-webhook-signature')

  if (!verifySignature(rawBody, sigHeader, secret)) {
    console.warn('Sanity webhook signature verification failed')
    return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 })
  }

  let body: { _type?: string; _id?: string; ids?: { created?: string[]; updated?: string[]; deleted?: string[] } }
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  // Sanity GROQ-powered webhook payloads carry _type at the top level when filter is per-type.
  const type = body._type
  const tag = type ? TAG_BY_TYPE[type] : undefined

  if (tag) {
    revalidateTag(tag)
    console.log(`revalidated tag '${tag}' for ${type} ${body._id || '(no id)'}`)
    return NextResponse.json({ ok: true, tag, type, id: body._id })
  }

  // If the filter is broader, revalidate both tags as a safe default.
  revalidateTag('post')
  revalidateTag('team')
  console.log('revalidated post + team tags (no _type in payload)')
  return NextResponse.json({ ok: true, revalidated: ['post', 'team'] })
}

export async function GET() {
  return NextResponse.json({ ok: true, message: 'sanity revalidate webhook receiver' })
}
```

- [ ] **Step 2: Build to confirm the route compiles.**

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
rm -rf .next
npm run build
```

Expected: build succeeds; build log includes `/api/revalidate` as a route.

- [ ] **Step 3: Local smoke-test of the GET endpoint.**

In Tab A:

```bash
npm run dev
```

In Tab B:

```bash
curl -s http://localhost:3000/api/revalidate | head -c 200
```

Expected: `{"ok":true,"message":"sanity revalidate webhook receiver"}`.

- [ ] **Step 4: [MANUAL] Deploy a preview build so Sanity can reach the webhook.**

Push to a feature branch and let Vercel build a preview deployment:

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
git checkout -b sanity-migration
git push -u origin sanity-migration
```

Wait for Vercel to finish the preview (≈1-2 min). Copy the preview URL — it will be of the form `https://homebuyershaven-git-sanity-migration-<owner>.vercel.app`. The webhook will hit `<previewUrl>/api/revalidate`.

For the **production** webhook URL during the rest of this task, use the current production canonical: `https://homebuyershaven.vercel.app/api/revalidate`. Once the custom domain `heloc360.com` is wired post-migration, you'll update this URL inside Sanity Studio settings (no code change).

- [ ] **Step 5: [MANUAL] Configure the webhook inside Sanity Studio.**

Open https://www.sanity.io/manage/personal/project/<your-project-id>/api → **Webhooks** tab → **Create Webhook**:

- **Name:** `Next.js revalidate (production)`
- **URL:** `https://homebuyershaven.vercel.app/api/revalidate`
- **Dataset:** `production`
- **Trigger on:** Create, Update, Delete (all three)
- **Filter:** `_type in ["blogPost", "teamMember"]`
- **Projection:** leave default (the route handles missing `_type` gracefully)
- **HTTP method:** POST
- **Headers:** none required
- **Secret:** paste the `SANITY_WEBHOOK_SECRET` from `.env.local`
- **Enable signature:** on (this is what produces the `sanity-webhook-signature` header)
- **API version:** `2024-12-01`

Save the webhook.

(For the preview deployment, create a SECOND webhook with the preview URL and the same secret if you want to test against preview before swapping to prod.)

- [ ] **Step 6: End-to-end test the webhook.**

In Sanity Studio (running locally or in production), open the first blog post in the list and change its title — append " (test)". Hit Publish.

Watch the Vercel logs for the production deployment (or use `vercel logs homebuyershaven.vercel.app --since 2m`):

```bash
vercel logs homebuyershaven.vercel.app --since 5m | grep -i revalidate
```

Expected: a log line containing `revalidated tag 'post' for blogPost <id>`. Then reload the corresponding `/blog/<slug>` page in your browser — within a few seconds the new title appears.

Revert the title in Studio (remove " (test)") and confirm a second webhook fires.

- [ ] **Step 7: Commit.**

```bash
git add app/api/revalidate/route.ts
git commit -m "feat(sanity): webhook receiver — HMAC verify + revalidateTag"
git push
```

---

## Task 12: Parity verification + cutover

**Files:**
- Delete: `lib/contentful.ts`
- Delete: `data/blog-posts.ts`
- Delete: `scripts/migration/01-export.mjs`
- Delete: `scripts/migration/02-upload-assets.mjs`
- Delete: `scripts/migration/03-transform.mjs`
- Delete: `scripts/migration/04-import.sh`
- Modify: `package.json` (remove dependencies)
- Modify: `.env.local` (remove Contentful vars)

This is the irreversible step. Parity-check first, then cutover.

- [ ] **Step 1: Generate a parity baseline.**

Make a list of every blog and team URL the live site exposes:

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
curl -s https://homebuyershaven.vercel.app/sitemap-posts.xml | grep -oE '<loc>[^<]+</loc>' | sed 's/<[^>]*>//g' > /tmp/parity-blog-urls.txt
curl -s https://homebuyershaven.vercel.app/sitemap-team.xml | grep -oE '<loc>[^<]+</loc>' | sed 's/<[^>]*>//g' > /tmp/parity-team-urls.txt
wc -l /tmp/parity-blog-urls.txt /tmp/parity-team-urls.txt
```

Expected: a count of blog URLs and team URLs that matches what's in the existing Contentful CDN.

- [ ] **Step 2: [MANUAL] Visual parity check.**

For at least the first 5 blog URLs and all team URLs, open both versions side-by-side:

- **Left tab:** the live Contentful-backed page (use the production URL).
- **Right tab:** the same URL on the Sanity-backed `sanity-migration` preview branch URL.

Check: titles match, body content renders (no missing paragraphs, lists, or images), TOC works, featured images load. Note any regressions in a file:

```bash
echo "" > /tmp/parity-issues.txt
# Append observations as you find them.
```

If you find more than 2-3 regressions, do NOT proceed. Diagnose first (likely a tweakable bug in the transform or PortableText components).

- [ ] **Step 3: Robert's go/no-go decision.** [MANUAL]

Get explicit confirmation from Robert: "parity is acceptable, proceed with cutover." If anything substantial is broken, fix and re-run Step 2.

- [ ] **Step 4: Delete Contentful integration.**

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
git rm lib/contentful.ts data/blog-posts.ts
git rm -r scripts/migration/
```

(The `_archive/` is gitignored and not tracked, so `git rm -r scripts/migration/` only touches the four script files inside that directory. Confirm before committing:)

```bash
git status --short | grep migration
```

Expected: deletions of `01-export.mjs`, `02-upload-assets.mjs`, `03-transform.mjs`, `04-import.sh`.

- [ ] **Step 5: Remove migration-only devDependencies + the dead runtime markdown deps.**

```bash
npm uninstall contentful-export @portabletext/block-tools @sanity/schema marked jsdom react-markdown remark-gfm
```

Verify:

```bash
grep -E '"(contentful-export|@portabletext/block-tools|@sanity/schema|marked|jsdom|react-markdown|remark-gfm)"' package.json
```

Expected: no matches.

- [ ] **Step 6: Remove Contentful env vars from `.env.local`.**

Open `/Volumes/ExternalSSD/Sites/nextjs-heloc360/.env.local` and delete these lines:

```
CONTENTFUL_SPACE_ID=...
CONTENTFUL_ENVIRONMENT=...
CONTENTFUL_ACCESS_TOKEN=...
CONTENTFUL_HOST=...
CONTENTFUL_MANAGEMENT_TOKEN=...
CONTENTFUL_EXPORT_SPACE_ID=...
CONTENTFUL_EXPORT_ENVIRONMENT=...
```

Then remove them from Vercel:

```bash
vercel env rm CONTENTFUL_SPACE_ID
vercel env rm CONTENTFUL_ACCESS_TOKEN
vercel env rm CONTENTFUL_ENVIRONMENT
vercel env rm CONTENTFUL_HOST
```

(If any return "not found", they were never set in Vercel — fine.)

- [ ] **Step 7: Final build sanity check.**

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
rm -rf .next
npm run build
```

Expected: build succeeds. No reference to `contentful`, `react-markdown`, `remark-gfm`, or any deleted file.

```bash
grep -rn "contentful\|react-markdown\|remark-gfm" app/ components/ lib/ types/ --include='*.ts' --include='*.tsx'
```

Expected: no matches.

- [ ] **Step 8: Commit the cutover.**

```bash
git add -A
git commit -m "feat(sanity): cutover — delete Contentful integration + migration scripts"
```

- [ ] **Step 9: [MANUAL] Archive the Contentful space.**

In Contentful UI: Settings → General settings → scroll to bottom → **Archive space**. (Don't delete — 90-day insurance window per spec §10. Calendar yourself a reminder to delete in 90 days.)

- [ ] **Step 10: Tag the cutover milestone.**

```bash
git tag sanity-cutover-v1
git tag -l 'sanity-cutover-v1' -n10
```

---

## Task 13: Retire runtime category normalization (data is clean post-migration)

**Files:**
- Modify: `config/blog.ts`

The migration already normalized every category to one of the 6 canonical strings (Task 7 ported `findBestMatch` into the transform script). Future Sanity-authored posts also enter through a curated list of category strings — Studio editors don't type free-form variants. So the runtime `findBestMatch` and `pickFirstAllowedCategory` functions are dead weight.

This task strips them out and reduces `config/blog.ts` to its essentials.

- [ ] **Step 1: Confirm no callers outside `lib/contentful.ts` (already deleted).**

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
grep -rn "pickFirstAllowedCategory\|findBestMatch\|toAllowedCategoryOrDefault" \
  app/ components/ lib/ --include='*.ts' --include='*.tsx'
```

Expected: no matches. If anything shows up, swap it to pass-through before deleting these helpers — `lib/sanity/api.ts` does not need them because the migration already canonicalized.

- [ ] **Step 2: Replace `config/blog.ts` with the trimmed version.**

Inspect the file first:

```bash
cat config/blog.ts
```

Replace its entire contents with:

```ts
// Canonical category list. After the Sanity migration, posts arrive with
// categories already canonicalized (the migration ran the old findBestMatch
// once at import time). Editors in Sanity Studio author against this list.
//
// Keep this exported so UI components can render a category picker / filter
// against it.

export const CATEGORIES = [
  'General',
  'HELOC Fundamentals',
  'HELOC Tips & Success Stories',
  'Home Upgrades & Renovations',
  'Rates & Terms Insights',
  'Smart Equity Strategies',
] as const

export type Category = (typeof CATEGORIES)[number]
```

- [ ] **Step 3: Update any consumer that imported the old names.**

```bash
grep -rn "ALLOWED_CATEGORIES" app/ components/ lib/ --include='*.ts' --include='*.tsx'
```

For every match, replace `ALLOWED_CATEGORIES` with `CATEGORIES` and `AllowedCategory` with `Category`. Typically these are type-level imports in filter UI components.

Example sed pass (run only if grep found matches):

```bash
for f in $(grep -rln "ALLOWED_CATEGORIES\|AllowedCategory" app/ components/ lib/ --include='*.ts' --include='*.tsx'); do
  sed -i '' 's|ALLOWED_CATEGORIES|CATEGORIES|g; s|AllowedCategory|Category|g' "$f"
done
```

- [ ] **Step 4: Build to confirm nothing broke.**

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
rm -rf .next
npm run build
```

Expected: build succeeds.

- [ ] **Step 5: Commit.**

```bash
git add config/blog.ts
# Plus any files touched in Step 3:
git add app/ components/ lib/ 2>/dev/null || true
git commit -m "refactor(blog): drop runtime category normalization (data canonicalized at migration)"
```

---

## Phase E — Page-builder foundation (Tasks 14-15)

**Why this phase exists:** Master rule (saved memory `feedback_sanity_everything_in_cms.md`) — every page across all Sanity projects must be content-managed as editable Gutenberg-like blocks; nothing hardcoded in the frontend. The blog + team migration above does NOT touch HELOC360's 10 hardcoded pages (homepage, about, heloc-101, privacy, terms, etc. — ~3,900 lines of JSX prose). Phase E establishes the schema + renderer scaffolding so future bulk page-conversion work is mechanical and a follow-up plan can convert each hardcoded page one at a time. Bulk conversion is deliberately out of scope here — it's content-modeling work that warrants its own brainstorming + spec.

**What ships at end of Phase E:** a `page` document type, a starter section taxonomy (`hero`, `richText`, `cta`, `featureGrid`, `faq`, `imageWithText`), and a `<SectionRenderer>` component that maps each section type to a React component. **No existing hardcoded page is converted in this plan** — Phase F (separate plan) handles conversions.

---

## Task 14: `page` document + section block types

**Files:**
- Create: `sanity/schemas/page.ts`
- Create: `sanity/schemas/sections/hero.ts`
- Create: `sanity/schemas/sections/richText.ts`
- Create: `sanity/schemas/sections/cta.ts`
- Create: `sanity/schemas/sections/featureGrid.ts`
- Create: `sanity/schemas/sections/faq.ts`
- Create: `sanity/schemas/sections/imageWithText.ts`
- Modify: `sanity/schemas/index.ts`

The `page` document has metadata (title, slug, SEO) + a `sections` array. Each section is one of the named block types. Editors compose pages by stacking sections in any order.

- [ ] **Step 1: Create `sanity/schemas/sections/hero.ts`.**

```ts
import { defineType, defineField } from 'sanity'

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 3 }),
    defineField({
      name: 'backgroundImage',
      title: 'Background image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primary CTA',
      type: 'object',
      fields: [
        { name: 'label', type: 'string', title: 'Label' },
        { name: 'href', type: 'string', title: 'URL' },
      ],
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Secondary CTA',
      type: 'object',
      fields: [
        { name: 'label', type: 'string', title: 'Label' },
        { name: 'href', type: 'string', title: 'URL' },
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'eyebrow', media: 'backgroundImage' },
    prepare({ title, subtitle, media }) {
      return { title: `Hero: ${title || '(no heading)'}`, subtitle, media }
    },
  },
})
```

- [ ] **Step 2: Create `sanity/schemas/sections/richText.ts`.**

```ts
import { defineType, defineField, defineArrayMember } from 'sanity'

export const richTextSection = defineType({
  name: 'richTextSection',
  title: 'Rich text',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading (optional)', type: 'string' }),
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
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
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
  ],
  preview: {
    select: { title: 'heading', body: 'body' },
    prepare({ title, body }) {
      const firstBlock = Array.isArray(body) ? body.find((b: any) => b._type === 'block') : null
      const snippet = firstBlock
        ? (firstBlock as any).children?.map((c: any) => c.text).join('').slice(0, 60)
        : ''
      return { title: title ? `Rich text: ${title}` : 'Rich text', subtitle: snippet }
    },
  },
})
```

- [ ] **Step 3: Create `sanity/schemas/sections/cta.ts`.**

```ts
import { defineType, defineField } from 'sanity'

export const ctaSection = defineType({
  name: 'ctaSection',
  title: 'Call to action',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 2 }),
    defineField({
      name: 'cta',
      title: 'CTA button',
      type: 'object',
      fields: [
        { name: 'label', type: 'string', title: 'Label', validation: (R: any) => R.required() },
        { name: 'href', type: 'string', title: 'URL', validation: (R: any) => R.required() },
      ],
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Primary (maize on blue)', value: 'primary' },
          { title: 'Secondary (light)', value: 'secondary' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'cta.label' },
    prepare({ title, subtitle }) {
      return { title: `CTA: ${title}`, subtitle: subtitle ? `Button: ${subtitle}` : undefined }
    },
  },
})
```

- [ ] **Step 4: Create `sanity/schemas/sections/featureGrid.ts`.**

```ts
import { defineType, defineField, defineArrayMember } from 'sanity'

export const featureGridSection = defineType({
  name: 'featureGridSection',
  title: 'Feature grid',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 2 }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: { list: [2, 3, 4] },
      initialValue: 3,
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'feature',
          fields: [
            { name: 'icon', type: 'string', title: 'Icon name (lucide)', description: 'e.g. CheckCircle, Home, Shield' },
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'description', type: 'text', rows: 3, title: 'Description' },
          ],
          preview: { select: { title: 'title', subtitle: 'icon' } },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'heading', features: 'features' },
    prepare({ title, features }) {
      const count = Array.isArray(features) ? features.length : 0
      return { title: `Feature grid: ${title || '(no heading)'}`, subtitle: `${count} feature${count === 1 ? '' : 's'}` }
    },
  },
})
```

- [ ] **Step 5: Create `sanity/schemas/sections/faq.ts`.**

```ts
import { defineType, defineField, defineArrayMember } from 'sanity'

export const faqSection = defineType({
  name: 'faqSection',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: 'Frequently asked questions' }),
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          fields: [
            { name: 'question', type: 'string', title: 'Question', validation: (R: any) => R.required() },
            {
              name: 'answer',
              type: 'array',
              title: 'Answer',
              of: [{ type: 'block' }],
              validation: (R: any) => R.required().min(1),
            },
          ],
          preview: { select: { title: 'question' } },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'heading', items: 'items' },
    prepare({ title, items }) {
      const count = Array.isArray(items) ? items.length : 0
      return { title: `FAQ: ${title}`, subtitle: `${count} question${count === 1 ? '' : 's'}` }
    },
  },
})
```

- [ ] **Step 6: Create `sanity/schemas/sections/imageWithText.ts`.**

```ts
import { defineType, defineField, defineArrayMember } from 'sanity'

export const imageWithTextSection = defineType({
  name: 'imageWithTextSection',
  title: 'Image with text',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image position',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'right',
    }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'cta',
      title: 'CTA (optional)',
      type: 'object',
      fields: [
        { name: 'label', type: 'string', title: 'Label' },
        { name: 'href', type: 'string', title: 'URL' },
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', media: 'image' },
    prepare({ title, media }) {
      return { title: `Image+Text: ${title || '(no heading)'}`, media }
    },
  },
})
```

- [ ] **Step 7: Create `sanity/schemas/page.ts`.**

```ts
import { defineType, defineField, defineArrayMember } from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL path)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      description: 'The URL path without leading slash. Use "home" for the homepage; rendered at /.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        defineArrayMember({ type: 'heroSection' }),
        defineArrayMember({ type: 'richTextSection' }),
        defineArrayMember({ type: 'ctaSection' }),
        defineArrayMember({ type: 'featureGridSection' }),
        defineArrayMember({ type: 'faqSection' }),
        defineArrayMember({ type: 'imageWithTextSection' }),
      ],
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL (optional override)',
      type: 'url',
    }),
    defineField({
      name: 'noindex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current', sections: 'sections' },
    prepare({ title, slug, sections }) {
      const count = Array.isArray(sections) ? sections.length : 0
      return {
        title,
        subtitle: `/${slug || ''} · ${count} section${count === 1 ? '' : 's'}`,
      }
    },
  },
})
```

- [ ] **Step 8: Update `sanity/schemas/index.ts` to register everything.**

Replace the file:

```ts
import { blogPost } from './blogPost'
import { teamMember } from './teamMember'
import { page } from './page'
import { heroSection } from './sections/hero'
import { richTextSection } from './sections/richText'
import { ctaSection } from './sections/cta'
import { featureGridSection } from './sections/featureGrid'
import { faqSection } from './sections/faq'
import { imageWithTextSection } from './sections/imageWithText'

export const schemaTypes = [
  // Documents
  blogPost,
  teamMember,
  page,
  // Section objects
  heroSection,
  richTextSection,
  ctaSection,
  featureGridSection,
  faqSection,
  imageWithTextSection,
]
```

- [ ] **Step 9: Smoke-test schemas in the Studio.**

In Tab A:

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
npm run dev
```

Open `http://localhost:3000/studio`. Expected: left-nav now shows "Page" alongside "Blog Post" and "Team Member". Create a throwaway test page:

1. Click "Page" → "+" (new).
2. Title: "Test Page". Slug auto-fills to "test-page".
3. Click "Sections" → add a Hero. Fill heading + subheading.
4. Add a Rich Text section underneath. Add some body content.
5. Add a CTA section.
6. Publish.
7. Open it again from the list to confirm it round-tripped.
8. Delete it from the three-dot menu.

If any section type errors or refuses to add, the schema in §schemas/sections/ has a typo — fix and re-verify.

- [ ] **Step 10: Commit.**

```bash
git add sanity/schemas/
git commit -m "feat(sanity): page document + 6 section block types (hero, richText, cta, featureGrid, faq, imageWithText)"
```

---

## Task 15: `<SectionRenderer>` + section React components + dynamic page route

**Files:**
- Create: `components/sections/hero-section.tsx`
- Create: `components/sections/rich-text-section.tsx`
- Create: `components/sections/cta-section.tsx`
- Create: `components/sections/feature-grid-section.tsx`
- Create: `components/sections/faq-section.tsx`
- Create: `components/sections/image-with-text-section.tsx`
- Create: `components/sections/section-renderer.tsx`
- Create: `lib/sanity/page-queries.ts`
- Create: `lib/sanity/page-api.ts`
- Create: `app/(site)/[...slug]/page.tsx` — catch-all route for Sanity-managed pages

The renderer takes a `sections: Section[]` array and emits the right React component for each. The catch-all route resolves a URL path to a `page` document by slug and renders its sections — Phase F (follow-up plan) uses this route to serve converted pages.

The route is placed inside `app/(site)/` (route group) so it doesn't collide with existing hardcoded routes. The catch-all uses `notFound()` when no matching `page` doc exists, so existing hardcoded routes continue to take precedence.

- [ ] **Step 1: Install missing rendering peer dep if needed.**

`lucide-react` is already a dep (from `package.json` line 50). Skip the install — the icon resolver uses dynamic lookup.

- [ ] **Step 2: Create `components/sections/hero-section.tsx`.**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { imageUrl } from '@/lib/sanity/image'

export type HeroSectionValue = {
  _type: 'heroSection'
  _key: string
  eyebrow?: string
  heading: string
  subheading?: string
  backgroundImage?: { alt?: string; asset?: unknown } | null
  primaryCta?: { label?: string; href?: string } | null
  secondaryCta?: { label?: string; href?: string } | null
}

export function HeroSection({ value }: { value: HeroSectionValue }) {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {value.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={imageUrl(value.backgroundImage as any)}
            alt={value.backgroundImage.alt || ''}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        {value.eyebrow && <p className="uppercase tracking-wide mb-3 text-sm">{value.eyebrow}</p>}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{value.heading}</h1>
        {value.subheading && <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">{value.subheading}</p>}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {value.primaryCta?.href && value.primaryCta.label && (
            <Button asChild size="lg">
              <Link href={value.primaryCta.href}>{value.primaryCta.label}</Link>
            </Button>
          )}
          {value.secondaryCta?.href && value.secondaryCta.label && (
            <Button asChild variant="outline" size="lg">
              <Link href={value.secondaryCta.href}>{value.secondaryCta.label}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create `components/sections/rich-text-section.tsx`.**

```tsx
import type { PortableTextBlock } from '@portabletext/types'
import { PortableText } from '@/components/blog/portable-text'

export type RichTextSectionValue = {
  _type: 'richTextSection'
  _key: string
  heading?: string
  body: PortableTextBlock[]
}

export function RichTextSection({ value }: { value: RichTextSectionValue }) {
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="max-w-3xl mx-auto">
        {value.heading && <h2 className="text-3xl font-bold mb-6">{value.heading}</h2>}
        <div className="prose-custom" style={{ lineHeight: '1.8' }}>
          <PortableText value={value.body} />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create `components/sections/cta-section.tsx`.**

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export type CtaSectionValue = {
  _type: 'ctaSection'
  _key: string
  heading: string
  subheading?: string
  cta?: { label?: string; href?: string } | null
  variant?: 'primary' | 'secondary'
}

export function CtaSection({ value }: { value: CtaSectionValue }) {
  const variant = value.variant || 'primary'
  const bg = variant === 'primary' ? 'bg-[#00274C] text-white' : 'bg-gray-50 text-gray-900'
  return (
    <section className={`${bg} py-16`}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{value.heading}</h2>
        {value.subheading && <p className="text-lg mb-8 max-w-2xl mx-auto">{value.subheading}</p>}
        {value.cta?.href && value.cta.label && (
          <Button asChild size="lg" variant={variant === 'primary' ? 'default' : 'outline'}>
            <Link href={value.cta.href}>{value.cta.label}</Link>
          </Button>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Create `components/sections/feature-grid-section.tsx`.**

```tsx
import * as Icons from 'lucide-react'

export type FeatureGridSectionValue = {
  _type: 'featureGridSection'
  _key: string
  heading?: string
  subheading?: string
  columns?: 2 | 3 | 4
  features: Array<{ _key: string; icon?: string; title?: string; description?: string }>
}

function IconByName({ name }: { name?: string }) {
  if (!name) return null
  const Comp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
  if (!Comp) return null
  return <Comp className="w-8 h-8" />
}

export function FeatureGridSection({ value }: { value: FeatureGridSectionValue }) {
  const cols = value.columns || 3
  const gridCls = cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'
  return (
    <section className="py-16 container mx-auto px-4">
      {(value.heading || value.subheading) && (
        <div className="text-center mb-12 max-w-3xl mx-auto">
          {value.heading && <h2 className="text-3xl md:text-4xl font-bold mb-4">{value.heading}</h2>}
          {value.subheading && <p className="text-lg text-gray-700">{value.subheading}</p>}
        </div>
      )}
      <div className={`grid grid-cols-1 ${gridCls} gap-8`}>
        {value.features.map((f) => (
          <div key={f._key} className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFCB05] text-[#00274C] mb-4">
              <IconByName name={f.icon} />
            </div>
            {f.title && <h3 className="text-xl font-semibold mb-2">{f.title}</h3>}
            {f.description && <p className="text-gray-700">{f.description}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Create `components/sections/faq-section.tsx`.**

```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { PortableText } from '@/components/blog/portable-text'
import type { PortableTextBlock } from '@portabletext/types'

export type FaqSectionValue = {
  _type: 'faqSection'
  _key: string
  heading?: string
  items: Array<{ _key: string; question: string; answer: PortableTextBlock[] }>
}

export function FaqSection({ value }: { value: FaqSectionValue }) {
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="max-w-3xl mx-auto">
        {value.heading && <h2 className="text-3xl font-bold text-center mb-12">{value.heading}</h2>}
        <Accordion type="single" collapsible>
          {value.items.map((item) => (
            <AccordionItem key={item._key} value={item._key}>
              <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
              <AccordionContent>
                <div className="prose-custom">
                  <PortableText value={item.answer} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Create `components/sections/image-with-text-section.tsx`.**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PortableText } from '@/components/blog/portable-text'
import { imageUrl } from '@/lib/sanity/image'
import type { PortableTextBlock } from '@portabletext/types'

export type ImageWithTextSectionValue = {
  _type: 'imageWithTextSection'
  _key: string
  image: { alt?: string; asset?: unknown }
  imagePosition?: 'left' | 'right'
  heading?: string
  body?: PortableTextBlock[]
  cta?: { label?: string; href?: string } | null
}

export function ImageWithTextSection({ value }: { value: ImageWithTextSectionValue }) {
  const reverse = value.imagePosition === 'left'
  return (
    <section className="py-16 container mx-auto px-4">
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${reverse ? 'md:[direction:rtl]' : ''}`}>
        <div className={reverse ? 'md:[direction:ltr]' : ''}>
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={imageUrl(value.image as any)}
              alt={value.image.alt || ''}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
        <div className={reverse ? 'md:[direction:ltr]' : ''}>
          {value.heading && <h2 className="text-3xl md:text-4xl font-bold mb-4">{value.heading}</h2>}
          {value.body && (
            <div className="prose-custom mb-6" style={{ lineHeight: '1.8' }}>
              <PortableText value={value.body} />
            </div>
          )}
          {value.cta?.href && value.cta.label && (
            <Button asChild size="lg">
              <Link href={value.cta.href}>{value.cta.label}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 8: Create `components/sections/section-renderer.tsx`.**

```tsx
import { HeroSection, type HeroSectionValue } from './hero-section'
import { RichTextSection, type RichTextSectionValue } from './rich-text-section'
import { CtaSection, type CtaSectionValue } from './cta-section'
import { FeatureGridSection, type FeatureGridSectionValue } from './feature-grid-section'
import { FaqSection, type FaqSectionValue } from './faq-section'
import { ImageWithTextSection, type ImageWithTextSectionValue } from './image-with-text-section'

export type Section =
  | HeroSectionValue
  | RichTextSectionValue
  | CtaSectionValue
  | FeatureGridSectionValue
  | FaqSectionValue
  | ImageWithTextSectionValue

export function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case 'heroSection':
            return <HeroSection key={section._key} value={section} />
          case 'richTextSection':
            return <RichTextSection key={section._key} value={section} />
          case 'ctaSection':
            return <CtaSection key={section._key} value={section} />
          case 'featureGridSection':
            return <FeatureGridSection key={section._key} value={section} />
          case 'faqSection':
            return <FaqSection key={section._key} value={section} />
          case 'imageWithTextSection':
            return <ImageWithTextSection key={section._key} value={section} />
          default:
            // Section type unknown — likely a schema update without a matching renderer.
            // Render nothing in production; surface the type during development.
            if (process.env.NODE_ENV !== 'production') {
              console.warn('Unknown section type:', (section as { _type?: string })._type)
            }
            return null
        }
      })}
    </>
  )
}
```

- [ ] **Step 9: Create `lib/sanity/page-queries.ts`.**

```ts
export const PAGE_BY_SLUG_QUERY = `
  *[_type == "page" && slug.current == $slug][0] {
    "id": _id,
    title,
    "slug": slug.current,
    sections,
    seoTitle,
    seoDescription,
    canonicalUrl,
    noindex
  }
`

export const ALL_PAGE_SLUGS_QUERY = `*[_type == "page"]{ "slug": slug.current }`
```

- [ ] **Step 10: Create `lib/sanity/page-api.ts`.**

```ts
import 'server-only'
import type { Section } from '@/components/sections/section-renderer'
import { sanityClient } from './client'
import { PAGE_BY_SLUG_QUERY, ALL_PAGE_SLUGS_QUERY } from './page-queries'

export type SanityPage = {
  id: string
  title: string
  slug: string
  sections: Section[]
  seoTitle?: string
  seoDescription?: string
  canonicalUrl?: string
  noindex?: boolean
}

const PAGE_TAGS = { tags: ['page'] }

export async function getPageBySlug(slug: string): Promise<SanityPage | null> {
  try {
    return await sanityClient.fetch<SanityPage | null>(PAGE_BY_SLUG_QUERY, { slug }, { next: PAGE_TAGS })
  } catch (err) {
    console.error('Failed to load page by slug from Sanity', err)
    return null
  }
}

export async function getAllPageSlugs(): Promise<string[]> {
  try {
    const rows = await sanityClient.fetch<Array<{ slug?: string }>>(ALL_PAGE_SLUGS_QUERY, {}, { next: PAGE_TAGS })
    return rows.map((r) => r.slug).filter((s): s is string => typeof s === 'string')
  } catch (err) {
    console.error('Failed to load page slugs from Sanity', err)
    return []
  }
}
```

- [ ] **Step 11: Update `app/api/revalidate/route.ts` to handle the new `page` tag.**

Open `app/api/revalidate/route.ts` and replace the `TAG_BY_TYPE` constant with:

```ts
const TAG_BY_TYPE: Record<string, 'post' | 'team' | 'page'> = {
  blogPost: 'post',
  teamMember: 'team',
  page: 'page',
}
```

And replace the fallback block at the bottom (currently `revalidateTag('post')` + `revalidateTag('team')`) with:

```ts
  // If the filter is broader, revalidate all three tags as a safe default.
  revalidateTag('post')
  revalidateTag('team')
  revalidateTag('page')
  console.log('revalidated post + team + page tags (no _type in payload)')
  return NextResponse.json({ ok: true, revalidated: ['post', 'team', 'page'] })
```

- [ ] **Step 12: Update the Sanity Studio webhook filter to include `page`.**

[MANUAL] In sanity.io/manage → your project → API → Webhooks → edit the existing webhook:

- **Filter:** change from `_type in ["blogPost", "teamMember"]` to `_type in ["blogPost", "teamMember", "page"]`

Save.

- [ ] **Step 13: Create the catch-all route `app/(site)/[...slug]/page.tsx`.**

The route group `(site)` is invisible in URLs; the catch-all `[...slug]` matches any path. `notFound()` for unmatched slugs means existing hardcoded routes continue to take precedence at route resolution time.

```tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPageBySlug, getAllPageSlugs } from '@/lib/sanity/page-api'
import { SectionRenderer } from '@/components/sections/section-renderer'

type Props = { params: { slug?: string[] } }

function slugFromParams(params: Props['params']): string {
  const segments = params.slug || []
  if (segments.length === 0) return 'home'
  return segments.join('/')
}

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs()
  return slugs.map((slug) => ({ slug: slug === 'home' ? [] : slug.split('/') }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPageBySlug(slugFromParams(params))
  if (!page) return {}
  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription,
    alternates: page.canonicalUrl ? { canonical: page.canonicalUrl } : undefined,
    robots: page.noindex ? { index: false, follow: true } : undefined,
  }
}

export default async function SanityCatchAllPage({ params }: Props) {
  const page = await getPageBySlug(slugFromParams(params))
  if (!page) notFound()
  return <SectionRenderer sections={page.sections} />
}
```

- [ ] **Step 14: Build to confirm everything compiles.**

In Tab A: kill the dev server. In Tab B:

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
rm -rf .next
npm run build
```

Expected: build succeeds. The route table includes both the existing hardcoded routes (e.g. `/about`, `/heloc-101`) AND a catch-all `/[...slug]` — Next resolves the more-specific route first, so the catch-all only catches paths that don't have a hardcoded route.

- [ ] **Step 15: End-to-end test with a real `page` document.**

In Tab A:

```bash
npm run dev
```

In Studio (`/studio`), create a test page:

1. Title: "Sanity Test"; slug: `sanity-test`.
2. Add a Hero section: heading "Hello from Sanity", subheading "This page is content-managed."
3. Add a Rich Text section with a paragraph and a bulleted list.
4. Add a CTA section: heading "Ready to start?", CTA label "Get pre-qualified", href `/pre-qual`.
5. Publish.

Then visit `http://localhost:3000/sanity-test` in your browser. Expected: the three sections render in order. Click the CTA — it navigates to `/pre-qual`.

Edit the page in Studio — change the hero heading. Publish. Within ~5 seconds (webhook + revalidate), reload `/sanity-test`. The new heading appears.

Delete the test page from the Studio.

- [ ] **Step 16: Commit.**

```bash
git add components/sections/ lib/sanity/page-queries.ts lib/sanity/page-api.ts \
  "app/(site)/[...slug]/page.tsx" app/api/revalidate/route.ts
git commit -m "feat(sanity): page-builder foundation — section renderer + catch-all route"
```

- [ ] **Step 17: Tag the milestone.**

```bash
git tag sanity-page-builder-v1
git tag -l 'sanity-page-builder-v1' -n10
```

---

## Hand-off: bulk page conversion (separate plan)

10 hardcoded pages (~3,900 lines of JSX) remain hardcoded after this plan. Each one warrants explicit content-modeling — what sections does the homepage really want? What FAQ items does heloc-101 need? Those are editorial decisions, not code decisions. They deserve a brainstorming session each (or batched in clusters of similar pages).

**Pages to convert in Plan F (follow-up):**

| Page | Lines | Notes |
|---|---|---|
| `app/page.tsx` | 524 | Homepage. Plan 3 from the broader design spec also touches this — coordinate. |
| `app/about/page.tsx` | 702 | Mixes team list (Sanity-backed via `lib/sanity/api.ts`) with hardcoded prose. Conversion = extract prose into sections; keep team-list fetch. |
| `app/heloc-101/page.tsx` | 852 | Long-form explainer. Heaviest conversion. |
| `app/privacy/page.tsx` | 526 | Mostly plain prose — easiest conversion. Good first candidate. |
| `app/terms/page.tsx` | 483 | Same as privacy. |
| `app/affiliate-disclosure/page.tsx` | 280 | Plain prose. |
| `app/communication-consent/page.tsx` | 287 | Plain prose. |
| `app/contact/page.tsx` | 29 | Trivial — likely a form embed. |
| `app/calculators/debt-consolidation/page.tsx` | 109 | Form-heavy. Calc widget stays hardcoded; surrounding copy → Sanity. |
| `app/calculators/home-equity-estimator/page.tsx` | 116 | Same as above. |

**Conversion mechanics (template for Plan F):**

1. Read the existing hardcoded page; identify its sections (hero, prose blocks, CTA, FAQ, etc.).
2. Create a `page` document in Studio with matching slug (e.g. `privacy` for `/privacy`).
3. Compose the sections in Studio that mirror what's currently hardcoded.
4. Delete the hardcoded `app/<route>/page.tsx` (or leave a stub redirect if the route shape requires it).
5. The catch-all at `app/(site)/[...slug]/page.tsx` now serves the route.
6. Smoke-test the URL: identical or improved visual + SEO parity.
7. Commit.

If a section type doesn't exist for a needed pattern (e.g. testimonial carousel, comparison table), add it to `sanity/schemas/sections/` + `components/sections/` first as a separate task — Plan F's first sub-task can be "expand section taxonomy" if surveys of the 10 pages surface needs.

**Plan F is NOT in scope for this plan.** This plan delivers the foundation; the bulk conversion is a content + editorial exercise warranting its own brainstorming session.

---

## Final code review + push

**Files:** all changes from Tasks 1-13.

- [ ] **Step 1: Run a whole-plan code review with the `code-review` skill.**

In a fresh subagent (Opus), invoke the project's `code-review` skill against the diff range:

```
Range: from `prequal-v1` tag to current HEAD on `sanity-migration` branch (or merge target).
Focus areas:
- Sanity client config (correct projectId/dataset/apiVersion handling, server-only boundaries respected)
- Webhook receiver (HMAC verification correctness, error handling, no logging of secret)
- PortableText renderer (heading ID monotonicity per render, no React hook misuse)
- Migration scripts (env loading correctness, idempotency, asset map persistence)
- Type changes in types/blog.ts and downstream call sites
```

Address any Critical or Important findings before pushing.

- [ ] **Step 2: Push the branch + tags.**

```bash
cd /Volumes/ExternalSSD/Sites/nextjs-heloc360
git push -u origin sanity-migration
git push --tags
```

- [ ] **Step 3: [MANUAL] Open a PR for merge to main.**

```bash
gh pr create --title "Migrate content from Contentful to Sanity" --body "$(cat <<'EOF'
## Summary

- Replaces Contentful with Sanity (embedded Studio at `/studio`) for both blog posts and team members
- Markdown bodies converted once to Portable Text at migration; future edits happen in Sanity Studio
- Webhook-based revalidation (`revalidateTag('post' | 'team')`) replaces 24-hour time-based revalidation

## Done

- All 11 consumer files import from `@/lib/sanity/api` (was `@/lib/contentful`)
- `app/blog/[slug]/page.tsx` renders Portable Text via `@portabletext/react`
- TableOfContents walks PT blocks instead of parsing markdown headings
- `next.config.mjs` `remotePatterns` references `cdn.sanity.io`; no `ctfassets`
- `lib/contentful.ts`, `data/blog-posts.ts`, `scripts/migration/` deleted
- `react-markdown`, `remark-gfm` removed
- Contentful env vars purged from Vercel
- Contentful space archived (90-day insurance window)
- Tags: `sanity-studio-ready`, `sanity-cutover-v1`

## Test plan

- [ ] /blog list page renders all posts with images
- [ ] /blog/<any-slug> renders body with proper headings, TOC, featured image
- [ ] /about renders team list
- [ ] /meet-our-team/<any-slug> renders detail
- [ ] /studio loads, can edit + publish a doc, change appears on live page within ~5s (webhook)
- [ ] `npm run build` passes clean

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 4: [MANUAL] Custom-domain swap (post-merge, when `heloc360.com` is ready).**

In Vercel: assign `heloc360.com` to the `homebuyershaven` project as a custom domain. Then in Sanity Studio webhook settings, update the URL from `https://homebuyershaven.vercel.app/api/revalidate` to `https://heloc360.com/api/revalidate`. Test by publishing an edit.

---

## Done

At this point:
- All content management happens in Sanity Studio at `/studio`.
- Blog posts and team members render from Sanity via `lib/sanity/api`.
- Edits propagate to live pages in seconds via webhook → `revalidateTag()`, not 24-hour cache.
- Contentful is archived (deletable after 90 days).
- The repo no longer depends on `react-markdown`, `remark-gfm`, `contentful-export`, `@portabletext/block-tools`, `marked`, or `jsdom`.
- Tags `sanity-studio-ready` and `sanity-cutover-v1` mark the milestones in git history.

**Hand-off:** This unblocks the rest of HELOC360's content-shaping plans (Plans 3, 4, 6 from the design spec). Future Sanity work:
- Add a "spoke landing" content type when Plan 4 needs it.
- Add author references and a structured category type as schema evolves.
- Wire draft-mode preview in Studio for unpublished edits (Sanity ships a built-in preview helper).

---

## Plan self-review

**Spec coverage** (against `docs/superpowers/specs/2026-05-28-contentful-to-sanity-migration.md`):

- ✅ §1 Goal — hard cutover Contentful → Sanity — Tasks 12 (cutover) + Task 13 (cleanup)
- ✅ §3.1 Two content types — `sanity/schemas/{blogPost,teamMember}.ts` 1:1 mirror — Task 2
- ✅ §3.2 Asset re-upload (not tethered to ctfassets) — Tasks 5, 6, 10
- ✅ §3.3 4 functions drop-in match `lib/contentful.ts` surface — Task 8 (`lib/sanity/api.ts`)
- ✅ §3.4 11 consumer files swapped — Task 9 (sed pass + manual `[slug]` swap)
- ✅ §3.5 `BlogPost.content` (markdown) → `body` (PortableText) — Task 8 Step 1 (`types/blog.ts`)
- ✅ §5 Decision 1 — embedded Studio — Tasks 3, 4
- ✅ §5 Decision 2 — 1:1 schemas, singular-camelCase doc type IDs, body field rename — Task 2
- ✅ §5 Decision 3 — MD→PT at migration via marked + htmlToBlocks — Task 7
- ✅ §5 Decision 4 — webhook → revalidateTag, no time-based revalidate — Tasks 10, 11
- ✅ §6.4 All env vars wired (.env.local + Vercel) — Task 1
- ✅ §8.2 All 5 manual gates flagged with `[MANUAL]` — Task 1 Step 1, Task 5 Step 1, Task 11 Steps 4-5, Task 12 Steps 2-3, Step 9
- ✅ §9 Risk: MD→PT fidelity — Task 7 Step 3 explicit spot-check before bulk
- ✅ §9 Risk: webhook flakes silently — Task 11 Step 3 + Step 6 explicit verification
- ✅ §10 Definition of done — all 9 bullets map to specific tasks/steps
- ✅ §11 Q5 category list — Task 7 Step 1 ports `findBestMatch`; Task 13 retires it post-migration
- ✅ Discovered at plan-write time: `TableOfContents` markdown-string parser — refactored in Task 9 Step 3
- ❌ Build-time fallback to `data/blog-posts.ts` when Sanity returns 0 — **deliberately dropped**. The original fallback existed because Contentful could return null in local dev with bad credentials; Sanity reads can't return null silently. If Sanity is down at build time, the build SHOULD fail loudly rather than ship an empty blog. Documented decision.
- ❌ Draft-mode preview — **deferred**. Sanity ships a `next-sanity/preview` helper; wiring it is a separate plan once editors want to preview unpublished drafts.

**Placeholder scan:** No `TBD`, `TODO`, `implement later`, or "fill in details" markers. Every code block contains complete code. Every command has its expected output stated. `[MANUAL]` markers explicitly call out human-only steps (auth, web UI configuration, go/no-go calls) — they are not placeholders.

**Type consistency:**

- `BlogPost` type: defined in `types/blog.ts` (Task 8 Step 1); consumed in `lib/sanity/api.ts` (Task 8 Step 5), `app/blog/[slug]/page.tsx` (Task 9 Step 2), and all sitemap consumers (Task 9 Step 1). Same import path everywhere.
- `TeamMember` type: defined in `lib/sanity/api.ts` (Task 8 Step 5); consumed in 11 files via inferred return types of `getAllTeamMembers` / `getTeamMemberBySlug`. No explicit import needed in consumers.
- `PortableTextBlock` type: imported from `@portabletext/types` in `types/blog.ts`, `lib/sanity/api.ts`, `components/blog/portable-text.tsx`, `components/blog/table-of-contents.tsx`. Same source.
- The 4 function names (`getAllBlogPosts`, `getBlogPostBySlug`, `getAllTeamMembers`, `getTeamMemberBySlug`) are identical between the old `lib/contentful.ts` and the new `lib/sanity/api.ts` — Task 9 Step 1's sed pass is purely an import-path swap, no signature changes.
- `body` (renamed from `content`): defined in `types/blog.ts` (Task 8 Step 1); set by `mapBlogPost` (Task 8 Step 5); consumed by `<TableOfContents body={...} />` and `<PortableText value={...} />` in Task 9 Steps 2-3. Single contract throughout.
- `heading-{N}` ID contract: produced by `components/blog/portable-text.tsx` (Task 8 Step 6), consumed by `components/blog/table-of-contents.tsx`'s IntersectionObserver lookups (Task 9 Step 3). Sequential numbering preserved from the pre-migration `createHeadingComponent` behavior.
- `READ_TAGS = { tags: ['post'] }` / `TEAM_TAGS = { tags: ['team'] }`: defined in `lib/sanity/api.ts` (Task 8 Step 5); consumed by webhook receiver in `app/api/revalidate/route.ts` (Task 11 Step 1) via the matching `TAG_BY_TYPE` map. The two halves must agree on the tag strings — they do.
- `SANITY_WEBHOOK_SECRET`: declared in `.env.local` (Task 1 Step 2); pushed to Vercel Production only (Task 1 Step 3); consumed by `app/api/revalidate/route.ts` (Task 11 Step 1); pasted into Sanity Studio webhook config (Task 11 Step 5). Same secret in all four places.
- `SANITY_API_READ_TOKEN` (runtime, Viewer scope) vs `SANITY_API_WRITE_TOKEN` (migration scripts, Editor scope): two different tokens. The runtime client never has Editor. Migration scripts never run in production. Clear boundary called out in Task 1 Step 2 and Task 6 Step 1.

**Scope check:** The plan touches **24 files (15 created, 9 modified, 6 deleted in Task 12)** plus archive directory operations. Each task is independently revertable up through Task 11 (cutover at Task 12 is the irreversible boundary). The plan does NOT touch:

- The pre-qual form work from Plan 2 — orthogonal to CMS.
- Foundation pieces from Plan 1 (theme, nav, footer) — unchanged.
- `app/page.tsx` homepage — Plan 3 territory.
- Any spoke route — Plan 4 territory.
- Analytics / GA4 — Plan 5 territory.
- Mailing list signup — Plan 6 territory.
- Auth/admin (no admin UI separate from Sanity Studio).

**Risk surface to monitor post-merge:**

- **Sanity outage:** runtime fetches will throw; consumers wrap in try/catch and return `[]` / `null`. Pages render with empty states ("Content coming soon…"). Not silent.
- **Webhook secret mismatch:** signature verification fails → 401 → revalidation skipped → page shows stale content for up to its natural cache lifetime. Mitigation: Task 11 Step 6 explicit smoke test post-config.
- **Image transformation cost:** Sanity's `cdn.sanity.io` charges per-bandwidth at high volumes. HELOC360 is low-volume, but worth monitoring in the first weeks.
- **Studio access:** anyone who can sign into the Sanity project can edit content. There is no role-based access in this plan; if multiple editors join later, configure roles inside `sanity.io/manage`.
- **Custom-domain swap:** when `heloc360.com` goes live, the webhook URL inside Sanity Studio settings must be updated. Task 12 Step 4 calls this out explicitly. If forgotten, edits will continue to revalidate the old `homebuyershaven.vercel.app` deployment (which may have been deprovisioned) and live `heloc360.com` will serve stale content.




