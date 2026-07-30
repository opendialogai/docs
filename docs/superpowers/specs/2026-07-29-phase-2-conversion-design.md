# Phase 2 — conversion script: design

Status: approved for planning, 29 Jul 2026
Supersedes nothing. Corrections to `MIGRATION-BRIEF.md` are listed in full below and are
also destined for `MIGRATION-NOTES.md`.

---

## Goal

`node scripts/convert.mjs` turns the 204 published GitBook pages in `source/` into valid
Starlight content under `src/content/docs/`, and `node scripts/sidebar.mjs` turns
`source/SUMMARY.md` into the site's ~204-entry sidebar.

**Gate:** all 204 pages converted, `astro build` succeeds, zero `{%` sequences outside code
fences, a second run byte-identical to the first. Stop and report; do not chain into Phase 3.

## Non-goals

- Assets. Images emit as root-absolute placeholders; `assets.mjs` rewrites them in Phase 3.
- Prose edits of any kind, including the known typo and the 12 pre-existing broken links.
- Visual refinement. Card, aside and sidebar presentation are judged in Phase 4.
- Route derivation. `scripts/routes.mjs` already does this and is unchanged in behaviour.

---

## Measured corrections to the brief

Each of these was verified against `source/` during design. Where a count differs from the
brief, the number here is the measured one.

### 1. `hidden: true` must be dropped, not honoured

`luis-interpreter.md` and `qna-interpreter.md` carry `hidden: true` in GitBook frontmatter.
Both appear in `SUMMARY.md` and both are live in `reference/sitemap-pages.xml`. Honouring
the key would silently remove two live URLs and fail route parity. The converter drops it.

### 2. `&#x20;` is not uniformly "replace with a space"

1,203 occurrences, of which **1,192 sit at end of line** and 84 of those follow an existing
space. Converting those to a literal space yields `…  \n`, which markdown renders as a `<br>`
that does not exist on the live site.

**Rule:** strip `&#x20;` when it is the last thing on a line; replace it with a single space
elsewhere (11 cases). This preserves live rendering exactly.

### 3. `{% include %}` is never used

The brief says `.gitbook/includes/navigate-to-the-next-level-….md` is "transcluded somewhere"
and asks for it to be inlined. There are **zero** `{% include %}` directives in the corpus.
The file is dead. No work.

### 4. Every page has an H1

All 204. The brief's "or the `SUMMARY.md` link text if no H1" fallback is never taken. It is
still implemented, but as an assertion that fails loudly rather than a silent default.

### 5. Directory-form links exist and the `.md` link count is wrong

The brief lists "499 relative `.md` links to rewrite". That figure includes `SUMMARY.md`'s own
204 nav entries. Measured, excluding `SUMMARY.md`:

| Link form | Count |
|---|---|
| `](path/to/page.md)` | 311 |
| `](path/to/dir/)` — resolves to that directory's `README.md` | **70** |
| **Total in-prose page links to rewrite** | **381** |
| `.gitbook/assets/…` references | 535 |
| External (`http`, `mailto`) | 189 |
| `/broken/pages/…` | 12 |
| Bare `#anchor` | 13 |

The 70 directory-form links appear nowhere in the brief. Left unhandled they 404.

### 6. One genuinely broken relative link in the source

`core-concepts/contexts-and-attributes/secret-context.md` links to
`../../../opendialog-platform/actions/webhook-action/`. From a file two directories deep,
three `../` escapes the repo root. The intended target is
`opendialog-platform/actions/webhook-action/README.md`.

**Rule:** clamp `..` traversal at the source root before resolving. This is what GitBook
itself does, it is a general rule rather than a special case, and it is an output-encoding
decision, not a prose edit. Any link that resolves only after clamping is logged.

### 7. Card-table attribute order varies

`<table data-view="cards">` is not a literal. One of the eight reads
`<table data-card-size="large" data-view="cards" data-full-width="false">`. The detector must
be attribute-order independent. All eight are single-line HTML.

### 8. `.mdx` promotion is 46 files, not 11

`MIGRATION-NOTES.md` records 11 `.mdx` candidates, measured before `<Embed>` and the
card-table decision. Actual drivers:

