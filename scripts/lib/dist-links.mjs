/**
 * Reads the links, in-page anchors and element ids out of a built page.
 *
 * The built output is the only honest place to check a link: convert.mjs rewrites relative
 * .md links, rehype rewrites headings into slugs, and Starlight adds navigation of its own,
 * so a check against source/ would measure something no reader ever loads.
 *
 * Every internal href Starlight emits is root-relative or a bare fragment — measured across
 * all 205 pages — but relative destinations resolve correctly anyway, so a future component
 * that emits one is handled rather than silently skipped.
 */
const ANCHOR = /<a\b[^>]*\shref="([^"]*)"/g;
const ID = /\sid="([^"]*)"/g;
const OFF_SITE = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

/** The URL a built file is served at, with no trailing slash. */
export function pageUrl(relativePath) {
  const url = `/${relativePath.replace(/(?:^|\/)index\.html$/, '').replace(/\.html$/, '')}`;
  return url.replace(/\/$/, '') || '/';
}

/** Every href on the page, in document order. */
export function extractHrefs(html) {
  return [...html.matchAll(ANCHOR)].map((m) => m[1]);
}

/** Every element id on the page. */
export function extractIds(html) {
  return new Set([...html.matchAll(ID)].map((m) => m[1]));
}

/**
 * Where an href found on `fromUrl` points, or null when it leaves the site.
 *
 * The fragment is decoded because an id attribute holds the decoded character while the href
 * holds it percent-encoded, and comparing the two raw would report a working anchor as broken.
 */
export function resolveHref(fromUrl, href) {
  if (!href || OFF_SITE.test(href)) return null;
  const [target, ...rest] = href.split('#');
  const hash = rest.join('#');
  const path = target === '' ? fromUrl : new URL(target, `https://site${fromUrl}`).pathname;
  return { path: path.replace(/\/$/, '') || '/', hash: hash ? decodeURIComponent(hash) : '' };
}
