# Spec: `ai-prompt-input`

**Module:** `ai-prompt-input` (see [capability map](./capability-map.md))
**Package:** `@uiid/ai`
**Status:** Approved
**Upstream:** `ai-elements/packages/elements/src/prompt-input.tsx` at `ca8be60`, a 1,463-line compound built on shadcn's `InputGroup`
**Depends on:** `ai-scaffold`, `forms-input-group`

## Objective

`PromptInput` is the composer at the bottom of a chat: a textarea that grows with its text, a submit button that becomes a stop button while a reply is in flight, an optional header row above the text, and a footer row of tool buttons below it. All four sit inside one field surface, which is `Textarea`'s `before`/`after` slots doing the work `forms-input-group` built them for. There is no second surface implementation.

It is a trimmed port. Upstream is mostly attachments: a provider and controller, file inputs, drag-and-drop, paste-to-attach, blob conversion, a screenshot action, plus an action menu, a model select, a hover card, tabs and a command menu. The capability map rules all of that out. What is left is the composer itself, and that is one component with one button part and no state of its own.

This is the last module in the build order. It does not publish the package; that is the POC's final step, and it stays separate.

**Acceptance criteria:**

- `<PromptInput onSubmit={…} />` renders one field surface containing, in order, the header row if `header` is set, the textarea, and the footer row. The footer row holds `tools` at the start and the submit button at the end.
- The submit button renders for `ready` and for `error`, and a stop button renders for `submitted` and `streaming`. The icon is an up arrow for `ready`, an X for `error`, a spinner for `submitted` and a square for `streaming`.
- Enter submits. Shift+Enter inserts a newline. Enter during an IME composition does nothing. Enter while `submitted` or `streaming` does nothing.
- Pressing the submit button or Enter calls `onSubmit({ text }, event)` with the textarea's text and the form event already default-prevented. Empty or whitespace-only text calls nothing. Pressing stop calls `onStop()` and never `onSubmit`.
- An uncontrolled textarea is cleared after `onSubmit` is called. A controlled one (`value` set) is left to its owner.
- The textarea grows with its content up to a maximum height, then scrolls. There is no resize handle.
- The root carries `data-slot="prompt-input"` and `data-status` with the current status, so a consumer can style any state.
- `pnpm size` passes for `@uiid/ai` at its current `80 kB` limit.

## Upstream parts

| Upstream part                                                                                                                                                 | Here                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `PromptInput` (the `<form>`)                                                                                                                                  | **Kept** as `PromptInput`, which is also the textarea and the rows                                          |
| `PromptInputTextarea`                                                                                                                                         | **Folded in.** PromptInput renders `Textarea` itself; its props are PromptInput's props                     |
| `PromptInputHeader`                                                                                                                                           | **Folded in** as the `header` prop, rendered in Textarea's `before` slot                                    |
| `PromptInputFooter`                                                                                                                                           | **Folded in.** Always rendered in Textarea's `after` slot; it holds `tools` and the submit button           |
| `PromptInputTools`                                                                                                                                            | **Folded in** as the `tools` prop                                                                           |
| `PromptInputSubmit`                                                                                                                                           | **Kept.** A `Button` that is submit or stop by `status`                                                     |
| `PromptInputButton`                                                                                                                                           | **Dropped.** Tools are plain `Button`s; see resolved decision 7                                             |
| `PromptInputBody`                                                                                                                                             | **Dropped.** It existed to hold attachments above the textarea                                              |
| `PromptInputProvider`, `usePromptInputController`, `useProviderAttachments`, `usePromptInputAttachments`, `usePromptInputReferencedSources`                   | **Dropped.** Attachments and lifted text state are out of scope. Controlled text is `value`/`onValueChange` |
| `PromptInputAttachment(s)`, `PromptInputActionAddAttachments`, `PromptInputActionAddScreenshot`, paste-to-attach, drag-and-drop, `syncHiddenInput`, `onError` | **Dropped.** Attachments                                                                                    |
| `PromptInputActionMenu*`, `PromptInputSelect*`, `PromptInputHoverCard*`, `PromptInputTab*`, `PromptInputCommand*`                                             | **Dropped.** Re-exports of shadcn menus and popovers. A consumer puts a UIID `Menu` or `Select` in `tools`  |
| `InputGroup`'s click-to-focus on empty addon space                                                                                                            | **Dropped.** Same as Textarea; see resolved decision 4                                                      |

