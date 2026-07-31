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
