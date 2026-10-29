# PromptInput

> The composer at the bottom of a chat. A textarea that grows with its text, a send button that turns into stop while a reply is in flight, and room for a header row above the text and a row of tools below it. All of it sits inside one field surface, which is [`Textarea`](../../../forms/src/textarea/README.md)'s `before` and `after` slots.

Use PromptInput when you want to:

- Send on Enter and add a line on Shift+Enter, with IME compositions left alone
- Show stop instead of send while a request is `submitted` or `streaming`, driven by the same `ChatStatus` the AI SDK's `useChat` returns
- Put chips or a mode label above the text and tool buttons below it, inside the same edge, focus ring and tint as the text
- Let the textarea grow line by line to a cap, with no resize handle and no measuring script

Reach for `Textarea` with `before` and `after` when the surface is not a chat composer.

## Usage

```tsx
import { PromptInput } from "@uiid/ai";
import { Button } from "@uiid/buttons";
import { PaperclipIcon } from "@uiid/icons/paperclip";

const { sendMessage, status, stop } = useChat();

<PromptInput
  status={status}
  onSubmit={({ text }) => sendMessage({ text })}
  onStop={stop}
  tools={
    <Button variant="ghost" shape="square" size="xsmall" tooltip="Attach">
      <PaperclipIcon />
    </Button>
  }
/>;
```

Leave `value` unset and the composer clears itself after each send. Pass `value` and `onValueChange` to own the text, and clear it yourself when the send has gone through.

## Props

All [`Textarea`](../../../forms/src/textarea/README.md) props except `before`, `after` and `resize`, plus:

| Prop       | Type                                               | Default   | Description                                                                      |
| ---------- | -------------------------------------------------- | --------- | -------------------------------------------------------------------------------- |
| `onSubmit` | `(message: { text }, event: FormEvent) => void`    | —         | Called on Enter or Send, with the text and the already-prevented form event      |
| `status`   | `"ready" \| "submitted" \| "streaming" \| "error"` | `"ready"` | Where the request is. `submitted` and `streaming` turn the send button into stop |
| `onStop`   | `() => void`                                       | —         | Called when stop is pressed                                                      |
| `header`   | `ReactNode`                                        | —         | Row above the text, inside the surface                                           |
| `tools`    | `ReactNode`                                        | —         | Buttons at the start of the footer row, before the send button                   |

Defaults that differ from Textarea: `placeholder` is "Ask anything", the textarea is named "Message" unless you pass `label` or your own `aria-label`, `rows` is `1`, and `fullwidth` is on. `className` goes to the root `<form>`; `ref` goes to the `<textarea>`.

## Parts

### PromptInputSubmit

The send button, rendered by PromptInput and exported for a footer of your own. All [`Button`](../../../buttons/src/button/README.md) props, plus `status` and `onStop`. It is a small circle: an up arrow named "Send" for `ready`, an X for `error`, and a square named "Stop" for `submitted` and `streaming`, with `Button`'s spinner over it while `submitted`. For `ready` and `error` it is `type="submit"`; otherwise it is `type="button"` and calls `onStop`. `children` replaces the icon and `aria-label` replaces the name.

Tools are plain `Button`s. `variant="ghost" shape="square" size="xsmall"` with a string `tooltip` is the footer's register, and the tooltip also names an icon-only button. A `Button` inside the form is `type="button"` already, so a tool cannot submit by accident.

## Behavior

Enter sends when the text is not blank and the status is `ready` or `error`. Shift+Enter inserts a newline. Enter during an IME composition is left to the composition. Enter while `submitted` or `streaming` does nothing, and so does pressing Send on blank text; the button is not disabled for it.

After `onSubmit`, an uncontrolled textarea is emptied at once. The call is not awaited: with `useChat`, the message is already in the transcript, and a draft kept until a promise settled would be a second copy of it. A controlled `value` is left alone.

The textarea starts at one line and grows with its content through CSS `field-sizing: content`, up to `12rem`, then scrolls. Override `--prompt-input-max-height` on the root to change the cap. In a browser without `field-sizing`, the textarea keeps its `rows` height and scrolls, as Textarea does.

## Notes

- The root is a `<form>` with `data-slot="prompt-input"` and `data-status` set to the current status, for styling any state.
- The header and footer are `Group`s with `data-slot="prompt-input-header"`, `prompt-input-footer` and `prompt-input-tools`. The header renders only when `header` is set.
- Clicking empty space in a row does nothing, the same as Textarea's slots. Click the text to focus it.
- PromptInput holds no state. The text lives in the textarea or in your `value`; the status lives with your chat.
- Attachments, drag-and-drop and a command menu are out of scope. `onSubmit`'s message is an object so attachments can join it later without a breaking change.
