/**
 * Copies and encodes the referenced GitBook assets into src/assets/ and public/, slugified, and
 * records what each became in asset-map.json.
 *
 * Still images are resized to a width ceiling and, below a colour-count threshold,
 * palette-quantised; the source format is always preserved, since a `.jpg` file holding PNG bytes
 * is a content/extension mismatch. A GIF at or above GIF_VIDEO_THRESHOLD is re-encoded to MP4;
 * smaller GIFs and other files are copied unchanged. A content-hash cache skips re-encoding an
 * asset whose bytes have not changed since the last run.
 *
 * The copy set is derived from source/ alone — never from src/content/docs — because
 * convert.mjs consumes this map to emit its paths and would otherwise need itself first.
 *
 * Reproducible: output paths derive from sorted filenames, sharp's encoders are deterministic for
 * fixed parameters, ffmpeg is run with bitexact flags so it is too, and the cache keys on content
 * hash rather than mtime, so a run against the same source/ tree always produces byte-identical
 * files and an identical asset-map.json.
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

import { assetRefsInFile } from './lib/asset-refs.mjs';
import { assignSlugs, planAsset, slugify, MAX_WIDTH, QUANTISE_MAX_COLOURS } from './lib/asset-plan.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_ASSETS = `${root}/source/.gitbook/assets`;
const MAP = `${root}/asset-map.json`;

const DESTINATIONS = {
  'src/assets': { dir: `${root}/src/assets`, reference: (slug) => `~/assets/${slug}` },
  'public/media': { dir: `${root}/public/media`, reference: (slug) => `/media/${slug}` },
  'public/files': { dir: `${root}/public/files`, reference: (slug) => `/files/${slug}` },
};

/** kind has always determined destination one-to-one (see planAsset), so an older map entry
 * written before the `destination` field existed can still be placed correctly. */
const DESTINATION_FOR_KIND = { image: 'src/assets', video: 'public/media', file: 'public/files' };

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]
  );

const STILL_IMAGE = /\.(?:png|jpe?g|webp)$/i;
const PNG = /\.png$/i;
const JPEG = /\.jpe?g$/i;
const WEBP = /\.webp$/i;

/** Resizes a still image to the width ceiling, re-encoding it in its own source format so the
 * output extension always matches its content. Never enlarges. */
async function resizeImage(buffer, name) {
  const pipeline = sharp(buffer).resize({ width: MAX_WIDTH, withoutEnlargement: true });
  if (JPEG.test(name)) return pipeline.jpeg({ quality: 90 }).toBuffer();
  if (WEBP.test(name)) return pipeline.webp().toBuffer();
  return pipeline.png({ compressionLevel: 9 }).toBuffer();
}

/**
 * Unique RGB values in a decoded image, stopping once the quantisation threshold is exceeded.
 *
 * Must be called on the RESIZED image, never the original and never a downsample: unique colours
 * scale with pixel count, so a threshold calibrated on a smaller image admits far more files than
 * intended. An earlier draft of the design measured at 400px and projected 84.6 MiB against a
 * 60 MB gate.
 *
 * Asserts on the channel count rather than computing a meaningless result: a greyscale decode has
 * one channel, and reading three components per pixel while stepping by one would read across
 * pixel boundaries.
 */
async function countColours(buffer) {
  const { data, info } = await sharp(buffer).raw().toBuffer({ resolveWithObject: true });
  if (info.channels < 3) {
    throw new Error(`countColours: need at least 3 channels (RGB) to count colours, got ${info.channels}`);
  }
  const seen = new Set();
  for (let i = 0; i < data.length; i += info.channels) {
    seen.add((data[i] << 16) | (data[i + 1] << 8) | data[i + 2]);
    if (seen.size > QUANTISE_MAX_COLOURS) return seen.size;
  }
  return seen.size;
}

/**
 * Re-encodes an animated GIF to MP4, reading straight from source/ since ffmpeg takes a path
 * rather than a buffer.
 *
 * -movflags +faststart puts the index first so the browser can start playing before the file has
 * fully downloaded. yuv420p and the even-dimension scale filter are what Safari requires.
 *
 * -fflags +bitexact, -flags:v +bitexact and -map_metadata -1 strip encoder version strings,
 * timestamps and other metadata libx264/the MP4 muxer would otherwise embed, which would
 * otherwise make two encodes of the same input differ byte-for-byte and break the content-hash
 * cache's guarantee that the same source/ tree always produces identical output.
 */