| Driver | Files |
|---|---|
| `{% embed %}` → `<Embed>` | 30 |
| `{% content-ref %}` → `<LinkCard>` | 9 |
| `<table data-view="cards">` → `<CardGrid>` | 8 |
| `{% stepper %}` → `<Steps>` | 2 |
| `{% columns %}` → `<CardGrid>` | 1 |
| **Union** | **46 of 204** |

The embed driver is 30 files, not the 31 that contain an embed:
`opendialog-platform/conversation-designer/designing-accessible-chatbots.md` embeds only the
WebAIM contrast checker, which renders as a plain link, so it stays `.md`.

Brace risk re-measured across all 46 after GitBook block syntax is consumed: **6 files, 15
lines**, all `{ attribute }` template syntax in prose. All are handled by the general escaping
rule in §"MDX normalisation". The notes' "one line in the whole set" figure is superseded.

---

## Architecture

Small, independently testable units under `scripts/lib/`, with thin orchestrators on top.
Every transform is a pure `string -> string` (or `string -> {body, meta}`) function with no
filesystem access, so each is unit-testable against inline fixtures.

```
scripts/
├── convert.mjs              orchestrate, assert corpus invariants, report
├── sidebar.mjs              SUMMARY.md -> src/sidebar.generated.mjs
├── routes.mjs               exists; refactored to import lib/summary.mjs
└── lib/
    ├── summary.mjs          SUMMARY.md parser          [shared: routes + sidebar]
    ├── segments.mjs         code/prose segmentation    [foundation]
    ├── frontmatter.mjs      parse in, emit out
    ├── gitbook-blocks.mjs   {% … %} -> asides and components
    ├── figures.mjs          <figure>/<img> -> ![]()
    ├── card-tables.mjs      <table data-view="cards"> -> <CardGrid>
    ├── links.mjs            relative page links -> route URLs
    └── mdx.mjs              JSX normalisation and brace escaping
```

`routes.mjs` currently carries its own `SUMMARY.md` parser. `sidebar.mjs` needs the identical
parse — including the escaped-bracket trap that silently drops four entries — so the parser
moves to `lib/summary.mjs` and both import it. One parser, one place to get it wrong.

### `lib/segments.mjs` is the load-bearing piece

Fenced code blocks and inline code spans must be immune to **every** transformation. This is
the single largest source of silent corruption: the corpus contains `{first_name}` inside JSON
fences, `{% code %}` blocks wrapping fences, and 1,317 asset filenames containing parentheses.

```js
splitSegments(text) -> [{ kind: 'code' | 'prose', text }]
mapProse(text, fn)  -> string   // fn applied to prose segments only
```

Everything downstream is expressed as `mapProse`. `{% code %}` is the sole exception — it
brackets a fence and is handled before segmentation, by rewriting the fence's info string.

### Link and image extraction must not use a naive regex

`\]\(([^)]+)\)` truncates at the first `)` inside `image (149).png` and silently mangles
1,317 filenames. The extractor handles both the angle-bracket form
`![](<…/image (149).png>)` and balanced parentheses in bare paths. This is proven — the same
naive regex produced a false "unresolved link" report during design.

---

## Per-file pipeline

1. Parse frontmatter. Keep `description`. **Drop `hidden`.** Drop everything else.
2. `{% code %}` → fence info string (must precede segmentation).
3. Segment into code and prose. All remaining steps run on prose only:
   1. GitBook block syntax → asides and components
   2. `<figure>` / bare `<img>` → markdown images
   3. card-tables → `<CardGrid>`
   4. `&#x20;` handling
   5. page-link rewriting
4. Extract the first H1 → frontmatter `title`; remove it from the body.
5. Choose `.md` or `.mdx`: `.mdx` if and only if a component was emitted.
6. If `.mdx`: JSX-normalise and escape bare braces.
7. Write to the `target` path given by `route-map.json`.

---

## Transformation catalogue

### Asides — 258

| Source | Output |
|---|---|
| `{% hint style="info" %}` | `:::note` |
| `{% hint style="success" %}` | `:::tip` |
| `{% hint style="warning" %}` | `:::caution` |
| `{% hint style="danger" %}` | `:::danger` |
| `{% endhint %}` | `:::` |

Works in `.md`; no component, no `.mdx` promotion.

### `{% content-ref %}` → `<LinkCard>` — 51

