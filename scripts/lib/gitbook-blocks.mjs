/**
 * Converts GitBook's {% %} block syntax to Starlight equivalents.
 *
 * Hints, code and file blocks need no component, so a file containing only these stays .md.
 */
import { mapLines, protectCode } from './segments.mjs';

const ASIDE = { info: 'note', success: 'tip', warning: 'caution', danger: 'danger' };

/**
 * Folds {% code %} attributes into the fence's info string.
 *
 * Must run before any fence-aware pass: this block wraps a fence, so removing its markers
 * changes what the fence scanner sees.
 */
export function convertCode(text) {
  return text.replace(
    /^[ \t]*\{%\s*code([^%]*)%\}\n([ \t]*)(`{3,}|~{3,})([^\n]*)\n([\s\S]*?\n)[ \t]*\3[^\n]*\n[ \t]*\{%\s*endcode\s*%\}[ \t]*$/gm,
    (_, attrs, indent, fence, lang, body) => {
      const attributes = [];
      const title = attrs.match(/title="([^"]*)"/);
      if (title) attributes.push(`title="${title[1]}"`);
      if (/lineNumbers="true"/.test(attrs)) attributes.push('showLineNumbers');
      const suffix = attributes.length ? ` ${attributes.join(' ')}` : '';
      return `${indent}${fence}${lang.trim()}${suffix}\n${body}${indent}${fence}`;
    }
  );
}

/**
 * Removes GitBook's &#x20; entity, of which there are 1,203.
 *
 * 1,192 sit at end of line, where the entity is a no-op trailing space. Replacing those with a
 * literal space would leave "…  \n" on the 84 lines that already end in a space, which markdown
 * renders as a <br> the live site does not have. Only the 11 mid-line occurrences are real.
 *
 * A handful of those 84 already end in two or more real spaces before the entity. Stripping only
 * the entity would expose that run at the true end of line and create the same unwanted <br>, so
 * any such run is collapsed to a single trailing space rather than left as-is.
 */
export function stripEntities(text) {
  return mapLines(text, (line) => {
    if (!line.includes('&#x20;')) return line;
    return line.replace(/&#x20;$/, '').replaceAll('&#x20;', ' ').replace(/ {2,}$/, ' ');
  });
}

/**
 * Maps {% hint %} blocks to Starlight asides.
 *
 * An unrecognised style throws rather than falling back to a default: a fifth style introduced
 * by a later GitBook sync would otherwise coerce silently to `note` and still count as a
 * converted aside, defeating convert.mjs's 258-aside invariant.
 */
export function convertHints(text) {
  return mapLines(text, (line) => {
    const open = line.match(/^[ \t]*\{%\s*hint\s+style="([a-z]+)"\s*%\}[ \t]*$/);
    if (open) {
      const aside = ASIDE[open[1]];
      if (!aside) throw new Error(`unsupported hint style: ${open[1]}`);
      return `:::${aside}`;
    }
    if (/^[ \t]*\{%\s*endhint\s*%\}[ \t]*$/.test(line)) return ':::';
    return line;
  });
}

/** Turns the single {% file %} block into a markdown link to a Phase 3 asset placeholder. */
export function convertFile(text) {
  return mapLines(text, (line) => {
    const match = line.match(/^[ \t]*\{%\s*file\s+src="([^"]+)"\s*%\}[ \t]*$/);
    if (!match) return line;
    const name = match[1].split('/').pop();
    return `[${name}](</.gitbook/assets/${name}>)`;
  });
}

const VIDEO = /^(youtu\.be|youtube\.com|loom\.com)$/;

/** True when an embed URL is one the Embed component can render as an iframe. */
export function isVideoEmbed(url) {
  try {
    return VIDEO.test(new URL(url).hostname.replace(/^www\./, ''));
  } catch {
    return false;
  }
}

/** Escapes a caption for use inside a double-quoted JSX attribute. */
function attribute(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/** Renders one embed. Non-video URLs become autolinks and so need no component. */
function renderEmbed(url, title) {
  if (!isVideoEmbed(url)) return `<${url}>`;
  return title ? `<Embed url="${url}" title="${attribute(title)}" />` : `<Embed url="${url}" />`;
}

/**
 * Converts {% embed %} blocks. 36 of the 38 are Loom or YouTube and become <Embed>; the other
 * two are ordinary web pages and become autolinks, so they do not promote a file to .mdx.
 *
 * Done with regex under protectCode rather than a line state machine because no embed block
 * wraps a fenced code block — measured across the corpus, only {% columns %} does — and a
 * state machine would need an end-of-input flush for the 19 self-closing form.
 */
export function convertEmbeds(text) {
  return protectCode(text, (masked) =>
    masked
      .replace(
        /^[ \t]*\{%\s*embed\s+url="([^"]+)"[^%]*%\}\n([\s\S]*?)\n[ \t]*\{%\s*endembed\s*%\}[ \t]*$/gm,
        (_, url, caption) => renderEmbed(url, caption.replace(/\s+/g, ' ').trim())
      )
      .replace(/^[ \t]*\{%\s*embed\s+url="([^"]+)"[^%]*%\}[ \t]*$/gm, (_, url) => renderEmbed(url, ''))
  );
}

/**
 * Converts {% stepper %} to a Starlight <Steps> ordered list.
 *
 * Throws on any shape where a step's boundaries are ambiguous — an unclosed step, an
 * unclosed stepper, or an {% endstep %} with nothing open — rather than silently discarding
 * or misnumbering content. Matches convertHints's precedent: a shape a later GitBook sync
 * introduces must fail loudly at cutover, not degrade silently past every build gate.
 */
export function convertSteppers(text) {
  let inStepper = false;
  let number = 0;
  let body = null;
  const out = mapLines(text, (line) => {
    if (/^[ \t]*\{%\s*stepper\s*%\}[ \t]*$/.test(line)) {
      inStepper = true;
      number = 0;
      return ['<Steps>', ''];
    }
    if (/^[ \t]*\{%\s*endstepper\s*%\}[ \t]*$/.test(line)) {
      if (body !== null) throw new Error(`step ${number} is missing {% endstep %}`);
      inStepper = false;
      return ['</Steps>'];
    }
    if (!inStepper) return line;
    if (/^[ \t]*\{%\s*step\s*%\}[ \t]*$/.test(line)) {
      if (body !== null) throw new Error(`step ${number} is missing {% endstep %}`);
      number++;
      body = [];
      return [];
    }
    if (/^[ \t]*\{%\s*endstep\s*%\}[ \t]*$/.test(line)) {
      if (body === null) throw new Error('{% endstep %} with no matching {% step %}');
      const lines = body;
      while (lines.length && lines.at(-1).trim() === '') lines.pop();
      const [first, ...rest] = lines;
      body = null;
      return [`${number}. ${first ?? ''}`, ...rest.map((l) => (l.trim() === '' ? '' : `   ${l}`)), ''];
    }
    if (body !== null) {
      body.push(line);
      return [];
    }
    return line;
  });
  if (inStepper) {
    if (body !== null) throw new Error(`step ${number} is missing {% endstep %}`);
    throw new Error('{% stepper %} is missing {% endstepper %}');
  }
  return out;
}

/** Converts the single {% columns %} block to a CardGrid. */
export function convertColumns(text) {
  return mapLines(text, (line) => {
    if (/^[ \t]*\{%\s*columns\s*%\}[ \t]*$/.test(line)) return '<CardGrid>';
    if (/^[ \t]*\{%\s*endcolumns\s*%\}[ \t]*$/.test(line)) return '</CardGrid>';
    if (/^[ \t]*\{%\s*(end)?column\s*%\}[ \t]*$/.test(line)) return [];
    return line;
  });
}
