# Migration notes

Append-only log of decisions, anomalies and deferred fixes. Newest at the bottom.

---

## 2026-07-29 — Branch set up

Created `astro-starlight` off `main` (which held only an empty `README.md`). The GitBook
content lives solely on `documentation`, so the Astro project gets a clean root with no
collision between the export and the site. `source/` is populated from `documentation`
with `git archive documentation | tar -x -C source/` and is git-ignored.

---

## 2026-07-29 — Live reference data snapshotted

`reference/sitemap.xml`, `reference/sitemap-pages.xml` and `reference/llms.txt` are
committed snapshots of the live GitBook site, taken 29 Jul 2026.

They are committed rather than fetched on demand because they are the acceptance oracle
for the whole migration and they disappear when GitBook is switched off. `verify-routes`
must keep working after cutover.

**Correction to the brief:** `sitemap.xml` is a sitemap *index*, not a URL list. It
contains one `<loc>`, pointing at `sitemap-pages.xml`. A verifier that parses
`sitemap.xml` for page URLs finds one entry and reports a false pass.

**Correction to the brief:** the brief expects "~131 live URLs in sitemap". The live
sitemap has **204**. The 131 figure is the page count in `llms.txt`, which is a curated
nav subset, not the published URL set. Route parity must be measured against 204.

---

## 2026-07-29 — Route derivation: URLs come from nav position, not file path

The brief assumes URLs derive from file paths, with "a handful of section-prefix quirks"
to be patched via `public/_redirects`. That is not how GitBook routes these docs.

**The actual rule, which holds for all 204 pages with no exceptions:**

```
URL = /<section slug>/<own segments of nav ancestors>/<own segment>
      own segment = directory name when the file is README.md, else its basename
      top-level README.md -> /
      section slug = the SUMMARY.md heading anchor id where present, else the
                     slugified heading text
```

Path-based derivation gets 200 of 204 and fails on four pages whose file location
disagrees with their nav position:

| Source file | Live URL |
|---|---|
| `best-practices/testing-strategy.md` | `/opendialog-platform/conversation-designer/conversation-design/introduction/testing-strategy` |
| `best-practices/designing-in-opendialog/messages-best-practices.md` | `/opendialog-platform/conversation-designer/message-design/messages-best-practices` |
| `designing-conversations/actions/README.md` | `/opendialog-platform/actions` |
| `designing-conversations/actions/actions-from-library/README.md` | `/opendialog-platform/actions/actions-from-library` |

Deriving from nav position handles all four with no special cases.

The path-based derivations of those four (e.g. `/opendialog-platform/designing-conversations/actions`)
return **404 on the live site** — they were never real URLs. So no redirects are owed for
them. On current evidence `public/_redirects` is not needed at all.

`scripts/routes.mjs` implements this, writes `route-map.json`, and fails non-zero on any
divergence from the sitemap snapshot. Currently: 204 derived, 204 live, 0 unreachable,
0 invented. Verified byte-identical on re-run.

---

## 2026-07-29 — File accounting reconciled

| | |
|---|---|
| `.md` files on `documentation` | 208 |
| less `SUMMARY.md` | 207 |
| less 3 files under `.gitbook/` | **204 content pages** |
| SUMMARY.md nav entries | 204 |
| Live sitemap URLs | 204 |

Exact 1:1. The brief's "3 pages not referenced in `SUMMARY.md`" is accounted for: those
three are `.gitbook/assets/luis-interpreter.md`, `.gitbook/assets/qna-interpreter.md` and
`.gitbook/includes/navigate-to-the-next-level-....md`. The first two are stray markdown
sitting in the assets directory and do not publish. The third is the include. No content
page is missing from the nav.

**Parser trap worth keeping:** four `SUMMARY.md` entries have escaped brackets in the link
label — `[\[Deprecated\] webhook actions](...)`. A label regex of `\[([^\]]*)\]` silently
drops all four, which reads as a clean 200/200 parse rather than an error. The label must
be matched greedily to the final `](`. These four pages are live and must not be lost.

---

## 2026-07-29 — `<LinkCard>` retained; MDX risk measured at one line

`{% content-ref %}` -> `<LinkCard>` promotes 9 files to `.mdx`. A further 2 files need
`.mdx` for `<Steps>`/`<CardGrid>` regardless of that decision, so dropping `<LinkCard>`
would take the `.mdx` count from 11 to 2, not to zero. MDX stays in the build either way.

**Measured MDX brace risk.** Scanned all 11 `.mdx` candidates for `{` or `}` surviving
outside code fences and inline code spans. **One line in the whole set:**

```
core-concepts/contexts-and-attributes/about-attributes.md:176
  * This is also directly accessible as  {`user.utterance_text}` without having to refer...
```

The backticks are misplaced in the source, so the `{` falls outside the code span. The two
files that require `.mdx` regardless have zero risky lines. The `{ attribute | filter }`
syntax the brief flags as the top build risk appears in 6 files, none of which are `.mdx`
candidates — the feared overlap does not exist.

**Decision: keep `<LinkCard>`.** `convert.mjs` escapes bare `{`/`}` in prose when emitting
`.mdx`. That is an output-encoding rule for the target format, not a prose edit, and it is
general rather than a per-file special case. The rendered text at that line will still read
oddly; it reads oddly on GitBook today. Not fixed, logged here.

Weighing against dropping it: 33 of the 51 refs sit on two hub pages —
`message-design/README.md` (16) and `message-types/README.md` (17) — whose only purpose is
to route readers onward. Plain links turn those into long bullet lists, a visible downgrade
against the live site in the Phase 4 visual comparison.

No conversion work is saved by dropping it. The inner link text of a `content-ref` is a raw
filename (`[chat-management-conversation.md](chat-management-conversation.md)`), not a
title — GitBook substitutes the target page's title at render. Both options therefore need a
title lookup via `route-map.json`.

Verified while checking: the `url` attribute and the inner link target agree on all 51
`content-ref` blocks. No source inconsistency to work around.

**Not taken:** emitting LinkCard-equivalent markup as raw HTML from a remark step, keeping
every file `.md`. Would remove MDX entirely at the cost of maintaining our own card CSS
instead of inheriting Starlight's. Unverified — would need a spike on how Starlight's
markdown pipeline handles raw HTML blocks. Revisit only if eliminating `.mdx` becomes a
goal in itself.

---

## 2026-07-29 — Phase 1 scaffold

Astro 7.1.5, Starlight 0.41.5, `sharp` for image processing. No Cloudflare adapter: the
build is fully static, and an adapter is only needed for on-demand rendering.

**Starlight theming API.** This version uses `--sl-color-accent-low/-/-high`,
`--sl-color-gray-1..7`, `--sl-color-white/black`, `--sl-font` and `--sl-font-mono`. Dark is
the `:root` default; light is `:root[data-theme='light']`. Verified by reading
`node_modules/@astrojs/starlight/style/props.css` rather than the published guide — the
guide describes a `--color-accent-*` 50–950 scale that this version does not use. Read the
installed package, not the docs.

**`social` config is an array** of `{ icon, label, href }`, not the older object map.

### Brand tokens

Taken from the rendered markup of opendialog.ai. The docs site itself is a GitBook JS shell
and carries no usable colour information.

| Token | Value |
|---|---|
| Accent (brand blue) | `#0023ff` — `hsl(232, 100%, 50%)` |
| Deep navy | `#1b1464` |
| Body text | `#3e4563` |
| Muted text | `#565f85` |
| Borders | `#e1e4ef` |
| Background tint | `#f8f9fc` |
| Teal accent | `#62cac2` |
| Fonts | Inter (body), Fragment Mono (code) |

Starlight's default accent hue is 234 and OpenDialog's is 232, so the brand blue sits
almost exactly on the theme's tuned default. The grey ramp therefore keeps Starlight's
lightness values, which are tuned for contrast, and shifts only hue and saturation onto
OpenDialog's blue-tinted greys (all near hue 227). `hsl(232, 100%, 50%)` rounds to
`#0022ff` under Lightning CSS, so the light-mode accent is pinned to the exact hex.

Fonts are self-hosted via Fontsource. The build makes **zero external font requests** —
no Google Fonts CDN dependency, which keeps the Phase 4 Lighthouse target reachable.

Logo and favicon are OpenDialog's own brand mark, pulled from the marketing site.

