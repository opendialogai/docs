/**
 * Renders GitBook's emoji shortcodes as the characters they stand for.
 *
 * GitBook renders `:white_check_mark:` as ✅; Starlight has no shortcode support, so the
 * literal text reached the page — measured on the live site, `:heavy_plus_sign: Adding a
 * new user` renders there as `➕ Adding a new user`.
 *
 * The corpus uses exactly four shortcodes across five occurrences on three pages, so they
 * are mapped by hand rather than by pulling in a full emoji table. convert.mjs asserts
 * both the number converted and that none is left behind, so a GitBook sync that
 * introduces a fifth shortcode fails the run rather than shipping literal text.
 *
 * Two shapes of text must not be mistaken for a shortcode: a time or ratio like 12:30:45,
 * and Starlight's own `:::note` aside markers. Requiring a leading letter excludes the
 * first, and requiring a closing colon on the same run excludes the second.
 */
import { protectCode } from './segments.mjs';

/** The shortcodes this corpus uses, and the characters GitBook renders for them. */
export const EMOJI = {
  heavy_plus_sign: '➕',
  tada: '🎉',
  white_check_mark: '✅',
  x: '❌',
};

/** A shortcode, tolerating the backslash escapes convert.mjs adds to underscores. */
const SHORTCODE = /:([a-z0-9_+\\-]{1,40}):/g;

/** Strips markdown escaping so `white\_check\_mark` looks up as `white_check_mark`. */
const unescapeName = (name) => name.replace(/\\/g, '');

export function convertEmoji(text) {
  return protectCode(text, (masked) =>
    masked.replace(SHORTCODE, (whole, name) => EMOJI[unescapeName(name)] ?? whole)
  );
}

/** Shortcodes this map can render, as they appear before conversion. */
export function countEmoji(text) {
  let count = 0;
  protectCode(text, (masked) => {
    for (const match of masked.matchAll(SHORTCODE)) {
      if (EMOJI[unescapeName(match[1])]) count++;
    }
    return masked;
  });
  return count;
}

/**
 * Shortcodes left over after conversion — ones this map cannot render.
 *
 * Deliberately conservative: a leading letter and at least three characters, so neither
 * `12:30:45` nor a stray `:2:` is counted.
 */
const UNKNOWN = /:([a-z][a-z0-9_+\\-]{2,39}):/g;

export function countUnknownShortcodes(text) {
  let count = 0;
  protectCode(text, (masked) => {
    for (const match of masked.matchAll(UNKNOWN)) {
      if (!EMOJI[unescapeName(match[1])]) count++;
    }
    return masked;
  });
  return count;
}
