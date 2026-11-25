# Implementation Plan: `@uiid/code` hardening

Source specs: `spec/capability-map-code.md` and the `spec/SPEC-<module>.md` files it indexes.

Tasks are tracked in a Linear project with one milestone per row of the milestone table below. Until that project exists, the tables here are the task list. Once it exists, the task columns are replaced by ticket ids.

## Overview

Four milestones. Harden brings `CodeBlock`, `CodeInline` and `CodeEditor` up to standard and makes the block safe to stream into. Preview adds the published `CodePreview` and moves the docs site onto it. Markdown renders fenced code through the block in `@uiid/ai`. Tabs is a draft whose scope the owner picks after Preview ships.

One task is one pull request. Each PR carries its own stories and tests.

## Architecture decisions

- **Fullscreen goes through `@uiid/overlays` first, and it goes first.** `DialogPopup` renders a `Card` and sets the card body itself, so hosting an edge-to-edge code view may need a bare popup option in overlays. T1 finds out before anything else builds on the block. If overlays must change, that change is its own PR, raised with the owner before it is written.
- **Buttons are absent, never disabled.** The header decides what to render from its flags and from whether there is code. `CodeEditor` shares the header, so it inherits the rule from T2.
- **The header renders from its content.** With no filename and no language icon there is no bar and the buttons float. This is what later lets a tab list take the filename's place.
- **Browser tests are the proof of robustness.** `*.browser.test.tsx` files measure real boxes in Chromium. T7 adds the first one for this package and the helpers the later ones reuse.
- **Streaming is fixed in the highlighter hook and the block, with no new prop.** The hook runs one highlight at a time and skips intermediate values. The block shows the last finished highlight plus the plain remainder.
- **`CodePreview` composes existing parts.** `Collapsible` parts from `@uiid/interactive` for the panel, `CodeBlockContent` for the code, `CodeBlockCopyButton` for copy. Reset is a `key` on a client wrapper around `children`.
- **`@uiid/markdown` stays free of `@uiid/code`.** It gains one override for fenced code. `@uiid/ai` supplies `CodeBlock` by default.

## Milestones

| #   | Milestone | Modules                                                 | Done when                                                                                     |
| --- | --------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1   | Harden    | `code-block`, `code-inline`, `code-editor`, `streaming` | Every success criterion in those four specs is checked and the owner has accepted the stories |
| 2   | Preview   | `code-preview`, `docs-adoption`                         | The docs site renders every example through `CodePreview` and the owner has browsed it        |
| 3   | Markdown  | `markdown-code`                                         | A streamed chat message shows a highlighted, copyable, stable code block                      |
| 4   | Tabs      | `tabs`                                                  | The owner has picked candidates and the spec is finished; tasks are written then              |

## Task list

Sizes: XS is one file, S is one or two, M is three to five.

### Milestone 1: Harden

| Task | Title                                                    | Spec                           | Size | Blocked by |
| ---- | -------------------------------------------------------- | ------------------------------ | ---- | ---------- |
| T1   | Render CodeBlock fullscreen through UIID Dialog          | code-block 3, 4, 20            | M    | —          |
| T2   | Make header buttons opt-in and absent when off           | code-block 1, 2; code-editor 1 | M    | —          |
| T3   | Replace `fullwidth` with `w="full"` in `@uiid/code`      | code-block 6; code-editor 4    | XS   | —          |
| T4   | Export the expand toggle as a UIID Button part           | code-block 5, 7                | S    | T2         |
| T5   | Add controlled state and the missing slots to CodeBlock  | code-block 8, 9                | M    | T1, T4     |
| T6   | Render the header from its content and tighten the frame | code-block 10–15               | M    | T2, T4     |
| T7   | Prove no flash or shift when highlighting lands          | code-block 16                  | M    | T6         |
| T8   | Contain long lines and hold at phone widths              | code-block 17, 18              | S    | T7         |
| T9   | Hold under theme changes and nesting                     | code-block 19, 20              | S    | T7         |
| T10  | Keyboard scrolling, edge input and the error state       | code-block 21–23               | M    | T7         |
| T11  | Harden CodeInline in prose                               | code-inline 1–7                | M    | —          |
| T12  | Apply slot rules and the block's look to CodeEditor      | code-editor 2, 3, 5, 6         | M    | T6         |
| T13  | Keep CodeEditor's layers aligned and in step             | code-editor 7–13               | M    | T12        |
| T14  | Run one highlight at a time and skip stale values        | streaming 3, 4, 8              | S    | —          |
| T15  | Keep a streaming CodeBlock current and calm              | streaming 1, 2, 5–7, 9         | M    | T7, T14    |

