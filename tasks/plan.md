# Implementation Plan: Pre-1.0 hardening

## Overview

Seven phases that make UIID smaller, settled and correct before 1.0, in the order agreed on 2026-11-18: low-risk deletions, the build pipeline with toolchain upgrades, Base UI 1.9, masks on `Input`, the export and slot-prop rules applied layer by layer, deprecated APIs and `fullwidth`, and a docs truth pass. The spec is [`docs/architecture/hardening-spec.md`](../docs/architecture/hardening-spec.md). Each task's acceptance criteria and verification are in [`todo.md`](./todo.md).

The previous contents of this file, the finished `ai-reasoning-tool` plan (UI-267), are in git history.

## Architecture decisions

All settled in the spec; listed here so a task can be picked up without rereading it.

- **Break freely.** No shims. Breaking PRs carry `!`.
- **Parts are public, internals are not.** Constants, variant functions, internal hooks, mocks and utils plumbing leave the public surface.
- **Slot types omit owned keys.** Fall back to runtime "top-level wins" for any component where the types turn conditional, and record it.
- **Masks are self-attaching values on `Input`,** built on Maskito, with the masked string as the value everywhere.
- **Source resolution through an export condition.** Each package exposes its source under a custom condition, so tests, Storybook and typecheck read source and only the docs app and npm read `dist`.
- **One declaration pass.** `tsc` emits declarations and typechecks; `vite-plugin-dts` goes.

## Dependency graph

```
Phase 1  Deletions ───────────────┐
                                  ▼
Phase 2  Build pipeline ──► Phase 3  Base UI 1.9 ──► Phase 4  Input masks
                                  │                        (own track)
                                  ▼
Phase 5  Rules, bottom-up:  utils/tokens/icons → layout/typography/buttons/interactive/markdown
                            → cards/lists/indicators/navigation → forms and overlays/code (side by side) → tables/ai
                                  │
                                  ▼
Phase 6  Deprecated APIs and fullwidth ──► Phase 7  Docs truth pass
```

Within Phase 5 a task starts only after the tasks it names as dependencies have merged, because their types and exports are what it imports. Forms (Tasks 26 to 28) and overlays and code (Task 29) do not depend on each other and can run side by side. Phase 5 starts after Task 16.

## Task list

### Phase 1: Low-risk deletions

- [ ] Task 1: Delete finished-work docs and fix the references to them
- [ ] Task 2: Delete tracked files that nothing imports
- [ ] Task 3: Remove unused dependencies and dead config
- [ ] Task 4: Delete internal dead code
- [ ] Task 5: Remove unused public API (breaking)
- [ ] Task 6: Correct the always-loaded agent docs

### Checkpoint: Deletions

- [ ] `pnpm test:run`, `pnpm run lint`, `pnpm run format:check` and `pnpm size` pass
- [ ] Storybook and docs builds pass
- [ ] Tasks 1 to 4 and 6 change no behaviour: no test was edited except to remove one for deleted code
- [ ] Task 5 is the only breaking change in this phase, and its PR title carries `!`

### Phase 2: Build pipeline

- [ ] Task 7: Read the toolchain changelogs and record what breaks
- [ ] Task 8: Prove source resolution on two packages
- [ ] Task 9: Roll source resolution out and delete the alias tables
- [ ] Task 10: Add a build-free `pnpm typecheck` and run it in CI
- [ ] Task 11: Generate declarations once per package
- [ ] Task 12: Make a fresh worktree run tests and Storybook without a build
- [ ] Task 13: Move the build toolchain to the root and upgrade Vite and Vitest
- [ ] Task 14: Upgrade TypeScript to 7
- [ ] Task 15: Upgrade the remaining majors

### Checkpoint: Build

- [ ] A fresh clone passes `pnpm install && pnpm test:run && pnpm typecheck` with no build
- [ ] A forced full build is at or under the 15.0 s baseline; the new figure is recorded in the spec
- [ ] `scripts/check-dist.mjs` passes and each package's published file list is unchanged apart from intended removals
- [ ] Review with the owner before Phase 3

### Phase 3: Base UI

- [ ] Task 16: Bump Base UI to 1.9 and remove the 1.7 workarounds (UI-412)

### Phase 4: Input masks

- [ ] Task 17: Add the `mask` prop and `InputMask` type to `Input`
- [ ] Task 18: Add `currencyMask`, `percentMask` and `numberMask`
- [ ] Task 19: Add real-browser tests for masks
- [ ] Task 20a: Rebuild the 13 fixed patterns as masks
- [ ] Task 20b: Retire the old `MaskInput` engine and keep `MaskInput` as a wrapper
- [ ] Task 21: Document masks and state what is untested

