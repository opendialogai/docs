# Phase 5 — Verification, Accessibility and Tidy-up Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close out the GitBook→Starlight migration: clear the live `sharp` advisory, fix the light-only theme for readers without JavaScript, make the verification checks reproducible and committed, audit accessibility with axe-core, and hand the alt-text work to the docs team as a work list.

**Architecture:** Four new scripts follow the existing `scripts/` pattern — pure logic in `scripts/lib/*.mjs` with `node:test` unit tests beside it, filesystem and network work in the top-level script. One new Astro integration rewrites the emitted `<html>` tag at `astro:build:done`. Phase 5's own scripts read content and report on it; none of them writes to `src/content/docs/`, and nothing in `source/` is mutated.

**Tech Stack:** Node 22+ ESM, `node:test`, Astro 7.1.5, Starlight 0.41.5, Playwright 1.62, axe-core (new devDependency), sharp 0.35.3 (bump).

## Global Constraints

Copied from `CLAUDE.md` and the design. Every task's requirements implicitly include this section.

- **`documentation` branch is read-only.** Never write to it.
- **`src/content/docs/` is hand-authored and is the source of truth.** Author pages in Starlight dialect. Phase 5's scripts still must not write to it.
- **Never run `npm run convert`.** It deletes `src/content/docs/` wholesale and rewrites it from the frozen `source/` snapshot. `assets.mjs` and `routes.mjs` are safe alone and must stay idempotent — same input, byte-identical output.
- **`source/` is pristine and git-ignored.** Scripts read from `source/`, write to `src/`. Never mutate `source/`.
- **URLs do not change.** Every path in `reference/sitemap-pages.xml` must resolve. This is a live-traffic guarantee.
- **Do not edit documentation prose.** Not typos, not broken links, not missing headings. Log it in `MIGRATION-NOTES.md`.
- **Do not set `run_worker_first`** in `wrangler.jsonc`.
- **Never make DNS changes.**
- **Do not fetch `reference/` files live.** They are committed snapshots and must outlive GitBook.
- **Never deploy, open a PR, or merge without asking Pat.**
- **Stop at the phase gate.** Report and wait.
- New scripts use **2-space indentation**, matching `scripts/routes.mjs` and `scripts/lib/*.mjs`. (`scripts/screenshots.mjs` uses tabs; it is the exception, not the pattern.)
- Every new module carries a JSDoc block explaining **why** it exists, in the voice of the existing modules.

## Measured baseline

These are current, measured on 2026-07-31 against a fresh `astro build`. A task that moves one of these numbers without explaining why has broken something.

| Measurement | Value |
|---|---|
| Unit tests passing | 235 |
| Built pages | 205 |
| `copySet` / `mapEntries` | 509 / 509 |
| `src/assets` size | 48.4 MiB (60 MB gate) |
| Largest asset | 4.0 MiB (25 MiB Cloudflare cap) |
| Built `<img>` elements | 746 |
| Built images with no `alt` attribute at all | 0 |
| Content images with empty `alt` (excl. covers) | 455 |
| Source-side empty-alt images | 392 figures + 5 bare + 58 markdown = 455 |
| Heading ids (excl. `_top`) | 1,211 |
| Content-area internal links | 2,650 |
| Content-area fragment links | 1,304 |
| Inherited broken links (`/broken/pages/…`) | 9 |
| Inherited broken anchors | 16 |

### Re-measured 2026-08-27, after merging `origin/main`

The merge brought in the April–August 2026 release notes, so four of the figures above have
moved for a legitimate reason. Judge against these instead:

| Measurement | Was | Now | Why |
|---|---|---|---|
| Unit tests passing | 235 | **261** | Phase 5 tasks added tests |
| Content-area internal links | 2,650 | **2,673** | +23 links in the new release-notes sections |
| Content-area fragment links | 1,304 | **1,323** | +19 |
| Heading ids (excl. `_top`) | 1,211 | **1,230** | +19: five new `<h2>`s and fourteen `<h4>`s |

Every other figure is unchanged — built pages 205, built `<img>` 746, empty-alt 455, inherited
defects 9 links / 16 anchors, `src/assets` 48.4 MiB, largest asset 4.0 MiB. The +19 headings and
+19 anchors agree exactly, which is the cross-check that the new content is the whole story.

**`npm run verify:images` exits 1 and did so before this merge**, at `dfb58cf`. It builds its
work list from `source/` but counts empty alts from `dist/`, and the two disagree 448 vs 455.
Retiring the pipeline makes that structural — see `MIGRATION-NOTES.md`. Fixing it means pointing
the work list at `src/content/docs/` rather than `source/`; it is Phase 5 work and is not done.

---

### Task 1: Bump sharp to 0.35.3 and re-encode every asset

Clears the live high-severity libvips advisory. `sharp` is the encoder, so the output bytes can change; `asset-map.json` caches on content hash, so **it must be deleted or the new version silently never runs**.

**Files:**
- Modify: `package.json` (the `sharp` dependency)
- Modify: `package-lock.json` (regenerated by npm)
- Delete then regenerate: `asset-map.json`
- Regenerate: `src/assets/**`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: a rebuilt `dist/` and `src/assets/` that every later task measures against.

**Preconditions:** `ffmpeg` must be on `PATH` — deleting `asset-map.json` forces the GIF→MP4 re-encode. Verify with `ffmpeg -version` before starting. Run every command from the repository root with absolute paths; a stray `cd` into `node_modules` has previously caused an install to write into a dependency's own `package.json`.

- [ ] **Step 1: Confirm the working tree is clean and record the baseline**

```bash
git status --short
npm test 2>&1 | tail -8
```

Expected: no output from `git status`; `# pass 235` and `# fail 0`.

- [ ] **Step 2: Confirm Astro accepts sharp 0.35**

```bash
node -e 'const a=require("astro/package.json");console.log(a.optionalDependencies?.sharp)'
```

Expected: `^0.34.0 || ^0.35.0`. If this does not include `0.35`, stop and report — the bump is not safe.

- [ ] **Step 3: Install sharp 0.35.3**

```bash
npm install sharp@^0.35.3
node -e 'console.log(require("sharp/package.json").version)'
```

Expected: `0.35.3`.

- [ ] **Step 4: Delete the asset cache and re-run the full pipeline**

```bash
rm asset-map.json
npm run convert 2>&1 | tail -20
```

Expected in the tail: `ok   copySet            509`, `ok   mapEntries         509`, an `ok` line for `src/assets size` under the gate, an `ok` line for `largest file`, and a non-zero `encoded` count with `reused from cache 0` — the cache was deleted, so nothing may be reused. **If `reused from cache` is non-zero, the delete did not take effect and the whole task is invalid.**

- [ ] **Step 5: Confirm the generated content did not move**

```bash
git status --short src/content/docs src/sidebar.generated.mjs
```

Expected: no output. The bump re-encodes asset bytes; it must not change a single markdown file. **If anything is listed, stop and report** — that is a finding, not something to commit through.

- [ ] **Step 6: Run the unit tests**

```bash
npm test 2>&1 | tail -8
```

Expected: `# pass 235`, `# fail 0`.

- [ ] **Step 7: Build**

```bash
npm run build 2>&1 | tail -5
```

Expected: `205 page(s) built`, `[build] Complete!`.

- [ ] **Step 8: Prove the pipeline is still idempotent**

