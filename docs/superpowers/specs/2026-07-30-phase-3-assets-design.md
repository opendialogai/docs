# Phase 3 — assets: design

Status: approved, not yet planned.
Depends on: Phase 2 (`phase-2/conversion-script`, PR #17), which generates the 204 pages whose
image references this phase rewrites.

## Goal

Move the asset library from GitBook's export into `src/assets/`, where `astro:assets` can
optimise it, and get `du -sh src/assets` under 60 MB with every reference intact.

Today `convert.mjs` emits root-absolute placeholders of the form `/.gitbook/assets/<original
filename>`. Nothing resolves them, so every image on the site 404s. Phase 3 is what makes the
images real.

## Non-goals

- **Deleting anything.** No file is removed from disk in this phase. See correction 1.
- **Deduplication.** 158 duplicate groups exist library-wide, but only 2 groups worth 0.3 MiB
  fall inside the referenced set. Not worth the code.
- **Layout.** The side-by-side wrapper-div regression and the lost `width=` attributes are
  Phase 4.
- **Extension sniffing.** See correction 2.

## Measured corrections to the brief

The brief's Phase 3 section was written before the corpus was measured. Five of its statements
are wrong. Every figure below was measured against the corpus with `sharp`, not inherited.

### 1. Orphan deletion is not a step, and never was

The brief says "delete orphaned assets not referenced by any page." There is nothing to delete.
`source/` is git-ignored and regenerable from the `documentation` branch, and assets move *out*
of it into `src/assets/`. Orphans are simply never copied.

This matters because the alternative reading — deleting 1,089 of 1,589 files, 69% of the
library — is irreversible, and `MIGRATION-NOTES.md` records two traps sitting directly on that
path (nine card covers that must survive despite having no surviving reference, and 14
references carrying markdown `\_` escapes that a literal-string rewrite would skip and then
misreport as orphans). Neither can fire under a copy-what-is-referenced model.

### 2. All 50 extension-less files are orphans

The brief's step 1 is "sniff the 50 extension-less files by magic bytes, rename with correct
extension." Measured: zero of the 50 are referenced from anywhere in `source/`. They are never
copied, so no extension is ever needed and no MIME type is ever served. The step is deleted.

### 3. The 28 MB GIF is not a deployment blocker

The brief calls out one file over Cloudflare's 25 MiB per-file cap. Measured: that file
(`OpenDialog - Preview - Google Chrome 2021-12-09 09-03-23.gif`, 28,637,283 B = 27.31 MiB) is
referenced by nothing, in source or output. It is an orphan and is never copied.

The GIF that actually ships is `Knowledge Base Demo.gif` at 23,654,022 B = 22.56 MiB — under the
cap. It is still worth re-encoding, for weight rather than for deployability.

`ffmpeg` is installed (8.1.2). `MIGRATION-NOTES.md`, `CLAUDE.md` and the Phase 2 handoff all
record it as a missing prerequisite; that is stale.

### 4. Resizing alone cannot meet the gate; encoding can

The brief prescribes "resize to a sane max width (~1600px)". Measured over the referenced raster
images:

| treatment | raster total |
|---|---|
| max 1200px, PNG preserved | 55.4 MiB |
| max 1600px, PNG preserved | 71.4 MiB |
| max 2000px, PNG preserved | 87.1 MiB |
| max 1600px, PNG + palette | 26.5 MiB |
| max 2000px, PNG + palette | 30.6 MiB |
| max 1600px, WebP q90 | 23.1 MiB |
| max 2000px, WebP q90 | 27.4 MiB |

Width alone does not reach the gate at any usable size — 231 of the images are already ≤1600px
wide, so downscaling does nothing for nearly half the library. The size comes from full-colour
PNG encoding of flat UI screenshots.

Palette quantisation is the lever, and it makes the width question moot: 2000px quantised is
smaller than 1200px unquantised by a wide margin.

WebP q90 saves a further ~3 MiB over palette PNG at the same width. Against a 60 MB budget that
is a rounding error, and it costs exactly what `CLAUDE.md` warns about — lossy artefacts on
screenshot text. Rejected.

### 5. Per-file relative paths are unnecessary

The brief says "rewrite refs to correct per-file relative paths." Verified by build spike: the
`~/*` → `src/*` alias added to `tsconfig.json` in Phase 2 Task 11 resolves in markdown image
syntax, producing byte-identical optimised output to the relative form (same `_astro` hash).

All references can therefore be one uniform shape, immune to a page moving. This is the same
ruling made in Phase 2 for the `Embed.astro` import, applied consistently.

## The copy set

**500 assets: referenced in `source/`, minus the 9 dropped card covers.** Both terms are
computed from `source/` alone, never from the generated output.

`source/` holds 509 asset references, all present on disk, zero missing. The generated output
holds 500. The difference is exactly the 9 `data-card-cover` images, which `convertCardTables`
discards because Starlight's `LinkCard` has nowhere to put them.

Deriving from `source/` rather than from the generated pages breaks what would otherwise be a
circular dependency: `convert.mjs` needs `asset-map.json` to emit final paths, so a map derived
from converted output would need itself first. `link-cards.mjs` already identifies dropped
covers from source — that is what `countDroppedCovers` does — so the subtraction needs a sibling
function returning the paths rather than the count, not a new parser and not a lookup of output.

**The 9 covers are excluded deliberately**, and this reverses an earlier decision in this design.
Including them was justified as "retains them automatically, no exclusion list to drift" — but
that reasoning was inherited from the delete model, and nothing is deleted. The covers survive
in `source/` regardless. Measured, they cost 77.4 MiB of originals; processed with quantisation
they fall to 7.2 MiB, but one is a photograph at 454,752 unique colours that must stay
full-colour under the rule below, taking the real cost to roughly 21 MiB — for images nothing
renders. Phase 4 copies them in when it restores card covers.

### Extraction

Reuses `extractTargets` from `scripts/lib/links.mjs` rather than a regex. `links.mjs`'s own
header records why: a naive `\]\(([^)]+)\)` truncates on the 1,056 filenames containing
parentheses. Extraction must also handle GitBook's angle-bracket form
`![](<../.gitbook/assets/image (149).png>)`, markdown backslash escapes (14 references carry
`\_`), `%20` encoding, raw HTML `src=`/`href=`, and `{% file src="…" %}`.

## Architecture

```
source/.gitbook/assets/  ──►  assets.mjs  ──►  src/assets/       496 images + 2 gifs
                                          ├─►  public/           1 MP4, 1 CSV
                                          └─►  asset-map.json
                                                     │
                                  convert.mjs  ◄─────┘   assetPath() reads the map
```

| File | Responsibility |
|---|---|
| `scripts/assets.mjs` | Orchestrate: derive the copy set, process each asset, write the map, assert the invariants |
| `scripts/lib/asset-plan.mjs` | **Pure.** Given a filename and image metadata, decide target name, destination and treatment. No I/O |
| `scripts/lib/asset-plan.test.mjs` | Slugification, collision resolution, treatment selection |
| `scripts/lib/link-cards.mjs` | Gains a function returning dropped-cover paths beside the existing count |
| `scripts/lib/figures.mjs` | `assetPath` becomes map-aware; emits `<video>` where the map says an asset became one |

`asset-plan.mjs` is pure so that every naming and treatment decision is unit-testable without
touching the filesystem or decoding an image. `assets.mjs` holds all I/O.

### Why `convert.mjs` consumes the map

The brief describes `assets.mjs` as rewriting references in the generated pages after the fact.
That is a trap. `convert.mjs` regenerates `src/content/docs/` from scratch and is re-run against
fresh GitBook syncs right up to cutover day, so every re-run would silently revert all 500 asset
paths — leaving a green build and a site with no images.

This is the same failure mode the Phase 2 final review found for `route-map.json`: correctness
depending on command ordering held in prose. Instead, `assets.mjs` owns the physical files and
emits `asset-map.json`; `convert.mjs` consumes it exactly as it already consumes
`route-map.json`. One generator, correct on every run.

`npm run convert` becomes `routes && assets && convert && sidebar`.

## Processing rules

### Slugification

Lowercase the stem, replace each run of non-alphanumeric characters with a single hyphen, trim
leading and trailing hyphens, lowercase the extension. Measured hazards across the 1,589
filenames: 1,317 contain spaces, 1,056 contain parentheses, 452 contain uppercase, zero contain
non-ASCII.

```
Screenshot 2024-07-09 at 09.52.58.png      -> screenshot-2024-07-09-at-09-52-58.png
Screenshot 2024-07-09 at 09.52.58 (1).png  -> screenshot-2024-07-09-at-09-52-58-1.png
image (149).png                            -> image-149.png
```

**This rule produces zero collisions across all 509 references** — verified, 509 distinct slugs.
Because the digits inside GitBook's ` (1)` re-upload suffix survive as `-1`, the pairs that look
most likely to collide do not.

Collision handling is still required, because the input is whatever GitBook syncs next: two
names differing only in characters the rule flattens would collide. Resolved with a numeric
suffix assigned in sorted original-name order, so the result is deterministic across runs and
machines. It is unreachable on today's corpus, and the invariant below asserts that — a
collision appearing in a future sync is information, not a silent rename.

### Still images — 496 PNG/JPEG files

Resize to a 2000px width ceiling (never enlarge), then palette-quantise **only if the resized
image has 32,768 or fewer unique colours**. Keep the quantised output only when it is actually
smaller. Output stays PNG throughout.

The two small animated GIFs are copied to `src/assets/` byte-for-byte. Resizing or re-encoding
them through `sharp`'s still-image path would flatten the animation to a single frame — silent
content loss of exactly the kind this project has produced eleven times.

The threshold protects photographs and gradients, which band visibly at 256 colours, while
letting flat UI screenshots quantise invisibly. Measured on the resized images across all 505
referenced PNG/JPEG files (the 496 in the copy set plus the 9 card covers): p25 = 1,505,
p50 = 5,643, p75 = 10,389, p90 = 15,150, p95 = 17,549, max = 454,752. At 32,768 only the
genuinely photographic images fall through to full colour, and protecting them costs about
1 MiB against the copy set.

**The colour count must be measured on the resized image, not on a downsample.** An earlier
draft of this design set the threshold at 8,192 based on counts taken at 400px. Unique-colour
count scales with pixel count, so at the real 2000px size 197 of 505 images exceeded that
threshold rather than the 11 predicted, and the projected total came to 84.6 MiB — a gate
failure. The proxy did not hold; the measurement must be taken on the artefact being encoded.

Referenced as `~/assets/<slug>`.

### The video — 1 file

`Knowledge Base Demo.gif` (22.56 MiB) re-encodes to MP4 with `ffmpeg`, expected ~2 MB at better
quality. Video cannot go through `astro:assets`, so it lands in `public/` and is emitted as
`<video autoplay loop muted playsinline>` rather than `![]()`.

The page (`google-dialogflow-knowledge-base`) is `.md` and stays `.md`. Raw HTML renders there,
and `CLAUDE.md` requires promotion to `.mdx` only when a Starlight component is genuinely
needed — every MDX parse failure on the Phase 2 branch came from the `.mdx` path.

The rule the map encodes is general — *a GIF over 1 MiB becomes a video* — so this is a branch
in `figures.mjs` keyed on the map, not a hard-coded filename. The two other referenced GIFs are
150 KB and 130 KB and pass through as ordinary images; the threshold sits two orders of
magnitude above them and one below the file it targets, so nothing sits near the boundary.

### The download — 1 file

`DeliveryKnowledgeBase.csv` (1,027 B) copies to `public/` unchanged. It is a download, not an
image, and has no business in `astro:assets`.

## Failure handling

Loud failure, consistent with every transform built in Phase 2 and for the same reason: these
scripts run against whatever GitBook syncs next, not against a fixed corpus.

`assets.mjs` throws on a referenced asset absent from disk, a collision it cannot resolve
deterministically, an image `sharp` cannot decode, and an `ffmpeg` failure.

`assetPath` is the one deliberate exception, mirroring the `Embed.astro` ruling from Phase 2
Task 10: when `asset-map.json` does not exist it falls back to today's `/.gitbook/assets/`
placeholder rather than throwing. This keeps Phase 3 additive and Phase 2 green on a checkout
where Phase 3 has never run. A reference missing from an existing map is a different case and
throws — that is a real inconsistency between the two generators.

## Idempotency

`asset-map.json` records each source file's content hash. A re-run skips any asset whose bytes
are unchanged, so the first run costs a couple of minutes of encoding and subsequent runs cost
seconds. That is what makes it acceptable to put `assets` inside `npm run convert` rather than
relying on an operator to remember it.

`sharp` output is deterministic for fixed parameters, and collision suffixes derive from sorted
input, so two runs over the same source produce byte-identical output.

## Invariants

Asserted by `assets.mjs`, exiting non-zero on divergence. Treated as detectors, not targets: a
divergence means the script is wrong, and the expectation is never adjusted to match.

| | expected |
|---|---|
| Asset references in `source/` | 509, all resolved on disk |
| Dropped card covers, excluded | 9 |
| Copy set, and `asset-map.json` entries | 500 |
| Slug collisions requiring a suffix | 0 |
| **Emitted paths resolving to a real file** | **100%, zero broken refs** |
| `du -sh src/assets` | under 60 MB (projecting ~31.6 MiB) |
| Largest single file | under 25 MiB |
| Second run | byte-identical |

The fourth row is the one that matters. Phase 2's lesson, recorded across eleven defects, is
that counters measure text while defects live in rendering. A count of rewritten references
proves nothing; resolving every emitted path against the filesystem proves the images exist.

## Testing

`asset-plan.mjs` is pure, so slugification, collision resolution and treatment selection are
covered by ordinary unit tests — including the parenthesised, spaced and uppercase filenames
measured above, and the two known colliding pairs.

The map-aware `assetPath` needs tests for: a mapped image, a mapped video, a reference missing
from an existing map, and absence of the map entirely.

The invariant run is the integration test. Per Phase 2's experience, at least one check must
compare the built output against the filesystem rather than counting strings in the source.

## Handoff to Phase 4

- The 9 dropped card covers remain in `source/`, listed by path in `MIGRATION-NOTES.md`. Restoring
  card covers means copying them through the same pipeline; the photograph among them
  (`engineer-maintenancing-…jpg`, 454,752 colours) must stay full-colour.
- Wrapper-div figures render stacked where GitBook renders them side by side: 13 divs, 9 pages,
  31 images, confirmed by browser measurement against the live site.
- 64 `width=` attributes were dropped in Phase 2 conversion and are not restored here.
