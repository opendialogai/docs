/**
 * Applies the per-image widths GitBook authored, which markdown cannot carry.
 *
 * 64 `<img width="...">` attributes across the corpus set an image's display width — 21
 * inside the wrapper divs that lay figures out in a row, 43 on standalone figures. GitBook
 * honours all of them; without this an image the author sized to 188px renders at the full
 * content width, and one 1118x1670 screenshot renders 720x1075.
 *
 * scripts/lib/figures.mjs writes the width into the markdown title slot, the only channel
 * markdown offers that survives into the HTML without introducing block markup. A raw <img>
 * would bypass astro:assets and ship the image unoptimised; a wrapper <div> is block markup
 * and would break the enclosing list for the one width-bearing figure that sits inside a
 * list item. This plugin turns that title into an inline width and removes it, so no title
 * reaches the page and nothing shows a stray tooltip.
 *
 * Only an all-digit, positive title is consumed. A title of any other shape is left alone,
 * so a genuine tooltip is never eaten.
 */

/** Walks every element in a hast tree. */
function visitElements(node, fn) {
  if (node.type === 'element') fn(node);
  for (const child of node.children ?? []) visitElements(child, fn);
}

export function rehypeImageWidth() {
  return (tree) => {
    visitElements(tree, (node) => {
      if (node.tagName !== 'img') return;
      const { title } = node.properties ?? {};
      if (typeof title !== 'string' || !/^\d+$/.test(title)) return;
      const width = Number(title);
      if (!Number.isInteger(width) || width <= 0) return;

      delete node.properties.title;
      const existing = node.properties.style;
      node.properties.style = existing ? `${existing};width:${width}px` : `width:${width}px`;
    });
  };
}
