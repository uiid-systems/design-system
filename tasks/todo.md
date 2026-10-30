# Tasks: `ai-reasoning-tool` (UI-267)

The plan is in [`plan.md`](./plan.md). Each task reads [`SPEC-ai-reasoning-tool.md`](../docs/architecture/ai/SPEC-ai-reasoning-tool.md) before starting, along with `.agents/components.md` and `.agents/styling.md`.

### Task 1: `Tool` with its state table

**Description:** Add `@uiid/interactive` and `@uiid/indicators` to `packages/ai/package.json` and the tsconfig references. Create `packages/ai/src/tool/` with `tool.types.ts` (`ToolPart`, `ToolProps`), `tool.constants.ts` (the seven-state table of label, icon and hue), `tool.tsx` (`CollapsibleRoot` with `fullwidth`, `b={1}`, `data-slot="tool"`, `data-state`; a `CollapsibleTrigger` rendered as a `Group` with `nativeButton={false}` holding `WrenchIcon`, the name, the `Badge` and the chevron; a `CollapsiblePanel` holding `children` or the default body), `tool.module.css` (radius and overflow, trigger cursor and hover, chevron rotation, badge icon size, the spin keyframe with its reduced-motion override), and `subcomponents/` with `tool-input.tsx`, `tool-output.tsx` and `tool-code.tsx` (`Prose` around a `pre`).

**Acceptance criteria:**

- [ ] The root writes `data-slot="tool"`, `data-state` from the part, `data-ui-fullwidth` and `data-ui-b="1"`; a caller's `b`, `className` and `ref` reach it
- [ ] The name is `title`, else `toolName`, else `type` without its `tool-` prefix
- [ ] Each of the seven states renders `[data-slot="tool-status"]` with its label and its hue's palette class
- [ ] Closed by default; the trigger has `role="button"` and opens it; the input section reads "Parameters" and pretty-prints the input; a string output sits in a `pre`, an object is pretty-printed, an element renders as itself under "Result"; `errorText` turns the heading to "Error" and renders the text; with neither there is no output section; `children` replaces the body

**Verification:**

- [ ] `pnpm test:run packages/ai/src/tool`
- [ ] `pnpm run build --filter=@uiid/ai`

**Dependencies:** None

**Files:** `packages/ai/package.json`, `packages/ai/tsconfig.json`, `pnpm-lock.yaml`, `tool.types.ts`, `tool.constants.ts`, `tool.tsx`, `tool.module.css`, `tool.test.tsx`, `subcomponents/index.ts`, `subcomponents/tool-input.tsx`, `subcomponents/tool-output.tsx`, `subcomponents/tool-code.tsx`

**Size:** M

### Task 2: `Reasoning` with its timing

**Description:** Create `packages/ai/src/reasoning/` with `reasoning.types.ts`, `reasoning.constants.ts` (the labels), `reasoning.tsx` (`"use client"`; open state defaulting to `defaultOpen ?? streaming`, a controlled `open` winning; an auto-open effect gated on `defaultOpen !== false`; a start-time ref, a measured duration in state and a one-second auto-close that runs once; a `CollapsibleTrigger` rendered as a `Group` with `nativeButton={false}` holding `BrainIcon`, a `Shimmer` or `Text` label and the chevron; a `CollapsiblePanel` with `instant={false}` and `ax="stretch"` holding `Markdown` with `streaming` forwarded) and `reasoning.module.css` (trigger cursor and colors, chevron rotation, icon size).

**Acceptance criteria:**

- [ ] The root writes `data-slot="reasoning"`, `data-ui-gap="2"` and `data-streaming` while streaming; a caller's `gap`, `className` and `ref` reach it
- [ ] The trigger has `role="button"` and `aria-expanded`; streaming reads "Thinking…" in a `[data-slot="shimmer"]`; `duration={4}` reads "Thought for 4 seconds", `duration={1}` "Thought for 1 second", neither reads "Reasoning"
- [ ] Mounted streaming the panel is open and `**bold**` renders a `strong`; mounted idle it is closed and the trigger opens it; `false` to `true` opens it unless `defaultOpen={false}`
- [ ] With fake timers, four seconds of streaming then off reads "Thought for 4 seconds" at once and closes one second later, once; a controlled `open` stays open and `onOpenChange` receives `false`

**Verification:**

- [ ] `pnpm test:run packages/ai/src/reasoning`
- [ ] `pnpm run build --filter=@uiid/ai`

**Dependencies:** Task 1

**Files:** `reasoning.types.ts`, `reasoning.constants.ts`, `reasoning.tsx`, `reasoning.module.css`, `reasoning.test.tsx`

**Size:** M

### Task 3: Barrel, type test, examples, READMEs and stories

**Description:** Export `Reasoning`, `Tool` and the types `ReasoningProps`, `ToolPart` and `ToolProps` from `src/index.ts`; update the barrel test's export list; add `ToolUIPart` and `DynamicToolUIPart` assignability checks to `ai.types.test.ts`. `reasoning.examples.tsx` with `Basic`, `Streaming` (opens, finishes, closes, repeats) and `InMessage` (above a `MessageResponse`). `tool.examples.tsx` with `Basic`, `States` (all seven), `Lifecycle` (cycles through the states) and `InMessage` (reasoning, tool, response in order). READMEs in the shape of `message/README.md`. `apps/storybook/stories/ai/reasoning.stories.tsx`, `reasoning.mdx`, `tool.stories.tsx` and `tool.mdx` in the shape of the message pair. Examples render tests in both test files.

**Acceptance criteria:**

- [ ] `Reasoning` and `Tool` export from `@uiid/ai` and both SDK tool part types satisfy `ToolPart`
- [ ] Every example renders without throwing; the states example renders all seven labels
- [ ] Stories render in Storybook and each MDX page shows its README and Playground controls
- [ ] The checkpoint list in `plan.md`

**Verification:**

- [ ] `pnpm test:run packages/ai`
- [ ] `pnpm run build --filter=@uiid/ai && pnpm size`
- [ ] `pnpm run lint && pnpm run format:check`
- [ ] `pnpm --filter @uiid/storybook dev`

**Dependencies:** Task 2

**Files:** `packages/ai/src/index.ts`, `packages/ai/src/index.test.ts`, `packages/ai/src/ai.types.test.ts`, `reasoning.examples.tsx`, `reasoning/README.md`, `reasoning.test.tsx`, `tool.examples.tsx`, `tool/README.md`, `tool.test.tsx`, the four story files

**Size:** M
