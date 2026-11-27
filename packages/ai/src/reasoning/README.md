# Reasoning

> The collapsible "Thinking…" block above a model's reply. While the reasoning streams, the label shimmers and the panel is open so the reader can watch; when it finishes, the label says how long it took, the panel closes on its own a moment later, and the text stays behind the trigger as rendered markdown. It is one component on the [`Collapsible`](../../../interactive/src/collapsible/README.md) parts, with a [`Shimmer`](../../../typography/src/shimmer/README.md) label and [`Markdown`](../../../markdown/src/markdown/README.md) inside.

Use Reasoning when you want to:

- Show a model's chain of thought as it arrives, without it crowding the reply once the answer is there
- Keep the finished reasoning one click away, with the time it took in the label
- Drive it from the AI SDK's `reasoning` part and the chat's `status`, with no state of your own

## Usage

```tsx
import { Reasoning } from "@uiid/ai";

const { messages, status } = useChat();

{
  message.parts.map((part, index) =>
    part.type === "reasoning" ? (
      <Reasoning
        key={index}
        streaming={status === "streaming" && part.state === "streaming"}
      >
        {part.text}
      </Reasoning>
    ) : null,
  );
}
```

## Props

All `Collapsible` root props, which are Base UI's `open`, `defaultOpen`, `onOpenChange` and `disabled` plus the [`Stack`](../../../layout/src/stack/README.md) layout props, and:

| Prop        | Type                                | Default | Description                                                                |
| ----------- | ----------------------------------- | ------- | -------------------------------------------------------------------------- |
| `children`  | `string`                            | —       | The reasoning text, as markdown. It may be cut off while it streams        |
| `streaming` | `boolean`                           | `false` | Whether the text is still arriving. Shimmers the label and opens the panel |
| `duration`  | `number`                            | —       | How long the model thought, in whole seconds. Overrides the measured time  |
| `label`     | `ReactNode \| (state) => ReactNode` | English | The trigger's text. A function gets `{ streaming, duration }`              |
| `overrides` | `MarkdownOverrides`                 | —       | Components for links, images and code blocks, merged over the code default |

Defaults: `gap={2}` and `ax="start"`, so the trigger hugs its label; the panel takes `w="full"` so the text spans the block. Renders `data-slot="reasoning"` on the root, with `data-streaming` while `streaming`, `data-slot="reasoning-trigger"` on the trigger and `data-slot="reasoning-panel"` on the panel.

## Behavior

**Label.** While `streaming` the trigger reads "Thinking…" in a `Shimmer`. Once finished it reads "Thought for N seconds", where N is `duration` when passed, or else the seconds measured between `streaming` turning on and off. With no duration from either source it reads "Reasoning", not "Thought for a few seconds", so a transcript loaded from storage never claims a time nobody measured.

Pass `label` to replace the English, as a string or as a function of `{ streaming, duration }`, where `duration` is the prop or else the measured seconds. A string label shimmers while streaming, like the default; any other node renders as itself, since `Shimmer` sizes its sweep from a string.

**Open state.** An uncontrolled block opens when `streaming` turns on, whether it mounts that way or changes later, and closes one second after it turns off. Pass `defaultOpen={false}` to keep it closed while it streams. A block that never streamed never auto-closes, so a finished transcript rendered with `defaultOpen` stays open. Calling `details.cancel()` in `onOpenChange` keeps an uncontrolled block where it is, as it would on a bare Base UI `Collapsible`.

**Controlled.** With `open` the block does none of this. It stays where the prop says, and `onOpenChange` fires only when the trigger is pressed. A controlled caller owns the timing, which is also why Base UI's event details are only ever real ones.

## Accessibility

- The trigger is a `Group` that Base UI gives `role="button"`, `tabIndex`, `aria-expanded` and the Enter and Space keys.
- The shimmer stops under `prefers-reduced-motion` and the label stays plain text.
- The chevron turns without animating under `prefers-reduced-motion`.
- The panel unmounts when closed, so a closed block adds nothing to the reading order.

## Notes

- The trigger is a muted row that lifts to the foreground color on hover. It is not a `Button`, which would bring a surface and padding to turn off.
- `streaming` is forwarded to `Markdown`, so half-typed syntax is held back while the text arrives and shown as written once it is done.
- A fenced block renders as a `CodeBlock` with only a copy button, as in `MessageResponse`. Pass `overrides={{ codeBlock: MyBlock }}` to replace it or `overrides={{ codeBlock: undefined }}` for a plain block; see [Message's code blocks](../message/README.md#code-blocks).
- The measured duration is wall-clock time in the browser between the two renders, rounded up. Pass `duration` when the server knows better.
