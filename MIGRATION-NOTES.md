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
