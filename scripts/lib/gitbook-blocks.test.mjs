import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convertCode, convertFile, convertHints, stripEntities } from './gitbook-blocks.mjs';

test('each hint style maps to its Starlight aside', () => {
  const cases = [
    ['info', 'note'],
    ['success', 'tip'],
    ['warning', 'caution'],
    ['danger', 'danger'],
  ];
  for (const [style, aside] of cases) {
    assert.equal(
      convertHints(`{% hint style="${style}" %}\nBody\n{% endhint %}`),
      `:::${aside}\nBody\n:::`
    );
  }
});

test('hints inside a fence are left alone', () => {
  const input = '```\n{% hint style="info" %}\n```';
  assert.equal(convertHints(input), input);
});

test('convertCode moves title onto the fence info string', () => {
  assert.equal(
    convertCode('{% code title="index.html" %}\n```html\n<p></p>\n```\n{% endcode %}'),
    '```html title="index.html"\n<p></p>\n```'
  );
});

test('convertCode maps lineNumbers to showLineNumbers', () => {
  assert.equal(
    convertCode('{% code lineNumbers="true" %}\n```json\n{}\n```\n{% endcode %}'),
    '```json showLineNumbers\n{}\n```'
  );
});

test('convertCode drops fullWidth, which Expressive Code has no equivalent for', () => {
  assert.equal(
    convertCode('{% code fullWidth="false" %}\n```ts\nx\n```\n{% endcode %}'),
    '```ts\nx\n```'
  );
});

test('convertCode preserves a fence with no language', () => {
  assert.equal(
    convertCode('{% code title="t" %}\n```\nx\n```\n{% endcode %}'),
    '``` title="t"\nx\n```'
  );
});

test('convertCode leaves an ordinary fence untouched', () => {
  const input = '```js\nconst a = 1;\n```';
  assert.equal(convertCode(input), input);
});

test('convertFile becomes a link whose text is the basename', () => {
  assert.equal(
    convertFile('{% file src="../../.gitbook/assets/DeliveryKnowledgeBase.csv" %}'),
    '[DeliveryKnowledgeBase.csv](</.gitbook/assets/DeliveryKnowledgeBase.csv>)'
  );
});

test('an end-of-line entity is stripped, not turned into a trailing space', () => {
  // "word &#x20;" -> "word  " would be a markdown hard break the live site does not render.
  assert.equal(stripEntities('Put a JSON payload here.&#x20;'), 'Put a JSON payload here.');
  assert.equal(stripEntities('Best practices &#x20;'), 'Best practices ');
});

test('a mid-line entity becomes a single space', () => {
  assert.equal(stripEntities('* &#x20;**Anonymous Authentication**'), '*  **Anonymous Authentication**');
  assert.equal(stripEntities('&#x20;We split the update'), ' We split the update');
});

test('entities inside a fence are left alone', () => {
  const input = '```\n&#x20;\n```';
  assert.equal(stripEntities(input), input);
});

test('two or more real spaces before an end-of-line entity collapse to one', () => {
  // Stripping only the trailing entity here would leave "a.  " (two real trailing spaces), a
  // markdown hard break the source never had: those two spaces were followed by literal entity
  // text, not a line ending.
  assert.equal(stripEntities('a.  &#x20;'), 'a. ');
  // constructing-messages.md's shape: a mid-line entity, then real spaces, then a trailing entity.
  assert.equal(stripEntities('&#x20;  &#x20;'), ' ');
});

test('an unrecognised hint style throws rather than falling back to note', () => {
  assert.throws(
    () => convertHints('{% hint style="note" %}\nBody\n{% endhint %}'),
    /unsupported hint style: note/
  );
});