```
{% content-ref url="chat-management-conversation.md" %}
[chat-management-conversation.md](chat-management-conversation.md)
{% endcontent-ref %}
```
becomes
```jsx
<LinkCard title="Chat management conversation" description="…" href="/…/chat-management-conversation" />
```

The inner link text is a raw filename, not a title — GitBook substitutes the target page's
title at render. Title and `href` come from `route-map.json`; `description` from the target's
frontmatter `description` where it has one, matching GitBook's card. The `url` attribute and
the inner link target agree on all 51, so either may be used; the `url` attribute is
authoritative.

### `{% embed %}` → `<Embed>` — 38

Two forms, 19 each:

```
{% embed url="U" %}                    ->  <Embed url="U" />

{% embed url="U" %}
Caption text
{% endembed %}                         ->  <Embed url="U" title="Caption text" />
```

Providers: 19 Loom, 17 YouTube, 2 other (`fetchify.com`, `webaim.org`). The two non-video
URLs render as plain markdown links and are not a promotion driver. One of them,
`webaim.org` in `designing-accessible-chatbots.md`, is that file's only embed, so the file
stays `.md`; the `fetchify.com` one sits in a file that has video embeds anyway.

`src/components/Embed.astro` — new: takes `url` and optional `title`, detects Loom vs YouTube,
emits a lazy `<iframe>` in a 16:9 aspect-ratio wrapper, uses `title` as the iframe's
accessible name and renders it as a visible caption below.

### `{% stepper %}` / `{% step %}` → `<Steps>` — 3 / 15

Starlight's `<Steps>` wraps a single ordered list. Step bodies contain an `###` heading plus
paragraphs, so the body is indented three spaces to stay inside the list item:

```jsx
<Steps>

1. ### Get started with a Quickstart AI Agent

   The Quick Start AI Agent is an optimised journey…

2. …

</Steps>
```

The fiddliest transform in the set, but only 15 steps — hand-checked at the gate.

### `{% code %}` → fence info string — 7

| Attribute | Handling |
|---|---|
| `title="x"` | ` ```lang title="x" ` |
| `lineNumbers="true"` | ` ```lang showLineNumbers ` |
| `fullWidth="false"` | no Expressive Code equivalent — dropped, logged |

### `{% columns %}` / `{% column %}` → `<CardGrid>` — 1 / 2

One instance, in `opendialog-platform/actions/webhook-action/README.md`: a "✅ Do" / "❌ Don't"
pair, each column containing a JSON fence. `<CardGrid>` wraps the two column bodies directly —
its children need not be `<Card>` elements. Hand-checked at the gate.

Note the fences here contain `{first_name}`, which is exactly the case `lib/segments.mjs`
protects.

### `{% file %}` → markdown link — 1

`{% file src="…/DeliveryKnowledgeBase.csv" %}` becomes a link whose text is the file's
basename and whose href is a Phase 3 asset placeholder.

### `<figure>` and bare `<img>` → markdown images — 436

430 `<figure>` blocks, each containing exactly one `<img>` (verified — no figure holds zero or
several), plus 6 bare `<img>` outside any figure. A further 93 pre-existing markdown `![]()`
references pass through, needing only the path rewrite.

The highest-value transformation in the migration: raw HTML `<img>` bypasses `astro:assets`
entirely, so 541 MB of images would ship unoptimised.

```html
<figure><img src="../../.gitbook/assets/Preview Main (1).jpg" alt="Alt">
<figcaption><p>Caption</p></figcaption></figure>
```
becomes
```markdown
![Alt](</.gitbook/assets/Preview Main (1).jpg>)
*Caption*
```

- Angle brackets are used **iff** the path contains a space, `(` or `)`.
- 101 figures have an empty `<figcaption>` → image only, no caption paragraph.
- 391 have an empty `alt`. It stays empty — inventing alt text is a prose edit. Logged for
  the docs team; Phase 5 checks alt coverage.
- 2 `src` values are remote `https://` URLs and pass through unchanged.
- Markdown has no `<figcaption>`. Restoring `<figure>` semantics via a rehype plugin is a
  Phase 4 item if it matters visually.

### Card-tables → `<CardGrid>` + `<LinkCard>` — 8 tables, 41 cards

```jsx
<CardGrid>
  <LinkCard title="The OpenDialog model"
            description="Take a deepdive into the underpinning model…"
            href="/core-concepts/the-opendialog-model" />
</CardGrid>
```