```bash
find src/content/docs src/assets asset-map.json -type f | sort | xargs shasum -a 256 | shasum -a 256
npm run convert > /dev/null 2>&1
find src/content/docs src/assets asset-map.json -type f | sort | xargs shasum -a 256 | shasum -a 256
```

Expected: the two checksums are identical.

- [ ] **Step 9: Verify route parity is untouched**

```bash
node scripts/routes.mjs 2>&1 | tail -6
```

Expected: `unreachable 0`, `not live today 0`, `route parity: OK`.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json asset-map.json src/assets
git commit -m "Bump sharp to 0.35.3 and re-encode every asset

Clears the high-severity libvips advisory Dependabot flags on the default
branch. asset-map.json caches on content hash, so it was deleted before
re-running or every asset would have cache-hit and the new encoder would
never have taken effect.

copySet and mapEntries hold at 509, src/assets stays under the 60 MB gate
and src/content/docs is byte-identical."
```

---

### Task 2: Pin the light theme in the server-rendered HTML

Starlight hard-codes `data-theme="dark"` on `<html>` in its own `Page.astro`; our inline script corrects it at runtime, so a reader with JavaScript disabled gets a dark site when GitBook's was light-only. All 205 built pages currently carry the dark attribute.

**Files:**
- Create: `scripts/lib/light-theme.mjs`
- Create: `scripts/lib/light-theme.test.mjs`
- Modify: `astro.config.mjs` (add the integration)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `pinLightTheme(html: string) => string`, exported from `scripts/lib/light-theme.mjs`. Throws on any `<html>` tag that does not carry `data-theme="dark"`.

- [ ] **Step 1: Write the failing tests**

Create `scripts/lib/light-theme.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pinLightTheme } from './light-theme.mjs';

const page = (htmlTag) => `<!DOCTYPE html>${htmlTag}<head></head><body>x</body></html>`;

test('the dark attribute Starlight hard-codes becomes light', () => {
  const out = pinLightTheme(page('<html lang="en" dir="ltr" data-theme="dark">'));
  assert.match(out, /<html lang="en" dir="ltr" data-theme="light">/);
});

test('the other attributes on the tag are left alone', () => {
  const out = pinLightTheme(page('<html lang="en" data-theme="dark" data-has-toc data-has-sidebar class="a">'));
  assert.match(out, /<html lang="en" data-theme="light" data-has-toc data-has-sidebar class="a">/);
});

test('the rest of the document is untouched', () => {
  const body = '<body><p>data-theme="dark"</p></body>';
  const out = pinLightTheme(`<html data-theme="dark">${body}</html>`);
  assert.equal(out.includes(body), true);
});

// Starlight could stop hard-coding the attribute, or rename it, on any upgrade. Silently
// shipping the dark default to every reader without JavaScript is worse than a failed build,
// so an unexpected tag is rejected rather than passed through — the same guard convertFigures
// applies to a <figure> it does not recognise.
test('a page with no data-theme attribute is rejected', () => {
  assert.throws(() => pinLightTheme(page('<html lang="en">')), /data-theme="dark"/);
});

test('a page already pinned to light is rejected', () => {
  assert.throws(() => pinLightTheme(page('<html data-theme="light">')), /data-theme="dark"/);
});

test('a document with no html tag is rejected', () => {
  assert.throws(() => pinLightTheme('<body>x</body>'), /no <html> tag/);
});
```

- [ ] **Step 2: Run the tests and watch them fail**

```bash
node --test scripts/lib/light-theme.test.mjs
```

Expected: FAIL — `Cannot find module` for `./light-theme.mjs`.

- [ ] **Step 3: Write the implementation**

Create `scripts/lib/light-theme.mjs`:

```js
/**
 * Pins the colour scheme to light in the served bytes.
 *
 * Starlight hard-codes `data-theme="dark"` on <html> in its own Page.astro and relies on an
 * inline script to correct it, so a reader with JavaScript disabled gets the dark theme on a
 * site that ships light-only, as GitBook's did. Rewriting the attribute in the emitted HTML
 * puts the right value in the bytes Cloudflare serves without copying Starlight's 126-line
 * Page component, which would drift silently on every upgrade with nothing to signal it.
 *
 * ThemeProvider's inline script stays: `astro:build:done` does not run under `astro dev`, so
 * the script is what keeps the dev server light, and it holds up Starlight's
 * `StarlightThemeProvider.updatePickers` contract.
 */
const HTML_TAG = /<html\b[^>]*>/;
const DARK = 'data-theme="dark"';

/** The page with its <html> tag pinned to light. Throws on any tag that is not the expected shape. */
export function pinLightTheme(html) {
  const tag = html.match(HTML_TAG);
  if (!tag) throw new Error('pinLightTheme: no <html> tag');
  if (!tag[0].includes(DARK)) {
    throw new Error(`pinLightTheme: <html> does not carry ${DARK}: ${tag[0]}`);
  }
  return html.replace(HTML_TAG, (found) => found.replace(DARK, 'data-theme="light"'));
}
```

- [ ] **Step 4: Run the tests and watch them pass**

```bash
node --test scripts/lib/light-theme.test.mjs
npm test 2>&1 | tail -8
```

Expected: the new file passes; the suite reports `# pass 241`, `# fail 0`.

- [ ] **Step 5: Wire the integration into astro.config.mjs**

Add these imports at the top of `astro.config.mjs`, below the existing ones:

```js
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { pinLightTheme } from './scripts/lib/light-theme.mjs';
```

Add this integration definition above `export default defineConfig({`:

```js
/**
 * Rewrites the colour scheme Starlight hard-codes into every emitted page.
 *
 * @type {import('astro').AstroIntegration}
 */
const pinLightThemeIntegration = {
  name: 'pin-light-theme',
  hooks: {
    'astro:build:done': ({ dir, logger }) => {
      const out = fileURLToPath(dir);
      const pages = readdirSync(out, { recursive: true }).filter((f) => String(f).endsWith('.html'));
      if (!pages.length) throw new Error('pin-light-theme: no HTML pages in the build output');
      for (const page of pages) {
        const path = `${out}/${page}`;
        writeFileSync(path, pinLightTheme(readFileSync(path, 'utf8')));
      }
      logger.info(`pinned data-theme="light" on ${pages.length} pages`);
    },
  },
};
```

Then add it to the `integrations` array, after the `starlight({...})` entry:

```js
    pinLightThemeIntegration,
```

Note on the guard: the design spoke of asserting the rewritten count equals Astro's page count. Per-file rejection inside `pinLightTheme` is strictly stronger — every single page must carry the expected tag or the build fails — so the integration only needs to reject an empty build.

- [ ] **Step 6: Build and verify the emitted attribute**

```bash
npm run build 2>&1 | grep -E "pin-light-theme|page\(s\) built"
grep -c 'data-theme="light"' dist/index.html
grep -rl 'data-theme="dark"' --include='*.html' dist | wc -l
grep -rl 'data-theme="light"' --include='*.html' dist | wc -l
```

Expected: the log line reports `pinned data-theme="light" on 205 pages`, `205 page(s) built`, **0** pages carrying dark, **205** carrying light.

- [ ] **Step 7: Confirm the dev server is unaffected**

```bash
npm run dev &
sleep 4
curl -s http://localhost:4321/ | grep -o '<html[^>]*>'
kill %1
```

