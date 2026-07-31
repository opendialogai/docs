# Phase 5 continuation — verification, accessibility and tidy-up

Paste this whole file as the opening prompt of a fresh session, or point the session at it by path.

## The single most important thing

**The migration is already cut over. `docs.opendialog.ai` serves the Starlight build, in
production, to real readers.** Pat repointed DNS on 2026-07-30. This is no longer a preview:
a mistake you ship is live the moment `npx wrangler deploy` finishes, and there is no staging
step between you and readers.

That changes the risk calculus from every previous phase. Verify before deploying, deploy
deliberately, and check the live domain afterwards rather than assuming.

GitBook no longer answers on `docs.opendialog.ai`, so **the acceptance oracle is gone**. What
survives is `reference/sitemap-pages.xml` (204 URLs), `reference/llms.txt`, and the
measurements written into `MIGRATION-NOTES.md`. There are still **no committed visual
snapshots** — `reference/` has never held any and `screenshots/` is git-ignored. If you need
to compare appearance against GitBook now, you cannot. Say so rather than guessing.

## Your task

Finish the migration: accessibility, the outstanding security advisory, two small cosmetic
gaps, and getting the work merged. Then stop at the phase gate and report.

Use `superpowers:brainstorming` first if the work turns out to need design — the accessibility
item probably does, because it touches generated content and the rules forbid editing prose.

## Read these first, in this order

1. `CLAUDE.md` — standing rules. Non-negotiable, several are unusual.
2. `MIGRATION-NOTES.md`, **the Phase 4 gate entry at the end**. It carries the corrections,
   the traps and the handoff. Read the whole entry; it is the state of the world.
3. `MIGRATION-BRIEF.md` — the original brief. Its Phase 5 section predates the cutover.

## State you are inheriting

- Branch **`phase-4/look-and-feel`**, pushed to `origin` at `45bc64e`, **30 commits ahead of
  `origin/main`**. It contains all of `phase-3/assets`. **No PR is open** — Pat asked to be
  consulted before one is raised.
- Neither `phase-3/assets` nor `phase-4/look-and-feel` has merged to `main`. `main` is still
  at the Phase 2 merge.
- 235 unit tests pass. `npm run convert` is byte-identical across consecutive runs.
- `astro build` green, 205 pages. `node scripts/routes.mjs` passes.
- Deployed. The custom domain is **configured in the Cloudflare dashboard, not in
  `wrangler.jsonc`** — that file has no `routes` and no `custom_domain`. A `wrangler deploy`
  will not touch the binding, but it will not recreate it either if it is ever removed.

### Already verified against the live domain — do not redo this blind

Measured on 2026-07-30 after cutover:

| Check | Result |
|---|---|
| All 204 URLs from `reference/sitemap-pages.xml` | **204/204 serving 200** |
| Broken internal links in the built output | **0** |
| In-page anchors resolving to a real `id` | **1,226/1,226** |
| CSV, MP4, sitemap-index | 200 |

Re-run these when you change anything that touches routing, links or the asset pipeline.
They are cheap. The scripts are not committed — they were ad hoc — so **consider committing
them this phase** so Phase 5's own claims are reproducible.

**Anchor parity is now measured, not assumed.** The Phase 2 handoff recorded it as assumed;
it has been checked and passes. Do not carry the old caveat forward.

## The work

### 1. Accessibility — the largest remaining gap

**455 of 529 images have an empty `alt`.** This is live. It is also the item most likely to
collide with the standing rules, so think before typing:

- **You may not write alt text into `src/content/docs/`** — it is generated, and a manual edit
  is destroyed on the next `npm run convert`.
- **You may not edit documentation prose**, and inventing alt text is authoring content. The
  `alt` attributes come from GitBook's own `alt=""` on each `<figure><img>`; they are empty at
  source.
- So the honest options are: leave them empty and log it for the docs team to fill in GitBook;
  derive alt from the existing `<figcaption>` where one exists (**329 of 430 figures have
  one** — that is real authored text, not invention); or something else you can justify.

Deriving `alt` from the caption is defensible but not free: a caption and an alt serve
different purposes, and duplicating the caption into `alt` makes a screen reader read the same
sentence twice, since `rehype-figures.mjs` now emits a real `<figcaption>` that is already
announced. **Weigh that properly rather than assuming more text is better.** This is a genuine
judgement call — put it to Pat.

Also in scope for a11y review, both introduced in Phase 4:

- A linked sidebar group nests an `<a>` inside a `<summary>`. It works and it mirrors GitBook,
  but nested interactive elements are a known smell — check it with a keyboard and a screen
  reader before deciding it is fine.
- `CoverCard` renders its image with `alt=""`, deliberately: the card's title is adjacent and
  the cover is decorative. Confirm that reads correctly.

### 2. `sharp@0.34.5` — high-severity advisory, live

GitHub Dependabot flags it on the default branch (libvips CVEs), and a
`dependabot/npm_and_yarn/sharp-0.35.3` branch is already open. It sits in the asset pipeline.

**Bumping it is not free.** `sharp` is the encoder, so a new version can produce different
bytes. `assets.mjs` caches on content hash, so you **must delete `asset-map.json` before
re-running** or every asset cache-hits and the new version silently never takes effect. Then
re-verify: `copySet` and `mapEntries` at **509**, `src/assets` under the **60 MB** gate (it is
currently **48.4 MiB**), largest file well under Cloudflare's 25 MiB per-file limit (currently
**4.0 MiB**).

### 3. Two non-video embeds still render as plain links

`fetchify.com` in `address-autocomplete-message` and `webaim.org` in
`designing-accessible-chatbots`. GitBook rendered a bookmark card carrying **the target page's
`<title>`, its domain and its favicon**, fetched from the third-party site at render time —
measured before cutover as "WebAIM: Contrast Checker / webaim.org".

