import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rehypeFigures } from './rehype-figures.mjs';

const el = (tagName, children = [], properties = {}) => ({ type: 'element', tagName, properties, children });
const text = (value) => ({ type: 'text', value });
const img = (props = { src: '/a.png' }) => el('img', [], props);
const root = (...children) => ({ type: 'root', properties: {}, children });

const run = (tree) => {
  rehypeFigures()(tree);
  return tree;
};

test('an image paragraph followed by an italic paragraph becomes a figure', () => {
  const tree = run(root(el('p', [img()]), text('\n'), el('p', [el('em', [text('A caption')])])));
  assert.equal(tree.children.length, 1);
  const [figure] = tree.children;
  assert.equal(figure.tagName, 'figure');
  assert.equal(figure.children[0].tagName, 'img');
  assert.equal(figure.children[1].tagName, 'figcaption');
  assert.deepEqual(figure.children[1].children, [text('A caption')]);
});

test('the caption keeps its inline markup but loses the wrapping emphasis', () => {
  const caption = el('em', [text('See '), el('code', [text('attr')])]);
  const tree = run(root(el('p', [img()]), el('p', [caption])));
  const figcaption = tree.children[0].children[1];
  assert.equal(figcaption.children.length, 2);
  assert.equal(figcaption.children[1].tagName, 'code');
  assert.equal(figcaption.children.some((c) => c.tagName === 'em'), false);
});

test('an image with no caption is left as it was', () => {
  const tree = run(root(el('p', [img()]), el('p', [text('Ordinary prose')])));
  assert.equal(tree.children.length, 2);
  assert.equal(tree.children[0].tagName, 'p');
});

test('an italic paragraph not preceded by an image is left alone', () => {
  const tree = run(root(el('p', [text('prose')]), el('p', [el('em', [text('emphasis')])])));
  assert.equal(tree.children.length, 2);
  assert.equal(tree.children.every((c) => c.tagName === 'p'), true);
});

test('a paragraph holding an image plus other text is not a figure', () => {
  const tree = run(root(el('p', [img(), text(' trailing')]), el('p', [el('em', [text('c')])])));
  assert.equal(tree.children.length, 2);
  assert.equal(tree.children[0].tagName, 'p');
});

test('an italic paragraph with trailing text is not treated as a caption', () => {
  const tree = run(root(el('p', [img()]), el('p', [el('em', [text('c')]), text(' and more')])));
  assert.equal(tree.children.length, 2);
});

test('figures are found inside a wrapper div', () => {
  const div = el('div', [el('p', [img()]), el('p', [el('em', [text('cap')])])]);
  const tree = run(root(div));
  assert.equal(div.children.length, 1);
  assert.equal(div.children[0].tagName, 'figure');
});

test('consecutive image and caption pairs each become their own figure', () => {
  const tree = run(
    root(
      el('p', [img({ src: '/a.png' })]),
      el('p', [el('em', [text('one')])]),
      el('p', [img({ src: '/b.png' })]),
      el('p', [el('em', [text('two')])])
    )
  );
  assert.equal(tree.children.length, 2);
  assert.deepEqual(tree.children.map((c) => c.tagName), ['figure', 'figure']);
  assert.equal(tree.children[1].children[1].children[0].value, 'two');
});

test("the figure takes the image's width so the caption cannot widen the row", () => {
  // A caption is usually longer than a small thumbnail, so without this the figure's
  // intrinsic width is the caption's and a row of four 188px images no longer fits.
  const tree = run(
    root(el('p', [img({ src: '/a.png', style: 'width:188px' })]), el('p', [el('em', [text('A fairly long caption')])]))
  );
  assert.equal(tree.children[0].properties.style, 'width:188px');
});

test('a figure whose image has no width gets none', () => {
  const tree = run(root(el('p', [img()]), el('p', [el('em', [text('c')])])));
  assert.equal(tree.children[0].properties.style, undefined);
});

test('an image whose paragraph carries a link is left alone', () => {
  const tree = run(root(el('p', [el('a', [img()])]), el('p', [el('em', [text('c')])])));
  assert.equal(tree.children[0].tagName, 'p');
});
