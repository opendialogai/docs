import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emitFrontmatter, parseFrontmatter, takeTitle } from './frontmatter.mjs';

test('a file with no frontmatter returns the whole text as body', () => {
  assert.deepEqual(parseFrontmatter('# Title\n'), { data: {}, body: '# Title\n' });
});

test('a plain scalar description is read', () => {
  const { data, body } = parseFrontmatter('---\ndescription: Hello there\n---\n\n# T\n');
  assert.equal(data.description, 'Hello there');
  assert.equal(body, '\n# T\n');
});

test('a folded block scalar is folded into one line', () => {
  // 29 of 71 descriptions use this form. A line-based parser drops them all.
  const text =
    '---\ndescription: >-\n  Before jumping into the build process, you need a clear\n' +
    '  understanding of the key building blocks.\n---\n\n# T\n';
  assert.equal(
    parseFrontmatter(text).data.description,
    'Before jumping into the build process, you need a clear understanding of the key building blocks.'
  );
});

test('hidden is parsed so the caller can drop it deliberately', () => {
  assert.equal(parseFrontmatter('---\nhidden: true\n---\n\n# T\n').data.hidden, 'true');
});

test('quoted scalars are unquoted', () => {
  assert.equal(parseFrontmatter("---\ndescription: 'a: b'\n---\n").data.description, 'a: b');
});

test('an unrecognised YAML construct throws rather than losing data', () => {
  assert.throws(() => parseFrontmatter('---\ntags:\n  - a\n  - b\n---\n'), /unsupported/i);
  assert.throws(() => parseFrontmatter('---\ndescription: |\n  literal\n---\n'), /unsupported/i);
});

test('emitFrontmatter writes title and description', () => {
  assert.equal(
    emitFrontmatter({ title: 'Getting ready', description: 'Some text' }),
    '---\ntitle: Getting ready\ndescription: Some text\n---\n'
  );
});

test('emitFrontmatter omits an absent or empty description', () => {
  assert.equal(emitFrontmatter({ title: 'T' }), '---\ntitle: T\n---\n');
  assert.equal(emitFrontmatter({ title: 'T', description: '' }), '---\ntitle: T\n---\n');
});

test('emitFrontmatter quotes values that YAML would misread', () => {
  assert.equal(
    emitFrontmatter({ title: 'Semantic Classifier: Query Classifier' }),
    "---\ntitle: 'Semantic Classifier: Query Classifier'\n---\n"
  );
  assert.equal(
    emitFrontmatter({ title: '[Deprecated] webhook actions' }),
    "---\ntitle: '[Deprecated] webhook actions'\n---\n"
  );
});

test('emitFrontmatter doubles single quotes inside a quoted value', () => {
  assert.equal(
    emitFrontmatter({ title: "Don't: stop" }),
    "---\ntitle: 'Don''t: stop'\n---\n"
  );
});

test('parse then emit round trips a folded description', () => {
  const { data } = parseFrontmatter('---\ndescription: >-\n  a\n  b\n---\n');
  assert.equal(emitFrontmatter({ title: 'T', description: data.description }),
    '---\ntitle: T\ndescription: a b\n---\n');
});

test('takeTitle removes the H1 and returns its text', () => {
  assert.deepEqual(takeTitle('# Getting ready\n\nBody text.\n'), {
    title: 'Getting ready',
    body: '\nBody text.\n',
  });
});

test('takeTitle strips inline tags and unescapes brackets', () => {
  assert.equal(takeTitle('# \\[Deprecated] webhook actions\n').title, '[Deprecated] webhook actions');
  assert.equal(takeTitle('# Best <mark>practices</mark>\n').title, 'Best practices');
});

test('takeTitle ignores a # line inside a fenced code block', () => {
  // Four source files open a shell fence with a comment; that must not become the title.
  const body = '```bash\n# Install the CLI\n```\n\n# Real title\n';
  const { title, body: rest } = takeTitle(body);
  assert.equal(title, 'Real title');
  assert.ok(rest.includes('# Install the CLI'), 'the fenced comment must survive');
});

test('takeTitle removes only the first H1', () => {
  const { title, body } = takeTitle('# One\n\n# Two\n');
  assert.equal(title, 'One');
  assert.ok(body.includes('# Two'));
});

test('takeTitle returns null when there is no H1', () => {
  assert.equal(takeTitle('Just prose.\n').title, null);
});
