/**
 * Converts raw HTML images to markdown image syntax so astro:assets can optimise them.
 *
 * Raw <img> in markdown bypasses Astro's image pipeline entirely, which would ship 541 MB of
 * screenshots unoptimised. This is the highest-value transformation in the migration.
 *
 * Paths are emitted root-absolute. Assets do not reach src/assets/ until Phase 3, and Astro
 * treats an unresolvable *relative* image path as a fatal build error, whereas a leading "/"
 * is read as a public/ path and left alone. assets.mjs rewrites these in Phase 3.
 */
import { protectCode } from './segments.mjs';

const NEEDS_ANGLE = /[ ()]/;
const FIGURE = /<figure>\s*<img\s+([^>]*?)>\s*(?:<figcaption>([\s\S]*?)<\/figcaption>)?\s*<\/figure>/g;
const BARE_IMG = /<img\s+([^>]*?)>/g;
const ASSET_IMAGE = /!\[([^\]]*)\]\((<[^>]*>|[^)]*(?:\([^)]*\)[^)]*)*)\)/g;

/** Rewrites any .gitbook/assets reference to its root-absolute form. Remote URLs pass through. */
export function assetPath(src) {
  if (/^https?:/i.test(src)) return src;
  const match = src.match(/\.gitbook\/assets\/(.*)$/);
  return match ? `/.gitbook/assets/${match[1]}` : src;
}

/** Renders a markdown image, bracketing the path only when it would break link parsing. */
function image(alt, src) {
  const path = assetPath(src);
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
 */
export function convertFigures(text) {
  return protectCode(text, (masked) => {
    const converted = masked
      .replace(FIGURE, (_, attrs, caption) => {
        const src = attrs.match(/src="([^"]*)"/)?.[1] ?? '';
        const alt = attrs.match(/alt="([^"]*)"/)?.[1] ?? '';
        const cap = captionText(caption);
        return cap ? `${image(alt, src)}\n\n*${cap}*` : image(alt, src);
      })
      .replace(BARE_IMG, (whole, attrs) => {
        const src = attrs.match(/src="([^"]*)"/)?.[1];
        if (!src) throw new Error(`convertFigures: <img> with no src attribute: ${whole}`);
        return image(attrs.match(/alt="([^"]*)"/)?.[1] ?? '', src);
      });
    if (converted.includes('<figure') || converted.includes('<figcaption')) {
      throw new Error('convertFigures: a <figure> block did not match the expected one-image shape');
    }
    return converted;
  });
}

/** Normalises the paths of markdown images that were already in the source. */
export function rewriteAssetRefs(text) {
  return protectCode(text, (masked) =>
    masked.replace(ASSET_IMAGE, (whole, alt, dest) => {
      const src = dest.startsWith('<') ? dest.slice(1, -1) : dest;
      if (!/\.gitbook\/assets\//.test(src)) return whole;
      return image(alt, src);
    })
  );
}