### Placeholder content — must be deleted in Phase 2

`src/content/docs/` currently holds four hand-converted pages purely to prove the deploy:

- `index.md`
- `getting-started-1/getting-ready/index.md`
- `core-concepts/the-opendialog-model/index.mdx`
- `tutorials/ai-agent-creation-overview/index.mdx`

These violate the standing rule against hand-editing generated content and exist only for
the Phase 1 gate. `convert.mjs` must delete `src/content/docs/` wholesale before writing.
Figures are omitted from them because assets land in Phase 3.

`core-concepts/the-opendialog-model` was chosen deliberately: its source file is
`the-opendialog-model/README.md`, one of the four pages whose disk location disagrees with
its nav position. It builds at the correct live URL, so the nav-based routing rule is
confirmed end to end and not just on paper.

The `astro.config.mjs` sidebar is a Phase 1 placeholder; `scripts/sidebar.mjs` generates it
from `SUMMARY.md` in Phase 2.

---

## 2026-07-29 — Two conversion cases missing from the brief

**GitBook card-tables.** 8 instances of `<table data-view="cards">` across 8 files, using
`data-card-target` and `data-card-cover` column attributes. GitBook renders these as card
grids. They are raw HTML, so they survive markdown conversion as an unstyled table unless
handled. Not in the brief's inventory. Needs a Phase 2 decision: convert to `<CardGrid>` +
`<LinkCard>`, or let them degrade to plain tables. 8 instances is hand-checkable.

Affected: `README.md`, `monitoring-your-application.md`,
`getting-started-1/quick-start-ai-agents/README.md`,
`core-concepts/contexts-and-attributes/conditions-and-operators.md`,
`core-concepts/the-opendialog-workspace/language-services.md`,
`core-concepts/the-opendialog-workspace/scenarios/README.md`,
`opendialog-platform/conversation-designer/message-design/message-editor.md`,
`opendialog-platform/conversation-designer/message-design/README.md`.

**Broken links baked into published content.** 12 occurrences across 6 files of GitBook's
`/broken/pages/<id>` placeholder, rendered as the literal text "Broken link". These are
already broken on the live site — the homepage card-table has three of them. They are a
pre-existing content defect, not a migration artefact. Per the standing rule the prose is
not edited; flagging for the docs team. They will 404 after cutover exactly as they do now.

Affected: `README.md`, `release-notes/release-notes.md`,
`core-concepts/the-opendialog-workspace/README.md`,
`opendialog-platform/conversation-designer/conversation-design/conversational-patterns/recommendations/README.md`,
`opendialog-platform/interpreters-and-natural-language-understanding/interpreters/available-interpreters/openai-interpreter.md`,
`opendialog-platform/interpreters-and-natural-language-understanding/llm-actions/README.md`.

**Typo, not fixed:** `README.md` line 32 reads "We have laaunched an AI Accelerator
Program". Prose is not edited under the standing rules. For the docs team.

---

## 2026-07-29 — Phase 3 dependency missing

`ffmpeg` is not installed on this machine. Phase 3 needs it to re-encode the 28 MB GIF that
exceeds Cloudflare's 25 MiB per-file cap and would otherwise fail deployment. Install before
starting Phase 3.

---

## 2026-07-29 — Astro emits a sitemap *index* too

`@astrojs/sitemap` produces `sitemap-index.xml` plus `sitemap-0.xml`, the same two-level
pattern GitBook uses. `verify-routes.mjs` must resolve the index on both sides rather than
parsing the top-level file for `<loc>` page entries.

---

## 2026-07-29 — Trailing slashes would have put a redirect in front of every URL

Caught on the first deploy. All 204 live GitBook URLs are the no-trailing-slash form and
return **200** there. Cloudflare's default `html_handling` of `"auto-trailing-slash"`
answered those same paths with a **307** to the slashed variant.

That is not a cosmetic difference. It would have placed a *temporary* redirect in front of
every URL on the site. Google does not consolidate ranking signals through a 307, it adds a
round trip to every page load, and it changes the canonical URL shape — which is exactly
what makes a post-cutover traffic drop impossible to attribute.

Two settings fix it, and both are needed:

- `wrangler.jsonc` — `"html_handling": "drop-trailing-slash"`, so `/foo` is served directly
  from `/foo/index.html` with no redirect. Also `"not_found_handling": "404-page"` so the
  built `404.html` is served instead of a bare Cloudflare 404.
- `astro.config.mjs` — `trailingSlash: 'never'`, so Starlight generates internal links and
  `<link rel="canonical">` in the same no-slash shape. Without this the Cloudflare setting
  would redirect every internal navigation the other way.

Verified after the fix: canonical is `https://docs.opendialog.ai/getting-started-1/getting-ready`,
sidebar links carry no trailing slash, and all four routes return 200 in their exact live
form.

**Rollout lag is real and will mislead a verifier.** Immediately after `wrangler deploy`,
edges disagree — a route returned 200 on 39 of 40 requests with a single stale 307, and
cleared to 40/40 on the next sample about a minute later. `verify-routes.mjs` must poll to a
stable result rather than judge a deployment on one request per URL, or it will report
phantom failures at cutover.

---

## 2026-07-29 — Chrome parity with GitBook: added scope, split in two

Pat's direction after reviewing screenshots: stay as close to the GitBook theme as Starlight
allows.

**This is scope the brief does not contain.** Phase 1 step 4 budgets "brand theming in
`src/styles/custom.css` using Starlight's CSS custom properties" — tokens only. Matching
GitBook's layout chrome means component overrides. There is no chrome phase, and Phase 4
only verifies visuals without budget to change them. Recording the addition rather than
letting it look like it was always in the plan.

It is consistent with the brief's own reasoning: the argument for not renaming ugly slugs —
don't change platform and appearance at once, or no traffic shift can be attributed — applies
equally to chrome.

Split, because some of it cannot be judged yet. Sidebar density, grouping and collapse
behaviour are meaningless with 4 placeholder nav items standing in for ~40, and page rhythm
cannot be assessed with every image missing.

**Done now, closing Phase 1:**

- Logo replaced with the transparent RGBA mark the GitBook site itself serves. The previous
  asset was the marketing-site favicon: the same mark on a rounded blue tile, which read as
  an app icon next to the wordmark.
- Site title `OpenDialog` -> `OpenDialog Docs`, matching live.
- Current sidebar entry no longer a solid fill. Starlight's default sets
  `background-color: var(--sl-color-text-accent)` with inverted text, which against a fully
  saturated brand blue reads as a heavy block; GitBook marks the current page with weight and
  colour alone.
- Frontmatter `description` rendered under the page title via a `PageTitle` override.

**Deferred until Phase 2/3 provide real nav and images:** section breadcrumb above the title,
sidebar density and grouping, header actions (`opendialog.ai` link and the "Talk to an
expert" CTA), table-of-contents behaviour on long pages.

**Explicitly not chasing:** GitBook's "Copy page" dropdown; the cookie banner (Cloudflare Web
Analytics is cookieless, so its absence is an improvement, not a gap).

### The description gap this fixed

GitBook renders a page's frontmatter `description` as visible lead text under the heading.
Starlight uses it only for `<meta name="description">` — confirmed by grepping the package,
where `description` appears solely in `utils/head.ts`. **71 source files carry a
description**, so without the override 71 pages silently drop content the reader can
currently see. The brief specifies carrying `description` into frontmatter and does not
mention that Starlight will not display it.

`src/components/PageTitle.astro` inlines `PAGE_TITLE_ID = '_top'`. Starlight does not expose
`./constants` as a public export subpath and `./internal` does not re-export it, so importing
it fails the build. The value must stay `'_top'` — the table of contents' "Overview" entry
links to `#_top`.

---

## 2026-07-29 — Phases renumbered: look and feel is now Phase 4

A dedicated look-and-feel phase was added to `MIGRATION-BRIEF.md` at Pat's direction. It sits
after Assets and before Verification:

| | Was | Now |
|---|---|---|
| 1 | Scaffold and theme | Scaffold and theme |
| 2 | Conversion script | Conversion script |
| 3 | Assets | Assets |
| 4 | Verification | **Look and feel** (new) |
| 5 | Cutover | Verification |
| 6 | — | Cutover |

