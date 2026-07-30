/**
 * Copies the referenced GitBook assets into src/assets/ and public/, slugified and re-encoded,
 * and records what each became in asset-map.json.
 *
 * The copy set is derived from source/ alone — never from src/content/docs — because
 * convert.mjs consumes this map to emit its paths and would otherwise need itself first.
 *
 * Idempotent: output paths derive from sorted filenames, encoding parameters are fixed, and an
 * asset whose source bytes are unchanged is skipped. Re-runnable against a fresh GitBook sync
 * right up to cutover day.
 */
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { assetRefsInFile } from './lib/asset-refs.mjs';
import { assignSlugs, planAsset, slugify } from './lib/asset-plan.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_ASSETS = `${root}/source/.gitbook/assets`;
const MAP = `${root}/asset-map.json`;

const DESTINATIONS = {
  'src/assets': { dir: `${root}/src/assets`, reference: (slug) => `~/assets/${slug}` },
  'public/media': { dir: `${root}/public/media`, reference: (slug) => `/media/${slug}` },
  'public/files': { dir: `${root}/public/files`, reference: (slug) => `/files/${slug}` },
};

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]
  );

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

const assets = {};
for (const name of copy) {
  const from = join(SOURCE_ASSETS, name);
  const bytes = statSync(from).size;
  const plan = planAsset({ filename: name, bytes, colours: /\.(png|jpe?g|webp)$/i.test(name) ? 0 : null });
  const slug = slugs.get(name);
  const destination = DESTINATIONS[plan.destination];
  copyFileSync(from, join(destination.dir, slug));
  assets[name] = {
    slug,
    kind: plan.kind,
    reference: destination.reference(slug),
    hash: createHash('sha256').update(readFileSync(from)).digest('hex'),
  };
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

console.log(`\nwrote ${Object.keys(assets).length} assets and asset-map.json`);
if (failed) {
  console.error('\nA count diverged. The script is wrong — do not adjust the expectation.');
  process.exit(1);
}
