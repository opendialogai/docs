import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  convertCode,
  convertColumns,
  convertEmbeds,
  convertFile,
  convertHints,
  convertSteppers,
  isVideoEmbed,
  stripEntities,
} from './gitbook-blocks.mjs';

test('each hint style maps to its Starlight aside', () => {
  const cases = [
    ['info', 'note'],
    ['success', 'tip'],
    ['warning', 'caution'],
    ['danger', 'danger'],
  ];
  for (const [style, aside] of cases) {
    assert.equal(
      convertHints(`{% hint style="${style}" %}\nBody\n{% endhint %}`),
      `:::${aside}\nBody\n:::`
    );
  }
});

test('hints inside a fence are left alone', () => {
  const input = '```\n{% hint style="info" %}\n```';
  assert.equal(convertHints(input), input);
});

test('convertCode moves title onto the fence info string', () => {
  assert.equal(
    convertCode('{% code title="index.html" %}\n```html\n<p></p>\n```\n{% endcode %}'),
    '```html title="index.html"\n<p></p>\n```'
  );
});

test('convertCode maps lineNumbers to showLineNumbers', () => {
  assert.equal(
    convertCode('{% code lineNumbers="true" %}\n```json\n{}\n```\n{% endcode %}'),
    '```json showLineNumbers\n{}\n```'
  );
});

test('convertCode drops fullWidth, which Expressive Code has no equivalent for', () => {
  assert.equal(
    convertCode('{% code fullWidth="false" %}\n```ts\nx\n```\n{% endcode %}'),
    '```ts\nx\n```'
  );
});

test('convertCode preserves a fence with no language', () => {
  assert.equal(
    convertCode('{% code title="t" %}\n```\nx\n```\n{% endcode %}'),
    '``` title="t"\nx\n```'
  );
});

test('convertCode leaves an ordinary fence untouched', () => {
  const input = '```js\nconst a = 1;\n```';
  assert.equal(convertCode(input), input);
});

test('convertFile becomes a link whose text is the basename', () => {
  assert.equal(
    convertFile('{% file src="../../.gitbook/assets/DeliveryKnowledgeBase.csv" %}'),
    '[DeliveryKnowledgeBase.csv](</.gitbook/assets/DeliveryKnowledgeBase.csv>)'
  );
});

test('with no map at all convertFile keeps the placeholder form', () => {
  assert.equal(
    convertFile('{% file src="../../.gitbook/assets/DeliveryKnowledgeBase.csv" %}', { assets: null }),
    '[DeliveryKnowledgeBase.csv](</.gitbook/assets/DeliveryKnowledgeBase.csv>)'
  );
});

test('a mapped file block emits the map reference, unwrapped when it needs no angle brackets', () => {
  const assets = {
    'DeliveryKnowledgeBase.csv': {
      slug: 'deliveryknowledgebase.csv',
      kind: 'file',
      reference: '/files/deliveryknowledgebase.csv',
      hash: 'z',
    },
  };
  assert.equal(
    convertFile('{% file src="../../.gitbook/assets/DeliveryKnowledgeBase.csv" %}', { assets }),
    '[DeliveryKnowledgeBase.csv](/files/deliveryknowledgebase.csv)'
  );
});

test('a file block missing from an existing map throws', () => {
  assert.throws(
    () => convertFile('{% file src="../../.gitbook/assets/gone.csv" %}', { assets: {} }),
    /gone\.csv/
  );
});

test('an end-of-line entity is stripped, not turned into a trailing space', () => {
  // "word &#x20;" -> "word  " would be a markdown hard break the live site does not render.
  assert.equal(stripEntities('Put a JSON payload here.&#x20;'), 'Put a JSON payload here.');
  assert.equal(stripEntities('Best practices &#x20;'), 'Best practices ');
});

test('a mid-line entity becomes a single space', () => {
  assert.equal(stripEntities('* &#x20;**Anonymous Authentication**'), '*  **Anonymous Authentication**');
  assert.equal(stripEntities('&#x20;We split the update'), ' We split the update');
});

test('entities inside a fence are left alone', () => {
  const input = '```\n&#x20;\n```';
  assert.equal(stripEntities(input), input);
});

