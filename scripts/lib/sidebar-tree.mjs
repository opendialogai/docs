/**
 * Turns the flat SUMMARY.md entry list into Starlight's nested sidebar shape.
 *
 * Starlight groups are not linkable — SidebarGroupSchema has no `link` field — so an entry
 * that is both a page and a parent becomes a group whose first item is the page itself,
 * carrying the same label. That keeps every SUMMARY.md label exact, keeps all 204 pages
 * reachable from the nav, and invents no text. A clickable group needs a Sidebar component
 * override, which is Phase 4 chrome work.
 */

/** Builds the ordered section groups for Starlight's `sidebar` option. */
export function buildSidebar(entries, slugFor) {
  const groups = [];
  const stack = [];

  // Build a plain tree first. Every node carries a `children` array, always present so there
  // is no lazy-initialisation case to get wrong; the shaping pass below decides which nodes
  // actually became parents.
  for (const entry of entries) {
    if (!groups.length || groups.at(-1).label !== entry.section.label) {
      groups.push({ label: entry.section.label, children: [] });
      stack.length = 0;
    }
    while (stack.length && stack.at(-1).depth >= entry.depth) stack.pop();

    const node = { label: entry.label, slug: slugFor(entry.source), children: [] };
    const siblings = stack.length ? stack.at(-1).node.children : groups.at(-1).children;
    siblings.push(node);
    stack.push({ depth: entry.depth, node });
  }

  // A node with children becomes a group. Starlight cannot link a group, so the page keeps
  // its own entry as that group's first item, carrying the same label; the Sidebar override
  // promotes that first item into the group's own row rather than repeating it.
  //
  // Nested groups start collapsed. Starlight opens a collapsed group when it contains the
  // current page, so the nav opens along the path to the page being read and nothing else —
  // GitBook's behaviour. Sections are deliberately left expanded, as they are there.
  const shape = (node) =>
    node.children.length
      ? {
          label: node.label,
          collapsed: true,
          items: [{ label: node.label, slug: node.slug }, ...node.children.map(shape)],
        }
      : { label: node.label, slug: node.slug };

  return groups.map((group) => ({ label: group.label, items: group.children.map(shape) }));
}
