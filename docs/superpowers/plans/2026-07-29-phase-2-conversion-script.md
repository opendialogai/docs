# Phase 2 Conversion Script Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `node scripts/convert.mjs` turns the 204 published GitBook pages in `source/` into valid Starlight content under `src/content/docs/`, and `node scripts/sidebar.mjs` generates the site's sidebar from `source/SUMMARY.md`.

**Architecture:** Pure `string -> string` transform functions in `scripts/lib/`, each unit-tested against inline fixtures with no filesystem access. Two code-safety primitives in `lib/segments.mjs` guarantee fenced code and inline code spans are never touched. Thin orchestrators (`convert.mjs`, `sidebar.mjs`) do the I/O, then assert corpus-wide invariants and exit non-zero on any divergence — the same self-verifying pattern `scripts/routes.mjs` already uses against the sitemap snapshot.

**Tech Stack:** ESM (`"type": "module"`), `node:test` for tests, Astro 7.1.5 + Starlight 0.41.5. `.node-version` pins CI to Node 24.18.0; the local shell runs Node 22.19.0 with npm 11.6.0. Both npm are 11.x, so the lockfile shape agrees and the Node skew affects only the test-runner invocation noted below.

**Verified while planning:** the `segments.mjs` and `sidebar-tree.mjs` implementations below were extracted from this document and run against their own tests — 17 pass. The other modules' code is written to the same standard but has not been executed.

**Design spec:** `docs/superpowers/specs/2026-07-29-phase-2-conversion-design.md`. Read it before starting — it carries the measured counts and the eight corrections to `MIGRATION-BRIEF.md`.

## Global Constraints

- **Never hand-edit `src/content/docs/`.** It is generated. Fix the script and re-run.
- **`source/` is read-only and git-ignored.** Scripts read from `source/`, write to `src/`. Never mutate `source/` in place. Repopulate with `git archive documentation | tar -x -C source/`.
- **Never write to the `documentation` branch.** GitBook syncs to it bidirectionally.
- **Do not edit documentation prose.** Not typos, not clarity. Log in `MIGRATION-NOTES.md`.
- **Scripts must be idempotent.** Same input gives byte-identical output. No timestamps, no randomness, no filesystem-ordering dependence.
- **No new npm dependencies.** The lockfile has broken CI twice (see `MIGRATION-NOTES.md`, npm 10/11 skew). `node:test` is built in. If a task seems to need a package, stop and ask.
- **Expected counts are authoritative.** If output diverges from an invariant, the script is wrong. Do not adjust the expectation to match the output.
- **Stop at the phase gate.** Task 13 ends Phase 2. Do not begin Phase 3 asset work.
- Node's built-in test runner: add `"test": "node --test \"scripts/lib/*.test.mjs\""` to `package.json` in Task 1, and use `node --test scripts/lib/<name>.test.mjs` for single files. **Use the quoted glob, not a bare directory** — `node --test scripts/lib/` fails with `Could not find` on Node 22.x, which is what runs locally, even though `.node-version` pins CI to 24.18.0. Verified both forms.
- All new files use ESM `import`/`export`, 2-space indent, single quotes, semicolons — matching `scripts/routes.mjs`.
- Comments use JSDoc `/** ... */` for exported functions, explaining WHAT and WHY, never history or "improved".

## File Structure

| File | Responsibility |
|---|---|
| `scripts/lib/summary.mjs` | Parse `source/SUMMARY.md` into ordered nav entries. Shared by `routes.mjs` and `sidebar.mjs`. |
| `scripts/lib/segments.mjs` | The two code-safety primitives every other transform is built on. |
| `scripts/lib/frontmatter.mjs` | Parse GitBook frontmatter (including folded block scalars), emit Starlight frontmatter. |
| `scripts/lib/links.mjs` | Extract link/image targets safely; rewrite page links to route URLs. |
| `scripts/lib/gitbook-blocks.mjs` | All `{% … %}` block syntax: hint, code, file, embed, stepper, columns. |
| `scripts/lib/link-cards.mjs` | Route-map-dependent card emission: `{% content-ref %}` and card-tables. |
| `scripts/lib/figures.mjs` | `<figure>` / bare `<img>` to markdown images. |
| `scripts/lib/mdx.mjs` | JSX normalisation and brace escaping for `.mdx` output. |
| `src/components/Embed.astro` | Lazy 16:9 Loom/YouTube iframe. |
| `scripts/convert.mjs` | Orchestrate the per-file pipeline, assert corpus invariants, report. |
| `scripts/sidebar.mjs` | `SUMMARY.md` to `src/sidebar.generated.mjs`. |
| `scripts/routes.mjs` | Existing. Modified in Task 1 to import `lib/summary.mjs`. |
| `astro.config.mjs` | Existing. Modified in Task 12 to import the generated sidebar. |

### Refinement to the spec, found while planning

The spec proposed `splitSegments()` / `mapProse()` in `lib/segments.mjs`. Measurement showed
`{% columns %}` / `{% column %}` **wrap fenced code blocks** (1 and 2 instances), so a block's
open and close markers can land in different prose segments — a per-segment mapper would fail
to pair them. Two primitives replace it:

- `mapLines()` — walks lines with fence state, calls the callback **only** on lines outside
  fences. Block constructs keep their own state across the walk, so they span fences safely.
- `protectCode()` — masks fenced blocks and inline code spans with placeholder tokens, runs a
  regex transform over the remainder, restores. For inline transforms that never span a fence.

The spec's intent is unchanged: code is immune to every transformation.

---

### Task 1: Shared `SUMMARY.md` parser

`scripts/routes.mjs` carries a `SUMMARY.md` parser that `scripts/sidebar.mjs` needs to reuse
verbatim — including the escaped-bracket trap that silently drops four live pages. Extract it
so there is one parser, in one place, to get wrong.

**Files:**
- Create: `scripts/lib/summary.mjs`
- Create: `scripts/lib/summary.test.mjs`
- Modify: `scripts/routes.mjs` (delete lines 20–50, import instead)
- Modify: `package.json` (add `test` script)

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `slugify(s: string) -> string`
  - `parseSummary(text: string) -> Array<{ depth: number, label: string, source: string, section: { label: string, slug: string } }>`

- [ ] **Step 1: Write the failing test**

Create `scripts/lib/summary.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSummary, slugify } from './summary.mjs';

test('slugify lowercases and hyphenates', () => {
  assert.equal(slugify('CORE CONCEPTS'), 'core-concepts');
  assert.equal(slugify('Developing With OpenDialog'), 'developing-with-opendialog');
});

test('a section heading anchor id becomes the section slug', () => {
  const entries = parseSummary(
    '## GETTING STARTED <a href="#getting-started-1" id="getting-started-1"></a>\n' +
      '\n* [Introduction](README.md)\n'
  );
  assert.equal(entries[0].section.slug, 'getting-started-1');
  assert.equal(entries[0].section.label, 'GETTING STARTED');
});

test('a section heading without an anchor slugifies its text', () => {
  const entries = parseSummary('## CORE CONCEPTS\n\n* [Model](model.md)\n');
  assert.equal(entries[0].section.slug, 'core-concepts');
});

test('escaped brackets in a label are unescaped, not dropped', () => {
  // A label regex of \[([^\]]*)\] silently drops these four live pages.
  const entries = parseSummary(
    '## CREATE AI APPLICATIONS\n\n* [\\[Deprecated\\] webhook actions](a/b.md)\n'
  );
  assert.equal(entries.length, 1);
  assert.equal(entries[0].label, '[Deprecated] webhook actions');
  assert.equal(entries[0].source, 'a/b.md');
});

test('indentation is captured as depth', () => {
  const entries = parseSummary(
    '## S\n\n* [Parent](p/README.md)\n  * [Child](p/c.md)\n    * [Grandchild](p/c/g.md)\n'
  );
  assert.deepEqual(entries.map((e) => e.depth), [0, 2, 4]);
});

test('percent-encoded paths are decoded', () => {
  const entries = parseSummary('## S\n\n* [X](a/b%20c.md)\n');
  assert.equal(entries[0].source, 'a/b c.md');
});

test('list items before any section heading are ignored', () => {
  assert.deepEqual(parseSummary('* [Orphan](x.md)\n'), []);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/lib/summary.test.mjs`
Expected: FAIL — `Cannot find module './summary.mjs'`

- [ ] **Step 3: Write the implementation**

Create `scripts/lib/summary.mjs` by moving the parser out of `scripts/routes.mjs` unchanged:

```js
/**
 * Parses source/SUMMARY.md, GitBook's navigation file, into an ordered list of entries.
 *
 * SUMMARY.md is the source of truth for both the sidebar and the live URL of every page.
 * routes.mjs and sidebar.mjs must agree exactly, so they share this parser.
 */

/** Lowercases and hyphenates a heading into a URL segment. */
export const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Parses SUMMARY.md into an ordered list of nav entries. */
export function parseSummary(text) {
  const entries = [];
  let section = null;
  for (const line of text.split('\n')) {
    const heading = line.match(/^##\s+(.*)$/);
    if (heading) {
      const raw = heading[1];
      // "## GETTING STARTED <a href="#getting-started-1" id="getting-started-1"></a>"
      // The anchor id, where present, is the URL segment for the section.
      const anchor = raw.match(/id="([^"]+)"/);
      const label = raw.replace(/<a\b[^>]*>.*?<\/a>/g, '').trim();
      section = { label, slug: anchor ? anchor[1] : slugify(label) };
      continue;
    }
    // Labels may contain escaped brackets — "[\[Deprecated\] webhook actions]" — so the
    // label is matched greedily up to the final "](".
    const item = line.match(/^(\s*)\*\s+\[(.*)\]\(([^)]+)\)/);
    if (item && section) {
      entries.push({
        depth: item[1].length,
        label: item[2].replace(/\\([[\]])/g, '$1'),
        source: decodeURIComponent(item[3]).trim(),
        section,
      });
    }
  }
  return entries;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/lib/summary.test.mjs`
Expected: PASS, 7 tests

- [ ] **Step 5: Point `routes.mjs` at the shared parser**

In `scripts/routes.mjs`, delete the `slugify` const (line 20) and the whole `parseSummary`
function (lines 22–50), and add to the imports at the top:

```js
import { parseSummary } from './lib/summary.mjs';
```

`slugify` is not used elsewhere in `routes.mjs`, so no other change is needed.

- [ ] **Step 6: Verify `routes.mjs` still passes 204/204**

Run: `node scripts/routes.mjs`
Expected output ends with:
```
pages derived      : 204
live sitemap URLs  : 204
unreachable        : 0
not live today     : 0
route parity: OK
```

- [ ] **Step 7: Verify `route-map.json` is unchanged**

Run: `git diff --stat route-map.json`
Expected: no output. The refactor must not alter the generated file by even one byte.

- [ ] **Step 8: Add the test script**

In `package.json`, add to `"scripts"`:

```json
    "test": "node --test \"scripts/lib/*.test.mjs\"",
```

Verify: `npm test` runs and reports the summary tests. The quoted glob matters — a bare
directory argument fails on the locally installed Node 22.x.

- [ ] **Step 9: Commit**

```bash
git add scripts/lib/summary.mjs scripts/lib/summary.test.mjs scripts/routes.mjs package.json
git commit -m "Share the SUMMARY.md parser between routes and sidebar"
```

---

### Task 2: Code-safety primitives

Fenced code and inline code spans must be immune to every transformation. The corpus contains
`{first_name}` inside JSON fences, `{% code %}` wrapping fences, `{% columns %}` spanning
fences, and 1,317 asset filenames containing parentheses. This is the single largest source of
silent corruption, so it is the most heavily tested module.

**Files:**
- Create: `scripts/lib/segments.mjs`
- Create: `scripts/lib/segments.test.mjs`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `mapLines(text: string, fn: (line: string) => string | string[] | null) -> string` — calls `fn` only on lines outside fenced code. Returning `null` deletes the line; returning an array splices in several. Fence delimiter lines and fence contents pass through untouched.
  - `protectCode(text: string, fn: (masked: string) => string) -> string` — masks fenced blocks and inline code spans with `\u0000<n>\u0000` tokens, applies `fn`, restores.

- [ ] **Step 1: Write the failing test**

