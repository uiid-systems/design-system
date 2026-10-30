# Tasks: `ai-message` (UI-266)

The plan is in [`plan.md`](./plan.md). Each task reads [`SPEC-ai-message.md`](../docs/architecture/ai/SPEC-ai-message.md) before starting, along with `.agents/components.md` and `.agents/styling.md`.

### Task 1: `Message`, `MessageContent` and `MessageResponse`

**Description:** Create `packages/ai/src/message/` with `message.types.ts` (the three message types from the spec), `message.tsx` (`Message`: a `Stack` with `gap = 2`, `fullwidth`, `ax` from `from`, `data-slot="message"`, `data-from`, the module's `message` class), `message.module.css` (the three rules), and `subcomponents/message-content.tsx` (a `Stack` with `gap = 2`, `data-slot="message-content"`, the `content` class) and `subcomponents/message-response.tsx` (`memo` around `Markdown` with `data-slot="message-response"`).

**Acceptance criteria:**

- [x] `Message` writes `data-slot`, `data-from`, `data-ui-gap="2"` and `data-ui-fullwidth`; `user` writes `data-ui-ay="end"`, `assistant` and `system` write `start`; a caller's `ax`, `gap`, `className`, `ref` and `render` win
- [x] `MessageContent` writes its slot and `data-ui-gap="2"`, and passes `className`, `ref` and `render` through
- [x] `MessageResponse` renders markdown under its slot, survives a string cut off inside `**`, a link and a fence with and without `streaming`, forwards `streaming`, and does not recompile when a parent re-renders with the same props

**Verification:**

- [x] `pnpm test:run packages/ai/src/message`

**Dependencies:** None

**Files:** `message.types.ts`, `message.tsx`, `message.module.css`, `message.test.tsx`, `subcomponents/index.ts`, `subcomponents/message-content.tsx`, `subcomponents/message-response.tsx`

**Size:** M

### Task 2: `Suggestion` and the barrel

**Description:** Create `packages/ai/src/suggestion/` with `suggestion.types.ts` and `suggestion.tsx`: a `Button` with `variant = "subtle"`, `shape = "pill"`, `size = "small"`, `type = "button"` and `data-slot="suggestion"`. Export the four parts and four types from `src/index.ts`; update the barrel test's export list.

**Acceptance criteria:**

- [x] `Suggestion` is a `type="button"` with the slot and the `variant-subtle`, `shape-pill` and `size-small` classes, with `children` as its text; `onClick` receives the event; `variant`, `size` and `disabled` pass through
- [x] `Message`, `MessageContent`, `MessageResponse` and `Suggestion` export from `@uiid/ai`

**Verification:**

- [x] `pnpm test:run packages/ai`
- [x] `pnpm run build --filter=@uiid/ai`

**Dependencies:** Task 1

**Files:** `suggestion.types.ts`, `suggestion.tsx`, `suggestion.test.tsx`, `packages/ai/src/index.ts`, `packages/ai/src/index.test.ts`

**Size:** S

### Task 3: Examples, READMEs, stories and the conversation swap

**Description:** `message.examples.tsx` with `UserAndAssistant`, `Streaming`, `WithActions` (a `Group` of ghost square `Button`s with tooltips) and `WithConversation`. `suggestion.examples.tsx` with `Basic` (a wrapping `Group` of pills) and `WithEmptyState`. READMEs in the shape of `conversation/README.md`. `apps/storybook/stories/ai/message.stories.tsx`, `message.mdx`, `suggestion.stories.tsx` and `suggestion.mdx` in the shape of the prompt-input pair. Replace the placeholder `Message` in `conversation.examples.tsx` with the real parts. Examples render tests in both test files.

**Acceptance criteria:**

- [x] Every example renders without throwing; the actions example renders buttons named by their tooltips; the conversation test still finds its text
- [x] Stories render in Storybook and each MDX page shows its README and Playground controls
- [ ] The checkpoint list in `plan.md`

**Verification:**

- [x] `pnpm test:run packages/ai`
- [x] `pnpm run build --filter=@uiid/ai && pnpm size`
- [x] `pnpm run lint && pnpm run format:check`
- [x] `pnpm --filter @uiid/storybook dev`

**Dependencies:** Task 2

**Files:** `message.examples.tsx`, `message/README.md`, `suggestion.examples.tsx`, `suggestion/README.md`, `conversation.examples.tsx`, `message.test.tsx`, `suggestion.test.tsx`, the four story files

**Size:** M
