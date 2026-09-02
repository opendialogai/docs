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

## 2026-07-29 — Workers Builds branch control: no per-branch exclusions exist

Correcting earlier guidance in this file and in PR #13, which said to exclude
`documentation`, `3.9` and `release/*` from build triggers. **That capability does not
exist.** Workers Builds' branch control (Overview -> Worker -> Settings -> Build -> Branch
control) offers only two things: a production-branch dropdown, and a single all-or-nothing
checkbox, "Builds for non-production branches".

Non-production builds are currently **enabled**. Evidence: two pushes to
`fix/ci-lockfile-npm-version` each produced a `versions upload` with no deployment, matching
the documented non-production deploy command.

| Commit pushed | Version uploaded |
|---|---|
| `af08648` 12:11:56Z | 12:12:28Z |
| `a2772eb` 12:15:40Z | 12:16:20Z |

So the `documentation` problem is live. Every GitBook sync to that branch triggers a build
that fails at `npm ci`, because the branch has no `package.json`. There is no clean
mitigation: the failure happens at the install step before any command we control runs, and
a `package.json` cannot be added to `documentation` — it is GitBook's, read-only, and writing
to it corrupts the live site.

**Recommendation: disable non-production branch builds.** The reason is alarm fatigue rather
than noise as such — if `documentation` fails several times a day, a real failure on `main`
is lost in the stream. Preview URLs would be convenient for the Phase 4 look-and-feel review,
but are not required: `scripts/screenshots.mjs` points at a local dev server just as well as
at a preview URL. Re-enable for that stretch if it earns its keep.

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
  a prose line beginning "import " (none exist across the 46 `.mdx` files); `stats.images`/
  `embeds`/`cardGrids`/`steps` count over the whole output text, unlike the `surviving*`
  counters, which use `countInProse` to look only outside fenced code — originally written here
  as "a future fenced `![` would inflate the figure and read as a pass", with no drift today.
  **Correction, made necessary by the 2026-07-30 whole-branch review (see below): there was
  drift today, for a different reason than the one named.** `countInProse`'s fence mask does
  not cover *indented* code either, and before that review's figure-caption-indentation fix,
  2 of the 529 counted images sat inside an indented CommonMark code block and did not render
  as an `<img>` at all — `images: 529` never distinguished "a `![` is somewhere in the text"
  from "an image is on the page". Fixed; see below.
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

---

## 2026-07-30 — Final whole-branch review: fixes

The final whole-branch review before push found 1 critical and 4 important findings. All are
fixed here. Three further findings, triaged by that review as needing to survive the deletion
of `.superpowers/sdd/2026-07-29-phase-2-conversion-script/progress.md` (git-ignored scratch,
gone at merge), are recorded below instead of fixed — none is reachable on today's corpus.

### CRITICAL — `figures.mjs` emitted a figure caption at column 0, breaking any list it sat in

`convertFigures` replaces `<figure>` markup in place, so a captioned figure's `<img>` inherits
the indentation of the line it sits on, but the caption line it appends — `\n\n*caption*` — did
not. Two of the 430 figures sit indented inside a list item:
`troubleshooting-interpreters.md:13` (8 spaces) and `about-attributes.md:53` (6 spaces). In both,
the column-0 caption line closed the enclosing (nested) `<ul>` early. On
`troubleshooting-interpreters`, that turned the following 8-space bullet and its two 12-space
images into a CommonMark **indented code block**: the text `![](...)` for two images was still
present in the generated `.md`, so `images: 529` did not move, but neither image rendered as an
`<img>` on the built page — they showed as literal source inside
`<pre data-language="plaintext">`. On `about-attributes`, the caption detached to a top-level
`<p>` after the list closed, no longer paired with its image.

**Why no invariant caught it.** `stats.images` counts `![` anywhere in the output text
(`scripts/convert.mjs:188`); `survivingBlocks` and the other `surviving*` counters mask fenced
code (via `countInProse`) but not *indented* code. Nothing in the pipeline distinguishes "text
that reads as a markdown image" from "text CommonMark actually renders as one". `astro build`
stayed green throughout, because an indented code block is entirely valid HTML — it is just not
the two screenshots the page is supposed to show.

**Live-site check, before committing to a fix.** Rather than assume the caption should be
indented into the list, both live pages were checked directly in a browser
(`docs.opendialog.ai`), since `reference/` holds only `llms.txt` and the two sitemaps — no HTML
snapshot exists to settle this offline. On both
`/opendialog-platform/interpreters-and-natural-language-understanding/interpreters/troubleshooting-interpreters`
and `/core-concepts/contexts-and-attributes/about-attributes`, walking up the DOM from the
caption's text node lands on `FIGCAPTION -> ... -> LI -> UL -> LI -> UL`: GitBook nests the
caption inside the enclosing list item on both pages. Indenting the caption into the list, as
the review proposed, matches the live site; it was not a guess.

**Fix.** `convertFigures`'s `FIGURE` replacer now takes the match offset (available from
`String.replace`'s callback) and looks backward to the start of that line in the full text. If
everything between the line start and the match is whitespace, that whitespace is used as the
indent prefixed to the caption line; otherwise the indent is empty, matching every other figure
in the corpus (`scripts/lib/figures.mjs`). A regression test asserts an indented figure yields an
equally indented caption (`scripts/lib/figures.test.mjs`) — every prior case in that file sat at
column 0, which is exactly why this survived every previous review.

**`reflowImageDiv` is unaffected.** It always places a `<figure>` at column 0 inside its wrapper
`<div>` (blank-line-separated, per its own JSDoc), and no image-wrapper `<div>` in the corpus is
itself indented (`grep -rn '^[ \t]\+<div' source/` finds two indented `<div>` lines, both inside
code fences in unrelated pages, neither an image wrapper). Re-running the full pipeline confirms
this: exactly the two expected generated files change
(`src/content/docs/opendialog-platform/interpreters-and-natural-language-understanding/interpreters/troubleshooting-interpreters/index.md`
and `src/content/docs/core-concepts/contexts-and-attributes/about-attributes/index.mdx`), each by
one line — the caption gaining its list's indentation — and every page carrying a wrapper `<div>`
is byte-identical to before.

**Verified in the rendered output, not just the source.** After `npx astro build`:
`troubleshooting-interpreters/index.html` no longer contains a
`<pre data-language="plaintext">` holding markdown, and its `<img>` count (excluding the site
logo) is 6, matching the 6 `![` in the generated `.md` — before the fix these were 5 and 6. The
caption renders as an `<em>` paragraph nested inside the same `<li>`/`<ul>` as its image, matching
the live-site DOM shape measured above. `about-attributes/index.html` shows the same: 3 rendered
`<img>` matching 3 `![` in the generated `.mdx`, caption nested correctly.

All 13 invariants still pass at their existing values (`images: 529` — the count itself does not
move, since the same two `![` are still in the text; what changes is that they now actually
render). Route parity, page count and nav-entry count are unchanged. The full pipeline
(`routes.mjs` → `convert.mjs` → `sidebar.mjs`) re-run twice leaves `git status --short` empty.

### IMPORTANT — `convertContentRefs` no longer silently deletes the rest of a file on an
unterminated block

`url` was set on `{% content-ref %}`'s opening marker and cleared only by
`{% endcontent-ref %}`; every line while it was set returned `[]`, with no check that the block
had actually closed by end of input. An unterminated block silently discarded everything after
it, no throw, no warning — the exact failure mode commit `af32c13` hardened `convertSteppers`
against, and until now the only block transform in `gitbook-blocks.mjs`/`link-cards.mjs` still
degrading this way. The `contentRefCards: 51` invariant was only a partial backstop: a sync that
adds one content-ref and malforms another still reconciles to 51 and passes green with a page
tail deleted.

**Fix.** `convertContentRefs` now throws if `url` is still non-null after the line pass (an
unterminated block), and throws on an inner line that is neither blank nor a bare
`[text](target)` markdown link — the shape all 51 corpus content-refs hold today
(`scripts/lib/link-cards.mjs`). Both are tested: one input ends mid-block with no
`{% endcontent-ref %}` at all, the other includes a non-link inner line
(`scripts/lib/link-cards.test.mjs`). All 51 real content-refs remain well-formed, so neither
throw fires on the corpus; `contentRefCards: 51` is unchanged.

### IMPORTANT — `convertCardTables` and `countDroppedCovers` now run under `protectCode`