Create `scripts/lib/segments.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mapLines, protectCode } from './segments.mjs';

const upper = (line) => line.toUpperCase();

test('mapLines transforms prose lines', () => {
  assert.equal(mapLines('a\nb', upper), 'A\nB');
});

test('mapLines leaves fenced code and its delimiters untouched', () => {
  const input = 'a\n```json\n{ "k": "v" }\n```\nb';
  assert.equal(mapLines(input, upper), 'A\n```json\n{ "k": "v" }\n```\nB');
});

test('mapLines lets a block construct span a fence', () => {
  // {% columns %} wraps fenced code in the real corpus. Open and close markers must
  // both reach the callback even though a fence sits between them.
  const seen = [];
  const input = '{% columns %}\n```json\n{ "a": 1 }\n```\n{% endcolumns %}';
  mapLines(input, (line) => {
    seen.push(line);
    return line;
  });
  assert.deepEqual(seen, ['{% columns %}', '{% endcolumns %}']);
});

test('mapLines does not treat an indented info string as a closing fence', () => {
  const input = '```js\nconst a = 1;\n```\nx';
  assert.equal(mapLines(input, upper), '```js\nconst a = 1;\n```\nX');
});

test('mapLines supports tilde fences', () => {
  assert.equal(mapLines('~~~\nx\n~~~\ny', upper), '~~~\nx\n~~~\nY');
});

test('mapLines treats an unterminated fence as code to the end', () => {
  assert.equal(mapLines('a\n```\nb\nc', upper), 'A\n```\nb\nc');
});

test('mapLines can delete and splice lines', () => {
  assert.equal(mapLines('a\nb', (l) => (l === 'a' ? null : ['x', 'y'])), 'x\ny');
});

test('protectCode hides fenced blocks from a regex transform', () => {
  const input = 'say {hello}\n```\nkeep {hello}\n```';
  const out = protectCode(input, (t) => t.replaceAll('{hello}', 'WORLD'));
  assert.equal(out, 'say WORLD\n```\nkeep {hello}\n```');
});

test('protectCode hides inline code spans', () => {
  const out = protectCode('a `{x}` b {x}', (t) => t.replaceAll('{x}', 'Y'));
  assert.equal(out, 'a `{x}` b Y');
});

test('protectCode handles a path with parentheses outside code', () => {
  const input = '![](<../.gitbook/assets/image (149).png>)';
  const out = protectCode(input, (t) => t.replace('../.gitbook/assets/', '/.gitbook/assets/'));
  assert.equal(out, '![](</.gitbook/assets/image (149).png>)');
});

test('protectCode is a round trip when the transform does nothing', () => {
  const input = 'a\n```js\nconst x = `t`;\n```\n`inline` b';
  assert.equal(protectCode(input, (t) => t), input);
});

test('protectCode restores double-backtick spans', () => {
  const input = 'a ``code with ` tick`` b';
  assert.equal(protectCode(input, (t) => t), input);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/lib/segments.test.mjs`
Expected: FAIL — `Cannot find module './segments.mjs'`

- [ ] **Step 3: Write the implementation**

Create `scripts/lib/segments.mjs`:

```js
/**
 * Code-safety primitives. Every markdown transformation in this pipeline is built on one of
 * these two functions so that fenced code blocks and inline code spans are never modified.
 *
 * The source contains `{first_name}` inside JSON fences, `{% code %}` blocks wrapping fences,
 * and 1,317 asset filenames containing parentheses. A transform that reaches inside code
 * corrupts content silently, which is why these are the foundation rather than a convenience.
 */

const FENCE = /^(\s*)(`{3,}|~{3,})(.*)$/;
const TOKEN = '\u0000';

/** True when `line` closes a fence opened with `marker`. A closing fence carries no info string. */
function closesFence(match, marker) {
  return match[2][0] === marker[0] && match[2].length >= marker.length && match[3].trim() === '';
}

/**
 * Applies `fn` to every line that sits outside a fenced code block.
 *
 * Fence delimiters and fence contents pass through untouched and are never shown to `fn`.
 * Because this is a single stateful pass over all lines, a block construct whose open and
 * close markers straddle a fence — as `{% columns %}` does — still sees both markers.
 *
 * `fn` may return a string, an array of strings to splice in, or null to delete the line.
 */
export function mapLines(text, fn) {
  const out = [];
  let marker = null;
  for (const line of text.split('\n')) {
    const match = line.match(FENCE);
    if (marker === null) {
      if (match) {
        marker = match[2];
        out.push(line);
        continue;
      }
      const result = fn(line);
      if (result === null) continue;
      if (Array.isArray(result)) out.push(...result);
      else out.push(result);
      continue;
    }
    if (match && closesFence(match, marker)) marker = null;
    out.push(line);
  }
  return out.join('\n');
}

/**
 * Masks fenced code blocks and inline code spans, applies `fn` to what remains, then restores.
 *
 * For inline transformations — link rewriting, entity stripping, brace escaping — which never
 * span a fence. Note that a fenced block collapses to a single token line while masked, so
 * `fn` must not depend on line structure. Use mapLines for anything that does.
 */
export function protectCode(text, fn) {
  const stash = [];
  const keep = (s) => `${TOKEN}${stash.push(s) - 1}${TOKEN}`;
  const masked = [];
  let marker = null;
  let block = [];

  for (const line of text.split('\n')) {
    const match = line.match(FENCE);
    if (marker === null) {
      if (match) {
        marker = match[2];
        block = [line];
        continue;
      }
      masked.push(line.replace(/(`+)(?:(?!\1).)*\1/g, keep));
      continue;
    }
    block.push(line);
    if (match && closesFence(match, marker)) {
      masked.push(keep(block.join('\n')));
      marker = null;
      block = [];
    }
  }
  // An unterminated fence is still code; keep it masked rather than exposing it to `fn`.
  if (marker !== null) masked.push(keep(block.join('\n')));

  return fn(masked.join('\n')).replace(
    new RegExp(`${TOKEN}(\\d+)${TOKEN}`, 'g'),
    (_, index) => stash[Number(index)]
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/lib/segments.test.mjs`
Expected: PASS, 12 tests

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/segments.mjs scripts/lib/segments.test.mjs
git commit -m "Add code-safety primitives for markdown transforms"
```

---

### Task 3: Frontmatter

29 of the 71 GitBook `description` values use YAML folded block scalars (`>-`). A line-based
`^description:\s*(.*)$` parser returns an empty string for all 29, silently dropping the lead
text that Phase 1 added a `PageTitle` override specifically to display. `hidden: true` appears
on two pages that are both live in the sitemap and must be dropped, not honoured.

**Files:**
- Create: `scripts/lib/frontmatter.mjs`
- Create: `scripts/lib/frontmatter.test.mjs`

**Interfaces:**
- Consumes: `mapLines` from `./segments.mjs`.
- Produces:
  - `parseFrontmatter(text: string) -> { data: Record<string, string>, body: string }` — throws on any YAML construct it does not recognise.
  - `emitFrontmatter(fields: { title: string, description?: string }) -> string` — returns the block including trailing newline.
  - `takeTitle(body: string) -> { title: string | null, body: string }` — removes the first H1 and returns it. Title derivation lives beside frontmatter emission because the title comes from the body, not from the frontmatter.

- [ ] **Step 1: Write the failing test**

Create `scripts/lib/frontmatter.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emitFrontmatter, parseFrontmatter, takeTitle } from './frontmatter.mjs';

test('a file with no frontmatter returns the whole text as body', () => {
  assert.deepEqual(parseFrontmatter('# Title\n'), { data: {}, body: '# Title\n' });
});

test('a plain scalar description is read', () => {
  const { data, body } = parseFrontmatter('---\ndescription: Hello there\n---\n\n# T\n');
  assert.equal(data.description, 'Hello there');
  assert.equal(body, '\n# T\n');
});

test('a folded block scalar is folded into one line', () => {
  // 29 of 71 descriptions use this form. A line-based parser drops them all.
  const text =
    '---\ndescription: >-\n  Before jumping into the build process, you need a clear\n' +
    '  understanding of the key building blocks.\n---\n\n# T\n';
  assert.equal(
    parseFrontmatter(text).data.description,
    'Before jumping into the build process, you need a clear understanding of the key building blocks.'
  );
});

test('hidden is parsed so the caller can drop it deliberately', () => {
  assert.equal(parseFrontmatter('---\nhidden: true\n---\n\n# T\n').data.hidden, 'true');
});

test('quoted scalars are unquoted', () => {
  assert.equal(parseFrontmatter("---\ndescription: 'a: b'\n---\n").data.description, 'a: b');
});

test('an unrecognised YAML construct throws rather than losing data', () => {
  assert.throws(() => parseFrontmatter('---\ntags:\n  - a\n  - b\n---\n'), /unsupported/i);
  assert.throws(() => parseFrontmatter('---\ndescription: |\n  literal\n---\n'), /unsupported/i);
});

test('emitFrontmatter writes title and description', () => {
  assert.equal(
    emitFrontmatter({ title: 'Getting ready', description: 'Some text' }),
    '---\ntitle: Getting ready\ndescription: Some text\n---\n'
  );
});

test('emitFrontmatter omits an absent or empty description', () => {
  assert.equal(emitFrontmatter({ title: 'T' }), '---\ntitle: T\n---\n');
  assert.equal(emitFrontmatter({ title: 'T', description: '' }), '---\ntitle: T\n---\n');
});

test('emitFrontmatter quotes values that YAML would misread', () => {
  assert.equal(
    emitFrontmatter({ title: 'Semantic Classifier: Query Classifier' }),
    "---\ntitle: 'Semantic Classifier: Query Classifier'\n---\n"
  );
  assert.equal(
    emitFrontmatter({ title: '[Deprecated] webhook actions' }),
    "---\ntitle: '[Deprecated] webhook actions'\n---\n"
  );
});

test('emitFrontmatter doubles single quotes inside a quoted value', () => {
  assert.equal(
    emitFrontmatter({ title: "Don't: stop" }),
    "---\ntitle: 'Don''t: stop'\n---\n"
  );
});

test('parse then emit round trips a folded description', () => {
  const { data } = parseFrontmatter('---\ndescription: >-\n  a\n  b\n---\n');
  assert.equal(emitFrontmatter({ title: 'T', description: data.description }),
    '---\ntitle: T\ndescription: a b\n---\n');
});

test('takeTitle removes the H1 and returns its text', () => {
  assert.deepEqual(takeTitle('# Getting ready\n\nBody text.\n'), {
    title: 'Getting ready',
    body: '\nBody text.\n',
  });
});

test('takeTitle strips inline tags and unescapes brackets', () => {
  assert.equal(takeTitle('# \\[Deprecated] webhook actions\n').title, '[Deprecated] webhook actions');
  assert.equal(takeTitle('# Best <mark>practices</mark>\n').title, 'Best practices');
});

test('takeTitle ignores a # line inside a fenced code block', () => {
  // Four source files open a shell fence with a comment; that must not become the title.
  const body = '```bash\n# Install the CLI\n```\n\n# Real title\n';
  const { title, body: rest } = takeTitle(body);
  assert.equal(title, 'Real title');
  assert.ok(rest.includes('# Install the CLI'), 'the fenced comment must survive');
});

test('takeTitle removes only the first H1', () => {
  const { title, body } = takeTitle('# One\n\n# Two\n');
  assert.equal(title, 'One');
  assert.ok(body.includes('# Two'));
});