## API

```ts
// prompt-input.types.ts
import type { ButtonProps } from "@uiid/buttons";
import type { TextareaProps } from "@uiid/forms";

import type { ChatStatus } from "../ai.types";

/** What `onSubmit` receives. An object so attachments can join it later without a breaking change. */
export type PromptInputMessage = {
  text: string;
};

export type PromptInputProps = Omit<
  TextareaProps,
  "before" | "after" | "resize"
> & {
  /** Where the chat request is. Drives submit versus stop. Defaults to `"ready"`. */
  status?: ChatStatus;
  /** Called on Enter or on the submit button, with the text and the already-prevented form event. */
  onSubmit: (
    message: PromptInputMessage,
    event: React.FormEvent<HTMLFormElement>,
  ) => void | Promise<void>;
  /** Called when the stop button is pressed while `submitted` or `streaming`. */
  onStop?: () => void;
  /** Row above the text, inside the surface. Chips, an attachment list, a mode label. */
  header?: React.ReactNode;
  /** Buttons at the start of the footer row, before the submit button. */
  tools?: React.ReactNode;
};

export type PromptInputSubmitProps = ButtonProps & {
  /** Submit for `ready` and `error`; stop for `submitted` and `streaming`. Defaults to `"ready"`. */
  status?: ChatStatus;
  /** Called instead of submitting while `submitted` or `streaming`. */
  onStop?: () => void;
};
```

Everything that is not in the `&` block is a `Textarea` prop and reaches the textarea: `placeholder`, `value`, `defaultValue`, `onValueChange`, `disabled`, `size`, `variant`, `color`, `rows`, `label`, `description`, `FieldProps`, `ref` and the native `<textarea>` attributes. `before` and `after` are the header and footer, and `resize` is fixed at `none` because the textarea sizes itself, so those three are omitted. `className` goes to the root `<form>`, as on every component. The `<textarea>` element's own class is not exposed; the surface is styled through `variant`, `color` and `size`.

Defaults that differ from `Textarea`: `placeholder` is `"Ask anything"`, `aria-label` is `"Message"` unless the caller passes `label` or their own `aria-label`, `rows` is `1`, `resize` is `none`, and `fullwidth` is `true`.

Exports from the barrel: `PromptInput`, `PromptInputSubmit`, `PromptInputProps`, `PromptInputSubmitProps` and `PromptInputMessage`.

## Implementation notes

### Structure

```tsx
<form
  data-slot="prompt-input"
  data-status={status}
  className={cx(styles["prompt-input"], className)}
  onSubmit={handleSubmit}
>
  <Textarea
    ref={textareaRef}
    aria-label={PROMPT_INPUT_LABEL}
    placeholder={PROMPT_INPUT_PLACEHOLDER}
    rows={1}
    resize="none"
    fullwidth
    className={styles["textarea"]}
    onKeyDown={handleKeyDown}
    before={
      header && (
        <Group data-slot="prompt-input-header" gap={1} wrap fullwidth>
          {header}
        </Group>
      )
    }
    after={
      <Group
        data-slot="prompt-input-footer"
        ax="space-between"
        ay="center"
        gap={2}
        fullwidth
      >
        <Group data-slot="prompt-input-tools" gap={1} wrap>
          {tools}
        </Group>
        <PromptInputSubmit
          status={status}
          onStop={onStop}
          disabled={disabled}
        />
      </Group>
    }
    {...props}
  />
</form>
```

