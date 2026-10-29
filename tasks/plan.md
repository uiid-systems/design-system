# Implementation Plan: `@uiid/ai` POC, wave 1

## Overview

This plan builds the three modules with no dependencies in the [capability map](../docs/architecture/ai/capability-map.md):

- `forms-input-group`: `InputWrapper` gains `orientation`, and Textarea gains `before`/`after`
- `typography-shimmer`: the `Shimmer` component
- `ai-scaffold`: a private `@uiid/ai` package with its shared types

None of the three depends on another, so each can land as its own PR off `main`. Later waves (`markdown`, then message, conversation, reasoning and tool, then prompt-input) get their own specs and plans once these land.

Specs:

- [`SPEC-forms-input-group.md`](../docs/architecture/ai/SPEC-forms-input-group.md)
- [`SPEC-typography-shimmer.md`](../docs/architecture/ai/SPEC-typography-shimmer.md)
- [`SPEC-ai-scaffold.md`](../docs/architecture/ai/SPEC-ai-scaffold.md)

## Architecture decisions

All of these are settled in the specs:

- Textarea's slots reuse `InputWrapper` with `orientation="vertical"`. There is no `TextareaWrapper` and no InputGroup.
- `Shimmer` is a CSS keyframe on `Text`. It doesn't use `motion` and needs no client boundary.
- `@uiid/ai` is `"private": true` until the POC's last step. `ai` is a devDependency used only by the type-drift test.

## Order and rationale

1. **`forms-input-group` first.** It is the only module that changes an existing public component (Input), so it carries the most risk and should fail fast. It also blocks `ai-prompt-input` at the end of the chain.
2. **`typography-shimmer` next.** It is low risk and self-contained, and it blocks `ai-reasoning-tool`.
3. **`ai-scaffold` last in this wave.** It has the most touchpoints but no runtime behavior. It blocks every remaining module, so it has to land before wave 2 starts.

The three PRs are independent, not stacked, so they can merge in any order. Each phase below is a single PR.

## Task list

See [`todo.md`](./todo.md) for each task's acceptance criteria and verification steps.

### Phase A: `forms-input-group` (PR 1)

- [x] Task 1: `InputWrapper` `orientation`
- [x] Task 2: Textarea `before`/`after`
- [x] Task 3: Textarea and InputWrapper docs and story

### Checkpoint A

- [x] `pnpm test:run packages/forms` passes, with every existing Input and Textarea test unchanged
- [x] `pnpm run build --filter=@uiid/forms` and `pnpm size` pass
- [x] Checked in Storybook: focus ring, the four sizes, ghost and color in both themes, invalid, the resize handle
- [ ] Human review

### Phase B: `typography-shimmer` (PR 2)

- [ ] Task 4: `Shimmer` component and tests
- [ ] Task 5: Shimmer docs and story

### Checkpoint B

- [ ] `pnpm test:run packages/typography`, build and `pnpm size` pass
- [ ] Checked in Storybook: the sweep in light and dark, a palette `color`, reduced motion, and the open question on whether `--shade-background` reads well
- [ ] Human review

### Phase C: `ai-scaffold` (PR 3)

- [x] Task 6: Package skeleton that builds and tests
- [x] Task 7: Shared types and drift test
- [x] Task 8: Release, size and umbrella registration
- [x] Task 9: Fix the new-package checklist in `.agents/components.md`

### Checkpoint C (wave complete)

- [x] `pnpm run build`, `pnpm test:run`, `pnpm run lint`, `pnpm run format:check` and `pnpm size` pass from the repo root
- [x] `grep -r '"ai"' packages/ai/dist` returns nothing
- [x] `pnpm -r publish --dry-run` skips `@uiid/ai`
- [ ] Human review, then specs for wave 2 (`markdown`)

## Risks and mitigations

| Risk                                                                                                                  | Impact | Mitigation                                                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| The `orientation` change alters Input's existing output                                                               | High   | Every existing `input.test.tsx` case must pass unchanged, and a new test pins the horizontal default's class list                               |
| `Stack` in the vertical wrapper picks up Box resets the horizontal `Group` path never hit                             | Med    | Same `.input-edge` restatement. Checked in Storybook, since happy-dom does no layout                                                            |
| The inner textarea still gets `composes-invalid`/`composes-disabled` from `.textarea` and paints its own edge or ring | Med    | `.textarea-inner` clears border and outline in `uiid.components`, which outranks compositions. Verify in the compiled CSS, not the source order |
| `background-clip: text` with `-webkit-text-fill-color` behaves differently across browsers                            | Low    | Checked by hand in Storybook. Under reduced motion it falls back to plain `currentColor` text                                                   |
| The installed `ai` version's types differ from the unions the spec copied                                             | Med    | The drift test exists to catch exactly this. If it fails, update the spec's unions first, then the code                                         |
| Adding `ai` changes `pnpm-lock.yaml` broadly                                                                          | Low    | Pin an exact version and confirm the lockfile diff touches only `ai` and its dependencies                                                       |
| A types-only `@uiid/ai` produces an empty JS bundle, which trips `size-limit` or the design-system barrel             | Low    | Task 6 runs the build and `pnpm size` before any registration lands                                                                             |

## Open questions

1. **Where should the specs be committed?** I recommend shipping `docs/architecture/ai/` in PR 1 (or as a separate `docs(docs)` PR), so the decisions are in `main` before any code that depends on them.
2. **PR titles.** I recommend:
   - PR 1: `feat(ui): add InputWrapper orientation and Textarea before/after slots`
   - PR 2: `feat(ui): add Shimmer text effect`
   - PR 3: `chore(repo): scaffold private @uiid/ai package`

   PR 3 uses `chore` so that a package nobody can install doesn't trigger a release.

3. **Does `tasks/` belong in git?** It doesn't exist in the repo yet. It could stay local and untracked, or move next to the specs.

## Wave 2: `markdown`

Spec: [`SPEC-markdown.md`](../docs/architecture/ai/SPEC-markdown.md), approved 2026-10-28. One PR off `main`, branch `ui-263`.

### Phase D: `markdown` (PR 4)

- [ ] Task 10: `Markdown` component, tests and barrel export
- [ ] Task 11: Markdown examples, README and story

### Checkpoint D

- [ ] `pnpm test:run packages/ai`, `pnpm run build --filter=@uiid/ai`, `pnpm run lint`, `pnpm run format:check` and `pnpm size` pass
- [ ] `grep -r '"ai"' packages/ai/dist` returns nothing
- [ ] Checked in Storybook: the Streaming story in both themes
- [ ] Human review
