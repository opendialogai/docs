/**
 * Parses source/SUMMARY.md, GitBook's navigation file, into an ordered list of entries.
 *
 * SUMMARY.md is the source of truth for both the sidebar and the live URL of every page.
 * routes.mjs and sidebar.mjs must agree exactly, so they share this parser.
 */

/** Lowercases and hyphenates a heading into a URL segment. */
export const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Parses SUMMARY.md into an ordered list of nav entries. */
export function parseSummary(text) {
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
