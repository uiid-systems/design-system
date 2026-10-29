# Markdown

> Renders a markdown string as plain HTML elements inside [`Prose`](../../../typography/src/prose/README.md), and keeps rendering cleanly while that string is still arriving. It is the renderer behind message responses, reasoning and tool output. Parsing is [`markdown-to-jsx`](https://github.com/quantizor/markdown-to-jsx); styling is all `Prose`, so it ships no CSS of its own.

Use Markdown when you want to:

- Show a model's response as it streams, without a half-typed `**` or `[link](` flashing on screen
- Get `Prose`'s typography scale and rhythm for headings, lists, code and quotes without wrapping anything yourself
- Render markdown you did not write safely: inline event handlers and `javascript:` URLs never reach the DOM

Reach for `Prose` directly when you already have HTML or JSX.

## Usage

```tsx
import { Markdown } from "@uiid/ai";

<Markdown streaming={status === "streaming"}>{message.text}</Markdown>;
```

## Props

All [`Prose`](../../../typography/src/prose/README.md) props, plus:

| Prop        | Type      | Default | Description                                                                 |
| ----------- | --------- | ------- | --------------------------------------------------------------------------- |
| `children`  | `string`  | —       | Markdown source. It may be cut off anywhere while it streams                |
| `streaming` | `boolean` | `false` | Hold back unfinished syntax until its closing delimiter arrives (see below) |

## Streaming

With `streaming`, syntax whose closer has not arrived yet is held back rather than shown raw:

| Tail of the text                      | Rendered as                                 |
| ------------------------------------- | ------------------------------------------- |
| `**bold wor`, `*ital`, `~~gone`       | Plain text, styled once the closer lands    |
| `` `pnpm bui ``                       | Nothing until the closing backtick lands    |
| `[the docs](https://exa`              | `the docs`, linked once `)` lands           |
| A table header before its divider row | Nothing until the table has a data row      |
| An open code fence                    | A code block that grows as the code arrives |
| A partial list item, heading or quote | The element, with the text so far           |

Nothing the reader has already seen disappears, because held-back syntax was never shown. The one visible cost is that a code span's text appears all at once on its closing backtick rather than character by character.

Turn `streaming` off once the message is complete. On finished text the same option would hide everything after a stray backtick or `[` the model never closed, and finished text should render character for character. Set it from the status you already have: `status === "streaming"` for a chat message, or the in-progress flag of a reasoning step or tool call.

## Security

Markdown from a model is untrusted input. `markdown-to-jsx` sanitizes on every render, independent of any option: `on*` attributes are dropped, `javascript:` and `vbscript:` URLs are removed from `href`, `src` and the other URL attributes, and `script`, `iframe`, `style` and similar tags are escaped as text. Nothing is injected with `dangerouslySetInnerHTML`.

## Notes

- Block elements render as direct children of the `Prose` root, with no wrapper in between, so `Prose`'s sibling spacing applies. A one-line string renders as a paragraph.
- Styling comes from `Prose`. It currently has no rules for tables, `del` or images, which render with browser defaults.
- Headings get an `id` from their text. A transcript with many messages may repeat ids.
- The component has no state and no hooks, so it renders on the server. During a stream it recompiles on every render; memoize at the message level if that shows up in a profile.
