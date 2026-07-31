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