function encodeVideo(from, to) {
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-fflags', '+bitexact',
    '-i', from,
    '-movflags', '+faststart',
    '-pix_fmt', 'yuv420p',
    '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
    '-c:v', 'libx264', '-crf', '23', '-preset', 'slow', '-an',
    '-flags:v', '+bitexact',
    '-map_metadata', '-1',
    to,
  ]);
}

/**
 * Palette-quantises a resized PNG, keeping the result only when it is actually smaller.
 *
 * Palette is a PNG concept. This must only ever be called with a PNG buffer — calling it on a
 * JPEG or WebP source would silently rewrite the file to PNG bytes under an unchanged extension.
 */
async function quantise(resized) {
  const quantised = await sharp(resized).png({ palette: true, compressionLevel: 9 }).toBuffer();
  return quantised.length < resized.length ? quantised : resized;
}

/**
 * The assets convert.mjs will reference: everything in source/ except covers-only images.
 *
 * A name can be both a genuine content reference and a card cover in different files (or
 * different places in the same file), so cover-ness is decided by multiset subtraction across
 * the whole corpus — one reference is removed per cover occurrence of that name — rather than by
 * testing membership per file, which would let a single cover occurrence anywhere blot out every
 * genuine occurrence of that name everywhere.
 */
function copySet() {
  const allCounts = new Map();
  const coverCounts = new Map();
  let coverHrefs = 0;
  const bump = (counts, name) => counts.set(name, (counts.get(name) ?? 0) + 1);
  const files = walk(`${root}/source`).filter((f) => /\.mdx?$/.test(f)).sort();
  for (const file of files) {
    const { all: refs, covers } = assetRefsInFile(readFileSync(file, 'utf8'));
    coverHrefs += covers.length;
    for (const name of refs) bump(allCounts, name);
    for (const name of covers) bump(coverCounts, name);
  }
  const all = new Set(allCounts.keys());
  const copy = [...all]
    .filter((name) => allCounts.get(name) - (coverCounts.get(name) ?? 0) > 0)
    .sort();
  return { all, copy, coverHrefs };
}

const { all, copy, coverHrefs } = copySet();

const missing = [...all].filter((name) => !existsSync(join(SOURCE_ASSETS, name))).sort();
if (missing.length) {
  throw new Error(`referenced assets absent from source/.gitbook/assets: ${missing.join(', ')}`);
}

const slugs = assignSlugs(copy);
const collisions = copy.filter((name) => slugs.get(name) !== slugify(name)).length;

for (const { dir } of Object.values(DESTINATIONS)) mkdirSync(dir, { recursive: true });

const previous = existsSync(MAP) ? JSON.parse(readFileSync(MAP, 'utf8')).assets : {};
let encoded = 0;
let reused = 0;

const assets = {};
for (const name of [...copy].sort()) {
  const from = join(SOURCE_ASSETS, name);
  const source = readFileSync(from);
  const hash = createHash('sha256').update(source).digest('hex');
  const slug = slugs.get(name);
  const still = STILL_IMAGE.test(name);

  // A still image's plan needs a colour count, which needs the resize. Everything else can be
  // planned immediately, and only those can change extension.
  const early = still ? null : planAsset({ filename: name, bytes: source.length, colours: null });
  const finalSlug = early?.treatment === 'encode-video' ? slug.replace(/\.gif$/i, '.mp4') : slug;

  const cached = previous[name];
  if (
    cached &&
    cached.hash === hash &&
    cached.slug === finalSlug &&
    cached.destination in DESTINATIONS &&
    existsSync(join(DESTINATIONS[cached.destination].dir, cached.slug))
  ) {
    assets[name] = cached;
    reused++;
    continue;
  }

  let plan = early;
  let output = source;
  if (still) {
    const resized = await resizeImage(source, name);
    plan = planAsset({ filename: name, bytes: source.length, colours: await countColours(resized) });
    output = plan.treatment === 'resize-quantise' && PNG.test(name) ? await quantise(resized) : resized;
    if (output.length > source.length) output = source;
  }

  const destination = DESTINATIONS[plan.destination];
  const target = join(destination.dir, finalSlug);
  if (plan.treatment === 'encode-video') encodeVideo(from, target);
  else writeFileSync(target, output);
  encoded++;

  assets[name] = {
    slug: finalSlug,
    kind: plan.kind,
    destination: plan.destination,
    reference: destination.reference(finalSlug),
    hash,
  };
}

