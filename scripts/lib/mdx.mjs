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
