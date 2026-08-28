import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mapLines, protectCode } from './segments.mjs';

const upper = (line) => line.toUpperCase();

test('mapLines transforms prose lines', () => {
  assert.equal(mapLines('a\nb', upper), 'A\nB');
});

test('mapLines leaves fenced code and its delimiters untouched', () => {
  const input = 'a\n```json\n{ "k": "v" }\n```\nb';
  assert.equal(mapLines(input, upper), 'A\n```json\n{ "k": "v" }\n```\nB');
});

test('mapLines lets a block construct span a fence', () => {
  // {% columns %} wraps fenced code in the real corpus. Open and close markers must
  // both reach the callback even though a fence sits between them.
  const seen = [];
  const input = '{% columns %}\n```json\n{ "a": 1 }\n```\n{% endcolumns %}';
  mapLines(input, (line) => {
    seen.push(line);
    return line;
  });
  assert.deepEqual(seen, ['{% columns %}', '{% endcolumns %}']);
});

test('mapLines does not treat an indented info string as a closing fence', () => {
  const input = '```js\nconst a = 1;\n```\nx';
  assert.equal(mapLines(input, upper), '```js\nconst a = 1;\n```\nX');
});

test('mapLines supports tilde fences', () => {
  assert.equal(mapLines('~~~\nx\n~~~\ny', upper), '~~~\nx\n~~~\nY');
});

test('mapLines treats an unterminated fence as code to the end', () => {
  assert.equal(mapLines('a\n```\nb\nc', upper), 'A\n```\nb\nc');
});

test('mapLines can delete and splice lines', () => {
  assert.equal(mapLines('a\nb', (l) => (l === 'a' ? null : ['x', 'y'])), 'x\ny');
});

test('protectCode hides fenced blocks from a regex transform', () => {
  const input = 'say {hello}\n```\nkeep {hello}\n```';
  const out = protectCode(input, (t) => t.replaceAll('{hello}', 'WORLD'));
  assert.equal(out, 'say WORLD\n```\nkeep {hello}\n```');
});

test('protectCode hides inline code spans', () => {
  const out = protectCode('a `{x}` b {x}', (t) => t.replaceAll('{x}', 'Y'));
  assert.equal(out, 'a `{x}` b Y');
});

test('protectCode handles a path with parentheses outside code', () => {
  const input = '![](<../.gitbook/assets/image (149).png>)';
  const out = protectCode(input, (t) => t.replace('../.gitbook/assets/', '/.gitbook/assets/'));
  assert.equal(out, '![](</.gitbook/assets/image (149).png>)');
});

test('protectCode is a round trip when the transform does nothing', () => {
  const input = 'a\n```js\nconst x = `t`;\n```\n`inline` b';
  assert.equal(protectCode(input, (t) => t), input);
});

test('protectCode restores double-backtick spans', () => {
  const input = 'a ``code with ` tick`` b';
  assert.equal(protectCode(input, (t) => t), input);
});
