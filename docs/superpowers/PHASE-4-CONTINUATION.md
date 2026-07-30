# Phase 4 continuation — look and feel

Paste this whole file as the opening prompt of a fresh session, or point the session at it by path.

## Your task

Bring the migrated Starlight site's appearance into line with the GitBook site it replaces, then
stop at the phase gate. **Phase 4 is look and feel only. It changes no URLs and no prose.**

Do not start by writing code. Use `superpowers:brainstorming` first, then a design, then a plan,
then `superpowers:subagent-driven-development` to execute it — the same route Phases 2 and 3 took.
Several items below are genuine judgement calls rather than defects with one right answer, and one
has been waiting on a human decision since Phase 2.

## Read these first, in this order

1. `CLAUDE.md` — standing rules. Non-negotiable, and several are unusual.
2. `MIGRATION-NOTES.md` — the append-only record. Two sections are yours specifically:
   **"Handoff to Phase 4 — look and feel"** in the Phase 2 gate entry, and the Phase 4 items in the
   **Phase 3 gate** entry near the end of the file. Read the whole Phase 3 gate section anyway; it
   carries the asset pipeline's behaviour and traps you will touch.
3. `MIGRATION-BRIEF.md` — the original brief. Its Phase 4 section is thin and predates measurement;
   the two `MIGRATION-NOTES.md` sections above supersede it wherever they disagree.

## State you are inheriting

Phases 1–3 are complete, reviewed and **deployed**. Phase 3 merged the asset pipeline, so every
image on the site now resolves; before it, all of them 404'd.

- Branch `phase-3/assets` at `c93edc2`, pushed to `origin`. **Check whether it has merged to `main`
  before branching** — at the time of writing it had not, and no PR existed.
- Live at **https://opendialog-docs.opendialog.workers.dev** — verified 205 pages, 8/8 images on a
  sampled page, 30/30 sampled sitemap routes, the MP4 and the CSV all serving 200. `docs.opendialog.ai`
  still points at GitBook; Pat repoints it manually at cutover.
- `src/assets` 32.0 MiB against a 60 MB gate. 500 assets in `asset-map.json`. 187 tests passing.
- `npm run convert` runs `routes → assets → convert → sidebar` and is green end to end.

**Cloudflare asset propagation is eventually consistent.** Immediately after `npx wrangler deploy`,
individual assets 404 on some edges while others serve — it settled within about two minutes. Do not
diagnose a deploy from the first thirty seconds of curl results; poll.

## Hard rules that still bind

1. **`documentation` branch is read-only.** GitBook syncs to it bidirectionally.
2. **Never hand-edit `src/content/docs/`.** It is generated. Fix `scripts/convert.mjs` and re-run.
   A manual edit is destroyed on the next run and creates a bug that reappears at cutover.
3. **Scripts must be idempotent.** Same input, byte-identical output.
4. **`source/` is pristine and git-ignored.** Repopulate with
   `git archive documentation | tar -x -C source/`.
5. **URLs do not change.** Not the ugly ones. Every path in `reference/sitemap-pages.xml` must
   resolve — that is the acceptance test, and it is Phase 5's gate, not something to risk here.
6. **Do not edit documentation prose.** Log it in `MIGRATION-NOTES.md` instead.
7. **`{ attr | filter }` in prose breaks MDX builds.** Prefer `.md`. Promote to `.mdx` only when a
   Starlight component is genuinely required — every MDX parse failure in Phase 2 came from that path.
8. **Never make DNS changes.**
9. **Stop at the phase gate.** Report and wait. Do not chain into Phase 5.

## The work, with what has already been measured

Everything here was measured against the real corpus or a real browser. If your own measurement
disagrees, trust yours and record the discrepancy — but measure, do not assume.

### 1. Sidebar groups are not linkable — needs a component override

Confirmed by reading `node_modules/@astrojs/starlight/schemas/sidebar.ts`, not the published guide:
`SidebarGroupSchema` is `label` / `translations` / `badge` / `collapsed`, with `attrs: z.never()`.
There is no `link` field.

41 `SUMMARY.md` entries are both a page and a parent, so each becomes a group whose first item
repeats the parent's label: 204 pages + 41 repeated parents = **245 nav entries**. GitBook shows one
clickable row that also expands. Matching it needs a `Sidebar` component override.

