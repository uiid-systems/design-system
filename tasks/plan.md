# Implementation Plan: `ai-reasoning-tool` (UI-267)

## Overview

This plan builds the `ai-reasoning-tool` module from the [capability map](../docs/architecture/ai/capability-map.md): `Reasoning`, the collapsible thinking block, and `Tool`, the collapsible tool-call card, both on the `Collapsible` parts from `@uiid/interactive`. The `ai-message` plan that used to live here is complete and in git history (`92d0f18b`).

Spec: [`SPEC-ai-reasoning-tool.md`](../docs/architecture/ai/SPEC-ai-reasoning-tool.md), approved 2026-10-29.

## Architecture decisions

All settled in the spec:

- One `Reasoning` and one `Tool`, each composed on `CollapsibleRoot`, `CollapsibleTrigger` and `CollapsiblePanel`. No context, no exported sub-parts.
- `Reasoning` owns its open state so it can auto-open while streaming and auto-close once, one second after streaming ends. Duration is measured from the `streaming` prop and overridable with `duration`. The prop is `streaming`, not `isStreaming`.
- `Tool` takes `part: ToolPart`, defined in `tool.types.ts`, and holds no state. Seven `ToolState` values map to seven labels, icons and hues in `tool.constants.ts`; `Badge` from `@uiid/indicators` wears them.
- Tool code is `Prose` around a `pre`. `@uiid/code` is not a dependency and the `@uiid/ai` size limit stays at `80 kB`.
- New dependencies: `@uiid/interactive` and `@uiid/indicators`. No new tokens.

## Order and rationale

1. **`Tool` first.** It is stateless, so it proves the dependencies, the trigger pattern on `Group` with `nativeButton={false}` and the badge table without the timing logic in the way.
2. **`Reasoning` next.** The open state, the measured duration and the auto-close are the one place with behavior to get wrong; the `Tool` trigger and panel are already proven by then.
3. **Barrel, types and docs last.** Exports, the `ToolPart` type test against the SDK, examples, READMEs, stories and MDX, once both APIs are proven.

One PR, three commits after the spec.

## Task list

See [`todo.md`](./todo.md) for each task's acceptance criteria and verification steps.

- [x] Task 1: `Tool` with its state table
- [x] Task 2: `Reasoning` with its timing
- [x] Task 3: Barrel, type test, examples, READMEs and stories

### Checkpoint

- [x] `pnpm test:run packages/ai` passes, with the markdown, conversation, message and prompt-input tests unchanged
- [x] `pnpm run build --filter=@uiid/ai`, `pnpm run lint`, `pnpm run format:check` and `pnpm size` pass, the last at `80 kB` (`78.94 kB`)
- [x] Checked headless against the static Storybook build with Playwright, 2026-10-29: the shimmer animates and is `none` under reduced motion; the chevron turns 180°; the tool card has a 1px border, 8px radius and a hover surface; seven badge fills distinct in light and dark; a 300-character JSON line scrolls inside the `pre` (634px client, 2339px scroll) with the card at its own width; the running icon animates `spin`. Not measured: the panel while text streams in, which happy-dom and a static build cannot show
- [ ] Human review

## Risks and mitigations

| Risk                                                                           | Impact   | Mitigation                                                                                                      |
| ------------------------------------------------------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------- |
| The height transition clips markdown growing inside an open panel              | Visual   | Base UI sets the height var to `auto` once open and idle; verify in the Streaming story, fall back to `instant` |
| The auto-close effect fires again when `streaming` toggles a second time       | Behavior | A ref records that the close ran; a test toggles twice                                                          |
| `Badge` wraps children in `Text`, so the state icon misaligns with the label   | Visual   | Size the `svg` to `1em` and nudge it in the module; check in Storybook                                          |
| A new sibling dependency pulls a newer `@types/react` and breaks `tsc` on refs | Build    | Pin the lockfile importer to the siblings' versions, as the scaffold did                                        |
