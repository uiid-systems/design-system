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

For streamed markdown, or to pace streamed text so it shows a whole word at a time instead of in the bursts it arrives in, use [`Markdown`](../../../markdown/src/markdown/README.md) with `reveal`.

To replay the animation, remount with a `key`:

```tsx
<Reveal key={run}>{text}</Reveal>
```

## Accessibility

- Respects `prefers-reduced-motion` — words render immediately with no animation.
- Content stays real text nodes in plain inline spans: selection, find-in-page, and screen readers see ordinary text.

## Notes

- `stagger` and `duration` apply to words as they mount. Changing either later only affects words added after the change; words already on screen keep their timing.
- Reveal wraps with `text-wrap: wrap`, not `Text`'s `pretty`. `pretty` and `balance` re-break lines as words arrive and move words already shown, so Reveal has no `balance` prop. It always wraps, so it has no `nowrap` or `truncate` prop either.
- `children` must be a string. To reveal formatted text, render it as markdown with [`Markdown`](../../../markdown/src/markdown/README.md)'s `reveal`. For animating between two different strings (morphing), or animated numbers, see the `Typography/Prototypes` stories in Storybook.
