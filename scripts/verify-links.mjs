/**
 * Checks every internal link and in-page anchor in the built site.
 *
 * Gates on regressions, not on absolute health: 25 of the defects it finds came across from
 * GitBook, are present in source/, and cannot be fixed here without editing documentation
 * prose. Those live in reports/inherited-broken-links.json. Anything outside that inventory
 * fails the run, and so does an inventory entry that is no longer broken, so the list cannot
 * quietly rot into an excuse.
 *
 * A link target is a page when the build emitted HTML for it, and a file when the build
 * emitted anything else at that path — the one CSV and the one MP4 are linked from prose and
 * are real destinations, not broken pages.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractHrefs, extractIds, pageUrl, resolveHref } from './lib/dist-links.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = `${root}/dist`;
const INVENTORY = `${root}/reports/inherited-broken-links.json`;

if (!existsSync(DIST)) {
  console.error('dist/ not found — run `npm run build` first');
  process.exit(1);
}

const inventory = JSON.parse(readFileSync(INVENTORY, 'utf8'));
const knownLinks = new Set(inventory.links.map((l) => `${l.from} -> ${l.href}`));
const knownAnchors = new Set(inventory.anchors);

const files = readdirSync(DIST, { recursive: true })
  .map(String)
  .filter((f) => f.endsWith('.html'));

const pages = new Map();
for (const file of files) {
  const html = readFileSync(`${DIST}/${file}`, 'utf8');
  pages.set(pageUrl(file), {
    html,
    main: html.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? '',
    ids: extractIds(html),
  });
}

const stats = { links: 0, anchors: 0 };
const brokenLinks = [];
const brokenAnchors = [];
const hitLinks = new Set();
const hitAnchors = new Set();

for (const [url, page] of pages) {
  for (const href of extractHrefs(page.main)) {
    const dest = resolveHref(url, href);
    if (!dest) continue;
    stats.links++;
    if (dest.hash) stats.anchors++;
    const target = pages.get(dest.path);
    if (!target) {
      // Not a page. A real file the build emitted — the CSV, the MP4 — is a valid destination.
      if (existsSync(`${DIST}${dest.path}`)) continue;
      const key = `${url} -> ${href}`;
      knownLinks.has(key) ? hitLinks.add(key) : brokenLinks.push(key);
      continue;
    }
    if (!dest.hash || target.ids.has(dest.hash)) continue;
    const key = `${dest.path}#${dest.hash}`;
    knownAnchors.has(key) ? hitAnchors.add(key) : brokenAnchors.push(`${url} -> ${href}`);
  }
}

const staleLinks = [...knownLinks].filter((k) => !hitLinks.has(k));
const staleAnchors = [...knownAnchors].filter((k) => !hitAnchors.has(k));

console.log(`pages              : ${pages.size}`);
console.log(`content links      : ${stats.links}`);
console.log(`content anchors    : ${stats.anchors}`);
console.log(`inherited defects  : ${hitLinks.size} links, ${hitAnchors.size} anchors`);
console.log(`new broken links   : ${brokenLinks.length}`);
console.log(`new broken anchors : ${brokenAnchors.length}`);

for (const [label, list] of [
  ['\nInternal links with no target:', brokenLinks],
  ['\nAnchors with no matching id:', brokenAnchors],
  ['\nInventory entries that now resolve — remove them:', [...staleLinks, ...staleAnchors]],
]) {
  if (!list.length) continue;
  console.error(label);
  for (const item of list) console.error(`  ${item}`);
}

if (brokenLinks.length || brokenAnchors.length || staleLinks.length || staleAnchors.length) {
  process.exit(1);
}
console.log('\nlink check: OK');
