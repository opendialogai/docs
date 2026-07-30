/**
 * Converts raw HTML images to markdown image syntax so astro:assets can optimise them.
 *
 * Raw <img> in markdown bypasses Astro's image pipeline entirely, which would ship 541 MB of
 * screenshots unoptimised. This is the highest-value transformation in the migration.
 *
 * Paths resolve through asset-map.json, written by assets.mjs, which maps each original
 * .gitbook/assets filename to where the physical file ended up. Without that map — a checkout
 * where assets.mjs has never run — a root-absolute placeholder is emitted instead, so the build
 * stays green: Astro treats an unresolvable *relative* image path as a fatal build error,
 * whereas a leading "/" is read as a public/ path and left alone.
 */
import { protectCode } from './segments.mjs';

export const NEEDS_ANGLE = /[ ()]/;
const FIGURE = /<figure>\s*<img\s+([^>]*?)>\s*(?:<figcaption>([\s\S]*?)<\/figcaption>)?\s*<\/figure>/g;
const BARE_IMG = /<img\s+([^>]*?)>/g;
const ASSET_IMAGE = /!\[([^\]]*)\]\((<[^>]*>|[^)]*(?:\([^)]*\)[^)]*)*)\)/g;
const ASSET_SRC = /\.gitbook\/assets\/(.*)$/;

/** Unescapes a captured .gitbook/assets path segment into the bare filename it names. */
function unescapeAssetName(raw) {
  return decodeURIComponent(raw.replace(/\\([_()*[\]\-.])/g, '$1'));
}

/** The bare, unescaped filename a .gitbook/assets reference names, or null if it is not one. */
function assetName(src) {
  const match = src.match(ASSET_SRC);
  return match ? unescapeAssetName(match[1]) : null;
}

/**
 * Resolves a .gitbook/assets reference to its final form.
 *
 * With an asset map, returns what assets.mjs produced. Without one — a checkout where Phase 3
 * has never run — returns the root-absolute placeholder, so the build stays green. A reference
 * absent from a map that does exist is a real inconsistency between the two generators and
 * throws.
 */
export function assetPath(src, assets) {
  if (/^https?:/i.test(src)) return src;
  const match = src.match(ASSET_SRC);
  if (!match) return src;
  if (!assets) return `/.gitbook/assets/${match[1]}`;
  const name = unescapeAssetName(match[1]);
  const entry = assets[name];
  if (!entry) throw new Error(`asset not in asset-map.json: ${name}`);
  return entry.reference;
}

/** Renders an asset reference: an image, or a video element for an asset that became one. */
function image(alt, src, assets) {
  const entry = assets ? assets[assetName(src)] : null;
  const path = assetPath(src, assets);
  if (entry?.kind === 'video') {
    return `<video autoplay loop muted playsinline src="${path}"></video>`;
  }
  return `![${alt}](${NEEDS_ANGLE.test(path) ? `<${path}>` : path})`;
}

/** Plain-text form of a <figcaption>, keeping <code> spans as backticks since GitBook's export
 * uses them to mark an attribute name inline; every other tag carries no information the
 * italic caption needs. */