Expected: the dev server's `<html>` still carries `data-theme="dark"` — `astro:build:done` does not run in dev, and `ThemeProvider`'s inline script is what corrects it there. That is the intended split; do not "fix" it.

- [ ] **Step 8: Commit**

```bash
git add scripts/lib/light-theme.mjs scripts/lib/light-theme.test.mjs astro.config.mjs
git commit -m "Serve the light theme to readers without JavaScript

Starlight hard-codes data-theme=\"dark\" on <html> and relies on an inline
script to correct it, so JavaScript-disabled readers got a dark site where
GitBook served light. An astro:build:done hook rewrites the attribute in the
emitted HTML, which avoids copying Starlight's 126-line Page component and
the silent drift that copy would carry across upgrades.

Rejects any page whose <html> tag is not the expected shape rather than
passing it through."
```

---

### Task 3: `verify-links.mjs` — internal links and anchors, gated on regressions

Phase 4 measured links and anchors with a script that was never committed, so its claims are not reproducible and its coverage is unknown. This commits the check. It gates on *regressions*: 25 defects are inherited from GitBook, present in `source/`, and forbidden from being fixed here, so they live in an inventory the script reads.

**Files:**
- Create: `scripts/lib/dist-links.mjs`
- Create: `scripts/lib/dist-links.test.mjs`
- Create: `scripts/verify-links.mjs`
- Create: `reports/inherited-broken-links.json`
- Modify: `package.json` (add the `verify:links` script)

**Interfaces:**
- Consumes: `dist/` from Task 2's build.
- Produces, all exported from `scripts/lib/dist-links.mjs`:
  - `pageUrl(relativePath: string) => string` — `'a/b/index.html'` → `'/a/b'`, `'index.html'` → `'/'`, `'404.html'` → `'/404'`
  - `extractHrefs(html: string) => string[]`
  - `extractIds(html: string) => Set<string>`
  - `resolveHref(fromUrl: string, href: string) => { path: string, hash: string } | null` — `null` when the href points off-site or is empty

- [ ] **Step 1: Write the failing tests**

Create `scripts/lib/dist-links.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pageUrl, extractHrefs, extractIds, resolveHref } from './dist-links.mjs';

test('a page directory maps to its URL without a trailing slash', () => {
  assert.equal(pageUrl('core-concepts/interpreters/index.html'), '/core-concepts/interpreters');
});

test('the root index maps to /', () => {
  assert.equal(pageUrl('index.html'), '/');
});

test('a standalone html file keeps its own name', () => {
  assert.equal(pageUrl('404.html'), '/404');
});

test('hrefs are read regardless of the attributes around them', () => {
  const html = '<a class="x" href="/a">A</a><a href="/b" data-y>B</a>';
  assert.deepEqual(extractHrefs(html), ['/a', '/b']);
});

test('ids are collected from any element', () => {
  const ids = extractIds('<h2 id="one">x</h2><div id="two"></div>');
  assert.deepEqual([...ids].sort(), ['one', 'two']);
});

test('a root-relative href resolves to itself', () => {
  assert.deepEqual(resolveHref('/a/b', '/c/d'), { path: '/c/d', hash: '' });
});

test('a fragment-only href resolves to the page it sits on', () => {
  assert.deepEqual(resolveHref('/a/b', '#section'), { path: '/a/b', hash: 'section' });
});

test('a trailing slash is normalised away so both spellings compare equal', () => {
  assert.deepEqual(resolveHref('/a/b', '/c/'), { path: '/c', hash: '' });
});

test('a percent-encoded fragment is decoded to match the id it names', () => {
  assert.deepEqual(resolveHref('/a', '/b#caf%C3%A9'), { path: '/b', hash: 'café' });
});

test('external and non-http schemes are skipped', () => {
  assert.equal(resolveHref('/a', 'https://example.com'), null);
  assert.equal(resolveHref('/a', 'mailto:x@example.com'), null);
  assert.equal(resolveHref('/a', '//example.com/x'), null);
  assert.equal(resolveHref('/a', ''), null);
});
```

- [ ] **Step 2: Run the tests and watch them fail**

```bash
node --test scripts/lib/dist-links.test.mjs
```

Expected: FAIL — `Cannot find module` for `./dist-links.mjs`.

- [ ] **Step 3: Write the implementation**

Create `scripts/lib/dist-links.mjs`:

