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
