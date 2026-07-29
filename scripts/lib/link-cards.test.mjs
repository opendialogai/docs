import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convertCardTables, convertContentRefs, countDroppedCovers } from './link-cards.mjs';

const routes = new Map([
  ['a/text-message.md', { url: '/design/text-message' }],
  ['the-opendialog-model/README.md', { url: '/core-concepts/the-opendialog-model' }],
]);
const titles = new Map([
  ['a/text-message.md', { title: 'Text message', description: 'Send plain text.' }],
  ['the-opendialog-model/README.md', { title: 'The OpenDialog model' }],
]);
const ctx = { source: 'a/README.md', routes, titles };

test('a content-ref becomes a LinkCard titled from the target page', () => {
  const input = [
    '{% content-ref url="text-message.md" %}',
    '[text-message.md](text-message.md)',
    '{% endcontent-ref %}',
  ].join('\n');
  assert.equal(
    convertContentRefs(input, ctx),
    '<LinkCard title="Text message" description="Send plain text." href="/design/text-message" />'
  );
});

test('a content-ref to a page with no description omits the attribute', () => {
  const input = [
    '{% content-ref url="../the-opendialog-model/" %}',
    '[the-opendialog-model](../the-opendialog-model/)',
    '{% endcontent-ref %}',
  ].join('\n');
  assert.equal(
    convertContentRefs(input, ctx),
    '<LinkCard title="The OpenDialog model" href="/core-concepts/the-opendialog-model" />'
  );
});

test('a card-table becomes a CardGrid of LinkCards', () => {
  const input =
    '<table data-card-size="large" data-view="cards" data-full-width="false">' +
    '<thead><tr><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th>' +
    '<th data-hidden data-card-cover data-type="files"></th></tr></thead><tbody>' +
    '<tr><td><a href="../the-opendialog-model/"><strong>The OpenDialog model</strong></a></td>' +
    '<td>Take a deepdive.</td>' +
    '<td><a href="../the-opendialog-model/">the-opendialog-model</a></td>' +
    '<td><a href="../.gitbook/assets/OD-basicmodel.png">OD-basicmodel.png</a></td></tr>' +
    '</tbody></table>';
  assert.equal(
    convertCardTables(input, ctx),
    [
      '<CardGrid>',
      '  <LinkCard title="The OpenDialog model" description="Take a deepdive." href="/core-concepts/the-opendialog-model" />',
      '</CardGrid>',
    ].join('\n')
  );
});

test('a card pointing at a broken page keeps the broken href', () => {
  const input =
    '<table data-view="cards"><thead><tr><th></th><th></th>' +
    '<th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody>' +
    '<tr><td><a href="/broken/pages/2lcI5UfFruOL0M8VSp3d"><strong>Core concepts</strong></a></td>' +
    '<td>The core concepts.</td>' +
    '<td><a href="/broken/pages/2lcI5UfFruOL0M8VSp3d">Broken link</a></td></tr>' +
    '</tbody></table>';
  const out = convertCardTables(input, ctx);
  assert.ok(out.includes('href="/broken/pages/2lcI5UfFruOL0M8VSp3d"'), out);
  assert.ok(out.includes('title="Core concepts"'), out);
});

test('a card-table row with no anchor emits a Card carrying the row\'s title and body text', () => {
  const input =
    '<table data-view="cards"><thead><tr><th></th><th></th></tr></thead><tbody>' +
    '<tr><td><strong>Is True</strong></td><td>Can be used with Boolean Attributes</td></tr>' +
    '</tbody></table>';
  assert.equal(
    convertCardTables(input, ctx),
    [
      '<CardGrid>',
      '  <Card title="Is True">',
      '    Can be used with Boolean Attributes',
      '  </Card>',
      '</CardGrid>',
    ].join('\n')
  );
});

test('a mixed table emits both a LinkCard and a Card inside one CardGrid, in source order', () => {
  const input =
    '<table data-view="cards"><thead><tr><th></th><th></th>' +
    '<th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody>' +
    '<tr><td><a href="../the-opendialog-model/"><strong>The OpenDialog model</strong></a></td>' +
    '<td>Take a deepdive.</td>' +
    '<td><a href="../the-opendialog-model/">the-opendialog-model</a></td></tr>' +
    '<tr><td><strong>No link</strong></td><td>Just a description.</td></tr>' +
    '</tbody></table>';
  assert.equal(
    convertCardTables(input, ctx),
    [
      '<CardGrid>',
      '  <LinkCard title="The OpenDialog model" description="Take a deepdive." href="/core-concepts/the-opendialog-model" />',
      '  <Card title="No link">',
      '    Just a description.',
      '  </Card>',
      '</CardGrid>',
    ].join('\n')
  );
});

test('a row with two non-empty description cells keeps both', () => {
  const input =
    '<table data-view="cards"><thead><tr><th></th><th></th><th></th></tr></thead><tbody>' +
    '<tr><td><strong>Quick Start</strong></td><td>Summary text.</td><td>How to start text.</td></tr>' +
    '</tbody></table>';
  assert.equal(
    convertCardTables(input, ctx),
    [
      '<CardGrid>',
      '  <Card title="Quick Start">',
      '    Summary text.',
      '',
      '    How to start text.',
      '  </Card>',
      '</CardGrid>',
    ].join('\n')
  );
});

test('a targeted row with more than one prose cell throws rather than dropping content', () => {
  const input =
    '<table data-view="cards"><thead><tr><th></th><th></th><th></th>' +
    '<th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody>' +
    '<tr><td><a href="../the-opendialog-model/"><strong>The OpenDialog model</strong></a></td>' +
    '<td>Take a deepdive.</td>' +
    '<td>Extra prose cell.</td>' +
    '<td><a href="../the-opendialog-model/">the-opendialog-model</a></td></tr>' +
    '</tbody></table>';
  assert.throws(() => convertCardTables(input, ctx), /a\/README\.md.*The OpenDialog model/);
});

test('countDroppedCovers counts the cover assets LinkCard cannot show', () => {
  const input =
    '<table data-view="cards"><thead><tr><th></th>' +
    '<th data-hidden data-card-cover data-type="files"></th></tr></thead><tbody>' +
    '<tr><td><a href="x.md"><strong>X</strong></a></td>' +
    '<td><a href="../.gitbook/assets/a.png">a.png</a></td></tr>' +
    '<tr><td><a href="y.md"><strong>Y</strong></a></td>' +
    '<td><a href="../.gitbook/assets/b.png">b.png</a></td></tr>' +
    '</tbody></table>';
  assert.equal(countDroppedCovers(input), 2);
});

test('an ordinary table is left alone', () => {
  const input = '<table><thead><tr><th>A</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>';
  assert.equal(convertCardTables(input, ctx), input);
});
