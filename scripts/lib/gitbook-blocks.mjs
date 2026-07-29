/**
 * Converts GitBook's {% %} block syntax to Starlight equivalents.
 *
 * Hints, code and file blocks need no component, so a file containing only these stays .md.
 */
import { mapLines } from './segments.mjs';

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