Placed before verification and cutover rather than at the very end. Aligning appearance after
DNS moves would defeat the point of doing it: the reason for matching GitBook is the same as
the reason for keeping the ugly slugs — do not change platform and appearance in one step, or
no post-cutover traffic shift can be attributed. Verification also gates on human sign-off of
a visual comparison, which cannot happen before the alignment exists.

Placed after Assets because that is the first point where the site is genuinely comparable —
real nav, real content, real images. Sidebar density and page rhythm cannot be judged against
placeholder content.

Effort estimate in the brief raised from 7–10 days to 9–13.

**Entries above this line predate the renumbering.** Where they say "Phase 4" of visual
comparison or the Lighthouse target, they mean what is now Phase 5. This file is append-only,
so they stand as written.

---

## 2026-07-29 — First CI build failed: lockfile was npm-11-only

Workers Builds' first run failed at `npm clean-install`:

```
npm error `npm ci` can only install packages when your package.json and
npm error package-lock.json are in sync.
npm error Missing: @emnapi/core@2.0.0-alpha.3 from lock file
npm error Missing: @emnapi/runtime@2.0.0-alpha.3 from lock file
npm error Missing: @emnapi/wasi-threads@2.0.1 from lock file
```

**Root cause: npm version skew, not a stale lock.** The build image runs npm 10.9.2
(Node 22.16.0); the lockfile was generated locally by npm 11.6.0. Proven by running both
against the identical lockfile:

| npm | result |
|---|---|
| 11.6.0 | 463 packages, success |
| 10.9.2 | EUSAGE, the three `@emnapi` packages missing |

The `@emnapi` packages are optional wasm32-wasi fallbacks reached through
`@napi-rs/wasm-runtime`, pulled in by `sharp` and `rolldown`. npm 10 hoists them to
top-level entries in the tree; npm 11 does not consider them needed and omits them from the
lock. npm 10 then refuses a lock that lacks entries it expects.

**Fix:** lockfile regenerated with npm 10.9.2, which adds the three top-level entries.
Verified the regenerated lock installs cleanly under *both* versions, and that a full
`npm ci` + `astro build` under npm 10.9.2 succeeds — 5 pages, matching the local build.
npm 10 installs 366 packages and npm 11 installs 466; the difference is optional
platform-specific binaries and does not affect the build.

**This will recur.** Any `npm install` run locally under npm 11 rewrites the lock back into
the npm-11-only shape and breaks CI again. The durable fix is pinning the toolchain so local
and CI agree — either `.node-version` holding CI where it is and contributors using npm 10.x,
or moving CI to a Node that bundles npm 11. Not decided yet; raised with Pat.

---

## 2026-07-29 — CI pinned to Node 24.18.0

Follow-up to the lockfile failure above. The Workers Builds default is Node 22.16.0 with
npm 10.9.2 — confirmed both in the build log and in Cloudflare's build-image documentation,
which also states the version is overridable via `.node-version`, `.nvmrc`, or a
`NODE_VERSION` build variable.

`.node-version` now pins **24.18.0** (LTS "Krypton"), which ships **npm 11.16.0**.

Chosen over holding CI at 22.16.0 because lockfiles are generated on developer machines, and
Pat's local npm is 11.x. Pinning CI to npm 10 would mean every local `npm install` reintroduces
the incompatibility. Moving CI to where the developer already is removes the recurrence
instead of policing it.

Verified on Node 24.18.0 / npm 11.16.0 before committing:

- `npm ci` succeeds against the regenerated lockfile.
- `astro build` produces 5 pages, matching the local build.
- `sharp` 0.34.5 loads and encodes WebP. This was worth checking specifically: npm 11.16
  gates package lifecycle scripts and emits an `allow-scripts` warning during install. sharp
  is the whole image pipeline for Phase 3, and the Phase 1 content has no images, so a broken
  sharp would have passed the build now and failed later. It uses prebuilt binaries and needs
  no install script, so the warning is benign for this dependency set.

The lockfile is left in its npm-10-generated shape deliberately. It installs cleanly under
both npm 10.9.2 and npm 11.16.0, so it still works if a build ever falls back to the default
image.

---

## 2026-07-30 — Phase 2 gate: conversion script complete

`scripts/convert.mjs` and `scripts/sidebar.mjs` are done. 204 pages convert, `astro build`
succeeds, zero `{%` survives outside code fences, and a second run is byte-identical.

**Every figure in this section was measured at this commit against `source/`,
`src/content/docs/`, `dist/` or `reference/`.** Nothing is transcribed from the brief or the
design spec. Where a measurement disagrees with the spec, the measured figure is recorded and
the disagreement is stated. This matters because **eight of the design spec's measured counts
have now proved wrong** — the page-link total, the card-table attribute spread, "41 cards",
"26 dropped covers", "6 broken links in card-tables", "391 empty alt", "15 brace lines", and
the count of distinct `/broken/pages/` links; each is shown against its measurement below.
The plan's draft code separately produced ten real defects, five of them silent content loss
that still left `astro build` green.

### Gate evidence

| Check | Result |
|---|---|
| `npm test` | 142 pass, 0 fail |
| `node scripts/routes.mjs` | 204 derived, 204 live, 0 unreachable, 0 invented |
| `node scripts/convert.mjs` | 13/13 invariants `ok`, 204 pages written |
| `node scripts/sidebar.mjs` | 6 sections, 245 nav entries |
| `npx astro build` | succeeds, 205 pages |
| `{%` surviving outside code fences | **0** |
| Idempotency | full pipeline re-run leaves `git status` clean |

**Correction to the brief's gate command.** The brief expects
`find dist -name index.html | wc -l` to report 205. It reports **204**. The 205th page is
`dist/404.html`, which `trailingSlash: 'never'` emits as a flat file rather than
`404/index.html`. `find dist -name '*.html' | wc -l` is 205, and `dist/404.html` is the only
non-`index.html` file in the tree — so the extra page is genuinely the 404 and not a stray.
Verified further by diffing built routes against `route-map.json`: 204 built, 204 mapped,
0 built-but-unmapped, 0 mapped-but-unbuilt.

The four Phase 1 hand-written placeholders are gone. `src/content/docs/index.md` was deleted
at `c6bbf1f` and the root page is now the generated `index.mdx`. The other three placeholder
paths still exist, but as generated pages — `convert.mjs` deletes the directory wholesale
before writing, and the tree is clean after a re-run. There are exactly 204 `index.md`/
`index.mdx` files for 204 routes, with no directory holding both.

### The final invariant table, as it actually ran

```
ok   files                204
ok   mdx                  46
ok   asides               258
ok   contentRefCards      51
ok   cardTableCards       41
ok   embeds               36
ok   cardGrids            9
ok   images               529
ok   droppedCovers        13
ok   survivingBlocks      0
ok   survivingEntities    0
ok   survivingImgTags     0
ok   survivingBraces      0
     ordered list items   149
```

`ordered list items` is informational and **not asserted**. It counts every `^\d+. ` line in
the output, so it includes ordinary numbered lists and cannot isolate the 15 stepper steps.
Do not read 149 as a stepper count.

`survivingBraces` is a weaker guarantee than its name suggests. `convert.mjs`'s `JSX_TAG`
omits the `(?=[\s/>])` boundary lookahead that `mdx.mjs`'s `TAG` carries, so `TAG` is a strict
subset of `JSX_TAG` and the counter strips at least everything `normaliseForMdx` left. It
detects a wiring defect — the `isMdx` gate skipped, the escape step removed — not "no brace
leaked". `astro build`, which renders all 204 pages through the real MDX compiler, is what
actually guards content safety; it is what caught the `<div>` and `<pre>` defects below.

### The design spec's eight corrections, re-measured

| # | Spec's claim | Measured here | Verdict |
|---|---|---|---|
| 1 | `hidden: true` on 2 files must be dropped | 2 files carry it; **0** `hidden:` survive in output | confirmed |
| 2 | 1,203 `&#x20;`, 1,192 at EOL, 84 after an existing space | 1,203 / 1,192 / 84 exactly | confirmed |
| 3 | Zero `{% include %}` in the corpus | **0** | confirmed |
| 4 | All 204 pages have an H1 | **204 of 204** | confirmed |
| 5 | 311 `.md`-form + 70 directory-form = 381 page links | **295 + 62 = 357** | **spec wrong**, see #9 |
| 6 | One source link escapes the repo root with an extra `../` | exactly **1** link (2 textual occurrences) | confirmed |
| 7 | Card-table attribute order varies; "one of the eight" carries `data-card-size` | **5 distinct attribute spellings** across the 8 tables; **3** carry `data-card-size="large"`, not one | substance confirmed, count wrong |
| 8 | `.mdx` promotion is 46 files, not 11 | **46** `.mdx` of 204 | confirmed |

