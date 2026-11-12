# Markdown

> Renders a markdown string as plain HTML elements inside [`Prose`](../../../typography/src/prose/README.md), and keeps rendering cleanly while that string is still arriving. It is the renderer behind `@uiid/ai`'s message responses, reasoning and tool output, and stands on its own for any markdown you need to show. Parsing is [`markdown-to-jsx`](https://github.com/quantizor/markdown-to-jsx); styling is all `Prose`, so it ships no CSS of its own.

Use Markdown when you want to:

- Show a model's response as it streams, without a half-typed `**` or `[link](` flashing on screen
- Get `Prose`'s typography scale and rhythm for headings, lists, code and quotes without wrapping anything yourself
- Render markdown you did not write: raw HTML in the source shows as text, and a `javascript:` link loses its href

Reach for `Prose` directly when you already have HTML or JSX.

## Limitations

Read these before you swap it in for another renderer:

- **Raw HTML always renders as text**, with no prop to turn that off. An occasional `<br>` or `<sub>` a model writes shows up literally. A line ending in two spaces still breaks, since that is markdown, not HTML.
- **Markdown is CommonMark plus GFM.** Pipe tables, `~~strikethrough~~`, task lists, bare-URL autolinks and footnotes parse; anything beyond that, such as math, grid tables or custom containers, renders as text.
- **Tables, strikethrough, task lists, footnotes and images are unstyled.** `Prose` has no rules for them yet, so they render with browser defaults.
- **Only links and images can be overridden** (`overrides.a`, `overrides.img`). Headings, code and every other element are `Prose`'s.
- **Ids repeat.** Each heading gets an `id` from its text, and each footnote one from its label (`[^1]` becomes `id="1"`), so a transcript of many messages can hold duplicates.
- **`streaming` must be off on finished text.** Left on, a stray backtick or `[` the model never closed hides everything after it.
- **A code span appears whole** on its closing backtick, and a table appears once its first data row arrives, rather than character by character.
- **`reveal` makes it a client component.** Plain `Markdown` has no hooks and renders in a server component.
- **The memo needs stable props.** A new `overrides` object or `render` element each render means `Markdown` recompiles every time. Define the object and its components once, outside render: a new component each render remounts every link and image.

## Usage

```tsx
import { Markdown } from "@uiid/markdown";

<Markdown streaming={status === "streaming"}>{message.text}</Markdown>;
```

## Props

All [`Prose`](../../../typography/src/prose/README.md) props, plus:

| Prop        | Type                | Default | Description                                                                 |
| ----------- | ------------------- | ------- | --------------------------------------------------------------------------- |
| `children`  | `string`            | —       | Markdown source. It may be cut off anywhere while it streams                |
| `streaming` | `boolean`           | `false` | Hold back unfinished syntax until its closing delimiter arrives (see below) |
| `reveal`    | `boolean`           | `false` | While `streaming`, fade each word in as it arrives (see below)              |
| `overrides` | `MarkdownOverrides` | —       | Your own components for links (`a`) and images (`img`) (see below)          |

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

Nothing the reader has already seen disappears, because held-back syntax was never shown.

Turn `streaming` off once the message is complete (see [Limitations](#limitations)). Set it from the status you already have: `status === "streaming"` for a chat message, or the in-progress flag of a reasoning step or tool call.

### Word reveal

Add `reveal` and each word fades and un-blurs in as it arrives, with the same motion as [`Reveal`](../../../typography/src/reveal/README.md):

```tsx
<Markdown streaming={status === "streaming"} reveal>
  {message.text}
</Markdown>
```

- Words are shown a whole word at a time at an even pace, not in the bursts they arrive in, about 250ms behind the stream. A burst speeds the pace up, so it never falls far behind. The unfinished word at the end waits until it is complete, so a word split across two chunks reveals whole.
- A word animates once. When its closing `**` or `)` lands and the word moves into a `<strong>` or link, it does not fade in again, and one that was still fading carries on from where it was.
- Inline code reveals as one piece. Code blocks are not animated.
- Words animate only while text is arriving. When `streaming` turns off, the words not shown yet go out at the same pace and fade in like the rest. Once the last fade has finished, the per-word spans are dropped and the text renders as it would without `reveal`.
- Text with no spaces between words, like Chinese or Japanese, or a long URL, reveals as one piece.

## Links and images

Markdown from a model is untrusted, so the app decides which links stay clickable and whether images load. Pass components for `a` and `img`; each gets the element's props, with dangerous schemes already dropped (see [Security](#security)). That is a blocklist, so before an override reuses a URL anywhere a browser navigates, such as an `href` built from an image's `src` or a `window.open` call, allowlist the scheme: check that `new URL(url, location.href).protocol` is `http:` or `https:`, plus `mailto:` for links. The `a` override renders every link, including autolinks, reference links and footnote links.

```tsx
import type { ComponentPropsWithoutRef } from "react";
import { Markdown, type MarkdownOverrides } from "@uiid/markdown";

const ExternalLink = (props: ComponentPropsWithoutRef<"a">) => (
  <a {...props} target="_blank" rel="noopener noreferrer" />
);

// The object and its components once, outside render, so links don't remount.
const overrides: MarkdownOverrides = { a: ExternalLink };

<Markdown overrides={overrides}>{message.text}</Markdown>;
```

Overrides work with `streaming` and `reveal`: words inside a link fade in as they would anywhere else.

## Security

Raw HTML parsing is always off: any tag in the source renders as literal text, so a `<meta>` refresh, a `<form>`, a `<base>`, a stylesheet `<link>` or an `onerror` handler never reaches the DOM. Links and images go through `markdown-to-jsx`'s URL sanitizer, which drops `javascript:`, `vbscript:` and non-image `data:` URLs, including entity-encoded and uppercase forms. `Markdown` also runs it on the URL with control characters and spaces removed, because browsers strip tabs and newlines before reading a scheme: `![x](java&#9;script:alert(1))` decodes to `java<tab>script:`, which the default check misses. A dropped URL arrives at your override as no `href` or `src` at all. The sanitizer cannot be replaced through `Markdown`. Nothing is injected with `dangerouslySetInnerHTML`.

This is a blocklist, not proof a URL is safe to reuse. An override that moves a URL somewhere a browser navigates should allowlist its scheme first, as above, and one that reads a URL from anywhere other than its props bypasses all of this.

## Notes

- Block elements render as direct children of the `Prose` root, with no wrapper in between, so `Prose`'s sibling spacing applies. A one-line string renders as a paragraph.
- `Markdown` is wrapped in `memo`, so a finished message keeps its compiled output while the transcript around it re-renders, and only the message whose text is changing recompiles. With `reveal` it renders a client component that records when each word first appeared.
