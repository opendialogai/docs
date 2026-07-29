# Migration notes

Append-only log of decisions, anomalies and deferred fixes. Newest at the bottom.

---

## 2026-07-29 — Branch set up

Created `astro-starlight` off `main` (which held only an empty `README.md`). The GitBook
content lives solely on `documentation`, so the Astro project gets a clean root with no
collision between the export and the site. `source/` is populated from `documentation`
with `git archive documentation | tar -x -C source/` and is git-ignored.

---

## 2026-07-29 — Live reference data snapshotted

`reference/sitemap.xml`, `reference/sitemap-pages.xml` and `reference/llms.txt` are
committed snapshots of the live GitBook site, taken 29 Jul 2026.

They are committed rather than fetched on demand because they are the acceptance oracle
for the whole migration and they disappear when GitBook is switched off. `verify-routes`
must keep working after cutover.

**Correction to the brief:** `sitemap.xml` is a sitemap *index*, not a URL list. It
contains one `<loc>`, pointing at `sitemap-pages.xml`. A verifier that parses
`sitemap.xml` for page URLs finds one entry and reports a false pass.

**Correction to the brief:** the brief expects "~131 live URLs in sitemap". The live
sitemap has **204**. The 131 figure is the page count in `llms.txt`, which is a curated
nav subset, not the published URL set. Route parity must be measured against 204.

---

## 2026-07-29 — Route derivation: URLs come from nav position, not file path

The brief assumes URLs derive from file paths, with "a handful of section-prefix quirks"
to be patched via `public/_redirects`. That is not how GitBook routes these docs.

**The actual rule, which holds for all 204 pages with no exceptions:**

```
URL = /<section slug>/<own segments of nav ancestors>/<own segment>
      own segment = directory name when the file is README.md, else its basename
      top-level README.md -> /
      section slug = the SUMMARY.md heading anchor id where present, else the
                     slugified heading text
```

Path-based derivation gets 200 of 204 and fails on four pages whose file location
disagrees with their nav position:

| Source file | Live URL |
|---|---|
| `best-practices/testing-strategy.md` | `/opendialog-platform/conversation-designer/conversation-design/introduction/testing-strategy` |
| `best-practices/designing-in-opendialog/messages-best-practices.md` | `/opendialog-platform/conversation-designer/message-design/messages-best-practices` |
| `designing-conversations/actions/README.md` | `/opendialog-platform/actions` |
| `designing-conversations/actions/actions-from-library/README.md` | `/opendialog-platform/actions/actions-from-library` |

Deriving from nav position handles all four with no special cases.

The path-based derivations of those four (e.g. `/opendialog-platform/designing-conversations/actions`)
return **404 on the live site** — they were never real URLs. So no redirects are owed for
them. On current evidence `public/_redirects` is not needed at all.

`scripts/routes.mjs` implements this, writes `route-map.json`, and fails non-zero on any
divergence from the sitemap snapshot. Currently: 204 derived, 204 live, 0 unreachable,
0 invented. Verified byte-identical on re-run.

---

## 2026-07-29 — File accounting reconciled

| | |
|---|---|
| `.md` files on `documentation` | 208 |
| less `SUMMARY.md` | 207 |
| less 3 files under `.gitbook/` | **204 content pages** |
| SUMMARY.md nav entries | 204 |
| Live sitemap URLs | 204 |

Exact 1:1. The brief's "3 pages not referenced in `SUMMARY.md`" is accounted for: those
three are `.gitbook/assets/luis-interpreter.md`, `.gitbook/assets/qna-interpreter.md` and
`.gitbook/includes/navigate-to-the-next-level-....md`. The first two are stray markdown
sitting in the assets directory and do not publish. The third is the include. No content
page is missing from the nav.

**Parser trap worth keeping:** four `SUMMARY.md` entries have escaped brackets in the link
label — `[\[Deprecated\] webhook actions](...)`. A label regex of `\[([^\]]*)\]` silently
drops all four, which reads as a clean 200/200 parse rather than an error. The label must
be matched greedily to the final `](`. These four pages are live and must not be lost.

