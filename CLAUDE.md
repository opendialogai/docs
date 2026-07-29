# CLAUDE.md — docs.opendialog.ai migration

Read `MIGRATION-BRIEF.md` before doing anything. This file is the short list of rules that hold on every run.

## What this repo is

Migrating OpenDialog's product docs off GitBook onto Astro Starlight, deployed to Cloudflare Workers static assets. 208 markdown pages, 1,589 image assets, must keep every existing URL.

## Hard rules

1. **`documentation` branch is read-only.** GitBook syncs to it bidirectionally. Writing to it corrupts the live site. Work on a feature branch.
2. **Never hand-edit files in `src/content/docs/`.** They are generated. Found a bug? Fix `scripts/convert.mjs` and re-run. A manual edit is silently destroyed on the next run and creates a bug that reappears at cutover.
3. **Scripts must be idempotent.** `convert.mjs` and `assets.mjs` run repeatedly, right up to cutover day, against fresh GitBook syncs. Same input must give byte-identical output.
4. **`source/` is pristine and git-ignored.** All scripts read from `source/`, write to `src/`. Never mutate `source/` in place.
5. **URLs do not change.** Not the ugly ones either. Every path in the live `sitemap.xml` must resolve. This is the acceptance test.
6. **Do not edit documentation prose.** Not to fix typos, not to improve clarity. Log it in `MIGRATION-NOTES.md`.
7. **Stop at phase gates.** Report and wait for a human. Do not chain phases.

## Gotchas that will bite

- **`{ attr | filter }` in prose breaks MDX builds.** OpenDialog's docs are full of this template syntax. In `.mdx` the braces parse as JSX expressions. Safe inside code fences, fatal outside them. Prefer `.md` — Starlight asides (`:::note`) work there. Only promote to `.mdx` when a Starlight component is genuinely required.
- **Images must live in `src/assets/`, never `public/`.** Files in `public/` bypass `astro:assets` entirely and ship unoptimised. With 541 MB of source images this is the whole performance story.
- **Raw `<img>` in markdown is not optimised.** The source has 430 `<figure><img>` blocks. They must become markdown `![]()` syntax or the optimisation never happens. Highest-value transformation in the project.
- **1,317 asset filenames contain spaces or parentheses**, and GitBook wraps those paths in angle brackets: `![](<../.gitbook/assets/image (149).png>)`. Handle that form or you will silently drop images.
- **50 assets have no file extension.** Sniff magic bytes and rename, or they get served with the wrong MIME type.
- **One 28 MB GIF exceeds Cloudflare's 25 MiB per-file limit** and will fail deployment. Re-encode to MP4.
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
node scripts/convert.mjs     # source/ -> src/content/docs/
node scripts/assets.mjs      # rename, re-encode, rewrite refs
node scripts/verify-routes.mjs  # built routes vs live sitemap.xml
npx wrangler deploy          # deploy to Cloudflare
```

## Definition of done for any change

`astro build` succeeds, `verify-routes.mjs` passes, no new broken internal links, and anything ambiguous is written up in `MIGRATION-NOTES.md`.
