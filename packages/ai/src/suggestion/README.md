# Suggestion

> A canned prompt the reader can send with one press. It is a [`Button`](../../../buttons/src/button/README.md) with subtle, pill and small defaults and a `data-slot`, and nothing else.

Use Suggestion when you want to:

- Offer a few starting prompts under an empty conversation
- Offer follow-ups under the last reply

Reach for `Button` when the thing pressed is not a prompt to send.

## Usage

```tsx
import { Suggestion } from "@uiid/ai";
import { Group } from "@uiid/layout";

const { sendMessage } = useChat();

<Group gap={2} wrap>
  {suggestions.map((text) => (
    <Suggestion key={text} onClick={() => sendMessage({ text })}>
      {text}
    </Suggestion>
  ))}
</Group>;
```

The text is `children` and `onClick` is the native handler; close over the text in the `map`. Renders `data-slot="suggestion"` and `type="button"`, so a pill inside a form never submits it.

## Props

All `Button` props. The defaults are `variant="subtle"`, `shape="pill"` and `size="small"`; pass any of them to change the look, or `color` for a palette tint.

## Notes

- There is no `Suggestions` container. A `Group` with `wrap` lays the pills out, and `ax="center"` centers them under an empty state.
- Suggestion has no state and renders on the server.
