/**
 * Derives the live URL for every page from source/SUMMARY.md and writes route-map.json.
 *
 * GitBook routes by a page's position in the SUMMARY.md navigation tree, not by where
 * its file happens to sit on disk. Four pages have file paths that disagree with their
 * nav position; deriving from nav rather than path handles them with no special cases.
 *
 * Verifies its own output against reference/sitemap-pages.xml, a snapshot of the live
 * GitBook sitemap. Exits non-zero on any divergence.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SUMMARY = `${root}/source/SUMMARY.md`;
const SITEMAP = `${root}/reference/sitemap-pages.xml`;
const OUT = `${root}/route-map.json`;

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Parses SUMMARY.md into an ordered list of nav entries. */
function parseSummary(text) {
  const entries = [];
  let section = null;
  for (const line of text.split('\n')) {
    const heading = line.match(/^##\s+(.*)$/);
    if (heading) {
      const raw = heading[1];
      // "## GETTING STARTED <a href="#getting-started-1" id="getting-started-1"></a>"
      // The anchor id, where present, is the URL segment for the section.
      const anchor = raw.match(/id="([^"]+)"/);
      const label = raw.replace(/<a\b[^>]*>.*?<\/a>/g, '').trim();
      section = { label, slug: anchor ? anchor[1] : slugify(label) };
      continue;
    }
    // Labels may contain escaped brackets — "[\[Deprecated\] webhook actions]" — so the
    // label is matched greedily up to the final "](".
    const item = line.match(/^(\s*)\*\s+\[(.*)\]\(([^)]+)\)/);
    if (item && section) {
      entries.push({
        depth: item[1].length,
        label: item[2].replace(/\\([[\]])/g, '$1'),
        source: decodeURIComponent(item[3]).trim(),
        section,
      });
    }
  }
  return entries;
}

/** A page's own URL segment: its directory name when it is a README, else its basename. */
function segment(sourcePath) {
  const p = sourcePath.replace(/\.md$/, '');
  if (p === 'README') return null; // top-level README is the site root
  return p.endsWith('/README') ? p.split('/').slice(-2)[0] : p.split('/').pop();
}

function buildRoutes(entries) {
  const ancestors = [];
  return entries.map((entry) => {
    while (ancestors.length && ancestors.at(-1).depth >= entry.depth) ancestors.pop();
    const own = segment(entry.source);
    const url =
      own === null
        ? '/'
        : `/${[entry.section.slug, ...ancestors.map((a) => segment(a.source)), own].filter(Boolean).join('/')}`;
    ancestors.push(entry);
    return {
      source: entry.source,
      url,
      target: url === '/' ? 'index.md' : `${url.slice(1)}/index.md`,
      title: entry.label,
      section: entry.section.label,
    };
  });
}

function liveUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)]
    .map((m) => m[1].replace(/^https:\/\/docs\.opendialog\.ai/, '').replace(/\/$/, ''))
    .map((p) => p || '/');
}

const routes = buildRoutes(parseSummary(readFileSync(SUMMARY, 'utf8')));
const live = liveUrls(readFileSync(SITEMAP, 'utf8'));

const derived = new Set(routes.map((r) => r.url));
const missing = live.filter((u) => !derived.has(u)); // live URL we would not serve
const extra = [...derived].filter((u) => !live.includes(u)); // URL we invent

console.log(`pages derived      : ${routes.length}`);
console.log(`live sitemap URLs  : ${live.length}`);
console.log(`unreachable        : ${missing.length}`);
console.log(`not live today     : ${extra.length}`);

if (missing.length) {
  console.error('\nLive URLs with no derived route:');
  for (const u of missing) console.error(`  ${u}`);
}
if (extra.length) {
  console.error('\nDerived routes not in the live sitemap:');
  for (const u of extra) console.error(`  ${u}`);
}

writeFileSync(OUT, `${JSON.stringify(routes, null, 2)}\n`);
console.log(`\nwrote ${OUT}`);

if (missing.length || extra.length) process.exit(1);
console.log('route parity: OK');