Correction 7's substantive point — the detector must be attribute-order independent — holds,
and the implementation is. Only the "one of the eight" figure was wrong. The five spellings
are `data-view="cards"` (2), `data-view="cards" data-full-width="false"` (2),
`data-view="cards" data-full-width="true"` (1),
`data-card-size="large" data-view="cards"` (1), and
`data-card-size="large" data-view="cards" data-full-width="false"` (2).

Block counts in `source/`, all confirmed against the spec: 258 `{% hint %}` (106 info, 113
success, 35 warning, 4 danger — emitted as 106 `:::note`, 113 `:::tip`, 35 `:::caution`, 4
`:::danger`), 51 `{% content-ref %}`, 38 `{% embed %}`, 3 `{% stepper %}`, 15 `{% step %}`,
1 `{% columns %}` with 2 `{% column %}`, 1 `{% file %}`, 7 `{% code %}`, 131 `<mark style>`.

### Corrections measured during execution

These are beyond the design spec's original eight. Each was found while running real code
against the real corpus.

**#9 — the in-prose page-link count is 357, not 381.** The spec's 311 + 70 is a design-time
miscount. Three independent measurements agree on 295 `.md`-form + 62 directory-form:
`links.mjs`'s own extractor; a re-measurement with `mdast-util-from-markdown`; and the
spec's own derivation, since `grep -rhoE '\]\(<?[^)]*\.md[^)]*\)' source/` returns exactly the
brief's 499 and 499 − 204 `SUMMARY.md` nav entries = 295. Nothing in the pipeline asserts a
link count, so no behaviour depended on 381. The binding guarantee — any link that fails to
resolve fails the run — holds. Note 42 of the 295 are the inner lines of `{% content-ref %}`
blocks, which are discarded before `rewriteLinks` runs, and 9 content-refs are directory-form.

**#10 — the plan's `convertCode` inserted a stray space into every fence info string.**
` ```html ` became ` ``` html `. It failed 3 of the plan's own 11 tests on first run. The
replacer's string assembly was fixed; the capture regex was untouched.

**#11 — the `&#x20;` end-of-line rule assumed at most one preceding space.** That holds for 80
of the 84 cases. On **4** real lines two or more spaces precede the entity, so stripping the
entity alone leaves a trailing run that CommonMark renders as a `<br>` the live site does not
have — the exact failure the rule exists to prevent. Those runs now collapse to a single
space, scoped to lines that actually contained an entity so genuine hard breaks are untouched.
Re-measured here: 1,203 total, 1,192 at EOL, 84 preceded by ≥1 space, **4 preceded by ≥2**.
The four: `language-services.md:27`, `constructing-messages.md:81`,
`the-contextual-faq-pattern.md:68`, `contextual-help.md:17`.

**#12 — `convertSteppers` deleted a step's entire body on malformed input** and renumbered the
rest, leaving `<Steps>` tags balanced and the build green. It now throws on four malformed
shapes: a new `{% step %}` while one is open; `{% endstepper %}` with an open step;
end-of-input with an open stepper or step; a stray `{% endstep %}` with nothing open.
Unreachable on today's corpus — 0 throws across all 208 files.

**#13 — the spec's card-table figures were wrong.** Measured across the 8 tables: **41 rows,
of which only 17 carry a link target.** 22 of the remaining 24 are a reference glossary in
`conditions-and-operators.md` with no links at all; the other 2 are in
`quick-start-ai-agents/README.md`. The spec's "41 cards" is 41 *rows*; the draft emitted only
17 `<LinkCard>`. The spec's "9 CardGrids" only holds if all 8 tables emit one, and the draft's
22-row table emitted none because it produced zero cards. Confirmed in the output at this
commit: 68 `<LinkCard>` (51 content-ref + 17 card-table), 24 `<Card>`, 9 `<CardGrid>`.

The defect this prevented: before the fix, `quick-start-ai-agents/README.md` went from 3 rows
to 1 card. "Quick Start AI Agent" and "Start from Scratch AI Agent" — two paragraphs of real
documentation — were deleted outright, with `astro build` still green. Found only because the
implementer refused to force the corpus count to match the spec.

**#14 — "391 images with empty `alt`" is derivable from no grouping.** Measured two ways here:
**397 of 436** across all `<img>`, or **392 of 430** across figure-images only (the remaining
6 are bare `<img>`, 5 of them empty). All 397 are literally `alt=""` — no `<img>` in the
corpus is missing the attribute, and none is whitespace-only. In the generated output,
**455 of 529** markdown images have an empty alt (the extra 58 come from the 93 pre-existing
markdown images). Alt text is never modified, so this has no code implication; it is a
docs-team item and a Phase 5 accessibility item. **Use 455/529 as the actionable figure** —
it is what a reader of the built site actually encounters.

**#15 — two deliberate deviations in `figures.mjs`, both upheld by review.** `<code>` spans
inside a `<figcaption>` are preserved as backticks rather than stripped: format transcoding,
not a prose edit, exactly parallel to `<img>` becoming `![]()`. Exactly 2 of 430 figcaptions
are affected, both marking an attribute name — `llm-actions/openai.md:60` and
`azure-openai.md:61`. No other inline tag appears in any figcaption corpus-wide, only `<p>`
and `<code>`. Separately, throw-guards were added for a `<figure>` not matching the
one-image shape and an `<img>` with no `src`; neither fires — all 430 figures hold exactly one
`<img>` and every `<img>` has a `src`.

**#16 — brace lines are 14 across 6 files, not 15.** Measured independently by two agents at
the time, and re-measured here from the escaped output: **14 escaped-brace lines across 6
`.mdx` files** — `about-attributes`, `form-message`, `text-message`, `llm-actions`,
`integrate`, `use-knowledge-sources-via-rag`. The file list matches the spec exactly; the 15th
line is not reproducible. All 14 are genuine `{attribute}` GitBook template references in
prose. Also measured: `class=` → `className=` is dead code on this corpus — all 43 `class=`
occurrences sit in fenced code or on `.md`-only pages, and none reaches an `.mdx` file.

**#17 — two bugs in the plan's `normaliseForMdx`.** (a) The draft's `TAG` regex swallowed a
CommonMark autolink as if it were a tag. Real, not hypothetical:
`address-autocomplete-message.md` contains both a Loom embed (which promotes it to `.mdx`) and
a Fetchify autolink. Fixed with a `(?=[\s/>])` lookahead after the tag name. (b) The draft's
`[^>]*` attribute scan was not quote-aware. Two corruption modes were reproduced: a `>` inside
a quoted attribute truncated the match and exposed a later brace to escaping, injecting a
stray backslash into displayed prose; and `\bclass=` matched inside a URL query string,
rewriting `href="/y?class=header"` to `className=`. Fixed with a quote-aware alternation plus
whitespace anchoring on the `class=`/`style=` replacements. Neither mode occurs today; fixed
anyway because `CLAUDE.md` names this module the top build risk and a card title acquiring a
`>` is an ordinary future edit.

**#18 — embed URL validation moved from render time to conversion time.** See the decisions
section below.

**#19 — the image wrapper `<div>` is reflowed, not stripped.** See the decisions section.

**Three further defects surfaced only at first end-to-end integration**, in modules that had
already been reviewed clean:

- `takeTitle` lifted the H1 out before `stripEntities` ran, so `# Best practices&#x20;` in
  `opendialog-platform/conversation-designer/conversation-design/introduction/README.md`
  reached the emitted frontmatter title untouched. `frontmatter.mjs` now strips it in
  `takeTitle`.
- GitBook's `<div align="…">` image wrapper breaks MDX's HTML-block parsing — content and
  closing tag on separate lines, so MDX never sees the div closed.
- Two independent MDX limitations: a bare `<url>` autolink is read as a namespaced tag
  (`renderEmbed` now emits `[url](url)` for the 2 non-video embeds), and a multi-line
  `<pre><code>` cannot parse (`unwrapPreCode` drops the redundant `<code>`).

