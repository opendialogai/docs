import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EMOJI, convertEmoji, countEmoji, countUnknownShortcodes } from './emoji.mjs';

test('a known shortcode becomes its character', () => {
  assert.equal(convertEmoji(':tada: Released'), '🎉 Released');
  assert.equal(convertEmoji('Do :white_check_mark:'), 'Do ✅');
  assert.equal(convertEmoji(':x: Do not'), '❌ Do not');
  assert.equal(convertEmoji(':heavy_plus_sign: Adding a user'), '➕ Adding a user');
});

test('a markdown-escaped underscore is still recognised', () => {
  // convert.mjs escapes underscores on the way to MDX, so the shortcode can reach this
  // transform in either form depending on ordering.
  assert.equal(convertEmoji(':white\\_check\\_mark: Do'), '✅ Do');
});

test('an unknown shortcode is left untouched', () => {
  assert.equal(convertEmoji(':rocket: ship it'), ':rocket: ship it');
});

test('shortcodes inside a fenced code block are left alone', () => {
  const fence = '```\n:tada:\n```';
  assert.equal(convertEmoji(fence), fence);
});

test('shortcodes inside inline code are left alone', () => {
  assert.equal(convertEmoji('use `:tada:` here'), 'use `:tada:` here');
});

test('a time or ratio is not mistaken for a shortcode', () => {
  assert.equal(convertEmoji('at 12:30:45 and a 3:2:1 ratio'), 'at 12:30:45 and a 3:2:1 ratio');
});

test('a URL is not mistaken for a shortcode', () => {
  assert.equal(convertEmoji('see https://example.com:8080/a'), 'see https://example.com:8080/a');
});

test('an aside marker is not mistaken for a shortcode', () => {
  assert.equal(convertEmoji(':::note\nBody\n:::'), ':::note\nBody\n:::');
});

test('countUnknownShortcodes finds a shortcode this map cannot render', () => {
  assert.equal(countUnknownShortcodes(':rocket: ship'), 1);
  assert.equal(countUnknownShortcodes('🎉 already converted'), 0);
  assert.equal(countUnknownShortcodes('at 12:30:45'), 0);
  assert.equal(countUnknownShortcodes(':::note\nx\n:::'), 0);
});

test('countUnknownShortcodes ignores code', () => {
  assert.equal(countUnknownShortcodes('```\n:rocket:\n```'), 0);
});

test('countEmoji counts only shortcodes this map can render', () => {
  assert.equal(countEmoji(':tada: and :x: and :rocket:'), 2);
  assert.equal(countEmoji(':white\\_check\\_mark:'), 1);
  assert.equal(countEmoji('```\n:tada:\n```'), 0);
  assert.equal(countEmoji('nothing here'), 0);
});

test('every mapped shortcode maps to a non-empty character', () => {
  for (const [name, char] of Object.entries(EMOJI)) {
    assert.ok(char.length > 0, `${name} has no character`);
    assert.ok(!/^[a-z:]/.test(char), `${name} maps to something that looks like text`);
  }
});
