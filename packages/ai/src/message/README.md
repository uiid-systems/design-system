# Message

> One turn of a chat. A user turn sits at the end of the column in a filled bubble; an assistant turn sits at the start as plain prose. `MessageContent` holds the body and `MessageResponse` renders a streaming markdown reply through [`Markdown`](../../../markdown/src/markdown/README.md). All three are a [`Stack`](../../../layout/src/stack/README.md) or `Markdown` with defaults and a `data-slot`.

Use Message when you want to:

- Lay out a transcript where the author is obvious from alignment and surface alone, with no avatars or labels
- Render a model's reply as markdown while it streams, without the half-typed syntax flashing and without recompiling every finished message on every token
- Put copy, retry and feedback buttons under a reply, lined up with it

Reach for `Markdown` on its own when there is no transcript, and for [`Conversation`](../conversation/README.md) for the scroll region the turns sit in.

## Usage

```tsx
import { Message, MessageContent, MessageResponse } from "@uiid/ai";

const { messages, status } = useChat();

{
  messages.map((message) => (
    <Message key={message.id} from={message.role}>
      <MessageContent>
        <MessageResponse
          streaming={status === "streaming" && message === messages.at(-1)}
        >
          {message.text}
        </MessageResponse>
      </MessageContent>
    </Message>
  ));
}
```

## Parts

### Message

All `Stack` props, plus:

| Prop   | Type                                | Default | Description                                         |
| ------ | ----------------------------------- | ------- | --------------------------------------------------- |
| `from` | `"user" \| "assistant" \| "system"` | —       | Who sent the turn. Drives alignment and the surface |

Defaults: `gap={2}`, `fullwidth`, and for a user turn `ax="end"` and `ml="auto"`, otherwise `ax="start"`, so what follows the content lines up with it. Since alignment and the bubble only show the author visually, the root is `role="group"` with `aria-label` set to `` `Message from ${from}` ``; pass either to replace it, such as a product name for the assistant. Renders `data-slot="message"` and `data-from` set to `from`, for styling either kind of turn.

### MessageContent

The body. All `Stack` props, with `gap={2}` as the default. It never widens the turn, and a long unbroken token in its text, such as a URL, breaks onto the next line instead of overflowing. On a user turn it is the bubble: a `--palette-tint-hover` fill (the neutral palette's when no ancestor sets one), so it stays visible on a `Card`, the palette's `--palette-on-tint` text color, which a `MessageResponse` inside takes too, the global border radius, and `0.75rem` by `1rem` of padding. Inline and block code inside the bubble sit one shade step further out so they don't vanish into the fill. On any other turn it has no surface, and a code block in it takes the accent shade, so it shows on a white page. Renders `data-slot="message-content"`.

### MessageResponse

A markdown reply. All [`Markdown`](../../../markdown/src/markdown/README.md) props, including `streaming`. Renders `data-slot="message-response"`.

## Actions

An actions row is not a part. Put a `Group` of plain `Button`s after `MessageContent`, inside the same `Message`, and it lines up with the content because the turn aligns its children. Ghost, square and xsmall is the register, and a string `tooltip` also names each icon-only button:

```tsx
import { Button } from "@uiid/buttons";
import { CopyIcon } from "@uiid/icons/copy";
import { Group } from "@uiid/layout";

<Message from="assistant">
  <MessageContent>
    <MessageResponse>{text}</MessageResponse>
  </MessageContent>
  <Group gap={1}>
    <Button
      variant="ghost"
      shape="square"
      size="xsmall"
      tooltip="Copy"
      onClick={() => copy(text)}
    >
      <CopyIcon />
    </Button>
  </Group>
</Message>;
```

A toolbar with metadata on the other side is the same `Group` with `ax="space-between"` and `fullwidth`.

## Notes

- `from="system"` renders like `assistant`. A chat column needs two alignments, not three.
- The bubble is a CSS rule keyed on the root's `data-from`; `MessageContent` does not take `from` and there is no context between the parts.
- A turn is capped at 95% of the column, so a bubble never touches the far edge. Any `maxw`, a pixel width or `"full"`, replaces the cap.
- `MessageResponse` is `Markdown`, which is memoized on all of its props. Pass a stable `render` element or none, or the memo never hits.
- No part holds state or uses a hook, so all three render on the server.
