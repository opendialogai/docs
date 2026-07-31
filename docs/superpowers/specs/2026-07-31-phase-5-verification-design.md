# Phase 5 — verification, accessibility and tidy-up

Design agreed with Pat on 2026-07-31.

## Context

The migration is cut over. `docs.opendialog.ai` serves the Starlight build to real readers, and
GitBook no longer answers on that host, so there is no acceptance oracle left beyond
`reference/sitemap-pages.xml`, `reference/llms.txt` and the measurements in
`MIGRATION-NOTES.md`. Anything shipped from here is live the moment `wrangler deploy`
finishes.

Branch `phase-4/look-and-feel`, 30 commits ahead of `origin/main`, no PR open. 235 unit tests
pass, `astro build` is green at 205 pages, `node scripts/routes.mjs` passes.

## Measurements this design rests on

Taken from a fresh `astro build` on 2026-07-31, not carried over from the handoff.

| Bucket | Images | Empty `alt` |
|---|---|---|
| Header logo (chrome) | 205 | 0 |
| Content images inside `<figure>` | 329 | 303 |
| `CoverCard` covers | 13 | 13 |
| Other content images | 199 | 152 |
| **Total** | **746** | **468** |

Zero built images lack an `alt` attribute; all 455 non-cover content images carry an explicit
`alt=""`.

In `source/`: 430 `<figure>` blocks, of which 329 carry a non-empty `<figcaption>` and 38 carry
a non-empty `alt`; 6 bare `<img>` tags, 1 with a non-empty `alt`.

The 152 caption-less empty-alt images sit on 51 pages and are not decorative — 123 of them are
wider than 600px, i.e. full screenshots.

Starlight hard-codes `data-theme="dark"` on `<html>` in its own `Page.astro`. All 205 built
pages carry it; the inline `ThemeProvider` script overwrites it to `light` at runtime.

## Decisions

### Alt text — leave empty, report

Generated markup is unchanged. `alt` stays empty everywhere it is empty today.

Deriving `alt` from `<figcaption>` was rejected because it inverts the value: it targets the
303 images that already have an announced text alternative, making a screen reader read the
same sentence twice, and does nothing for the 152 that have none. Writing alt text here would
also be authoring documentation content, which the standing rules forbid, and would be
destroyed by the next `npm run convert` if hand-edited into `src/content/docs/`.

The fix belongs in GitBook, where alt text round-trips back through `convert.mjs` for free. So
Phase 5 emits the work list instead of the work.

### The two non-video embeds — leave as links

`fetchify.com` in `address-autocomplete-message` and `webaim.org` in
`designing-accessible-chatbots` stay as plain links. GitBook rendered a bookmark card carrying
the target page's `<title>`, domain and favicon, fetched from the third party at render time.
Reproducing that means either a build-time network dependency on every build, or freezing a
third party's page title into our source where it goes stale silently. Two links across 204
pages does not justify either.

### Light-only pin — fix in a build hook

Fixed by rewriting the emitted HTML, not by overriding Starlight's `Page`. A `Page` override
means copying 126 lines of Starlight internals to change one literal, and that copy drifts on
every Starlight upgrade with no signal that it has.

### Audit — axe-core, not Lighthouse

axe-core over a page sample, driven by the existing Playwright devDependency. It measures the
two open Phase 4 questions directly — the `<a>` nested in a `<summary>`, and `CoverCard`'s
deliberate `alt=""` — where Lighthouse's performance number would mostly restate the asset work
already banked in Phase 3.

## Components

### `scripts/verify-images.mjs`

Two responsibilities, both over the built output.

**Blocking checks.** Every `<img>` in `dist/` carries an `alt` attribute, and every `<img>`
`src` resolves to a file that exists in `dist/`. This is `MIGRATION-BRIEF.md`'s Phase 5 item 3
performed statically rather than over the network.