- Title from the `<strong>` inside the first `<a>`; description from the following cell;
  `href` from the `data-card-target` column, resolved through `route-map.json`.
- 6 of the 42 links are `/broken/pages/…` and stay broken, as they are on the live site today.
- **26 `data-card-cover` image references are dropped** — `<LinkCard>` has no image slot.
  Two consequences, both logged: a visual gap for Phase 4, and 26 assets that Phase 3 must
  **not** treat as orphans despite having no surviving reference.

### `&#x20;` — 1,203

Strip at end of line (1,192); replace with a single space elsewhere (11). See correction §2.

### Page links → route URLs — 381

```
[x](../foo/bar.md)        ->  [x](/section/foo/bar)
[x](../foo/bar.md#anchor) ->  [x](/section/foo/bar#anchor)
[x](../foo/)              ->  [x](/section/foo)
```

Resolved source-relative against `route-map.json`, with `..` clamped at the source root
(correction §6). Anchors are preserved verbatim — GitBook and Starlight both slugify headings
the same way for these pages, and anchor correctness is a Phase 5 link-check concern.

External links, `mailto:`, bare `#anchor` and `/broken/pages/…` pass through untouched.

**Any link that fails to resolve fails the run.** No silent pass-through.

### Preserved as-is

`<mark>` (131), `<br>` (52), `<div>` (22), `<table>` (18, non-card), `<details>`/`<summary>`
(14), `<a>` (58), `<strong>` (49). Kept verbatim in `.md`; JSX-normalised in `.mdx`.

---

## Images at the Phase 2 gate

Astro treats an unresolvable relative image path in markdown as a **fatal build error** —
verified during design:

```
[ImageNotFound] Could not find requested image `…/nope.png`. Does it exist?
```

Assets do not land in `src/assets/` until Phase 3, so Phase 2 emits **root-absolute
placeholders**: `![alt](</.gitbook/assets/Name.png>)`. Astro treats a leading `/` as a
`public/` path and does not resolve it at build time, so the gate passes cleanly.

`assets.mjs` rewrites these to relative `src/assets/` paths in Phase 3 and asserts that zero
`/.gitbook/` references survive. Between the two phases, images 404 on the preview. This is
the accepted cost; the alternative — staging assets in Phase 2 — would commit 541 MB into git
history permanently, which Phase 3's slimming could never reclaim.

---

## `.md` vs `.mdx`

Default `.md`. Promote **only** when a Starlight component is emitted: 46 of 204 files.

### MDX normalisation

Applied to `.mdx` output only:

- Self-close void elements: `<br>` → `<br />`, `<img …>` → `<img … />`
- `class=` → `className=`
- `style="a: b; c: d"` → `style={{ a: 'b', c: 'd' }}` — 131 `<mark style="color:purple;">`
  instances make this load-bearing, not theoretical
- Escape bare `{` and `}` in prose as `\{` and `\}` — 15 lines across 6 files

The escaping rule is general output encoding for the target format, not a per-file special
case and not a prose edit. It renders a literal `{`, which is what GitBook shows today.

---

## Sidebar generation

`scripts/sidebar.mjs` writes `src/sidebar.generated.mjs`; `astro.config.mjs` imports it and
stays hand-maintained. No regex-splicing into a file that also holds hand-written config, and
re-run diffs never mix generated with hand-written changes.

`SUMMARY.md` nests five levels deep (32 / 35 / 47 / 51 / 39 entries by indent) across six
sections.

### Page-and-group entries — 41

Starlight groups are **not linkable**. Confirmed by reading the installed package rather than
the published guide: `node_modules/@astrojs/starlight/schemas/sidebar.ts` defines
`SidebarGroupSchema` as `label` / `translations` / `badge` / `collapsed`, with
`attrs: z.never()`. There is no `link` field.

41 `SUMMARY.md` entries are both a page and a parent. Each becomes a group whose **first item
is the parent page itself, carrying the same label**:

```js
{ label: 'Message design', items: [
    { label: 'Message design', slug: 'opendialog-platform/…/message-design' },
    { label: 'Text message',   slug: 'opendialog-platform/…/text-message' },
] }
```

The label repeats. That is accepted for Phase 2 because it keeps every `SUMMARY.md` label
exact, keeps all 204 pages reachable from the nav, and invents no text. GitBook's actual
behaviour — one clickable row that expands — needs a `Sidebar` component override, which is
Phase 4 chrome work where GitBook parity is already the stated goal.

