/**
 * Finds every .gitbook/assets reference in a source file, and which of them are card covers.
 *
 * Destinations come from links.mjs's scanner rather than a regex: 1,056 asset filenames
 * contain parentheses and `\]\(([^)]+)\)` truncates at the first one.
 */
import { protectCode } from './segments.mjs';
import { extractTargets } from './links.mjs';
import { coverTargets } from './link-cards.mjs';

export const ASSET_SRC = /\.gitbook\/assets\/(.*)$/;
/**
 * Matches any double-quoted src="…" or href="…" text, regardless of surrounding markup.
 *
 * This is also the only thing that finds a GitBook `{% file src="…" %}` block's asset — there
 * is no dedicated pattern for that construct, because its `src="…"` attribute is textually
 * indistinguishable from an HTML one. A `{% file %}` block written with single quotes, or any
 * other attribute syntax, would not match this regex and its asset would silently disappear
 * from `all` with no error. Anyone changing GitBook's file-block syntax must check this regex.
 */
const ATTR = /(?:src|href)="([^"]*)"/g;

/**
 * Unescapes a captured .gitbook/assets path segment into the bare filename it names.
 *
 * This is the rule the asset map's keys are built from: assets.mjs derives each key by running
 * a source reference through this exact function, and figures.mjs's assetPath must resolve a
 * name the same way when it looks a key up, so the rule lives here once rather than as two
 * copies that could drift apart.
 */
export function unescapeAssetName(raw) {
  const name = raw.replace(/\\([_()*[\]\-.])/g, '$1');
  try {
    return decodeURIComponent(name);
  } catch {
    throw new Error(`asset reference is not valid percent-encoding: ${raw}`);
  }
}

/** Bare asset filename from a destination, or null when the destination is not an asset. */
function assetName(destination) {
  const clean = destination.trim();
  if (/^https?:/i.test(clean)) return null;
  const match = clean.match(ASSET_SRC);
  if (!match) return null;
  return unescapeAssetName(match[1]);
}

/** Every asset reference in `text`, and the subset that are data-card-cover hrefs. */
export function assetRefsInFile(text) {
  const all = [];
  const push = (destination) => {
    const name = assetName(destination);
    if (name) all.push(name);
  };
  protectCode(text, (masked) => {
    for (const { target } of extractTargets(masked)) push(target);
    for (const [, value] of masked.matchAll(ATTR)) push(value);
    return masked;
  });
  const covers = coverTargets(text).map(assetName).filter(Boolean);
  return { all, covers };
}