test('two or more real spaces before an end-of-line entity collapse to one', () => {
  // Stripping only the trailing entity here would leave "a.  " (two real trailing spaces), a
  // markdown hard break the source never had: those two spaces were followed by literal entity
  // text, not a line ending.
  assert.equal(stripEntities('a.  &#x20;'), 'a. ');
  // constructing-messages.md's shape: a mid-line entity, then real spaces, then a trailing entity.
  assert.equal(stripEntities('&#x20;  &#x20;'), ' ');
});

test('an unrecognised hint style throws rather than falling back to note', () => {
  assert.throws(
    () => convertHints('{% hint style="note" %}\nBody\n{% endhint %}'),
    /unsupported hint style: note/
  );
});

test('a self-closing embed becomes a raw iframe figure, needing no component', () => {
  const out = convertEmbeds('{% embed url="https://youtu.be/RhUc_mgkNl8" %}');
  assert.match(out, /^<figure class="od-embed">/);
  assert.match(out, /src="https:\/\/www\.youtube-nocookie\.com\/embed\/RhUc_mgkNl8"/);
  assert.match(out, /<\/iframe>/, 'the iframe is closed rather than self-closed, so it parses as both HTML and MDX');
  assert.equal(/<figcaption/.test(out), false, 'no caption was given');
  assert.equal(out.includes('<Embed'), false);
});

test('an embed with a caption renders it as a figcaption and the iframe title', () => {
  const out = convertEmbeds('{% embed url="https://www.loom.com/share/abc" %}\nBuilding an agent\n{% endembed %}');
  assert.match(out, /src="https:\/\/www\.loom\.com\/embed\/abc"/);
  assert.match(out, /title="Building an agent"/);
  assert.match(out, /<figcaption>Building an agent<\/figcaption>/);
});

test('an uncaptioned embed still carries an accessible iframe title', () => {
  const out = convertEmbeds('{% embed url="https://youtu.be/x" %}');
  assert.match(out, /title="Embedded video"/);
});

test('a loom share URL keeps only its id, dropping any query string', () => {
  const out = convertEmbeds('{% embed url="https://www.loom.com/share/abc?sid=123" %}');
  assert.match(out, /src="https:\/\/www\.loom\.com\/embed\/abc"/);
});

test('a youtube watch URL becomes its nocookie embed form', () => {
  const out = convertEmbeds('{% embed url="https://www.youtube.com/watch?v=abc123" %}');
  assert.match(out, /src="https:\/\/www\.youtube-nocookie\.com\/embed\/abc123"/);
});

test('a caption containing a double quote is escaped in both places it appears', () => {
  const out = convertEmbeds('{% embed url="https://youtu.be/x" %}\nThe "best" way\n{% endembed %}');
  assert.match(out, /title="The &quot;best&quot; way"/);
  assert.match(out, /<figcaption>The &quot;best&quot; way<\/figcaption>/);
  assert.equal(out.includes('"best"'), false);
});

test('a non-video embed becomes a plain link and needs no component', () => {
  assert.equal(
    convertEmbeds('{% embed url="https://webaim.org/resources/contrastchecker/" %}'),
    '[https://webaim.org/resources/contrastchecker/](https://webaim.org/resources/contrastchecker/)'
  );
});

test('isVideoEmbed recognises Loom and YouTube only', () => {
  assert.equal(isVideoEmbed('https://youtu.be/x'), true);
  assert.equal(isVideoEmbed('https://www.youtube.com/watch?v=x'), true);
  assert.equal(isVideoEmbed('https://www.loom.com/share/x'), true);
  assert.equal(isVideoEmbed('https://www.fetchify.com/address-auto-complete'), false);
});

test('a loom.com URL not in /share/ form is not an embeddable shape', () => {
  assert.equal(isVideoEmbed('https://www.loom.com/embed/x'), false);
});

test('a youtube.com/watch URL with no v parameter is not an embeddable shape', () => {
  assert.equal(isVideoEmbed('https://www.youtube.com/watch'), false);
});

test('an embed inside a list item keeps that indentation', () => {
  // Emitted at column 0 the figure closes the enclosing list, which on
  // ai-agent-creation-overview breaks <Steps> — it requires a single <ol> child.
  const out = convertEmbeds('    {% embed url="https://youtu.be/x" %}');
  for (const line of out.split('\n')) {
    assert.match(line, /^    \S/, `line not indented: ${JSON.stringify(line)}`);
  }
});