```js
/**
 * Reads the links, in-page anchors and element ids out of a built page.
 *
 * The built output is the only honest place to check a link: convert.mjs rewrites relative
 * .md links, rehype rewrites headings into slugs, and Starlight adds navigation of its own,
 * so a check against source/ would measure something no reader ever loads.
 *
 * Every internal href Starlight emits is root-relative or a bare fragment — measured across
 * all 205 pages — but relative destinations resolve correctly anyway, so a future component
 * that emits one is handled rather than silently skipped.
 */
const ANCHOR = /<a\b[^>]*\shref="([^"]*)"/g;
const ID = /\sid="([^"]*)"/g;
const OFF_SITE = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

/** The URL a built file is served at, with no trailing slash. */
export function pageUrl(relativePath) {
  const url = `/${relativePath.replace(/(?:^|\/)index\.html$/, '').replace(/\.html$/, '')}`;
  return url.replace(/\/$/, '') || '/';
}

/** Every href on the page, in document order. */
export function extractHrefs(html) {
  return [...html.matchAll(ANCHOR)].map((m) => m[1]);
}

/** Every element id on the page. */
export function extractIds(html) {
  return new Set([...html.matchAll(ID)].map((m) => m[1]));
}

/**
 * Where an href found on `fromUrl` points, or null when it leaves the site.
 *
 * The fragment is decoded because an id attribute holds the decoded character while the href
 * holds it percent-encoded, and comparing the two raw would report a working anchor as broken.
 */
export function resolveHref(fromUrl, href) {
  if (!href || OFF_SITE.test(href)) return null;
  const [target, ...rest] = href.split('#');
  const hash = rest.join('#');
  const path = target === '' ? fromUrl : new URL(target, `https://site${fromUrl}`).pathname;
  return { path: path.replace(/\/$/, '') || '/', hash: hash ? decodeURIComponent(hash) : '' };
}
```

- [ ] **Step 4: Run the tests and watch them pass**

```bash
node --test scripts/lib/dist-links.test.mjs
```

Expected: all 10 pass.

- [ ] **Step 5: Write the inventory of inherited defects**

Create `reports/inherited-broken-links.json`. These are content defects that came across from GitBook, are present in `source/`, and are forbidden from being fixed here by the no-editing-prose rule. Every `link` entry points at a `/broken/pages/<id>` marker GitBook emitted for an already-deleted page; every `anchor` entry names a heading that exists nowhere on the target page.

```json
{
  "note": "Content defects inherited from GitBook, present in source/ and broken on GitBook too. The no-editing-prose rule forbids fixing them here; they are logged in MIGRATION-NOTES.md for the docs team. verify-links.mjs treats these as known, fails on anything new, and fails on any entry that is no longer broken so the list cannot rot.",
  "links": [
    { "from": "/", "href": "/broken/pages/2lcI5UfFruOL0M8VSp3d" },
    { "from": "/", "href": "/broken/pages/EVpERlszmNSb5PDKaprI" },
    { "from": "/", "href": "/broken/pages/-M_drTg0DF70xMVqRlyG" },
    { "from": "/core-concepts/the-opendialog-workspace", "href": "/broken/pages/QXiLofFtrSva3tSBJilT" },
    { "from": "/release-notes/release-notes", "href": "/broken/pages/Yh2t7P90PzNprbtTVwtP" },
    { "from": "/release-notes/release-notes", "href": "/broken/pages/-MQM33QbO3LxSgzz40Lm" },
    { "from": "/opendialog-platform/interpreters-and-natural-language-understanding/llm-actions", "href": "/broken/pages/h1Nv4EMKFW0n10de3P6a" },
    { "from": "/opendialog-platform/conversation-designer/conversation-design/conversational-patterns/recommendations", "href": "/broken/pages/EMMG991zfA7rFesrsyIP" },
    { "from": "/opendialog-platform/interpreters-and-natural-language-understanding/interpreters/available-interpreters/openai-interpreter", "href": "/broken/pages/ctW05MISDAG5zCohAvji" }
  ],
  "anchors": [
    "/opendialog-platform/monitoring-your-application#message-table",
    "/opendialog-platform/conversation-designer/message-design/using-attributes-in-messages#available-filters",
    "/opendialog-platform/conversation-designer/message-design/message-editor#message-types",
    "/opendialog-platform/interpreters-and-natural-language-understanding/language-services/semantic-intent-classifier#attributes-and-values",
    "/opendialog-platform/interpreters-and-natural-language-understanding/llm-actions#user-utterance-response-exclusion-list",
    "/core-concepts/contexts-and-attributes/about-attributes#multiple-value-attribute-types-collections-and-composites",
    "/opendialog-platform/conversation-designer/message-design/message-types/address-autocomplete-message#properties",
    "/opendialog-platform/conversation-designer/message-design/message-types/attribute-message#what-is-a-list-message-3",
    "/opendialog-platform/conversation-designer/message-design/message-types/button-message#properties",
    "/opendialog-platform/conversation-designer/message-design/message-types/conversation-handover-message#properties",
    "/opendialog-platform/conversation-designer/message-design/message-types/date-picker-message#when-to-use-date-picker-messages",
    "/opendialog-platform/conversation-designer/message-design/message-types/e-sign-message#properties",
    "/opendialog-platform/conversation-designer/message-design/message-types/form-message#properties",
    "/opendialog-platform/conversation-designer/message-design/message-types/full-page-message#properties",
    "/opendialog-platform/conversation-designer/message-design/message-types/location-message#properties",
    "/opendialog-platform/conversation-designer/message-design/message-types/rich-message#via-the-no-code-text-message-in-message-editor"
  ]
}
```

- [ ] **Step 6: Write the verification script**

Create `scripts/verify-links.mjs`:

```js
/**
 * Checks every internal link and in-page anchor in the built site.
 *
 * Gates on regressions, not on absolute health: 25 of the defects it finds came across from
 * GitBook, are present in source/, and cannot be fixed here without editing documentation
 * prose. Those live in reports/inherited-broken-links.json. Anything outside that inventory
 * fails the run, and so does an inventory entry that is no longer broken, so the list cannot
 * quietly rot into an excuse.
 *
 * A link target is a page when the build emitted HTML for it, and a file when the build
 * emitted anything else at that path — the one CSV and the one MP4 are linked from prose and
 * are real destinations, not broken pages.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractHrefs, extractIds, pageUrl, resolveHref } from './lib/dist-links.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = `${root}/dist`;
const INVENTORY = `${root}/reports/inherited-broken-links.json`;

if (!existsSync(DIST)) {
  console.error('dist/ not found — run `npm run build` first');
  process.exit(1);
}

const inventory = JSON.parse(readFileSync(INVENTORY, 'utf8'));
const knownLinks = new Set(inventory.links.map((l) => `${l.from} -> ${l.href}`));
const knownAnchors = new Set(inventory.anchors);

const files = readdirSync(DIST, { recursive: true })
  .map(String)
  .filter((f) => f.endsWith('.html'));

const pages = new Map();
for (const file of files) {
  const html = readFileSync(`${DIST}/${file}`, 'utf8');
  pages.set(pageUrl(file), {
    html,
    main: html.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? '',
    ids: extractIds(html),
  });
}

const stats = { links: 0, anchors: 0 };
const brokenLinks = [];
const brokenAnchors = [];
const hitLinks = new Set();
const hitAnchors = new Set();

for (const [url, page] of pages) {
  for (const href of extractHrefs(page.main)) {
    const dest = resolveHref(url, href);
    if (!dest) continue;
    dest.hash ? stats.anchors++ : stats.links++;
    const target = pages.get(dest.path);
    if (!target) {
      // Not a page. A real file the build emitted — the CSV, the MP4 — is a valid destination.
      if (existsSync(`${DIST}${dest.path}`)) continue;
      const key = `${url} -> ${href}`;
      knownLinks.has(key) ? hitLinks.add(key) : brokenLinks.push(key);
      continue;
    }
    if (!dest.hash || target.ids.has(dest.hash)) continue;
    const key = `${dest.path}#${dest.hash}`;
    knownAnchors.has(key) ? hitAnchors.add(key) : brokenAnchors.push(`${url} -> ${href}`);
  }
}

const staleLinks = [...knownLinks].filter((k) => !hitLinks.has(k));
const staleAnchors = [...knownAnchors].filter((k) => !hitAnchors.has(k));

console.log(`pages              : ${pages.size}`);
console.log(`content links      : ${stats.links}`);
console.log(`content anchors    : ${stats.anchors}`);
console.log(`inherited defects  : ${hitLinks.size} links, ${hitAnchors.size} anchors`);
console.log(`new broken links   : ${brokenLinks.length}`);
console.log(`new broken anchors : ${brokenAnchors.length}`);

for (const [label, list] of [
  ['\nInternal links with no target:', brokenLinks],
  ['\nAnchors with no matching id:', brokenAnchors],
  ['\nInventory entries that now resolve — remove them:', [...staleLinks, ...staleAnchors]],
]) {
  if (!list.length) continue;
  console.error(label);
  for (const item of list) console.error(`  ${item}`);
}

if (brokenLinks.length || brokenAnchors.length || staleLinks.length || staleAnchors.length) {
  process.exit(1);
}
console.log('\nlink check: OK');
```

- [ ] **Step 7: Run it**

```bash
node scripts/verify-links.mjs
```

Expected exactly:

```
pages              : 205
content links      : 2650
content anchors    : 1304
inherited defects  : 9 links, 16 anchors
new broken links   : 0
new broken anchors : 0

link check: OK
```

If `content links` or `content anchors` differs from 2,650 / 1,304, Task 1 or Task 2 changed the content — stop and find out why before continuing.

- [ ] **Step 8: Add the npm script**

In `package.json`, add to `scripts`:

```json
    "verify:links": "node scripts/verify-links.mjs",
```

Confirm with `npm run verify:links`.

- [ ] **Step 9: Commit**

```bash
git add scripts/lib/dist-links.mjs scripts/lib/dist-links.test.mjs scripts/verify-links.mjs reports/inherited-broken-links.json package.json
git commit -m "Commit the internal link and anchor check

Phase 4 measured both with an ad hoc script that was never committed, so
neither claim was reproducible. This checks all 2,650 content links and
1,304 anchors across the built site.

It gates on regressions rather than absolute health: 9 links point at
GitBook's own /broken/pages markers and 16 anchors name headings that exist
on no page, all present in source/ and all broken on GitBook too. They are
inventoried, and the check also fails on an inventory entry that has started
resolving, so the list cannot rot."
```

---

### Task 4: `verify-live.mjs` — the 204 live URLs

The acceptance test is that every URL in the live sitemap still resolves on `docs.opendialog.ai`. This is now a live-traffic guarantee. Phase 4 checked it ad hoc; this commits it.

**Files:**
- Create: `scripts/verify-live.mjs`
- Modify: `package.json` (add the `verify:live` script)

**Interfaces:**
- Consumes: `reference/sitemap-pages.xml` — a committed snapshot. Never fetch it live.
- Produces: nothing other tasks import.

- [ ] **Step 1: Write the script**

Create `scripts/verify-live.mjs`:

```js
/**
 * Fetches every URL the live GitBook sitemap listed and reports anything that is not 200.
 *
 * The site is cut over, so this is a check on production traffic rather than a pre-launch
 * target. GitBook no longer answers on the domain, so reference/sitemap-pages.xml is the only
 * surviving record of what the URL set was; it is a committed snapshot and is read from disk,
 * never fetched, so it outlives GitBook.
 *
 * The CSV, the MP4 and the sitemap index are checked alongside the pages: none appears in the
 * sitemap, all three are reachable from prose or from crawlers, and all three would be easy to
 * lose in an asset-pipeline change without a single page 404ing.
 *
 * Usage:
 *   node scripts/verify-live.mjs                        # https://docs.opendialog.ai
 *   node scripts/verify-live.mjs https://staging.example # any other origin
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITEMAP = `${root}/reference/sitemap-pages.xml`;
const CONCURRENCY = 8;

const base = (process.argv[2] ?? 'https://docs.opendialog.ai').replace(/\/$/, '');

const paths = [
  ...[...readFileSync(SITEMAP, 'utf8').matchAll(/<loc>([^<]*)<\/loc>/g)]
    .map((m) => m[1].replace(/^https:\/\/docs\.opendialog\.ai/, '').replace(/\/$/, ''))
    .map((p) => p || '/'),
  '/files/deliveryknowledgebase.csv',
  '/media/knowledge-base-demo.mp4',
  '/sitemap-index.xml',
];

/** Runs `worker` over `items` at a fixed concurrency, preserving input order in the result. */
async function pooled(items, worker) {
  const results = new Array(items.length);
  let next = 0;
  const runners = Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i]);
    }
  });
  await Promise.all(runners);
  return results;
}