test('takeTitle returns null when there is no H1', () => {
  assert.equal(takeTitle('Just prose.\n').title, null);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/lib/frontmatter.test.mjs`
Expected: FAIL — `Cannot find module './frontmatter.mjs'`

- [ ] **Step 3: Write the implementation**

Create `scripts/lib/frontmatter.mjs`:

```js
/**
 * GitBook frontmatter in, Starlight frontmatter out.
 *
 * The corpus uses exactly two YAML scalar forms: plain, and folded block scalars ( >- ) which
 * carry 29 of the 71 page descriptions. Anything else throws, so a shape that appears in a
 * later GitBook sync fails loudly at cutover instead of silently dropping a description.
 *
 * Title derivation lives here too: Starlight takes the title from frontmatter, but GitBook
 * keeps it as the body's H1, so the two belong together.
 */
import { mapLines } from './segments.mjs';

const KEY = /^([A-Za-z_][\w-]*):[ \t]*(.*)$/;

/** Strips matching surrounding quotes from a plain YAML scalar. */
function unquote(value) {
  const match = value.match(/^(['"])([\s\S]*)\1$/);
  return match ? match[2].replace(/''/g, "'") : value;
}

/**
 * Splits leading YAML frontmatter from the markdown body.
 *
 * Returns every key as a string; the caller decides which to keep. `hidden` in particular is
 * parsed but must be dropped by the caller — the two pages carrying it are both live.
 */
export function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { data: {}, body: text };

  const data = {};
  const lines = match[1].split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') continue;
    const kv = line.match(KEY);
    if (!kv) throw new Error(`unsupported YAML in frontmatter: ${JSON.stringify(line)}`);
    const [, key, rest] = kv;

    if (rest === '>-' || rest === '>') {
      const folded = [];
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) folded.push(lines[++i].trim());
      data[key] = folded.join(' ');
      continue;
    }
    if (rest.startsWith('|')) {
      throw new Error(`unsupported YAML literal block scalar for key ${key}`);
    }
    if (rest === '') throw new Error(`unsupported YAML nested value for key ${key}`);
    data[key] = unquote(rest.trim());
  }
  return { data, body: text.slice(match[0].length) };
}

/** True when a value must be single-quoted to survive a YAML round trip. */
function needsQuoting(value) {
  return /^[\s>|*&!%@`'"[{#-]/.test(value) || /: |:$|\s#|\s$/.test(value);
}

/** Serialises one scalar, quoting only when YAML would otherwise misread it. */
function scalar(value) {
  return needsQuoting(value) ? `'${value.replace(/'/g, "''")}'` : value;
}

/** Emits the Starlight frontmatter block, including its trailing newline. */
export function emitFrontmatter({ title, description }) {
  const lines = ['---', `title: ${scalar(title)}`];
  if (description) lines.push(`description: ${scalar(description)}`);
  lines.push('---', '');
  return lines.join('\n');
}

/**
 * Removes the first H1 from the body and returns its text.
 *
 * Starlight renders the frontmatter title as the page heading, so leaving the H1 in place
 * would show it twice. Uses mapLines so a "# comment" opening a shell fence — which four
 * source files have — is never mistaken for the title.
 */
export function takeTitle(body) {
  let title = null;
  const rest = mapLines(body, (line) => {
    if (title !== null) return line;
    const h1 = line.match(/^#\s+(.*)$/);
    if (!h1) return line;
    title = h1[1].replace(/<[^>]*>/g, '').replace(/\\([[\]])/g, '$1').trim();
    return null;
  });
  return { title, body: rest };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/lib/frontmatter.test.mjs`
Expected: PASS, 16 tests

- [ ] **Step 5: Verify the parser handles the whole corpus**

Run:
```bash
node -e '
import("./scripts/lib/frontmatter.mjs").then(({ parseFrontmatter, takeTitle }) => {
  const fs = require("fs");
  const rm = JSON.parse(fs.readFileSync("route-map.json", "utf8"));
  let withDescription = 0, withTitle = 0;
  for (const r of rm) {
    const { data, body } = parseFrontmatter(fs.readFileSync("source/" + r.source, "utf8"));
    if (data.description) withDescription++;
    if (takeTitle(body).title) withTitle++;
  }
  console.log("descriptions parsed:", withDescription, " titles found:", withTitle);
});'
```
Expected: `descriptions parsed: 71  titles found: 204`.

A description count below 71 means the folded block scalar handling is wrong — that is the
failure mode this module exists to prevent, and it is silent. Any throw means an unrecognised
YAML shape; fix the parser, do not widen the catch.

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/frontmatter.mjs scripts/lib/frontmatter.test.mjs
git commit -m "Parse GitBook frontmatter including folded block scalars"
```

---

### Task 4: Link extraction and rewriting

381 in-prose page links must become route URLs: 311 in `.md` form and 70 in directory form
(`.../webhook-action/`), the latter absent from the brief entirely. A naive `\]\(([^)]+)\)`
regex truncates at the first `)` inside `image (149).png` and mangles 1,317 asset filenames —
this is not hypothetical, it produced a false "unresolved link" report during design.

**Files:**
- Create: `scripts/lib/links.mjs`
- Create: `scripts/lib/links.test.mjs`

**Interfaces:**
- Consumes: `protectCode` from `./segments.mjs`.
- Produces:
  - `extractTargets(text: string) -> Array<{ start: number, end: number, target: string, angled: boolean }>` — character offsets of every markdown link/image destination.
  - `resolveSource(fromSource: string, target: string) -> string | null` — resolves a relative link to a `source/`-relative `.md` path, clamping `..` at the root. Returns `null` for external, `mailto:`, bare anchors and `/broken/pages/`.
  - `rewriteLinks(text: string, { source: string, routes: Map<string, { url: string }> }) -> string` — throws `Error` naming the file and target on any unresolved internal page link.

- [ ] **Step 1: Write the failing test**

Create `scripts/lib/links.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractTargets, resolveSource, rewriteLinks } from './links.mjs';

const routes = new Map([
  ['a/b.md', { url: '/section/a/b' }],
  ['a/c/README.md', { url: '/section/a/c' }],
  ['top.md', { url: '/section/top' }],
]);
const ctx = { source: 'a/start.md', routes };

test('extractTargets keeps balanced parentheses in a bare path', () => {
  const found = extractTargets('![](../.gitbook/assets/image (149).png)');
  assert.deepEqual(found.map((f) => f.target), ['../.gitbook/assets/image (149).png']);
});

test('extractTargets reads the angle-bracket form', () => {
  const found = extractTargets('![alt](<../.gitbook/assets/a b (1).png>)');
  assert.equal(found[0].target, '../.gitbook/assets/a b (1).png');
  assert.equal(found[0].angled, true);
});

test('extractTargets finds several targets on one line', () => {
  assert.deepEqual(extractTargets('[a](x.md) and [b](y.md)').map((f) => f.target), ['x.md', 'y.md']);
});

test('extractTargets ignores an unclosed destination', () => {
  assert.deepEqual(extractTargets('[a](x.md'), []);
});

test('resolveSource resolves a relative .md link', () => {
  assert.equal(resolveSource('a/start.md', 'b.md'), 'a/b.md');
  assert.equal(resolveSource('a/start.md', '../top.md'), 'top.md');
});

test('resolveSource maps a directory link to that directory README', () => {
  assert.equal(resolveSource('a/start.md', 'c/'), 'a/c/README.md');
});

test('resolveSource clamps .. at the source root', () => {
  // secret-context.md carries one ../ too many and would otherwise escape the repo.
  assert.equal(
    resolveSource('core-concepts/contexts-and-attributes/secret-context.md',
      '../../../opendialog-platform/actions/webhook-action/'),
    'opendialog-platform/actions/webhook-action/README.md'
  );
});

test('resolveSource returns null for links that are not internal pages', () => {
  for (const t of ['https://x.com/y', 'mailto:a@b.c', '#anchor', '/broken/pages/abc']) {
    assert.equal(resolveSource('a/start.md', t), null, t);
  }
});

test('resolveSource returns null for an asset reference', () => {
  assert.equal(resolveSource('a/start.md', '../.gitbook/assets/x.png'), null);
});

test('rewriteLinks maps a .md link to its route URL', () => {
  assert.equal(rewriteLinks('see [B](b.md)', ctx), 'see [B](/section/a/b)');
});

test('rewriteLinks preserves an anchor', () => {
  assert.equal(rewriteLinks('[B](b.md#how-to)', ctx), '[B](/section/a/b#how-to)');
});

test('rewriteLinks maps a directory link', () => {
  assert.equal(rewriteLinks('[C](c/)', ctx), '[C](/section/a/c)');
});

test('rewriteLinks leaves external links, anchors and broken pages alone', () => {
  const input = '[x](https://a.b) [y](#z) [w](/broken/pages/QQ) [v](mailto:a@b.c)';
  assert.equal(rewriteLinks(input, ctx), input);
});

test('rewriteLinks does not touch links inside code', () => {
  const input = '```\n[B](b.md)\n```\n`[B](b.md)`';
  assert.equal(rewriteLinks(input, ctx), input);
});

test('rewriteLinks leaves asset references untouched for Phase 3', () => {
  const input = '![](<../.gitbook/assets/image (1).png>)';
  assert.equal(rewriteLinks(input, ctx), input);
});

test('rewriteLinks throws, naming file and target, on an unresolved page link', () => {
  assert.throws(() => rewriteLinks('[Q](missing.md)', ctx), /a\/start\.md.*missing\.md/s);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/lib/links.test.mjs`
Expected: FAIL — `Cannot find module './links.mjs'`

- [ ] **Step 3: Write the implementation**

Create `scripts/lib/links.mjs`:

```js
/**
 * Rewrites GitBook's relative page links to the live route URLs held in route-map.json.
 *
 * Destinations are extracted by scanning rather than by regex: 1,317 asset filenames contain
 * parentheses, and `\]\(([^)]+)\)` truncates at the first one, silently mangling the path.
 */
import path from 'node:path';
import { protectCode } from './segments.mjs';

const ASSET = /(^|\/)\.gitbook\/assets\//;

/** Character offsets of every markdown link or image destination in `text`. */
export function extractTargets(text) {
  const found = [];
  for (let i = 0; i < text.length - 1; i++) {
    if (text[i] !== ']' || text[i + 1] !== '(') continue;
    const open = i + 2;
    if (text[open] === '<') {
      const close = text.indexOf('>', open);
      if (close === -1 || text[close + 1] !== ')') continue;
      found.push({ start: open, end: close + 1, target: text.slice(open + 1, close), angled: true });
      i = close + 1;
      continue;
    }
    let depth = 1;
    let j = open;
    for (; j < text.length; j++) {
      if (text[j] === '(') depth++;
      else if (text[j] === ')') { if (--depth === 0) break; }
      else if (text[j] === '\n') { depth = -1; break; }
    }
    if (depth !== 0) continue;
    found.push({ start: open, end: j, target: text.slice(open, j), angled: false });
    i = j;
  }
  return found;
}

/**
 * Resolves a link destination to a source-relative .md path, or null when it is not an
 * internal page link.
 *
 * `..` is clamped at the source root. GitBook clamps too, which is why
 * core-concepts/contexts-and-attributes/secret-context.md resolves on the live site despite
 * carrying one ../ too many.
 */
export function resolveSource(fromSource, target) {
  const clean = target.trim();
  if (clean === '' || /^(https?:|mailto:|tel:|#)/.test(clean)) return null;
  if (clean.startsWith('/broken/pages/')) return null;

  const withoutAnchor = decodeURIComponent(clean.replace(/#.*/, ''));
  if (withoutAnchor === '' || ASSET.test(withoutAnchor)) return null;

  let relative;
  if (withoutAnchor.endsWith('/')) relative = `${withoutAnchor}README.md`;
  else if (withoutAnchor.endsWith('.md')) relative = withoutAnchor;
  else return null;

  const joined = path.posix.join(path.posix.dirname(fromSource), relative);
  // path.posix.normalize keeps leading "../" segments; drop them to clamp at the root.
  return path.posix.normalize(joined).replace(/^(\.\.\/)+/, '');
}

/** Rewrites every internal page link in `text` to its route URL. Throws on any that misses. */
export function rewriteLinks(text, { source, routes }) {
  return protectCode(text, (masked) => {
    let out = '';
    let cursor = 0;
    for (const { start, end, target, angled } of extractTargets(masked)) {
      const resolved = resolveSource(source, target);
      if (resolved === null) continue;
      const route = routes.get(resolved);
      if (!route) {
        throw new Error(`${source}: link target does not resolve to a page: ${target} -> ${resolved}`);
      }
      const anchor = target.includes('#') ? target.slice(target.indexOf('#')) : '';
      const url = `${route.url}${anchor}`;
      out += masked.slice(cursor, start) + (angled ? `<${url}>` : url);
      cursor = end;
    }
    return out + masked.slice(cursor);
  });
}
```

**Offsets:** `start` and `end` bracket exactly the text to replace, so both forms splice
identically. For the angle-bracket form `start` is the index of `<` and `end` the index just
past `>`, so writing `<url>` replaces the whole bracketed destination and leaves the `)`. For
the bare form `start` is the first character of the path and `end` the index of `)`. The
"leaves external links alone" and "leaves asset references untouched" tests are round trips —
if they pass, the offsets are right.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/lib/links.test.mjs`
Expected: PASS, 16 tests

- [ ] **Step 5: Verify against the whole corpus**

Run:
```bash
node -e '
Promise.all([import("./scripts/lib/links.mjs")]).then(([{ rewriteLinks }]) => {
  const fs = require("fs");
  const rm = JSON.parse(fs.readFileSync("route-map.json", "utf8"));
  const routes = new Map(rm.map((r) => [r.source, r]));
  let rewritten = 0;
  for (const r of rm) {
    const before = fs.readFileSync("source/" + r.source, "utf8");
    const after = rewriteLinks(before, { source: r.source, routes });
    if (before !== after) rewritten++;
  }
  console.log("files with rewritten links:", rewritten);
});'
```
Expected: completes without throwing. A throw names the offending file and target — investigate
it rather than loosening the check.

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/links.mjs scripts/lib/links.test.mjs
git commit -m "Rewrite relative page links to route URLs"
```

---

### Task 5: GitBook blocks that stay in `.md`

Hints (258), `{% code %}` (7) and `{% file %}` (1) need no Starlight component, so files
containing only these stay `.md`. `{% code %}` must run **before** any fence-aware pass,
because it wraps a fence and rewrites that fence's info string.

**Files:**
- Create: `scripts/lib/gitbook-blocks.mjs`
- Create: `scripts/lib/gitbook-blocks.test.mjs`

**Interfaces:**
- Consumes: `mapLines` from `./segments.mjs`.
- Produces:
  - `convertCode(text: string) -> string` — run first, before segmentation-dependent passes.
  - `convertHints(text: string) -> string`
  - `convertFile(text: string) -> string`
  - `stripEntities(text: string) -> string`

- [ ] **Step 1: Write the failing test**

Create `scripts/lib/gitbook-blocks.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convertCode, convertFile, convertHints, stripEntities } from './gitbook-blocks.mjs';

test('each hint style maps to its Starlight aside', () => {
  const cases = [
    ['info', 'note'],
    ['success', 'tip'],
    ['warning', 'caution'],
    ['danger', 'danger'],
  ];
  for (const [style, aside] of cases) {
    assert.equal(
      convertHints(`{% hint style="${style}" %}\nBody\n{% endhint %}`),
      `:::${aside}\nBody\n:::`
    );
  }
});

test('hints inside a fence are left alone', () => {
  const input = '```\n{% hint style="info" %}\n```';
  assert.equal(convertHints(input), input);
});

test('convertCode moves title onto the fence info string', () => {
  assert.equal(
    convertCode('{% code title="index.html" %}\n```html\n<p></p>\n```\n{% endcode %}'),
    '```html title="index.html"\n<p></p>\n```'
  );
});

test('convertCode maps lineNumbers to showLineNumbers', () => {
  assert.equal(
    convertCode('{% code lineNumbers="true" %}\n```json\n{}\n```\n{% endcode %}'),
    '```json showLineNumbers\n{}\n```'
  );
});

test('convertCode drops fullWidth, which Expressive Code has no equivalent for', () => {
  assert.equal(
    convertCode('{% code fullWidth="false" %}\n```ts\nx\n```\n{% endcode %}'),
    '```ts\nx\n```'
  );
});

test('convertCode preserves a fence with no language', () => {
  assert.equal(
    convertCode('{% code title="t" %}\n```\nx\n```\n{% endcode %}'),
    '``` title="t"\nx\n```'
  );
});

test('convertCode leaves an ordinary fence untouched', () => {
  const input = '```js\nconst a = 1;\n```';
  assert.equal(convertCode(input), input);
});

test('convertFile becomes a link whose text is the basename', () => {
  assert.equal(
    convertFile('{% file src="../../.gitbook/assets/DeliveryKnowledgeBase.csv" %}'),
    '[DeliveryKnowledgeBase.csv](</.gitbook/assets/DeliveryKnowledgeBase.csv>)'
  );
});

test('an end-of-line entity is stripped, not turned into a trailing space', () => {
  // "word &#x20;" -> "word  " would be a markdown hard break the live site does not render.
  assert.equal(stripEntities('Put a JSON payload here.&#x20;'), 'Put a JSON payload here.');
  assert.equal(stripEntities('Best practices &#x20;'), 'Best practices ');
});

test('a mid-line entity becomes a single space', () => {
  assert.equal(stripEntities('* &#x20;**Anonymous Authentication**'), '*  **Anonymous Authentication**');
  assert.equal(stripEntities('&#x20;We split the update'), ' We split the update');
});

test('entities inside a fence are left alone', () => {
  const input = '```\n&#x20;\n```';
  assert.equal(stripEntities(input), input);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/lib/gitbook-blocks.test.mjs`
Expected: FAIL — `Cannot find module './gitbook-blocks.mjs'`

- [ ] **Step 3: Write the implementation**

Create `scripts/lib/gitbook-blocks.mjs`:

```js
/**
 * Converts GitBook's {% %} block syntax to Starlight equivalents.
 *
 * Hints, code and file blocks need no component, so a file containing only these stays .md.
 */
import { mapLines } from './segments.mjs';

const ASIDE = { info: 'note', success: 'tip', warning: 'caution', danger: 'danger' };

/**
 * Folds {% code %} attributes into the fence's info string.
 *
 * Must run before any fence-aware pass: this block wraps a fence, so removing its markers
 * changes what the fence scanner sees.
 */
export function convertCode(text) {
  return text.replace(
    /^[ \t]*\{%\s*code([^%]*)%\}\n([ \t]*)(`{3,}|~{3,})([^\n]*)\n([\s\S]*?\n)[ \t]*\3[^\n]*\n[ \t]*\{%\s*endcode\s*%\}[ \t]*$/gm,
    (_, attrs, indent, fence, lang, body) => {
      const info = [lang.trim()];
      const title = attrs.match(/title="([^"]*)"/);
      if (title) info.push(`title="${title[1]}"`);
      if (/lineNumbers="true"/.test(attrs)) info.push('showLineNumbers');
      const suffix = info.filter(Boolean).join(' ');
      return `${indent}${fence}${suffix ? ` ${suffix}` : ''}\n${body}${indent}${fence}`;
    }
  );
}

/**
 * Removes GitBook's &#x20; entity, of which there are 1,203.
 *
 * 1,192 sit at end of line, where the entity is a no-op trailing space. Replacing those with a
 * literal space would leave "…  \n" on the 84 lines that already end in a space, which markdown
 * renders as a <br> the live site does not have. Only the 11 mid-line occurrences are real.
 */
export function stripEntities(text) {
  return mapLines(text, (line) => line.replace(/&#x20;$/, '').replaceAll('&#x20;', ' '));
}

/** Maps {% hint %} blocks to Starlight asides. */
export function convertHints(text) {
  return mapLines(text, (line) => {
    const open = line.match(/^[ \t]*\{%\s*hint\s+style="([a-z]+)"\s*%\}[ \t]*$/);
    if (open) return `:::${ASIDE[open[1]] ?? 'note'}`;
    if (/^[ \t]*\{%\s*endhint\s*%\}[ \t]*$/.test(line)) return ':::';
    return line;
  });
}

/** Turns the single {% file %} block into a markdown link to a Phase 3 asset placeholder. */
export function convertFile(text) {
  return mapLines(text, (line) => {
    const match = line.match(/^[ \t]*\{%\s*file\s+src="([^"]+)"\s*%\}[ \t]*$/);
    if (!match) return line;
    const name = match[1].split('/').pop();
    return `[${name}](</.gitbook/assets/${name}>)`;
  });
}
```

The `convertCode` info string is assembled as: language first, then `title="…"`, then
`showLineNumbers`, single-space separated, with no trailing space when there are no
attributes. `filter(Boolean)` drops the empty language, which is why a fence with no language
still produces ` ``` title="t" ` and not ` ```  title="t" `.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/lib/gitbook-blocks.test.mjs`
Expected: PASS, 11 tests

- [ ] **Step 5: Verify the entity count against the corpus**

Run:
```bash
node -e '
import("./scripts/lib/gitbook-blocks.mjs").then(({ stripEntities }) => {
  const fs = require("fs");
  const rm = JSON.parse(fs.readFileSync("route-map.json", "utf8"));
  let before = 0, after = 0, breaks = 0;
  for (const r of rm) {
    const text = fs.readFileSync("source/" + r.source, "utf8");
    before += (text.match(/&#x20;/g) || []).length;
    const out = stripEntities(text);
    after += (out.match(/&#x20;/g) || []).length;
    breaks += (out.match(/ {2,}$/gm) || []).length;
  }
  console.log("entities before:", before, " after:", after, " lines ending in 2+ spaces:", breaks);
});'
```
Expected: `entities before: 1203  after: 0`. The trailing-space count is informational — it
must not be *higher* than the same measure taken on the source, which is what the rule exists
to guarantee.

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/gitbook-blocks.mjs scripts/lib/gitbook-blocks.test.mjs
git commit -m "Convert hint, code and file blocks"
```

---

### Task 6: GitBook blocks that need a component

Embeds (38 across 31 files), steppers (3 blocks / 15 steps) and the single `{% columns %}`
instance. The columns block wraps fenced code, which is exactly the case `mapLines` exists to
handle.

**Files:**
- Modify: `scripts/lib/gitbook-blocks.mjs`
- Modify: `scripts/lib/gitbook-blocks.test.mjs`

**Interfaces:**
- Consumes: `mapLines` and `protectCode` from `./segments.mjs`.
- Produces:
  - `convertEmbeds(text: string) -> string` — video URLs become `<Embed …/>`; others become an autolink.
  - `convertSteppers(text: string) -> string`
  - `convertColumns(text: string) -> string`
  - `isVideoEmbed(url: string) -> boolean` — exported for its own unit test; `convert.mjs` decides `.mdx` promotion from the emitted `<Embed ` marker rather than re-parsing URLs.

- [ ] **Step 1: Write the failing test**

Append to `scripts/lib/gitbook-blocks.test.mjs`:

```js
import { convertColumns, convertEmbeds, convertSteppers, isVideoEmbed } from './gitbook-blocks.mjs';

test('a self-closing embed becomes an Embed element', () => {
  assert.equal(
    convertEmbeds('{% embed url="https://youtu.be/RhUc_mgkNl8" %}'),
    '<Embed url="https://youtu.be/RhUc_mgkNl8" />'
  );
});

test('an embed with a caption passes it as title', () => {
  assert.equal(
    convertEmbeds('{% embed url="https://www.loom.com/share/abc" %}\nBuilding an agent\n{% endembed %}'),
    '<Embed url="https://www.loom.com/share/abc" title="Building an agent" />'
  );
});

test('a caption containing a double quote is escaped for the attribute', () => {
  assert.equal(
    convertEmbeds('{% embed url="https://youtu.be/x" %}\nThe "best" way\n{% endembed %}'),
    '<Embed url="https://youtu.be/x" title="The &quot;best&quot; way" />'
  );
});

test('a non-video embed becomes a plain link and needs no component', () => {
  assert.equal(
    convertEmbeds('{% embed url="https://webaim.org/resources/contrastchecker/" %}'),
    '<https://webaim.org/resources/contrastchecker/>'
  );
});

test('isVideoEmbed recognises Loom and YouTube only', () => {
  assert.equal(isVideoEmbed('https://youtu.be/x'), true);
  assert.equal(isVideoEmbed('https://www.youtube.com/watch?v=x'), true);
  assert.equal(isVideoEmbed('https://www.loom.com/share/x'), true);
  assert.equal(isVideoEmbed('https://www.fetchify.com/address-auto-complete'), false);
});

test('a stepper becomes a Steps ordered list with indented bodies', () => {
  const input = [
    '{% stepper %}',
    '{% step %}',
    '### Navigate to the Secret Context',
    '',
    'Open the Secret Management page.',
    '{% endstep %}',
    '{% step %}',
    '### Add a secret',
    '{% endstep %}',
    '{% endstepper %}',
  ].join('\n');
  assert.equal(
    convertSteppers(input),
    [
      '<Steps>',
      '',
      '1. ### Navigate to the Secret Context',
      '',
      '   Open the Secret Management page.',
      '',
      '2. ### Add a secret',
      '',
      '</Steps>',
    ].join('\n')
  );
});

test('columns becomes a CardGrid and the fenced code inside survives', () => {
  const input = [
    '{% columns %}',
    '{% column %}',
    'Do',
    '```json',
    '{ "firstName": "{first_name}" }',
    '```',
    '{% endcolumn %}',
    '{% column %}',
    "Don't",
    '{% endcolumn %}',
    '{% endcolumns %}',
  ].join('\n');
  const out = convertColumns(input);
  assert.match(out, /^<CardGrid>/);
  assert.match(out, /<\/CardGrid>$/);
  assert.ok(out.includes('{ "firstName": "{first_name}" }'), 'fenced code must survive verbatim');
  assert.ok(!out.includes('{% column'), 'no column markers may remain');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/lib/gitbook-blocks.test.mjs`
Expected: FAIL — `convertEmbeds is not a function` (or an import error)

- [ ] **Step 3: Write the implementation**

Append to `scripts/lib/gitbook-blocks.mjs`, and add `protectCode` to the existing
`./segments.mjs` import at the top of the file:

```js
const VIDEO = /^(youtu\.be|youtube\.com|loom\.com)$/;

/** True when an embed URL is one the Embed component can render as an iframe. */
export function isVideoEmbed(url) {
  try {
    return VIDEO.test(new URL(url).hostname.replace(/^www\./, ''));
  } catch {
    return false;
  }
}

/** Escapes a caption for use inside a double-quoted JSX attribute. */
function attribute(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/** Renders one embed. Non-video URLs become autolinks and so need no component. */
function renderEmbed(url, title) {
  if (!isVideoEmbed(url)) return `<${url}>`;
  return title ? `<Embed url="${url}" title="${attribute(title)}" />` : `<Embed url="${url}" />`;
}

/**
 * Converts {% embed %} blocks. 36 of the 38 are Loom or YouTube and become <Embed>; the other
 * two are ordinary web pages and become autolinks, so they do not promote a file to .mdx.
 *
 * Done with regex under protectCode rather than a line state machine because no embed block
 * wraps a fenced code block — measured across the corpus, only {% columns %} does — and a
 * state machine would need an end-of-input flush for the 19 self-closing form.
 */
export function convertEmbeds(text) {
  return protectCode(text, (masked) =>
    masked
      .replace(
        /^[ \t]*\{%\s*embed\s+url="([^"]+)"[^%]*%\}\n([\s\S]*?)\n[ \t]*\{%\s*endembed\s*%\}[ \t]*$/gm,
        (_, url, caption) => renderEmbed(url, caption.replace(/\s+/g, ' ').trim())
      )
      .replace(/^[ \t]*\{%\s*embed\s+url="([^"]+)"[^%]*%\}[ \t]*$/gm, (_, url) => renderEmbed(url, ''))
  );
}

/** Converts {% stepper %} to a Starlight <Steps> ordered list. */
export function convertSteppers(text) {
  let inStepper = false;
  let number = 0;
  let body = null;
  return mapLines(text, (line) => {
    if (/^[ \t]*\{%\s*stepper\s*%\}[ \t]*$/.test(line)) {
      inStepper = true;
      number = 0;
      return ['<Steps>', ''];
    }
    if (/^[ \t]*\{%\s*endstepper\s*%\}[ \t]*$/.test(line)) {
      inStepper = false;
      return ['</Steps>'];
    }
    if (!inStepper) return line;
    if (/^[ \t]*\{%\s*step\s*%\}[ \t]*$/.test(line)) {
      number++;
      body = [];
      return [];
    }
    if (/^[ \t]*\{%\s*endstep\s*%\}[ \t]*$/.test(line)) {
      const lines = body ?? [];
      while (lines.length && lines.at(-1).trim() === '') lines.pop();
      const [first, ...rest] = lines;
      body = null;
      return [`${number}. ${first ?? ''}`, ...rest.map((l) => (l.trim() === '' ? '' : `   ${l}`)), ''];
    }
    if (body !== null) {
      body.push(line);
      return [];
    }
    return line;
  });
}

/** Converts the single {% columns %} block to a CardGrid. */
export function convertColumns(text) {
  return mapLines(text, (line) => {
    if (/^[ \t]*\{%\s*columns\s*%\}[ \t]*$/.test(line)) return '<CardGrid>';
    if (/^[ \t]*\{%\s*endcolumns\s*%\}[ \t]*$/.test(line)) return '</CardGrid>';
    if (/^[ \t]*\{%\s*(end)?column\s*%\}[ \t]*$/.test(line)) return [];
    return line;
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/lib/gitbook-blocks.test.mjs`
Expected: PASS, 15 tests

- [ ] **Step 5: Hand-check the three real steppers and the one columns block**

Run:
```bash
node -e '
import("./scripts/lib/gitbook-blocks.mjs").then(({ convertSteppers, convertColumns }) => {
  const fs = require("fs");
  for (const f of [
    "source/tutorials/ai-agent-creation-overview.md",
    "source/core-concepts/contexts-and-attributes/secret-context.md",
    "source/opendialog-platform/actions/webhook-action/README.md",
  ]) {
    const out = convertColumns(convertSteppers(fs.readFileSync(f, "utf8")));
    console.log("=== " + f + " ===");
    console.log(out.split("\n").filter((l, i, a) =>
      /<Steps>|<\/Steps>|<CardGrid>|<\/CardGrid>|^\d+\. /.test(l)).join("\n"));
  }
});'
```
Expected: `<Steps>`/`</Steps>` and `<CardGrid>`/`</CardGrid>` pairs are balanced, and step
numbers run 1..n within each block. Read the output — this transform is the fiddliest in the
set and only 15 steps exist, so it is cheaper to check by eye than to over-test.

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/gitbook-blocks.mjs scripts/lib/gitbook-blocks.test.mjs
git commit -m "Convert embed, stepper and columns blocks"
```

---

### Task 7: Link cards

`{% content-ref %}` (51) and GitBook card-tables (8 tables, 41 cards) both emit `<LinkCard>`
and both need `route-map.json` to turn a filename into a title. The content-ref inner link
text is a raw filename, not a title — GitBook substitutes the target page's title at render.

**Files:**
- Create: `scripts/lib/link-cards.mjs`
- Create: `scripts/lib/link-cards.test.mjs`

**Interfaces:**
- Consumes: `mapLines` from `./segments.mjs`; `resolveSource` from `./links.mjs`.
- Produces:
  - `convertContentRefs(text: string, { source, routes, titles }) -> string`
  - `convertCardTables(text: string, { source, routes, titles }) -> string`
  - `countDroppedCovers(text: string) -> number` — how many `data-card-cover` assets this file loses, for the Phase 3 orphan-protection list.
  - Both take `titles: Map<string, { title: string, description?: string }>` keyed by source path, built by `convert.mjs` in a first pass over the corpus.

- [ ] **Step 1: Write the failing test**

Create `scripts/lib/link-cards.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convertCardTables, convertContentRefs, countDroppedCovers } from './link-cards.mjs';

const routes = new Map([
  ['a/text-message.md', { url: '/design/text-message' }],
  ['the-opendialog-model/README.md', { url: '/core-concepts/the-opendialog-model' }],
]);
const titles = new Map([
  ['a/text-message.md', { title: 'Text message', description: 'Send plain text.' }],
  ['the-opendialog-model/README.md', { title: 'The OpenDialog model' }],
]);
const ctx = { source: 'a/README.md', routes, titles };

test('a content-ref becomes a LinkCard titled from the target page', () => {
  const input = [
    '{% content-ref url="text-message.md" %}',
    '[text-message.md](text-message.md)',
    '{% endcontent-ref %}',
  ].join('\n');
  assert.equal(
    convertContentRefs(input, ctx),
    '<LinkCard title="Text message" description="Send plain text." href="/design/text-message" />'
  );
});

test('a content-ref to a page with no description omits the attribute', () => {
  const input = [
    '{% content-ref url="../the-opendialog-model/" %}',
    '[the-opendialog-model](../the-opendialog-model/)',
    '{% endcontent-ref %}',
  ].join('\n');
  assert.equal(
    convertContentRefs(input, ctx),
    '<LinkCard title="The OpenDialog model" href="/core-concepts/the-opendialog-model" />'
  );
});

test('a card-table becomes a CardGrid of LinkCards', () => {
  const input =
    '<table data-card-size="large" data-view="cards" data-full-width="false">' +
    '<thead><tr><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th>' +
    '<th data-hidden data-card-cover data-type="files"></th></tr></thead><tbody>' +
    '<tr><td><a href="../the-opendialog-model/"><strong>The OpenDialog model</strong></a></td>' +
    '<td>Take a deepdive.</td>' +
    '<td><a href="../the-opendialog-model/">the-opendialog-model</a></td>' +
    '<td><a href="../.gitbook/assets/OD-basicmodel.png">OD-basicmodel.png</a></td></tr>' +
    '</tbody></table>';
  assert.equal(
    convertCardTables(input, ctx),
    [
      '<CardGrid>',
      '  <LinkCard title="The OpenDialog model" description="Take a deepdive." href="/core-concepts/the-opendialog-model" />',
      '</CardGrid>',
    ].join('\n')
  );
});

test('a card pointing at a broken page keeps the broken href', () => {
  const input =
    '<table data-view="cards"><thead><tr><th></th><th></th>' +
    '<th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody>' +
    '<tr><td><a href="/broken/pages/2lcI5UfFruOL0M8VSp3d"><strong>Core concepts</strong></a></td>' +
    '<td>The core concepts.</td>' +
    '<td><a href="/broken/pages/2lcI5UfFruOL0M8VSp3d">Broken link</a></td></tr>' +
    '</tbody></table>';
  const out = convertCardTables(input, ctx);
  assert.ok(out.includes('href="/broken/pages/2lcI5UfFruOL0M8VSp3d"'), out);
  assert.ok(out.includes('title="Core concepts"'), out);
});

test('countDroppedCovers counts the cover assets LinkCard cannot show', () => {
  const input =
    '<table data-view="cards"><thead><tr><th></th>' +
    '<th data-hidden data-card-cover data-type="files"></th></tr></thead><tbody>' +
    '<tr><td><a href="x.md"><strong>X</strong></a></td>' +
    '<td><a href="../.gitbook/assets/a.png">a.png</a></td></tr>' +
    '<tr><td><a href="y.md"><strong>Y</strong></a></td>' +
    '<td><a href="../.gitbook/assets/b.png">b.png</a></td></tr>' +
    '</tbody></table>';
  assert.equal(countDroppedCovers(input), 2);
});

test('an ordinary table is left alone', () => {
  const input = '<table><thead><tr><th>A</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>';
  assert.equal(convertCardTables(input, ctx), input);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/lib/link-cards.test.mjs`
Expected: FAIL — `Cannot find module './link-cards.mjs'`

- [ ] **Step 3: Write the implementation**

Create `scripts/lib/link-cards.mjs`:

```js
/**
 * Emits Starlight <LinkCard> markup from the two GitBook constructs that render as cards.
 *
 * Both need route-map.json: a content-ref's inner link text is a raw filename, and GitBook
 * substitutes the target page's title at render time.
 */
import { mapLines } from './segments.mjs';
import { resolveSource } from './links.mjs';

/** Escapes a value for use inside a double-quoted JSX attribute. */
function attribute(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/** Builds one LinkCard element. `description` is omitted when absent. */
function linkCard({ title, description, href }) {
  const parts = [`title="${attribute(title)}"`];
  if (description) parts.push(`description="${attribute(description)}"`);
  parts.push(`href="${href}"`);
  return `<LinkCard ${parts.join(' ')} />`;
}

/** Resolves a card href, leaving /broken/pages/ and external URLs as they are. */
function hrefFor(target, { source, routes }) {
  const resolved = resolveSource(source, target);
  if (resolved === null) return target;
  const route = routes.get(resolved);
  if (!route) throw new Error(`${source}: card target does not resolve: ${target} -> ${resolved}`);
  return route.url;
}

/** Converts {% content-ref %} blocks to <LinkCard>. */
export function convertContentRefs(text, ctx) {
  let url = null;
  return mapLines(text, (line) => {
    const open = line.match(/^[ \t]*\{%\s*content-ref\s+url="([^"]+)"\s*%\}[ \t]*$/);
    if (open) {
      url = open[1];
      return [];
    }
    if (url === null) return line;
    if (/^[ \t]*\{%\s*endcontent-ref\s*%\}[ \t]*$/.test(line)) {
      const target = url;
      url = null;
      const resolved = resolveSource(ctx.source, target);
      const meta = resolved ? ctx.titles.get(resolved) : null;
      if (!meta) throw new Error(`${ctx.source}: content-ref has no title for ${target}`);
      return [linkCard({ ...meta, href: hrefFor(target, ctx) })];
    }
    // The inner "[filename](filename)" line is discarded; the title comes from route-map.
    return [];
  });
}

/** Returns the row elements of a card-table's tbody. */
function rows(table) {
  const body = table.match(/<tbody>([\s\S]*?)<\/tbody>/);
  return body ? [...body[1].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((m) => m[1]) : [];
}

/** Returns the cell contents of one row. */
function cells(row) {
  return [...row.matchAll(/<td>([\s\S]*?)<\/td>/g)].map((m) => m[1]);
}

/** Strips tags and collapses whitespace, for card titles and descriptions. */
function plainText(html) {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

const CARD_TABLE = /<table(?=[^>]*\bdata-view="cards")[^>]*>[\s\S]*?<\/table>/g;

/**
 * Converts <table data-view="cards"> to a CardGrid of LinkCards.
 *
 * Attribute order varies — one of the eight reads data-card-size first — so the detector is
 * order independent. data-card-cover images have no LinkCard equivalent and are dropped;
 * countDroppedCovers reports them so Phase 3 does not delete those assets as orphans.
 */
export function convertCardTables(text, ctx) {
  return text.replace(CARD_TABLE, (table) => {
    const cards = [];
    for (const row of rows(table)) {
      const cell = cells(row);
      const anchors = cell.flatMap((c) => [...c.matchAll(/<a href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)]);
      const first = anchors[0];
      if (!first) continue;
      const title = plainText(first[2]);
      const withText = cell.find((c) => !/<a /.test(c) && plainText(c) !== '');
      const targetAnchor =
        anchors.find((a) => !/\.(png|jpe?g|gif|svg|webp)$/i.test(a[1])) ?? first;
      cards.push(
        linkCard({
          title,
          description: withText ? plainText(withText) : undefined,
          href: hrefFor(targetAnchor[1], ctx),
        })
      );
    }
    if (cards.length === 0) return table;
    return ['<CardGrid>', ...cards.map((c) => `  ${c}`), '</CardGrid>'].join('\n');
  });
}

/** Counts data-card-cover image references lost in conversion, for the Phase 3 handoff. */
export function countDroppedCovers(text) {
  let total = 0;
  for (const [table] of text.matchAll(CARD_TABLE)) {
    if (!/data-card-cover/.test(table)) continue;
    total += [...table.matchAll(/<a href="[^"]*\.(?:png|jpe?g|gif|svg|webp)"/gi)].length;
  }
  return total;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/lib/link-cards.test.mjs`
Expected: PASS, 6 tests

- [ ] **Step 5: Hand-check all eight real card-tables**

Run:
```bash
node -e '
Promise.all([import("./scripts/lib/link-cards.mjs")]).then(([{ convertCardTables, countDroppedCovers }]) => {
  const fs = require("fs");
  const rm = JSON.parse(fs.readFileSync("route-map.json", "utf8"));
  const routes = new Map(rm.map((r) => [r.source, r]));
  const titles = new Map(rm.map((r) => [r.source, { title: r.title }]));
  let covers = 0, cards = 0;
  for (const r of rm) {
    const text = fs.readFileSync("source/" + r.source, "utf8");
    if (!/data-view="cards"/.test(text)) continue;
    const out = convertCardTables(text, { source: r.source, routes, titles });
    covers += countDroppedCovers(text);
    cards += (out.match(/<LinkCard /g) || []).length;
    console.log("=== " + r.source + " ===");
    console.log(out.split("\n").filter((l) => /CardGrid|LinkCard/.test(l)).join("\n"));
  }
  console.log("\ncards:", cards, " dropped covers:", covers);
});'
```
Expected: `cards: 41` and `dropped covers: 26`. Read the titles and hrefs — 8 tables is
hand-checkable and this transform parses HTML with regex, which deserves eyes on the output.

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/link-cards.mjs scripts/lib/link-cards.test.mjs
git commit -m "Convert content-refs and card-tables to link cards"
```

---

### Task 8: Figures

The highest-value transformation in the migration. Raw HTML `<img>` bypasses `astro:assets`
entirely, so 541 MB of images would ship unoptimised. 430 `<figure>` blocks each hold exactly
one `<img>`, plus 6 bare `<img>` outside any figure.

Assets do not exist under `src/` until Phase 3, and Astro treats an unresolvable relative
image path as a fatal build error. Paths are therefore emitted root-absolute
(`/.gitbook/assets/…`), which Astro reads as a `public/` path and does not resolve at build
time. No asset path in the corpus has a subdirectory under `.gitbook/assets/`, so resolution
is a plain suffix match with no need for the source file's location.

**Files:**
- Create: `scripts/lib/figures.mjs`
- Create: `scripts/lib/figures.test.mjs`

**Interfaces:**
- Consumes: `protectCode` from `./segments.mjs`.
- Produces:
  - `assetPath(src: string) -> string` — any `…/.gitbook/assets/X` to `/.gitbook/assets/X`; remote URLs unchanged.
  - `convertFigures(text: string) -> string`
  - `rewriteAssetRefs(text: string) -> string` — normalises the 93 pre-existing markdown `![]()` paths the same way.

- [ ] **Step 1: Write the failing test**

Create `scripts/lib/figures.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assetPath, convertFigures, rewriteAssetRefs } from './figures.mjs';

test('assetPath makes a relative asset reference root-absolute', () => {
  assert.equal(assetPath('../../../.gitbook/assets/image (601).png'), '/.gitbook/assets/image (601).png');
  assert.equal(assetPath('.gitbook/assets/Preview Sidebar.jpg'), '/.gitbook/assets/Preview Sidebar.jpg');
});

test('assetPath leaves a remote URL alone', () => {
  const url = 'https://lh3.googleusercontent.com/abc';
  assert.equal(assetPath(url), url);
});

test('a figure with a caption becomes an image plus an italic caption', () => {
  assert.equal(
    convertFigures(
      '<figure><img src=".gitbook/assets/Preview Sidebar.jpg" alt="">' +
        '<figcaption><p>Default conversation design view</p></figcaption></figure>'
    ),
    '![](</.gitbook/assets/Preview Sidebar.jpg>)\n\n*Default conversation design view*'
  );
});

test('a figure with an empty caption emits only the image', () => {
  assert.equal(
    convertFigures('<figure><img src=".gitbook/assets/a.png" alt=""><figcaption></figcaption></figure>'),
    '![](/.gitbook/assets/a.png)'
  );
});

test('alt text is preserved and never invented', () => {
  assert.equal(
    convertFigures('<figure><img src=".gitbook/assets/a.png" alt="A diagram"><figcaption></figcaption></figure>'),
    '![A diagram](/.gitbook/assets/a.png)'
  );
});

test('angle brackets are used only when the path needs them', () => {
  assert.equal(convertFigures('<figure><img src=".gitbook/assets/plain.png" alt=""></figure>'),
    '![](/.gitbook/assets/plain.png)');
  assert.equal(convertFigures('<figure><img src=".gitbook/assets/a b.png" alt=""></figure>'),
    '![](</.gitbook/assets/a b.png>)');
  assert.equal(convertFigures('<figure><img src=".gitbook/assets/a(1).png" alt=""></figure>'),
    '![](</.gitbook/assets/a(1).png>)');
});

test('a bare img outside any figure is converted too', () => {
  assert.equal(convertFigures('<img src="../.gitbook/assets/x.png" alt="X">'),
    '![X](/.gitbook/assets/x.png)');
});

test('figures inside a fence are left as literal text', () => {
  const input = '```html\n<figure><img src=".gitbook/assets/a.png" alt=""></figure>\n```';
  assert.equal(convertFigures(input), input);
});

test('rewriteAssetRefs normalises existing markdown image paths', () => {
  assert.equal(
    rewriteAssetRefs('![Demo](<../../.gitbook/assets/Knowledge Base Demo.gif>)'),
    '![Demo](</.gitbook/assets/Knowledge Base Demo.gif>)'
  );
  assert.equal(rewriteAssetRefs('![D](../.gitbook/assets/d.png)'), '![D](/.gitbook/assets/d.png)');
});

test('rewriteAssetRefs leaves page links alone', () => {
  assert.equal(rewriteAssetRefs('[a](/section/a/b)'), '[a](/section/a/b)');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/lib/figures.test.mjs`
Expected: FAIL — `Cannot find module './figures.mjs'`

- [ ] **Step 3: Write the implementation**

Create `scripts/lib/figures.mjs`:

```js
/**
 * Converts raw HTML images to markdown image syntax so astro:assets can optimise them.
 *
 * Raw <img> in markdown bypasses Astro's image pipeline entirely, which would ship 541 MB of
 * screenshots unoptimised. This is the highest-value transformation in the migration.
 *
 * Paths are emitted root-absolute. Assets do not reach src/assets/ until Phase 3, and Astro
 * treats an unresolvable *relative* image path as a fatal build error, whereas a leading "/"
 * is read as a public/ path and left alone. assets.mjs rewrites these in Phase 3.
 */
import { protectCode } from './segments.mjs';

const NEEDS_ANGLE = /[ ()]/;

/** Rewrites any .gitbook/assets reference to its root-absolute form. Remote URLs pass through. */
export function assetPath(src) {
  if (/^https?:/i.test(src)) return src;
  const match = src.match(/\.gitbook\/assets\/(.*)$/);
  return match ? `/.gitbook/assets/${match[1]}` : src;
}

/** Renders a markdown image, bracketing the path only when it would break link parsing. */
function image(alt, src) {
  const path = assetPath(src);
  return `![${alt}](${NEEDS_ANGLE.test(path) ? `<${path}>` : path})`;
}

/** Converts <figure> blocks and bare <img> tags to markdown images. */
export function convertFigures(text) {
  return protectCode(text, (masked) =>
    masked
      .replace(
        /<figure>\s*<img\s+([^>]*?)>\s*(?:<figcaption>([\s\S]*?)<\/figcaption>)?\s*<\/figure>/g,
        (_, attrs, caption) => {
          const src = attrs.match(/src="([^"]*)"/)?.[1] ?? '';
          const alt = attrs.match(/alt="([^"]*)"/)?.[1] ?? '';
          const text = (caption ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
          return text ? `${image(alt, src)}\n\n*${text}*` : image(alt, src);
        }
      )
      .replace(/<img\s+([^>]*?)\/?>/g, (whole, attrs) => {
        const src = attrs.match(/src="([^"]*)"/)?.[1];
        if (!src) return whole;
        return image(attrs.match(/alt="([^"]*)"/)?.[1] ?? '', src);
      })
  );
}

/** Normalises the paths of markdown images that were already in the source. */
export function rewriteAssetRefs(text) {
  return protectCode(text, (masked) =>
    masked.replace(/!\[([^\]]*)\]\((<[^>]*>|[^)]*(?:\([^)]*\)[^)]*)*)\)/g, (whole, alt, dest) => {
      const src = dest.startsWith('<') ? dest.slice(1, -1) : dest;
      if (!/\.gitbook\/assets\//.test(src)) return whole;
      return image(alt, src);
    })
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/lib/figures.test.mjs`
Expected: PASS, 10 tests

- [ ] **Step 5: Verify the corpus counts**

Run:
```bash
node -e '
import("./scripts/lib/figures.mjs").then(({ convertFigures }) => {
  const fs = require("fs");
  const rm = JSON.parse(fs.readFileSync("route-map.json", "utf8"));
  let before = 0, after = 0, images = 0;
  for (const r of rm) {
    const text = fs.readFileSync("source/" + r.source, "utf8");
    before += (text.match(/<img/g) || []).length;
    const out = convertFigures(text);
    after += (out.match(/<img/g) || []).length;
    images += (out.match(/!\[/g) || []).length;
  }
  console.log("img before:", before, " img surviving:", after, " markdown images after:", images);
});'
```
Expected: `img before: 436  img surviving: 0  markdown images after: 529` (436 converted plus
the 93 that were already markdown). A non-zero survivor count means an `<img>` shape the
regex missed — find it, do not ignore it.

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/figures.mjs scripts/lib/figures.test.mjs
git commit -m "Convert HTML figures to markdown images"
```

---

### Task 9: MDX normalisation

Applied only to the 46 files promoted to `.mdx`. In MDX, raw HTML is JSX: unclosed `<br>`
breaks the parse, `class` is not an attribute, `style` must be an object, and a bare `{` opens
an expression. 15 lines across 6 files carry `{ attribute }` template syntax in prose.

**Files:**
- Create: `scripts/lib/mdx.mjs`
- Create: `scripts/lib/mdx.test.mjs`

**Interfaces:**
- Consumes: `protectCode` from `./segments.mjs`.
- Produces: `normaliseForMdx(text: string) -> string`

- [ ] **Step 1: Write the failing test**

Create `scripts/lib/mdx.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normaliseForMdx } from './mdx.mjs';

test('void elements are self-closed', () => {
  assert.equal(normaliseForMdx('a<br>b'), 'a<br />b');
  assert.equal(normaliseForMdx('<hr>'), '<hr />');
});

test('an already self-closed element is left alone', () => {
  assert.equal(normaliseForMdx('a<br />b'), 'a<br />b');
});

test('class becomes className', () => {
  assert.equal(normaliseForMdx('<div class="x">y</div>'), '<div className="x">y</div>');
});

test('a style string becomes a style object', () => {
  assert.equal(
    normaliseForMdx('<mark style="color:purple;">x</mark>'),
    "<mark style={{ color: 'purple' }}>x</mark>"
  );
});

test('a multi-declaration style becomes a camelCased object', () => {
  assert.equal(
    normaliseForMdx('<span style="background-color: red; font-weight: bold">x</span>'),
    "<span style={{ backgroundColor: 'red', fontWeight: 'bold' }}>x</span>"
  );
});

test('bare braces in prose are escaped', () => {
  assert.equal(normaliseForMdx('_For example, {llm_response}_'), '_For example, \\{llm_response\\}_');
  assert.equal(normaliseForMdx('Type an opening curly brace { to continue'),
    'Type an opening curly brace \\{ to continue');
});

test('braces inside fenced code and inline spans are untouched', () => {
  const input = '```json\n{ "a": 1 }\n```\n`{b}` c';
  assert.equal(normaliseForMdx(input), input);
});

test('braces in emitted component attributes are not escaped', () => {
  const input = '<LinkCard title="X" href="/y" />\n<Embed url="https://youtu.be/z" />';
  assert.equal(normaliseForMdx(input), input);
});

test('a style object emitted by this pass is not then brace-escaped', () => {
  assert.equal(
    normaliseForMdx('<mark style="color:purple;">x</mark>'),
    "<mark style={{ color: 'purple' }}>x</mark>"
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/lib/mdx.test.mjs`
Expected: FAIL — `Cannot find module './mdx.mjs'`

- [ ] **Step 3: Write the implementation**

Create `scripts/lib/mdx.mjs`:

```js
/**
 * Normalises markdown for MDX output, where raw HTML is parsed as JSX.
 *
 * Applied only to the 46 files promoted to .mdx. Escaping bare braces is output encoding for
 * the target format, not a prose edit: MDX renders "\{" as a literal "{", which is what
 * GitBook shows today for the 15 lines carrying { attribute } template syntax.
 */
import { protectCode } from './segments.mjs';

const VOID = ['br', 'hr', 'img', 'input', 'meta', 'link', 'source', 'area', 'col', 'embed'];
const VOID_TAG = new RegExp(`<(${VOID.join('|')})\\b([^>]*?)(?<!/)>`, 'gi');
const TAG = /<\/?[A-Za-z][^>]*>/g;
// Tags are stashed behind a U+0001 delimiter, distinct from the U+0000 protectCode uses, so
// the two maskings nest without colliding. Verified: the source contains no control
// characters at all, so neither token can occur naturally.
const TAG_TOKEN = '\u0001';

/** Converts a CSS declaration list to a JSX style object literal. */
function styleObject(css) {
  const entries = css
    .split(';')
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => {
      const index = d.indexOf(':');
      const property = d.slice(0, index).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      return `${property}: '${d.slice(index + 1).trim().replace(/'/g, "\\'")}'`;
    });
  return `{{ ${entries.join(', ')} }}`;
}

export function normaliseForMdx(text) {
  return protectCode(text, (masked) => {
    // Tags are stashed before brace escaping so attributes — including the style objects
    // produced here — are never treated as prose.
    const tags = [];
    const withTags = masked
      .replace(VOID_TAG, (_, name, attrs) => `<${name}${attrs.trimEnd()} />`)
      .replace(TAG, (tag) => {
        const normalised = tag
          .replace(/\bclass=/g, 'className=')
          .replace(/\bstyle="([^"]*)"/g, (_, css) => `style=${styleObject(css)}`);
        return `${TAG_TOKEN}${tags.push(normalised) - 1}${TAG_TOKEN}`;
      });

    const escaped = withTags.replace(/[{}]/g, (brace) => `\\${brace}`);

    return escaped.replace(
      new RegExp(`${TAG_TOKEN}(\\d+)${TAG_TOKEN}`, 'g'),
      (_, index) => tags[Number(index)]
    );
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/lib/mdx.test.mjs`
Expected: PASS, 9 tests

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/mdx.mjs scripts/lib/mdx.test.mjs
git commit -m "Normalise markdown for MDX output"
```

---

### Task 10: Embed component

36 Loom and YouTube embeds need a component. The other 2 embeds are ordinary web pages and
became autolinks in Task 6.

**Files:**
- Create: `src/components/Embed.astro`

**Interfaces:**
- Consumes: nothing.
- Produces: `<Embed url="…" title="…" />`, imported by generated `.mdx` files from `~/components/Embed.astro`.

- [ ] **Step 1: Write the component**

Create `src/components/Embed.astro`:

```astro
---
/**
 * Renders a Loom or YouTube video in a lazily-loaded 16:9 iframe.
 *
 * GitBook's {% embed %} shows a caption under the video; `title` reproduces that and doubles
 * as the iframe's accessible name.
 */
interface Props {
  url: string;
  title?: string;
}

const { url, title } = Astro.props;

/** Maps a share URL to its embeddable form. */
function embedSrc(raw: string): string | null {
  const parsed = new URL(raw);
  const host = parsed.hostname.replace(/^www\./, '');
  if (host === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${parsed.pathname.slice(1)}`;
  if (host === 'youtube.com') {
    const id = parsed.searchParams.get('v');
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === 'loom.com') return raw.replace('/share/', '/embed/').split('?')[0];
  return null;
}

const src = embedSrc(url);
---

{
  src ? (
    <figure class="od-embed">
      <div class="od-embed-frame">
        <iframe
          src={src}
          title={title ?? 'Embedded video'}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
      </div>
      {title && <figcaption>{title}</figcaption>}
    </figure>
  ) : (
    <p><a href={url}>{title ?? url}</a></p>
  )
}

<style>
  .od-embed {
    margin: 1.5rem 0;
  }
  .od-embed-frame {
    aspect-ratio: 16 / 9;
    border-radius: 0.5rem;
    overflow: hidden;
    border: 1px solid var(--sl-color-gray-5);
  }
  .od-embed-frame iframe {
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
  }
  .od-embed figcaption {
    margin-top: 0.5rem;
    font-size: var(--sl-text-sm);
    color: var(--sl-color-gray-3);
  }
</style>
```

- [ ] **Step 2: Verify it renders**

Create a scratch page to prove the component builds before 46 files depend on it:

```bash
mkdir -p src/content/docs/_embedcheck
cat > src/content/docs/_embedcheck/index.mdx <<'PAGE'
---
title: Embed check
---

import Embed from '~/components/Embed.astro';

<Embed url="https://youtu.be/RhUc_mgkNl8" title="A caption" />
<Embed url="https://www.loom.com/share/abc123?t=1" />
PAGE
npx astro build 2>&1 | tail -5
```
Expected: build succeeds. If `~/components/…` does not resolve, check `tsconfig.json` for the
path alias and use a relative import in the generated files instead — note whichever form
works, because Task 11 must emit the same one.

- [ ] **Step 3: Confirm the rendered markup**

Run: `grep -o 'youtube-nocookie[^"]*' dist/_embedcheck/index.html`
Expected: `youtube-nocookie.com/embed/RhUc_mgkNl8`

- [ ] **Step 4: Remove the scratch page**

```bash
rm -rf src/content/docs/_embedcheck
```

- [ ] **Step 5: Commit**

```bash
git add src/components/Embed.astro
git commit -m "Add the video embed component"
```

---

### Task 11: The conversion script

Orchestrates the per-file pipeline and asserts the corpus invariants. This is where the
`.md` / `.mdx` decision and the component imports are made.

**Files:**
- Create: `scripts/convert.mjs`

**Interfaces:**
- Consumes: every `scripts/lib/` module, and `route-map.json`.
- Produces: `src/content/docs/**` and a summary report on stdout. Exits non-zero on any failed invariant.

- [ ] **Step 1: Write the script**

Create `scripts/convert.mjs`:

```js
/**
 * Converts source/ (a pristine GitBook export) into Starlight content under src/content/docs/.
 *
 * Idempotent: src/content/docs/ is cleared before writing, output order follows
 * route-map.json, and nothing depends on timestamps or filesystem ordering. Re-runnable
 * against a fresh GitBook sync right up to cutover day.
 *
 * Verifies its own output against the counts measured from the source corpus and exits
 * non-zero on any divergence, in the same spirit as routes.mjs checking itself against the
 * live sitemap snapshot.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { emitFrontmatter, parseFrontmatter, takeTitle } from './lib/frontmatter.mjs';
import { convertFigures, rewriteAssetRefs } from './lib/figures.mjs';
import {
  convertCode,
  convertColumns,
  convertEmbeds,
  convertFile,
  convertHints,
  convertSteppers,
  stripEntities,
} from './lib/gitbook-blocks.mjs';
import { convertCardTables, convertContentRefs, countDroppedCovers } from './lib/link-cards.mjs';
import { rewriteLinks } from './lib/links.mjs';
import { normaliseForMdx } from './lib/mdx.mjs';
import { mapLines } from './lib/segments.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = `${root}/src/content/docs`;

const routeMap = JSON.parse(readFileSync(`${root}/route-map.json`, 'utf8'));
const routes = new Map(routeMap.map((r) => [r.source, r]));

/** Counts occurrences of `pattern` in prose only, ignoring anything inside a fenced block. */
function countInProse(text, pattern) {
  const prose = [];
  mapLines(text, (line) => {
    prose.push(line);
    return line;
  });
  return (prose.join('\n').match(pattern) || []).length;
}

/** First pass: every page's title and description, so cards can be titled from their target. */
const titles = new Map(
  routeMap.map((r) => {
    const { data, body } = parseFrontmatter(readFileSync(`${root}/source/${r.source}`, 'utf8'));
    const { title } = takeTitle(body);
    if (!title) throw new Error(`${r.source}: no H1 found`);
    return [r.source, { title, description: data.description }];
  })
);

const stats = {
  files: 0,
  mdx: 0,
  asides: 0,
  contentRefCards: 0,
  cardTableCards: 0,
  embeds: 0,
  steps: 0,
  cardGrids: 0,
  images: 0,
  droppedCovers: 0,
  survivingBlocks: 0,
  survivingEntities: 0,
  survivingImgTags: 0,
};

const COMPONENTS = [
  ['<LinkCard', 'LinkCard'],
  ['<CardGrid', 'CardGrid'],
  ['<Steps>', 'Steps'],
];

rmSync(OUT, { recursive: true, force: true });

for (const route of routeMap) {
  const raw = readFileSync(`${root}/source/${route.source}`, 'utf8');
  const { data, body } = parseFrontmatter(raw);
  const meta = titles.get(route.source);
  const ctx = { source: route.source, routes, titles };

  stats.droppedCovers += countDroppedCovers(body);

  let text = takeTitle(body).body;
  text = convertCode(text);
  text = convertHints(text);
  text = convertFile(text);
  text = convertContentRefs(text, ctx);
  text = convertCardTables(text, ctx);
  text = convertEmbeds(text);
  text = convertSteppers(text);
  text = convertColumns(text);
  text = convertFigures(text);
  text = rewriteAssetRefs(text);
  text = stripEntities(text);
  text = rewriteLinks(text, ctx);

  const used = COMPONENTS.filter(([marker]) => text.includes(marker)).map(([, name]) => name);
  const hasEmbed = text.includes('<Embed ');
  const isMdx = used.length > 0 || hasEmbed;

  if (isMdx) {
    text = normaliseForMdx(text);
    const imports = [];
    if (used.length) imports.push(`import { ${[...new Set(used)].sort().join(', ')} } from '@astrojs/starlight/components';`);
    if (hasEmbed) imports.push("import Embed from '~/components/Embed.astro';");
    text = `\n${imports.join('\n')}\n${text}`;
  }

  const target = `${OUT}/${route.target}${isMdx ? 'x' : ''}`;
  const output = `${emitFrontmatter({ title: meta.title, description: meta.description })}${text.replace(/^\n+/, '\n')}`;
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, output.replace(/\s*$/, '\n'));

  stats.files++;
  if (isMdx) stats.mdx++;
  stats.asides += (output.match(/^:::(note|tip|caution|danger)/gm) || []).length;
  stats.embeds += (output.match(/<Embed /g) || []).length;
  stats.cardGrids += (output.match(/<CardGrid>/g) || []).length;
  stats.steps += (output.match(/^\d+\. /gm) || []).length;
  stats.images += (output.match(/!\[/g) || []).length;
  // In .mdx a surviving block reads "\{% … %\}", so the escaped form still matches "{%".
  stats.survivingBlocks += countInProse(output, /\{%/g);
  stats.survivingEntities += countInProse(output, /&#x20;/g);
  stats.survivingImgTags += countInProse(output, /<img/g);
  if (/hidden:/.test(output.split('---')[1] ?? '')) throw new Error(`${route.source}: hidden survived`);
}

const EXPECTED = {
  files: 204,
  mdx: 46,
  asides: 258,
  embeds: 36,
  cardGrids: 9,
  images: 529,
  droppedCovers: 26,
  survivingBlocks: 0,
  survivingEntities: 0,
  survivingImgTags: 0,
};

let failed = false;
for (const [key, expected] of Object.entries(EXPECTED)) {
  const actual = stats[key];
  const ok = actual === expected;
  if (!ok) failed = true;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${key.padEnd(20)} ${actual}${ok ? '' : ` (expected ${expected})`}`);
}
// Informational, not asserted: the corpus contains ordinary numbered lists too, so a
// "^\d+\. " count cannot isolate the 15 stepper steps. Task 6 checks those by eye.
console.log(`     ${'ordered list items'.padEnd(20)} ${stats.steps}`);
console.log(`\nwrote ${stats.files} pages to src/content/docs`);

if (failed) {
  console.error('\nA count diverged. The script is wrong — do not adjust the expectation.');
  process.exit(1);
}
```

- [ ] **Step 2: Run it**

Run: `node scripts/convert.mjs`
Expected: every line prefixed `ok`, then `wrote 204 pages to src/content/docs`.

If a count diverges, fix the responsible `lib/` module and its unit test — never the
expectation, and never the generated file. `survivingBlocks`, `survivingEntities` and
`survivingImgTags` must all be 0.

- [ ] **Step 3: Verify idempotency**

```bash
node scripts/convert.mjs > /dev/null
find src/content/docs -type f | sort | xargs shasum > /tmp/run1.txt
node scripts/convert.mjs > /dev/null
find src/content/docs -type f | sort | xargs shasum > /tmp/run2.txt
diff /tmp/run1.txt /tmp/run2.txt && echo "IDENTICAL"
```
Expected: `IDENTICAL`

- [ ] **Step 4: Verify the build**

Run: `npx astro build 2>&1 | tail -20`
Expected: succeeds, reporting 204 page(s) built (plus Starlight's 404). Any MDX parse failure
names a file — fix the responsible `lib/` module, re-run `convert.mjs`, rebuild.

- [ ] **Step 5: Commit**

```bash
git add scripts/convert.mjs src/content/docs
git commit -m "Convert the GitBook corpus to Starlight content"
```

---

### Task 12: Sidebar generation

`SUMMARY.md` nests five levels deep across six sections. Starlight groups are not linkable —
`SidebarGroupSchema` in `node_modules/@astrojs/starlight/schemas/sidebar.ts` has no `link`
field — so each of the 41 entries that is both a page and a parent becomes a group whose first
item is the parent page itself, carrying the same label.

**Files:**
- Create: `scripts/sidebar.mjs`
- Create: `scripts/lib/sidebar-tree.mjs`
- Create: `scripts/lib/sidebar-tree.test.mjs`
- Modify: `astro.config.mjs` (replace the Phase 1 placeholder sidebar)

**Interfaces:**
- Consumes: `parseSummary` from `./lib/summary.mjs`; `route-map.json` for slugs.
- Produces:
  - `buildSidebar(entries, slugFor) -> Array<{ label: string, items: Array<object> }>` where `slugFor(source: string) -> string` maps a source path to a Starlight slug.

- [ ] **Step 1: Write the failing test**

Create `scripts/lib/sidebar-tree.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSidebar } from './sidebar-tree.mjs';

const slugFor = (source) => source.replace(/(^|\/)README\.md$/, '').replace(/\.md$/, '');
const section = { label: 'CORE CONCEPTS', slug: 'core-concepts' };

test('a section becomes a top-level group', () => {
  const entries = [{ depth: 0, label: 'Model', source: 'model.md', section }];
  assert.deepEqual(buildSidebar(entries, slugFor), [
    { label: 'CORE CONCEPTS', items: [{ label: 'Model', slug: 'model' }] },
  ]);
});

test('a parent page becomes a group whose first item is the page itself', () => {
  const entries = [
    { depth: 0, label: 'Message design', source: 'design/README.md', section },
    { depth: 2, label: 'Text message', source: 'design/text.md', section },
  ];
  assert.deepEqual(buildSidebar(entries, slugFor), [
    {
      label: 'CORE CONCEPTS',
      items: [
        {
          label: 'Message design',
          items: [
            { label: 'Message design', slug: 'design' },
            { label: 'Text message', slug: 'design/text' },
          ],
        },
      ],
    },
  ]);
});

test('nesting continues to arbitrary depth', () => {
  const entries = [
    { depth: 0, label: 'A', source: 'a/README.md', section },
    { depth: 2, label: 'B', source: 'a/b/README.md', section },
    { depth: 4, label: 'C', source: 'a/b/c.md', section },
  ];
  const [group] = buildSidebar(entries, slugFor);
  assert.deepEqual(group.items[0].items[1], {
    label: 'B',
    items: [
      { label: 'B', slug: 'a/b' },
      { label: 'C', slug: 'a/b/c' },
    ],
  });
});

test('the root README becomes the empty slug', () => {
  const entries = [{ depth: 0, label: 'Introduction', source: 'README.md', section }];
  assert.deepEqual(buildSidebar(entries, slugFor)[0].items, [{ label: 'Introduction', slug: '' }]);
});

test('sections keep SUMMARY.md order', () => {
  const other = { label: 'RELEASE NOTES', slug: 'release-notes' };
  const entries = [
    { depth: 0, label: 'A', source: 'a.md', section },
    { depth: 0, label: 'R', source: 'r.md', section: other },
  ];
  assert.deepEqual(buildSidebar(entries, slugFor).map((g) => g.label), ['CORE CONCEPTS', 'RELEASE NOTES']);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/lib/sidebar-tree.test.mjs`
Expected: FAIL — `Cannot find module './sidebar-tree.mjs'`

- [ ] **Step 3: Write the tree builder**

Create `scripts/lib/sidebar-tree.mjs`:

```js
/**
 * Turns the flat SUMMARY.md entry list into Starlight's nested sidebar shape.
 *
 * Starlight groups are not linkable — SidebarGroupSchema has no `link` field — so an entry
 * that is both a page and a parent becomes a group whose first item is the page itself,
 * carrying the same label. That keeps every SUMMARY.md label exact, keeps all 204 pages
 * reachable from the nav, and invents no text. A clickable group needs a Sidebar component
 * override, which is Phase 4 chrome work.
 */

/** Builds the ordered section groups for Starlight's `sidebar` option. */
export function buildSidebar(entries, slugFor) {
  const groups = [];
  const stack = [];

  // Build a plain tree first. Every node carries a `children` array, always present so there
  // is no lazy-initialisation case to get wrong; the shaping pass below decides which nodes
  // actually became parents.
  for (const entry of entries) {
    if (!groups.length || groups.at(-1).label !== entry.section.label) {
      groups.push({ label: entry.section.label, children: [] });
      stack.length = 0;
    }
    while (stack.length && stack.at(-1).depth >= entry.depth) stack.pop();

    const node = { label: entry.label, slug: slugFor(entry.source), children: [] };
    const siblings = stack.length ? stack.at(-1).node.children : groups.at(-1).children;
    siblings.push(node);
    stack.push({ depth: entry.depth, node });
  }

  // A node with children becomes a group. Starlight cannot link a group, so the page keeps
  // its own entry as that group's first item, carrying the same label.
  const shape = (node) =>
    node.children.length
      ? {
          label: node.label,
          items: [{ label: node.label, slug: node.slug }, ...node.children.map(shape)],
        }
      : { label: node.label, slug: node.slug };

  return groups.map((group) => ({ label: group.label, items: group.children.map(shape) }));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/lib/sidebar-tree.test.mjs`
Expected: PASS, 5 tests

- [ ] **Step 5: Write the generator**

Create `scripts/sidebar.mjs`:

```js
/**
 * Generates the Starlight sidebar from source/SUMMARY.md.
 *
 * Writes a separate module rather than splicing into astro.config.mjs, so generated data and
 * hand-written configuration never share a file or a diff.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseSummary } from './lib/summary.mjs';
import { buildSidebar } from './lib/sidebar-tree.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = `${root}/src/sidebar.generated.mjs`;

const routes = new Map(
  JSON.parse(readFileSync(`${root}/route-map.json`, 'utf8')).map((r) => [r.source, r])
);

/** A page's Starlight slug is its live URL without the leading slash. */
const slugFor = (source) => {
  const route = routes.get(source);
  if (!route) throw new Error(`no route for ${source}`);
  return route.url === '/' ? '' : route.url.slice(1);
};

const entries = parseSummary(readFileSync(`${root}/source/SUMMARY.md`, 'utf8'));
const sidebar = buildSidebar(entries, slugFor);

const count = (items) =>
  items.reduce((total, item) => total + (item.items ? count(item.items) : 1), 0);

writeFileSync(
  OUT,
  '// Generated by scripts/sidebar.mjs from source/SUMMARY.md. Do not edit.\n' +
    `export default ${JSON.stringify(sidebar, null, 2)};\n`
);

console.log(`sections     : ${sidebar.length}`);
console.log(`nav entries  : ${count(sidebar)}`);
console.log(`wrote ${OUT}`);

if (entries.length !== 204) {
  console.error(`expected 204 SUMMARY.md entries, parsed ${entries.length}`);
  process.exit(1);
}
```

- [ ] **Step 6: Run it**

Run: `node scripts/sidebar.mjs`
Expected: `sections : 6`, and `nav entries : 245` — 204 pages plus the 41 parent pages that
appear a second time as their group's first item. Confirm the arithmetic holds: 204 + 41 = 245.

- [ ] **Step 7: Wire it into the config**

In `astro.config.mjs`, add the import at the top:

```js
import sidebar from './src/sidebar.generated.mjs';
```

and replace the whole `sidebar: [ … ]` placeholder array (lines 27–45, including the two
Phase 1 comment lines above it) with:

```js
				sidebar,
```

- [ ] **Step 8: Build and check the nav**

Run: `npx astro build 2>&1 | tail -5`
Expected: succeeds.

Run: `npx astro dev` and open a page. Confirm the six sections appear in `SUMMARY.md` order,
that a parent such as "Message design" shows as an expandable group whose first item repeats
the label, and that the four `[Deprecated]` / `[Legacy]` entries are present — they are the
ones a careless label regex drops.

- [ ] **Step 9: Commit**

```bash
git add scripts/sidebar.mjs scripts/lib/sidebar-tree.mjs scripts/lib/sidebar-tree.test.mjs src/sidebar.generated.mjs astro.config.mjs
git commit -m "Generate the sidebar from SUMMARY.md"
```

---

### Task 13: Phase gate

Prove the gate criteria, record what was found, and stop.

**Files:**
- Modify: `MIGRATION-NOTES.md` (append only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all tests pass across all `scripts/lib/*.test.mjs` files.

- [ ] **Step 2: Re-run the full pipeline from scratch**

```bash
node scripts/routes.mjs && node scripts/convert.mjs && node scripts/sidebar.mjs
```
Expected: route parity OK, every convert invariant `ok`, 204 pages, 6 sections.

- [ ] **Step 3: Prove the gate criteria**

```bash
npx astro build 2>&1 | tail -5
echo "--- pages built ---"
find dist -name index.html | wc -l
echo "--- {% outside code fences (must be 0) ---"
node -e '
import("./scripts/lib/segments.mjs").then(({ mapLines }) => {
  const fs = require("fs"), path = require("path");
  let hits = 0;
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else {
        mapLines(fs.readFileSync(p, "utf8"), (line) => {
          if (line.includes("{%")) { hits++; console.log(p + ": " + line.trim()); }
          return line;
        });
      }
    }
  })("src/content/docs");
  console.log("surviving GitBook blocks:", hits);
});'
```
Expected: build succeeds; 205 `index.html` files (204 pages plus the 404 page — confirm the
extra one is the 404 and not a stray); surviving GitBook blocks 0.

- [ ] **Step 4: Confirm no placeholder pages survived**

Run: `git status --short src/content/docs | head`
Expected: the four Phase 1 hand-written placeholders recorded in `MIGRATION-NOTES.md`
(`index.md`, `getting-started-1/getting-ready/index.md`,
`core-concepts/the-opendialog-model/index.mdx`, `tutorials/ai-agent-creation-overview/index.mdx`)
are replaced by generated files, not left alongside them.

- [ ] **Step 5: Append to `MIGRATION-NOTES.md`**

Append a dated section covering, at minimum:

- The eight corrections to the brief from the design spec, with the measured counts.
- The `mapLines` / `protectCode` refinement and why per-segment mapping was abandoned.
- The final invariant table as it actually ran.
- Everything from the spec's "Logged, not fixed" list: the "laaunched" typo; the 12
  `/broken/pages/` placeholders; the source link with an extra `../`; 391 images with empty
  `alt`; `{% code fullWidth="false" %}` dropped; the 3 pages where H1 and nav label differ.
- **The Phase 3 handoff, stated explicitly:** every `/.gitbook/assets/…` placeholder must be
  rewritten and survivors asserted to zero, and the 26 card-cover assets have no surviving
  reference after conversion and must be excluded from orphan deletion.
- The Phase 4 handoff: linkable sidebar groups, `<figure>` semantics, card-cover images.

- [ ] **Step 6: Commit and open the PR**

```bash
git add MIGRATION-NOTES.md
git commit -m "Record Phase 2 conversion findings"
git push -u origin phase-2/conversion-script
gh pr create --title "Phase 2: conversion script" --body "$(cat <<'BODY'
Converts all 204 GitBook pages to Starlight content and generates the sidebar from SUMMARY.md.

Gate: 204 pages converted, `astro build` succeeds, zero `{%` outside code fences, re-run
byte-identical.

Design spec: `docs/superpowers/specs/2026-07-29-phase-2-conversion-design.md`
Findings and handoffs: `MIGRATION-NOTES.md`

Images 404 on the preview until Phase 3 — paths are root-absolute placeholders by design, so
the build passes without committing 541 MB of assets into git history.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
BODY
)"
```

- [ ] **Step 7: Stop**

Report to Pat and wait. Do not begin Phase 3 asset work. `ffmpeg` is still not installed and
is needed for the 28 MB GIF that breaks Cloudflare's 25 MiB file cap.
