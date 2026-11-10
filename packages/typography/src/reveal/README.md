# Reveal

> Animated text reveal built on [`Text`](../text/README.md). Splits a string into words and fades each one in with a soft blur — the streaming-text pattern popularized by AI chat UIs. Zero dependencies: one CSS keyframe animating only `opacity` and `filter`, so wrapping, selection, and line height stay native.

Use Reveal when you want to:

- Fade a paragraph or heading in word-by-word on mount
- Render streamed text (LLM responses, live transcripts) where each arriving word animates once and settles
- Style the reveal with any `Text` prop except `balance`, `nowrap` and `truncate` — `size`, `weight`, `family`, `shade`, `color`, spacing, and `render` all pass through

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

Words are keyed by index, so when `children` grows (streamed chunks), already-mounted words never re-animate — only new words play the animation. The stagger counts from the first new word, so each streamed chunk staggers on its own and the default `stagger` works for streams too.

```tsx
<Reveal>{streamedText}</Reveal>
```

Streamed text arrives in bursts, several words in one chunk and then nothing for a while, and revealed as it arrives it looks choppy. `useStreamPace` evens it out. It shows the text a whole word at a time, spaced so that whatever has arrived but not been shown yet clears in about 250ms: a burst speeds it up, so it never falls far behind. The unfinished last word waits until it is complete, so a word split across two chunks reveals whole. A token with no letter or digit in it, like a dash or a list marker, goes out with the word after it.

```tsx
import { Reveal, useStreamPace } from "@uiid/typography";

const paced = useStreamPace(text, streaming);

<Reveal>{paced.text}</Reveal>;
```

It returns the `text` to show and its own `streaming`, which stays true after yours turns off until the last words have gone out. Text that gets shorter while streaming, like a regenerated message, starts over from nothing.

For markdown, use [`Markdown`](../../../markdown/src/markdown/README.md) with `reveal`, which does this for you.

To replay the animation, remount with a `key`:

```tsx
<Reveal key={run}>{text}</Reveal>
```

## useStreamReveal

The word reveal behind `Markdown`'s `reveal` prop, for renderers that rebuild their element tree as text streams in. A run of text that becomes bold, for example, is a new element wrapping words the reader has already seen. `Reveal` relies on React keeping each word's span, so it would fade those words in again. This hook identifies a word by its offset in the visible text and records when it first appeared, so a rebuilt word does not animate twice.

```tsx
const words = useStreamReveal({ streaming });
const pass = words.pass(); // a fresh pass on every render

<div style={words.style}>
  {pass.text("Hello ")}
  <strong>{pass.text("world")}</strong>
</div>;
```

| Option      | Type      | Default | Description                                                                        |
| ----------- | --------- | ------- | ---------------------------------------------------------------------------------- |
| `streaming` | `boolean` | —       | Whether text is still arriving. Words keep animating for `duration` after it stops |
| `duration`  | `number`  | `400`   | Duration of each word's fade/blur-in, in ms                                        |
| `blur`      | `number`  | `6`     | Blur radius each word starts from, in px                                           |

It returns:

- `active`: true while text is arriving and for one `duration` after it stops, so the last word and any still fading can finish. When it turns false every word is forgotten, so text streamed again into the same instance, like a regenerated message, animates from the start.
- `style`: the duration and blur custom properties to put on the root element. `undefined` while inactive.
- `pass()`: walks the visible text in document order. While inactive, each method hands its content back unchanged, so you can call them on every render without checking `active`. Check it only to skip the work, as `Markdown` does.
  - `text(text, key?)` renders one span per word.
  - `unit(children, length, key?)` reveals something that can't be split, like inline code, as one piece. `length` is how much visible text it holds.
  - `skip(length)` counts text that is shown without animating, like a code block, so the words after it keep their offsets.

Call the pass's methods for every piece of visible text, in reading order, on every render. If text the reader has already seen changes length partway through, every word after it gets a new offset and fades in again.

## Accessibility

- Respects `prefers-reduced-motion` — words render immediately with no animation.
- Content stays real text nodes in plain inline spans: selection, find-in-page, and screen readers see ordinary text.

## Notes

- `stagger` and `duration` apply to words as they mount. Changing either later only affects words added after the change; words already on screen keep their timing.
- Reveal wraps with `text-wrap: wrap`, not `Text`'s `pretty`. `pretty` and `balance` re-break lines as words arrive and move words already shown, so Reveal has no `balance` prop. It always wraps, so it has no `nowrap` or `truncate` prop either.
- `children` must be a string. To reveal formatted text, use `useStreamReveal`. For animating between two different strings (morphing), or animated numbers, see the `Typography/Prototypes` stories in Storybook.
