# Tasks: `@uiid/ai` POC, wave 1

The plan is in [`plan.md`](./plan.md). Each task reads its module's spec in `docs/architecture/ai/` before starting, along with the `.agents/` chapter for the files it touches (`components.md` and `styling.md`; `architecture.md` for Phase C).

## Phase A: `forms-input-group`

### Task 1: `InputWrapper` `orientation`

**Description:** Add `orientation?: "horizontal" | "vertical"` to `InputWrapper`, defaulting to `INPUT_DEFAULT_ORIENTATION = "horizontal"`. Horizontal renders today's `Group ay="center"`. Vertical renders `Stack ax="stretch"`. Both stamp `data-orientation`. Add the two vertical rules to `input.module.css`: `height: auto` on the wrapper, and `padding-block: var(--forms-padding-y)` on the slots.

**Acceptance criteria:**

- [x] Every existing `input.test.tsx` case passes unchanged
- [x] The default renders `data-orientation="horizontal"` with the same classes as before
- [x] `orientation="vertical"` renders `data-orientation="vertical"` and keeps the surface, edge, color and slot `data-slot`s

**Verification:**

- [x] `pnpm test:run packages/forms/src/input`
- [x] `pnpm run build --filter=@uiid/forms`

**Dependencies:** None

**Files:** `input/input.types.ts`, `input/input.constants.ts`, `input/subcomponents/input-wrapper.tsx`, `input/input.module.css`, `input/input.test.tsx`

**Size:** S

### Task 2: Textarea `before`/`after`

**Description:** Add `before`/`after` to `TextareaProps`. When either is set, wrap the control in `<InputWrapper orientation="vertical">`, which receives `size`, `fullwidth`, `variant` and `color`. The textarea switches to `textarea` + `textarea-inner` + `textareaVariants({ size, resize })`. Add the `.textarea-inner` rules: no border, transparent background on hover too, no outline on focus-visible too, and block padding trimmed next to a slot.

**Acceptance criteria:**

- [x] Every existing `textarea.test.tsx` case passes unchanged, and the no-slot output is identical
- [x] With slots, the DOM order is `input-before`, `textarea`, `input-after`; variant, fullwidth and color sit on the wrapper, while size and resize stay on the textarea
- [x] `ref`, `rows`, `name` and `onValueChange` reach the `<textarea>`; a `<button>` in `after` is clickable and comes after the textarea in tab order

**Verification:**

- [x] `pnpm test:run packages/forms`
- [x] `pnpm run build --filter=@uiid/forms`
- [x] Compiled CSS check: `.textarea-inner` sits in `uiid.components`, and its border and outline rules outrank `composes-invalid`

**Dependencies:** Task 1

**Files:** `textarea/textarea.tsx`, `textarea/textarea.types.ts`, `textarea/textarea.module.css`, `textarea/textarea.test.tsx`

**Size:** M

### Task 3: Docs and story for Textarea slots and InputWrapper `orientation`

**Description:** Add a `BeforeAfterSlots` example to Textarea, shaped like a composer: a header row of chips and a footer row of tool buttons plus submit. Document the slots in Textarea's README and `orientation` in Input's README, then add the story.

**Acceptance criteria:**

- [x] The `BeforeAfterSlots` example and story render in Storybook
- [x] Both READMEs describe the new props, and the MDX pages pick them up

**Verification:**

- [x] `pnpm --filter @uiid/storybook dev` and a manual check: focus ring, the four sizes, ghost and color in both themes, invalid, the resize handle
- [x] `pnpm run lint && pnpm run format:check`

**Dependencies:** Task 2

**Files:** `textarea/textarea.examples.tsx`, `textarea/README.md`, `input/README.md`, `apps/storybook/stories/forms/textarea.stories.tsx`

**Size:** S

### Checkpoint A

- [x] `pnpm test:run packages/forms`, the forms build and `pnpm size` all pass
- [ ] Human review, after which PR 1 is ready

## Phase B: `typography-shimmer`

### Task 4: `Shimmer` component and tests

**Description:** Build `Shimmer` the same way `reveal/` is built: `Text` with `data-slot="shimmer"`, `--shimmer-duration` / `--shimmer-spread` on the root, a two-layer `background-clip: text` sweep, `-webkit-text-fill-color: transparent`, a module keyframe, and a reduced-motion fallback. Export it from `@uiid/typography`.

**Acceptance criteria:**

