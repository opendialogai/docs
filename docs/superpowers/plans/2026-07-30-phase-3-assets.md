# Phase 3 — Assets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the 500 referenced GitBook assets into `src/assets/` and `public/`, slugified and re-encoded, so every image on the site resolves and `du -sh src/assets` is under 60 MB.

**Architecture:** `scripts/assets.mjs` derives the copy set from `source/` alone, processes each asset, and emits `asset-map.json`. `scripts/convert.mjs` consumes that map exactly as it already consumes `route-map.json`, so a re-run can never revert the paths. All naming and treatment decisions live in a pure `scripts/lib/asset-plan.mjs` so they are unit-testable without touching the filesystem.

**Tech Stack:** Node 22 ESM, `node:test`, `sharp` (already a dependency), `ffmpeg` 8.1.2 (already installed), Astro 7 + Starlight.

**Design spec:** `docs/superpowers/specs/2026-07-30-phase-3-assets-design.md`. Read it before Task 1.

## Global Constraints

- **Never hand-edit `src/content/docs/`.** It is generated. Fix the script and re-run.
- **`source/` is read-only and git-ignored.** Scripts read from `source/`, write to `src/` and `public/`. Never mutate `source/` in place. Repopulate with `git archive documentation | tar -x -C source/`.
- **Never write to the `documentation` branch.** GitBook syncs to it bidirectionally.
- **Do not edit documentation prose.** Not typos, not clarity. Log in `MIGRATION-NOTES.md`.
- **Scripts must be idempotent.** Same input gives byte-identical output. No timestamps, no randomness, no filesystem-ordering dependence.
- **No new npm dependencies.** `sharp` and `node:test` are already present. If a task seems to need a package, stop and ask.
- **Expected counts are authoritative.** If output diverges from an invariant, the script is wrong. Do not adjust the expectation to match the output.
- **Nothing is deleted.** No file is removed from `source/` in this phase. Orphans are simply never copied.
- **Loud failure.** Every transform throws rather than degrade — these scripts run against whatever GitBook syncs next, not a fixed corpus. The single sanctioned exception is `assetPath`'s no-map fallback, specified in Task 5.
- **Never make DNS changes.** Cloudflare access is for Workers and deployments only.
- Run tests as `npm test` or `node --test "scripts/lib/*.test.mjs"` — **use the quoted glob, not a bare directory**; `node --test scripts/lib/` fails with `Could not find` on the local Node 22.x.
- All new files use ESM `import`/`export`, 2-space indent, single quotes, semicolons — matching `scripts/routes.mjs`.
- Comments use JSDoc `/** ... */` for exported functions, explaining WHAT and WHY, never history or "improved".

## Expected counts

If a script's numbers diverge sharply from these, the script is wrong — do not adjust the expectation to match the output.

| | |
|---|---|
| Asset references in `source/` | 509 |
| Cover href occurrences | 13 |
| Copy set (509 − covers referenced only as covers) | 500 |
| Still images (PNG/JPEG) in the copy set | 496 |
| Animated GIFs in the copy set | 3 |
| Non-image files in the copy set | 1 |
| Files landing in `src/assets/` | 498 |
| Files landing in `public/media/` | 1 |
| Files landing in `public/files/` | 1 |
| Slug collisions | 0 |
| `du -sh src/assets` | ~31.6 MiB, gate is under 60 MB |

## File Structure

| File | Responsibility |
|---|---|
| `scripts/lib/link-cards.mjs` | **Modify.** Gains `coverTargets`; `countDroppedCovers` delegates to it |
| `scripts/lib/asset-plan.mjs` | **Create.** Pure. Slugification and treatment decisions. No I/O |
| `scripts/lib/asset-plan.test.mjs` | **Create.** Unit tests for the above |
| `scripts/lib/asset-refs.mjs` | **Create.** Extracts the copy set from `source/`. Pure over text |
| `scripts/lib/asset-refs.test.mjs` | **Create.** Unit tests for the above |
| `scripts/assets.mjs` | **Create.** Orchestrator: all I/O, encoding, map emission, invariants |
| `scripts/lib/figures.mjs` | **Modify.** `assetPath` becomes map-aware; emits `<video>` and file links |
| `scripts/lib/figures.test.mjs` | **Modify.** Tests for the map-aware paths |
| `scripts/convert.mjs` | **Modify.** Loads `asset-map.json`, passes it through `ctx` |
| `package.json` | **Modify.** `convert` script gains `assets` |

---

### Task 1: Cover target extraction

`countDroppedCovers` already finds every `data-card-cover` href — it just discards the paths and returns a count. Task 3 needs those paths to subtract covers from the copy set. Extracting them once and having the count delegate keeps the two from ever disagreeing.

**Files:**
- Modify: `scripts/lib/link-cards.mjs` (the `countDroppedCovers` function, currently at the end of the file)
- Test: `scripts/lib/link-cards.test.mjs`

**Interfaces:**
- Produces: `coverTargets(text: string) -> string[]` — every `data-card-cover` image href in `text`, in document order, duplicates included. `countDroppedCovers(text) -> number` keeps its existing signature and returns `coverTargets(text).length`.

- [ ] **Step 1: Write the failing test**

Add to `scripts/lib/link-cards.test.mjs`. Import `coverTargets` alongside the existing imports.

```js
test('coverTargets returns each cover href in document order', () => {
  const text = [
    '<table data-view="cards" data-card-cover="true">',
    '<tbody>',
    '<tr><td><a href="../.gitbook/assets/one.png">one</a></td><td>Body</td></tr>',
    '<tr><td><a href="../.gitbook/assets/two (1).png">two</a></td><td>Body</td></tr>',
    '</tbody>',
    '</table>',
  ].join('\n');
  assert.deepEqual(coverTargets(text), [
    '../.gitbook/assets/one.png',
    '../.gitbook/assets/two (1).png',
  ]);
});

test('coverTargets ignores tables without a cover column', () => {
  const text = '<table data-view="cards"><tbody><tr><td><a href="../.gitbook/assets/a.png">a</a></td></tr></tbody></table>';
  assert.deepEqual(coverTargets(text), []);
});

test('coverTargets ignores a card table inside a fenced block', () => {
  const text = [
    '```html',
    '<table data-view="cards" data-card-cover="true">',
    '<tr><td><a href="../.gitbook/assets/fenced.png">x</a></td></tr>',
    '</table>',
    '```',
  ].join('\n');
  assert.deepEqual(coverTargets(text), []);
});

