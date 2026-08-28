/**
 * Normalises markdown for MDX output, where raw HTML is parsed as JSX.
 *
 * Applied only to the 46 files promoted to .mdx. Escaping bare braces is output encoding for
 * the target format, not a prose edit: MDX renders "\{" as a literal "{", which is what
 * GitBook shows today for the lines carrying { attribute } template syntax.
 */
import { protectCode } from './segments.mjs';

const VOID = ['br', 'hr', 'img', 'input', 'meta', 'link', 'source', 'area', 'col', 'embed'];
// A quoted attribute value is matched as one whole unit rather than "anything but >", so a
// literal ">" inside a title or an href — a Card title, a query string — can never be
// mistaken for the tag's own closing delimiter. Without this a truncated match would expose
// the rest of the real tag (including any brace in it) to brace-escaping as if it were prose.
const ATTRS = `(?:"[^"]*"|'[^']*'|[^>"'])*`;
const VOID_TAG = new RegExp(`<(${VOID.join('|')})\\b(${ATTRS})(?<!/)>`, 'gi');
// The tag name must be immediately followed by whitespace, "/" or ">" — the boundary a real
// HTML/JSX tag name always has. Without that lookahead this would also match a CommonMark
// autolink such as "<https://…>" (Task 6 and links.mjs both emit these, and one — a non-video
// embed — reaches this pass in a real page): "https" reads as a tag name but is immediately
// followed by ":", which no element name is, so the lookahead correctly rejects it and leaves
// the autolink as ordinary text for brace-escaping to see.
const TAG = new RegExp(`<\\/?[A-Za-z][A-Za-z0-9]*(?=[\\s/>])${ATTRS}>`, 'g');
// Tags are stashed behind a U+0001 delimiter, distinct from the U+0000 protectCode uses, so
// the two maskings nest without colliding. The GitBook export is plain prose and code, so
// neither token occurs naturally in it: confirmed across every source markdown file.
const TAG_TOKEN = '\u0001';

/** Converts a CSS declaration list to a JSX style object literal. */
function styleObject(css) {
  const entries = css
    .split(';')
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => {
      const index = d.indexOf(':');
      if (index === -1) throw new Error(`normaliseForMdx: style declaration has no ":": "${d}"`);
      const property = d.slice(0, index).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      return `${property}: '${d.slice(index + 1).trim().replace(/'/g, "\\'")}'`;
    });
  return entries.length ? `{{ ${entries.join(', ')} }}` : '{{}}';
}

const ANY_PRE = /<pre\b[^>]*>[\s\S]*?<\/pre>/g;
const BARE_PRE_CODE = /^<pre><code>([\s\S]*)<\/code><\/pre>$/;
const STRONG = /<strong>([\s\S]*?)<\/strong>/g;

/**
 * Rewrites a multi-line `<pre><code>…</code></pre>` block into a bare `<pre>…</pre>` with its
 * content starting on the line after the opening tag, and joins a `<strong>` inside it back
 * onto one line.
 *
 * MDX cannot parse this pair across multiple lines at all — even with no nested tag, content
 * immediately following `<pre>` or `<code>` on the same line is read as inline phrasing content,
 * and phrasing content in MDX's paragraph model cannot carry a hard line break the way
 * CommonMark's raw-HTML-block rule would allow (MDX does not apply that rule to tags it reads
 * as JSX). The same is true of a `<strong>` whose open and close land on different lines.
 *
 * Neither change is visible: moving `<pre>`'s content onto its own line costs nothing because
 * the HTML spec requires browsers to ignore exactly one newline immediately after a `<pre>`
 * start tag (`<code>` has no such rule, so it is dropped rather than given the same treatment —
 * its monospacing is redundant with `<pre>`'s own); and the corpus's one `<strong>` here has
 * nothing following its internal newline but the closing tag, so that newline is a trailing
 * artifact rather than a separating line break. A `<strong>` with a real line break in the
 * middle of its text throws rather than being silently joined into one run-on line.
 *
 * The recognised shape is narrow on purpose: a `<pre>` that both starts its own line (its
 * opening tag is not preceded by other content on that line) and is bare — no attributes on
 * either `<pre>` or `<code>`. using-jmespath-expressions.md's tables hold `<pre>` blocks that
 * fail both tests — some carry `class="language-json"`, and even the ones that don't (the
 * "Output:" results) sit inline after other markup in the same `<td>`, e.g.
 * `...Output:</p><pre><code>TRK-7788`. Reflowing one of those the same way would insert a
 * blank line inside the table cell and terminate its HTML block early, corrupting the table —
 * confirmed by running this function against that file directly. That file is plain .md today,
 * so this function is never called on it, but a `<pre>` this narrow test rejects throws rather
 * than being silently left as multi-line raw HTML: if a later GitBook sync ever promotes that
 * page to .mdx (a video embed, a content-ref), the mismatch surfaces at conversion time instead
 * of corrupting the page silently.
 */
export function unwrapPreCode(text) {
  return protectCode(text, (masked) => {
    let out = '';
    let cursor = 0;
    for (const match of masked.matchAll(ANY_PRE)) {
      const whole = match[0];
      if (!whole.includes('\n')) continue; // single line: nothing to fix

      const startsLine = match.index === 0 || masked[match.index - 1] === '\n';
      const bare = whole.match(BARE_PRE_CODE);
      if (!startsLine || !bare) {
        throw new Error(
          `unwrapPreCode: <pre> block has an unrecognised shape it cannot safely rewrite for MDX: ${whole.slice(0, 60)}…`
        );
      }

      const joined = bare[1].replace(STRONG, (strongWhole, strongInner) => {
        const trimmed = strongInner.replace(/\n+$/, '');
        if (trimmed.includes('\n')) {
          throw new Error(`unwrapPreCode: <strong> spans more than one content line: ${strongWhole}`);
        }
        return `<strong>${trimmed}</strong>`;
      });

      out += masked.slice(cursor, match.index) + `<pre>\n${joined}\n</pre>`;
      cursor = match.index + whole.length;
    }
    return out + masked.slice(cursor);
  });
}

export function normaliseForMdx(text) {
  return protectCode(text, (masked) => {
    // Tags are stashed before brace escaping so attributes — including the style objects
    // produced here — are never treated as prose.
    const tags = [];
    const withTags = masked
      .replace(VOID_TAG, (_, name, attrs) => `<${name}${attrs.trimEnd()} />`)
      .replace(TAG, (tag) => {
        // Anchored on the whitespace that always precedes a real attribute name (the TAG
        // lookahead guarantees at least one such space before the first attribute). Matching
        // "class="/"style=" as a bare substring instead — as opposed to an attribute name in
        // attribute position — would also fire inside data-class="x" and inside a query
        // string like href="/y?class=header", renaming or corrupting them.
        const normalised = tag
          .replace(/(\s)class=/g, '$1className=')
          .replace(/(\s)style="([^"]*)"/g, (_, ws, css) => `${ws}style=${styleObject(css)}`);
        return `${TAG_TOKEN}${tags.push(normalised) - 1}${TAG_TOKEN}`;
      });

    const escaped = withTags.replace(/[{}]/g, (brace) => `\\${brace}`);

    return escaped.replace(
      new RegExp(`${TAG_TOKEN}(\\d+)${TAG_TOKEN}`, 'g'),
      (_, index) => tags[Number(index)]
    );
  });
}
