import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSidebar } from './sidebar-tree.mjs';

const slugFor = (source) => source.replace(/(^|\/)README\.md$/, '').replace(/\.md$/, '');
const section = { label: 'CORE CONCEPTS', slug: 'core-concepts' };

test('a section becomes a top-level group', () => {
  const entries = [{ depth: 0, label: 'Model', source: 'model.md', section }];
  assert.deepEqual(buildSidebar(entries, slugFor), [
    { label: 'CORE CONCEPTS', items: [{ label: 'Model', slug: 'model' }] },
  ]);
});

test('a parent page becomes a group whose first item is the page itself', () => {
  const entries = [
    { depth: 0, label: 'Message design', source: 'design/README.md', section },
    { depth: 2, label: 'Text message', source: 'design/text.md', section },
  ];
  assert.deepEqual(buildSidebar(entries, slugFor), [
    {
      label: 'CORE CONCEPTS',
      items: [
        {
          label: 'Message design',
          collapsed: true,
          items: [
            { label: 'Message design', slug: 'design' },
            { label: 'Text message', slug: 'design/text' },
          ],
        },
      ],
    },
  ]);
});

test('nesting continues to arbitrary depth', () => {
  const entries = [
    { depth: 0, label: 'A', source: 'a/README.md', section },
    { depth: 2, label: 'B', source: 'a/b/README.md', section },
    { depth: 4, label: 'C', source: 'a/b/c.md', section },
  ];
  const [group] = buildSidebar(entries, slugFor);
  assert.deepEqual(group.items[0].items[1], {
    label: 'B',
    collapsed: true,
    items: [
      { label: 'B', slug: 'a/b' },
      { label: 'C', slug: 'a/b/c' },
    ],
  });
});

test('a nested group starts collapsed, a section does not', () => {
  const entries = [
    { depth: 0, label: 'Message design', source: 'design/README.md', section },
    { depth: 2, label: 'Text message', source: 'design/text.md', section },
  ];
  const [group] = buildSidebar(entries, slugFor);
  // Starlight opens a collapsed group when it holds the current page, so collapsing
  // nested groups leaves the nav open exactly along the path to the page being read —
  // which is what GitBook shows. Sections stay expanded there, so they are left alone.
  assert.equal(group.collapsed, undefined);
  assert.equal(group.items[0].collapsed, true);
});

test('a leaf carries no collapsed flag', () => {
  const entries = [{ depth: 0, label: 'Model', source: 'model.md', section }];
  const [group] = buildSidebar(entries, slugFor);
  assert.equal('collapsed' in group.items[0], false);
});

test('the root README becomes the empty slug', () => {
  const entries = [{ depth: 0, label: 'Introduction', source: 'README.md', section }];
  assert.deepEqual(buildSidebar(entries, slugFor)[0].items, [{ label: 'Introduction', slug: '' }]);
});

test('sections keep SUMMARY.md order', () => {
  const other = { label: 'RELEASE NOTES', slug: 'release-notes' };
  const entries = [
    { depth: 0, label: 'A', source: 'a.md', section },
    { depth: 0, label: 'R', source: 'r.md', section: other },
  ];
  assert.deepEqual(buildSidebar(entries, slugFor).map((g) => g.label), ['CORE CONCEPTS', 'RELEASE NOTES']);
});
