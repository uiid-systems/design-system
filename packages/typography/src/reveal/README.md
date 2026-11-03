# Reveal

> Animated text reveal built on [`Text`](../text/README.md). Splits a string into words and fades each one in with a soft blur — the streaming-text pattern popularized by AI chat UIs. Zero dependencies: one CSS keyframe animating only `opacity` and `filter`, so wrapping, selection, and line height stay native.

Use Reveal when you want to:

- Fade a paragraph or heading in word-by-word on mount
- Render streamed text (LLM responses, live transcripts) where each arriving word animates once and settles
- Style the reveal with any `Text` prop — `size`, `weight`, `family`, `shade`, `color`, spacing, and `render` all pass through

## Usage

```tsx
import { Reveal } from "@uiid/typography";

<Reveal render={<p />} size={1}>
  Words fade and un-blur in sequence.
</Reveal>;
```

## Props

All [`Text`](../text/README.md) props, plus:

| Prop       | Type     | Default | Description                                 |
| ---------- | -------- | ------- | ------------------------------------------- |
| `children` | `string` | —       | Text to reveal — string only, split by word |
| `stagger`  | `number` | `30`    | Delay between each word's start, in ms      |
| `duration` | `number` | `400`   | Duration of each word's fade/blur-in, in ms |
| `blur`     | `number` | `6`     | Blur radius each word starts from, in px    |

## Streaming

Words are keyed by index, so when `children` grows (streamed chunks), already-mounted words never re-animate — only new words play the animation. Set `stagger={0}` for streaming: the stagger delay is relative to each word's own mount, so a late-arriving word would otherwise wait `index × stagger` before appearing.

```tsx
<Reveal stagger={0}>{streamedText}</Reveal>
```

A word split across two chunks only animates its first piece, because the rest arrives in a span that has already played. Pass the text through `holdBackPartialWord` while it streams to keep the unfinished last word back until it is complete:

```tsx
import { Reveal, holdBackPartialWord } from "@uiid/typography";

<Reveal stagger={0}>{streaming ? holdBackPartialWord(text) : text}</Reveal>;
```

For markdown, use [`Markdown`](../../../ai/src/markdown/README.md) with `reveal`, which does this for you.

To replay the animation, remount with a `key`:

```tsx
<Reveal key={run}>{text}</Reveal>
```

## useStreamReveal

The word reveal behind `Markdown`'s `reveal` prop, for renderers that rebuild their element tree as text streams in. A run of text that becomes bold, for example, is a new element wrapping words the reader has already seen. `Reveal` relies on React keeping each word's span, so it would fade those words in again. This hook identifies a word by its offset in the visible text and records when it first appeared, so a rebuilt word does not animate twice.

```tsx
const words = useStreamReveal({ streaming });
const pass = words.active ? words.pass() : undefined; // a fresh pass on every render

<div style={words.active ? words.style : undefined}>
  {pass ? pass.text("Hello ") : "Hello "}
  <strong>{pass ? pass.text("world") : "world"}</strong>
</div>;
```

| Option      | Type      | Default | Description                                                                        |
| ----------- | --------- | ------- | ---------------------------------------------------------------------------------- |
| `streaming` | `boolean` | —       | Whether text is still arriving. Words keep animating for `duration` after it stops |
| `duration`  | `number`  | `400`   | Duration of each word's fade/blur-in, in ms                                        |
| `blur`      | `number`  | `6`     | Blur radius each word starts from, in px                                           |

It returns:

- `active`: true while text is arriving and for one `duration` after it stops, so the last word and any still fading can finish. Render the spans only while it is true. When it turns false every word is forgotten, so text streamed again into the same instance, like a regenerated message, animates from the start.
- `style`: the duration and blur custom properties to put on the root element.
- `pass()`: walks the visible text in document order.
  - `text(text, key?)` renders one span per word.
  - `unit(children, length, key?)` reveals something that can't be split, like inline code, as one piece. `length` is how much visible text it holds.
  - `skip(length)` counts text that is shown without animating, like a code block, so the words after it keep their offsets.

Call the pass's methods for every piece of visible text, in reading order, on every render. If text the reader has already seen changes length partway through, every word after it gets a new offset and fades in again.

## Accessibility

- Respects `prefers-reduced-motion` — words render immediately with no animation.
- Content stays real text nodes in plain inline spans: selection, find-in-page, and screen readers see ordinary text.

## Notes

- `children` must be a string. To reveal formatted text, use `useStreamReveal`. For animating between two different strings (morphing), or animated numbers, see the `Typography/Prototypes` stories in Storybook.
