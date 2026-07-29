/**
 * Emits Starlight <LinkCard> markup from the two GitBook constructs that render as cards.
 *
 * Both need route-map.json: a content-ref's inner link text is a raw filename, and GitBook
 * substitutes the target page's title at render time.
 */
import { mapLines } from './segments.mjs';
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

/** Converts {% content-ref %} blocks to <LinkCard>. */
export function convertContentRefs(text, ctx) {
  let url = null;
  return mapLines(text, (line) => {
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
    return [];
  });
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
 * Converts <table data-view="cards"> to a CardGrid of LinkCards.
 *
 * Attribute order varies — one of the eight reads data-card-size first — so the detector is
 * order independent.
 *
 * Title is the first non-empty cell's text (not necessarily an anchor: some rows carry the
 * title as a bare <strong> and the link only in the hidden data-card-target column).
 * Description is the next non-empty cell that is not itself a bare link — a description may
 * legitimately contain an inline link (e.g. "using <a>message types</a> to their fullest
 * potential"), so "no <a> at all" is too strict a test; "is the whole cell just one <a>" is
 * what actually distinguishes a link cell (title/target/cover) from prose.
 *
 * The href is the first non-image link found in any cell other than the description cell,
 * which is what keeps an inline link inside the description from being mistaken for the
 * card's real target. data-card-cover images have no LinkCard equivalent and are skipped as
 * href candidates; countDroppedCovers reports them so Phase 3 does not delete those assets as
 * orphans. Rows with no link anywhere (a purely informational row, as in one real table used
 * as a reference glossary) are skipped rather than emitted with a fabricated href.
 */
export function convertCardTables(text, ctx) {
  return text.replace(CARD_TABLE, (table) => {
    const cards = [];
    for (const row of rows(table)) {
      const cell = cells(row);
      const nonEmpty = cell
        .map((c, i) => ({ index: i, text: plainText(c) }))
        .filter((c) => c.text !== '');
      if (nonEmpty.length === 0) continue;
      const title = nonEmpty[0];
      const description = nonEmpty.slice(1).find((c) => !isPureAnchor(cell[c.index]));

      const hrefCandidates = cell
        .map((c, i) => ({ index: i, href: firstHref(c) }))
        .filter((c) => c.href !== null && c.index !== description?.index)
        .map((c) => c.href);
      const target = hrefCandidates.find((href) => !IMAGE_EXTENSION.test(href));
      if (!target) continue;

      cards.push(
        linkCard({
          title: title.text,
          description: description?.text,
          href: hrefFor(target, ctx),
        })
      );
    }
    if (cards.length === 0) return table;
    return ['<CardGrid>', ...cards.map((c) => `  ${c}`), '</CardGrid>'].join('\n');
  });
}

/** Counts data-card-cover image references lost in conversion, for the Phase 3 handoff. */
export function countDroppedCovers(text) {
  let total = 0;
  for (const [table] of text.matchAll(CARD_TABLE)) {
    if (!/data-card-cover/.test(table)) continue;
    total += [...table.matchAll(/<a href="[^"]*\.(?:png|jpe?g|gif|svg|webp)"/gi)].length;
  }
  return total;
}
