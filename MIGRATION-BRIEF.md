# Brief: migrate docs.opendialog.ai from GitBook to Astro Starlight

**Audience:** Claude Code (or an engineer working alongside it)
**Repo:** `opendialogai/docs`, branch `documentation` (live content, last synced 29 Apr 2026)
**Target:** Astro Starlight, deployed to Cloudflare Workers static assets
**Estimated effort:** 9–13 engineering days across 6 phases

---

## Mission

Replace GitBook with a self-hosted Astro Starlight site serving the same content at the same URLs, at zero hosting cost. Success means: every URL that resolves today resolves after cutover, the site looks like OpenDialog, search works, and the page weight drops by an order of magnitude.

This is a **content transformation** job, not a writing job. Do not rewrite, reword, restructure or "improve" documentation prose. If content looks wrong, log it in `MIGRATION-NOTES.md` and move on.

---

## Non-negotiables

1. **URLs must not change.** Every path in the live `sitemap.xml` must resolve on the new site, either directly or via a 301. This is the acceptance test that matters most.
2. **The conversion must be a script, not manual edits.** `scripts/convert.mjs` must be idempotent and re-runnable from a fresh GitBook sync at any point up to cutover day. Never hand-edit a converted file — fix the script and re-run.
3. **Never write to the `documentation` branch.** GitBook syncs to it bidirectionally. Work on a new branch. Treat `documentation` as read-only source.
4. **Never touch the live GitBook site or its settings.** It stays running until cutover.
5. **Stop at each phase gate** for human review. Do not run phases end to end unattended.

---

## Ground truth: what is in the source repo

Audited 29 Jul 2026. Use these numbers as expected counts — if your script produces wildly different figures, the script is wrong.

### Content
| Item | Count |
|---|---|
| Markdown files | 208 |
| Pages in live nav (`llms.txt`) | 131 |
| Pages not referenced in `SUMMARY.md` | 3 |
| Relative `.md` links to rewrite | 499 |
| `&#x20;` entity artefacts to strip | 1,203 |
| Files with existing frontmatter (`description`) | 74 |

### GitBook block syntax
| Block | Count |
|---|---|
| `{% hint %}` — info 106, success 113, warning 35, danger 4 | 258 |
| `{% content-ref %}` | 51 |
| `{% embed %}` — Loom 19, YouTube 17, other 3 | 38 |
| `{% stepper %}` / `{% step %}` | 3 / 15 |
| `{% code %}` | 7 |
| `{% columns %}` / `{% column %}` | 1 / 2 |
| `{% file %}` | 1 |

### Raw HTML already embedded in the markdown
`<figure>` × 430, `<img>` × 436, `<mark>` × 131, `<br>` × 52, `<div>` × 22, `<table>` × 18, `<details>`/`<summary>` × 14.

### Assets — `.gitbook/assets/`
| Item | Value |
|---|---|
| Total files | 1,589 |
| Total weight | **541 MB** (repo is 543 MB) |
| PNGs | 1,506 (20 over 1 MB, largest 14 MB) |
| Filenames with spaces or parentheses | **1,317** |
| Files with **no extension** | **50** |
| Files over Cloudflare's 25 MiB cap | 1 — a 28 MB GIF |
| Markdown image refs `![](...)` | 113 |

### Other
- `.gitbook/includes/navigate-to-the-next-level-....md` — one reusable snippet, transcluded somewhere. Find its usages and inline it.
- Branches `3.9` and `release/3.10` are version snapshots. **Out of scope — single-version site only.** Do not build versioning.

---

## Target stack

| Concern | Choice |
|---|---|
| Framework | Astro + Starlight (latest) |
| Content | `.md` by default, `.mdx` only where a Starlight component is required |
| Search | Pagefind (Starlight built-in, zero config, free) |
| Hosting | Cloudflare Workers static assets via `wrangler` |
| CI | Cloudflare Workers Builds (Git-connected) |
| Images | `astro:assets` build-time optimisation |
| `llms.txt` | `starlight-llms-txt` plugin |

### Why Workers and not Pages
Cloudflare now recommends Workers for new projects; Pages is in maintenance for new work. Relevant limits on the free plan:

- 20,000 files per version (we need ~1,800) ✅
- **25 MiB max per file** — the 28 MB GIF violates this and must be re-encoded ⚠️
- Requests to static assets are free and unlimited
- `_redirects`: 2,000 static + 100 dynamic rules
- The 100,000 requests/day free-plan limit applies to *Worker script invocations*, not static asset requests. Do not set `run_worker_first`; this site needs no Worker logic.