test('countDroppedCovers reports the same number of targets', () => {
  const text = [
    '<table data-view="cards" data-card-cover="true">',
    '<tbody>',
    '<tr><td><a href="../.gitbook/assets/one.png">one</a></td><td>Body</td></tr>',
    '<tr><td><a href="../.gitbook/assets/two.png">two</a></td><td>Body</td></tr>',
    '</tbody>',
    '</table>',
  ].join('\n');
  assert.equal(countDroppedCovers(text), coverTargets(text).length);
  assert.equal(countDroppedCovers(text), 2);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/lib/link-cards.test.mjs`
Expected: FAIL — `coverTargets is not a function` / `SyntaxError: The requested module does not provide an export named 'coverTargets'`.

- [ ] **Step 3: Write the implementation**

Replace the existing `countDroppedCovers` in `scripts/lib/link-cards.mjs` with:

```js
/**
 * Every data-card-cover image href in `text`, in document order.
 *
 * Card covers have no <LinkCard> equivalent, so conversion discards them. Phase 3 subtracts
 * these from the asset copy set so a cover referenced nowhere else is not copied into
 * src/assets/, where nothing would render it.
 */
export function coverTargets(text) {
  const found = [];
  protectCode(text, (masked) => {
    for (const [table] of masked.matchAll(CARD_TABLE)) {
      if (!/data-card-cover/.test(table)) continue;
      for (const [, href] of table.matchAll(/<a href="([^"]*\.(?:png|jpe?g|gif|svg|webp))"/gi)) {
        found.push(href);
      }
    }
    return masked;
  });
  return found;
}

/** Counts data-card-cover image references lost in conversion, for the Phase 3 handoff. */
export function countDroppedCovers(text) {
  return coverTargets(text).length;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/lib/link-cards.test.mjs`
Expected: PASS, all tests including the pre-existing ones.

- [ ] **Step 5: Verify the corpus count is unchanged**

Run: `node scripts/convert.mjs 2>&1 | grep droppedCovers`
Expected: `ok   droppedCovers        13`

If this is not 13, the regex changed behaviour. Do not adjust the expectation.

- [ ] **Step 6: Run the full suite and commit**

```bash
npm test
git add scripts/lib/link-cards.mjs scripts/lib/link-cards.test.mjs
git commit -m "Extract card cover targets alongside the count"
```

---

### Task 2: Asset naming and treatment planning

Pure decisions, no I/O. Everything here is unit-testable without a filesystem or an image decoder, which is why it is a separate module from `assets.mjs`.

**Files:**
- Create: `scripts/lib/asset-plan.mjs`
- Test: `scripts/lib/asset-plan.test.mjs`

**Interfaces:**
- Produces:
  - `slugify(filename: string) -> string` — lowercased, non-alphanumeric runs collapsed to single hyphens, extension preserved and lowercased.
  - `assignSlugs(filenames: string[]) -> Map<string, string>` — original filename to unique slug. Input is sorted internally, so the result does not depend on argument order. Collisions get a `-2`, `-3`, … suffix before the extension.
  - `planAsset({ filename, bytes, colours }) -> { kind, destination, treatment }` where `kind` is `'image' | 'video' | 'file'`, `destination` is `'src/assets' | 'public/media' | 'public/files'`, and `treatment` is `'resize-quantise' | 'resize-only' | 'copy' | 'encode-video'`. `colours` may be `null` for non-raster inputs.
  - `MAX_WIDTH = 2000`, `QUANTISE_MAX_COLOURS = 32768`, `GIF_VIDEO_THRESHOLD = 1048576` — exported constants.

- [ ] **Step 1: Write the failing test**

Create `scripts/lib/asset-plan.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  assignSlugs,
  planAsset,
  slugify,
  GIF_VIDEO_THRESHOLD,
  MAX_WIDTH,
  QUANTISE_MAX_COLOURS,
} from './asset-plan.mjs';

test('slugify lowercases and collapses non-alphanumeric runs', () => {
  assert.equal(slugify('Screenshot 2024-07-09 at 09.52.58.png'), 'screenshot-2024-07-09-at-09-52-58.png');
  assert.equal(slugify('image (149).png'), 'image-149.png');
  assert.equal(slugify('2023-05-04_16-17-09 (1).png'), '2023-05-04-16-17-09-1.png');
});

test('slugify keeps the digits inside GitBook re-upload suffixes distinct', () => {
  assert.notEqual(
    slugify('Screenshot 2024-07-09 at 09.52.58.png'),
    slugify('Screenshot 2024-07-09 at 09.52.58 (1).png')
  );
});

test('slugify lowercases the extension and trims stray separators', () => {
  assert.equal(slugify('Zrzut ekranu 2025-11-3 o 14.48.02.PNG'), 'zrzut-ekranu-2025-11-3-o-14-48-02.png');
  assert.equal(slugify('  spaced  .png'), 'spaced.png');
});

test('assignSlugs returns one slug per input and is order independent', () => {
  const names = ['b.png', 'a.png'];
  const forward = assignSlugs(names);
  const reverse = assignSlugs([...names].reverse());
  assert.deepEqual([...forward.entries()].sort(), [...reverse.entries()].sort());
  assert.equal(forward.size, 2);
});

test('assignSlugs suffixes a collision deterministically by sorted original name', () => {
  const map = assignSlugs(['Photo B.png', 'photo-b.png']);
  assert.equal(map.get('Photo B.png'), 'photo-b.png');
  assert.equal(map.get('photo-b.png'), 'photo-b-2.png');
});

test('a low-colour still image is resized and quantised', () => {
  const plan = planAsset({ filename: 'a.png', bytes: 500000, colours: 3000 });
  assert.deepEqual(plan, { kind: 'image', destination: 'src/assets', treatment: 'resize-quantise' });
});

test('a colour-rich still image is resized but kept full colour', () => {
  const plan = planAsset({ filename: 'a.png', bytes: 500000, colours: QUANTISE_MAX_COLOURS + 1 });
  assert.deepEqual(plan, { kind: 'image', destination: 'src/assets', treatment: 'resize-only' });
});

test('a small gif is copied byte-for-byte so its animation survives', () => {
  const plan = planAsset({ filename: 'spin.gif', bytes: 150000, colours: null });
  assert.deepEqual(plan, { kind: 'image', destination: 'src/assets', treatment: 'copy' });
});

test('a large gif becomes a video in public/media', () => {
  const plan = planAsset({ filename: 'demo.gif', bytes: GIF_VIDEO_THRESHOLD + 1, colours: null });
  assert.deepEqual(plan, { kind: 'video', destination: 'public/media', treatment: 'encode-video' });
});

test('a non-image is copied to public/files', () => {
  const plan = planAsset({ filename: 'data.csv', bytes: 1027, colours: null });
  assert.deepEqual(plan, { kind: 'file', destination: 'public/files', treatment: 'copy' });
});

test('the exported thresholds are the measured values', () => {
  assert.equal(MAX_WIDTH, 2000);
  assert.equal(QUANTISE_MAX_COLOURS, 32768);
  assert.equal(GIF_VIDEO_THRESHOLD, 1048576);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/lib/asset-plan.test.mjs`
Expected: FAIL — `Cannot find module './asset-plan.mjs'`.

- [ ] **Step 3: Write the implementation**

Create `scripts/lib/asset-plan.mjs`:

```js
/**
 * Decides what each asset is called and how it is encoded. Pure: no filesystem, no decoding.
 *
 * Kept separate from assets.mjs so every naming and treatment decision is unit-testable
 * without an image on disk.
 */

/** Width ceiling. Images are never enlarged. */
export const MAX_WIDTH = 2000;

/**
 * Palette quantisation is applied only at or below this many unique colours in the resized
 * image. Photographs and gradients band visibly at 256 colours; flat UI screenshots do not.
 * Measured across the 505 referenced PNG/JPEG files: p50 5,643, p95 17,549, max 454,752.
 *
 * The count must be taken on the resized image. Unique colours scale with pixel count, so a
 * threshold calibrated on a downsample admits far more images than intended.
 */
export const QUANTISE_MAX_COLOURS = 32768;

/** A GIF at or above this size becomes an MP4. The two small corpus GIFs sit far below it. */
export const GIF_VIDEO_THRESHOLD = 1024 * 1024;

const STILL = /\.(?:png|jpe?g|webp)$/i;
const GIF = /\.gif$/i;

/** Filesystem-safe, URL-safe name: lowercase, single hyphens, original extension. */
export function slugify(filename) {
  const dot = filename.lastIndexOf('.');
  const stem = dot > 0 ? filename.slice(0, dot) : filename;
  const ext = dot > 0 ? filename.slice(dot).toLowerCase() : '';
  const slug = stem
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!slug) throw new Error(`asset name slugifies to nothing: ${filename}`);
  return `${slug}${ext}`;
}

/**
 * Maps every original filename to a unique slug.
 *
 * Input is sorted internally so a collision suffix depends on the names alone, never on the
 * order the caller happened to read the directory in — the run must be reproducible.
 */
export function assignSlugs(filenames) {
  const taken = new Set();
  const result = new Map();
  for (const filename of [...filenames].sort()) {
    const base = slugify(filename);
    let slug = base;
    if (taken.has(slug)) {
      const dot = base.lastIndexOf('.');
      const stem = dot > 0 ? base.slice(0, dot) : base;
      const ext = dot > 0 ? base.slice(dot) : '';
      let n = 2;
      while (taken.has(`${stem}-${n}${ext}`)) n++;
      slug = `${stem}-${n}${ext}`;
    }
    taken.add(slug);
    result.set(filename, slug);
  }
  return result;
}

/** Where an asset goes and how it is encoded. `colours` is null for anything not a still image. */
export function planAsset({ filename, bytes, colours }) {
  if (STILL.test(filename)) {
    if (colours === null || colours === undefined) {
      throw new Error(`planAsset: still image needs a colour count: ${filename}`);
    }
    return {
      kind: 'image',
      destination: 'src/assets',
      treatment: colours <= QUANTISE_MAX_COLOURS ? 'resize-quantise' : 'resize-only',
    };
  }
  if (GIF.test(filename)) {
    return bytes >= GIF_VIDEO_THRESHOLD
      ? { kind: 'video', destination: 'public/media', treatment: 'encode-video' }
      : { kind: 'image', destination: 'src/assets', treatment: 'copy' };
  }
  return { kind: 'file', destination: 'public/files', treatment: 'copy' };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/lib/asset-plan.test.mjs`
Expected: PASS, 11 tests.

- [ ] **Step 5: Commit**

```bash
npm test
git add scripts/lib/asset-plan.mjs scripts/lib/asset-plan.test.mjs
git commit -m "Add asset naming and treatment planning"
```

---

### Task 3: Copy-set extraction

Determines which assets get copied, from `source/` alone. Pure over text so it is testable without walking a real tree.

**Files:**
- Create: `scripts/lib/asset-refs.mjs`
- Test: `scripts/lib/asset-refs.test.mjs`

**Interfaces:**
- Consumes: `extractTargets` from `./links.mjs`, `coverTargets` from `./link-cards.mjs` (Task 1).
- Produces: `assetRefsInFile(text: string) -> { all: string[], covers: string[] }` — bare asset filenames (the part after `.gitbook/assets/`), unescaped and percent-decoded, in document order.

- [ ] **Step 1: Write the failing test**

Create `scripts/lib/asset-refs.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assetRefsInFile } from './asset-refs.mjs';

test('finds a plain markdown image', () => {
  const { all } = assetRefsInFile('![alt](../.gitbook/assets/one.png)');
  assert.deepEqual(all, ['one.png']);
});

test('finds an angle-bracketed destination containing spaces and parens', () => {
  const { all } = assetRefsInFile('![](<../.gitbook/assets/image (149).png>)');
  assert.deepEqual(all, ['image (149).png']);
});

test('does not truncate an unbracketed destination containing parens', () => {
  const { all } = assetRefsInFile('![](../.gitbook/assets/putting it all together (1).png)');
  assert.deepEqual(all, ['putting it all together (1).png']);
});

test('undoes markdown backslash escapes', () => {
  const { all } = assetRefsInFile('![](<../.gitbook/assets/2023-05-04\\_16-17-09 (1).png>)');
  assert.deepEqual(all, ['2023-05-04_16-17-09 (1).png']);
});

test('decodes percent-encoded spaces', () => {
  const { all } = assetRefsInFile('![](/.gitbook/assets/a%20b.png)');
  assert.deepEqual(all, ['a b.png']);
});

test('finds raw HTML src and href references', () => {
  const text = '<img src="../.gitbook/assets/raw.png"><a href="../.gitbook/assets/doc.csv">d</a>';
  assert.deepEqual(assetRefsInFile(text).all, ['raw.png', 'doc.csv']);
});

test('finds a GitBook file block', () => {
  const { all } = assetRefsInFile('{% file src="../.gitbook/assets/data.csv" %}');
  assert.deepEqual(all, ['data.csv']);
});

test('ignores references inside a fenced block', () => {
  const text = ['```md', '![](../.gitbook/assets/fenced.png)', '```'].join('\n');
  assert.deepEqual(assetRefsInFile(text).all, []);
});

test('ignores remote URLs and non-asset links', () => {
  const text = '![](https://example.com/a.png) [x](../other/page.md)';
  assert.deepEqual(assetRefsInFile(text).all, []);
});

test('reports cover targets separately and also within all', () => {
  const text = [
    '<table data-view="cards" data-card-cover="true">',
    '<tbody><tr><td><a href="../.gitbook/assets/cover.png">c</a></td><td>Body</td></tr></tbody>',
    '</table>',
  ].join('\n');
  const { all, covers } = assetRefsInFile(text);
  assert.deepEqual(covers, ['cover.png']);
  assert.deepEqual(all, ['cover.png']);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/lib/asset-refs.test.mjs`
Expected: FAIL — `Cannot find module './asset-refs.mjs'`.

- [ ] **Step 3: Write the implementation**

Create `scripts/lib/asset-refs.mjs`:

```js
/**
 * Finds every .gitbook/assets reference in a source file, and which of them are card covers.
 *
 * Destinations come from links.mjs's scanner rather than a regex: 1,056 asset filenames
 * contain parentheses and `\]\(([^)]+)\)` truncates at the first one.
 */
import { protectCode } from './segments.mjs';
import { extractTargets } from './links.mjs';
import { coverTargets } from './link-cards.mjs';

const ASSET = /\.gitbook\/assets\/(.*)$/;
const ATTR = /(?:src|href)="([^"]*)"/g;
const FILE_BLOCK = /\{%\s*file\s+src="([^"]*)"/g;

/** Bare asset filename from a destination, or null when the destination is not an asset. */
function assetName(destination) {
  const clean = destination.trim();
  if (/^https?:/i.test(clean)) return null;
  const match = clean.match(ASSET);
  if (!match) return null;
  let name = match[1].replace(/\\([_()*[\]\-.])/g, '$1');
  try {
    name = decodeURIComponent(name);
  } catch {
    throw new Error(`asset reference is not valid percent-encoding: ${destination}`);
  }
  return name;
}

/** Every asset reference in `text`, and the subset that are data-card-cover hrefs. */
export function assetRefsInFile(text) {
  const all = [];
  const push = (destination) => {
    const name = assetName(destination);
    if (name) all.push(name);
  };
  protectCode(text, (masked) => {
    for (const { target } of extractTargets(masked)) push(target);
    for (const [, value] of masked.matchAll(ATTR)) push(value);
    for (const [, value] of masked.matchAll(FILE_BLOCK)) push(value);
    return masked;
  });
  const covers = coverTargets(text).map(assetName).filter(Boolean);
  return { all, covers };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/lib/asset-refs.test.mjs`
Expected: PASS, 10 tests.

- [ ] **Step 5: Verify against the real corpus**

```bash
node --input-type=module -e '
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { assetRefsInFile } from "./scripts/lib/asset-refs.mjs";
const walk = (d) => readdirSync(d, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(join(d,e.name)) : [join(d,e.name)]);
const all = new Set(), coverOnly = new Set(), nonCover = new Set();
let coverHits = 0;
for (const f of walk("source").filter(f => /\.mdx?$/.test(f))) {
  const { all: a, covers } = assetRefsInFile(readFileSync(f, "utf8"));
  coverHits += covers.length;
  const cover = new Set(covers);
  for (const n of a) { all.add(n); (cover.has(n) ? coverOnly : nonCover).add(n); }
}
const copy = [...all].filter(n => nonCover.has(n));
console.log("references     :", all.size, "(expect 509)");
console.log("cover hrefs    :", coverHits, "(expect 13)");
console.log("copy set       :", copy.length, "(expect 500)");
console.log("covers dropped :", all.size - copy.length, "(expect 9)");
const disk = new Set(readdirSync("source/.gitbook/assets"));
console.log("missing on disk:", [...all].filter(n => !disk.has(n)).length, "(expect 0)");
'
```

Expected: `509`, `13`, `500`, `9`, `0`.

If any figure differs, the extractor is wrong. Do not adjust the expectation — find the reference it missed or invented and report it.

- [ ] **Step 6: Commit**

```bash
npm test
git add scripts/lib/asset-refs.mjs scripts/lib/asset-refs.test.mjs
git commit -m "Extract the asset copy set from source"
```

---

### Task 4: The asset script, copying verbatim

Builds `assets.mjs` end to end but with every file copied byte-for-byte. No encoding yet. The deliverable is a complete, correct `asset-map.json` and every referenced asset on disk under its slug — provable before any lossy step is introduced.

**Files:**
- Create: `scripts/assets.mjs`

**Interfaces:**
- Consumes: `assetRefsInFile` (Task 3), `assignSlugs` / `planAsset` (Task 2).
- Produces: `asset-map.json` at the repo root:

```json
{
  "generated": "scripts/assets.mjs",
  "assets": {
    "Screenshot 2024-07-09 at 09.52.58.png": {
      "slug": "screenshot-2024-07-09-at-09-52-58.png",
      "kind": "image",
      "destination": "src/assets",
      "reference": "~/assets/screenshot-2024-07-09-at-09-52-58.png",
      "hash": "9f86d081…"
    }
  }
}
```

`reference` is exactly what `figures.mjs` emits in Task 5. `hash` is the SHA-256 of the **source** bytes, used to skip unchanged assets on re-runs.

- [ ] **Step 1: Write the script**

Create `scripts/assets.mjs`:

```js
/**
 * Copies the referenced GitBook assets into src/assets/ and public/, slugified and re-encoded,
 * and records what each became in asset-map.json.
 *
 * The copy set is derived from source/ alone — never from src/content/docs — because
 * convert.mjs consumes this map to emit its paths and would otherwise need itself first.
 *
 * Idempotent: output paths derive from sorted filenames, encoding parameters are fixed, and an
 * asset whose source bytes are unchanged is skipped. Re-runnable against a fresh GitBook sync
 * right up to cutover day.
 */
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { assetRefsInFile } from './lib/asset-refs.mjs';
import { assignSlugs, planAsset, slugify } from './lib/asset-plan.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_ASSETS = `${root}/source/.gitbook/assets`;
const MAP = `${root}/asset-map.json`;

const DESTINATIONS = {
  'src/assets': { dir: `${root}/src/assets`, reference: (slug) => `~/assets/${slug}` },
  'public/media': { dir: `${root}/public/media`, reference: (slug) => `/media/${slug}` },
  'public/files': { dir: `${root}/public/files`, reference: (slug) => `/files/${slug}` },
};

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]
  );

