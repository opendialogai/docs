/**
 * GitBook frontmatter in, Starlight frontmatter out.
 *
 * The corpus uses exactly two YAML scalar forms: plain, and folded block scalars ( >- ) which
 * carry 29 of the 71 page descriptions. Anything else throws, so a shape that appears in a
 * later GitBook sync fails loudly at cutover instead of silently dropping a description.
 *
 * Title derivation lives here too: Starlight takes the title from frontmatter, but GitBook
 * keeps it as the body's H1, so the two belong together.
 */
import { mapLines } from './segments.mjs';

const KEY = /^([A-Za-z_][\w-]*):[ \t]*(.*)$/;

/** Strips matching surrounding quotes from a plain YAML scalar. */
function unquote(value) {
  const match = value.match(/^(['"])([\s\S]*)\1$/);
  return match ? match[2].replace(/''/g, "'") : value;
}

/**
 * Splits leading YAML frontmatter from the markdown body.
 *
 * Returns every key as a string; the caller decides which to keep. `hidden` in particular is
 * parsed but must be dropped by the caller — the two pages carrying it are both live.
 */
export function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { data: {}, body: text };

  const data = {};
  const lines = match[1].split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') continue;
    const kv = line.match(KEY);
    if (!kv) throw new Error(`unsupported YAML in frontmatter: ${JSON.stringify(line)}`);
    const [, key, rest] = kv;

    if (rest === '>-' || rest === '>') {
      const folded = [];
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) folded.push(lines[++i].trim());
      data[key] = folded.join(' ');
      continue;
    }
    if (rest.startsWith('|')) {
      throw new Error(`unsupported YAML literal block scalar for key ${key}`);
    }
    if (rest === '') throw new Error(`unsupported YAML nested value for key ${key}`);
    data[key] = unquote(rest.trim());
  }
  return { data, body: text.slice(match[0].length) };
}

/** True when a value must be single-quoted to survive a YAML round trip. */
function needsQuoting(value) {
  return /^[\s>|*&!%@`'"[{#-]/.test(value) || /: |:$|\s#|\s$/.test(value);
}

/** Serialises one scalar, quoting only when YAML would otherwise misread it. */
function scalar(value) {
  return needsQuoting(value) ? `'${value.replace(/'/g, "''")}'` : value;
}

/** Emits the Starlight frontmatter block, including its trailing newline. */
export function emitFrontmatter({ title, description }) {
  const lines = ['---', `title: ${scalar(title)}`];
  if (description) lines.push(`description: ${scalar(description)}`);
  lines.push('---', '');
  return lines.join('\n');
}

/**
 * Removes the first H1 from the body and returns its text.
 *
 * Starlight renders the frontmatter title as the page heading, so leaving the H1 in place
 * would show it twice. Uses mapLines so a "# comment" opening a shell fence — which four
 * source files have — is never mistaken for the title.
 *
 * Strips GitBook's &#x20; entity here too: the title is lifted out of the body before
 * stripEntities ever runs over it, so a title carrying the entity (one does) would otherwise
 * reach the emitted frontmatter untouched.
 */
export function takeTitle(body) {
  let title = null;
  const rest = mapLines(body, (line) => {
    if (title !== null) return line;
    const h1 = line.match(/^#\s+(.*)$/);
    if (!h1) return line;
    title = h1[1].replace(/<[^>]*>/g, '').replace(/\\([[\]])/g, '$1').replace(/&#x20;/g, ' ').trim();
    return null;
  });
  return { title, body: rest };
}