`wrangler.jsonc`:
```jsonc
{
  "name": "opendialog-docs",
  "compatibility_date": "2026-07-29",
  "assets": { "directory": "./dist" }
}
```
Build command `npx astro build`, output `./dist`.

---

## Repo layout to produce

```
/
├── CLAUDE.md                    # standing rules — read this first
├── MIGRATION-BRIEF.md           # this file
├── MIGRATION-NOTES.md           # append-only log of decisions + anomalies
├── astro.config.mjs             # Starlight config, sidebar generated from SUMMARY.md
├── wrangler.jsonc
├── package.json
├── scripts/
│   ├── convert.mjs              # GitBook markdown -> Starlight (idempotent)
│   ├── assets.mjs               # rename, sniff, re-encode, rewrite refs
│   ├── sidebar.mjs              # SUMMARY.md -> sidebar config
│   └── verify-routes.mjs        # generated routes vs live sitemap.xml
├── src/
│   ├── assets/                  # ALL images live here (NOT public/) so Astro optimises them
│   ├── components/              # Embed.astro, and any Starlight overrides
│   ├── content/docs/            # converted pages — path == URL
│   ├── content.config.ts
│   └── styles/custom.css        # OpenDialog brand tokens
├── public/
│   └── _redirects               # only for URL mismatches found in Phase 5
└── source/                      # pristine copy of the GitBook export (git-ignored)
```

**Critical:** images must live under `src/`, not `public/`. Assets in `public/` are copied verbatim and are **not** optimised. Given 541 MB of source images, this single decision is most of the performance win.

---

## Phases

Each phase ends at a gate. Stop, report, wait for a human.

---

### Phase 1 — Scaffold and theme
**Goal:** an ugly but deployed site, so every later phase has a real target.

1. Scaffold Starlight: `npm create astro@latest -- --template starlight`
2. Copy the GitBook export into `source/` (git-ignored) as the pristine input. All scripts read from `source/` and write to `src/`. This is what makes re-running safe.
3. Configure `astro.config.mjs`: site URL `https://docs.opendialog.ai`, title, logo, social links.
4. Brand theming in `src/styles/custom.css` using Starlight's CSS custom properties (`--sl-color-accent`, `--sl-color-gray-*`, font stack). Pull actual colours and fonts from opendialog.ai — do not invent a palette.
5. Add `wrangler.jsonc`, connect Cloudflare Workers Builds, get a preview URL live with a handful of manually copied pages.

**Gate:** a Cloudflare preview URL renders 3–5 real pages with OpenDialog branding.

---

### Phase 2 — Conversion script
**Goal:** `node scripts/convert.mjs` turns all 208 source files into valid Starlight content.

Build it as a unified/remark pipeline where practical, regex only for the `{% %}` block syntax. It must be **idempotent**: running twice produces identical output.

#### Format decision: `.md` vs `.mdx`
Default to `.md`. Starlight's aside syntax (`:::note`) works in plain `.md`, which covers 258 of the 341 block conversions with no MDX needed.

Promote a file to `.mdx` **only** if it needs a Starlight component (`<LinkCard>`, `<Steps>`, `<CardGrid>`). When you do promote a file, its raw HTML becomes JSX and must be normalised:
- self-close void elements: `<br>` → `<br />`, `<img ...>` → `<img ... />`
- `class=` → `className=`
- `style="a: b"` → `style={{ a: 'b' }}`
- unescaped `{` and `<` in prose must be escaped

The OpenDialog content is full of `{ attribute | filter }` template syntax in prose and code. **In `.mdx` those braces will be parsed as expressions and break the build.** Inside fenced code blocks they are safe. Outside them, they are not. Audit for this specifically — it is the single most likely cause of build failures.

#### Conversion mapping

| GitBook | Starlight | Notes |
|---|---|---|
| `{% hint style="info" %}` | `:::note` | |
| `{% hint style="success" %}` | `:::tip` | |
| `{% hint style="warning" %}` | `:::caution` | |
| `{% hint style="danger" %}` | `:::danger` | |
| `{% content-ref url="x" %}` | `<LinkCard title=".." href="x" />` | file becomes `.mdx`; title from target page's H1 |
| `{% embed url="loom/youtube" %}` | `<Embed url=".." />` | custom component, see below |
| `{% stepper %}` / `{% step %}` | `<Steps>` + ordered list | file becomes `.mdx` |
| `{% code title="x" %}` | ` ```lang title="x" ` | stays `.md` |
| `{% columns %}` / `{% column %}` | `<CardGrid>` | only 3 instances — hand-check output |
| `{% file src="x" %}` | plain markdown link | 1 instance |
| `{% include "..." %}` | inline the snippet content | 1 include file |
| `<figure><img src alt><figcaption>` | `![alt](src)` + `<figcaption>` or caption text | **see below — important** |
| `&#x20;` | a single space | 1,203 occurrences |
| `<mark>` | keep as-is | add a CSS rule in `custom.css` |
| `[x](./page.md)` | `[x](/route/path)` | 499 links; resolve against the route map |