/** The assets convert.mjs will reference: everything in source/ except covers-only images. */
function copySet() {
  const all = new Set();
  const nonCover = new Set();
  let coverHrefs = 0;
  for (const file of walk(`${root}/source`).filter((f) => /\.mdx?$/.test(f))) {
    const { all: refs, covers } = assetRefsInFile(readFileSync(file, 'utf8'));
    coverHrefs += covers.length;
    const cover = new Set(covers);
    for (const name of refs) {
      all.add(name);
      if (!cover.has(name)) nonCover.add(name);
    }
  }
  return { all, copy: [...all].filter((name) => nonCover.has(name)), coverHrefs };
}

const { all, copy, coverHrefs } = copySet();

const missing = [...all].filter((name) => !existsSync(join(SOURCE_ASSETS, name)));
if (missing.length) {
  throw new Error(`referenced assets absent from source/.gitbook/assets: ${missing.join(', ')}`);
}

const slugs = assignSlugs(copy);
const collisions = copy.filter((name) => slugs.get(name) !== slugify(name)).length;

for (const { dir } of Object.values(DESTINATIONS)) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}

const assets = {};
for (const name of [...copy].sort()) {
  const from = join(SOURCE_ASSETS, name);
  const bytes = statSync(from).size;
  const plan = planAsset({ filename: name, bytes, colours: /\.(png|jpe?g|webp)$/i.test(name) ? 0 : null });
  const slug = slugs.get(name);
  const destination = DESTINATIONS[plan.destination];
  copyFileSync(from, join(destination.dir, slug));
  assets[name] = {
    slug,
    kind: plan.kind,
    reference: destination.reference(slug),
    hash: createHash('sha256').update(readFileSync(from)).digest('hex'),
  };
}

