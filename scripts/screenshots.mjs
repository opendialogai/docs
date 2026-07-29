/**
 * Captures matched screenshots of the live GitBook site and the Starlight build for
 * side-by-side comparison.
 *
 * Usage:
 *   node scripts/screenshots.mjs                     # default page set, 1440px
 *   node scripts/screenshots.mjs --width 375         # a single viewport width
 *   node scripts/screenshots.mjs --paths /a,/b       # explicit paths
 *
 * Phase 4 (look and feel) and Phase 5 (verification) both compare against the live site.
 * Phase 5 wants the top 30 pages by traffic; pass those in with --paths once
 * top-pages.csv is available.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const LIVE = 'https://docs.opendialog.ai';
const PREVIEW = 'https://opendialog-docs.opendialog.workers.dev';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const argOf = (name, fallback) => {
	const i = args.indexOf(`--${name}`);
	return i === -1 ? fallback : args[i + 1];
};

const width = Number(argOf('width', 1440));
const outDir = resolve(argOf('out', `${root}/screenshots`));
const paths = argOf('paths', [
	'/',
	'/getting-started-1/getting-ready',
	'/core-concepts/the-opendialog-model',
	'/tutorials/ai-agent-creation-overview',
].join(','))
	.split(',')
	.map((p) => p.trim())
	.filter(Boolean);

const slug = (p) => (p === '/' ? 'root' : p.replace(/^\//, '').replace(/\//g, '_'));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height: 900 } });

mkdirSync(outDir, { recursive: true });

for (const path of paths) {
	for (const [name, base] of [['live', LIVE], ['preview', PREVIEW]]) {
		const url = base + path;
		const file = `${outDir}/${slug(path)}--${name}--${width}.png`;
		try {
			// GitBook is a client-rendered app, so waiting for the load event alone
			// captures an empty shell.
			await page.goto(url, { waitUntil: 'networkidle', timeout: 45_000 });
			await page.screenshot({ path: file });
			console.log(`ok   ${name.padEnd(7)} ${path}`);
		} catch (err) {
			console.error(`FAIL ${name.padEnd(7)} ${path} — ${err.message.split('\n')[0]}`);
		}
	}
}

await browser.close();
console.log(`\nwrote to ${outDir}`);
