/**
 * Pins the colour scheme to light in the served bytes.
 *
 * Starlight hard-codes `data-theme="dark"` on <html> in its own Page.astro and relies on an
 * inline script to correct it, so a reader with JavaScript disabled gets the dark theme on a
 * site that ships light-only, as GitBook's did. Rewriting the attribute in the emitted HTML
 * puts the right value in the bytes Cloudflare serves without copying Starlight's 126-line
 * Page component, which would drift silently on every upgrade with nothing to signal it.
 *
 * ThemeProvider's inline script stays: `astro:build:done` does not run under `astro dev`, so
 * the script is what keeps the dev server light, and it holds up Starlight's
 * `StarlightThemeProvider.updatePickers` contract.
 */
const HTML_TAG = /<html\b[^>]*>/;
const DARK = 'data-theme="dark"';

/** The page with its <html> tag pinned to light. Throws on any tag that is not the expected shape. */
export function pinLightTheme(html) {
  const tag = html.match(HTML_TAG);
  if (!tag) throw new Error('pinLightTheme: no <html> tag');
  if (!tag[0].includes(DARK)) {
    throw new Error(`pinLightTheme: <html> does not carry ${DARK}: ${tag[0]}`);
  }
  return html.replace(HTML_TAG, (found) => found.replace(DARK, 'data-theme="light"'));
}