console.log(`checking ${paths.length} URLs against ${base}\n`);

const results = await pooled(paths, async (path) => {
  try {
    const response = await fetch(`${base}${path}`, { redirect: 'manual' });
    return { path, status: response.status, location: response.headers.get('location') };
  } catch (error) {
    return { path, status: 0, error: error.message };
  }
});

const failures = results.filter((r) => r.status !== 200);

console.log(`checked            : ${results.length}`);
console.log(`serving 200        : ${results.length - failures.length}`);
console.log(`not 200            : ${failures.length}`);

if (failures.length) {
  console.error('\nURLs not serving 200:');
  for (const f of failures) {
    console.error(`  ${String(f.status).padEnd(4)} ${f.path}${f.location ? ` -> ${f.location}` : ''}${f.error ? ` (${f.error})` : ''}`);
  }
  process.exit(1);
}
console.log('\nlive check: OK');
```

`redirect: 'manual'` matters: a 301 to a trailing-slash variant would otherwise be followed and reported as 200, hiding exactly the redirect hop `trailingSlash: 'never'` exists to prevent.

- [ ] **Step 2: Run it against production**

```bash
node scripts/verify-live.mjs
```

Expected: `checked 207`, `serving 200 207`, `not 200 0`, `live check: OK`. This reads the live site only; it changes nothing.

- [ ] **Step 3: Add the npm script**

In `package.json`, add to `scripts`:

```json
    "verify:live": "node scripts/verify-live.mjs",
```

- [ ] **Step 4: Commit**

```bash
git add scripts/verify-live.mjs package.json
git commit -m "Commit the live URL check

Fetches all 204 URLs from the committed sitemap snapshot plus the CSV, the
MP4 and the sitemap index, and fails on anything not 200. Phase 4 ran this
ad hoc and never committed it, so the claim could not be reproduced.

Redirects are not followed: a 301 to a trailing-slash variant would
otherwise report as 200 and hide the redirect hop trailingSlash: 'never'
exists to prevent."
```

---

### Task 5: `verify-images.mjs` — image check and the alt-text work list

Two jobs. The blocking half is `MIGRATION-BRIEF.md`'s Phase 5 item 3 done statically. The report half hands the 455 empty-alt images to the docs team, because writing alt text here would be authoring documentation prose and would be destroyed by the next `npm run convert`.

**Files:**
- Modify: `scripts/lib/figures.mjs` (export three existing constants — no behaviour change)
- Create: `scripts/lib/alt-audit.mjs`
- Create: `scripts/lib/alt-audit.test.mjs`
- Create: `scripts/verify-images.mjs`
- Create: `reports/alt-text-todo.md` (generated)
- Modify: `package.json` (add the `verify:images` script)

**Interfaces:**
- Consumes: `route-map.json` (array of `{ source, url, target, title, section }`), `source/**/*.md`, `dist/`.
- Produces: `emptyAltImages(text: string) => Array<{ asset: string, caption: string }>`, exported from `scripts/lib/alt-audit.mjs`. `asset` is the bare GitBook asset filename; `caption` is the plain-text `<figcaption>`, or `''`.

- [ ] **Step 1: Export the shared patterns from figures.mjs**

In `scripts/lib/figures.mjs`, add the `export` keyword to three existing declarations. Change nothing else — these are the patterns 430 figures already depend on, and the audit must read the corpus the same way the converter does rather than with a second set of regexes that can drift.

```js
export const FIGURE = /<figure>\s*<img\s+([^>]*?)>\s*(?:<figcaption>([\s\S]*?)<\/figcaption>)?\s*<\/figure>/g;
```

```js
export const ASSET_IMAGE = /!\[([^\]]*)\]\((<[^>]*>|[^)]*(?:\([^)]*\)[^)]*)*)\)/g;
```

```js
/** Plain-text form of a <figcaption>, keeping <code> spans as backticks since GitBook's export
 * uses them to mark an attribute name inline; every other tag carries no information the
 * italic caption needs. */
