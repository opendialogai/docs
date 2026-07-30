/**
 * Converts source/ (a pristine GitBook export) into Starlight content under src/content/docs/.
 *
 * Idempotent: src/content/docs/ is cleared before writing, output order follows
 * route-map.json, and nothing depends on timestamps or filesystem ordering. Re-runnable
 * against a fresh GitBook sync right up to cutover day.
 *
 * Verifies its own output against the counts measured from the source corpus and exits
 * non-zero on any divergence, in the same spirit as routes.mjs checking itself against the
 * live sitemap snapshot.
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { emitFrontmatter, parseFrontmatter, takeTitle } from './lib/frontmatter.mjs';
import { convertEmoji, countEmoji, countUnknownShortcodes } from './lib/emoji.mjs';
import { convertFigures, reflowImageDiv, rewriteAssetRefs } from './lib/figures.mjs';
import {
  convertCode,
  convertColumns,
  convertEmbeds,
  convertFile,
  convertHints,
  convertSteppers,
  stripEntities,
} from './lib/gitbook-blocks.mjs';
import { convertCardTables, convertContentRefs, countDroppedCovers } from './lib/link-cards.mjs';
import { rewriteLinks } from './lib/links.mjs';
import { normaliseForMdx, unwrapPreCode } from './lib/mdx.mjs';
import { mapLines, protectCode } from './lib/segments.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = `${root}/src/content/docs`;

const routeMap = JSON.parse(readFileSync(`${root}/route-map.json`, 'utf8'));
const routes = new Map(routeMap.map((r) => [r.source, r]));

const assetMap = existsSync(`${root}/asset-map.json`)
  ? JSON.parse(readFileSync(`${root}/asset-map.json`, 'utf8')).assets
  : null;

/** Counts occurrences of `pattern` in prose only, ignoring anything inside a fenced block. */
function countInProse(text, pattern) {
  const prose = [];
  mapLines(text, (line) => {
    prose.push(line);
    return line;
  });
  return (prose.join('\n').match(pattern) || []).length;
}

/** Matches one <LinkCard ...> or <Card ...> element, never <CardGrid>. */
const CARD_ELEMENT = /<(?:LinkCard|Card)(?=[ >])/g;

/** Counts <LinkCard>/<Card> elements present in `text`, for measuring what each pass added. */
function countCards(text) {
  return (text.match(CARD_ELEMENT) || []).length;
}

// Mirrors mdx.mjs's TAG/VOID_TAG matching: a quoted attribute value is matched as one whole
// unit so a ">" inside it (e.g. a title or href) is never mistaken for the tag's own close.
// Deliberately looser than TAG, though: it omits TAG's `(?=[\s/>])` name-boundary lookahead,
// so it is a strict superset of what normaliseForMdx itself treats as a tag. See
// countUnescapedBraces below for why that matters.
const JSX_ATTRS = `(?:"[^"]*"|'[^']*'|[^>"'])*`;
const JSX_TAG = new RegExp(`<\\/?[A-Za-z][A-Za-z0-9]*${JSX_ATTRS}>`, 'g');

/**
 * Counts bare `{` or `}` outside fenced code and inline code spans (via protectCode — the same
 * masking normaliseForMdx itself escapes around, so a `{ attr }` shown deliberately inside a
 * code span, e.g. `` `{user.attribute}` ``, is not mistaken for a leak), outside JSX tags and
 * the import line (where braces are legitimate JS/JSX syntax, not prose), and not already
 * escaped as `\{` / `\}`.
 *
 * What this does and does not prove: JSX_TAG is a strict superset of mdx.mjs's TAG regex (see
 * above), so every brace normaliseForMdx leaves unescaped — because it sits inside a real TAG
 * match — also sits inside a JSX_TAG match here, and this counter strips it too. On any page
 * normaliseForMdx has actually run over, the count is therefore 0 *by construction*, not by
 * verification: this cannot detect a bug in normaliseForMdx's own tag-matching (e.g. TAG
 * over-matching and swallowing a real prose brace into what it treats as tag content, letting
 * it survive unescaped) — JSX_TAG, matching at least as much as TAG, would hide exactly that
 * bug from this count too. What it genuinely catches is narrower: a page whose braces never
 * reached normaliseForMdx's escape step at all — a wiring defect (the `isMdx` gate skipped, or
 * the escape step itself removed), not a content-safety guarantee. `astro build`, which
 * renders every page through the real MDX compiler, is what would actually catch a defect
 * inside normaliseForMdx that lets a template-syntax brace through unescaped.
 */
