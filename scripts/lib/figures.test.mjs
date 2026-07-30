import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assetPath, convertFigures, reflowImageDiv, rewriteAssetRefs } from './figures.mjs';

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

test('a code span in a caption becomes a backtick span, not plain text', () => {
  // openai.md and azure-openai.md both caption a screenshot this way, marking an attribute
  // name inline with <code> rather than plain prose.
  assert.equal(
    convertFigures(
      '<figure><img src="../../../.gitbook/assets/Screenshot 2024-07-09 at 09.52.58 (1).png" alt="">' +
        "<figcaption><p>Create a text message using the LLM's response by using the " +
        '<code>llm_response</code> attribute</p></figcaption></figure>'
    ),
    '![](</.gitbook/assets/Screenshot 2024-07-09 at 09.52.58 (1).png>)\n\n' +
      "*Create a text message using the LLM's response by using the `llm_response` attribute*"
  );
});

test('a figure holding more than one img throws rather than silently dropping one', () => {
  assert.throws(
    () =>
      convertFigures(
        '<figure><img src=".gitbook/assets/a.png" alt=""><img src=".gitbook/assets/b.png" alt="">' +
          '<figcaption></figcaption></figure>'
      ),
    /convertFigures: a <figure> block did not match the expected one-image shape/
  );
});

test('an img with no src attribute throws rather than shipping unoptimised', () => {
  assert.throws(
    () => convertFigures('<img alt="X">'),
    /convertFigures: <img> with no src attribute/
  );
});

test('reflowImageDiv keeps the wrapper, one blank-line-separated figure per line', () => {
  assert.equal(
    reflowImageDiv('<div align="left"><figure><img src="a.png" alt=""></figure></div>'),
    '<div align="left">\n\n<figure><img src="a.png" alt=""></figure>\n\n</div>'
  );
});

test('reflowImageDiv separates several figures glued onto one line', () => {
  // The exact shape that glued a caption to the next image: convertFigures runs after this
  // and turns each figure into "![]()\n\n*caption*", so two figures with no blank line between
  // them produced "*caption one* ![](image two)" — the caption sitting beside the wrong image.
  assert.equal(
    reflowImageDiv(
      '<div><figure><img src="a.png" alt=""></figure> <figure><img src="b.png" alt=""></figure></div>'
    ),
    '<div>\n\n<figure><img src="a.png" alt=""></figure>\n\n<figure><img src="b.png" alt=""></figure>\n\n</div>'
  );
});

test('reflowImageDiv keeps the align attribute the live site uses to centre the image', () => {
  const out = reflowImageDiv('<div align="center" data-full-width="false">\n\n<img src="a.png" alt="">\n\n</div>');
  assert.equal(out, '<div align="center" data-full-width="false">\n\n<img src="a.png" alt="">\n\n</div>');
});

test('reflowImageDiv normalises a multi-line div already spread across lines', () => {
  const input = [
    '<div align="left">',
    '',
    '<figure><img src="a.png" alt=""></figure>',
    '',
    '</div>',
  ].join('\n');
  assert.equal(reflowImageDiv(input), '<div align="left">\n\n<figure><img src="a.png" alt=""></figure>\n\n</div>');
});

test('reflowImageDiv reflows a div holding a bare img with no figure', () => {
  assert.equal(
    reflowImageDiv('<div align="center">\n\n<img src="a.png" alt="">\n\n</div>'),
    '<div align="center">\n\n<img src="a.png" alt="">\n\n</div>'
  );
});

test('reflowImageDiv throws rather than silently dropping a div holding real prose', () => {
  assert.throws(
    () => reflowImageDiv('<div><p>Some real documentation text.</p></div>'),
    /reflowImageDiv: <div> holds more than figures\/images/
  );
});

test('a div inside a fence is left as literal text', () => {
  const input = '```html\n<div id="app"></div>\n```';
  assert.equal(reflowImageDiv(input), input);
});

test('reflowImageDiv followed by convertFigures pairs each caption with its own image', () => {
  // End-to-end regression for the bug the review found: date-picker-message.md's shape is
  // exactly three figures on one line inside one div.
  const input =
    '<div align="center">' +
    '<figure><img src="a.png" alt=""><figcaption><p>Pick a time</p></figcaption></figure> ' +
    '<figure><img src="b.png" alt=""><figcaption><p>Pick a date</p></figcaption></figure>' +
    '</div>';
  assert.equal(
    convertFigures(reflowImageDiv(input)),
    [
      '<div align="center">',
      '',
      '![](a.png)',
      '',
      '*Pick a time*',
      '',
      '![](b.png)',
      '',
      '*Pick a date*',
      '',
      '</div>',
    ].join('\n')
  );
});
