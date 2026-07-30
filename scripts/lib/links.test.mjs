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
