/**
 * Emits Starlight <LinkCard> and <Card> markup from the two GitBook constructs that render
 * as cards.
 *
 * Both need route-map.json: a content-ref's inner link text is a raw filename, and GitBook
 * substitutes the target page's title at render time.
 */
import { mapLines, protectCode } from './segments.mjs';
import { resolveSource } from './links.mjs';

/** Escapes a value for use inside a double-quoted JSX attribute. */
function attribute(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/** Builds one LinkCard element. `description` is omitted when absent. */
function linkCard({ title, description, href }) {
  const parts = [`title="${attribute(title)}"`];
  if (description) parts.push(`description="${attribute(description)}"`);
  parts.push(`href="${href}"`);
  return `<LinkCard ${parts.join(' ')} />`;
}

/**
 * Builds one Card element for a row with no link target. `body` paragraphs become the
 * element's children rather than an attribute, since Card (unlike LinkCard) has no
 * `description` prop — GitBook still renders these rows, just without a click target.
 */
function card({ title, body }) {
  if (body.length === 0) return `<Card title="${attribute(title)}" />`;
  const children = body.map((paragraph) => `  ${paragraph}`).join('\n\n');
  return [`<Card title="${attribute(title)}">`, children, '</Card>'].join('\n');
}

/** Indents every non-blank line of a (possibly multi-line) card element by one level. */
function indent(block) {
  return block
    .split('\n')
    .map((line) => (line === '' ? '' : `  ${line}`))
    .join('\n');
}

/**
 * Resolves a card href, leaving /broken/pages/ and external URLs as they are.
 *
 * Preserves any #anchor fragment, matching rewriteLinks in links.mjs — resolveSource strips
 * the anchor only to test resolvability, so it must be re-appended to the resolved route.
 */
function hrefFor(target, { source, routes }) {
  const resolved = resolveSource(source, target);
  if (resolved === null) return target;
  const route = routes.get(resolved);
  if (!route) throw new Error(`${source}: card target does not resolve: ${target} -> ${resolved}`);
  const anchor = target.includes('#') ? target.slice(target.indexOf('#')) : '';
  return `${route.url}${anchor}`;
}

const CONTENT_REF_INNER_LINK = /^\[[^\]]*\]\([^)]*\)$/;

/**
 * Converts {% content-ref %} blocks to <LinkCard>.
 *
 * Every line between the opening marker and {% endcontent-ref %} is discarded but for that
 * closing marker itself — the corpus's inner line is always a raw "[filename](filename)" link,
 * whose title comes from route-map.json instead. Both throw-guards below exist so that shape
 * stays true rather than assumed: an unterminated block would otherwise discard every line to
 * the end of the file with no error, and an inner line that is not blank or a bare link would
 * otherwise vanish just as silently.
 */
export function convertContentRefs(text, ctx) {
  let url = null;
  const out = mapLines(text, (line) => {
    const open = line.match(/^[ \t]*\{%\s*content-ref\s+url="([^"]+)"\s*%\}[ \t]*$/);
    if (open) {
      url = open[1];
      return [];
    }
    if (url === null) return line;
    if (/^[ \t]*\{%\s*endcontent-ref\s*%\}[ \t]*$/.test(line)) {
      const target = url;
      url = null;
      const resolved = resolveSource(ctx.source, target);
      const meta = resolved ? ctx.titles.get(resolved) : null;
      if (!meta) throw new Error(`${ctx.source}: content-ref has no title for ${target}`);
      return [linkCard({ ...meta, href: hrefFor(target, ctx) })];
    }
    // The inner "[filename](filename)" line is discarded; the title comes from route-map.
    if (line.trim() !== '' && !CONTENT_REF_INNER_LINK.test(line.trim())) {
      throw new Error(`${ctx.source}: content-ref for ${url} holds an unrecognised inner line: ${line}`);
    }
    return [];
  });
  if (url !== null) {
    throw new Error(`${ctx.source}: content-ref for ${url} is missing {% endcontent-ref %}`);
  }
  return out;
}