### The `mapLines` / `protectCode` refinement

`segments.mjs` exposes `mapLines` and `protectCode` rather than the spec's
`splitSegments` / `mapProse`. Per-segment mapping was abandoned because a transform that needs
to see across a segment boundary — a `{% hint %}` opening before a fence and closing after it,
or a multi-line `<figure>` — cannot be expressed as a function of one segment. Masking code
in place and restoring it afterwards keeps every transform operating on the whole document
while still making fenced blocks and inline spans immune, and it keeps offsets stable so
`links.mjs`'s cursor-based rewriting works.

The distinction between the two matters and was got wrong once. `mapLines` protects fenced
code but **not** inline single-backtick spans; `protectCode` protects both. The
`survivingBraces` invariant first reported 79, all inside inline code spans, because it was
built on the fence-only measurement. Rebuilding it on `protectCode` gave 0. This was flagged
at review as a named risk — a widened measurement that lets a real leak pass would defeat the
invariant — and the outcome is recorded honestly above: the counter is cheap and narrow, and
`astro build` is the real guard.

### Decisions taken during execution

Five decisions were escalated to Pat rather than resolved by an implementer, because each
conflicted with the plan's own text.

**1. An unrecognised `{% hint %}` style throws instead of falling back to `:::note`.**
Rationale: consistency with `frontmatter.mjs`, which already throws on unrecognised YAML, so a
new shape arriving in a later GitBook sync fails loudly at cutover rather than silently. A
fifth style would otherwise coerce to `:::note` and still count as an aside, so the 258
invariant would not catch it. *Rejected:* keep the silent `?? 'note'` fallback.
Unreachable on today's corpus.

**2. Every card-table row becomes a card** — `<LinkCard>` when the row has a link target,
`<Card>` when it does not. Rationale: it matches GitBook, which renders every row of a
`data-view="cards"` table as a card and only makes targeted ones clickable; it satisfies both
of the spec's invariants (41 cards and 9 CardGrids) simultaneously; and it loses no content.
`Card` is exported from `@astrojs/starlight/components` — verified in the installed package,
not the docs. *Rejected:* leave mixed tables as raw HTML, which preserves content but leaves
2 of 8 tables as unstyled tables against a card grid on the live site.

**3. Embed URLs are validated at conversion time, not at render time.** An implementer had
replaced the plan's plain-link fallback with a thrown error inside `Embed.astro`. Review
pushed back on two counts: a component throw runs inside `astro build` and fails all 204
pages, unlike a script-side throw that aborts a re-runnable script in seconds; and the
guarantee was asymmetric anyway, because a `loom.com` URL without `/share/` returns a
non-null but wrong `src`, producing a blank iframe the throw never caught. `isVideoEmbed` now
tests embeddable *shape*, accepting only `youtu.be/<id>`, `youtube.com/watch?v=<id>` and
`loom.com/share/<id>`; anything else on those hosts becomes a plain autolink, which is a
visible working link. The component keeps a fallback that cannot fire in practice.
*Rejected:* the component-side throw. The principle: **loud failure where it is cheap,
graceful degradation where failure is expensive.**

**4. `tsconfig.json` gains a `~/*` → `src/*` paths alias.** `~/components/Embed.astro` did not
resolve — there is no `paths` entry in `tsconfig.json` nor in the `astro/tsconfigs/strict` it
extends, confirmed by a real build failure. The alias means all 30 embed-bearing files carry
one identical import line. *Rejected:* computing a relative import per file depth.

**5. The image wrapper `<div>` is reflowed, not stripped.** Measured: 19 wrapper divs across
15 pages. 10 carry attributes — 6 `align="left"` (the GitBook default, a visual no-op), 1
`data-full-width="false"` alone (a GitBook-proprietary attribute with no meaning outside
GitBook), and 3 carrying `align="center"`, which the live site honours
(`location-message.md`, `date-picker-message.md`, `google-dialogflow-knowledge-base.md`). The
other 9 have no attributes. Stripping loses the centering. Reflowing — open tag, each figure,
close tag on their own lines with blank lines between — keeps it, still solves the MDX
HTML-block parse failure (MDX accepts markdown between JSX tags separated by blank lines),
works unchanged in `.md` and `.mdx` so it stays one code path, and fixed a caption-pairing bug
as a side effect. *Rejected:* strip uniformly and ask the docs team to re-apply centering in
GitBook before cutover.

The caption bug that reflowing fixed is the fifth instance of silent content damage with a
green build: `stripImageDivs` returned `inner.trim()`, so sibling `<figure>`s that GitBook had
written on one line stayed on one line, and `convertFigures`'s `![](src)\n\n*caption*` output
interleaved them — **every caption rendered beside the next picture**, on 3 pages in 6 places
(`date-picker-message`, `twilio-content-template-message`, `constructing-messages`).

### Logged, not fixed — for the docs team

Prose is not edited under the standing rules. All of these are preserved verbatim.

- **The "laaunched" typo.** `source/README.md:32` → `src/content/docs/index.mdx:38`.
  "We have laaunched an AI Accelerator Program…". Still present; still not fixed.
- **12 `/broken/pages/` occurrences are 9 distinct broken links.** Measured: 12 raw textual
  occurrences in `source/`, of which 6 sit inside card-tables. But the card-table ones are
  each written twice — once as the row's link and once as the card target — so **README.md's
  card-table holds 3 distinct broken links, not 6**. Corpus-wide the real figure is **9
  distinct broken links**, and exactly 9 `href`s survive in the output, across 6 pages:
  `index.mdx` (3), `release-notes/release-notes` (2), `the-opendialog-workspace` (1),
  `conversational-patterns/recommendations` (1), `openai-interpreter` (1), `llm-actions` (1).
  The design spec's "6 of the 42 links are `/broken/pages/`" is wrong for the same
  double-counting reason as the card covers below. These 404 on the live site today and will
  404 after cutover, unchanged.
- **One raw `<a href>` points at an unrewritten relative page path.**
  `twilio-content-template-message.md:61` → output line 72 contains
  `<a href="button-message.md">Button Message</a>` inside a markdown table cell.
  `rewriteLinks` handles markdown link syntax and `{% … url= %}`, not raw HTML anchors, so it
  is preserved verbatim. It will not resolve: the published route is
  `/opendialog-platform/conversation-designer/message-design/message-types/button-message`
  with no extension, and **no URL in `reference/sitemap-pages.xml` ends in `.md`** — so this
  is broken on GitBook today too, not a migration regression. It is the **only** one: 13 raw
  `<a href>` survive in the output, and the other **12 are all bare in-page anchors** —
  `#h.t23f6ncuijwz` (7) and `#what-is-a-list-message` (5). **None is absolute or external.**
  (An earlier draft of this section said "absolute, external, or anchors"; that was wrong, and
  it matters, because a Phase 5 link check sized off it would go looking for a class of link
  that does not exist in the output.)
- **One source link escapes the repo root.**
  `source/core-concepts/contexts-and-attributes/secret-context.md:215-216` links to
  `../../../opendialog-platform/actions/webhook-action/` from a file two directories deep.
  Root-clamping resolves it to `/opendialog-platform/actions/webhook-action`, which is
  correct and is what GitBook itself does. Measured corpus-wide: **exactly one** such link
  (2 textual occurrences, the `url=` attribute and the inner link of a `{% content-ref %}`).
- **455 of 529 images in the output have an empty `alt`.** See correction #14 for the source-
  side groupings. Inventing alt text is a prose edit; Phase 5 checks alt coverage.
- **`{% code fullWidth="false" %}` is dropped**, with no Expressive Code equivalent. Verified:
  `developing-with-opendialog/webchat/sdk/custom-components.md:21` emits a bare
  ` ```typescript ` fence. There is a **second** `fullWidth="false"` the spec does not
  mention, on an `{% embed %}` at `address-autocomplete-message.md:79`; it is likewise
  dropped. Two occurrences corpus-wide, both dropped, neither with a target-format equivalent.
- **4 pages where the frontmatter title differs from the nav label, of which 3 are genuine.**
  Measured by comparing every generated `title` against its `route-map.json` nav label:
  `Adding a new topic of discussion` / `Add a new topic of discussion`;
  `Default interpreter` / `OpenDialog interpreter`;
  `Integrations introduction` / `Integrating with OpenDialog`. The spec's three, confirmed
  exactly. The fourth is not a divergence in substance: `SUMMARY.md:100` reads
  `[Best practices ]` with a **trailing space**, which propagates verbatim into the sidebar
  label while the H1 (whose `&#x20;` is now stripped) yields `Best practices`. Render-invisible
  in HTML. Logged so nobody re-measures this and reports 4 as a defect.