export function captionText(caption) {
```

- [ ] **Step 2: Confirm nothing broke**

```bash
npm test 2>&1 | tail -8
```

Expected: `# pass 251`, `# fail 0` — adding `export` changes no behaviour. (235 at baseline, plus 6 from Task 2 and 10 from Task 3.)

- [ ] **Step 3: Write the failing tests**

Create `scripts/lib/alt-audit.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyAltImages } from './alt-audit.mjs';

test('a captioned figure with an empty alt is reported with its caption', () => {
  const md = '<figure><img src="../.gitbook/assets/image (14).png" alt=""><figcaption>A caption</figcaption></figure>';
  assert.deepEqual(emptyAltImages(md), [{ asset: 'image (14).png', caption: 'A caption' }]);
});

test('a figure that already has alt text is not reported', () => {
  const md = '<figure><img src="../.gitbook/assets/a.png" alt="Described"><figcaption>Cap</figcaption></figure>';
  assert.deepEqual(emptyAltImages(md), []);
});

test('an uncaptioned figure is reported with an empty caption', () => {
  const md = '<figure><img src="../.gitbook/assets/b.png" alt=""><figcaption></figcaption></figure>';
  assert.deepEqual(emptyAltImages(md), [{ asset: 'b.png', caption: '' }]);
});

test('a bare img outside any figure is reported', () => {
  assert.deepEqual(emptyAltImages('<img src="../.gitbook/assets/c.png" alt="">'), [{ asset: 'c.png', caption: '' }]);
});

test('a markdown image with no alt text is reported', () => {
  assert.deepEqual(emptyAltImages('![](../.gitbook/assets/d.png)'), [{ asset: 'd.png', caption: '' }]);
});

// 1,317 asset filenames hold a space or a parenthesis, and GitBook wraps those paths in angle
// brackets. Missing this form would under-report the work list and read as progress.
test('an angle-bracketed path with parentheses is read correctly', () => {
  assert.deepEqual(emptyAltImages('![](<../.gitbook/assets/image (149).png>)'), [
    { asset: 'image (149).png', caption: '' },
  ]);
});

test('a markdown image that carries alt text is not reported', () => {
  assert.deepEqual(emptyAltImages('![A screenshot](../.gitbook/assets/e.png)'), []);
});

test('an image inside a code fence is not a real image', () => {
  const md = '```html\n<img src="../.gitbook/assets/f.png" alt="">\n```';
  assert.deepEqual(emptyAltImages(md), []);
});

test('an image that is not a GitBook asset is skipped', () => {
  assert.deepEqual(emptyAltImages('![](https://example.com/x.png)'), []);
});

test('caption markup is reduced to text, keeping code spans as backticks', () => {
  const md = '<figure><img src="../.gitbook/assets/g.png" alt=""><figcaption>Set <code>name</code> here</figcaption></figure>';
  assert.deepEqual(emptyAltImages(md), [{ asset: 'g.png', caption: 'Set `name` here' }]);
});
```

- [ ] **Step 4: Run the tests and watch them fail**

```bash
node --test scripts/lib/alt-audit.test.mjs
```

Expected: FAIL — `Cannot find module` for `./alt-audit.mjs`.

- [ ] **Step 5: Write the implementation**

Create `scripts/lib/alt-audit.mjs`:

```js
/**
 * Finds the images that ship with no text alternative, and the caption each one already has.
 *
 * Read from source/ rather than from the build because the fix belongs in GitBook: alt text
 * written there rides back through convert.mjs on the next sync, while anything written into
 * src/content/docs/ is destroyed by the next run. The rows therefore name what a writer sees
 * in GitBook — the asset filename and the caption — not a hashed build artefact.
 *
 * Deriving alt from the caption was considered and rejected: 303 of the 455 already sit in a
 * <figure> whose <figcaption> is announced, so copying it into alt makes a screen reader read
 * the same sentence twice, and the 152 with no caption — 123 of them full screenshots — would
 * still have nothing.
 */
import { protectCode } from './segments.mjs';
import { ASSET_SRC, unescapeAssetName } from './asset-refs.mjs';
import { ASSET_IMAGE, FIGURE, captionText } from './figures.mjs';

const BARE_IMG = /<img\s+([^>]*?)>/g;

/** The bare GitBook asset filename a reference names, or null when it is not one. */
function assetName(src) {
  const clean = src.trim().replace(/^<|>$/g, '');
  const match = clean.match(ASSET_SRC);
  return match ? unescapeAssetName(match[1]) : null;
}

const altOf = (attrs) => attrs.match(/alt="([^"]*)"/)?.[1] ?? '';
const srcOf = (attrs) => attrs.match(/src="([^"]*)"/)?.[1] ?? '';

/**
 * Every image in a source file that would ship with an empty alt, in document order.
 *
 * Figures are consumed first so their <img> is not counted twice by the bare-image pass, the
 * same ordering convertFigures relies on.
 */
export function emptyAltImages(text) {
  const found = [];
  const record = (src, caption) => {
    const asset = assetName(src);
    if (asset) found.push({ asset, caption });
  };
  protectCode(text, (masked) => {
    const withoutFigures = masked.replace(FIGURE, (_, attrs, caption) => {
      if (!altOf(attrs)) record(srcOf(attrs), captionText(caption));
      return '';
    });
    for (const [, attrs] of withoutFigures.matchAll(BARE_IMG)) {
      if (!altOf(attrs)) record(srcOf(attrs), '');
    }
    for (const [, alt, destination] of withoutFigures.matchAll(ASSET_IMAGE)) {
      if (!alt) record(destination, '');
    }
    return masked;
  });
  return found;
}
```

- [ ] **Step 6: Run the tests and watch them pass**

```bash
node --test scripts/lib/alt-audit.test.mjs
npm test 2>&1 | tail -8
```

Expected: all 10 new tests pass; the suite reports `# pass 261`, `# fail 0`.

- [ ] **Step 7: Write the verification script**

Create `scripts/verify-images.mjs`:

```js
/**
 * Checks every image in the built site and writes the alt-text work list.
 *
 * Blocking: every <img> carries an alt attribute, and every <img> src resolves to a file the
 * build actually emitted. That is the brief's Phase 5 image check, done against the bytes on
 * disk rather than over the network.
 *
 * Reporting: the 455 content images that ship with an empty alt, written to
 * reports/alt-text-todo.md for the docs team to fill in GitBook. The row count is checked
 * against the built output, because a report derived from source/ that has drifted from what
 * ships would read as complete work while describing a site nobody is serving.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { emptyAltImages } from './lib/alt-audit.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = `${root}/dist`;
const OUT = `${root}/reports/alt-text-todo.md`;

if (!existsSync(DIST)) {
  console.error('dist/ not found — run `npm run build` first');
  process.exit(1);
}

const routes = JSON.parse(readFileSync(`${root}/route-map.json`, 'utf8'));

// --- the built site -------------------------------------------------------

const files = readdirSync(DIST, { recursive: true })
  .map(String)
  .filter((f) => f.endsWith('.html'));

let images = 0;
const noAltAttribute = [];
const missingFiles = [];
let emptyAltInBuild = 0;
let coverImages = 0;

for (const file of files) {
  const html = readFileSync(`${DIST}/${file}`, 'utf8');
  const main = html.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? '';
  const covers = [...main.matchAll(/<a\b[^>]*cover-card[\s\S]*?<\/a>/g)].map((m) => m[0]).join('');
  const coverTags = new Set([...covers.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]));
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    images++;
    const value = tag.match(/\balt="([^"]*)"/);
    // Astro serialises alt="" as a bare `alt`, which is present-and-empty, not missing.
    if (!value && !/\balt(?=[\s>])/.test(tag)) noAltAttribute.push(`${file}: ${tag.slice(0, 120)}`);
    const src = tag.match(/\bsrc="([^"]*)"/)?.[1];
    if (src?.startsWith('/') && !existsSync(`${DIST}${src.split('?')[0]}`)) {
      missingFiles.push(`${file}: ${src}`);
    }
    if (!main.includes(tag)) continue; // page chrome: the logo
    if (coverTags.has(tag)) { coverImages++; continue; }
    if (!value?.[1]) emptyAltInBuild++;
  }
}

// --- the work list --------------------------------------------------------

const rows = [];
for (const route of routes) {
  const text = readFileSync(`${root}/source/${route.source}`, 'utf8');
  for (const image of emptyAltImages(text)) {
    rows.push({ url: route.url, title: route.title, ...image });
  }
}

const withCaption = rows.filter((r) => r.caption).length;
const escapePipes = (s) => s.replace(/\|/g, '\\|');

const report = [
  '# Images with no alt text',
  '',
  'Generated by `node scripts/verify-images.mjs`. Do not edit by hand.',
  '',
  `${rows.length} images across the documentation ship with an empty \`alt\` attribute, so a`,
  'screen reader announces nothing for them.',
  '',
  'The fix belongs in GitBook. Alt text written there rides back through the conversion on the',
  'next sync; anything written into the generated content in this repository is destroyed by',
  'the next run.',
  '',
  `${withCaption} of these sit under a visible caption, reproduced below — the caption is`,
  'already announced, so alt text for those should describe what the image *shows* rather than',
  `repeat it. The remaining ${rows.length - withCaption} have no caption and no alt: they are`,
  'announced as nothing at all, and are the ones worth doing first.',
  '',
  '| Page | Image | Existing caption |',
  '|---|---|---|',
  ...rows.map((r) => `| [${escapePipes(r.title)}](https://docs.opendialog.ai${r.url}) | \`${escapePipes(r.asset)}\` | ${escapePipes(r.caption)} |`),
  '',
].join('\n');

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, report);

