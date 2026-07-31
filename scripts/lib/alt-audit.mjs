/**
 * Finds the images that ship with no text alternative, and the caption each one already has.
 *
 * Read from source/ rather than from the build because the fix belongs in GitBook: alt text
 * written there rides back through convert.mjs on the next sync, while anything written into
 * src/content/docs/ is destroyed by the next run. The rows therefore name what a writer sees
 * in GitBook — the asset filename and the caption — not a hashed build artefact.
 *
 * Deriving alt from the caption was considered and rejected: 303 of the 455 already sit in a
 * <figure> whose <figcaption> is announced, so copying it into alt makes a screen reader read
 * the same sentence twice, and the 152 with no caption — 123 of them full screenshots — would
 * still have nothing.
 */
import { protectCode } from './segments.mjs';
import { ASSET_SRC, unescapeAssetName } from './asset-refs.mjs';
import { ASSET_IMAGE, FIGURE, captionText } from './figures.mjs';

const BARE_IMG = /<img\s+([^>]*?)>/g;

/** The bare GitBook asset filename a reference names, or null when it is not one. */
function assetName(src) {
  const clean = src.trim().replace(/^<|>$/g, '');
  const match = clean.match(ASSET_SRC);
  return match ? unescapeAssetName(match[1]) : null;
}

const altOf = (attrs) => attrs.match(/alt="([^"]*)"/)?.[1] ?? '';
const srcOf = (attrs) => attrs.match(/src="([^"]*)"/)?.[1] ?? '';

/**
 * Every image in a source file that would ship with an empty alt, in document order.
 *
 * Figures are consumed first so their <img> is not counted twice by the bare-image pass, the
 * same ordering convertFigures relies on.
 */
export function emptyAltImages(text) {
  const found = [];
  const record = (src, caption) => {
    const asset = assetName(src);
    if (asset) found.push({ asset, caption });
  };
  protectCode(text, (masked) => {
    const withoutFigures = masked.replace(FIGURE, (_, attrs, caption) => {
      if (!altOf(attrs)) record(srcOf(attrs), captionText(caption));
      return '';
    });
    for (const [, attrs] of withoutFigures.matchAll(BARE_IMG)) {
      if (!altOf(attrs)) record(srcOf(attrs), '');
    }
    for (const [, alt, destination] of withoutFigures.matchAll(ASSET_IMAGE)) {
      if (!alt) record(destination, '');
    }
    return masked;
  });
  return found;
}