test('an indented non-video embed keeps its indentation too', () => {
  assert.equal(
    convertEmbeds('    {% embed url="https://webaim.org/x" %}'),
    '    [https://webaim.org/x](https://webaim.org/x)'
  );
});

test('a loom.com URL not in /share/ form becomes a plain link, not an embed', () => {
  assert.equal(
    convertEmbeds('{% embed url="https://www.loom.com/embed/abc" %}'),
    '[https://www.loom.com/embed/abc](https://www.loom.com/embed/abc)'
  );
});

test('a youtube.com/watch URL with no v parameter becomes a plain link, not an Embed', () => {
  assert.equal(
    convertEmbeds('{% embed url="https://www.youtube.com/watch" %}'),
    '[https://www.youtube.com/watch](https://www.youtube.com/watch)'
  );
});

test('a stepper becomes a Steps ordered list with indented bodies', () => {
  const input = [
    '{% stepper %}',
    '{% step %}',
    '### Navigate to the Secret Context',
    '',
    'Open the Secret Management page.',
    '{% endstep %}',
    '{% step %}',
    '### Add a secret',
    '{% endstep %}',
    '{% endstepper %}',
  ].join('\n');
  assert.equal(
    convertSteppers(input),
    [
      '<Steps>',
      '',
      '1. ### Navigate to the Secret Context',
      '',
      '   Open the Secret Management page.',
      '',
      '2. ### Add a secret',
      '',
      '</Steps>',
    ].join('\n')
  );
});

test('a step missing {% endstep %} throws instead of silently dropping its content', () => {
  const input = [
    '{% stepper %}',
    '{% step %}',
    '### Step one',
    '{% step %}',
    '### Step two',
    '{% endstep %}',
    '{% endstepper %}',
  ].join('\n');
  assert.throws(() => convertSteppers(input), /step 1 is missing \{% endstep %\}/);
});

test('two separate stepper blocks in one file each renumber their steps from 1', () => {
  const input = [
    '{% stepper %}',
    '{% step %}',
    '### A1',
    '{% endstep %}',
    '{% step %}',
    '### A2',
    '{% endstep %}',
    '{% endstepper %}',
    '',
    '{% stepper %}',
    '{% step %}',
    '### B1',
    '{% endstep %}',
    '{% step %}',
    '### B2',
    '{% endstep %}',
    '{% endstepper %}',
  ].join('\n');
  const out = convertSteppers(input);
  assert.equal((out.match(/<Steps>/g) ?? []).length, 2);
  assert.equal((out.match(/<\/Steps>/g) ?? []).length, 2);
  assert.ok(out.includes('1. ### A1'));
  assert.ok(out.includes('2. ### A2'));
  assert.ok(out.includes('1. ### B1'));
  assert.ok(out.includes('2. ### B2'));
});

test('{% endstepper %} arriving with an open step throws', () => {
  const input = ['{% stepper %}', '{% step %}', '### Step one', '{% endstepper %}'].join('\n');
  assert.throws(() => convertSteppers(input), /step 1 is missing \{% endstep %\}/);
});

test('an unterminated stepper at end of input throws', () => {
  const input = ['{% stepper %}', '{% step %}', '### Step one', '{% endstep %}'].join('\n');
  assert.throws(() => convertSteppers(input), /\{% stepper %\} is missing \{% endstepper %\}/);
});

test('a stray {% endstep %} with no open step throws', () => {
  const input = ['{% stepper %}', '{% endstep %}', '{% endstepper %}'].join('\n');
  assert.throws(() => convertSteppers(input), /\{% endstep %\} with no matching \{% step %\}/);
});

test('columns becomes a CardGrid and the fenced code inside survives', () => {
  const input = [
    '{% columns %}',
    '{% column %}',
    'Do',
    '```json',
    '{ "firstName": "{first_name}" }',
    '```',
    '{% endcolumn %}',
    '{% column %}',
    "Don't",
    '{% endcolumn %}',
    '{% endcolumns %}',
  ].join('\n');
  const out = convertColumns(input);
  assert.match(out, /^<CardGrid>/);
  assert.match(out, /<\/CardGrid>$/);
  assert.ok(out.includes('{ "firstName": "{first_name}" }'), 'fenced code must survive verbatim');
  assert.ok(!out.includes('{% column'), 'no column markers may remain');
});
