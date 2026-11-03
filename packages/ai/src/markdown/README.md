# Markdown

> Renders a markdown string as plain HTML elements inside [`Prose`](../../../typography/src/prose/README.md), and keeps rendering cleanly while that string is still arriving. It is the renderer behind message responses, reasoning and tool output. Parsing is [`markdown-to-jsx`](https://github.com/quantizor/markdown-to-jsx); styling is all `Prose`, so it ships no CSS of its own.

Use Markdown when you want to:

- Show a model's response as it streams, without a half-typed `**` or `[link](` flashing on screen
- Get `Prose`'s typography scale and rhythm for headings, lists, code and quotes without wrapping anything yourself
- Render markdown you did not write: raw HTML in the source shows as text, and a `javascript:` link loses its href

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
| `reveal`    | `boolean` | `false` | While `streaming`, fade each word in as it arrives (see below)              |

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

### Word reveal

Add `reveal` and each word fades and un-blurs in as it arrives, with the same motion as [`Reveal`](../../../typography/src/reveal/README.md):

```tsx
<Markdown streaming={status === "streaming"} reveal>
  {message.text}
</Markdown>
```

- The unfinished word at the end of the text is held back until it is complete, so a word split across two chunks reveals whole.
- Words appear as fast as they arrive, with no stagger.
- A word animates once. When its closing `**` or `)` lands and the word moves into a `<strong>` or link, it does not fade in again, and one that was still fading carries on from where it was.
- Inline code reveals as one piece. Code blocks are not animated.
- Words animate only while `streaming` is on. When it turns off, the held-back last word appears and fades in like the rest. Once the last fade has finished, the per-word spans are dropped and the text renders as it would without `reveal`.
- `reveal` makes `Markdown` a client component. Without it, `Markdown` has no hooks and renders in a server component.
- Text with no spaces between words, like Chinese or Japanese, or a long URL, reveals as one piece.

## Security

Markdown from a model is untrusted input, so raw HTML parsing is off: any tag in the source renders as literal text, which means a `<meta>` refresh, a `<form>`, a `<base>`, a stylesheet `<link>` or an `onerror` handler never reaches the DOM. Markdown links still go through `markdown-to-jsx`'s URL sanitizer, which drops `javascript:` and `vbscript:` hrefs. Nothing is injected with `dangerouslySetInnerHTML`. The trade is that an occasional `<br>` or `<sub>` a model writes shows as text rather than rendering.

## Notes

- Block elements render as direct children of the `Prose` root, with no wrapper in between, so `Prose`'s sibling spacing applies. A one-line string renders as a paragraph.
- Styling comes from `Prose`. It currently has no rules for tables, `del` or images, which render with browser defaults.
- Headings get an `id` from their text. A transcript with many messages may repeat ids.
- Without `reveal` it has no hooks, so it renders in a server component. With `reveal` it renders a client component that records when each word first appeared. It is wrapped in `memo`, so a finished message keeps its compiled output while the transcript around it re-renders and only the message whose text is changing recompiles. Pass a stable `render` element or none, or the memo never hits.
