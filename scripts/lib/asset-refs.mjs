/**
 * Finds every .gitbook/assets reference in a source file, and which of them are card covers.
 *
 * Destinations come from links.mjs's scanner rather than a regex: 1,056 asset filenames
 * contain parentheses and `\]\(([^)]+)\)` truncates at the first one.
 */
import { protectCode } from './segments.mjs';
import { extractTargets } from './links.mjs';
import { coverTargets } from './link-cards.mjs';

const ASSET = /\.gitbook\/assets\/(.*)$/;
const ATTR = /(?:src|href)="([^"]*)"/g;

/** Bare asset filename from a destination, or null when the destination is not an asset. */
function assetName(destination) {
  const clean = destination.trim();
  if (/^https?:/i.test(clean)) return null;
  const match = clean.match(ASSET);
  if (!match) return null;
  let name = match[1].replace(/\\([_()*[\]\-.])/g, '$1');
  try {
    name = decodeURIComponent(name);
  } catch {
    throw new Error(`asset reference is not valid percent-encoding: ${destination}`);
  }
  return name;
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