writeFileSync(MAP, `${JSON.stringify({ generated: 'scripts/assets.mjs', assets }, null, 2)}\n`);

const bytesIn = (dir) =>
  existsSync(dir) ? walk(dir).reduce((total, f) => total + statSync(f).size, 0) : 0;
const MIB = 1024 * 1024;
const srcAssets = bytesIn(DESTINATIONS['src/assets'].dir);
const largest = walk(DESTINATIONS['src/assets'].dir)
  .concat(walk(DESTINATIONS['public/media'].dir), walk(DESTINATIONS['public/files'].dir))
  .reduce((max, f) => Math.max(max, statSync(f).size), 0);

const EXPECTED = {
  references: 509,
  coverHrefs: 13,
  copySet: 500,
  mapEntries: 500,
  slugCollisions: 0,
};
const stats = {
  references: all.size,
  coverHrefs,
  copySet: copy.length,
  mapEntries: Object.keys(assets).length,
  slugCollisions: collisions,
};

let failed = false;
for (const [key, expected] of Object.entries(EXPECTED)) {
  const ok = stats[key] === expected;
  if (!ok) failed = true;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${key.padEnd(18)} ${stats[key]}${ok ? '' : ` (expected ${expected})`}`);
}
const underGate = srcAssets < 60_000_000;
const underCap = largest < 25 * MIB;
console.log(`${underGate ? 'ok  ' : 'FAIL'} ${'src/assets size'.padEnd(18)} ${(srcAssets / MIB).toFixed(1)} MiB`);
console.log(`${underCap ? 'ok  ' : 'FAIL'} ${'largest file'.padEnd(18)} ${(largest / MIB).toFixed(1)} MiB`);
if (!underGate || !underCap) failed = true;

console.log(`\nwrote ${Object.keys(assets).length} assets and asset-map.json`);
if (failed) {
  console.error('\nA count diverged. The script is wrong — do not adjust the expectation.');
  process.exit(1);
}
```

- [ ] **Step 2: Run it**

Run: `node scripts/assets.mjs`

Expected: `references 509`, `coverHrefs 13`, `copySet 500`, `mapEntries 500`, `slugCollisions 0` all `ok`; `largest file` under 25 MiB `ok`; **`src/assets size` FAIL at roughly 190 MiB**, and a non-zero exit.

That failure is correct at this point — nothing is re-encoded yet. Task 6 is what brings it under the gate. Confirm every other line reads `ok` before moving on.

- [ ] **Step 3: Verify idempotency**

```bash
node scripts/assets.mjs > /dev/null; find src/assets public -type f | sort | xargs shasum > /tmp/a1.txt
node scripts/assets.mjs > /dev/null; find src/assets public -type f | sort | xargs shasum > /tmp/a2.txt
diff /tmp/a1.txt /tmp/a2.txt && echo IDENTICAL
```

Expected: `IDENTICAL`.

- [ ] **Step 4: Confirm the outputs are not git-ignored**

`src/assets/` and `public/` **are** committed — they are the deliverable.

Run: `git check-ignore -v src/assets public || echo "both tracked"`
Expected: `both tracked`.

- [ ] **Step 5: Commit the script only**

The copied assets are 190 MiB at this point and must not enter git history. Commit the script now and the assets in Task 6, after encoding.

```bash
git add scripts/assets.mjs
git commit -m "Add the asset script, copying verbatim"
```

---

### Task 5: Map-aware reference emission

Wires the map into `convert.mjs` so the 204 generated pages point at the real files.

**Files:**
- Modify: `scripts/lib/figures.mjs` (`assetPath` at line 19, `image` at line 26, `rewriteAssetRefs` at line 120)
- Modify: `scripts/convert.mjs` (the `ctx` construction and the `convertFigures` / `rewriteAssetRefs` calls)
- Modify: `package.json`
- Test: `scripts/lib/figures.test.mjs`

**Interfaces:**
- Consumes: `asset-map.json` from Task 4.
- Produces: `assetPath(src, assets)` where `assets` is the map's `assets` object or `null`. `convertFigures(text, ctx)` and `rewriteAssetRefs(text, ctx)` now take a context carrying `assets`.

- [ ] **Step 1: Write the failing test**

Add to `scripts/lib/figures.test.mjs`:

```js
const ASSETS = {
  'one.png': { slug: 'one.png', kind: 'image', reference: '~/assets/one.png', hash: 'x' },
  'demo.gif': { slug: 'demo.mp4', kind: 'video', reference: '/media/demo.mp4', hash: 'y' },
  'data.csv': { slug: 'data.csv', kind: 'file', reference: '/files/data.csv', hash: 'z' },
};

test('a mapped image emits the alias reference', () => {
  const out = convertFigures('<figure><img src="../.gitbook/assets/one.png" alt="A"></figure>', { assets: ASSETS });
  assert.equal(out.trim(), '![A](~/assets/one.png)');
});

test('a mapped video emits a video element, not an image', () => {
  const out = convertFigures('<figure><img src="../.gitbook/assets/demo.gif" alt=""></figure>', { assets: ASSETS });
  assert.match(out, /<video[^>]*autoplay[^>]*loop[^>]*muted[^>]*playsinline/);
  assert.match(out, /src="\/media\/demo\.mp4"/);
  assert.doesNotMatch(out, /!\[/);
});

test('with no map at all the placeholder form is kept', () => {
  const out = convertFigures('<figure><img src="../.gitbook/assets/one.png" alt="A"></figure>', { assets: null });
  assert.equal(out.trim(), '![A](/.gitbook/assets/one.png)');
});

test('a reference missing from an existing map throws', () => {
  assert.throws(
    () => convertFigures('<figure><img src="../.gitbook/assets/gone.png" alt=""></figure>', { assets: ASSETS }),
    /gone\.png/
  );
});

test('rewriteAssetRefs maps an existing markdown image', () => {
  assert.equal(rewriteAssetRefs('![A](../.gitbook/assets/one.png)', { assets: ASSETS }), '![A](~/assets/one.png)');
});

test('a remote image is untouched whether or not a map exists', () => {
  assert.equal(rewriteAssetRefs('![A](https://example.com/x.png)', { assets: ASSETS }), '![A](https://example.com/x.png)');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/lib/figures.test.mjs`
Expected: FAIL — the mapped cases still emit `/.gitbook/assets/one.png`, and the missing-reference case does not throw.

- [ ] **Step 3: Rewrite the path helpers**

In `scripts/lib/figures.mjs`, replace `assetPath` and `image`:

```js
/**
 * Resolves a .gitbook/assets reference to its final form.
 *
 * With an asset map, returns what assets.mjs produced. Without one — a checkout where Phase 3
 * has never run — returns the root-absolute placeholder, so the build stays green. A reference
 * absent from a map that does exist is a real inconsistency between the two generators and
 * throws.
 */
export function assetPath(src, assets) {
  if (/^https?:/i.test(src)) return src;
  const match = src.match(/\.gitbook\/assets\/(.*)$/);
  if (!match) return src;
  const name = decodeURIComponent(match[1].replace(/\\([_()*[\]\-.])/g, '$1'));
  if (!assets) return `/.gitbook/assets/${match[1]}`;
  const entry = assets[name];
  if (!entry) throw new Error(`asset not in asset-map.json: ${name}`);
  return entry.reference;
}

/** Renders an asset reference: an image, or a video element for an asset that became one. */
function image(alt, src, assets) {
  const name = src.match(/\.gitbook\/assets\/(.*)$/);
  const entry = assets && name ? assets[decodeURIComponent(name[1].replace(/\\([_()*[\]\-.])/g, '$1'))] : null;
  const path = assetPath(src, assets);
  if (entry?.kind === 'video') {
    return `<video autoplay loop muted playsinline src="${path}"></video>`;
  }
  return `![${alt}](${NEEDS_ANGLE.test(path) ? `<${path}>` : path})`;
}
```

Then thread `assets` through both exported transforms. Replace `convertFigures` in full — the only changes are the new `ctx` parameter, the `assets` binding, and the three `image(...)` call sites:

```js
export function convertFigures(text, ctx) {
  const assets = ctx?.assets ?? null;
  return protectCode(text, (masked) => {
    const converted = masked
      .replace(FIGURE, (_, attrs, caption, offset, full) => {
        const lineStart = full.lastIndexOf('\n', offset - 1) + 1;
        const before = full.slice(lineStart, offset);
        const indent = /^[ \t]*$/.test(before) ? before : '';
        const src = attrs.match(/src="([^"]*)"/)?.[1] ?? '';
        const alt = attrs.match(/alt="([^"]*)"/)?.[1] ?? '';
        const cap = captionText(caption);
        return cap
          ? `${image(alt, src, assets)}\n\n${indent}*${cap}*`
          : image(alt, src, assets);
      })
      .replace(BARE_IMG, (whole, attrs) => {
        const src = attrs.match(/src="([^"]*)"/)?.[1];
        if (!src) throw new Error(`convertFigures: <img> with no src attribute: ${whole}`);
        return image(attrs.match(/alt="([^"]*)"/)?.[1] ?? '', src, assets);
      });
    if (converted.includes('<figure') || converted.includes('<figcaption')) {
      throw new Error('convertFigures: a <figure> block did not match the expected one-image shape');
    }
    return converted;
  });
}
```

And replace `rewriteAssetRefs` in full:

```js
/** Normalises the paths of markdown images that were already in the source. */
export function rewriteAssetRefs(text, ctx) {
  const assets = ctx?.assets ?? null;
  return protectCode(text, (masked) =>
    masked.replace(ASSET_IMAGE, (whole, alt, dest) => {
      const src = dest.startsWith('<') ? dest.slice(1, -1) : dest;
      if (!/\.gitbook\/assets\//.test(src)) return whole;
      return image(alt, src, assets);
    })
  );
}
```

The indentation fix in the `FIGURE` branch is load-bearing — a caption emitted at column 0 breaks out of any list the figure sat inside, which shipped two non-rendering screenshots in Phase 2. Preserve it exactly.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/lib/figures.test.mjs`
Expected: PASS, including every pre-existing test — the no-map cases must be unchanged.

- [ ] **Step 5: Load the map in convert.mjs**

Near the top of `scripts/convert.mjs`, beside the `route-map.json` load:

```js
const assetMap = existsSync(`${root}/asset-map.json`)
  ? JSON.parse(readFileSync(`${root}/asset-map.json`, 'utf8')).assets
  : null;
```

Add `existsSync` to the `node:fs` import. Add `assets: assetMap` to the per-file `ctx`, and pass `ctx` to both calls:

```js
const ctx = { source: route.source, routes, titles, assets: assetMap };
…
  text = convertFigures(text, ctx);
  text = rewriteAssetRefs(text, ctx);
```

- [ ] **Step 6: Assert that every emitted reference resolves on disk**

This is the invariant that matters, and it is permanent — not a one-off check at the gate. Phase 2's lesson, across eleven defects, is that counters measure text while defects live in what actually renders. A count of rewritten references proves nothing; resolving each one against the filesystem proves the images exist.

Add to `scripts/convert.mjs`, beside the other `stats` counters:

```js
stats.assetRefs += (output.match(/~\/assets\/[^\s)>"]+/g) || []).length;
stats.assetRefs += (output.match(/"\/(?:media|files)\/[^"]+"/g) || []).length;
for (const [, ref] of output.matchAll(/~\/assets\/([^\s)>"]+)/g)) {
  if (!existsSync(`${root}/src/assets/${ref}`)) {
    throw new Error(`${route.source}: emitted asset does not exist: src/assets/${ref}`);
  }
}
for (const [, dir, ref] of output.matchAll(/"\/(media|files)\/([^"]+)"/g)) {
  if (!existsSync(`${root}/public/${dir}/${ref}`)) {
    throw new Error(`${route.source}: emitted asset does not exist: public/${dir}/${ref}`);
  }
}
```

Declare `assetRefs: 0` in the `stats` object. Do **not** add it to `EXPECTED` — the number changes whenever the docs team adds an image, and an expectation that must be edited on every content change is an expectation nobody trusts. Print it as an informational line beside `ordered list items`:

```js
console.log(`     ${'asset references'.padEnd(20)} ${stats.assetRefs}`);
```

The throw is the gate; the count is for the operator.

- [ ] **Step 7: Add the orchestration script**

In `package.json`, change the `convert` script so assets are built before conversion:

```json
"convert": "node scripts/routes.mjs && node scripts/assets.mjs && node scripts/convert.mjs && node scripts/sidebar.mjs",
```

Update the Commands block in `CLAUDE.md` to match, adding `node scripts/assets.mjs` in that position.

- [ ] **Step 8: Run the pipeline and confirm the paths landed**

```bash
node scripts/assets.mjs > /dev/null; node scripts/convert.mjs | tail -20
grep -rc 'gitbook/assets' src/content/docs | grep -v ':0' || echo "zero placeholder paths remain"
grep -rho '~/assets/[^)]*' src/content/docs | sort -u | wc -l
```

Expected: every `convert.mjs` invariant `ok`; `zero placeholder paths remain`; the distinct alias count is 498.

- [ ] **Step 9: Commit the code**

The assets themselves are still unencoded, so still do not commit `src/assets/`.

```bash
npm test
git add scripts/lib/figures.mjs scripts/lib/figures.test.mjs scripts/convert.mjs package.json CLAUDE.md
git commit -m "Emit asset references from the asset map"
```

---

### Task 6: Image encoding

Brings `src/assets/` under the gate.

**Files:**
- Modify: `scripts/assets.mjs`

**Interfaces:**
- Consumes: `sharp`, and `MAX_WIDTH` / `QUANTISE_MAX_COLOURS` from `asset-plan.mjs`.

- [ ] **Step 1: Add the encoding helpers**

Resizing and quantising are separate functions because `planAsset` decides which to apply and needs the colour count between them. Folding them into one encoder would leave `treatment` unused for still images, and the Task 2 tests asserting behaviour nothing relies on.

In `scripts/assets.mjs`, add `import sharp from 'sharp';`, extend the `asset-plan.mjs` import to `import { assignSlugs, planAsset, slugify, MAX_WIDTH, QUANTISE_MAX_COLOURS } from './lib/asset-plan.mjs';`, and add:

```js
/** Resizes a still image to the width ceiling. Never enlarges. */
async function resizeImage(buffer) {
  return sharp(buffer)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/**
 * Unique RGB values in a decoded image, stopping once the quantisation threshold is exceeded.
 *
 * Must be called on the RESIZED image, never the original and never a downsample: unique
 * colours scale with pixel count, so a threshold calibrated on a smaller image admits far more
 * files than intended. An earlier draft of the design measured at 400px and projected 84.6 MiB
 * against a 60 MB gate.
 */
async function countColours(buffer) {
  const { data, info } = await sharp(buffer).raw().toBuffer({ resolveWithObject: true });
  const seen = new Set();
  for (let i = 0; i < data.length; i += info.channels) {
    seen.add((data[i] << 16) | (data[i + 1] << 8) | data[i + 2]);
    if (seen.size > QUANTISE_MAX_COLOURS) return seen.size;
  }
  return seen.size;
}

/** Palette-quantises a resized image, keeping the result only when it is actually smaller. */
async function quantise(resized) {
  const quantised = await sharp(resized).png({ palette: true, compressionLevel: 9 }).toBuffer();
  return quantised.length < resized.length ? quantised : resized;
}
```

- [ ] **Step 2: Stop clearing the destinations, and sweep instead**

Task 4's script clears every destination directory at the start of the run. That has to go before a cache can work, but the directories still must not accumulate files from assets that are no longer referenced. Replace the clearing block:

```js
for (const { dir } of Object.values(DESTINATIONS)) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}
```

with just the creation:

```js
for (const { dir } of Object.values(DESTINATIONS)) mkdirSync(dir, { recursive: true });
```

and add a sweep immediately **after** the copy loop, which deletes anything no asset claims:

```js
const claimed = new Set(Object.values(assets).map((asset) => asset.slug));
for (const { dir } of Object.values(DESTINATIONS)) {
  for (const file of readdirSync(dir)) {
    if (!claimed.has(file)) rmSync(join(dir, file));
  }
}
```

- [ ] **Step 3: Record the destination in the map**

The cache needs to find the previous run's output on disk, which means knowing which of the three directories it went to. Store the key rather than re-deriving it. In Task 4's map-entry construction, add one field:

```js
  assets[name] = {
    slug,
    kind: plan.kind,
    destination: plan.destination,
    reference: destination.reference(slug),
    hash,
  };
```

- [ ] **Step 4: Rewrite the loop to honour the treatment and skip unchanged assets**

Without the skip, `npm run convert` pays a couple of minutes of encoding on every text-only change — and an operator who feels that will start running `convert.mjs` alone, which is exactly the ordering trap the map exists to prevent.

Replace the whole copy loop with:

```js
const previous = existsSync(MAP) ? JSON.parse(readFileSync(MAP, 'utf8')).assets : {};
let encoded = 0;
let reused = 0;

for (const name of [...copy].sort()) {
  const source = readFileSync(join(SOURCE_ASSETS, name));
  const hash = createHash('sha256').update(source).digest('hex');
  const slug = slugs.get(name);

  const cached = previous[name];
  if (
    cached &&
    cached.hash === hash &&
    cached.slug === slug &&
    existsSync(join(DESTINATIONS[cached.destination].dir, cached.slug))
  ) {
    assets[name] = cached;
    reused++;
    continue;
  }

  let plan;
  let output;
  if (/\.(png|jpe?g|webp)$/i.test(name)) {
    const resized = await resizeImage(source);
    plan = planAsset({ filename: name, bytes: source.length, colours: await countColours(resized) });
    output = plan.treatment === 'resize-quantise' ? await quantise(resized) : resized;
    if (output.length > source.length) output = source;
  } else {
    plan = planAsset({ filename: name, bytes: source.length, colours: null });
    output = source;
  }

  const destination = DESTINATIONS[plan.destination];
  writeFileSync(join(destination.dir, slug), output);
  encoded++;

  assets[name] = {
    slug,
    kind: plan.kind,
    destination: plan.destination,
    reference: destination.reference(slug),
    hash,
  };
}
```

The cache checks the slug as well as the hash, so a rename in a future sync re-emits rather than pointing at the old filename.

Report both counters after the invariants:

```js
console.log(`     ${'encoded'.padEnd(18)} ${encoded}`);
console.log(`     ${'reused from cache'.padEnd(18)} ${reused}`);
```

Note the loop now `await`s, so it must sit at module top level — it already does, and Node's ESM supports top-level `await`.

- [ ] **Step 5: Run it**

Run: `node scripts/assets.mjs`

Expected: every line `ok`, including `src/assets size` at roughly **31.6 MiB** and `largest file` under 25 MiB. Exit code 0.

If the size is materially above ~35 MiB, the colour count is being taken on the wrong image — check it is measured on `resized`, not on `source`.

- [ ] **Step 6: Verify idempotency and that the cache actually hits**

```bash
node scripts/assets.mjs | tail -3
find src/assets public -type f | sort | xargs shasum > /tmp/a1.txt
time node scripts/assets.mjs | tail -3
find src/assets public -type f | sort | xargs shasum > /tmp/a2.txt
diff /tmp/a1.txt /tmp/a2.txt && echo IDENTICAL
```

Expected: `IDENTICAL`; the second run reports `reused from cache 500` and `encoded 0`, and completes in seconds rather than minutes.

A second run that reports `encoded 500` means the cache never hits — most likely the destinations are still being cleared at the start of the run, or `destination` is missing from the map entries. Fix it rather than accepting a slow pipeline: a `npm run convert` that costs minutes on every text change is one an operator will start bypassing, which is the ordering trap the map exists to prevent.

Then prove the cache invalidates rather than going stale:

```bash
node -e 'const f="src/assets/od-basicmodel.png"; require("fs").utimesSync(f, new Date(), new Date())'
node scripts/assets.mjs | tail -3   # still 500 reused — mtime is not the cache key
```

Expected: still `reused from cache 500`. The cache keys on content hash, not timestamps, so touching a file changes nothing. That is what makes the output byte-identical across machines and checkouts.

- [ ] **Step 7: Verify the animated GIFs still animate**

```bash
node --input-type=module -e '
import sharp from "sharp";
import { readdirSync } from "node:fs";
for (const f of readdirSync("src/assets").filter(f => f.endsWith(".gif"))) {
  const m = await sharp(`src/assets/${f}`, { animated: true }).metadata();
  console.log(f, "frames:", m.pages);
}
'
```

Expected: two GIFs, each with `frames` greater than 1. A frame count of 1 means an animation was flattened — silent content loss.

- [ ] **Step 8: Commit the script and the encoded assets**

```bash
npm test
git add scripts/assets.mjs src/assets public asset-map.json
git commit -m "Encode images to meet the size gate"
```

---

### Task 7: Video encoding

**Files:**
- Modify: `scripts/assets.mjs`

- [ ] **Step 1: Add the encoder**

Add `import { execFileSync } from 'node:child_process';` and:

```js
/**
 * Re-encodes an animated GIF to MP4.
 *
 * -movflags +faststart puts the index first so the browser can start playing before the file
 * has fully downloaded. yuv420p and the even-dimension scale filter are what Safari requires.
 */
function encodeVideo(from, to) {
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-i', from,
    '-movflags', '+faststart',
    '-pix_fmt', 'yuv420p',
    '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
    '-c:v', 'libx264', '-crf', '23', '-preset', 'slow', '-an',
    to,
  ]);
}
```

- [ ] **Step 2: Branch on the treatment**

A GIF that becomes a video changes extension, so the cache must compare against the slug the run would actually produce — not the source's. That means knowing the plan before the cache check. For anything that is not a still image the plan needs no colour count, so it can be computed up front; for still images the extension never changes, so `slug` is already correct.

`ffmpeg` reads a path rather than a buffer, so the video is encoded from `source/` directly.

Replace the **whole copy loop** with its final form:

```js
for (const name of [...copy].sort()) {
  const from = join(SOURCE_ASSETS, name);
  const source = readFileSync(from);
  const hash = createHash('sha256').update(source).digest('hex');
  const slug = slugs.get(name);
  const still = /\.(png|jpe?g|webp)$/i.test(name);

  // A still image's plan needs a colour count, which needs the resize. Everything else can be
  // planned immediately, and only those can change extension.
  const early = still ? null : planAsset({ filename: name, bytes: source.length, colours: null });
  const finalSlug = early?.treatment === 'encode-video' ? slug.replace(/\.gif$/i, '.mp4') : slug;

  const cached = previous[name];
  if (
    cached &&
    cached.hash === hash &&
    cached.slug === finalSlug &&
    existsSync(join(DESTINATIONS[cached.destination].dir, cached.slug))
  ) {
    assets[name] = cached;
    reused++;
    continue;
  }

  let plan = early;
  let output = source;
  if (still) {
    const resized = await resizeImage(source);
    plan = planAsset({ filename: name, bytes: source.length, colours: await countColours(resized) });
    output = plan.treatment === 'resize-quantise' ? await quantise(resized) : resized;
    if (output.length > source.length) output = source;
  }

  const destination = DESTINATIONS[plan.destination];
  const target = join(destination.dir, finalSlug);
  if (plan.treatment === 'encode-video') encodeVideo(from, target);
  else writeFileSync(target, output);
  encoded++;

  assets[name] = {
    slug: finalSlug,
    kind: plan.kind,
    destination: plan.destination,
    reference: destination.reference(finalSlug),
    hash,
  };
}
```

- [ ] **Step 3: Run it and check the result**

```bash
node scripts/assets.mjs
ls -l public/media
node -e 'const m=require("./asset-map.json").assets["Knowledge Base Demo.gif"]; console.log(m)'
```

Expected: every invariant `ok`; one MP4 in `public/media` at roughly 2 MB; the map entry has `kind: "video"`, `slug: "knowledge-base-demo.mp4"` and `reference: "/media/knowledge-base-demo.mp4"`.

- [ ] **Step 4: Confirm the page emits a video element**

```bash
node scripts/convert.mjs > /dev/null
grep -n '<video' src/content/docs/opendialog-platform/interpreters-and-natural-language-understanding/interpreters/available-interpreters/dialogflow-interpreter/google-dialogflow-knowledge-base/index.md
```

Expected: one `<video autoplay loop muted playsinline src="/media/knowledge-base-demo.mp4"></video>`. The file must still be `index.md` — not `.mdx`.

- [ ] **Step 5: Commit**

```bash
npm test
git add scripts/assets.mjs public asset-map.json src/content/docs
git commit -m "Re-encode the oversized GIF to MP4"
```

---

### Task 8: Phase gate

Prove the gate, record what was found, and stop.

**Files:**
- Modify: `MIGRATION-NOTES.md` (append only)

- [ ] **Step 1: Run the whole pipeline from scratch**

```bash
npm run convert
npx astro build 2>&1 | tail -5
```

Expected: every invariant in every script `ok`; `astro build` succeeds, 205 pages.

- [ ] **Step 2: Prove no image 404s**

```bash
node --input-type=module -e '
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
const walk=(d)=>readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(d,e.name)):[join(d,e.name)]);
let checked=0, broken=[];
for (const f of walk("src/content/docs")) {
  const text = readFileSync(f, "utf8");
  for (const [, ref] of text.matchAll(/~\/assets\/([^)>\s"]+)/g)) {
    checked++;
    if (!existsSync(join("src/assets", ref))) broken.push(`${f}: ${ref}`);
  }
  for (const [, dir, ref] of text.matchAll(/"\/(media|files)\/([^"]+)"/g)) {
    checked++;
    if (!existsSync(join("public", dir, ref))) broken.push(`${f}: /${dir}/${ref}`);
  }
}
console.log("references checked:", checked);
console.log("broken:", broken.length);
for (const b of broken.slice(0, 10)) console.log("  ", b);
process.exit(broken.length ? 1 : 0);
'
```

Expected: `broken: 0`. This is the invariant that matters — counters measure text, this resolves every emitted path against the filesystem.

- [ ] **Step 3: Prove the built site carries no unresolved image**

```bash
grep -ro 'src="/\.gitbook/assets/[^"]*"' dist | head
echo "---"
grep -rl '_astro' dist --include='*.html' | wc -l
```

Expected: no output from the first grep (no placeholder survived into the build); a non-zero count from the second (Astro emitted optimised variants).

- [ ] **Step 4: Confirm the size gate**

```bash
du -sh src/assets public
find src/assets public -type f -size +25000k
```

Expected: `src/assets` around 32 MB, well under 60 MB; the `find` returns nothing.

- [ ] **Step 5: Append to MIGRATION-NOTES.md**

Append a dated Phase 3 section covering, at minimum:

- The five measured corrections to the brief from the design spec, with the figures as they actually ran.
- The final invariant output from `assets.mjs`, pasted from the real run rather than transcribed.
- The slug rule, and that it produced zero collisions across 509 references.
- The quantisation threshold, that it is measured on the resized image, and the calibration error that made an earlier draft fail the gate at 84.6 MiB — so nobody re-derives it from a downsample.
- Which assets went to `public/` rather than `src/assets/`, and why (video and downloads cannot pass through `astro:assets`).
- **The Phase 4 handoff:** the 9 dropped card covers remain in `source/`, listed by path; restoring card covers means copying them through the same pipeline, and the photograph among them must stay full-colour.
- Every figure must be one measured in this phase. Do not copy a number from the spec without re-checking it — eight of the design spec's counts proved wrong in Phase 2, and two of this spec's own figures were corrected during its own self-review.

- [ ] **Step 6: Commit and stop**

```bash
git add MIGRATION-NOTES.md
git commit -m "Record Phase 3 asset findings"
```

Do **not** push and do **not** open a PR. Report to Pat and wait. Do not begin Phase 4.

---