#### `<figure>`/`<img>` — do not skip this
430 `<figure>` blocks wrap raw `<img>` tags. **Raw HTML `<img>` in markdown is not processed by `astro:assets`** — those images ship at full original size and the whole performance benefit evaporates. Convert them to markdown image syntax (`![alt](relative/path.png)`) so Astro's pipeline picks them up. Preserve `<figcaption>` text as a caption below the image. This is the highest-value single transformation in the whole migration.

#### `<Embed>` component
Write `src/components/Embed.astro`. Takes a `url`, detects Loom vs YouTube, renders a lazy `<iframe>` with `loading="lazy"`, a 16:9 aspect-ratio wrapper, and a title for accessibility. Roughly 30 lines. 36 of the 38 embeds are one of those two providers; render the remaining 3 as plain links.

#### Frontmatter
Every output file needs:
```yaml
---
title: <H1 text, or the SUMMARY.md link text if no H1>
description: <existing GitBook description if present>
---
```
Then strip the now-duplicated H1 from the body — Starlight renders the title itself.

#### Route mapping
`SUMMARY.md` is the source of truth for both nav and routes. Note its section-anchor syntax:
```markdown
## GETTING STARTED <a href="#getting-started-1" id="getting-started-1"></a>
```
The anchor id is the URL segment for that section. Sections without an anchor slugify their heading (`## CORE CONCEPTS` → `core-concepts`).

Produce `route-map.json` mapping `source file path → live URL → target file path`. Rules: `README.md` → `index.md`; directory structure otherwise preserved verbatim.

**Do not tidy the ugly slugs.** `getting-started-1` and `contextual-restart-chat-end-1` stay exactly as they are. Renaming slugs at the same time as changing platform makes any traffic drop impossible to diagnose. Clean-up is a separate job for a month later.

`scripts/sidebar.mjs` generates the `astro.config.mjs` sidebar from the same parse, preserving group order and labels.

**Gate:** all 208 files converted, `astro build` succeeds, zero `{%` sequences remain outside code fences, `route-map.json` produced.

---

### Phase 3 — Assets
**Goal:** 541 MB down to well under 60 MB, every reference intact.

1. **Sniff the 50 extension-less files** by magic bytes, rename with correct extension.
2. **Slugify all 1,589 filenames** — lowercase, strip parens, spaces to hyphens, collapse repeats, deduplicate collisions with a numeric suffix. Emit `asset-map.json`.
3. **Rewrite every reference** using `asset-map.json`, in the same pass as the rename. Both markdown `![](...)` and any surviving HTML `src=`. GitBook wraps paths containing spaces in angle brackets — `![](<../../.gitbook/assets/image (149).png>)` — so handle that form.
4. **Move assets to `src/assets/`** and rewrite refs to correct per-file relative paths.
5. **Re-encode the outliers:** the 20 PNGs over 1 MB. Keep PNG for UI screenshots with text (lossy artefacts on screenshot text look terrible); resize to a sane max width (~1600px) instead. Let Astro emit WebP/AVIF variants at build.
6. **The 28 MB GIF** exceeds Cloudflare's 25 MiB per-file cap and will fail deployment. Re-encode to MP4 with `ffmpeg` (expect ~2 MB, better quality) and replace with a `<video autoplay loop muted playsinline>`. Check the other 8 GIFs while you are there.
7. **Delete orphaned assets** not referenced by any page — but list them in `MIGRATION-NOTES.md` first, do not silently drop.

**Gate:** `du -sh src/assets` under 60 MB, no file over 25 MiB, zero broken image refs, `astro build` succeeds.

---

### Phase 4 — Look and feel
**Goal:** the new site reads as the same product as the GitBook site it replaces.

This phase exists because Phase 1 only budgets brand *tokens* — colours and fonts set through
Starlight's CSS custom properties. Matching GitBook's layout chrome means overriding Starlight
components, which is a different job. It runs here, after Phase 3, because it is the first
point at which the site is genuinely comparable: real navigation, real content, real images.
Judging sidebar density or page rhythm before that is guesswork.

