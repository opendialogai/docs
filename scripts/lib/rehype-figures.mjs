/**
 * Pairs an image with the caption paragraph beneath it into a <figure>/<figcaption>.
 *
 * Markdown has no figure syntax, so scripts/lib/figures.mjs emits a GitBook <figcaption>
 * as an italic paragraph following the image. That leaves two separate blocks, which is
 * wrong in two ways: the caption carries no relationship to its image for a screen reader,
 * and inside GitBook's image wrapper divs — which lay figures out in a row — the caption
 * becomes a flex item of its own, taking width from the row and forcing it to wrap.
 *
 * Pairing is inferred rather than marked, because markdown offers no channel to mark it.
 * That inference is exact on this corpus: the source holds 329 figures with a non-empty
 * caption, and the generated markdown holds exactly 329 italic-only paragraphs directly
 * following an image. The one further italic-only paragraph is authored prose that
 * follows no image and is left alone. A caption is only ever taken from a paragraph whose
 * sole content is emphasis, immediately after a paragraph whose sole content is an image.
 *
 * The 101 figures whose caption is empty emit the image alone and stay a plain paragraph:
 * a <figure> with nothing to caption would add markup without adding meaning.
 *
 * The wrapping <em> is dropped and its children kept, because GitBook sets its captions
 * in roman, not italic; the italics were only ever markdown's way of carrying them.
 */

/** Element children, ignoring the whitespace text nodes between block elements. */
function elementChildren(node) {
  return (node.children ?? []).filter(
    (child) => child.type !== 'text' || child.value.trim() !== ''
  );
}

/** The single element a node contains, or null if it holds anything else. */
function soleElement(node, tagName) {
  const children = elementChildren(node);
  if (children.length !== 1) return null;
  const [only] = children;
  return only.type === 'element' && only.tagName === tagName ? only : null;
}

export function rehypeFigures() {
  return (tree) => {
    const visit = (node) => {
      const children = node.children;
      if (Array.isArray(children)) {
        const out = [];
        for (let i = 0; i < children.length; i++) {
          const current = children[i];

          const image = current.type === 'element' && current.tagName === 'p'
            ? soleElement(current, 'img')
            : null;

          if (image) {
            // Look past whitespace for the next element, which may be the caption.
            let next = i + 1;
            while (next < children.length && children[next].type === 'text' && children[next].value.trim() === '') {
              next++;
            }
            const sibling = children[next];
            const emphasis = sibling && sibling.type === 'element' && sibling.tagName === 'p'
              ? soleElement(sibling, 'em')
              : null;

            if (emphasis) {
              // The figure takes the image's width. A caption is usually longer than the
              // thumbnail above it, so otherwise the figure's intrinsic width is the
              // caption's, and a row of four 188px images no longer fits its container.
              const width = /(?:^|;)(width:\d+px)/.exec(image.properties?.style ?? '')?.[1];
              out.push({
                type: 'element',
                tagName: 'figure',
                properties: width ? { style: width } : {},
                children: [
                  image,
                  { type: 'element', tagName: 'figcaption', properties: {}, children: emphasis.children },
                ],
              });
              i = next;
              continue;
            }
          }

          visit(current);
          out.push(current);
        }
        node.children = out;
      }
    };
    visit(tree);
  };
}
