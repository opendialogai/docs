/**
 * Decides what each asset is called and how it is encoded. Pure: no filesystem, no decoding.
 *
 * Kept separate from assets.mjs so every naming and treatment decision is unit-testable
 * without an image on disk.
 */

/** Width ceiling. Images are never enlarged. */
export const MAX_WIDTH = 2000;

/**
 * Palette quantisation is applied only at or below this many unique colours in the resized
 * image. Photographs and gradients band visibly at 256 colours; flat UI screenshots do not.
 * Measured across the 505 referenced PNG/JPEG files: p50 5,643, p95 17,549, max 454,752.
 *
 * The count must be taken on the resized image. Unique colours scale with pixel count, so a
 * threshold calibrated on a downsample admits far more images than intended.
 */
export const QUANTISE_MAX_COLOURS = 32768;

/** A GIF at or above this size becomes an MP4. The two small corpus GIFs sit far below it. */
export const GIF_VIDEO_THRESHOLD = 1024 * 1024;

const STILL = /\.(?:png|jpe?g|webp)$/i;
const GIF = /\.gif$/i;

/** Filesystem-safe, URL-safe name: lowercase, single hyphens, original extension. */
export function slugify(filename) {
  const dot = filename.lastIndexOf('.');
  const stem = dot > 0 ? filename.slice(0, dot) : filename;
  const ext = dot > 0 ? filename.slice(dot).toLowerCase() : '';
  const slug = stem
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!slug) throw new Error(`asset name slugifies to nothing: ${filename}`);
  return `${slug}${ext}`;
}

/**
 * Maps every original filename to a unique slug.
 *
 * Input is sorted internally so a collision suffix depends on the names alone, never on the
 * order the caller happened to read the directory in — the run must be reproducible.
 */
export function assignSlugs(filenames) {
  const taken = new Set();
  const result = new Map();
  for (const filename of [...filenames].sort()) {
    const base = slugify(filename);
    let slug = base;
    if (taken.has(slug)) {
      const dot = base.lastIndexOf('.');
      const stem = dot > 0 ? base.slice(0, dot) : base;
      const ext = dot > 0 ? base.slice(dot) : '';
      let n = 2;
      while (taken.has(`${stem}-${n}${ext}`)) n++;
      slug = `${stem}-${n}${ext}`;
    }
    taken.add(slug);
    result.set(filename, slug);
  }
  return result;
}

/** Where an asset goes and how it is encoded. `colours` is null for anything not a still image. */
export function planAsset({ filename, bytes, colours }) {
  if (STILL.test(filename)) {
    if (colours === null || colours === undefined) {
      throw new Error(`planAsset: still image needs a colour count: ${filename}`);
    }
    return {
      kind: 'image',
      destination: 'src/assets',
      treatment: colours <= QUANTISE_MAX_COLOURS ? 'resize-quantise' : 'resize-only',
    };
  }
  if (GIF.test(filename)) {
    if (!Number.isFinite(bytes) || bytes < 0) {
      throw new Error(`planAsset: gif needs a valid byte count: ${filename}`);
    }
    return bytes >= GIF_VIDEO_THRESHOLD
      ? { kind: 'video', destination: 'public/media', treatment: 'encode-video' }
      : { kind: 'image', destination: 'src/assets', treatment: 'copy' };
  }
  return { kind: 'file', destination: 'public/files', treatment: 'copy' };
}