Reproducing that needs metadata we do not have. Fetching it at build time adds a network
dependency to every build; inventing a title is fabricating content. It was left as a link
deliberately, and **it is Pat's call**, not a defect to fix silently.

### 4. Light-only pin has a JavaScript-disabled fallback

`ThemeProvider.astro` sets `data-theme="light"` in an inline script. With JavaScript disabled
the attribute is never set and Starlight's `:root` default — which is **dark** — applies.
Fixing it properly means getting `data-theme` onto the server-rendered `<html>`, i.e. a `Page`
override. Rare, cosmetic, and possibly not worth the override; decide deliberately.

### 5. Merge

Both phase branches are outstanding against `main`. Ask before opening a PR.

## Hard rules that still bind

1. **`documentation` branch is read-only.** GitBook syncs to it bidirectionally.
2. **Never hand-edit `src/content/docs/`.** Generated; fix the script and re-run.
3. **Scripts must be idempotent.** Same input, byte-identical output.
4. **`source/` is pristine and git-ignored.** Repopulate with
   `git archive documentation | tar -x -C source/`.
5. **URLs do not change.** Every path in `reference/sitemap-pages.xml` must resolve. This is
   now a live-traffic guarantee, not a pre-launch target.
6. **Do not edit documentation prose.** Log it in `MIGRATION-NOTES.md`.
7. **Never make DNS changes.** Already done by Pat; nothing further is needed.
8. **Do not set `run_worker_first`** in `wrangler.jsonc`.
9. **Stop at the phase gate.** Report and wait.

## Traps this project has actually hit

Each of these cost real time. They are not hypothetical.

- **Cascade layer order.** `custom.css` must keep
  `@layer starlight.base, starlight.reset, starlight.core, starlight.content, starlight.components, starlight.utils;`
  as its **first statement**. Astro bundles `customCss` before Starlight's own styles, and a
  layer's priority is fixed by first appearance — without that line, `starlight.core`
  registers first, becomes the *lowest* layer, and `starlight.reset`'s `* { margin: 0 }` beats
  every margin Starlight sets. That silently broke the search dialog's centring, the page
  title margins and the logo alignment from Phase 1 until Phase 4. **`starlight.core` is below
  `starlight.content` and `starlight.components`** — a rule that must beat Starlight's markdown
  or component styling has to sit outside `@layer`.
- **`SidebarSublist` is not an overridable component.** Naming it in `astro.config.mjs` is
  **accepted silently and does nothing**. It is reached through a `Sidebar` override.
- **A block element at column 0 closes any enclosing list.** This has now broken things twice:
  figure captions in Phase 2, and embeds inside `<Steps>` in Phase 4 (the page failed the
  build outright). Anything convert.mjs emits into a list item must carry the line's
  indentation. It is also why an image width could not be carried in a wrapper `<div>`.
- **`reflowImageDiv` and `convertFigures` reject markup they do not expect.** That is
  deliberate. Reorder your pass rather than weakening the guard.
- **`CSSStyleRule` exposes an empty-but-truthy `.cssRules`** for CSS Nesting. A cascade-
  debugging script branching on `if (rule.cssRules)` treats every leaf rule as a container and
  reports that nothing matches. Two measurements were wrong that way. Use
  `instanceof CSSStyleRule`.
- **`<details>` hides content with `content-visibility`, not `display: none`.** `offsetParent`
  and `getBoundingClientRect()` both lie about visibility inside a closed one. Use
  `element.checkVisibility({ contentVisibilityAuto: true })`.
- **Bracket-naive greps.** `'\.gitbook/assets/[^")>]*'` truncates at the first `)`, and 1,056
  asset filenames contain parentheses. Read `asset-map.json` or use `extractTargets`.
- **Changing `MAX_WIDTH`, `QUANTISE_MAX_COLOURS` or `GIF_VIDEO_THRESHOLD` requires deleting
  `asset-map.json` first**, or every asset cache-hits and the constant silently does nothing.
- **`npm install` run from the wrong directory.** A stray `cd` into `node_modules/...` earlier
  in a session persists; an install then writes into a dependency's own `package.json`. Use
  absolute paths.

## What this project has taught

- **A green build proves very little.** Phase 2 produced 11 real defects, 6 of them silent
  content loss with a green build. Phase 3 produced 14 more. Phase 4 found that the search
  dialog, three sets of margins and a live 404 were all broken while everything passed.
- **Measure, do not infer.** Every real finding in Phase 4 came from `getComputedStyle`,
  `getBoundingClientRect` or reading the built bytes — never from reasoning about what the
  code should do. The one time a count was reported from a hand-read `od` dump, it was wrong.
- **Treat confident documentation as a hypothesis.** Three entries in `MIGRATION-NOTES.md`
  were wrong and were corrected in Phase 4: the brand-token font row (recorded Inter; the
  marketing site serves Sofia Pro and the docs site served Poppins), `sidebar.mjs`'s
  nav-entry comment, and the claim that `button-message.md` was inherently broken — the target
  page exists and the link was fixable, which is how a live 404 was found. Verify before
  repeating.
- **The failure mode of this codebase is well-formed output containing the wrong thing.**

## Definition of done

`astro build` succeeds, `node scripts/routes.mjs` passes, all 204 live URLs still serve 200 on
`docs.opendialog.ai`, no broken internal links, no regression in the anchor check, anything
ambiguous written up in `MIGRATION-NOTES.md`, and a Phase 5 section appended there. Then stop
and report to Pat.

Ask before opening a PR, merging, or deploying.
