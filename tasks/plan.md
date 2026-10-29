# Implementation Plan: `ai-prompt-input` (UI-265)

## Overview

This plan builds the last module in the [capability map](../docs/architecture/ai/capability-map.md): `PromptInput`, a trimmed composer on `Textarea`'s `before`/`after` slots. The wave 1 plan that used to live here is complete and in git history (`70c73158`).

Spec: [`SPEC-ai-prompt-input.md`](../docs/architecture/ai/SPEC-ai-prompt-input.md), approved 2026-10-29.

## Architecture decisions

All settled in the spec:

- One component plus one button part. `header` and `tools` are props that land in Textarea's `before` and `after` slots. There is no `PromptInputButton`; tools are plain `Button`s.
- `PromptInput` holds no state. Text lives in the `<textarea>` or the caller's `value`; composition is read off the keyboard event.
- Auto-grow is CSS `field-sizing: content` with a `12rem` cap. No JS measuring.
- The root is a plain `<form>`; Enter calls `requestSubmit()`.
- `@uiid/forms` is the only new dependency.

## Order and rationale

1. **`PromptInputSubmit` first.** It is self-contained, has the status mapping the ticket's acceptance criteria name, and is what `PromptInput` renders in its footer.
2. **`PromptInput` next.** Structure, submit, Enter, stop and auto-grow, tested against the submit part.
3. **Docs and stories last.** Examples, README, barrel exports, stories and MDX, once the API is proven.

One PR, three commits.

## Task list

See [`todo.md`](./todo.md) for each task's acceptance criteria and verification steps.

- [x] Task 1: `PromptInputSubmit` and the module's types
- [x] Task 2: `PromptInput`
- [x] Task 3: Examples, README, stories and exports

### Checkpoint

- [x] `pnpm test:run packages/ai` passes, with the existing conversation and markdown tests unchanged
- [x] `pnpm run build --filter=@uiid/ai`, `pnpm run lint`, `pnpm run format:check` and `pnpm size` pass
- [x] Checked headless in Chromium: auto-grow from one line to the cap, the focus ring around all three rows, the `submitted` spinner, Enter and Shift+Enter
- [ ] Checked by hand: the four sizes, ghost and a palette color in both themes, Shift+Enter in Safari
- [ ] Human review

## Risks and mitigations

| Risk                                                                                            | Impact | Mitigation                                                                                                            |
| ----------------------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------- |
| `@types/react` drift makes `TextareaProps["ref"]` "unrelated" in `tsc` against `forms`'s dist   | Build  | Pin the `packages/ai` lockfile importer to the siblings' versions; never cast                                         |
| `field-sizing: content` and `rows={1}` read too short or too tall against the tier `min-height` | Visual | Decide `rows` in the Storybook pass; it is one default                                                                |
| `user-event`'s Enter in happy-dom does not call `requestSubmit` on the form                     | Tests  | Assert the form's `submit` event or stub `requestSubmit` on the form element, as the conversation test stubs scrollTo |
