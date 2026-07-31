/**
 * Fetches every URL the live GitBook sitemap listed and reports anything that is not 200.
 *
 * The site is cut over, so this is a check on production traffic rather than a pre-launch
 * target. GitBook no longer answers on the domain, so reference/sitemap-pages.xml is the only
 * surviving record of what the URL set was; it is a committed snapshot and is read from disk,
 * never fetched, so it outlives GitBook.
 *
 * The CSV, the MP4 and the sitemap index are checked alongside the pages: none appears in the
 * sitemap, all three are reachable from prose or from crawlers, and all three would be easy to
 * lose in an asset-pipeline change without a single page 404ing.
 *
 * Usage:
 *   node scripts/verify-live.mjs                        # https://docs.opendialog.ai
 *   node scripts/verify-live.mjs https://staging.example # any other origin
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITEMAP = `${root}/reference/sitemap-pages.xml`;
const CONCURRENCY = 8;

const base = (process.argv[2] ?? 'https://docs.opendialog.ai').replace(/\/$/, '');

const paths = [
  ...[...readFileSync(SITEMAP, 'utf8').matchAll(/<loc>([^<]*)<\/loc>/g)]
    .map((m) => m[1].replace(/^https:\/\/docs\.opendialog\.ai/, '').replace(/\/$/, ''))
    .map((p) => p || '/'),
  '/files/deliveryknowledgebase.csv',
  '/media/knowledge-base-demo.mp4',
  '/sitemap-index.xml',
];

/** Runs `worker` over `items` at a fixed concurrency, preserving input order in the result. */
async function pooled(items, worker) {
  const results = new Array(items.length);
  let next = 0;
  const runners = Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i]);
    }
  });
  await Promise.all(runners);
  return results;
}

console.log(`checking ${paths.length} URLs against ${base}\n`);

const results = await pooled(paths, async (path) => {
  try {
    const response = await fetch(`${base}${path}`, { redirect: 'manual' });
    return { path, status: response.status, location: response.headers.get('location') };
  } catch (error) {
    return { path, status: 0, error: error.message };
  }
});

const failures = results.filter((r) => r.status !== 200);

console.log(`checked            : ${results.length}`);
console.log(`serving 200        : ${results.length - failures.length}`);
console.log(`not 200            : ${failures.length}`);

if (failures.length) {
  console.error('\nURLs not serving 200:');
  for (const f of failures) {
    console.error(`  ${String(f.status).padEnd(4)} ${f.path}${f.location ? ` -> ${f.location}` : ''}${f.error ? ` (${f.error})` : ''}`);
  }
  process.exit(1);
}
console.log('\nlive check: OK');