- **Both stray `.gitbook/assets/*.md` files** contain absolute image paths from a
  contributor's local machine (`/Users/elliotmassen/…`). Neither publishes. No action.

### Handoff to Phase 3 — assets

**Read this section before writing `assets.mjs`. Phase 3 deletes files.**

Baseline measured at this commit:

| | |
|---|---|
| Asset files in `source/.gitbook/assets` | 1,589 |
| Total size | 541 MiB (`du -sm`) |
| `/.gitbook/…` placeholder references in the generated output | **523** |
| Distinct assets those references point at | **500** |
| Pages carrying at least one | 115 |
| Assets with **no** reference in the generated output | **1,089** |

Of the 523 references, 522 are markdown images and 1 is a `{% file %}` link
(`DeliveryKnowledgeBase.csv`); a further 7 markdown images point at remote `https://` URLs and
must be left alone. `assets.mjs` must rewrite every one of the 523 and assert survivors to
**zero**.

**Trap 1 — 14 references carry a markdown backslash escape.** Fourteen of the 500 distinct
destinations contain `\_` rather than `_`, e.g.
`/.gitbook/assets/2023-05-04\_16-17-09 (1).png`. This is inherited verbatim from GitBook's own
source and is *correct*: CommonMark unescapes it, and the built HTML already emits
`src="/.gitbook/assets/2023-05-04_16-17-09%20(1).png"`. But a literal string comparison against
the filesystem fails for all 14. **After unescaping, all 500 referenced assets exist on disk;
before unescaping, 14 appear missing.** A rewriter that matches on raw text will silently skip
them, and an orphan check that does the same will wrongly mark those 14 files for deletion.

**Trap 2 — the card-cover exclusion list, which the spec gets wrong twice over.** The spec says
26 card-cover assets have no surviving reference and must be excluded from orphan deletion. 26
is a double-count: it counted each cover's `href` *and* its link text. The measured reference
count is **13**. Those 13 references point at only **10 distinct assets** (three are shared
between `message-design/README.md` and `message-editor.md`). And one of those 10 —
`Screenshot 2024-09-26 at 10.32.32.png` — **is still referenced** elsewhere, as an ordinary
figure on `monitoring-your-application`, so it is not an orphan at all.

**The actual exclusion list is these 9 assets. Phase 3 must not delete them:**

```
/.gitbook/assets/OD-basicmodel.png
/.gitbook/assets/applicationdesign.png
/.gitbook/assets/Screenshot 2024-09-26 at 10.38.51.png
/.gitbook/assets/Screenshot 2024-10-01 at 15.28.40.png
/.gitbook/assets/conditions (1).png
/.gitbook/assets/engineer-maintenancing-ai-systems-2023-11-27-05-12-07-utc.jpg
/.gitbook/assets/legoblocks.png
/.gitbook/assets/personalisation.png
/.gitbook/assets/usinglanguageservice.png
```

Their source card-tables: `scenarios/README.md` (OD-basicmodel, applicationdesign);
`language-services.md` (engineer-maintenancing…, usinglanguageservice);
`monitoring-your-application.md` (`Screenshot 2024-09-26 at 10.38.51.png` and
`Screenshot 2024-10-01 at 15.28.40.png` — note this table carries **three** Screenshot covers,
and the third, `Screenshot 2024-09-26 at 10.32.32.png`, is the one excluded above because it
is still referenced; do not identify these by "the Screenshots");
`message-design/README.md` and `message-editor.md` (legoblocks, conditions (1),
personalisation — shared). `source/README.md`'s card-table has a `data-card-cover` column that
is **empty**, which is where part of the spec's inflated figure came from.

**These 9 are the only assets that lose their reference during conversion.** Verified by
extracting every asset destination on both sides — `<img src>`, `<a href>`, markdown images and
links, and `{% file src %}` — reducing each to its basename and unescaping, then diffing the
two sets. The 204 source pages reference **509** distinct assets; the 204 generated pages
reference **500**; the difference is **exactly these 9**, with **0** assets gained. No image is
dropped by any other transform. Counts reconcile independently too: 436 `<img>` + 93
pre-existing markdown images in source = 529 markdown images in output.

**Trap 3 — the 25 MiB blocker is probably already solved, but verify before re-encoding.**

**Units matter in this subsection: Cloudflare's cap is 25 MiB (26,214,400 bytes), not 25 MB.**
Byte counts are given so no conversion is needed.

Exactly one asset exceeds the cap:
`OpenDialog - Preview - Google Chrome 2021-12-09 09-03-23.gif`, at **28,637,283 B = 27.31
MiB**. It is **referenced by nothing** — not by the generated output and **not by any source
`.md` file either** — so it is a genuine pre-existing orphan rather than something conversion
lost. If Phase 3 deletes orphans before deploying, the deployment blocker disappears without an
encode.

Two other GIFs sit just under the cap:

| File | Bytes | MiB | Referenced? |
|---|---|---|---|
| `OpenDialog - Preview - … 09-03-23.gif` | 28,637,283 | 27.31 | no — orphan, **over the cap** |
| `Knowledge Base Demo.gif` | 23,654,022 | 22.56 | **yes** — this is the one that ships |
| `Tutorial Demo.gif` | 23,615,825 | 22.52 | no — orphan |

`Knowledge Base Demo.gif` is the one worth re-encoding: for weight, not for the cap.

**Trap 4 — one page is one GitBook edit away from failing the conversion run.**
`opendialog-platform/actions/webhook-action/using-jmespath-expressions.md` holds three bare,
attribute-less, multi-line `<pre><code>` blocks inside table cells (the "Output:" results).
`unwrapPreCode` deliberately **throws** on that shape rather than rewriting it, because
rewriting would insert a blank line inside a `<td>`, terminate the cell's HTML block early and
corrupt the table silently past a green build. The page is safe today only because it emits as
`.md`, so `unwrapPreCode` is never called on it. **If a later GitBook sync adds a video embed
or a `{% content-ref %}` to that page, it promotes to `.mdx` and `convert.mjs` will abort.**

That is the intended behaviour — loud failure on a re-runnable script beats silent table
corruption — but it is an operational risk on a script that runs against fresh syncs right up
to cutover day, so it should not be a surprise on the morning it happens. The reasoning is
preserved in the JSDoc at `scripts/lib/mdx.mjs:66-79`. Fixing it properly means teaching
`unwrapPreCode` to handle a `<pre>` inside a table cell, which nobody has needed yet.

**`ffmpeg` is now installed** — version 8.1.2, at `/opt/homebrew/bin/ffmpeg`. This supersedes
the "Phase 3 dependency missing" entry earlier in this file, which is now stale.

**Trap 5 — the heaviest excluded asset has a byte-identical twin, and only one of them is on
the exclusion list.** `source/.gitbook/assets/` holds **two** files of exactly **18,022,046 B
= 17.19 MiB**, with the same SHA-256 (`f9d9175d…`):

| File | Referenced in source | Referenced in output | Phase 3 action |
|---|---|---|---|
| `engineer-maintenancing-ai-systems-2023-11-27-05-12-07-utc.jpg` | yes — the `language-services.md` card cover | none | **exclusion list — keep** |
| `engineer-maintenancing-ai-systems-2023-11-27-05-12-07-utc (1).jpg` | **none** | none | ordinary orphan — **delete** |

Only the un-suffixed file is a card cover. The ` (1)` copy is referenced by nothing anywhere,
in source or output, so it is an ordinary orphan and deleting it is correct — it reclaims
17.19 MiB and loses nothing. Stated explicitly so Phase 3 does not discover a near-duplicate
17.19 MiB file mid-deletion and have to stop and work out which one matters.

Keeping the one that is excluded costs **17.19 MiB for an image nothing currently displays**.
That is a deliberate trade — Phase 4 may restore card covers — but it should be a conscious
one, not an accident. If Phase 4 decides against restoring covers, this is the first asset to
drop.