---

## 2026-07-29 — `<LinkCard>` retained; MDX risk measured at one line

`{% content-ref %}` -> `<LinkCard>` promotes 9 files to `.mdx`. A further 2 files need
`.mdx` for `<Steps>`/`<CardGrid>` regardless of that decision, so dropping `<LinkCard>`
would take the `.mdx` count from 11 to 2, not to zero. MDX stays in the build either way.

**Measured MDX brace risk.** Scanned all 11 `.mdx` candidates for `{` or `}` surviving
outside code fences and inline code spans. **One line in the whole set:**

```
core-concepts/contexts-and-attributes/about-attributes.md:176
  * This is also directly accessible as  {`user.utterance_text}` without having to refer...
```

The backticks are misplaced in the source, so the `{` falls outside the code span. The two
files that require `.mdx` regardless have zero risky lines. The `{ attribute | filter }`
syntax the brief flags as the top build risk appears in 6 files, none of which are `.mdx`
candidates — the feared overlap does not exist.

**Decision: keep `<LinkCard>`.** `convert.mjs` escapes bare `{`/`}` in prose when emitting
`.mdx`. That is an output-encoding rule for the target format, not a prose edit, and it is
general rather than a per-file special case. The rendered text at that line will still read
oddly; it reads oddly on GitBook today. Not fixed, logged here.

Weighing against dropping it: 33 of the 51 refs sit on two hub pages —
`message-design/README.md` (16) and `message-types/README.md` (17) — whose only purpose is
to route readers onward. Plain links turn those into long bullet lists, a visible downgrade
against the live site in the Phase 4 visual comparison.

No conversion work is saved by dropping it. The inner link text of a `content-ref` is a raw
filename (`[chat-management-conversation.md](chat-management-conversation.md)`), not a
title — GitBook substitutes the target page's title at render. Both options therefore need a
title lookup via `route-map.json`.

Verified while checking: the `url` attribute and the inner link target agree on all 51
`content-ref` blocks. No source inconsistency to work around.

**Not taken:** emitting LinkCard-equivalent markup as raw HTML from a remark step, keeping
every file `.md`. Would remove MDX entirely at the cost of maintaining our own card CSS
instead of inheriting Starlight's. Unverified — would need a spike on how Starlight's
markdown pipeline handles raw HTML blocks. Revisit only if eliminating `.mdx` becomes a
goal in itself.

---

## 2026-07-29 — Phase 1 scaffold

Astro 7.1.5, Starlight 0.41.5, `sharp` for image processing. No Cloudflare adapter: the
build is fully static, and an adapter is only needed for on-demand rendering.

**Starlight theming API.** This version uses `--sl-color-accent-low/-/-high`,
`--sl-color-gray-1..7`, `--sl-color-white/black`, `--sl-font` and `--sl-font-mono`. Dark is
the `:root` default; light is `:root[data-theme='light']`. Verified by reading
`node_modules/@astrojs/starlight/style/props.css` rather than the published guide — the
guide describes a `--color-accent-*` 50–950 scale that this version does not use. Read the
installed package, not the docs.

**`social` config is an array** of `{ icon, label, href }`, not the older object map.

### Brand tokens

Taken from the rendered markup of opendialog.ai. The docs site itself is a GitBook JS shell
and carries no usable colour information.

| Token | Value |
|---|---|
| Accent (brand blue) | `#0023ff` — `hsl(232, 100%, 50%)` |
| Deep navy | `#1b1464` |
| Body text | `#3e4563` |
| Muted text | `#565f85` |
| Borders | `#e1e4ef` |
| Background tint | `#f8f9fc` |
| Teal accent | `#62cac2` |
| Fonts | Inter (body), Fragment Mono (code) |

