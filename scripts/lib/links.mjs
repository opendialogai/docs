/**
 * Rewrites GitBook's relative page links to the live route URLs held in route-map.json.
 *
 * Destinations are extracted by scanning rather than by regex: 1,317 asset filenames contain
 * parentheses, and `\]\(([^)]+)\)` truncates at the first one, silently mangling the path.
 */
import path from 'node:path';
import { protectCode } from './segments.mjs';

const ASSET = /(^|\/)\.gitbook\/assets\//;

/** Character offsets of every markdown link or image destination in `text`. */
export function extractTargets(text) {
  const found = [];
  for (let i = 0; i < text.length - 1; i++) {
    if (text[i] !== ']' || text[i + 1] !== '(') continue;
    const open = i + 2;
    if (text[open] === '<') {
      const close = text.indexOf('>', open);
      if (close === -1 || text[close + 1] !== ')') continue;
      found.push({ start: open, end: close + 1, target: text.slice(open + 1, close), angled: true });
      i = close + 1;
      continue;
    }
    let depth = 1;
    let j = open;
    for (; j < text.length; j++) {
      if (text[j] === '(') depth++;
      else if (text[j] === ')') { if (--depth === 0) break; }
      else if (text[j] === '\n') { depth = -1; break; }
    }
    if (depth !== 0) continue;
    found.push({ start: open, end: j, target: text.slice(open, j), angled: false });
    i = j;
  }
  return found;
}

/**
 * Resolves a link destination to a source-relative .md path, or null when it is not an
 * internal page link.
 *
 * `..` is clamped at the source root. GitBook clamps too, which is why
 * core-concepts/contexts-and-attributes/secret-context.md resolves on the live site despite
 * carrying one ../ too many.
 */
export function resolveSource(fromSource, target) {
  const clean = target.trim();
  if (clean === '' || /^(https?:|mailto:|tel:|#)/.test(clean)) return null;
  if (clean.startsWith('/broken/pages/')) return null;

  const withoutAnchor = decodeURIComponent(clean.replace(/#.*/, ''));
  if (withoutAnchor === '' || ASSET.test(withoutAnchor)) return null;

  let relative;
  if (withoutAnchor.endsWith('/')) relative = `${withoutAnchor}README.md`;
  else if (withoutAnchor.endsWith('.md')) relative = withoutAnchor;
  else return null;

  const joined = path.posix.join(path.posix.dirname(fromSource), relative);
  // path.posix.normalize keeps leading "../" segments; drop them to clamp at the root.
  return path.posix.normalize(joined).replace(/^(\.\.\/)+/, '');
}

/** A raw HTML anchor's href. GitBook's export leaves these inside table cells. */
const HTML_HREF = /(<a\b[^>]*?\bhref=")([^"]*)(")/gi;

/**
 * Rewrites every internal page link in `text` to its route URL. Throws on any that misses.
 *
 * Covers both markdown links and raw HTML anchors. The corpus carries relative `.md` links
 * in both forms, and handling only the first shipped
 * `<a href="button-message.md">Button Message</a>` on twilio-content-template-message as a
 * 404 — the same page links the same target correctly two lines further down, in markdown.
 * A link inside a code fence is left alone by protectCode, so an HTML sample showing an
 * anchor is not rewritten.
 */
export function rewriteLinks(text, { source, routes }) {
  const routeFor = (target) => {
    const resolved = resolveSource(source, target);
    if (resolved === null) return null;
    const route = routes.get(resolved);
    if (!route) {
      throw new Error(`${source}: link target does not resolve to a page: ${target} -> ${resolved}`);
    }
    const anchor = target.includes('#') ? target.slice(target.indexOf('#')) : '';
    return `${route.url}${anchor}`;
  };

  return protectCode(text, (masked) => {
    let out = '';
    let cursor = 0;
    for (const { start, end, target, angled } of extractTargets(masked)) {
      const url = routeFor(target);
      if (url === null) continue;
      out += masked.slice(cursor, start) + (angled ? `<${url}>` : url);
      cursor = end;
    }
    const withMarkdown = out + masked.slice(cursor);

    return withMarkdown.replace(HTML_HREF, (whole, open, href, close) => {
      const url = routeFor(href);
      return url === null ? whole : `${open}${url}${close}`;
    });
  });
}
