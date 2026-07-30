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

// This is generic ATTR coverage, not a dedicated file-block pattern: a {% file %} block's
// asset is found only because its src="…" attribute happens to read like an HTML one. See
// the ATTR comment in asset-refs.mjs.
test('finds a GitBook file block via its src="…" attribute', () => {
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

test('preserves a duplicate reference when the same asset is both a card cover and a figure', () => {
  const text = [
    '<table data-view="cards"><thead><tr><th></th><th data-hidden data-card-cover data-type="files"></th></tr></thead>',
    '<tbody><tr><td>Project usage</td><td><a href=".gitbook/assets/Screenshot 2024-09-26 at 10.32.32.png">Screenshot 2024-09-26 at 10.32.32.png</a></td></tr></tbody>',
    '</table>',
    '',
    '<figure><img src=".gitbook/assets/Screenshot 2024-09-26 at 10.32.32.png" alt=""><figcaption><p>Expanded view</p></figcaption></figure>',
  ].join('\n');
  const { all, covers } = assetRefsInFile(text);
  assert.deepEqual(all, [
    'Screenshot 2024-09-26 at 10.32.32.png',
    'Screenshot 2024-09-26 at 10.32.32.png',
  ]);
  assert.deepEqual(covers, ['Screenshot 2024-09-26 at 10.32.32.png']);
});
