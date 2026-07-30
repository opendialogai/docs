import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normaliseForMdx, unwrapPreCode } from './mdx.mjs';

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

// The TAG regex must not mistake a CommonMark autolink for an HTML tag. No page in the current
// corpus reaches this pass carrying one — gitbook-blocks.mjs's convertEmbeds renders a
// non-video embed as a markdown link rather than a bare `<url>` specifically so it never has
// to (a `<scheme://…>` autolink is not reliably parseable by MDX at all, regardless of this
// regex) — but a scheme's ":" is immediately followed by characters no real tag name has, so
// this stays a defensive regression test: a query string that happens to contain "class=" or a
// bare "{" must survive completely untouched rather than being corrupted by the tag-attribute
// rewrite or hidden from brace-escaping.
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

// progress-bar-message.md's XML snippet is exactly this shape: a <pre><code> whose content
// spans several lines, MDX cannot parse at all (even with no nested tag: it reads content
// immediately after either tag as inline phrasing, which cannot carry a hard line break in
// MDX's paragraph model). <code> is dropped and <pre>'s content moved to the following line —
// the one part of this that changes nothing visible, since the HTML spec requires browsers to
// ignore exactly one newline straight after a <pre> start tag.
test('unwrapPreCode drops <code> and moves a multi-line <pre> block onto the next line', () => {
  assert.equal(
    unwrapPreCode('<pre><code>a\nb\n<strong>c</strong>\n</code></pre>'),
    '<pre>\na\nb\n<strong>c</strong>\n\n</pre>'
  );
});

// The corpus's one <strong> here has a newline inside it too — right before its own closing
// tag, with nothing else following. That is the exact shape progress-bar-message.md has, and
// is also unparseable by MDX, so it is joined onto one line along with the <pre> fix.
test('unwrapPreCode joins a <strong> whose closing tag is a trailing newline away', () => {
  assert.equal(
    unwrapPreCode('<pre><code>a\nb\n<strong>c\n</strong></code></pre>'),
    '<pre>\na\nb\n<strong>c</strong>\n</pre>'
  );
});

test('unwrapPreCode throws when a <strong> holds a real line break, not a trailing one', () => {
  assert.throws(
    () => unwrapPreCode('<pre><code>a\n<strong>b\nc</strong>\n</code></pre>'),
    /unwrapPreCode: <strong> spans more than one content line/
  );
});

test('unwrapPreCode leaves a single-line <pre><code> alone', () => {
  const input = '<pre><code>one line</code></pre>';
  assert.equal(unwrapPreCode(input), input);
});

// using-jmespath-expressions.md's tables carry <pre> blocks in two shapes this function must
// not touch: attributed ones (<pre class="language-json">), and bare ones that still sit
// inline after other table markup on the same line (…Output:</p><pre><code>TRK-7788). Both stay
// .md today, so unwrapPreCode is never called on that file — but if it ever were (a later sync
// promotes it to .mdx), reflowing either shape the same way this function reflows a genuine
// standalone block would insert a blank line inside a <td> and corrupt the table. Both must
// throw rather than being silently left as unrewritten multi-line raw HTML, since either shape
// is unparseable by MDX regardless and a silent pass-through would only defer the failure to a
// build error that doesn't name the real cause.
test('unwrapPreCode throws on an attributed <pre>, the shape it does not recognise', () => {
  const input = '<pre class="language-json"><code class="lang-json">a\nb</code></pre>';
  assert.throws(
    () => unwrapPreCode(input),
    /unwrapPreCode: <pre> block has an unrecognised shape/
  );
});

test('unwrapPreCode throws on a bare <pre> that does not start its own line', () => {
  const input = '<td><p>Output:</p><pre><code>a\nb</code></pre></td>';
  assert.throws(
    () => unwrapPreCode(input),
    /unwrapPreCode: <pre> block has an unrecognised shape/
  );
});

test('unwrapPreCode fixes a bare <pre> that starts a line even with other lines before it', () => {
  const input = 'Some prose above.\n<pre><code>a\nb</code></pre>';
  assert.equal(unwrapPreCode(input), 'Some prose above.\n<pre>\na\nb\n</pre>');
});

test('unwrapPreCode leaves a <pre> inside a fence as literal text', () => {
  const input = '```html\n<pre><code>a\nb</code></pre>\n```';
  assert.equal(unwrapPreCode(input), input);
});