Starlight's default accent hue is 234 and OpenDialog's is 232, so the brand blue sits
almost exactly on the theme's tuned default. The grey ramp therefore keeps Starlight's
lightness values, which are tuned for contrast, and shifts only hue and saturation onto
OpenDialog's blue-tinted greys (all near hue 227). `hsl(232, 100%, 50%)` rounds to
`#0022ff` under Lightning CSS, so the light-mode accent is pinned to the exact hex.

Fonts are self-hosted via Fontsource. The build makes **zero external font requests** —
no Google Fonts CDN dependency, which keeps the Phase 4 Lighthouse target reachable.

Logo and favicon are OpenDialog's own brand mark, pulled from the marketing site.

### Placeholder content — must be deleted in Phase 2

`src/content/docs/` currently holds four hand-converted pages purely to prove the deploy:

- `index.md`
- `getting-started-1/getting-ready/index.md`
- `core-concepts/the-opendialog-model/index.mdx`
- `tutorials/ai-agent-creation-overview/index.mdx`

These violate the standing rule against hand-editing generated content and exist only for
the Phase 1 gate. `convert.mjs` must delete `src/content/docs/` wholesale before writing.
Figures are omitted from them because assets land in Phase 3.

`core-concepts/the-opendialog-model` was chosen deliberately: its source file is
`the-opendialog-model/README.md`, one of the four pages whose disk location disagrees with
its nav position. It builds at the correct live URL, so the nav-based routing rule is
confirmed end to end and not just on paper.

The `astro.config.mjs` sidebar is a Phase 1 placeholder; `scripts/sidebar.mjs` generates it
from `SUMMARY.md` in Phase 2.

---

## 2026-07-29 — Two conversion cases missing from the brief

**GitBook card-tables.** 8 instances of `<table data-view="cards">` across 8 files, using
`data-card-target` and `data-card-cover` column attributes. GitBook renders these as card
grids. They are raw HTML, so they survive markdown conversion as an unstyled table unless
handled. Not in the brief's inventory. Needs a Phase 2 decision: convert to `<CardGrid>` +
`<LinkCard>`, or let them degrade to plain tables. 8 instances is hand-checkable.

Affected: `README.md`, `monitoring-your-application.md`,
`getting-started-1/quick-start-ai-agents/README.md`,
`core-concepts/contexts-and-attributes/conditions-and-operators.md`,
`core-concepts/the-opendialog-workspace/language-services.md`,
`core-concepts/the-opendialog-workspace/scenarios/README.md`,
`opendialog-platform/conversation-designer/message-design/message-editor.md`,
`opendialog-platform/conversation-designer/message-design/README.md`.

**Broken links baked into published content.** 12 occurrences across 6 files of GitBook's
`/broken/pages/<id>` placeholder, rendered as the literal text "Broken link". These are
already broken on the live site — the homepage card-table has three of them. They are a
pre-existing content defect, not a migration artefact. Per the standing rule the prose is
not edited; flagging for the docs team. They will 404 after cutover exactly as they do now.

Affected: `README.md`, `release-notes/release-notes.md`,
`core-concepts/the-opendialog-workspace/README.md`,
`opendialog-platform/conversation-designer/conversation-design/conversational-patterns/recommendations/README.md`,
`opendialog-platform/interpreters-and-natural-language-understanding/interpreters/available-interpreters/openai-interpreter.md`,
`opendialog-platform/interpreters-and-natural-language-understanding/llm-actions/README.md`.

**Typo, not fixed:** `README.md` line 32 reads "We have laaunched an AI Accelerator
Program". Prose is not edited under the standing rules. For the docs team.

---

## 2026-07-29 — Phase 3 dependency missing

`ffmpeg` is not installed on this machine. Phase 3 needs it to re-encode the 28 MB GIF that
exceeds Cloudflare's 25 MiB per-file cap and would otherwise fail deployment. Install before
starting Phase 3.

---

## 2026-07-29 — Astro emits a sitemap *index* too

`@astrojs/sitemap` produces `sitemap-index.xml` plus `sitemap-0.xml`, the same two-level
pattern GitBook uses. `verify-routes.mjs` must resolve the index on both sides rather than
parsing the top-level file for `<loc>` page entries.
