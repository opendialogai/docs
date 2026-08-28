/**
 * Finds the images that ship with no text alternative, and the caption each one already has.
 *
 * Reads the authored content under src/content/docs/, which is the source of truth and the
 * thing actually built: a work list drawn from anywhere else describes a site that is not
 * being served. The rows name what a writer edits — the `~/assets/…` filename and the
 * caption already beneath the image — not a hashed build artefact.
 *
 * Deriving alt from the caption was considered and rejected: most of these already sit under
 * a caption that is announced, so copying it into alt makes a screen reader read the same
 * sentence twice, and the ones with no caption — the images announced as nothing at all —
 * would still have nothing. Alt must say what the image shows; the caption labels it.
 */
import { protectCode } from './segments.mjs';

/** A markdown image: `![alt](destination)`, destination possibly carrying a title. */
const CONTENT_IMAGE = /!\[([^\]]*)\]\(([^)]*)\)/g;
/** The bare filename an `~/assets/…` reference names, ignoring any title after the path. */
const ASSET = /^~\/assets\/(\S+)/;

/**
 * What to call the image in the work list: the bare filename for a local asset, the URL for
 * one still hotlinked from a third party. Markdown's backslash escapes are undone so the
 * name matches what the page actually requests.
 */
function assetName(destination) {
  const target = destination.trim().replace(/^<|>$/g, '').split(/\s+/)[0];
  if (!target) return null;
  const local = target.match(ASSET);
  return (local ? local[1] : target).replace(/\\([_*()[\]\-.])/g, '$1');
}

/** A paragraph whose sole content is emphasis, which is how a caption reaches the build. */
const EMPHASIS_ONLY = /^_([^_]+)_$|^\*([^*]+)\*$/;

/** The caption a block carries, or '' when it is not a caption paragraph. */
function captionOf(block) {
  const emphasis = block.match(EMPHASIS_ONLY);
  return emphasis ? (emphasis[1] ?? emphasis[2]) : '';
}

/** Every image in an authored page that ships with an empty alt, in document order. */
export function emptyAltImages(text) {
  const found = [];
  // A fence masks to a single token line, which leaves the blank-line structure the caption
  // pairing reads intact while taking example markup out of the count.
  protectCode(text, (masked) => {
    collect(masked, found);
    return masked;
  });
  return found;
}

function collect(text, found) {
  const blocks = text.split(/\n\s*\n/).map((block) => block.trim());
  blocks.forEach((block, index) => {
    const images = [...block.matchAll(CONTENT_IMAGE)];
    // Only an image standing alone in its paragraph is paired with the caption beneath it,
    // the same inference rehype-figures makes.
    const alone = images.length === 1 && block === images[0][0];
    const caption = alone ? captionOf(blocks[index + 1] ?? '') : '';
    for (const [, alt, destination] of images) {
      if (alt) continue;
      const asset = assetName(destination);
      if (asset) found.push({ asset, caption });
    }
  });
}