/** Returns the row elements of a card-table's tbody. */
function rows(table) {
  const body = table.match(/<tbody>([\s\S]*?)<\/tbody>/);
  return body ? [...body[1].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((m) => m[1]) : [];
}

/** Returns the cell contents of one row. */
function cells(row) {
  return [...row.matchAll(/<td>([\s\S]*?)<\/td>/g)].map((m) => m[1]);
}

/** Strips tags and collapses whitespace, for card titles and descriptions. */
function plainText(html) {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

/** True when a cell's entire content is a single anchor, marking it as a link cell rather than prose. */
function isPureAnchor(cell) {
  return /^<a\b[^>]*>[\s\S]*<\/a>$/.test(cell.trim());
}

/** The href of the first anchor in a cell, or null when the cell has none. */
function firstHref(cell) {
  const match = cell.match(/<a href="([^"]*)"/);
  return match ? match[1] : null;
}

const IMAGE_EXTENSION = /\.(?:png|jpe?g|gif|svg|webp)$/i;

const CARD_TABLE = /<table(?=[^>]*\bdata-view="cards")[^>]*>[\s\S]*?<\/table>/g;

/**
 * Converts <table data-view="cards"> to a CardGrid of LinkCards and Cards.
 *
 * Attribute order varies — one of the eight reads data-card-size first — so the detector is
 * order independent.
 *
 * GitBook renders every row of a cards-view table as a card; only rows with a resolvable link
 * target are clickable. Every row here becomes an element: <LinkCard> when it has one,
 * <Card> — title plus body, no href — when it does not. One real table (a reference glossary
 * of condition operators) has no link in any of its 22 rows; two rows of another have a title
 * and body but no target. Dropping those would silently delete real documentation prose.
 *
 * Title is the first non-empty cell's text (not necessarily an anchor: some rows carry the
 * title as a bare <strong> and the link only in the hidden data-card-target column).
 * The remaining non-empty cells that are not themselves a bare link — a description may
 * legitimately contain an inline link (e.g. "using <a>message types</a> to their fullest
 * potential"), so "no <a> at all" is too strict a test; "is the whole cell just one <a>" is
 * what actually distinguishes a link cell (title/target/cover) from prose — become the card's
 * body: a single `description` attribute for LinkCard, or one paragraph per cell as Card's
 * children when a row has more than one (e.g. two rows of quick-start-ai-agents carry both a
 * summary and a "how to start" cell; both must survive). LinkCard has no slot for a second
 * body cell — a targeted row with more than one throws rather than silently dropping the
 * extra prose, the same principle that makes an unlinked row become a Card instead of being
 * skipped.
 *
 * The href is the first non-image link found in any cell other than the body cells, which is
 * what keeps an inline link inside a description from being mistaken for the card's real
 * target. data-card-cover images have no LinkCard equivalent and are skipped as href
 * candidates; countDroppedCovers reports them so Phase 3 does not delete those assets as
 * orphans.
 *
 * Run under protectCode so a card-table shown as a code sample inside a fence is left as literal
 * text rather than rewritten into JSX. No card table sits inside a fence in the corpus today, so
 * this is a latent guard, not an observed fix.
 */
export function convertCardTables(text, ctx) {
  return protectCode(text, (masked) =>
    masked.replace(CARD_TABLE, (table) => {
      const cards = [];
      for (const row of rows(table)) {
        const cell = cells(row);
        const nonEmpty = cell
          .map((c, i) => ({ index: i, text: plainText(c) }))
          .filter((c) => c.text !== '');
        if (nonEmpty.length === 0) continue;
        const title = nonEmpty[0];
        const body = nonEmpty.slice(1).filter((c) => !isPureAnchor(cell[c.index]));
        const bodyIndexes = new Set(body.map((c) => c.index));

        const hrefCandidates = cell
          .map((c, i) => ({ index: i, href: firstHref(c) }))
          .filter((c) => c.href !== null && !bodyIndexes.has(c.index))
          .map((c) => c.href);
        const target = hrefCandidates.find((href) => !IMAGE_EXTENSION.test(href));

        if (target) {
          if (body.length > 1) {
            throw new Error(
              `${ctx.source}: card "${title.text}" has a link target and ${body.length} body cells — LinkCard can only show one as its description`
            );
          }
          cards.push(linkCard({ title: title.text, description: body[0]?.text, href: hrefFor(target, ctx) }));
        } else {
          cards.push(card({ title: title.text, body: body.map((c) => c.text) }));
        }
      }
      if (cards.length === 0) {
        throw new Error('card-table has no rows with any title or body content to show');
      }
      return ['<CardGrid>', ...cards.map(indent), '</CardGrid>'].join('\n');
    })
  );
}

/**
 * Counts data-card-cover image references lost in conversion, for the Phase 3 handoff.
 *
 * Also run under protectCode, for the same reason as convertCardTables: a card-table shown as a
 * code sample inside a fence must not be counted as a real, converting table.
 */
export function countDroppedCovers(text) {
  let total = 0;
  protectCode(text, (masked) => {
    for (const [table] of masked.matchAll(CARD_TABLE)) {
      if (!/data-card-cover/.test(table)) continue;
      total += [...table.matchAll(/<a href="[^"]*\.(?:png|jpe?g|gif|svg|webp)"/gi)].length;
    }
    return masked;
  });
  return total;
}