// --- results --------------------------------------------------------------

console.log(`built images       : ${images}`);
console.log(`no alt attribute   : ${noAltAttribute.length}`);
console.log(`src with no file   : ${missingFiles.length}`);
console.log(`cover images       : ${coverImages}`);
console.log(`empty alt in build : ${emptyAltInBuild}`);
console.log(`work-list rows     : ${rows.length} (${withCaption} with a caption)`);
console.log(`\nwrote ${OUT}`);

for (const [label, list] of [
  ['\nImages with no alt attribute at all:', noAltAttribute],
  ['\nImages whose src the build did not emit:', missingFiles],
]) {
  if (!list.length) continue;
  console.error(label);
  for (const item of list) console.error(`  ${item}`);
}

if (rows.length !== emptyAltInBuild) {
  console.error(
    `\nThe work list has ${rows.length} rows but the build ships ${emptyAltInBuild} empty-alt` +
      ' content images. The report describes a site that is not being served.'
  );
}

if (noAltAttribute.length || missingFiles.length || rows.length !== emptyAltInBuild) process.exit(1);
console.log('\nimage check: OK');
```

- [ ] **Step 8: Run it**

```bash
node scripts/verify-images.mjs
```

Expected exactly:

```
built images       : 746
no alt attribute   : 0
src with no file   : 0
cover images       : 13
empty alt in build : 455
work-list rows     : 455 (303 with a caption)
```

then `image check: OK`. If the row count and the build count disagree, the join is wrong — fix `alt-audit.mjs`, not the expectation.

- [ ] **Step 9: Read the generated report**

Open `reports/alt-text-todo.md` and read the first twenty rows. Confirm the URLs are real, the asset filenames match what is in `.gitbook/assets`, and captions with a pipe character have not broken the table. This is a document another team will act on; a malformed table is a real defect.

- [ ] **Step 10: Add the npm script**

In `package.json`, add to `scripts`:

```json
    "verify:images": "node scripts/verify-images.mjs",
```

- [ ] **Step 11: Commit**

```bash
git add scripts/lib/figures.mjs scripts/lib/alt-audit.mjs scripts/lib/alt-audit.test.mjs scripts/verify-images.mjs reports/alt-text-todo.md package.json
git commit -m "Check built images and publish the alt-text work list

Blocking: every <img> in the build carries an alt attribute and resolves to
a file the build emitted.

Reporting: the 455 content images that ship with an empty alt, with the live
URL, the GitBook asset filename and the existing caption where there is one.
Writing the alt text here would be authoring documentation prose and would
be destroyed by the next conversion run, so the work list goes to the docs
team to fill in GitBook, where it rides back through the pipeline.

The row count is checked against the built output so a report that has
drifted from what ships fails rather than reading as complete."
```

---

### Task 6: axe-core accessibility audit

Measures the two questions Phase 4 left open — the `<a>` nested inside a `<summary>` in a linked sidebar group, and `CoverCard`'s deliberate `alt=""` — instead of reasoning about them.

**Files:**
- Create: `scripts/axe.mjs`
- Modify: `package.json` (add `axe-core` devDependency and the `verify:a11y` script)

**Interfaces:**
- Consumes: `dist/` from the build.
- Produces: console output only. No committed artefact until the findings are triaged in Step 5.

- [ ] **Step 1: Install axe-core**

```bash
npm install --save-dev axe-core
node -e 'console.log(require("axe-core/package.json").version)'
```

Run from the repository root. Expected: a 4.x version.

- [ ] **Step 2: Write the script**

Create `scripts/axe.mjs`:

```js
/**
 * Runs axe-core over a sample of built pages and reports the violations.
 *
 * The sample is chosen to cover the constructs this migration introduced rather than to be
 * representative traffic: the figure/figcaption pairs rehype-figures emits, the <Steps> list
 * that once failed the build outright, the CoverCard covers restored in Phase 4, and the
 * linked sidebar group whose row nests an <a> inside a <summary>. A deep page is included so
 * that group renders expanded.
 *
 * Serves dist/ through `astro preview` rather than file:// so root-relative hrefs, the CSS
 * cascade and Pagefind all behave as they do in production.
 */
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
// axe-core is CommonJS. Node's named-export detection does not reliably see `source` on it,
// so the default import is taken and the property read from it.
import axe from 'axe-core';

const axeSource = axe.source;

const PORT = 4331;
const BASE = `http://localhost:${PORT}`;

const PAGES = [
  { path: '/', width: 1440, why: 'home page and header' },
  { path: '/developing-with-opendialog/public-apis/knowledge-service-apis', width: 1440, why: '42 figures, the most in the corpus' },
  { path: '/tutorials/ai-agent-creation-overview', width: 1440, why: 'Steps list with embeds inside list items' },
  { path: '/opendialog-platform/monitoring-your-application', width: 1440, why: 'CoverCard covers' },
  { path: '/core-concepts/contexts-and-attributes/about-attributes', width: 1440, why: 'deep nav, so a linked sidebar group renders expanded' },
  { path: '/', width: 375, why: 'mobile header and menu' },
];

async function waitForServer(url, attempts = 60) {
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`preview server did not answer on ${url}`);
}