**The duplication is not isolated.** Hashing the whole library finds **158 groups of
byte-identical files, holding 169 redundant copies totalling 58,190,126 B = 55.49 MiB** — about
10% of the 541 MiB. GitBook's ` (1)`/` (2)` re-upload suffixes are the visible symptom. Most
of this is inside the 1,089 orphans and disappears with them, but Phase 3 should not be
surprised to find duplicates *among the assets it keeps*, and de-duplicating survivors is a
cheap win if the numbers justify it.

### Handoff to Phase 4 — look and feel

**Sidebar groups are not linkable.** Confirmed by reading
`node_modules/@astrojs/starlight/schemas/sidebar.ts`, not the published guide:
`SidebarGroupSchema` is `label` / `translations` / `badge` / `collapsed`, with
`attrs: z.never()`. There is no `link` field. 41 `SUMMARY.md` entries are both a page and a
parent, so each becomes a group whose first item is the parent page repeating the same label.
That is 204 pages + 41 repeated parents = 245 nav entries. GitBook's behaviour — one clickable
row that expands — needs a `Sidebar` component override.

**Image wrapper divs: a real layout regression, and the open question is now settled.** The
Task 11 ledger left it unresolved whether GitBook lays bare wrapper `<div>`s out side by side
or stacks them, because the earlier attempt inferred layout from HTML shape rather than
measuring it. **Measured directly in a real browser against the live site, twice, with
`getBoundingClientRect()`:**

- `/opendialog-platform/actions/webhook-action` — both bare wrapper divs render **side by
  side**. The pair from `README.md:11` renders at the same `y`, at widths 188 and 375, matching
  the source `width=` attributes to the pixel. The pair from `README.md:154` likewise, at width
  374 and its unsized sibling.
- `/opendialog-platform/conversation-designer/message-design/message-types/date-picker-message`
  — the bare div's **four** images render as one row of four, all at the same `y`. These are the
  one case that does **not** match its `width=` to the pixel: the source says `width="188"` and
  they render at **187.25**, because four of them plus gaps exceed the content width and the
  row constrains them. The `align="center" data-full-width="true"` div's two images render side
  by side *and* centered, at their stated 207.

So of the five distinct widths measured, four (188, 375, 374, 207) match the source attribute
exactly and one (188 → 187.25) is constrained by the available row width. The side-by-side
conclusion does not depend on the difference.

So GitBook lays out **every** wrapper div's figures side by side, attributed or not — the
question was framed too narrowly. Starlight stacks them, because
`node_modules/@astrojs/starlight/style/markdown.css:75-78` sets `display: block` on
`.sl-markdown-content :is(img, picture, video, canvas, svg, iframe)`.

**Scope: 13 wrapper divs across 9 pages, covering 31 images, currently stack where the live
site puts them in a row.** The other 6 of the 19 wrapper divs hold a single figure and are
unaffected. Affected pages:

```
/core-concepts/the-opendialog-workspace/scenarios/turns-and-intents
/opendialog-platform/actions/webhook-action
/opendialog-platform/conversation-designer/conversation-design
/opendialog-platform/conversation-designer/message-design/constructing-messages
/opendialog-platform/conversation-designer/message-design/message-types/date-picker-message
/opendialog-platform/conversation-designer/message-design/message-types/e-sign-message
/opendialog-platform/conversation-designer/message-design/message-types/location-message
/opendialog-platform/conversation-designer/message-design/message-types/twilio-content-template-message
/release-notes/release-notes
```

This is a genuine regression against the live site, not a pre-existing gap as previously
assumed. The wrapper `<div>` and its attributes do survive into the output, so a CSS rule
scoped to that wrapper is the obvious lever and no conversion change is needed for the
side-by-side part.

But note a second loss that a CSS fix alone will not restore: GitBook sizes these images with
a per-`<img>` `width` attribute (188, 375, 374, 207, 187 in the cases measured above), and that
attribute is discarded when `<figure><img …>` becomes `![]()`. Markdown has nowhere to put it.
So restoring the row also means deciding how the images are sized — equal fractions of the
grid, or re-introducing explicit widths, which would mean carrying them through conversion.
Whoever picks this up should decide that before writing CSS.

**`{% columns %}` emits raw content directly inside `<CardGrid>`** with no per-column `<Card>`
wrapper. The design spec explicitly sanctions this ("its children need not be `<Card>`
elements") but **how it renders is unreviewed.** The single instance, in
`webhook-action/index.mdx:77-95`, puts a `:white_check_mark: Do` line, a JSON fence, a
`:x: Don't` line and a second fence directly inside the grid. `<CardGrid>` is a CSS grid, so
each top-level child is likely to become its own cell — meaning a label could be separated
from the fence it introduces. Look at this one page specifically.

**Card-cover images have no slot.** `<LinkCard>` has no image slot, so the **13** cover
references — pointing at **10** distinct assets, of which **9** are orphaned by conversion and
listed above — render as plain cards. A visual gap against the live site. Keep the 13/10/9
chain intact when quoting it: collapsing the three into one number is exactly the mistake that
produced the spec's phantom 26.

**`<figure>` semantics are lost.** Markdown has no `<figcaption>`; captions emit as a
`*italic*` paragraph under the image. 101 of 430 figures have an empty caption and emit the
image alone. Restoring `<figure>`/`<figcaption>` via a rehype plugin is a Phase 4 call.

**`progress-bar-message` takes two markup changes inside its `<pre>`, and was flagged to Pat
for a decision.** `unwrapPreCode` makes the block MDX-parseable, and it does two things:

1. **It drops the redundant `<code>` element**, keeping only `<pre>`. Any CSS or accessibility
   tooling keyed on `pre code` rather than bare `pre` no longer matches this one block.
2. **It joins a `<strong>` that spanned a line break.**
   `source/…/meta-messages/progress-bar-message.md:47-48` reads
   `<strong>&#x3C;/meta-message>`, newline, `</strong>`; the output at
   `…/progress-bar-message/index.mdx:52` reads `<strong>&#x3C;/meta-message></strong>` on one
   line. This is deliberate — `scripts/lib/mdx.mjs:97` trims trailing newlines inside a
   `<strong>` and throws if more than one content line remains — but it is a second textual
   change, not a side effect of the first.

An earlier draft of this section claimed the ignored-newline behaviour was "the only textual
change". **That was wrong**, and it is corrected here. Whitespace is significant inside
`<pre>`, so "render-invisible" is a conclusion worth re-checking rather than inheriting: the
`<code>` drop is render-invisible under the HTML spec (browsers ignore exactly one newline
immediately after a `<pre>` start tag), but the `<strong>` line-join removes a newline in the
middle of preformatted content.

**This was escalated to Pat by name during execution and no decision was recorded.** It is a
markup change to documentation content, which the standing rules otherwise forbid. Recorded
here because it is the last point at which the execution ledger still exists.

**The 2 non-video embeds render as bare markdown links.** `fetchify.com` in
`address-autocomplete-message` and `webaim.org` in `designing-accessible-chatbots` emit as
`[url](url)`, showing the raw URL as link text. GitBook renders `{% embed %}` for a non-video
as a bookmark card. Cosmetic, on 2 pages.

**All 17 uncaptioned embeds share the iframe title "Embedded video."** Harmless at one embed
per page; worth revisiting in the Phase 5 accessibility pass.

### Handoff to Phase 5 — verification

- **Alt-text coverage:** 455 of 529 output images have an empty `alt`.
- **Raw `<a href>` links:** 13 survive in the output — **1** relative page path and **12** bare
  in-page anchors (`#h.t23f6ncuijwz` ×7, `#what-is-a-list-message` ×5). None is absolute or
  external. The one relative path, `button-message.md` in `twilio-content-template-message`,
  does not resolve and is broken on GitBook today too; it is detailed above. The Phase 5 link
  check must cover raw HTML anchors, not just markdown links, or it will miss this class
  entirely — and note the 12 in-page anchors need checking against the *rendered heading slugs*,
  which ties into the anchor-parity item below.
- **Anchors are preserved verbatim.** GitBook and Starlight slugify headings the same way for
  these pages, but that was assumed, not verified. Anchor correctness is a Phase 5 concern.
- **Alt-text and caption fragility.** An `alt` containing `]` or a caption containing `*`
  would break the emitted markdown, because both are written into markdown syntax positions
  without escaping. Measured: **0 occurrences of either today**, so this is latent, not a bug.
  A future prose edit in GitBook could introduce one. Worth a note to the docs team.
- **The `{% code %}` `title=` and `lineNumbers=` attributes** map to Expressive Code's
  `title="x"` and `showLineNumbers`. 7 blocks; hand-checkable.
- **15 stepper steps across 3 `<Steps>` blocks** (4 + 4 in `secret-context`, 7 in
  `ai-agent-creation-overview`) and the single `{% columns %}` block were specified as
  hand-checked at the gate. The counts are asserted; the *rendering* is not.

### Deferred minor findings

Recorded so they are not rediscovered as new. None is reachable on today's corpus.

- `frontmatter.mjs`: an empty folded scalar parses to `""` rather than throwing; `unquote()`
  strips matching first/last quote chars even when they are not YAML quoting; `takeTitle`
  protects fenced code but not raw HTML blocks.
- `links.mjs`: `decodeURIComponent()` would throw a raw `URIError` on a malformed `%` sequence,
  losing the source/target naming that resolution failures are supposed to carry.
- `gitbook-blocks.mjs`: `convertCode`'s regex tolerates a closing fence longer than the opening
  one; `isVideoEmbed`'s shape check rejects a trailing slash, so a legitimate `youtu.be/<id>/`
  would downgrade to an autolink; the `youtube.com/watch` branch of `embedSrc` is dead code
  (all 17 YouTube URLs are `youtu.be` short form); `isVideoEmbed` and `embedSrc` encode the
  same shape knowledge in two files with only a JSDoc cross-reference.
- `link-cards.mjs`: `isPureAnchor`'s greedy match would treat two concatenated anchors in one
  cell as a single pure anchor; `rows()`/`cells()` would mis-split a nested `<td>`. Both are
  accepted consequences of the no-HTML-parser constraint.
- `mdx.mjs`: the quote-aware alternation admits a theoretical residual — an attribute value
  with an odd number of unescaped `"` could pair with a later unrelated quote. Proved
  structurally unreachable rather than merely absent: every title-emitting path escapes `"` to
  `&quot;` before writing into an attribute. The residual risk is a future raw-HTML block from
  GitBook that does not route through that helper. Also `styleObject` wraps a CSS value in
  single quotes without checking for existing ones; all 131 corpus values are `color:<name>`.
- `figures.mjs`: `assetPath` matches `.gitbook/assets/` as a substring anywhere in the `src`
  rather than anchored to the path start. `IMAGE_DIV_CONTENT`'s `*` quantifier accepts empty
  content, so a `<div id="x"></div>` outside a fence is silently deleted rather than throwing —
  `webchat/sdk/README.md:27` is exactly that shape and is saved only by sitting inside a fence.
  The same regex's nested quantifiers backtrack exponentially on the throwing path (8/12/16/20
  figures measured at 0/0/1/18 ms), which makes the loud-failure path the slow one.