This is the largest single visual difference and the one users navigate by. Probably start here.

### 2. Side-by-side figures render stacked — 13 wrapper divs, 9 pages, 31 images

A genuine regression against the live site, **measured twice in a real browser with
`getBoundingClientRect()`**, not inferred from HTML shape. GitBook lays out *every* wrapper div's
figures side by side, attributed or not. Starlight stacks them, because
`node_modules/@astrojs/starlight/style/markdown.css:75-78` sets `display: block` on
`.sl-markdown-content :is(img, picture, video, canvas, svg, iframe)`.

Affected pages:

```
/core-concepts/the-opendialog-workspace/scenarios/turns-and-intents
/opendialog-platform/actions/webhook-action
/opendialog-platform/conversation-designer/conversation-design
/opendialog-platform/conversation-designer/message-design/constructing-messages
/opendialog-platform/conversation-designer/message-design/message-types/date-picker-message
/opendialog-platform/conversation-designer/message-design/message-types/e-sign-message
/opendialog-platform/conversation-designer/message-design/message-types/location-message
/opendialog-platform/conversation-designer/message-design/message-types/twilio-content-template-message
/release-notes/release-notes
```

The other 6 of the 19 wrapper divs hold a single figure and are unaffected. The wrapper `<div>` and
its attributes survive into the output, so **a CSS rule scoped to that wrapper is the lever and no
conversion change is needed for the side-by-side part.**

**But a CSS fix alone will not restore sizing.** GitBook sizes these with a per-`<img>` `width`
attribute — 188, 375, 374, 207 measured to the pixel, and one case of 188 → 187.25 where four images
plus gaps exceed the content width and the row constrains them. **64 `width=` attributes were
dropped** in Phase 2 when `<figure><img …>` became `![]()`; markdown has nowhere to put them.

So decide before writing CSS: equal fractions of the row, or carry explicit widths through
conversion? The second means a `convert.mjs` change and re-running the pipeline.

### 3. Card covers have no slot — 13 references, 10 distinct assets, 9 orphaned

`<LinkCard>` has no image slot, so covers render as plain cards. **Keep the 13 / 10 / 9 chain intact
when quoting it** — collapsing those three numbers into one is exactly the mistake that produced the
design spec's phantom "26".

The **9 assets that lose their only reference** are listed by path in `MIGRATION-NOTES.md`. They
remain in `source/` and were deliberately **not** copied by Phase 3. Restoring covers means putting
them through the same pipeline — `assets.mjs`'s copy set derives from `source/` references, so making
the covers referenced again is what pulls them in.

One of the nine is a **photograph** (`engineer-maintenancing-ai-systems-2023-11-27-05-12-07-utc.jpg`)
that **must stay full colour**. Palette quantisation bands photographs visibly. The pipeline already
protects it — `quantise` is gated on PNG and the threshold is 32,768 unique colours measured on the
resized image — but verify rather than assume. Note the design spec records this file at 454,752
unique colours; through the real JPEG pipeline it measures **225,760**. Both are far above the
threshold, so the conclusion holds either way, but the 454,752 figure does not reproduce.

Also note the pipeline's own trap: **changing `MAX_WIDTH`, `QUANTISE_MAX_COLOURS` or
`GIF_VIDEO_THRESHOLD` requires deleting `asset-map.json` first**, or every asset cache-hits and the
new value silently never takes effect.

### 4. `<figure>` semantics are lost

Markdown has no `<figcaption>`; captions emit as an `*italic*` paragraph under the image. **101 of
430 figures have an empty caption** and emit the image alone. Restoring `<figure>` / `<figcaption>`
via a rehype plugin is a Phase 4 call — worth weighing against the accessibility pass in Phase 5.

If you touch caption emission, `scripts/lib/figures.mjs`'s indentation handling is **load-bearing**:
a caption emitted at column 0 breaks out of any enclosing list, and that shipped two non-rendering
screenshots in Phase 2. Preserve it.

### 5. One page's `{% columns %}` output is unreviewed