Both operated on raw text, bypassing the module's two code-safety primitives with no stated
reason — `segments.mjs`'s header calls `mapLines`/`protectCode` "the foundation rather than a
convenience", and every other transform in this pipeline is built on one of them (`convertCode`
in `gitbook-blocks.mjs` is the sole other exception, and it carries a JSDoc explaining why it is
safe to skip). A ` ```html ` fence containing a `<table data-view="cards">` had its contents
rewritten into `<CardGrid>`/`<Card>` markup, corrupting the code sample. Zero card tables sit
inside a fence in today's 208 files, so this was latent, not observed.

**Fix.** Both now run their existing logic inside `protectCode`, with a one-line JSDoc note
explaining why it is safe (card tables never contain fences, so nothing but the fenced-code
exclusion changes). Two tests added: a card-table shown as an `html` code sample inside a fence
is left as literal text by both `convertCardTables` and `countDroppedCovers`
(`scripts/lib/link-cards.test.mjs`). Re-running the full pipeline confirms zero generated files
changed as a result of this fix — every card-table page is byte-identical to before, since no
real card table sits inside a fence.

### IMPORTANT — six inline links in card-table descriptions flatten to plain text (accepted, not fixed)

`plainText()` (`link-cards.mjs`) strips all tags when building a `LinkCard`/`Card` title or
description. Starlight's `LinkCard` takes `description` as a plain string, so there is nowhere to
put a link — this is an accepted limitation of the target component, not a code bug, and the code
is unchanged. Six `<a href>` links disappear this way, all inside the same card-table shape
repeated on two pages:
`opendialog-platform/conversation-designer/message-design/message-editor.md` and
`opendialog-platform/conversation-designer/message-design/README.md`, each linking `message
types` to `message-types/`, `conditions` to `message-conditions.md` and `attribute` to
`using-attributes-in-messages.md` from inside a card's description prose. Verified in the output:
`src/content/docs/.../message-design/message-editor/index.mdx` renders
`description="…to their fullest potential."` with the `message types` link gone. Logged here as
this file is the register for exactly this kind of deviation and has recorded smaller ones.

### `package.json` gains a `convert` script; `CLAUDE.md`'s command list corrected

There was no single command tying `routes.mjs`, `convert.mjs` and `sidebar.mjs` together —
`CLAUDE.md`'s Commands section listed them as separate manual steps, and `convert.mjs` itself
iterates `route-map.json`, not `source/`. Run alone against a sync that **adds** a page, a stale
`route-map.json` means the new page is never read: `files` stays at 204, every other counter is
unchanged, and the run is green with a page silently missing. (A *deleted* page throws `ENOENT`,
so only additions are silent this way.)

`package.json` now has `"convert": "node scripts/routes.mjs && node scripts/convert.mjs && node
scripts/sidebar.mjs"`. `CLAUDE.md`'s Commands section is updated to `npm run convert` and a note
that running `convert.mjs` alone is unsafe against a page addition. Separately, that section
documented `node scripts/verify-routes.mjs`, which does not exist — `routes.mjs` performs the
sitemap-parity check itself and writes `route-map.json`; both the Commands list and the
"Definition of done" line at the bottom of `CLAUDE.md` are corrected to name `routes.mjs`.

### Three findings that must survive the ledger's deletion

The final review's triage of `progress.md` (git-ignored, deleted at merge) judged these three
must be recorded here. None is reachable on today's corpus.

- **`isVideoEmbed` (`gitbook-blocks.mjs`) and `embedSrc` (`Embed.astro`) encode the same
  embeddable-URL-shape knowledge in two files**, guarded only by a JSDoc cross-reference in each
  direction — there is no shared constant. They currently agree on all four shapes handled
  (`youtu.be/<id>`, `youtube.com/watch?v=<id>`, `loom.com/share/<id>`, and rejection of everything
  else), including `?si=`/`?sid=` query-string handling. Adding a fifth shape — a YouTube
  `/live/` URL, say — requires a human to update both files; nothing enforces that they stay in
  sync.
- **`styleObject` (`mdx.mjs`) wraps a CSS declaration's value in single quotes without escaping
  any quote characters already in it.** All 131 `<mark style>` values in today's corpus are
  `color:<name>`, so this never fires. A routine docs-team edit — `font-family: 'Times New
  Roman'` inside a `<mark style="...">` — would emit a JSX string literal containing an
  unescaped `'`, a malformed-JSX build failure rather than a throw at conversion time, the
  opposite of this project's loud-failure house style.
- **An `alt` attribute containing `]`, or a figure caption containing `*`, breaks the emitted
  markdown**, because both are written into markdown syntax positions (`![alt](src)`,
  `*caption*`) without escaping. Measured: zero occurrences of either today, across all 430
  figures and 6 bare `<img>` tags — this is latent, not a bug reachable on the current corpus.
  A future prose edit in GitBook could introduce one. This is a caution for the docs team, not a
  code change, and belongs beside the other docs-team cautions logged in the "Phase 2 gate"
  section above.

### Minor, not fixed — the same indent-loss shape as the critical, elsewhere

`convertHints`, `convertFile`, `convertColumns` and `convertContentRefs` (`gitbook-blocks.mjs`,
`link-cards.mjs`) all match `^[ \t]*` on their opening/closing markers via `mapLines` and emit
their replacement line(s) at column 0, the same root cause as the critical above. Zero indented
`{%` markers exist anywhere in the 208-file corpus today, so none of the four fires. Not fixed:
each is a line-for-line `mapLines` replacement rather than a multi-line regex match against
offsets, so the fix would not reuse the technique used for `figures.mjs` above, and nothing in
today's corpus needs it.

### `.gitignore` gains `.playwright-mcp/`

The Playwright MCP server used for the live-site check above writes a `.playwright-mcp/`
directory into the repository working directory. It has appeared and been manually removed twice
before during this branch's reviews (recorded in the ledger, now gone). One line prevents an
accidental commit of browser artifacts; the directory created during this review's own live-site
check was deleted before committing.

### Verification run at this commit

```
node scripts/routes.mjs && node scripts/convert.mjs && node scripts/sidebar.mjs
```
204 derived / 204 live / 0 unreachable / 0 invented; all 13 invariants `ok`; 204 pages; 6
sections, 245 nav entries. `npx astro build` succeeds, 205 pages (204 + `404.html`). Full test
suite: 147/147 (142 plus 5 new — 1 in `figures.test.mjs`, 4 in `link-cards.test.mjs`). Pipeline
re-run twice leaves `git status --short` empty except for the intentional source/test changes
themselves. Exactly two files under `src/content/docs/` changed as a result of the critical fix;
zero changed as a result of the `protectCode` or `convertContentRefs` fixes.

---

## 2026-07-30 — Phase 3 gate: assets complete

Every image on the built site resolves. `scripts/assets.mjs` copies, slugifies and re-encodes
the 500 referenced GitBook assets into `src/assets/` and `public/`; `convert.mjs` emits their
real paths from `asset-map.json`. Before this phase every image 404'd.

**Every figure below was re-measured at this commit**, from a fresh `npm run convert` +
`npx astro build`, not transcribed from the design spec, the plan, or the per-task ledger. Where
a figure could only be sourced from the (git-ignored, soon-deleted) task ledger — the pre-encode
byte count and the historical ffmpeg-flag proof — that is stated explicitly rather than presented
as newly measured.

### Gate evidence

| Check | Result |
|---|---|
| `npm run convert` | `routes.mjs`, `assets.mjs`, `convert.mjs`, `sidebar.mjs` all `ok`/green |
| `npx astro build` | succeeds, 205 pages (204 + `404.html`), 496 optimised image variants |
| `npm test` | 187/187 pass |
| On-disk reference resolution (corrected check, see Override 1 below) | 523 checked, **0 broken** |
| Built-site placeholder scan (`src="/.gitbook/assets/…"` in `dist`) | **0** occurrences |
| `_astro`-referencing HTML files in `dist` | 205 of 205 |
| `src/assets` size (byte sum, the gate) | 33,591,322 B = 32.0 MiB against 60,000,000 |
| `src/assets` size (`du -sh`, allocated blocks) | 33M (`du -sm`: 34) |
| `public` size (`du -sh`, allocated blocks) | 2.0M (`du -sm`: 3) |
| `public` size (byte sum, all three tracked files) | 1,195,546 B = 1.14 MiB |
| Largest file, any destination | 1,179,445 B = 1.12 MiB (the MP4), under the 25 MiB cap |
| `find src/assets public -type f -size +25000k` | empty |
| `git status` after the whole pipeline re-run twice | clean |

