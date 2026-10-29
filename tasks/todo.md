# Tasks: `ai-prompt-input` (UI-265)

The plan is in [`plan.md`](./plan.md). Each task reads [`SPEC-ai-prompt-input.md`](../docs/architecture/ai/SPEC-ai-prompt-input.md) before starting, along with `.agents/components.md` and `.agents/styling.md`.

### Task 1: `PromptInputSubmit` and the module's types

**Description:** Create `packages/ai/src/prompt-input/` with `prompt-input.types.ts` (all three types from the spec), `prompt-input.constants.ts` (label and placeholder) and `subcomponents/prompt-input-submit.tsx`. The button is a `Button` with `shape="circle"` and `size="xsmall"`. For `submitted` and `streaming` it renders `type="button"`, `aria-label="Stop"` and calls `onStop` from `onClick` unless the caller's `onClick` prevented default. Otherwise it renders `type="submit"` and `aria-label="Send"`. Icons: `ArrowUpIcon` for `ready`, `XIcon` for `error`, `SquareIcon` for `streaming`, and the square with `loading` for `submitted`. Stamp `data-slot="prompt-input-submit"`. Add `@uiid/forms` to `packages/ai/package.json`.

**Acceptance criteria:**

- [ ] `ready`, `error` and no status render a `type="submit"` button named "Send"; `error` renders a different icon from `ready`
- [ ] `submitted` and `streaming` render a `type="button"` button named "Stop"; only `submitted` has a `data-loading` content container
- [ ] Pressing Stop calls `onStop` once; a caller's `onClick` that prevents default vetoes it
- [ ] `children` replaces the icon; `aria-label` replaces the label; `variant` and `size` pass through

**Verification:**

- [ ] `pnpm test:run packages/ai/src/prompt-input`

**Dependencies:** None

**Files:** `prompt-input.types.ts`, `prompt-input.constants.ts`, `subcomponents/prompt-input-submit.tsx`, `subcomponents/index.ts`, `prompt-input.test.tsx`, `packages/ai/package.json`

**Size:** S

### Task 2: `PromptInput`

**Description:** `prompt-input.tsx` renders a `<form data-slot="prompt-input" data-status>` around `Textarea` with the defaults from the spec (`aria-label`, `placeholder`, `rows={1}`, `resize="none"`, `fullwidth`), `header` in a `Group` in `before` only when set, and `after` always holding the footer `Group` with the tools `Group` and `PromptInputSubmit`. `handleSubmit` prevents default, no-ops on blank text or a generating status, calls `onSubmit({ text }, event)` and clears an uncontrolled textarea. `handleKeyDown` forwards to the caller first, then on plain Enter outside a composition prevents default and calls `form.requestSubmit()`. `prompt-input.module.css` holds the two rules: the root's `--prompt-input-max-height` and `display: block`, and the textarea's `field-sizing: content`, `max-height` and `overflow-y: auto`.

**Acceptance criteria:**

- [ ] DOM order is `input-before` > `prompt-input-header` (only with `header`), `textarea`, `input-after` > `prompt-input-footer` > `prompt-input-tools` then `prompt-input-submit`
- [ ] `className` lands on the form; `ref` on the `<textarea>`; a caller's `aria-label`, `label` and `placeholder` win over the defaults
- [ ] Send and Enter call `onSubmit` with `{ text }` and a default-prevented event, then empty an uncontrolled textarea and leave a controlled `value` alone
- [ ] Shift+Enter, a composing Enter, Enter while `streaming`, and blank text all call nothing
- [ ] `disabled` disables the textarea and the submit button; a plain `Button` in `tools` does not submit the form

**Verification:**

- [ ] `pnpm test:run packages/ai`
- [ ] `pnpm run build --filter=@uiid/ai`

**Dependencies:** Task 1

**Files:** `prompt-input.tsx`, `prompt-input.module.css`, `prompt-input.test.tsx`

**Size:** M

### Task 3: Examples, README, stories and exports

**Description:** `prompt-input.examples.tsx` with `Basic`, `WithHeader`, `WithTools`, `Statuses` (one composer per `ChatStatus`), `Controlled`, `Disabled` and `WithConversation`. A README in the shape of `conversation/README.md`. Barrel exports in `src/index.ts`. `apps/storybook/stories/ai/prompt-input.stories.tsx` and `prompt-input.mdx` in the shape of the conversation pair. An examples render test.

**Acceptance criteria:**

- [ ] Every example renders without throwing in the test
- [ ] `PromptInput`, `PromptInputSubmit` and the three types export from `@uiid/ai`
- [ ] Stories render in Storybook and the MDX page shows the README and the Playground controls

**Verification:**

- [ ] `pnpm test:run packages/ai`
- [ ] `pnpm run build --filter=@uiid/ai && pnpm size`
- [ ] `pnpm run lint && pnpm run format:check`
- [ ] `pnpm --filter @uiid/storybook dev`, then the checkpoint list in `plan.md`

**Dependencies:** Task 2

**Files:** `prompt-input.examples.tsx`, `README.md`, `packages/ai/src/index.ts`, `apps/storybook/stories/ai/prompt-input.stories.tsx`, `apps/storybook/stories/ai/prompt-input.mdx`, `prompt-input.test.tsx`

**Size:** M