`{% columns %}` emits raw content directly inside `<CardGrid>` with no per-column `<Card>` wrapper.
The design sanctions that, but **how it renders was never looked at.** The single instance is
`webhook-action/index.mdx:77-95`: a `:white_check_mark: Do` line, a JSON fence, a `:x: Don't` line
and a second fence, directly inside the grid. `<CardGrid>` is a CSS grid, so each top-level child
likely becomes its own cell — a label could be separated from the fence it introduces. **Look at
this one page in a browser.**

### 6. Two non-video embeds render as bare links

`fetchify.com` in `address-autocomplete-message` and `webaim.org` in `designing-accessible-chatbots`
emit as `[url](url)`, showing the raw URL as link text. GitBook renders a non-video `{% embed %}` as
a bookmark card. Cosmetic, 2 pages.

## The decision that has been waiting since Phase 2 — put it to Pat early

`progress-bar-message`'s XML snippet took **two** markup changes inside its `<pre>` so the block
would parse as MDX. This was escalated to Pat by name during Phase 2 and **no decision was ever
recorded.** It is a markup change to documentation content, which the standing rules otherwise
forbid, so it needs an answer rather than another inheritance.

1. The redundant `<code>` element was dropped, keeping only `<pre>`. CSS or tooling keyed on
   `pre code` rather than bare `pre` no longer matches this block.
2. A `<strong>` that spanned a line break was joined onto one line.
   `source/…/meta-messages/progress-bar-message.md:47-48` has `<strong>&#x3C;/meta-message>`,
   newline, `</strong>`; the output has them joined.

An earlier note claimed the newline behaviour was "the only textual change" — **that was wrong and
is corrected in `MIGRATION-NOTES.md`.** Whitespace is significant inside `<pre>`, so
"render-invisible" is a conclusion to re-check, not inherit: the `<code>` drop is render-invisible
per the HTML spec, but the `<strong>` join removes a newline in the middle of preformatted content.

**Look at the rendered page in a browser and show Pat, rather than reasoning about it.**

## Not your scope

- **Phase 5** — verification, route parity against the live sitemap, accessibility, cutover.
- **URL changes** of any kind.
- **Prose edits**, including typos.
- Re-running the asset pipeline is fine and expected; **redesigning it is not.**

## What this project has taught, and what it means for you

Phase 2 produced **eleven real defects, six of them silent content loss that left `astro build`
green**. Phase 3 produced **fourteen more**, four of which would have shipped silently — including a
per-file cover split that dropped a live screenshot, a sweep that deleted the site logo on every run,
and a `<video>` pointing at a GIF that rendered as a blank element.

Consequences that bind you:

- **A green build proves very little, and neither does a passing count.** The failure mode of this
  codebase is well-formed output containing the wrong thing. Phase 4's output is *visual*, so a
  passing build proves even less than usual — **look at pages in a browser.**
- **Measure, do not infer.** The side-by-side question in item 2 was answered wrongly once by
  inferring layout from HTML shape; it took `getBoundingClientRect()` against the live site to
  settle. `reference/` holds committed snapshots of the live GitBook site as the acceptance oracle —
  never fetch those live in a verification script; they must outlive GitBook.
- **Beware bracket-naive greps.** A pattern like `'\.gitbook/assets/[^")>]*'` truncates at the first
  `)`, and 1,056 asset filenames contain parentheses. This trap produced false measurements twice in
  Phase 3, both times in ad-hoc verification. Read `asset-map.json` or use `extractTargets`.
- **Treat confident documentation as a hypothesis.** The design spec asserted `CLAUDE.md` records
  ffmpeg as a missing prerequisite; it has never mentioned ffmpeg in any commit. That claim
  propagated spec → handoff → permanent record unchallenged. Verify before repeating.
- **Reviewers earn their value from named risks.** Every real defect caught in Phases 2 and 3 came
  from a reviewer being pointed at a specific risk, not from an open-ended brief.

## Definition of done

`astro build` succeeds, `node scripts/routes.mjs` passes, no new broken internal links, the affected
pages verified **visually** against the `reference/` snapshots, anything ambiguous written up in
`MIGRATION-NOTES.md`, and the Phase 4 section appended there. Then stop and report to Pat.

Ask before pushing or opening a PR.
