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