- `convert.mjs`: `JSX_ATTRS`/`JSX_TAG` duplicate and diverge from `mdx.mjs`'s versions while a
  comment claims they mirror it; `filter(line => !line.startsWith('import '))` would also drop
  a prose line beginning "import " (none exist across the 46 `.mdx` files);
  `stats.images`/`embeds`/`cardGrids`/`steps` count over the whole output including fenced
  code, unlike the `surviving*` counters, so a future fenced `![` would inflate the figure and
  read as a pass.
- `sidebar-tree.mjs`: tests exercise only depths 0/2/4 while the real `SUMMARY.md` nests to
  depth 8; no test covers a section boundary occurring mid-nesting with a non-empty stack.

#### Test-coverage gaps

Behaviour verified by hand or by corpus run, but not locked in by a test. Several of these
originate in the plan's own reference tests rather than in the implementation.

- `frontmatter.mjs`: no test for a double-quoted scalar, nor for a `description` that needs
  quoting — the shared `scalar()` path is covered from the title angle only.
- `links.mjs`: no test for an empty destination `[a]()`, a destination containing a newline, an
  unclosed angle-bracket form, or a `mailto:` containing `)`. All four were traced by hand and
  behave correctly.
- `gitbook-blocks.mjs`: no test for a truly empty `{% step %}` body (it would emit `"N. "` with
  a trailing space); `isVideoEmbed`'s hostname-suffix rejection (`notyoutube.com`,
  `evil-loom.com`, `youtube.com.evil.com`) was verified functionally but is not codified.
- `figures.mjs`: absent from the corpus and therefore untested by construction — no `<figure>`
  carries attributes, no self-closing `<img/>` exists, and no `<figure>` block spans lines.
- `sidebar.mjs`: the `count()`/`countItems()` diagnostic fix (see below) has no dedicated test.
  This is consistent with project convention — only `scripts/lib/*.mjs` have companion tests,
  and top-level `scripts/*.mjs` are untested directly — but it is new logic beyond the draft.

#### Style and consistency

- `convert.mjs`: four lines exceed 100 characters (longest 126), mostly inherited from the
  plan's draft.
- `mdx.mjs`: `unwrapPreCode`'s manual cursor/`matchAll` accumulation is more verbose than
  needed — `String.replace`'s callback already receives the match offset.
- `gitbook-blocks.mjs`: the `/^[ \t]*\{%\s*…\s*%\}[ \t]*$/` marker pattern is repeated across
  `convertSteppers`, `convertColumns`, `convertFile` and `convertHints` — about 5 call sites. A
  shared helper is arguably not worth the indirection.
- `renderEmbed`'s `<url>` → `[url](url)` change is broader than the MDX problem required. The
  MDX parser only chokes on a bare autolink in `.mdx`, but the change applies to both, so
  `webaim.org` in `designing-accessible-chatbots` — a `.md` page where the autolink was fine —
  is also rewritten. Render-identical, and it matches the source's own convention, but Task 6's
  reviewed-clean form was changed for another page's benefit.

#### A defect in the plan's draft worth remembering

`sidebar.mjs`'s draft `count()` helper counted only leaf entries, so it reported 204 nav
entries where the brief itself expected 245. The counter was fixed, not the expectation, after
confirming 41 parent entries exist in `SUMMARY.md`. Diagnostic-only — `buildSidebar`, the
generated file and the `entries.length !== 204` gate were untouched. This was the tenth defect
found in the plan's draft code, and it is the cleanest example of the rule that held throughout:
**when a count diverges, fix the counter or the code, never the expectation.**

### Open items for Pat

Checked at this commit:

- **"Builds for non-production branches" is still to be disabled** (Cloudflare → Settings →
  Build → Branch control). Not verifiable from here — no Cloudflare read was performed. While
  it is on, every GitBook sync to `documentation` fires a build that fails at `npm ci`.
- **`ffmpeg` is installed** (8.1.2). The Phase 3 blocker is cleared. See the caveat above:
  the one oversized file may not need encoding at all.
- **PR #16** (branch-control docs correction) is still **open** and safe to merge.
- **PR #14** (dependabot, `sharp` 0.34.5 → 0.35.3) is still **open**; it should wait for
  Phase 3 where it can be tested against a real encode.
- **PR #12** (analytics docs) is still **open**; it arrives via the `documentation` sync at the
  next conversion run.
- **The branch is not pushed and no PR is open for it.** Phase 2 stops at the commit.

### Corrections to earlier entries in this file

This file is append-only, so those entries stand as written. Where they are now known to be
wrong:

- The **"Phase 3 dependency missing"** entry says `ffmpeg` is not installed. It now is.
- The **"Two conversion cases missing from the brief"** entry says "12 occurrences across 6
  files" of `/broken/pages/` and that "the homepage card-table has three of them". Both are
  right as written — 12 raw occurrences, 3 distinct links on the homepage — but the count of
  *distinct broken links* corpus-wide is **9**, which that entry does not state. The design
  spec's separate "6 of the 42 links" figure is wrong.
- The **"`<LinkCard>` retained"** entry measures the MDX brace risk at "one line in the whole
  set" against the 11-file `.mdx` candidate set of the time. With the set now at 46 files the
  figure is **14 lines across 6 files**. The entry's conclusion — keep `<LinkCard>`, escape
  braces as output encoding — is unchanged and was correct.