- [x] Renders the text with `data-slot="shimmer"`. Custom properties reflect the props and the defaults (2000 ms; spread `2` × `children.length` px)
- [x] A caller's `style` is merged in. `Text` props come through as `data-ui-*` attributes, and `render` swaps the element
- [x] No `"use client"`, no hooks, no new tokens and no new dependencies

**Verification:**

- [x] `pnpm test:run packages/typography`
- [x] `pnpm run build --filter=@uiid/typography`
- [x] `pnpm size`: `@uiid/typography` stays at or under 25 kB

**Dependencies:** None

**Files:** `shimmer/shimmer.tsx`, `shimmer/shimmer.types.ts`, `shimmer/shimmer.constants.ts`, `shimmer/shimmer.module.css`, `shimmer/shimmer.test.tsx`, `typography/src/index.ts`

**Size:** M

### Task 5: Shimmer docs and story

**Description:** Add examples (default, sizes, palette color, duration and spread), a README, and a story whose files match Reveal's. Add Shimmer to the typography overview.

**Acceptance criteria:**

- [x] The story renders in Storybook, backed by the README
- [x] The typography overview lists Shimmer

**Verification:**

- [x] Manual check in Storybook: the sweep in light and dark, a palette `color`, and reduced motion (emulated in DevTools). Note whether `--shade-background` reads well, which is the spec's open question
- [x] `pnpm run lint && pnpm run format:check`

**Dependencies:** Task 4

**Files:** `shimmer/shimmer.examples.tsx`, `shimmer/README.md`, `apps/storybook/stories/typography/shimmer.stories.tsx`, `apps/storybook/stories/typography/overview.mdx`

**Size:** S

### Checkpoint B

- [x] The typography tests, build and `pnpm size` pass
- [ ] Human review: the shimmer highlight decision, after which PR 2 is ready

## Phase C: `ai-scaffold`

### Task 6: Package skeleton that builds and tests

**Description:** Create `packages/ai` from `packages/interactive`'s config files. Its `package.json` is version `0.7.1` with `"private": true`. Add the `ai` CSS layer, the root `tsconfig` reference, and the `uiidPackages` entry in Vitest. Start the source with an empty barrel.

**Acceptance criteria:**

- [x] `pnpm run build --filter=@uiid/ai` emits `dist/index.js` and `dist/index.d.ts`
- [x] `pnpm test:run packages/ai` discovers the package (a placeholder test passes, and Task 7 replaces it)
- [x] Storybook resolves `@uiid/ai` from source with no configuration change

**Verification:**

- [x] `pnpm install && pnpm run build --filter=@uiid/ai`
- [x] `pnpm test:run packages/ai`

**Dependencies:** None

**Files:** `packages/ai/{package.json, tsconfig.json, vite.config.ts, src/index.ts, src/vite-env.d.ts}`, `scripts/css-layers.cjs`, `vitest.config.ts`, `tsconfig.json`

**Size:** M (boilerplate)

### Task 7: Shared types and drift test

**Description:** Add `ChatRole`, `ChatStatus` and `ToolState` in `ai.types.ts` and export them from the barrel. Add `ai` as a pinned devDependency. `ai.types.test.ts` pins each union with `expectTypeOf`, and checks them against `UIMessage["role"]`, `ChatStatus` and `ToolUIPart["state"]`.

**Acceptance criteria:**

- [x] The unions match the spec, and the drift assertions pass against the installed `ai`
- [x] No file in `dist/*.d.ts` mentions `ai`
- [x] The lockfile diff touches only `ai` and its dependencies

**Verification:**

- [x] `pnpm test:run packages/ai`
- [x] `pnpm run build --filter=@uiid/ai && grep -r '"ai"' packages/ai/dist` returns nothing

**Dependencies:** Task 6

**Files:** `packages/ai/src/ai.types.ts`, `packages/ai/src/ai.types.test.ts`, `packages/ai/src/index.ts`, `packages/ai/package.json`, `pnpm-lock.yaml`

**Size:** S

### Task 8: Release, size and umbrella registration

**Description:** Add `packages/ai/package.json` to release-please's `extra-files`, add a `.size-limit.json` entry at 40 kB, add the dependency to `@uiid/design-system` along with `export * from "@uiid/ai"`, and list the package in the root README.

**Acceptance criteria:**

- [x] `pnpm size` measures `@uiid/ai`
- [x] `@uiid/design-system` does not depend on `@uiid/ai` while it is private; the umbrella re-export is deferred to the POC's final step (review finding, see spec row 10)
- [x] `pnpm -r publish --dry-run` skips `@uiid/ai`