Section headings become top-level groups. The root `README.md` is `slug: ''`.

---

## Idempotency

`convert.mjs` deletes `src/content/docs/` wholesale before writing, removing the four Phase 1
placeholder pages recorded in `MIGRATION-NOTES.md`. Output ordering is derived from
`route-map.json`, which is itself derived from `SUMMARY.md` order. No timestamps, no
randomness, no filesystem-order dependence.

The gate asserts a second run is byte-identical to the first.

---

## Testing

`node:test`, run with `node --test`. No new dependency: the lockfile has broken CI twice
already, and adding a test framework to get `describe`/`it` is not worth a third.

Tests are written before implementation, one file per lib module, against inline fixtures
drawn from real source text. The cases that matter most:

- **`segments.mjs`** — `{first_name}` inside a JSON fence survives untouched; inline code
  spans are immune; `{% code %}` wrapping a fence; nested and unbalanced fences.
- **`links.mjs`** — balanced parens in `image (149).png`; the angle-bracket form; the
  directory form; anchor preservation; root-clamped `..`; unresolvable target throws.
- **`gitbook-blocks.mjs`** — all four hint styles; both embed forms; stepper indentation;
  each `{% code %}` attribute.
- **`figures.mjs`** — empty caption; empty alt; remote src; angle-bracket path selection.
- **`mdx.mjs`** — brace escaping outside code only; `style` string to object; void elements.
- **`summary.mjs`** — the escaped-bracket label trap; section anchor ids; depth nesting.
- **`frontmatter.mjs`** — `hidden` dropped; `description` preserved; YAML escaping of titles
  containing `:` and quotes.

## Corpus invariants

`convert.mjs` asserts these against the real corpus and exits non-zero on any miss, in the
same spirit as `routes.mjs` self-verifying against the sitemap snapshot:

| Invariant | Expected |
|---|---|
| Files written | 204 |
| `.mdx` files | 46 |
| Asides emitted | 258 |
| `<LinkCard>` from `content-ref` | 51 |
| `<LinkCard>` from card-tables | 41 |
| `<Embed>` emitted | 36 (38 less 2 non-video) |
| `<Steps>` / steps | 3 / 15 |
| `<CardGrid>` | 9 (8 card-tables + 1 `columns`) |
| HTML `<img>` converted to markdown images | 436 (430 in figures + 6 bare) |
| Pre-existing markdown `![]()` refs preserved | 93 |
| Page links rewritten | 381 |
| Unresolved page links | 0 |
| `&#x20;` surviving | 0 |
| `{%` surviving outside fences | 0 |
| `hidden:` surviving in output | 0 |
| Second run byte-identical | yes |

A divergence means the script is wrong. Per `CLAUDE.md`, the expectation is not adjusted to
match the output.

---

## Logged, not fixed

Appended to `MIGRATION-NOTES.md` at the gate:

- The `README.md` "laaunched" typo.
- 12 `/broken/pages/…` placeholders, 6 of them inside card-tables. Broken today, broken after.
- The one source link with an extra `../` (correction §6), resolved by clamping.
- 391 images with empty `alt`.
- 26 dropped card-cover images — **Phase 3 must not treat these assets as orphans.**
- `{% code fullWidth="false" %}` dropped, no Expressive Code equivalent.
- 3 pages where the H1 and the nav label genuinely differ: `Default interpreter` /
  `OpenDialog interpreter`, `Integrations introduction` / `Integrating with OpenDialog`,
  `Adding a new topic of discussion` / `Add a new topic of discussion`. Frontmatter `title`
  takes the H1, sidebar takes the nav label — as GitBook does. Spot-check in Phase 5.
- Both stray `.gitbook/assets/*.md` files contain absolute image paths from a contributor's
  local machine (`/Users/elliotmassen/…`). Neither publishes; no action.

## Cross-phase handoffs

**To Phase 3.** Every `/.gitbook/assets/…` placeholder must be rewritten and the count of
survivors asserted to zero. The 26 card-cover assets are referenced by nothing after
conversion and must be excluded from orphan deletion.

**To Phase 4.** Linkable sidebar groups; `<figure>` semantics and caption styling; card-cover
images; `{% columns %}` and `<Steps>` rendering in context.