function countUnescapedBraces(text) {
  let count = 0;
  protectCode(text, (masked) => {
    const withoutTags = masked
      .split('\n')
      .filter((line) => !line.startsWith('import '))
      .join('\n')
      .replace(JSX_TAG, '');
    count = (withoutTags.match(/(?<!\\)[{}]/g) || []).length;
    return masked;
  });
  return count;
}

/** First pass: every page's title and description, so cards can be titled from their target. */
const titles = new Map(
  routeMap.map((r) => {
    const { data, body } = parseFrontmatter(readFileSync(`${root}/source/${r.source}`, 'utf8'));
    const { title } = takeTitle(body);
    if (!title) throw new Error(`${r.source}: no H1 found`);
    return [r.source, { title, description: data.description }];
  })
);

const stats = {
  files: 0,
  mdx: 0,
  asides: 0,
  contentRefCards: 0,
  cardTableCards: 0,
  embeds: 0,
  steps: 0,
  cardGrids: 0,
  images: 0,
  emoji: 0,
  droppedCovers: 0,
  survivingBlocks: 0,
  survivingEntities: 0,
  survivingImgTags: 0,
  survivingBraces: 0,
  survivingShortcodes: 0,
  assetRefs: 0,
  survivingAssetPaths: 0,
};

const COMPONENTS = [
  ['<LinkCard', 'LinkCard'],
  ['<Card ', 'Card'],
  ['<CardGrid', 'CardGrid'],
  ['<Steps>', 'Steps'],
];

rmSync(OUT, { recursive: true, force: true });

