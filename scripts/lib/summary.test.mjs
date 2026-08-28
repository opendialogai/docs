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