**Verification:**

- [x] `pnpm run build`
- [x] `pnpm size`
- [x] `pnpm -r publish --dry-run 2>&1 | grep -c '@uiid/ai'` prints `0`

**Dependencies:** Task 7

**Files:** `release-please-config.json`, `.size-limit.json`, `packages/design-system/package.json`, `packages/design-system/src/index.ts`, `README.md`

**Size:** S

### Task 9: Fix the new-package checklist

**Description:** Update the new-package checklist in `.agents/components.md`:

- Correct step 5: Storybook finds packages automatically, so no registration step is needed.
- Add the missing touchpoints, which correspond to rows 7–12 of the scaffold spec: the root `tsconfig` reference, release-please `extra-files`, `.size-limit.json`, the design-system dependency, export and `globals.css`, the root README, and `"private": true` while the package is unreleased.

**Acceptance criteria:**

- [x] Each touchpoint Tasks 6–8 changed is listed in the checklist
- [x] Nothing in the checklist contradicts the repo

**Verification:**

- [x] Walk the checklist against the Phase C diff

**Dependencies:** Task 8

**Files:** `.agents/components.md`

**Size:** XS

### Checkpoint C (wave complete)

- [x] `pnpm run build`, `pnpm test:run`, `pnpm run lint`, `pnpm run format:check` and `pnpm size` pass from the repo root
- [ ] Human review, after which PR 3 is ready and the `markdown` spec can start

## Wave 2: `markdown`

Each task reads [`SPEC-markdown.md`](../docs/architecture/ai/SPEC-markdown.md) and `.agents/components.md` before starting.

### Task 10: `Markdown` component, tests and barrel export

**Description:** Add `markdown-to-jsx` and `@uiid/typography` to `packages/ai`, externalize `/^markdown-to-jsx(\/|$)/` in its Vite config, and build `Markdown` in `packages/ai/src/markdown/`: `Prose` with `data-slot="markdown"` around `compiler(children, { wrapper: null, forceBlock: true, optimizeForStreaming: streaming })`. Export it from the barrel and update the barrel test.

**Acceptance criteria:**

- [ ] A complete document renders the expected elements as direct children of the root, and a one-line string renders as a `p`
- [ ] With `streaming`, every cut case in the spec renders without throwing, without raw delimiters in `textContent`, and without a key warning; an open fence renders as `pre > code`
- [ ] Without `streaming`, finished text with a stray backtick keeps every word
- [ ] A `javascript:` href is dropped; `Prose` props, `render` and `className` pass through
- [ ] The barrel exports `Markdown` and nothing else at runtime

**Verification:**

- [ ] `pnpm test:run packages/ai`
- [ ] `pnpm run build --filter=@uiid/ai && grep -r '"ai"' packages/ai/dist` returns nothing
- [ ] `pnpm size`: `@uiid/ai` stays under 40 kB

**Dependencies:** None (spec approved)

**Files:** `packages/ai/package.json`, `pnpm-lock.yaml`, `packages/ai/vite.config.ts`, `markdown/markdown.tsx`, `markdown/markdown.types.ts`, `markdown/markdown.test.tsx`, `packages/ai/src/index.ts`, `packages/ai/src/index.test.ts`

**Size:** M

### Task 11: Markdown examples, README and story

**Description:** Add `Basic` and `Streaming` examples (the latter replays a fixture token by token with `streaming` on, then flips it off), a README in the shape of Shimmer's, and `apps/storybook/stories/ai/markdown.stories.tsx` plus `markdown.mdx`. Add `@uiid/ai` as a Storybook devDependency so the story typechecks.

**Acceptance criteria:**

- [ ] Both examples render in Storybook, imported from `@uiid/ai`
- [ ] The README documents `children` and `streaming`, what streaming mode holds back, and its cost on finished text
- [ ] The MDX page renders the README and the Playground controls

**Verification:**

- [ ] `pnpm run lint && pnpm run format:check`
- [ ] `pnpm --filter @uiid/storybook dev` and a manual check of the Streaming story in both themes

**Dependencies:** Task 10

**Files:** `markdown/markdown.examples.tsx`, `markdown/README.md`, `apps/storybook/package.json`, `apps/storybook/stories/ai/markdown.stories.tsx`, `apps/storybook/stories/ai/markdown.mdx`

**Size:** S

### Checkpoint D

- [ ] Tests, build, lint, format and `pnpm size` pass from the repo root
- [ ] Human review, after which PR 4 is ready
