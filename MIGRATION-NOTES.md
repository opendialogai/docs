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

## 2026-07-29 — Open question: `<LinkCard>` and `.mdx` promotion

`{% content-ref %}` -> `<LinkCard>` forces 11 files to `.mdx`. Measured: none of those 11
contain the `{ attribute | filter }` template syntax the brief flags as the top build risk,
so the overlap the brief feared does not exist. Residual risk is bare `{` in prose in four
of them (`webhook-action/README.md` 33 non-GitBook braces, `secret-context.md` 22,
`about-attributes.md` 9, `release-notes.md` 4) — needs checking whether those sit inside
code fences.

Rendering `content-ref` as a plain markdown link instead would keep all 204 files as `.md`
and remove the MDX build-failure class entirely. Awaiting a call from Pat; it is a visual
trade-off, not a technical one.
