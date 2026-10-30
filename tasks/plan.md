# Implementation Plan: `ai-message` (UI-266)

## Overview

This plan builds the `ai-message` module from the [capability map](../docs/architecture/ai/capability-map.md): `Message`, `MessageContent`, `MessageResponse` and `Suggestion`, four parts on `Stack`, `Markdown` and `Button`. The `ai-prompt-input` plan that used to live here is complete and in git history (`3b22c9e5`).

Spec: [`SPEC-ai-message.md`](../docs/architecture/ai/SPEC-ai-message.md), approved 2026-10-29.

## Architecture decisions

All settled in the spec:

- Four parts, no more. An actions row is a `Group` of `Button`s in the examples; `MessageActions`, `MessageAction` and `MessageToolbar` are not ported.
- `from: ChatRole` on `Message`, written as `data-from`. Alignment is a `Stack` `ax` default; the user margin and bubble are two attribute-selected CSS rules.
- `MessageResponse` is `memo(Markdown)` with default comparison.
- `Suggestion` is `Button` with subtle, pill and small defaults and the native `onClick`.
- No new dependency, no `"use client"`, no new tokens.

## Order and rationale

1. **The message family first.** `Message`, `MessageContent` and `MessageResponse` are what every other story and the conversation examples render, and the alignment and memo behavior are what the ticket's acceptance criteria name.
2. **`Suggestion` and the barrel next.** Self-contained, and the barrel test pins the export list once everything exists.
3. **Docs and stories last.** Examples, READMEs, stories, MDX and the conversation examples swap, once the API is proven.

One PR, three commits after the spec.

## Task list

See [`todo.md`](./todo.md) for each task's acceptance criteria and verification steps.

- [x] Task 1: `Message`, `MessageContent` and `MessageResponse`
- [x] Task 2: `Suggestion` and the barrel
- [x] Task 3: Examples, READMEs, stories and the conversation swap

### Checkpoint

- [x] `pnpm test:run packages/ai` passes, with the markdown, conversation and prompt-input tests unchanged apart from the conversation examples swap
- [x] `pnpm run build --filter=@uiid/ai`, `pnpm run lint`, `pnpm run format:check` and `pnpm size` pass
- [x] Checked headless in Chromium: user bubble at the end with the 5% gutter, surface fill, 8px radius and 12px/16px padding; assistant prose at the start with no surface; the actions row flush with the content; the Copy tooltip on hover; pills below the empty-state heading
- [ ] Checked by hand: dark theme; a long user line wrapping and a wide code block scrolling inside the turn; no layout jump in the Streaming story
- [ ] Human review

## Risks and mitigations

| Risk                                                                            | Impact | Mitigation                                                                                               |
| ------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------- |
| `memo` on a component whose props include `render` elements defeats itself      | Perf   | Callers rarely pass `render` to a response; the memo still skips on the common string-only case          |
| The user bubble's `--shade-surface` reads too close to the page in one theme    | Visual | Decide in the Storybook pass; it is one token swap in one rule                                           |
| Spying on `markdown-to-jsx/react`'s `compiler` through `vi.mock` fights its ESM | Tests  | Fall back to counting renders of a child passed through `render`, or drop the memo test to a README note |