Start in parallel: T1, T2, T3, T11, T14.

**Checkpoint after T6:** the owner looks at the stories and accepts or corrects the look before T7–T13 build on it.

**Checkpoint at the end of milestone 1:** unit tests, browser tests, typecheck, lint and `pnpm size` pass on `main`; every success criterion in the four specs is checked.

### Milestone 2: Preview

| Task | Title                                                  | Spec                            | Size | Blocked by  |
| ---- | ------------------------------------------------------ | ------------------------------- | ---- | ----------- |
| T16  | Add CodePreview: frame, canvas, bar and collapsed code | code-preview 1–9, 11, 12, 17–19 | M    | T6          |
| T17  | Add the opt-in reset button and the error boundary     | code-preview 10, 13–16, 26      | S    | T16         |
| T18  | Finish CodePreview's look and prove it in a browser    | code-preview 20–25, 27          | M    | T17, T8, T9 |
| T19  | Render docs examples through CodePreview               | docs-adoption 1–5, 7, 8         | M    | T18         |
| T20  | Mark animated docs examples as resettable              | docs-adoption 6                 | S    | T19         |

**Checkpoint after T18:** the owner accepts the preview's look in Storybook before docs move onto it.

**Checkpoint at the end of milestone 2:** the docs build passes, and the owner has browsed the site at desktop and phone widths.

### Milestone 3: Markdown

| Task | Title                                                    | Spec                       | Size | Blocked by |
| ---- | -------------------------------------------------------- | -------------------------- | ---- | ---------- |
| T21  | Add a fenced-code override to Markdown                   | markdown-code 1, 2, 4–6, 8 | M    | T15        |
| T22  | Render fenced code as CodeBlock by default in `@uiid/ai` | markdown-code 3, 7         | S    | T21        |
| T23  | Prove a streamed message's code block in a browser       | markdown-code 5, 9         | S    | T22        |

### Milestone 4: Tabs

| Task | Title                                        | Spec                | Size | Blocked by |
| ---- | -------------------------------------------- | ------------------- | ---- | ---------- |
| T24  | Pick the tabs candidates and finish the spec | tabs open questions | XS   | T20        |

Tasks for the chosen candidates are written when T24 closes.

## Risks and mitigations

| Risk                                                | Impact                                       | Mitigation                                                                           |
| --------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------ |
| `DialogPopup` cannot host edge-to-edge code         | High: blocks the "no direct Base UI" rule    | T1 runs first. If overlays must change, raise it before writing it                   |
| Many tasks edit `code-block.tsx` and its CSS module | Medium: merge conflicts between parallel PRs | The blocked-by chain keeps the heavy edits in sequence; T8–T10 mostly add tests      |
| New dependencies grow consumers' bundles            | Medium                                       | `pnpm size` on every PR; any growth is stated in the PR and approved before merge    |
| Look and feel has no mock                           | Medium: rework after review                  | Two owner checkpoints, after T6 and after T18, before other work depends on the look |
| Browser tests are slow or flaky in CI               | Medium                                       | Measure boxes and computed styles, not screenshots; no timing-based waits            |
| Default flips break existing users                  | Low pre-1.0                                  | PR titles carry `!`; the body names each changed default                             |

## Open questions

Carried from the specs. Each is settled inside the task named.

- Whether overlays needs a bare popup option (T1).
- Whether floating buttons reserve space on the first line (T6, by eye).
- How the editor shows a typed character before its highlight lands (T13).
- How the block shows text past the last highlighted position (T15).
- Find-in-page for collapsed code (left off in T16; revisit after T19).
- The fenced-code override's name and props (T21).