function captionText(caption) {
  return (caption ?? '')
    .replace(/<code>([\s\S]*?)<\/code>/g, '`$1`')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Converts <figure> blocks and bare <img> tags to markdown images.
 *
 * The corpus holds 430 <figure> blocks, every one wrapping exactly one <img> and one
 * <figcaption> (empty or not), plus 6 bare <img> tags outside any figure. A <figure> with a
 * different shape — no <img>, more than one, malformed nesting — would leave literal <figure>
 * markup in the output, silently shipping broken HTML into a published page, so that shape is
 * rejected rather than degraded. Likewise an <img> with no src attribute never occurs in the
 * corpus; rather than passing an untouched, unoptimised <img> through, that is also rejected.
 *
 * A captioned figure's leading whitespace carries onto its caption line too. The <img> itself
 * inherits the indentation of the line it sits on because FIGURE is replaced in place, but the
 * appended caption line does not unless it is given the same indent explicitly — and 2 of the
 * 430 figures sit inside a list item (troubleshooting-interpreters.md, about-attributes.md),
 * where a column-0 caption line closes the enclosing list at that point in the document.
 */
export function convertFigures(text, ctx) {
  const assets = ctx?.assets ?? null;
  return protectCode(text, (masked) => {
    const converted = masked
      .replace(FIGURE, (_, attrs, caption, offset, full) => {
        const lineStart = full.lastIndexOf('\n', offset - 1) + 1;
        const before = full.slice(lineStart, offset);
        const indent = /^[ \t]*$/.test(before) ? before : '';
        const src = attrs.match(/src="([^"]*)"/)?.[1] ?? '';
        const alt = attrs.match(/alt="([^"]*)"/)?.[1] ?? '';
        const cap = captionText(caption);
        return cap
          ? `${image(alt, src, assets)}\n\n${indent}*${cap}*`
          : image(alt, src, assets);
      })
      .replace(BARE_IMG, (whole, attrs) => {
        const src = attrs.match(/src="([^"]*)"/)?.[1];
        if (!src) throw new Error(`convertFigures: <img> with no src attribute: ${whole}`);
        return image(attrs.match(/alt="([^"]*)"/)?.[1] ?? '', src, assets);
      });
    if (converted.includes('<figure') || converted.includes('<figcaption')) {
      throw new Error('convertFigures: a <figure> block did not match the expected one-image shape');
    }
    return converted;
  });
}

const IMAGE_DIV = /<div\b[^>]*>([\s\S]*?)<\/div>/g;
const IMAGE_DIV_CONTENT = /^(?:\s|<figure>[\s\S]*?<\/figure>|<img\b[^>]*>)*$/;
const IMAGE_DIV_ITEM = /<figure>[\s\S]*?<\/figure>|<img\b[^>]*>/g;

/**
 * Reflows GitBook's alignment <div> wrapper so each <figure>/<img> inside it sits on its own
 * line, blank-line-separated from its opening tag, its siblings, and the closing tag.
 *
 * Left as GitBook wrote it — every figure jammed onto one line with its siblings, or split
 * across lines with no blank line before the div's own closing tag — this is unparseable:
 * MDX treats a bare HTML block as ending at the first blank line, so a multi-line one is never
 * actually closed as far as its parser is concerned, and a single-line one leaves consecutive
 * figures glued together, which convertFigures (run after this) then turns into
 * "*caption one* ![](image two)" — each caption sitting beside the next image rather than its
 * own.
 *
 * The wrapper itself is kept, not stripped: its `align`/`data-full-width` attributes are real
 * GitBook layout instructions (3 of the 10 wrappers in the corpus centre their image), and a
 * blank line on each side of a JSX/HTML tag is valid in both CommonMark and MDX, so reflowing
 * fixes the parse problem without losing that.
 *
 * Throws when a div's content is anything other than figures, bare images and whitespace, so
 * a div wrapping real prose is never silently dropped.
 */
export function reflowImageDiv(text) {
  return protectCode(text, (masked) =>
    masked.replace(IMAGE_DIV, (whole, inner) => {
      if (!IMAGE_DIV_CONTENT.test(inner)) {
        throw new Error(`reflowImageDiv: <div> holds more than figures/images: ${whole.slice(0, 80)}`);
      }
      const openTag = whole.match(/^<div\b[^>]*>/)[0];
      const items = inner.match(IMAGE_DIV_ITEM) ?? [];
      return [openTag, ...items, '</div>'].join('\n\n');
    })
  );
}

/** Normalises the paths of markdown images that were already in the source. */
export function rewriteAssetRefs(text, ctx) {
  const assets = ctx?.assets ?? null;
  return protectCode(text, (masked) =>
    masked.replace(ASSET_IMAGE, (whole, alt, dest) => {
      const src = dest.startsWith('<') ? dest.slice(1, -1) : dest;
      if (!/\.gitbook\/assets\//.test(src)) return whole;
      return image(alt, src, assets);
    })
  );
}