for (const route of routeMap) {
  const raw = readFileSync(`${root}/source/${route.source}`, 'utf8');
  const { data, body } = parseFrontmatter(raw);
  const meta = titles.get(route.source);
  const ctx = { source: route.source, routes, titles, assets: assetMap };

  stats.droppedCovers += countDroppedCovers(body);

  let text = takeTitle(body).body;

  // Before anything escapes underscores on the way to MDX, so shortcodes are still in the
  // plain form GitBook wrote.
  stats.emoji += countEmoji(text);
  text = convertEmoji(text);
  stats.survivingShortcodes += countUnknownShortcodes(text);

  text = convertCode(text);
  text = convertHints(text);
  text = convertFile(text, ctx);

  const beforeContentRef = countCards(text);
  text = convertContentRefs(text, ctx);
  stats.contentRefCards += countCards(text) - beforeContentRef;

  const beforeCardTable = countCards(text);
  text = convertCardTables(text, ctx);
  stats.cardTableCards += countCards(text) - beforeCardTable;

  text = convertEmbeds(text);
  text = convertSteppers(text);
  text = convertColumns(text);
  text = reflowImageDiv(text);
  text = convertFigures(text, ctx);
  text = rewriteAssetRefs(text, ctx);
  text = stripEntities(text);
  text = rewriteLinks(text, ctx);

  const used = COMPONENTS.filter(([marker]) => text.includes(marker)).map(([, name]) => name);
  const hasEmbed = text.includes('<Embed ');
  const isMdx = used.length > 0 || hasEmbed;

  if (isMdx) {
    text = unwrapPreCode(text);
    text = normaliseForMdx(text);
    const imports = [];
    if (used.length) imports.push(`import { ${[...new Set(used)].sort().join(', ')} } from '@astrojs/starlight/components';`);
    if (hasEmbed) imports.push("import Embed from '~/components/Embed.astro';");
    text = `\n${imports.join('\n')}\n${text}`;
  }

  const target = `${OUT}/${route.target}${isMdx ? 'x' : ''}`;
  const output = `${emitFrontmatter({ title: meta.title, description: meta.description })}${text.replace(/^\n+/, '\n')}`;
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, output.replace(/\s*$/, '\n'));

  stats.files++;
  if (isMdx) stats.mdx++;
  stats.asides += (output.match(/^:::(note|tip|caution|danger)/gm) || []).length;
  stats.embeds += (output.match(/<Embed /g) || []).length;
  stats.cardGrids += (output.match(/<CardGrid>/g) || []).length;
  stats.steps += (output.match(/^\d+\. /gm) || []).length;
  stats.images += (output.match(/!\[/g) || []).length;
  // In .mdx a surviving block reads "\{% … %\}", so the escaped form still matches "{%".
  stats.survivingBlocks += countInProse(output, /\{%/g);
  stats.survivingEntities += countInProse(output, /&#x20;/g);
  stats.survivingImgTags += countInProse(output, /<img/g);
  if (isMdx) stats.survivingBraces += countUnescapedBraces(output);

  stats.assetRefs += (output.match(/~\/assets\/[^\s)>"]+/g) || []).length;
  for (const [, ref] of output.matchAll(/~\/assets\/([^\s)>"]+)/g)) {
    if (!existsSync(`${root}/src/assets/${ref}`)) {
      throw new Error(`${route.source}: emitted asset does not exist: src/assets/${ref}`);
    }
  }
  // Matches both a quoted attribute (<video src="/media/…">) and a markdown-link destination
  // ([name](/files/…)), in one pass so a reference cannot be counted under both alternatives.
  for (const match of output.matchAll(/"\/(media|files)\/([^"]+)"|\(<?\/(media|files)\/([^)>]+)>?\)/g)) {
    const dir = match[1] ?? match[3];
    const ref = match[2] ?? match[4];
    stats.assetRefs++;
    if (!existsSync(`${root}/public/${dir}/${ref}`)) {
      throw new Error(`${route.source}: emitted asset does not exist: public/${dir}/${ref}`);
    }
  }

  // Every asset target rewritten above resolves through asset-map.json. Nothing rewrites a plain
  // markdown *link* to a .gitbook/assets path — extractTargets/rewriteLinks treats it as a page
  // link and skips it, rewriteAssetRefs and convertFigures only match image syntax — so this is
  // the one shape that would ship a dead relative path with astro build still green. Asserted
  // only when assetMap is non-null: in the no-map fallback every reference is deliberately still
  // a /.gitbook/assets/ placeholder (see assetPath in figures.mjs), so this would always fail.
  stats.survivingAssetPaths += (output.match(/\.gitbook\/assets\//g) || []).length;

  if (/hidden:/.test(output.split('---')[1] ?? '')) throw new Error(`${route.source}: hidden survived`);
}

const EXPECTED = {
  files: 204,
  mdx: 46,
  asides: 258,
  contentRefCards: 51,
  cardTableCards: 41,
  embeds: 36,
  cardGrids: 9,
  // Markdown-image occurrences across the corpus, not distinct assets — most of the 498
  // image-kind entries in asset-map.json are referenced more than once. This is one less than
  // the full occurrence count, because the corpus's sole video-kind asset (Knowledge Base
  // Demo.gif) renders as a <video> element rather than a markdown image.
  images: 528,
  droppedCovers: 13,
  // Four distinct GitBook shortcodes across three pages. A sync introducing a fifth
  // moves this and must be adjudicated, not adjusted away.
  emoji: 5,
  survivingBlocks: 0,
  survivingEntities: 0,
  survivingImgTags: 0,
  survivingBraces: 0,
  survivingShortcodes: 0,
};
if (assetMap) EXPECTED.survivingAssetPaths = 0;

let failed = false;
for (const [key, expected] of Object.entries(EXPECTED)) {
  const actual = stats[key];
  const ok = actual === expected;
  if (!ok) failed = true;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${key.padEnd(20)} ${actual}${ok ? '' : ` (expected ${expected})`}`);
}
// Informational, not asserted: the corpus contains ordinary numbered lists too, so a
// "^\d+\. " count cannot isolate the 15 stepper steps. Task 6 checks those by eye.
console.log(`     ${'ordered list items'.padEnd(20)} ${stats.steps}`);
console.log(`     ${'asset references'.padEnd(20)} ${stats.assetRefs}`);
console.log(`\nwrote ${stats.files} pages to src/content/docs`);

if (failed) {
  console.error('\nA count diverged. The script is wrong — do not adjust the expectation.');
  process.exit(1);
}