/**
 * Removes what a prior run wrote for an asset that no longer exists in this run's copy set.
 *
 * Driven by the previous map's entries, never by listing the destination directories: those
 * directories are not script-owned (src/assets holds the site logo, unrelated to any asset entry)
 * and a listing-based sweep would delete anything it does not recognise, logo included. The map
 * is the only record of what this script has ever written, so it is the only safe source for
 * what this script may delete.
 *
 * Keyed on the (destination, slug) pair, not the slug alone: the same slug can move destination
 * between runs (a GIF crossing GIF_VIDEO_THRESHOLD keeps its filename but switches between
 * src/assets and public/media), and a slug claimed in its new destination must not be read as
 * covering the stale copy left behind in its old one.
 *
 * An entry that predates the `destination` field is placed via DESTINATION_FOR_KIND rather than
 * skipped: kind has always determined destination one-to-one, so the derivation is exact, not a
 * guess, and skipping such entries would let their stale files sit unswept forever.
 */
const destinationKeyFor = (asset) => asset.destination ?? DESTINATION_FOR_KIND[asset.kind];
const claimed = new Set(Object.values(assets).map((asset) => `${asset.destination}/${asset.slug}`));
for (const asset of Object.values(previous)) {
  const destinationKey = destinationKeyFor(asset);
  if (claimed.has(`${destinationKey}/${asset.slug}`)) continue;
  rmSync(join(DESTINATIONS[destinationKey].dir, asset.slug), { force: true });
}

writeFileSync(MAP, `${JSON.stringify({ generated: 'scripts/assets.mjs', assets }, null, 2)}\n`);

const bytesIn = (dir) =>
  existsSync(dir) ? walk(dir).reduce((total, f) => total + statSync(f).size, 0) : 0;
const MIB = 1024 * 1024;
const srcAssets = bytesIn(DESTINATIONS['src/assets'].dir);
const largest = walk(DESTINATIONS['src/assets'].dir)
  .concat(walk(DESTINATIONS['public/media'].dir), walk(DESTINATIONS['public/files'].dir))
  .reduce((max, f) => Math.max(max, statSync(f).size), 0);

const EXPECTED = {
  references: 509,
  coverHrefs: 13,
  copySet: 500,
  mapEntries: 500,
  slugCollisions: 0,
};
const stats = {
  references: all.size,
  coverHrefs,
  copySet: copy.length,
  mapEntries: Object.keys(assets).length,
  slugCollisions: collisions,
};

let failed = false;
for (const [key, expected] of Object.entries(EXPECTED)) {
  const ok = stats[key] === expected;
  if (!ok) failed = true;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${key.padEnd(18)} ${stats[key]}${ok ? '' : ` (expected ${expected})`}`);
}
const underGate = srcAssets < 60_000_000;
const underCap = largest < 25 * MIB;
console.log(`${underGate ? 'ok  ' : 'FAIL'} ${'src/assets size'.padEnd(18)} ${(srcAssets / MIB).toFixed(1)} MiB`);
console.log(`${underCap ? 'ok  ' : 'FAIL'} ${'largest file'.padEnd(18)} ${(largest / MIB).toFixed(1)} MiB`);
if (!underGate || !underCap) failed = true;

console.log(`     ${'encoded'.padEnd(18)} ${encoded}`);
console.log(`     ${'reused from cache'.padEnd(18)} ${reused}`);

console.log(`\nwrote ${Object.keys(assets).length} assets and asset-map.json`);
if (failed) {
  console.error('\nA count diverged. The script is wrong — do not adjust the expectation.');
  process.exit(1);
}