**`du` and the byte sum disagree, and the gate is defined on the byte sum.** `du` reports
allocated disk blocks; with ~500 small files the block overhead is real. Both numbers stay far
under the 60 MB gate, so this is a reading-the-number caution, not a risk: use the byte sum
(`33,591,322 B`) as the authoritative figure, `du -sh`'s `33M` as a sanity check only.

**`public`'s byte sum includes `favicon.png`, which this phase does not manage.** `du -sh public`
reads `2.0M`; the true byte sum of everything `find public -type f` walks is `1,195,546 B`:
`public/favicon.png` (15,074 B, tracked since `c31854d`, Phase 1's brand asset) +
`public/files/deliveryknowledgebase.csv` (1,027 B) +
`public/media/knowledge-base-demo.mp4` (1,179,445 B). This phase's own contribution — the CSV
and the MP4 — is `1,180,472 B`, matching the "Files in `public/media`: 1" / "Files in
`public/files`: 1" figures below.

### Override 1 — the brief's Step 2 check was blind to the corpus's one `public/files/` reference

The brief's on-disk proof matched only the double-quoted attribute form,
`/"\/(media|files)\/([^"]+)"/g`. The corpus's single `public/files/` reference is emitted as a
**markdown link** — `[DeliveryKnowledgeBase.csv](/files/deliveryknowledgebase.csv)` — which has
no quotes, so that check could not see the one reference it most needed to prove. Extended here
to also scan the markdown-link delimiter shape (`](…)`, with optional angle brackets) for both
`/media/` and `/files/`, matching what `convert.mjs`'s own on-disk scan already does. Re-run:

```
references checked: 523
broken: 0
```

523 matches `convert.mjs`'s own `asset references 523` counter exactly. Confirmed the CSV line
is inside that count by direct grep — the reference resolves to
`public/files/deliveryknowledgebase.csv`, which exists.

### The final invariant output of `assets.mjs`, from a real run

```
ok   references         509
ok   coverHrefs         13
ok   copySet            500
ok   mapEntries         500
ok   slugCollisions     0
ok   src/assets size    32.0 MiB
ok   largest file       1.1 MiB
     encoded            0
     reused from cache  500

wrote 500 assets and asset-map.json
```

`encoded 0` / `reused from cache 500` because every asset was already committed
byte-identical from Tasks 4–7. **Verified reproducibility independently at this gate**, not
merely asserted: `asset-map.json` was deleted and `assets.mjs` re-run cold. Cold run took
**75.8 s wall / 92.7 s user** (the ledger's Task 6 run recorded ~89 s; the difference is
machine-load variance in a `sharp`/`ffmpeg`-bound job, not a regression — user time is the
closer comparison since both are CPU-bound). Output was **byte-identical**: `git status`
after the cold re-encode was clean, and a second run afterwards again reported
`reused from cache 500` / `encoded 0` in 0.3 s.

### `convert.mjs`'s own invariants, from the same run

```
ok   files                204
ok   mdx                  46
ok   asides               258
ok   contentRefCards      51
ok   cardTableCards       41
ok   embeds               36
ok   cardGrids            9
ok   images               528
ok   droppedCovers        13
ok   survivingBlocks      0
ok   survivingEntities    0
ok   survivingImgTags     0
ok   survivingBraces      0
     ordered list items   149
     asset references     523
```

### Every figure in the phase's measured-figures table, re-verified here

| | Table said | Re-measured | |
|---|---|---|---|
| Asset references in `source/` | 509, 0 missing | **509**, `assets.mjs` did not throw its missing-asset guard | confirmed |
| Cover href occurrences | 13 | **13** (`ok coverHrefs 13`) | confirmed |
| Copy set / `asset-map.json` entries | 500 | **500** / **500** | confirmed |
| Dropped card covers, excluded | 9 | **9** — all absent from `asset-map.json`, verified by name | confirmed |
| Slug collisions | 0 | **0** (`ok slugCollisions 0`) | confirmed |
| Files in `src/assets` | 499 (498 + logo) | **499**; `opendialog-logo.png` present, referenced at `astro.config.mjs:16` | confirmed |
| Files in `public/media` | 1 (the MP4) | **1** | confirmed |
| Files in `public/files` | 1 (the CSV) | **1** | confirmed |
| Copy set by source extension | 487 png, 7 jpg, 2 webp, 3 gif, 1 csv | **487 / 7 / 2 / 3 / 1**, read from `asset-map.json` keys | confirmed |
| Stills | 496 | **496** = 487+7+2 | confirmed |
| Map entries by kind | image 498, file 1, video 1 | **image 498, file 1, video 1** | confirmed |
| `src/assets` after encoding | 33,591,322 B = 32.0 MiB | **33,591,322 B** | confirmed |
| Largest file, all destinations | 1.12 MiB (the MP4) | **1,179,445 B = 1.12 MiB** | confirmed |
| The video | 23,654,022 B → 1,179,445 B | **23,654,022 B → 1,179,445 B**, `ISO Media, MP4 Base Media v1` | confirmed |
| Cold encode / cached run | ~89 s / 0.4 s, reused 500 / encoded 0 | **75.8 s wall (92.7 s user)** / **0.3 s**, reused 500 / encoded 0 | timing varies, mechanism confirmed |
| Markdown images emitted | 528, +1 `<video>`, +1 `/files/` link | **528** / **1** / **1** | confirmed |
| Distinct `~/assets/` aliases | 498 | **498** | confirmed |
| `src/assets` before encoding | 121.4 MiB | not independently re-run (destructive to re-derive; would mean discarding the committed encoded assets) — carried from the Task 4 ledger run, cross-checked against `du -sm src/assets` = 142 MB reported there for the same byte figure | carried, not re-measured |

**One figure needed a methodology note, not a correction.** The Phase 4 handoff (below) names
`engineer-maintenancing-ai-systems-2023-11-27-05-12-07-utc.jpg` at **454,752 unique colours**.
Reproduced exactly — but only when counted on a **lossless** resize to 2000px width (the method
used for the design's original p50/p95/max calibration, before the JPEG-format-preservation
ruling existed). Counting it the way `assets.mjs` actually would — resize, then re-encode as
JPEG at quality 90, *then* count colours on the decoded JPEG, which is what `resizeImage` +
`countColours` do for every real JPEG in the pipeline — gives **225,760** for this same file,
because JPEG's lossy compression itself removes colours before they are counted. This has no
practical consequence: `quantise()` is gated to `PNG.test(name)`, so no JPEG is ever
palette-quantised regardless of its colour count, at 225,760 or 454,752. Recorded so nobody
re-derives 454,752 by feeding this file through the live pipeline and gets confused when the
number doesn't match.

### Five measured corrections to the brief, as they actually ran

The design spec's Phase 3 section predated any measurement. All five held throughout execution:

1. **Orphan deletion is not a step.** `source/` is git-ignored and regenerable from
   `documentation`; assets move *out* of it, nothing is deleted from it. The two traps on
   "delete the 1,089 orphans" (a byte-identical duplicate of an excluded cover, and the
   28 MB GIF being an orphan already) are moot because no deletion step exists.
2. **All 50 extension-less files in `source/.gitbook/assets` are orphans.** Zero are
   referenced — verified corpus-wide by literal-match against all three real terminators
   (`)`, `"`, `>`), not by a bracket-naive grep (see Trap below). No magic-byte sniffing was
   ever needed.
3. **The 28 MB GIF was never a deployment blocker.** `OpenDialog - Preview - Google Chrome
   2021-12-09 09-03-23.gif`, 28,637,283 B, is referenced by nothing — not the generated output,
   not any source `.md` file. It is an orphan and was never copied by `assets.mjs`.
4. **Resizing alone cannot meet the gate; palette quantisation is the lever.** 231 of 496
   images were already ≤1600px wide before this phase.
5. **The `~/assets/` alias resolves in markdown images**, verified by build spike before this
   phase and confirmed again here: all 498 `~/assets/…` references in the generated output
   resolve to real files in `src/assets/`.

### The slug rule

`slugify()` (`scripts/lib/asset-plan.mjs`): lowercase the stem, collapse every run of
non-`[a-z0-9]` characters to a single hyphen, trim leading/trailing hyphens, keep the original
(lowercased) extension. A collision appends `-2`, `-3`, … to the stem, checked against names
already claimed in a fully-sorted pass so the result depends only on the input names, never on
directory read order. **Zero collisions across the 509 referenced assets** (`ok
slugCollisions 0`), confirmed at this gate.

### The quantisation threshold: 32,768 unique colours, measured on the RESIZED image

`QUANTISE_MAX_COLOURS = 32768` in `scripts/lib/asset-plan.mjs`. The count must be taken **after**
resizing to the 2000px width ceiling, never on the original and never on a downsample smaller
than the shipped size — unique colours scale with pixel count, so a threshold calibrated on a
smaller proxy image admits far more files than intended at the real size.

**The calibration error this guards against:** an earlier design draft measured colour counts on
400px downsamples and set the threshold at 8,192, based on projecting 11 of 505 images would
exceed it. At the real ~2000px resize width, 197 of 505 exceeded that same threshold, projecting
**84.6 MiB** against the 60 MB gate — nearly 8x the predicted overshoot. The proxy measurement
did not hold because colour count does not scale linearly with the *linear* resize dimension.
Recalibrated at 32,768 measured directly on the resized (not downsampled) image; `countColours`'s
own docstring records this so nobody re-derives the threshold from a downsample again.

### Format preservation: JPEG stays JPEG, PNG stays PNG, WebP stays WebP

**Decision by the project owner**, made during this phase after the original design assumed all
496 stills were PNG (490 was the design's guess). The real composition, read from
`asset-map.json`: **487 PNG + 7 JPEG + 2 WebP.**

- JPEG resizes to JPEG at quality 90.
- PNG resizes to PNG, then palette-quantises if the resized image is at or under the 32,768
  colour threshold.
- WebP resizes to WebP, lossless re-encode, never quantised.

The extension always matches the content. Palette quantisation is treated as a PNG-only concept
in the code (`quantise()` is gated on `PNG.test(name)`), not merely a matter of which branch
happens to run — calling `sharp(...).png({palette:true})` on a JPEG or WebP source would
silently convert the format under an unchanged extension, which is exactly the well-formed-but-
wrong artefact class this project has hit before. Before this decision, 6 referenced JPEGs would
have been written as PNG bytes under a `.jpg` extension whenever the quantised PNG came out
smaller — the `if (output.length > source.length) output = source` guard protects size, not
format agreement, so it would not have caught this.

### Which assets went to `public/`, and why

`DESTINATIONS` in `scripts/assets.mjs` maps every asset `kind` to exactly one destination:

| Kind | Destination | Why |
|---|---|---|
| `image` (498) | `src/assets/`, alias `~/assets/…` | Passes through `astro:assets` for on-demand optimised variants — the whole point of not using `public/`. |
| `video` (1, the MP4) | `public/media/`, path `/media/…` | `astro:assets` optimises images; it has no video pipeline. A `<video src>` needs a stable public URL, not an import. |
| `file` (1, the CSV download) | `public/files/`, path `/files/…` | A download link needs a stable public URL a reader can save-as; it is not an image to optimise. |

### Trap — the cover/non-cover split must be corpus-wide, never per file

`source/monitoring-your-application.md` references `Screenshot 2024-09-26 at 10.32.32.png`
**twice**: as a `data-card-cover` href on line 67, and as an ordinary `<figure><img>` on line 75
— and in no other file. A per-file split (`cover.has(name)` tested against a per-file `Set`)
lets the cover occurrence blot out the genuine figure occurrence of the *same name in the same
file*, silently dropping the copy set to 499 and 404ing that one figure with every invariant
still green (499 ≠ 500 is the only thing that would catch it, and a broken detector could "fix"
itself by adjusting the expectation instead).

**The fix, verified in `copySet()` (`scripts/assets.mjs`):** accumulate `all` and `covers` as
corpus-wide multisets (a name can appear any number of times across any number of files) and take
the difference **once, after the whole walk** — never inside a per-file loop. Confirmed at this
gate: `Screenshot 2024-09-26 at 10.32.32.png` **is** present in `asset-map.json` (500 entries),
and the other 9 genuine cover-only assets are **not**. This is `MIGRATION-NOTES.md`'s existing
Trap 2 (Phase 2 gate section, Handoff to Phase 3) arriving from a new direction — same asset,
same warning: do not identify these assets by "the Screenshots."

### Trap — bracket-naive greps truncate at the first `)` and produce false results

Bit twice during this phase, both times in ad-hoc verification greps, never in shipped code. A
pattern like `'\.gitbook/assets/[^")>]*'` stops at the first `)`, so `Preview Main (1).jpg`
reduces to `Preview Main (1` and never matches a `.jpe?g` suffix test, and `1 (1).png` becomes
textually indistinguishable from the real extension-less file `1 (1)`. The first attempt at the
"are the 50 extension-less files really unreferenced" check used exactly this shape and reported
**215 false-positive "dotless" references**, all artefacts of the truncation. The second bit a
JPEG count (6 vs the correct 7): the same character class excluded `Preview Main (1).jpg` and
undercounted the copy set's JPEGs. **Anyone measuring this corpus must read `asset-map.json` or
use `extractTargets`/`assetRefsInFile`, never a bracket-naive grep.**

### `assets.mjs` may only ever delete files it created

The sweep at the end of the copy loop removes what a *previous* map claimed that the *current*
run no longer claims — never a `readdirSync`-minus-claimed sweep over the destination
directories. `src/assets/opendialog-logo.png` (the site logo, referenced at
`astro.config.mjs:16`) sits in `src/assets/` unclaimed by any asset entry; a listing-based sweep
deletes it on every run. Confirmed present at this gate.

The sweep keys on the **(destination, slug) pair**, not the slug alone, via a
`destinationKeyFor` helper. Reason: a GIF crossing `GIF_VIDEO_THRESHOLD` on a future resync keeps
its filename (`knowledge-base-demo`) but switches destination (`public/media` gif → mp4, same
directory in this case, but the general shape holds for any future kind change) — a slug-only
sweep could read the new destination's claim as covering a stale copy left in the old one and
leave it behind forever. An entry written before the `destination` field existed is placed via a
`DESTINATION_FOR_KIND` fallback rather than skipped, since `kind` has always determined
destination one-to-one.

### `ffmpeg` determinism: `-fflags +bitexact` before `-i` is inert here

`ffmpeg`'s MP4 muxer embeds a creation timestamp by default, which would make two encodes of the
same GIF differ byte-for-byte and defeat the content-hash cache's reproducibility guarantee.
Determinism comes from `-flags:v +bitexact`, `-map_metadata -1` and fixed encode parameters on a
pinned `ffmpeg` version. **`-fflags +bitexact`, placed before `-i`, binds the demuxer, not the
muxer, and is inert for this encode** — proven during Task 7's review by removing it and
re-encoding: byte-identical output, same hash (`02170b309…`). The JSDoc at
`scripts/assets.mjs`'s `encodeVideo` should be read with that in mind; the comment as written
slightly overstates which flag does what.

### `EXPECTED.images` went 529 → 528; the only expectation adjusted this phase

Single cause: the corpus's sole `kind: 'video'` asset (`Knowledge Base Demo.gif` →
`knowledge-base-demo.mp4`) renders as a `<video>` element, not a markdown image, so one of the
529 image-shaped references from Phase 2 became a non-image reference in Phase 3. 528 counts
markdown-image **occurrences** in the output text, not distinct assets — re-confirmed at this
gate by direct grep (`528` `![…](` occurrences, `1` `<video>`, `1` `/files/` link). Verified
three independent ways during Task 5: a page-only diff of exactly 516 insertions / 516 deletions
with nothing added or removed; reference sites totalling 530 before and 530 after; and a direct
on-disk count. **Caveat carried forward:** this counter depends on `asset-map.json` existing —
in the sanctioned no-map fallback state, the video re-emits as a markdown image, `stats.images`
reads 529, and `convert.mjs` exits 1. That fallback keeps `astro build` green by design, but the
invariant gate itself is not runnable without the map.

### The `{% file %}` download is matched by coincidence, not by a dedicated pattern

`convertFile` in `scripts/lib/gitbook-blocks.mjs` resolves the CSV's `src="…"` only because that
text is textually indistinguishable from the `ATTR` regex `asset-refs.mjs` already scans for
ordinary HTML attributes. There is no pattern written specifically for `{% file %}`. A future
GitBook sync emitting the same block with single quotes (`src='…'`) would silently drop the
corpus's only download reference, with no invariant positioned to catch it — `references: 509`
would simply read one lower and, absent independent knowledge of the true count, look correct.

### Stale entries in this repo's own docs, corrected by this phase

- **`ffmpeg` is installed** — 8.1.2, at `/opt/homebrew/bin/ffmpeg`, verified again at this gate.
  This file's own "Phase 3 dependency missing" entry (Phase 1 gate) still records it as missing;
  it is now stale as written but stands per the append-only rule. The Phase 2 gate's
  Handoff-to-Phase-3 section already carries the correction. **`CLAUDE.md` does not, and never
  has, mention `ffmpeg` at all** — verified here with `git log --all --oneline -S'ffmpeg' --
  CLAUDE.md` (no output, no commit ever touched the string) and `grep -in 'ffmpeg' CLAUDE.md` (no
  match). The design spec (`docs/superpowers/specs/2026-07-30-phase-3-assets-design.md:57`)
  claims "`MIGRATION-NOTES.md`, `CLAUDE.md` and the Phase 2 handoff all record it as a missing
  prerequisite" — that claim is itself wrong about `CLAUDE.md`, and the Phase 3 handoff repeated
  it as "three files still record it as missing" without checking. Recorded here so the chain
  stops at this file rather than propagating into whatever reads this section next.
- **The 28 MB GIF was never a deployment blocker.** It is an orphan — referenced by nothing in
  `source/` or the generated output — and was never copied by `assets.mjs`. `CLAUDE.md`'s Gotchas
  line describing it as something that "will fail deployment" and needs re-encoding is describing
  a file that was never in scope to deploy.
- **All 50 extension-less files are orphans**, zero referenced, verified by literal-match
  against all three real terminators (`)`, `"`, `>`) rather than a bracket-naive grep (see Trap
  above, which nearly produced a false positive on this exact check). Magic-byte sniffing, which
  `CLAUDE.md`'s Gotchas section still names as necessary, was never needed.

### Handoff to Phase 4 — look and feel

**The 9 dropped card covers remain in `source/.gitbook/assets/`, untouched, by path:**

```
OD-basicmodel.png
applicationdesign.png
Screenshot 2024-09-26 at 10.38.51.png
Screenshot 2024-10-01 at 15.28.40.png
conditions (1).png
engineer-maintenancing-ai-systems-2023-11-27-05-12-07-utc.jpg
legoblocks.png
personalisation.png
usinglanguageservice.png
```

Restoring card covers means copying these 9 through this same pipeline (`assets.mjs`'s
`copySet()` currently excludes them by design, per the corpus-wide split above — that logic
would need a deliberate carve-out, not a bug fix). **The photograph among them,
`engineer-maintenancing-ai-systems-2023-11-27-05-12-07-utc.jpg`, must stay full-colour** — see
the methodology note above on its two colour counts (454,752 lossless / 225,760 as the JPEG
pipeline would actually produce it); either way it stays a JPEG and is never palette-quantised,
so "full-colour" is guaranteed by the format gate regardless of which count is used to describe
it.

**Also Phase 4's, all already recorded in this file's Phase 2 gate section** (Handoff to Phase 4)
and unchanged by this phase: the 13 wrapper-div side-by-side figures across 9 pages covering 31
images that stack in Starlight but render in a row on GitBook; the 64 dropped `width=`
attributes with nowhere to go in markdown; card-cover images having no `<LinkCard>` slot (the
same 13/10/9 chain as above); non-linkable sidebar groups; and `<figure>`/`<figcaption>`
semantics collapsing to an italic paragraph.

### Deferred minor findings, carried forward before the ledger is deleted

None of the below is reachable on today's corpus. Recorded so they are not rediscovered as new.

- `encodeVideo`'s `VIDEO_CONTAINER = /\.(?:mp4|webm)$/i` accepts `.webm`, which `encodeVideo`
  never produces; `/\.mp4$/i` would match the actual invariant. Root cause below, under
  "output-extension ownership".
- The sweep's `claimed` set is built with a raw `` `${asset.destination}/${asset.slug}` ``
  template while the sweep side goes through the `destinationKeyFor` helper. Functionally
  identical today because every entry written this run has a valid `destination`, but it is the
  two-hand-built-keys drift risk that should be routed through one helper.
- Two near-identical regex literals scan for `~/assets/` in `convert.mjs`, one to count and one
  to check existence.
- The markdown-link alternative in `convert.mjs`'s on-disk scan mis-parses a destination
  containing a literal `(` — unreachable while `assets.mjs` slugifies every filename.
- `convertFile`'s link text and its path derive the filename by different rules — text from a
  raw `split('/').pop()`, path through the unescape helper. Identical for the corpus's one file
  block; a `\_`-escaped filename would render a literal backslash in prose.
- The invalid-percent-encoding error in `asset-refs.mjs` names the `.gitbook/assets/`-relative
  segment rather than the full destination path.
- `copySet()`'s `copy` array is sorted, and both `assignSlugs` and the main copy loop
  (`[...copy].sort()`) independently re-sort the same already-sorted array. Harmless duplicate
  work, not present as a double-read of source files in the final code — an earlier ledger entry
  describing `copyFileSync` plus a second `readFileSync` per asset does not match the shipped
  loop, which reads each source file exactly once via `readFileSync` and reuses that buffer for
  both the hash and the resize/write path.

### Final review: further deferred findings

Transcribed from `.superpowers/sdd/2026-07-30-phase-3-assets/deferred-minors.md`, which is
git-ignored and deleted at merge, before it disappears. Four items from that file already
appear in the list above (`copySet()`'s triple sort, the two `~/assets/` regexes in
`convert.mjs`, `convertFile`'s link-text/path divergence, and the `VIDEO_CONTAINER` `.webm`
acceptance); these do not.

- No test covers the collision-suffix loop (`assignSlugs`, `asset-plan.mjs`) re-checking an
  already-suffixed name — `['a b.png', 'a-b.png', 'a-b-2.png']` sorts to
  `['a b.png', 'a-b-2.png', 'a-b.png']`, and the `while` loop must skip the taken `a-b-2.png`
  to land on `a-b-3.png`. Verified correct by hand-trace, not locked in by a test. The
  collision path is unreachable on today's corpus and is exactly what a future sync fires,
  making it the least-exercised load-bearing branch in the asset pipeline.
- `slugify`'s (`asset-plan.mjs`) handling of dotfiles, trailing dots and multi-part extensions
  is undocumented: `.hidden` fails the `dot > 0` guard and the whole name becomes the stem;
  `trailing.` yields a bare `.` extension; `archive.tar.gz` folds `.tar` into the stem, giving
  `archive-tar.gz`. All defensible for this corpus, none stated in the JSDoc.
- No unit test locks true duplicate hrefs in `link-cards.mjs`'s `coverTargets`, though
  `asset-refs.test.mjs` now locks duplicate survival one layer up, in the code that consumes
  them, and both `coverHrefs` and `copySet` would fail loudly if a `Set` crept into either.

**Output-extension ownership, and two more places that duplicate `asset-plan.mjs`'s naming
decisions instead of asking it for them.**

- The output extension is decided in `assets.mjs`, by
  `slug.replace(/\.gif$/i, '.mp4')` keyed on `plan.treatment`, rather than inside the pure
  `asset-plan.mjs` module that owns every other naming decision. That split is the reason
  `figures.mjs`'s `VIDEO_CONTAINER` regex has to accept `.webm` defensively even though
  `encodeVideo` never produces it — the real invariant, `/\.mp4$/i`, only holds once
  `planAsset` itself decides the output name. Moving output naming into `planAsset` collapses
  both gaps at once.
- `assets.mjs`'s `STILL_IMAGE = /\.(?:png|jpe?g|webp)$/i` duplicates `asset-plan.mjs`'s `STILL`
  regex rather than importing it. The two agree today. A future divergence one way — an
  extension `STILL_IMAGE` accepts that `STILL` rejects — throws loudly inside `planAsset`; a
  divergence the other way is silent: a resized image that `STILL_IMAGE` planned as
  `kind: 'file'` would land in `public/files`, resolve correctly, and simply never be
  optimised.
- A cache hit (`assets.mjs`, the `cached && cached.hash === hash && …` branch) reuses
  `reference` and `kind` verbatim and never re-validates them against the current plan inputs.
  Changing `MAX_WIDTH`, `QUANTISE_MAX_COLOURS` or `GIF_VIDEO_THRESHOLD` and re-running
  therefore cache-hits every asset — `reused 500`, `encoded 0` — and the constant appears to
  have had no effect at all. `assets.mjs` now carries a comment above the cache check stating
  this explicitly: changing an encode constant requires deleting `asset-map.json` before the
  next run.

### Adjudicating a corpus-count change before cutover

`assets.mjs`'s `EXPECTED` (references 509, coverHrefs 13, copySet 500, mapEntries 500) and
`convert.mjs`'s `EXPECTED` both hold absolute corpus counts, not proportions or ranges.
`assets.mjs` runs before `convert.mjs` in `npm run convert`, so a docs author adding one
legitimate screenshot before cutover makes `assets.mjs` exit 1 and `convert.mjs` never runs at
all. `CLAUDE.md` is explicit that these counts are never adjusted to make a run pass — that
rule is correct and stays. What has been missing is how to tell a genuine content change from
a broken transform, since both present identically: a count that no longer matches.

**Procedure, to run before touching any `EXPECTED` value:**

1. Diff `source/` against the previous sync (or `git log` on `documentation` since the last
   conversion) to name the actual file added, removed or edited. Do not proceed on the count
   alone — name the specific asset and the page(s) that changed.
2. Confirm the asset is on disk: `ls source/.gitbook/assets/<name>`.
3. Confirm which page(s) reference it: `grep -rl '<name>' source/**/*.md`. A genuine addition
   is referenced from at least one page; an asset added to `source/` but referenced nowhere is
   an orphan and moves no count at all.
4. Check the delta is accounted for exactly: one new page reference to a new distinct asset
   should move `references`, `copySet` and `mapEntries` by the same amount, in the same
   direction, for a reason that traces to the named file; a reference to an asset already in
   the corpus moves only `references`. A removed page's assets move the counts down the same
   way.
5. **The signal that a count moved for a real reason is that every count it touches moves
   together in a way the named file explains.** A single count moving alone, or a count moving
   by an amount the named change does not account for, is not a legitimate content change —
   treat it as a transform defect and debug it as one, per this file's standing rule not to
   adjust an expectation to match a broken run.
6. Once steps 1–5 establish the change is genuine, update the specific `EXPECTED` value(s) in
   `scripts/assets.mjs` and/or `scripts/convert.mjs`, and **record the change in this file**:
   which count, old value, new value, the asset name, the page(s) referencing it, and the
   evidence from steps 2–4. A human signs off on that entry before the updated expectation is
   committed — this is not a change a script makes to itself.

This is deliberately conservative under time pressure: on cutover day, the fast path (assume
legitimate, bump the number) and the correct path (name the file, prove the delta) look
identical from the failing output alone. Steps 1–4 are the difference, and they cost one
`grep` and one `ls` against the cost of shipping a broken build, or worse, adjusting an
expectation to hide one.

### Concerns

None blocking. The `{% file %}` coincidental-match gap and the `EXPECTED.images` no-map fallback
caveat are both structurally sound today and both explicitly logged above so a future GitBook
sync that changes shape fails loudly rather than silently.

## 2026-07-30 — Phase 4 gate: look and feel complete

Scope was widened at the outset, on Pat's decision: the six measured items in the Phase 2
and Phase 3 handoffs **plus** the chrome items in `MIGRATION-BRIEF.md`'s Phase 4 section,
which are additive to those handoffs rather than superseded by them.

### Gate evidence

- `astro build` green, 205 pages.
- `node scripts/routes.mjs` — route parity OK, 204 live sitemap URLs, 0 unreachable.
- 231 unit tests pass (up from 187).
- `npm run convert` byte-identical across consecutive runs.
- Deployed to `opendialog-docs.opendialog.workers.dev`; a 30-route sample all served 200 on
  the first poll.
- No horizontal overflow at 375, 768, 1024, 1440 or 1920.

### The defect underneath several others: cascade layer order

`custom.css` opened `@layer starlight.core { … }`, and Astro bundles `customCss` ahead of
Starlight's own stylesheets. A layer's priority is fixed by where it **first appears**, so
`starlight.core` registered first and became the **lowest**-priority layer — beneath
`starlight.reset`, whose `* { margin: 0 }` then beat every margin Starlight sets in `core`.
Measured in the bundle: first `@layer starlight.core{` at byte 2,086, Starlight's own layers
not until 38,915. Starlight's intended order, from `style/layers.css`, is
`base, reset, core, content, components, utils`.

This had been true since Phase 1 and was **not** cosmetic-only. It silently disabled:

- the search dialog's `margin: 4rem auto auto`, which is why the modal opened pinned to the
  top-left corner rather than centred;
- `PageTitle.astro`'s `h1` and `.page-description` margins — dead since Phase 1;
- Starlight's own `.title-wrapper` negative margin, which is why the logo sat 4px right of
  the sidebar edge;
- `.sl-container > * + *`'s 1.5rem rhythm between content blocks.

Fixed by restating the canonical order as the first statement in `custom.css`. **That
statement must stay first in the file.** Lightning CSS strips the bare `@layer` statement
from the bundle but physically reorders the layer blocks to match it, which is what makes
the fix work — verified by reading the built CSS, not assumed.

Consequence for anyone editing `custom.css`: `starlight.core` is *below* `starlight.content`
and `starlight.components`. A rule that must beat Starlight's markdown or component styling
has to sit **outside** `@layer` — several rules here deliberately do, and say so.

### Corrections to earlier entries in this file

- **The brand-token font row (line ~168) is wrong.** It records "Inter (body), Fragment Mono
  (code)" as taken from `opendialog.ai`. Measured today, the marketing site loads **Sofia
  Pro** and no Inter at all; the note was written a day earlier, so the site is very unlikely
  to have changed under it. More importantly the docs site being replaced serves **Poppins**
  and **IBM Plex Mono**, which is what the migrated site now serves. This is the same
  unverified-claim shape as the ffmpeg entry the Phase 4 prompt warns about.
- **`scripts/sidebar.mjs`'s "nav entries" counter and its comment were stale** the moment the
  Sidebar override landed: a parent page is no longer two rows. It now reports
  `data entries: 245 (41 parent pages counted twice)` and `rendered rows: 204`.
- **`reference/` holds no visual snapshots.** The Phase 4 prompt's definition of done says to
  verify "against the `reference/` snapshots"; that directory contains only `llms.txt`,
  `sitemap.xml` and `sitemap-pages.xml`, and `screenshots/` is git-ignored. All visual
  comparison in this phase was made against the live GitBook site, which is still up. **There
  is still no committed visual oracle that outlives GitBook.**

### What changed

**Typography.** Poppins and IBM Plex Mono, self-hosted via Fontsource (OFL-1.1), latin
subset only — the corpus's 27 non-ASCII codepoints are all inside latin's range or emoji that
fall back to the system face. Zero external font requests preserved. Heading scale matched to
GitBook exactly: h1 36/700/45/−0.9, h2 30/600/36/−0.375, h3 24/600/32/−0.3, h4
20/600/28/−0.25. `--sl-text-h5` deliberately untouched: `asides.css` uses it for the aside
title and 258 hint blocks depend on it.

**Header.** Site title 18px/600/−0.025em near-black with a 32px logo, against Starlight's
24px brand blue. `opendialog.ai` and the "Talk to an expert" CTA carried across from GitBook
with their real hrefs; the three social icons GitBook does not have are gone. Search moved to
the right of the CTA, as GitBook orders it — that needed a full `Header` override, not the
`SocialIcons` override first assumed, because Starlight puts search in a middle column.

**Page shell.** GitBook constrains its layout to a 1440px box centred in the viewport with
32px inner padding while the header band stays full-bleed. One inset variable now drives the
header padding, the fixed sidebar and the main frame together.

**Light-only.** The live GitBook site is light-only — hard-coded `light` on `<html>`, no
switcher, no theme key in storage. `ThemeProvider` pins light and ignores a stored `dark`
preference, so anyone who chose dark on the preview still gets light. Dark tokens stay in
`custom.css`, so it is one file to undo. **Caveat: the pin is an inline script, so with
JavaScript disabled the page falls back to Starlight's `:root` default, which is dark.**
Fixing that properly needs `data-theme` on the server-rendered `<html>`, i.e. a `Page`
override.

**Breadcrumb.** The ancestor-group chain, section down to immediate parent, excluding the
page. GitBook links its top-level crumb to paths like `/core-concepts`, which are **not
pages** — it 307-redirects them to the section's first page, and they appear in neither the
live sitemap nor `route-map.json`. The crumb points straight at the redirect target instead:
same destination, no hop, no route invented. **All 636 breadcrumb links across 204 pages
resolve to a real route.** A section is a structural bucket and never a page, so its crumb
always shows; where the section's first page *is* the current page it renders as plain text
rather than linking to itself (6 pages).

**Sidebar.** 207 rows and 7,760px of scroll became 44 rows — GitBook shows 44. Nested groups
start collapsed (`sidebar-tree.mjs`); Starlight already opens a collapsed group holding the
current page, so the nav opens along the path being read and nothing else. `SidebarSublist`
folds a parent page's duplicate entry into the group's own clickable row, so 245 nav entries
render as 204. Type matched: section headers 12px/600 uppercase against Starlight's 16px/600,
rows 14px/400 muted, current page marked by weight, colour and a 1px rule rather than a
filled block, 34px row pitch, 21px indent per level, hairline only from the second level down.

**Images.** The 64 `width=` attributes dropped in Phase 2 are carried through — 21 inside
wrapper divs, **43 on standalone figures**, which GitBook sizes just the same. One 188px
thumbnail had been rendering at 720×1075. The width rides in the markdown title slot and
`rehype-image-width` turns it into an inline width and strips the title. `rehype-figures`
pairs each image with the caption beneath it into `figure`/`figcaption`, which both fixes the
rows and restores the semantics Phase 2 lost. All 15 wrappers render on one row.

**Emoji, embeds, covers.** GitBook's four shortcodes render as characters, with `emoji 5` and
`survivingShortcodes 0` as invariants. Video embeds emit as raw HTML rather than a component,
returning **28 pages to `.md`** (`mdx` 46 → 18). Card covers are restored via `CoverCard`
(`covers 13`), and `assets.mjs` copies them again (`copySet`/`mapEntries` 500 → 509).

### The Phase 2 decision that was open, now closed without a markup change

`progress-bar-message`'s `<pre>` needed two markup changes to parse as MDX — the dropped
`<code>` and the joined `<strong>` — and that was escalated to Pat in Phase 2 with no decision
recorded. **Neither change happens any more.** Measuring the rendered page first showed the
real problem was worse than the one escalated: through MDX the block also **lost its
indentation and had its straight quotes rewritten as curly by SmartyPants**, breaking an XML
sample readers copy. The identical construct in the `.md` page `using-jmespath-expressions`
was untouched across all 20 of its blocks. The page is `.mdx` only because of one `<Embed>`;
emitting embeds as raw HTML returns it to `.md`, where `unwrapPreCode` never runs. **The
generated `<pre>` is now byte-identical to the source.** No markup change is made to
documentation content, so the standing rule is not bent.

### Traps worth keeping

- **`SidebarSublist` is not an overridable component.** The `components` schema accepts
  `Sidebar` but not `SidebarSublist`, and Starlight's `Sidebar` imports it by relative path.
  Naming it in `astro.config.mjs` is **accepted silently and does nothing** — no error, no
  warning. It has to be reached through a `Sidebar` override.
- **Clicking a linked group label also toggled it**, and `SidebarPersister` carried that
  collapsed state across the navigation, so landing on a parent page hid its children. Only
  visible by clicking through; the server-rendered HTML was correct.
- **A block element at column 0 closes any enclosing list.** 7 embeds on
  `ai-agent-creation-overview` sit in list items inside a stepper, and `<Steps>` requires a
  single `<ol>` child, so the page failed the build outright. Every emitted embed line now
  carries the indentation of the block it replaces — the same hazard `figures.mjs` documents
  for captions, and the reason the width could not be carried in a wrapper `<div>`.
- **`reflowImageDiv` and `convertFigures` both reject markup they do not expect**, and an
  embed's `<figure>` wrapping a `<div>` is exactly that shape. Embeds convert *after* both
  passes rather than either guard being weakened.
- **`CSSStyleRule` exposes an empty-but-truthy `.cssRules`** for CSS Nesting. An ad-hoc
  cascade-debugging script that branches on `if (rule.cssRules)` therefore treats every leaf
  rule as a container and reports that nothing matches. Two measurements in this phase were
  wrong that way before being caught; use `instanceof CSSStyleRule`.

### Not done, and why

- **The two non-video embeds still render as plain links.** `fetchify.com` in
  `address-autocomplete-message` and `webaim.org` in `designing-accessible-chatbots`. GitBook
  renders a bookmark card carrying the **target page's `<title>`, its domain and its favicon**,
  all fetched from the third-party site at render time — measured: "WebAIM: Contrast Checker /
  webaim.org". Reproducing that needs external metadata we do not have, and inventing a title
  would be fabricating content. Left as links deliberately, for Pat to decide.
- **`src/assets` is 48.4 MiB, up from 32.0**, against the 60 MB gate, and the largest file is
  4.0 MiB. Four of the nine restored covers are photographic PNGs of 11–14 MB that the
  pipeline preserves as PNG. Format preservation is a Phase 3 decision and redesigning the
  asset pipeline was out of scope; `astro:assets` still optimises what ships.
- **`sharp@0.34.5` carries a high-severity advisory** (libvips CVEs) with a
  `dependabot/npm_and_yarn/sharp-0.35.3` branch already open. Pre-existing, untouched here.
  Note that bumping it means deleting `asset-map.json` and re-encoding, so it is not free.

### Handoff to Phase 5 — verification and cutover

**Nothing in this phase verified route parity against the deployed site**, only against
`route-map.json` and a 30-route sample. Still outstanding before DNS:

- Full route parity for all 204 live sitemap URLs against the deployed build.
- A broken-link check covering **raw HTML anchors**, not just markdown links — 13 survive,
  and the 12 in-page anchors (`#h.t23f6ncuijwz` ×7, `#what-is-a-list-message` ×5) need
  checking against the *rendered* heading slugs.
- **Anchor parity is still assumed, not verified.**
- Accessibility: **455 of 529 images still have an empty `alt`**, and a linked group row now
  nests an anchor inside a `<summary>`, which is worth a look in that pass.
- The light-only pin's JavaScript-disabled fallback, above.

---

## 2026-08-25 — First post-cutover content edit: release notes hand-edited

The release-notes page (`src/content/docs/release-notes/release-notes/index.mdx`) was updated
by hand with the April–August 2026 entries, matched against the Confluence release pages
(3.11 Wasat, 3.12 Yildun, 3.13 Zaniah, 3.14/4.0) and the GitHub release changelogs. The
August entry carries the OpenDialog 4.0 deprecation/removal list from the 4.0 Release Page
and RFD 0078.

This deliberately breaks the "never hand-edit `src/content/docs/`" rule. That rule guarded
against a `convert.mjs` re-run clobbering manual edits while GitBook was still the source of
truth; the live site is now the Starlight build and GitBook no longer syncs. **Constraint
created:** any future `npm run convert` re-run against a `source/` snapshot will silently
drop these sections — the conversion pipeline must be treated as retired for content, or this
page's post-cutover additions re-applied after any regeneration. Phase 3 (assets, PR #18)
must rebase over this change and must not re-run the full conversion on top of it.

---

## 2026-08-27 — The conversion pipeline is retired; `src/content/docs/` is now authored

`origin/main` was merged into `phase-4/look-and-feel` to bring the April–August 2026 release
notes onto the branch. The release-notes page existed on both sides and both sides had
changed it, so the resolution is worth recording: `main` carried the five new sections on top
of Phase 2 output, which still referenced `/.gitbook/assets/image (627).png` and friends
directly; `phase-4` carried the same page regenerated with `~/assets/…` paths, image widths
and no dead `Embed` import. Git auto-merged them because the new sections sit above
`## March 2026` and the asset rewrites sit below it. Verified rather than assumed: five new
`<h2>`s render in reverse-chronological order, all four of the new absolute links resolve to
pages that exist in `dist`, and the page emits 22 `_astro` images and zero `.gitbook`
references.

**The pipeline is now retired for content.** Conversion was always a one-time process, and it
has run: `npm run convert` on this branch immediately before the merge left
`git status --short` empty, so the generated corpus and `source/` agree exactly. That is the
last time it should run. From here `src/content/docs/` is hand-authored in Starlight dialect
and is the source of truth. `CLAUDE.md` hard rules 2 and 3 have been rewritten accordingly:
rule 2 inverted, and rule 3 now forbids `npm run convert` outright rather than describing the
idempotency it needs.

`source/`, `scripts/convert.mjs` and the 261-test suite are kept, unchanged and still passing,
as the record of how the corpus was produced. `assets.mjs` and `routes.mjs` are still safe to
run alone. `source/` is deliberately left frozen: Stuart's release-notes sections were *not*
back-ported into `source/release-notes/release-notes.md`. The two are now expected to diverge,
and `source/` means "what GitBook held at cutover", not "what the site says".

**Superseded:** the constraint recorded in the 2026-08-25 entry above — that Phase 3 "must
rebase over this change and must not re-run the full conversion on top of it" — is resolved
rather than outstanding. Phase 3 is contained in `phase-4/look-and-feel`, the merge is done,
and no further conversion run is permitted by rule 3.

### Inherited failure: `npm run verify:images` exits 1, and retirement makes it structural

`verify:images` fails on this branch and **already failed at `dfb58cf`**, the commit that
introduced it — this merge did not cause it. Proof: the merge adds 109 lines carrying no
images, built `<img>` count is 746 and empty-alt content images 455, both exactly the
documented pre-merge baseline, and regenerating `reports/alt-text-todo.md` on the merged tree
produces a file byte-identical to the committed one.

The check compares two figures with different provenance (`scripts/verify-images.mjs:119`):
`emptyAltInBuild` is counted from `dist/`, while the work-list `rows` are parsed from
`source/` (line 65 reads `source/<route.source>` directly). They disagree 448 vs
455 — the source-side parse undercounts the build by 7. 455 is the figure used consistently
elsewhere in this file; 448 appears nowhere else and is unexplained. Root cause of the 7 is
not diagnosed here.

**Retiring the pipeline turned this from a bug into a design fault.** A work list derived from
`source/` describes the frozen GitBook corpus, not the site being served, and the two would
diverge further with every page authored.

**Fixed the same day.** `alt-audit.mjs` now parses the authored pages under
`src/content/docs/` — `~/assets/…` destinations, markdown titles, and the
emphasis-paragraph-after-image convention `rehype-figures.mjs` uses — so a caption is reported
only where a reader actually sees one. `verify:images` reports 455 rows against 455 in the
build and exits 0.

**The 7 were not a counting error.** Seven images on three pages
(`getting-ready`, `…/transfer/components`, `…/conversation-hand-off/chatwoot`) are still
hotlinked from `googleusercontent.com` and `freshdesk.com`. The old parser matched only
`.gitbook/assets/…`, and one of its tests asserted that anything else was skipped, so the
blind spot was pinned in place by a test. Those images ship with an empty `alt` exactly as
local ones do and are now reported; that is the whole of 448 → 455.

Two measurement cautions worth keeping. **Astro serialises `alt=""` as a bare `alt`**, so any
check written against `alt="([^"]*)"` alone silently misses every empty-alt image — that
mistake produced a phantom count of 372 during this investigation. And the split is now
**303 captioned, 152 uncaptioned**; the uncaptioned rows sort first in the report, because
those are announced as nothing at all.

Never affected what is served: the same build reports **0** images with no `alt` attribute at
all and **0** `src` values with no file behind them.


---

## 2026-08-28 — `docs/superpowers/` removed

The three design specs, three implementation plans and two phase-continuation prompts under
`docs/superpowers/` are deleted. They were scaffolding for the phased build, not documentation
of the site, and the durable record of what was decided and measured is this file.

Nothing is lost: they are in git history, last present at `9ea473e`. Retrieve one with
`git show 9ea473e:docs/superpowers/plans/2026-07-31-phase-5-verification.md`. Citations into
those paths elsewhere in this file — the Phase 3 design spec reference in the ffmpeg
correction above — now resolve only there. Those entries stand unedited under the append-only
rule.

**`.superpowers/` is deliberately kept.** It holds the per-task ledgers, briefs and review
diffs, is git-ignored, and is therefore the only copy of several rulings and carried findings
that were never transcribed here. Deleting it would be unrecoverable. Removing it is a
separate decision, and the findings below should be transcribed first.

### Phase 5 is unfinished, and this is what is left

- **Task 6 — axe-core accessibility audit. Not started.** No `axe-core` dependency, no
  `scripts/axe.mjs`, no `verify:a11y` script. Scoped to measure the two questions Phase 4 left
  open rather than reason about them: the `<a>` nested inside a `<summary>` in a linked sidebar
  group, and `CoverCard`'s deliberate `alt=""`. The plan has it stopping at a report before
  anything is changed.
- **Task 7 — Phase 5 gate write-up. Not done.** No Phase 5 gate entry exists in this file.
- Both are specified in detail in the plan at the commit named above.

### Carried findings that are still open

- **Five hotlinked images are dead on the live site.** All five are on
  `/opendialog-platform/conversation-designer/conversation-design/conversational-patterns/transfer/components`
  and return **404** — expired Google Docs export URLs, inherited from GitBook, not a migration
  regression. Two further hotlinked images still resolve: one `googleusercontent` on
  `/getting-started-1/getting-ready` and one `freshdesk` on
  `/opendialog-platform/actions/conversation-hand-off/chatwoot`. This is a content defect for
  the docs team, not a build defect. Status measured 2026-08-28; do not bake HTTP status into
  any generated report, since that would break its idempotency.
- **`reports/inherited-broken-links.json`'s `note` is partly false.** It claims the inherited
  defects "are logged in `MIGRATION-NOTES.md`". True of the 9 links; **not** true of the 16
  anchors, which are still only described as "assumed, not verified".
- **An alt text containing `]`, or a caption containing `*`, breaks the emitted markdown.**
  Flagged during Phase 2 review as owed to this file and never written down until now. It
  matters more since the retirement: the docs team now writes alt text directly into
  `src/content/docs/`, which is exactly the edit that would trigger it.

---

## 2026-08-28 — The npm-11 lockfile regression recurred, exactly as predicted

The PR preview workflow (#21) merged into `phase-4/look-and-feel` at 13:43:34Z and its first
run failed nine seconds later at `npm ci`:

```
npm error Missing: @emnapi/core@2.0.0-alpha.4 from lock file
npm error Missing: @emnapi/runtime@2.0.0-alpha.4 from lock file
npm error Missing: @emnapi/wasi-threads@2.0.1 from lock file
```

Same three packages as the 2026-07-29 Workers Builds failure, one alpha later. The entry above
called this: *"Any `npm install` run locally under npm 11 rewrites the lock back into the
npm-11-only shape and breaks CI again."*

**The merge revealed it; it did not cause it.** `package-lock.json` lost the three top-level
`@emnapi/*` entries at **`22cf3dd`** ("Serve Poppins and IBM Plex Mono"), 30 July — the first
Phase 4 commit, which ran `npm install` to add the font packages and rewrote the lock as a
side effect (10 `@emnapi` entries down to 7; 42 deletions against 8 insertions). It sat
undetected for four weeks because nothing ran `npm ci` against this branch: Workers Builds
builds `main`, and every deploy from here was a local `wrangler deploy` against a `dist/`
built from an existing `node_modules`. The preview workflow is the first thing to install
from the lock.

`@napi-rs/wasm-runtime` — an optional wasm32 fallback reached through `sharp` and `rolldown` —
requires `@emnapi/core ^2.0.0-alpha.3`, and nothing in the lock satisfied it. The version moved
alpha.3 → alpha.4 only because that caret range floats across prereleases; the missing entries,
not the float, are the defect.

**Reproduced before fixing**, on Node 24.18.0 / npm 11.16.0 — the exact toolchain
`.node-version` pins CI to — against a copy of the branch's `package.json` and
`package-lock.json`. Identical error, identical three packages.

**Fix:** `npm install --package-lock-only` under npm 11.16.0. The diff is 34 lines, all
additions: the three `@emnapi/*` entries, marked `optional` and `peer`. No dependency version
changed anywhere else.

**Verified under both toolchains**, which is the part that makes it durable rather than a
swap of which side breaks:

| toolchain | `npm ci` | rewrites the lock? |
|---|---|---|
| Node 24.18.0 / npm 11.16.0 (CI) | exit 0 | no |
| Node 22.19.0 / npm 11.6.0 (local) | exit 0 | no |

**It will recur again.** The trap is unchanged: an `npm install` under a local npm older than
CI's silently prunes optional cross-platform entries. The durable fix is still what the
2026-07-29 entry asked for and never got — pin the local toolchain to `.node-version` so both
sides run npm 11.16.0. Until then, after any `npm install`, check that
`node_modules/@emnapi/core` is still in the lock before committing.
