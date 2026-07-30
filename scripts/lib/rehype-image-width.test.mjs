import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rehypeImageWidth } from './rehype-image-width.mjs';

/** Minimal hast helpers — enough to exercise the plugin without pulling in a parser. */
const img = (properties) => ({ type: 'element', tagName: 'img', properties, children: [] });
const tree = (...children) => ({ type: 'root', children });

const run = (node) => {
  rehypeImageWidth()(node);
  return node;
};

test('a numeric title becomes a width and the title is removed', () => {
  const node = img({ src: '/a.png', alt: '', title: '375' });
  run(tree(node));
  assert.equal(node.properties.title, undefined);
  assert.equal(node.properties.style, 'width:375px');
});

test('an existing style is preserved and the width appended', () => {
  const node = img({ src: '/a.png', title: '188', style: 'border:0' });
  run(tree(node));
  assert.equal(node.properties.style, 'border:0;width:188px');
});

test('a non-numeric title is left alone as a real title', () => {
  const node = img({ src: '/a.png', title: 'A real tooltip' });
  run(tree(node));
  assert.equal(node.properties.title, 'A real tooltip');
  assert.equal(node.properties.style, undefined);
});

test('an image with no title is untouched', () => {
  const node = img({ src: '/a.png', alt: 'x' });
  run(tree(node));
  assert.deepEqual(node.properties, { src: '/a.png', alt: 'x' });
});

test('a title on a non-image element is left alone', () => {
  const node = { type: 'element', tagName: 'a', properties: { href: '/x', title: '375' }, children: [] };
  run(tree(node));
  assert.equal(node.properties.title, '375');
  assert.equal(node.properties.style, undefined);
});

test('nested images are reached', () => {
  const node = img({ src: '/a.png', title: '200' });
  run(tree({ type: 'element', tagName: 'p', properties: {}, children: [node] }));
  assert.equal(node.properties.style, 'width:200px');
});

test('a zero or negative width is treated as a real title, not a width', () => {
  const zero = img({ src: '/a.png', title: '0' });
  run(tree(zero));
  assert.equal(zero.properties.title, '0');
  assert.equal(zero.properties.style, undefined);
});