**Report.** Rows are derived from `source/` joined to `route-map.json`, because GitBook's own
markdown is what the docs team edits and the live URL is what they navigate by. Each row
carries the live URL, the page title, the GitBook asset filename and the `<figcaption>` text
where one exists. Output is `reports/alt-text-todo.md`, committed and regenerable.

The script cross-checks its row count against the empty-alt content-image count measured in
`dist/` and throws when they disagree. A report that has drifted from what ships must fail
loudly rather than read as complete — this codebase's failure mode is well-formed output
containing the wrong thing.

Pure row derivation lives in `scripts/lib/` with unit tests; filesystem walking and reporting
stay in the script.

### `scripts/lib/light-theme.mjs`

`pinLightTheme(html)` — rewrites `data-theme="dark"` to `data-theme="light"` on the `<html>`
tag and throws when the tag is not the shape it expects, matching the reject-don't-degrade
guard in `convertFigures`. Unit-tested.

A thin `astro:build:done` integration in `astro.config.mjs` applies it to every emitted page
and asserts the rewritten count equals the page count.

`ThemeProvider`'s inline script stays. `astro:build:done` does not run under `astro dev`, so
the script is what keeps the dev server light; in production it becomes a no-op. It also keeps
the `StarlightThemeProvider.updatePickers` contract alive.

### `scripts/verify-live.mjs`

Takes a base URL, defaulting to `https://docs.opendialog.ai`. Fetches all 204 URLs from
`reference/sitemap-pages.xml`, plus the CSV, the MP4 and the sitemap index, and reports
anything that is not 200.

### `scripts/verify-links.mjs`

Offline, over `dist/`. Every internal link resolves to a built page; every in-page anchor
resolves to a real `id`. Phase 4 measured 0 broken links and 1,226/1,226 anchors with an ad hoc
script that was never committed; this makes both reproducible.

Both verification scripts get npm scripts.

### axe-core audit

`axe-core` as a devDependency, injected through Playwright. Sample: the home page, a
figure-heavy page, a `<Steps>` page, a page carrying `CoverCard` covers, a page whose sidebar
group is open, and one mobile viewport.

Violations are recorded in `MIGRATION-NOTES.md`. Unambiguous defects of our own making are
fixed. Anything needing a judgement call goes back to Pat rather than being decided here.

### `sharp` 0.34.5 → 0.35.3

`asset-map.json` caches on content hash, so it **must be deleted before re-running** or every
asset cache-hits and the new encoder silently never takes effect.

Re-verification after the bump: `copySet` and `mapEntries` at 509, `src/assets` under the 60 MB
gate, largest file well under Cloudflare's 25 MiB per-file limit, unit tests green, `astro
build` green, and `npm run convert` byte-identical across two consecutive runs.
`src/content/docs/` is expected to be unchanged — only encoded asset bytes should move. A large
`src/assets` diff is the expected outcome, not a surprise.

## Order of work

1. `sharp` bump — it churns assets, and everything downstream re-verifies against the result.
2. Light-theme build hook.
3. Verification scripts and the alt-text report.
4. axe-core audit.
5. `MIGRATION-NOTES.md` Phase 5 section, then stop at the gate.

## Definition of done

`astro build` succeeds, `node scripts/routes.mjs` passes, `verify-links.mjs` reports no broken
internal links and no anchor regression, `verify-live.mjs` shows all 204 URLs serving 200 on
`docs.opendialog.ai`, the four decisions above are written up in `MIGRATION-NOTES.md` with
their reasoning, and a Phase 5 section is appended there.

## Out of scope

- Deploying. Items 2 and 3 only reach readers once deployed; the live site keeps its current
  behaviour until Pat says go.
- Opening a PR or merging either outstanding phase branch to `main`.
- Visual comparison against GitBook — there is no oracle left, and none was ever committed.
- The Pagefind search spot-check against exported GitBook search terms — Pat owns that export.
