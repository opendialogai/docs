import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyAltImages } from './alt-audit.mjs';

test('an image with no alt text is reported with its asset name', () => {
  assert.deepEqual(emptyAltImages('![](~/assets/image-547.png)'), [
    { asset: 'image-547.png', caption: '' },
  ]);
});

// convert.mjs carries GitBook's image width through as a markdown title, so the destination
// is not always the bare path. Missing this form would name an asset that does not exist.
test('a width title after the path is not part of the asset name', () => {
  assert.deepEqual(emptyAltImages('![](~/assets/image-623.png "188")'), [
    { asset: 'image-623.png', caption: '' },
  ]);
});

// rehype-figures pairs an image with the emphasis-only paragraph beneath it into a
// <figure>/<figcaption>. The audit must read the same pairing or it will report a caption
// the reader cannot see, or miss one they can.
test('an emphasis paragraph beneath the image is its caption', () => {
  const md = '![](~/assets/a.png)\n\n_Create Scenario Link_\n';
  assert.deepEqual(emptyAltImages(md), [{ asset: 'a.png', caption: 'Create Scenario Link' }]);
});

// Documentation about markdown contains markdown. An example inside a fence ships as text,
// never as an <img>, so counting it would put a row in the work list with nothing to fix.
test('an image inside a code fence is not a real image', () => {
  const md = '```md\n![](~/assets/example.png)\n```\n';
  assert.deepEqual(emptyAltImages(md), []);
});

test('an image that already carries alt text is not reported', () => {
  assert.deepEqual(emptyAltImages('![A scenario list](~/assets/b.png)'), []);
});

// Seven images on three pages are still hotlinked from googleusercontent and freshdesk. They
// ship with an empty alt exactly as the local ones do, so leaving them out understates the
// work and puts the row count permanently at odds with the build.
test('a remotely hosted image with no alt text is reported', () => {
  assert.deepEqual(emptyAltImages('![](https://example.com/x.png)'), [
    { asset: 'https://example.com/x.png', caption: '' },
  ]);
});

// GitBook laid figures out in a row inside a wrapper div, which convert.mjs reflows into one
// paragraph holding several images. rehype-figures does not caption those, so neither may this.
test('images sharing a paragraph take no caption', () => {
  const md = '![](~/assets/c.png)\n![](~/assets/d.png)\n\n_Not their caption_\n';
  assert.deepEqual(emptyAltImages(md), [
    { asset: 'c.png', caption: '' },
    { asset: 'd.png', caption: '' },
  ]);
});

test('a paragraph that merely contains emphasis is not a caption', () => {
  const md = '![](~/assets/e.png)\n\nSee _the guide_ for more.\n';
  assert.deepEqual(emptyAltImages(md), [{ asset: 'e.png', caption: '' }]);
});

test('an asterisk-emphasised caption is read the same as an underscored one', () => {
  const md = '![](~/assets/f.png)\n\n*Star caption*\n';
  assert.deepEqual(emptyAltImages(md), [{ asset: 'f.png', caption: 'Star caption' }]);
});