It runs *before* verification and cutover on purpose. The argument is the same one that keeps
the ugly slugs: do not change platform and appearance in the same step, or no traffic or
support-ticket shift after cutover can be attributed to a cause. Phase 5 also gates on human
sign-off of a visual comparison, which cannot be given before the alignment exists.

Already done in Phase 1 — logo, site title, current-nav-entry treatment, and rendering the
frontmatter `description` as lead text under the page title. Remaining:

1. **Section breadcrumb** above the page title. GitBook shows the section name — `CORE
   CONCEPTS`, `STEP BY STEP GUIDES`. The section is already in `route-map.json`.
2. **Sidebar** density, grouping, type scale and collapse behaviour against the full ~204-entry
   nav.
3. **Header actions.** GitBook carries an `opendialog.ai` link and a "Talk to an expert" CTA.
   Decide whether they come across; Starlight has no built-in config for header links, so this
   needs a `Header` override.
4. **Table of contents** behaviour on long pages, and suppressing the "Overview"-only stub on
   pages with no headings.
5. **Typographic pass** — heading scale, measure, spacing rhythm — against the live site with
   real images in place.
6. **Asides, card-tables and `<LinkCard>`** reviewed in context now that real content renders.
7. **Dark mode**, which has had no review at all. GitBook's dark theme is the reference.

Use `scripts/screenshots.mjs` throughout; it captures matched viewports of the live site and
the preview for side-by-side comparison.

**Do not** chase pixel parity. GitBook chrome we are deliberately dropping — "Powered by
GitBook", the cookie banner, the "Copy page" dropdown — stays dropped. The test is whether a
reader notices the platform changed, not whether a diff tool does.

**Gate:** side-by-side screenshots at 375px, 768px and 1440px across a representative page set,
in both colour schemes, with human sign-off.

---

### Phase 5 — Verification
**Goal:** prove the site is equivalent before anyone repoints DNS.

1. **Route parity.** `scripts/verify-routes.mjs` fetches `https://docs.opendialog.ai/sitemap.xml`, diffs it against the built routes in `dist/`, and fails on any live URL with no target. Add a `public/_redirects` entry for each genuine mismatch (expect a handful of section-prefix quirks such as `the-opendialog-model/README.md` serving at `/core-concepts/the-opendialog-model`).
2. **Link check.** Run `lychee` or `linkinator` over `dist/`. Internal broken links are blocking. External ones go in `MIGRATION-NOTES.md` for the docs team.
3. **Image check.** Every `<img>` in the built HTML returns 200 and has a non-empty `alt` or an explicit empty one.
4. **Search.** Pagefind indexes all pages; spot-check 10 queries taken from the exported GitBook search-terms data.
5. **Visual comparison** of the top 30 pages by traffic against the live GitBook site. Pull that list from the analytics export (`top-pages.csv`) — do not guess which pages matter.
6. **Lighthouse** on 5 representative pages. Performance and accessibility both ≥ 90.
7. **Responsive check** at 375px, 768px, 1440px.

**Gate:** all automated checks green, human sign-off on the visual comparison.

---

### Phase 6 — Cutover
1. Re-sync fresh content from GitBook into `source/`, re-run `convert.mjs` and `assets.mjs`, re-run Phase 5 checks. This is the payoff for keeping the scripts idempotent.
2. Confirm the analytics export has been taken (see `gitbook-analytics-export.mjs`) — **irreversible once the plan is downgraded**.
3. Stand up replacement analytics (Cloudflare Web Analytics — free, no cookie banner) on the preview deployment *before* cutover so there is baseline overlap.
4. Deploy to production Worker. Point `docs.opendialog.ai` DNS at it.
5. Re-submit `sitemap.xml` in Google Search Console.
6. Monitor 404s for 14 days. **Keep GitBook on its paid plan throughout** as rollback.
7. After 14 clean days: downgrade GitBook, archive `3.9` and `release/3.10`.

---

## Out of scope

Do not do any of these without asking:

- Rewriting or restructuring documentation prose
- Renaming URL slugs, however ugly
- Versioned docs
- Adding AI search (revisit after the saving is banked)
- Reorganising the sidebar or information architecture
- Migrating GitBook comments or change history
- Anything touching the live GitBook site

---

## Log as you go

Maintain `MIGRATION-NOTES.md`, append-only. Every anomaly, judgement call and deferred fix goes in it: content that looked wrong, external links that 404, assets deleted as orphans, pages needing human review. This file is the handover document — it matters more than a tidy commit history.
