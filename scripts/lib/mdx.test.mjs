import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normaliseForMdx } from './mdx.mjs';

test('void elements are self-closed', () => {
  assert.equal(normaliseForMdx('a<br>b'), 'a<br />b');
  assert.equal(normaliseForMdx('<hr>'), '<hr />');
});

test('an already self-closed element is left alone', () => {
  assert.equal(normaliseForMdx('a<br />b'), 'a<br />b');
});

test('class becomes className', () => {
  assert.equal(normaliseForMdx('<div class="x">y</div>'), '<div className="x">y</div>');
});

test('a style string becomes a style object', () => {
  assert.equal(
    normaliseForMdx('<mark style="color:purple;">x</mark>'),
    "<mark style={{ color: 'purple' }}>x</mark>"
  );
});

test('a multi-declaration style becomes a camelCased object', () => {
  assert.equal(
    normaliseForMdx('<span style="background-color: red; font-weight: bold">x</span>'),
    "<span style={{ backgroundColor: 'red', fontWeight: 'bold' }}>x</span>"
  );
});

test('bare braces in prose are escaped', () => {
  assert.equal(normaliseForMdx('_For example, {llm_response}_'), '_For example, \\{llm_response\\}_');
  assert.equal(normaliseForMdx('Type an opening curly brace { to continue'),
    'Type an opening curly brace \\{ to continue');
});

test('braces inside fenced code and inline spans are untouched', () => {
  const input = '```json\n{ "a": 1 }\n```\n`{b}` c';
  assert.equal(normaliseForMdx(input), input);
});

test('braces in emitted component attributes are not escaped', () => {
  const input = '<LinkCard title="X" href="/y" />\n<Embed url="https://youtu.be/z" />';
  assert.equal(normaliseForMdx(input), input);
});

test('a style object emitted by this pass is not then brace-escaped', () => {
  assert.equal(
    normaliseForMdx('<mark style="color:purple;">x</mark>'),
    "<mark style={{ color: 'purple' }}>x</mark>"
  );
});

// Required addition: Task 7's convertCardTables emits <Card title="…">body prose</Card> for
// the 24 card-table rows with no link target, including all 22 rows of a reference glossary.
// Card body text is JSX children, not an attribute — a brace there compiles to a live
// identifier reference and throws ReferenceError at build time unless escaped like any other
// prose. This test locks in that normaliseForMdx reaches into children (it stashes tag syntax
// only, never the prose between an opening and closing tag) while leaving the tag itself, and
// its attribute, alone.
test('a bare brace in JSX children between two tags is escaped, the tags are not', () => {
  assert.equal(
    normaliseForMdx('<Card title="X">text {llm_response} more</Card>'),
    '<Card title="X">text \\{llm_response\\} more</Card>'
  );
});

// The TAG regex must not mistake a CommonMark autolink for an HTML tag. Task 6's convertEmbeds
// and links.mjs's rewriteLinks both emit bare `<scheme:...>` autolinks (e.g.
// `<https://www.fetchify.com/address-auto-complete>`, a real, non-video embed in the corpus
// promoted to .mdx). An autolink's scheme is immediately followed by ":", which no real tag
// name is, so a query string that happens to contain "class=" or a bare "{" must survive
// completely untouched rather than being corrupted by the tag-attribute rewrite or hidden from
// brace-escaping.
test('a scheme autolink is not mistaken for a tag', () => {
  assert.equal(
    normaliseForMdx('<https://example.com/path?class=header&note={x}>'),
    '<https://example.com/path?class=header&note=\\{x\\}>'
  );
});

// styleObject's job is a lossy, corpus-scoped conversion (single CSS declarations), not a
// general CSS parser. A declaration with no colon is not a value this project's docs ever
// produce, so — matching convertHints, convertSteppers, convertCardTables and convertFigures —
// an unrecognised shape must fail loudly rather than silently emit a malformed object literal.
test('a style declaration with no colon throws rather than silently misparsing', () => {
  assert.throws(() => normaliseForMdx('<mark style="notadeclaration">x</mark>'));
});

test('an empty style attribute becomes an empty object', () => {
  assert.equal(normaliseForMdx('<mark style="">x</mark>'), '<mark style={{}}>x</mark>');
});

// Braces inside a tag's own attribute values (not just component attributes emitted by this
// pipeline) must stay masked along with the rest of the tag, since the whole tag is stashed
// before brace-escaping runs.
test('a brace inside a raw HTML tag\'s attribute is not escaped', () => {
  assert.equal(
    normaliseForMdx('<div data-token="{x}">y</div>'),
    '<div data-token="{x}">y</div>'
  );
});

// TAG's attribute matching must be quote-aware. A literal ">" inside a quoted value (a Card
// title, an href) is not the tag's closing delimiter, and a naive "anything but >" match would
// truncate there — exposing the rest of the real tag, brace included, to brace-escaping as if
// it were ordinary prose.
test('a > inside a quoted attribute value does not truncate the tag, and a brace in that value is left alone', () => {
  assert.equal(
    normaliseForMdx('<LinkCard title="a > b {c}" href="/y" />'),
    '<LinkCard title="a > b {c}" href="/y" />'
  );
});

// class=/style= must be matched in attribute position (preceded by the whitespace that
// separates attributes), not as a bare substring anywhere in the tag's raw text — otherwise a
// query string containing "class=" gets corrupted into "className=".
test('class= inside a quoted attribute value is not rewritten to className=', () => {
  assert.equal(
    normaliseForMdx('<LinkCard title="X" href="/y?class=header" />'),
    '<LinkCard title="X" href="/y?class=header" />'
  );
});

// The same attribute-position anchoring means an attribute that merely contains "class" as
// part of a longer name — data-class, not class — is never renamed: "class=" is only ever a
// real attribute name when it is the whole word immediately after a space.
test('an attribute named like class (e.g. data-class) is not renamed', () => {
  assert.equal(
    normaliseForMdx('<div data-class="x">y</div>'),
    '<div data-class="x">y</div>'
  );
});
