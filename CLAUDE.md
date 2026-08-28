# CLAUDE.md — docs.opendialog.ai migration

Read `MIGRATION-BRIEF.md` before doing anything. This file is the short list of rules that hold on every run.

## What this repo is

Migrating OpenDialog's product docs off GitBook onto Astro Starlight, deployed to Cloudflare Workers static assets. 208 markdown pages, 1,589 image assets, must keep every existing URL.

## Hard rules

1. **`documentation` branch is read-only.** GitBook syncs to it bidirectionally. Writing to it corrupts the live site. Work on a feature branch.
2. **`src/content/docs/` is hand-authored and is the source of truth.** Author pages in Starlight dialect: `.md`/`.mdx`, site-absolute internal links (`/core-concepts/…`), and `~/assets/…` image paths so `astro:assets` optimises them. The GitBook conversion was a one-time process and it is complete — never regenerate this directory to change content.
3. **Never run `npm run convert` or `scripts/convert.mjs`.** `convert.mjs` deletes `src/content/docs/` wholesale and rewrites it from the frozen `source/` snapshot, discarding every page authored since the migration. The pipeline is retired; it and its tests are kept as the record of how the corpus was produced. `assets.mjs` and `routes.mjs` remain safe to run on their own, and must stay idempotent — same input, byte-identical output.
4. **`source/` is pristine and git-ignored.** All scripts read from `source/`, write to `src/`. Never mutate `source/` in place.
5. **URLs do not change.** Not the ugly ones either. Every path in the live `sitemap.xml` must resolve. This is the acceptance test.
6. **Do not edit documentation prose.** Not to fix typos, not to improve clarity. Log it in `MIGRATION-NOTES.md`.
7. **Stop at phase gates.** Report and wait for a human. Do not chain phases.

## Gotchas that will bite

- **`{ attr | filter }` in prose breaks MDX builds.** OpenDialog's docs are full of this template syntax. In `.mdx` the braces parse as JSX expressions. Safe inside code fences, fatal outside them. Prefer `.md` — Starlight asides (`:::note`) work there. Only promote to `.mdx` when a Starlight component is genuinely required.
- **Images must live in `src/assets/`, never `public/`.** Files in `public/` bypass `astro:assets` entirely and ship unoptimised. With 541 MB of source images this is the whole performance story. Exception: video and downloadable files cannot pass through `astro:assets`, so the one MP4 lives in `public/media/` and the one CSV in `public/files/`.
- **Raw `<img>` in markdown is not optimised.** The source has 430 `<figure><img>` blocks. They must become markdown `![]()` syntax or the optimisation never happens. Highest-value transformation in the project.
- **1,317 asset filenames contain spaces or parentheses**, and GitBook wraps those paths in angle brackets: `![](<../.gitbook/assets/image (149).png>)`. Handle that form or you will silently drop images.
- **50 assets have no file extension**, and all 50 are orphans — referenced from nowhere in `source/` — so none is ever copied and no MIME type is ever served.
- **The GIF that ships, `Knowledge Base Demo.gif`, is 22.56 MiB** — under Cloudflare's 25 MiB per-file limit — and is re-encoded to a 1.12 MiB MP4 for weight, not to clear the cap. A separate 28 MB GIF that does exceed the cap is an orphan, referenced by nothing, and is never copied.
- **Do not set `run_worker_first`** in `wrangler.jsonc`. Static asset requests are free and unlimited; Worker invocations are metered at 100k/day on the free plan.
- **Never make DNS changes.** Pat repoints `docs.opendialog.ai` manually at cutover. Cloudflare API access is available for Workers and deployments only.
- **Pat owns the GitBook analytics export.** Do not attempt it.
- **Routes derive from nav position in `SUMMARY.md`, not from file paths.** See `MIGRATION-NOTES.md`. Four pages sit on disk somewhere other than their nav position; path-based derivation puts them at URLs that 404 today.
- **`reference/` holds committed snapshots of the live GitBook site** — the acceptance oracle. Never fetch these live in a verification script; they must outlive GitBook. Note `sitemap.xml` is an *index* pointing at `sitemap-pages.xml`, which holds the 204 real URLs.

## Expected counts

If your script's numbers diverge sharply from these, the script is wrong — do not adjust the expectation to match the output.

| | |
|---|---|
| Markdown files | 208 |
| `{% hint %}` blocks | 258 |
| `{% content-ref %}` | 51 |
| `{% embed %}` | 38 |
| Relative `.md` links | 499 |
| `&#x20;` artefacts | 1,203 |
| Asset files | 1,589 |
| Content pages (excl. `SUMMARY.md` and 3 files under `.gitbook/`) | 204 |
| `SUMMARY.md` nav entries | 204 |
| Live URLs in `sitemap-pages.xml` | 204 |

The brief's "~131 live URLs" was wrong — 131 is the `llms.txt` nav count, not the published
URL set. Measured against the live sitemap: 204. Route parity is judged against 204.

## Commands

```bash
npm run dev                  # local dev server
npm run build                # astro build -> dist/
npm run convert              # source/ -> route-map.json -> asset-map.json -> src/content/docs/ -> sidebar
node scripts/assets.mjs      # copy, encode, write asset-map.json
node scripts/routes.mjs      # built routes vs live sitemap.xml, writes route-map.json
npx wrangler deploy          # deploy to Cloudflare
```

`npm run convert` runs `routes.mjs`, `assets.mjs`, `convert.mjs` and `sidebar.mjs` in that order.
`convert.mjs` reads `route-map.json` and `asset-map.json` rather than `source/` directly, so
running it on its own against a sync that adds a page or an image silently leaves the addition
unconverted — always use `npm run convert`, never `node scripts/convert.mjs` alone.

## Definition of done for any change

`astro build` succeeds, `routes.mjs` passes, no new broken internal links, and anything ambiguous is written up in `MIGRATION-NOTES.md`.