`after` is always set, so the surface is always `InputWrapper` in its vertical orientation and the textarea is always `textarea-inner`. There is no slotless path to keep working. The header `Group` renders only when `header` is set, so an empty header never leaves a padded blank row.

The root is a plain `<form>`, not `@uiid/forms`'s `Form`. `Form` is Base UI's, which exists to run field validation and publish an `errors` map, and a composer has neither. A `<form>` gives Enter and the submit button one native path, `requestSubmit()`, and gives the submit button its `type="submit"` semantics for free.

PromptInput holds no state. The text lives in the `<textarea>` (or in the caller's `value`), the status lives in the caller, and composition state is read off the keyboard event.

### Submit, Enter and stop

`handleSubmit` prevents default, reads `textareaRef.current.value`, and returns early if the trimmed text is empty or the status is `submitted` or `streaming`. Otherwise it calls `onSubmit({ text }, event)` and then, if the textarea is uncontrolled (`value` is undefined), sets the element's value to `""`. The call is synchronous and the result is not awaited: when `onSubmit` is wired to `useChat`'s `sendMessage`, the message is already in the transcript, and a draft kept around until a promise settles would be a second copy of it. A consumer who wants to keep the draft on failure uses a controlled `value`.

`handleKeyDown` calls the caller's `onKeyDown` first and returns if that prevented default. Then, for `Enter` without Shift and outside a composition, it prevents default and calls `event.currentTarget.form?.requestSubmit()`. A composition is `event.nativeEvent.isComposing`, or `event.keyCode === 229`, which is what Safari reports on the Enter that commits one. Shift+Enter falls through to the browser and inserts a newline. The empty and generating checks live in `handleSubmit`, so Enter and the button share them.

The submit button is never disabled by the text. Pressing Send with nothing typed does nothing, which is the same as Enter with nothing typed, and costs no tracking of the draft.

`PromptInputSubmit` computes `isGenerating = status === "submitted" || status === "streaming"`. While generating it renders `type="button"`, `aria-label="Stop"`, and an `onClick` that calls `onStop` after the caller's `onClick`, unless that prevented default. Otherwise it renders `type="submit"` and `aria-label="Send"`. Icons by status: `ArrowUpIcon` for `ready`, `XIcon` for `error`, `SquareIcon` for `streaming`, and for `submitted` the square with `Button`'s `loading` set, which paints `Button`'s own spinner over it without the button changing size. Defaults: `shape="circle"`, `size="xsmall"`. `children` replaces the icon; `aria-label` replaces the label. `data-slot="prompt-input-submit"` is stamped.

Tools are plain `Button`s. Base UI's `Button` already renders `type="button"` unless told otherwise, so a tool inside the form cannot submit it by accident. The examples use `variant="ghost" shape="square" size="xsmall"` with a string `tooltip`, which also names an icon-only button.

### Auto-grow

```css
.prompt-input .textarea {
  field-sizing: content;
  min-height: auto;
  max-height: var(--prompt-input-max-height);
  overflow-y: auto;
}

.prompt-input {
  --prompt-input-max-height: calc(var(--spacing-unit) * 48);
}
```

`field-sizing: content` is Baseline Newly available: Chrome and Edge 123, Safari 26.2 and Firefox 152 (June 2026). The floor is one line: the size tier pins a three-row `min-height` meant for a form field, and the descendant selector outranks that single class so the composer starts compact. The cap is `12rem`, the same `max-h-48` upstream uses, and once reached the textarea scrolls. In a browser without `field-sizing`, the textarea is as tall as `rows={1}` and the tier's `min-height`, and scrolls past that, which is what Textarea does today. No JS measuring, no hidden mirror element.

The cap is a module-local custom property set on the root, in the style of `conversation.module.css`'s `bottom: calc(var(--spacing-unit) * 4)`. It is not a token: no other component reads it, and a consumer who wants a different cap overrides the property on the root.

### CSS and tokens

Two rules: `.prompt-input` sets the custom property and `display: block`; `.textarea` sets the auto-grow. The surface, the slot padding, the focus ring, the disabled dimming and the `color` tint all come from `InputWrapper` and `Textarea`. No new tokens. The design-system `globals.css` import stays deferred with scaffold rows 10 and 11, as the conversation spec set out; Storybook gets the CSS through the source alias.

### Package

`@uiid/forms` becomes a dependency of `@uiid/ai`. Every `@uiid/*` import is external in the Vite build, so the bundle grows by PromptInput's own code only. The `ai` package was scaffolded after `forms`; if its `@types/react` resolves to a newer version than `forms`'s dist was built against, `TextareaProps`'s `ref` type can fail `tsc` as "unrelated". The fix, if it hits, is pinning the lockfile importer to the siblings' versions, not a cast.

## Files

```
packages/ai/
  package.json                                      (@uiid/forms dependency)
  src/index.ts                                      (PromptInput exports)
  src/prompt-input/
    prompt-input.tsx
    prompt-input.types.ts
    prompt-input.constants.ts                       (label, placeholder)
    prompt-input.module.css
    prompt-input.test.tsx
    prompt-input.examples.tsx
    README.md
    subcomponents/
      index.ts
      prompt-input-submit.tsx
apps/storybook/stories/ai/
  prompt-input.stories.tsx
  prompt-input.mdx
docs/architecture/ai/capability-map.md              (spec table row)
```

## Commands

```
pnpm run build --filter='./packages/*'
pnpm test:run packages/ai
pnpm run build --filter=@uiid/ai
pnpm run lint && pnpm run format:check
pnpm size
pnpm --filter @uiid/storybook dev
```

The first build is needed once in a fresh worktree so Storybook and the tests can resolve token CSS and sibling dist.

## Testing strategy

Vitest with happy-dom and `@testing-library/user-event`. `textarea.test.tsx`'s slot block and `conversation.test.tsx` are the templates.

**Structure:**

- The root is a `<form>` with `data-slot="prompt-input"` and `data-status`; `className` lands on it. `ref` lands on the `<textarea>`.
- The parts appear in DOM order `input-before` holding `prompt-input-header`, `textarea`, `input-after` holding `prompt-input-footer`, with `prompt-input-tools` before `prompt-input-submit` inside it.
- With no `header`, no `input-before` renders.
- The textarea has `aria-label="Message"`, the default placeholder, `rows="1"`, the `resize-none` class and the `fullwidth` wrapper class. A caller's `aria-label`, `label` and `placeholder` win.

**Status:**

- `ready` and no status: a `type="submit"` button named "Send". `error`: the same button, `data-status="error"` on the root, and a different icon.
- `submitted`: a `type="button"` named "Stop" whose content container is `data-loading`. `streaming`: the same without `data-loading`.
- Pressing Stop calls `onStop` once and `onSubmit` never. A caller's `onClick` that prevents default vetoes `onStop`.

**Submit:**

- Typing then pressing Send calls `onSubmit` with `{ text }` and a default-prevented event, then empties the textarea.
- Enter does the same. Shift+Enter calls nothing and leaves a newline in the value.
- A keydown with `isComposing` calls nothing; the next plain Enter submits.
- Enter while `streaming` calls nothing.
- Whitespace-only text: Send stays enabled, and pressing it or Enter calls nothing.
- With `value` set, submitting does not change the value; `onValueChange` is still forwarded on typing.
- `disabled` disables the textarea and the submit button.
- A plain `Button` in `tools` does not submit the form when pressed.

**Part:** `PromptInputSubmit` renders standalone with the same status mapping, and `children` replaces the icon.

**Examples:** every export of `prompt-input.examples.tsx` renders without throwing, as the conversation test does.

**Checked by hand in Storybook**, since happy-dom does no layout: the textarea grows line by line and stops at the cap; the focus ring wraps header, text and footer together; the four sizes; ghost and a palette `color` in both themes; the spinner in the `submitted` state; and Shift+Enter in Safari.

## Boundaries

- **Always:** build on `Textarea`'s `before`/`after`; reuse `Button` for every button; `ChatStatus` from `ai.types.ts`; keep the no-dependency rule, so no `ai`, no `motion`, nothing new in `package.json` but `@uiid/forms`.
- **Ask first:** any new token; any change to `Textarea`, `InputWrapper` or `Button`; raising the `80 kB` limit; a `name` or hidden input for native form posts; tying the button size to the textarea `size` tier; any state in `PromptInput`.
- **Never:** attachments, drag-and-drop, paste handling, a command menu, a provider or context, a JS auto-grow, inline styles, or an `ai` SDK import.

## Success criteria

- Every acceptance criterion above holds.
- `pnpm test:run packages/ai` passes, with the existing conversation and markdown tests unchanged.
- `pnpm run build --filter=@uiid/ai`, `pnpm run lint`, `pnpm run format:check` and `pnpm size` pass.
- Storybook has `AI/PromptInput` stories backed by the README, covering the default, a header, tools, each status, controlled, disabled, and a composition with `Conversation`.

## Follow-ups, not in this module

- Publishing `@uiid/ai`: remove `"private": true`, add the umbrella dependency and re-export, and the `globals.css` import. The POC's final step, its own PR.
- A `submit` override or `SubmitProps` passthrough, if a consumer needs a colored or relabeled send button. Nothing needs it yet.
- `name="message"` plus a native-post path, if a non-React form ever hosts the composer.
- Attachments, as a separate module with its own spec, extending `PromptInputMessage`.

## Resolved decisions

1. **Auto-grow is `field-sizing: content` with a `12rem` cap.** It is now in every engine, the fallback is a fixed-height textarea that scrolls, and it costs two declarations against a hidden-mirror or `scrollHeight` approach's measuring effect, resize listener and layout thrash. Deferred here from `forms-input-group`.
2. **Enter submits, Shift+Enter inserts a newline.** The convention of every chat composer. IME compositions and a generating status are the two cases Enter does nothing. Deferred here from `forms-input-group`.
3. **`error` shows an X icon on the submit button.** Upstream's mapping, kept: the icon marks the state, and the button still submits so a retry is one press. `data-status="error"` on the root is the styling hook. This is the "marked, not disabled" branch of the ticket's acceptance criterion.
4. **No press-to-focus.** Clicking empty space in the header or footer row does nothing, the same as Textarea decided in `forms-input-group`. Adding it meant a `mousedown` handler, a selector of interactive elements to exclude, and a Safari caveat, for a click that the textarea one line up already handles.
5. **Submit is not disabled on empty text.** Pressing Send with nothing typed does nothing, exactly like Enter. Disabling it meant mirroring the draft into state and branching on controlled versus uncontrolled; without it, PromptInput has no state at all.
6. **Uncontrolled text clears synchronously after `onSubmit`.** Upstream waits for a returned promise; with `useChat` the message is already in the transcript by then, and a controlled `value` covers anyone who needs to keep the draft.
7. **One component plus one button, not eight parts.** Textarea's slots are props, so header and footer are props too. `PromptInputButton` was a `Button` with three defaults and a `type="button"` that Base UI's `Button` already applies, so tools are plain `Button`s.
8. **A plain `<form>`, not `Form`.** Base UI's `Form` is a validation runner; the composer has nothing to validate and needs only `requestSubmit()` and `type="submit"`.
9. **`ArrowUpIcon` for send, not upstream's `CornerDownLeftIcon`.** It is what the Textarea `BeforeAfterSlots` example already shows, and the arrow reads as "send" without knowing the keyboard shortcut.
10. **Button sizes are fixed at `xsmall`**, not derived from the textarea `size`. One default, overridable per button. Deriving them is an ask-first item if a large composer looks wrong.

## Open questions

None. The Storybook pass found the tier's three-row `min-height` left an 80px blank composer, which is why the auto-grow rule also sets `min-height: auto`.