const server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
let browser;
try {
  await waitForServer(BASE);
  browser = await chromium.launch();
  const findings = new Map();

  for (const page of PAGES) {
    const context = await browser.newContext({ viewport: { width: page.width, height: 900 } });
    const tab = await context.newPage();
    await tab.goto(`${BASE}${page.path}`, { waitUntil: 'load' });
    await tab.addScriptTag({ content: axeSource });
    const results = await tab.evaluate(async () => await window.axe.run());
    const label = `${page.path} @ ${page.width}px`;
    console.log(`\n${label}  (${page.why})`);
    console.log(`  passes ${results.passes.length}, violations ${results.violations.length}`);
    for (const violation of results.violations) {
      console.log(`  ${violation.impact?.padEnd(8)} ${violation.id} — ${violation.nodes.length} node(s): ${violation.help}`);
      for (const node of violation.nodes.slice(0, 3)) console.log(`      ${node.target.join(' ')}`);
      const seen = findings.get(violation.id) ?? { impact: violation.impact, pages: [], nodes: 0 };
      seen.pages.push(label);
      seen.nodes += violation.nodes.length;
      findings.set(violation.id, seen);
    }
    await context.close();
  }

  console.log('\n--- summary ---');
  if (!findings.size) console.log('no violations');
  for (const [id, finding] of findings) {
    console.log(`${String(finding.impact).padEnd(8)} ${id.padEnd(32)} ${finding.nodes} nodes across ${finding.pages.length} page(s)`);
  }
  process.exitCode = findings.size ? 1 : 0;
} finally {
  await browser?.close();
  server.kill();
}
```

- [ ] **Step 3: Run it**

```bash
npm run build
node scripts/axe.mjs
```

Record the full output. A non-zero exit here is expected on the first run — the baseline is unknown, which is the reason for running it.

- [ ] **Step 4: Check the two specific Phase 4 questions**

In the output, look for `nested-interactive` (the `<a>` inside `<summary>`) and any `image-alt` finding on a `CoverCard` cover. Note whether each appears and on which pages.

- [ ] **Step 5: STOP — report the findings to Pat before changing anything**

Do not fix, suppress, or allowlist anything yet. Present the violation list with impact levels, which are ours versus Starlight's, and a recommendation for each. Fixing an accessibility finding in generated content or in a Starlight override is a design decision, and the standing rules put those with Pat. Wait for direction.

- [ ] **Step 6: Add the npm script and commit the script itself**

In `package.json`, add to `scripts`:

```json
    "verify:a11y": "node scripts/axe.mjs",
```

```bash
git add scripts/axe.mjs package.json package-lock.json
git commit -m "Add an axe-core pass over a sample of built pages

Samples the constructs this migration introduced rather than representative
traffic: the figure/figcaption pairs, the Steps list, the CoverCard covers
and the linked sidebar group whose row nests an anchor inside a summary.

Serves dist through astro preview so root-relative hrefs, the cascade and
Pagefind behave as they do in production."
```

---

### Task 7: Write up Phase 5 and stop at the gate

**Files:**
- Modify: `MIGRATION-NOTES.md` (append a Phase 5 section)

**Interfaces:**
- Consumes: the measured results of every task above.
- Produces: the handover record.

- [ ] **Step 1: Re-run every check from a clean state**

```bash
npm test 2>&1 | tail -8
npm run convert 2>&1 | tail -12
npm run build 2>&1 | tail -5
node scripts/routes.mjs 2>&1 | tail -4
npm run verify:links
npm run verify:images
npm run verify:live
```

Record the actual numbers from each. Do not copy the expectations out of this plan — copy what the commands print.

- [ ] **Step 2: Confirm the pipeline is still idempotent**

```bash
find src/content/docs src/assets asset-map.json -type f | sort | xargs shasum -a 256 | shasum -a 256
npm run convert > /dev/null 2>&1
find src/content/docs src/assets asset-map.json -type f | sort | xargs shasum -a 256 | shasum -a 256
```

Expected: identical checksums.

- [ ] **Step 3: Append the Phase 5 section to MIGRATION-NOTES.md**

Follow the shape of the Phase 4 gate entry: a `## 2026-07-31 — Phase 5 gate: verification and accessibility` heading, then gate evidence, what changed, the decisions and their reasoning, corrections to earlier entries, traps worth keeping, and what is not done and why.

It must cover, at minimum:

- **Gate evidence** — the real numbers from Step 1.
- **The four decisions Pat made** and the reasoning: alt text left empty with a work list; the two non-video embeds left as links; the light-only pin fixed in a build hook rather than a `Page` override; axe-core rather than Lighthouse.
- **The link and anchor finding.** 9 links point at GitBook's own `/broken/pages/<id>` markers and 16 anchors name headings that exist on no page. All are present in `source/`, all were broken on GitBook, none is a migration regression. They are inventoried in `reports/inherited-broken-links.json` and are for the docs team.
- **A correction to the Phase 4 handoff.** It recorded 0 broken internal links; measured across the content area of all 205 pages there are 25 inherited defects. It was not wrong about migration quality — it was measuring a narrower set with a script that was never committed, which is exactly why these are committed now.
- **The heading-slug question, and how it was closed.** One anchor initially looked like a slug divergence: `about-attributes#multiple-value-attribute-types-collections-and-composites` against our id `multiple-value-attribute-types---collections-and-composites`. It is not. The same heading is linked from elsewhere in the corpus with the `---` spelling and resolves, and **42 working anchors carry the exact shapes suspected of divergence** — `#diagnose--improve-discovery`, `#december-2023---proxima`, `#what-is-an-attribute-message-`, `#-inputs`. GitBook's slugs and ours agree; the single-hyphen link is simply wrong in the source. Record this so nobody re-opens it.
- **The axe-core findings** and what was done about each.
- **`sharp`** — bumped to 0.35.3, the advisory cleared, and the note that `asset-map.json` had to be deleted first.
- **Not done, and why** — deployment, the PR, the visual comparison (no oracle survives), the Pagefind search spot-check (Pat owns the export).

- [ ] **Step 4: Commit**

```bash
git add MIGRATION-NOTES.md
git commit -m "Record the Phase 5 gate"
```

- [ ] **Step 5: Stop and report**

Report to Pat: what changed, the gate evidence, the axe findings, and the two decisions still outstanding — **whether to deploy** (the sharp re-encode and the light-theme fix only reach readers once deployed) and **whether to open a PR** for the 30-plus commits on `phase-4/look-and-feel`.

Do not deploy. Do not open a PR. Do not merge. Wait.

---

## Self-review

**Spec coverage.** Every section of the design maps to a task: `verify-images.mjs` and the report → Task 5; `light-theme.mjs` and the integration → Task 2; `verify-live.mjs` → Task 4; `verify-links.mjs` → Task 3; axe-core → Task 6; the sharp bump → Task 1; notes and gate → Task 7. The four decisions are carried into Task 7's write-up.

**Deviations from the spec, both deliberate.** The spec had the light-theme integration assert that the rewritten count equals Astro's page count; per-file rejection inside `pinLightTheme` is stronger, so the integration only rejects an empty build. The spec did not anticipate the 25 inherited link and anchor defects, so `verify-links.mjs` gained an inventory and gates on regressions; without it the check could never pass, since fixing the underlying content would mean editing prose.

**Type consistency.** `emptyAltImages` returns `{ asset, caption }` in Task 5's tests, implementation and consumer. `resolveHref` returns `{ path, hash }` or `null` in Task 3's tests, implementation and consumer. `pinLightTheme` takes and returns a string in Task 2's tests, implementation and integration.

**Numbers.** Every expected value — 235 tests at baseline rising to 241, 251 and 261, 205 pages, 509 assets, 746 images, 455 rows, 303 captions, 13 covers, 2,650 links, 1,304 anchors, 9 plus 16 inherited defects, 207 live URLs — is measured, not estimated.