### Checkpoint: Masks

- [ ] The five test locales format and parse correctly
- [ ] A no-mask bundle contains no Maskito code, shown by a size-limit entry
- [ ] Chromium browser tests run in CI; Firefox and WebKit results from a local run are recorded
- [ ] Review with the owner; this is the piece going to their work

### Phase 5: Rules, layer by layer

- [ ] Task 22: Write both rules into `.agents/components.md` and stop the barrel re-exporting utils
- [ ] Task 23: Apply the export rule to utils, tokens and icons
- [ ] Task 24: Apply both rules to layout, typography, buttons, interactive and markdown
- [ ] Task 25: Apply both rules to cards, lists, indicators and navigation
- [ ] Task 26: Give forms one `FieldSlotProps` type
- [ ] Task 27: Apply the slot rule to the forms controls
- [ ] Task 28: Apply the export rule to forms
- [ ] Task 29: Apply both rules to overlays and code
- [ ] Task 30: Apply both rules to tables and ai
- [ ] Task 30b: Move Table's boolean style flags into `tableVariants`

### Checkpoint: Rules

- [ ] Every package's barrel test lists exactly its intended public names
- [ ] The list of components using the runtime fallback is written into `.agents/components.md`, or is empty
- [ ] If more than a third of components needed the fallback, stop and review the rule with the owner
- [ ] Docs app builds against the new surface

### Phase 6: Deprecated APIs and `fullwidth`

- [ ] Task 31: Remove the remaining deprecated APIs
- [ ] Task 32: Replace `fullwidth` with `w="full"` in the lower layers
- [ ] Task 33: Replace `fullwidth` in the upper layers and delete the three mechanisms

### Phase 7: Docs truth pass

- [ ] Task 34: Correct the component READMEs against their types
- [ ] Task 35: Correct the Storybook overviews and rebuild the token tables on library components
- [ ] Task 36: Add the missing READMEs and examples
- [ ] Task 37: Close out

### Checkpoint: Complete

- [ ] All seven success criteria in the spec are met
- [ ] No `@deprecated` in `packages/*/src`
- [ ] Human review

## Parallelisation

- **Safe in parallel:** Tasks 1 to 6 with each other; Phase 4 alongside Phase 5 once Task 16 has merged; Tasks 26 to 28 alongside Task 29; Tasks 34 to 36 with each other.
- **Must be sequential:** Tasks 8 to 14; each Phase 5 task after its listed dependencies; Task 32 before Task 33.
- **Needs coordination:** Task 27 and UI-411 touch the same picker files, so UI-411 waits for Task 27. Tasks 20a, 20b and 28 all edit the forms barrel.

## Risks and mitigations

| Risk                                                                                          | Impact                    | Mitigation                                                                                                                              |
| --------------------------------------------------------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| The source export condition conflicts with `composite` and per-package `rootDir`              | High                      | Task 8 proves it on two packages first; if it fails, fall back to generated `paths` in one root tsconfig and keep going                 |
| TypeScript 7 changes emitted declarations or rejects existing code                            | High                      | Its own task, after the pipeline is stable; diff every package's `.d.ts` output; stay on 5.9 with the reason recorded if needed         |
| Dropping `vite-plugin-dts` changes what is published                                          | Medium                    | Compare `npm pack --dry-run` file lists before and after for every package                                                              |
| The wrapper that makes Maskito's writes visible to React breaks on a React or Maskito upgrade | Medium                    | Give it a dedicated test that fails loudly; wrap Maskito and never re-export it                                                         |
| Maskito has shipped two majors in 14 months                                                   | Medium                    | All engine use stays inside the mask factories, about 100 lines                                                                         |
| Omit-based slot types turn conditional for generic components such as Select and Combobox     | Medium                    | The agreed exit: use the runtime order for that component and record it                                                                 |
| Unexporting internals breaks the docs app or Storybook, which import from the barrel          | Low                       | Each Phase 5 task builds both apps before merge                                                                                         |
| The `fullwidth` replacement changes layout where the toggle and `w="full"` differ             | Medium                    | Before-and-after story pixel diff per package, as used for the Stack default change                                                     |
| Masks misbehave on a browser nobody tested                                                    | High for the owner's work | Chromium runs in CI; Task 21 records a local Firefox and WebKit run and states in the README that mobile keyboards and IME are untested |

## Open questions

One remains, on Lucide's alias icon names; Task 23 gathers the evidence for it, and a decision to change names becomes a new task. The other six were answered on 2026-11-18 and are recorded in the spec.
