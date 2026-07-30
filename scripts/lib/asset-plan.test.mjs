import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  assignSlugs,
  planAsset,
  slugify,
  GIF_VIDEO_THRESHOLD,
  MAX_WIDTH,
  QUANTISE_MAX_COLOURS,
} from './asset-plan.mjs';

test('slugify lowercases and collapses non-alphanumeric runs', () => {
  assert.equal(slugify('Screenshot 2024-07-09 at 09.52.58.png'), 'screenshot-2024-07-09-at-09-52-58.png');
  assert.equal(slugify('image (149).png'), 'image-149.png');
  assert.equal(slugify('2023-05-04_16-17-09 (1).png'), '2023-05-04-16-17-09-1.png');
});

test('slugify keeps the digits inside GitBook re-upload suffixes distinct', () => {
  assert.notEqual(
    slugify('Screenshot 2024-07-09 at 09.52.58.png'),
    slugify('Screenshot 2024-07-09 at 09.52.58 (1).png')
  );
});

test('slugify lowercases the extension and trims stray separators', () => {
  assert.equal(slugify('Zrzut ekranu 2025-11-3 o 14.48.02.PNG'), 'zrzut-ekranu-2025-11-3-o-14-48-02.png');
  assert.equal(slugify('  spaced  .png'), 'spaced.png');
});

test('assignSlugs returns one slug per input and is order independent', () => {
  const names = ['b.png', 'a.png'];
  const forward = assignSlugs(names);
  const reverse = assignSlugs([...names].reverse());
  assert.deepEqual([...forward.entries()].sort(), [...reverse.entries()].sort());
  assert.equal(forward.size, 2);
});

test('assignSlugs suffixes a collision deterministically by sorted original name', () => {
  const map = assignSlugs(['Photo B.png', 'photo-b.png']);
  assert.equal(map.get('Photo B.png'), 'photo-b.png');
  assert.equal(map.get('photo-b.png'), 'photo-b-2.png');
});

test('a low-colour still image is resized and quantised', () => {
  const plan = planAsset({ filename: 'a.png', bytes: 500000, colours: 3000 });
  assert.deepEqual(plan, { kind: 'image', destination: 'src/assets', treatment: 'resize-quantise' });
});

test('a colour-rich still image is resized but kept full colour', () => {
  const plan = planAsset({ filename: 'a.png', bytes: 500000, colours: QUANTISE_MAX_COLOURS + 1 });
  assert.deepEqual(plan, { kind: 'image', destination: 'src/assets', treatment: 'resize-only' });
});

test('a small gif is copied byte-for-byte so its animation survives', () => {
  const plan = planAsset({ filename: 'spin.gif', bytes: 150000, colours: null });
  assert.deepEqual(plan, { kind: 'image', destination: 'src/assets', treatment: 'copy' });
});

test('a large gif becomes a video in public/media', () => {
  const plan = planAsset({ filename: 'demo.gif', bytes: GIF_VIDEO_THRESHOLD + 1, colours: null });
  assert.deepEqual(plan, { kind: 'video', destination: 'public/media', treatment: 'encode-video' });
});

test('a non-image is copied to public/files', () => {
  const plan = planAsset({ filename: 'data.csv', bytes: 1027, colours: null });
  assert.deepEqual(plan, { kind: 'file', destination: 'public/files', treatment: 'copy' });
});

test('the exported thresholds are the measured values', () => {
  assert.equal(MAX_WIDTH, 2000);
  assert.equal(QUANTISE_MAX_COLOURS, 32768);
  assert.equal(GIF_VIDEO_THRESHOLD, 1048576);
});
