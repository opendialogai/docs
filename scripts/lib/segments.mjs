/**
 * Code-safety primitives. Every markdown transformation in this pipeline is built on one of
 * these two functions so that fenced code blocks and inline code spans are never modified.
 *
 * The source contains `{first_name}` inside JSON fences, `{% code %}` blocks wrapping fences,
 * and 1,317 asset filenames containing parentheses. A transform that reaches inside code
 * corrupts content silently, which is why these are the foundation rather than a convenience.
 */

const FENCE = /^(\s*)(`{3,}|~{3,})(.*)$/;
const TOKEN = '\u0000';

/** True when `line` closes a fence opened with `marker`. A closing fence carries no info string. */
function closesFence(match, marker) {
  return match[2][0] === marker[0] && match[2].length >= marker.length && match[3].trim() === '';
}

/**
 * Applies `fn` to every line that sits outside a fenced code block.
 *
 * Fence delimiters and fence contents pass through untouched and are never shown to `fn`.
 * Because this is a single stateful pass over all lines, a block construct whose open and
 * close markers straddle a fence — as `{% columns %}` does — still sees both markers.
 *
 * `fn` may return a string, an array of strings to splice in, or null to delete the line.
 */
export function mapLines(text, fn) {
  const out = [];
  let marker = null;
  for (const line of text.split('\n')) {
    const match = line.match(FENCE);
    if (marker === null) {
      if (match) {
        marker = match[2];
        out.push(line);
        continue;
      }
      const result = fn(line);
      if (result === null) continue;
      if (Array.isArray(result)) out.push(...result);
      else out.push(result);
      continue;
    }
    if (match && closesFence(match, marker)) marker = null;
    out.push(line);
  }
  return out.join('\n');
}

/**
 * Masks fenced code blocks and inline code spans, applies `fn` to what remains, then restores.
 *
 * For inline transformations — link rewriting, entity stripping, brace escaping — which never
 * span a fence. Note that a fenced block collapses to a single token line while masked, so
 * `fn` must not depend on line structure. Use mapLines for anything that does.
 */
export function protectCode(text, fn) {
  const stash = [];
  const keep = (s) => `${TOKEN}${stash.push(s) - 1}${TOKEN}`;
  const masked = [];
  let marker = null;
  let block = [];

  for (const line of text.split('\n')) {
    const match = line.match(FENCE);
    if (marker === null) {
      if (match) {
        marker = match[2];
        block = [line];
        continue;
      }
      masked.push(line.replace(/(`+)(?:(?!\1).)*\1/g, keep));
      continue;
    }
    block.push(line);
    if (match && closesFence(match, marker)) {
      masked.push(keep(block.join('\n')));
      marker = null;
      block = [];
    }
  }
  // An unterminated fence is still code; keep it masked rather than exposing it to `fn`.
  if (marker !== null) masked.push(keep(block.join('\n')));

  return fn(masked.join('\n')).replace(
    new RegExp(`${TOKEN}(\\d+)${TOKEN}`, 'g'),
    (_, index) => stash[Number(index)]
  );
}
