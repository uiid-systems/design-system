# Spec: `typography-shimmer`

**Module:** `typography-shimmer` (see [capability map](./capability-map.md))
**Package:** `@uiid/typography`
**Status:** Approved
**Upstream:** `ai-elements/packages/elements/src/shimmer.tsx` (77 lines, depends on `motion`)

## Objective

`Shimmer` sweeps a soft highlight across a line of text in a loop. AI interfaces use it for pending states like "Thinking…". `Reasoning` consumes it.

It lives next to `Reveal`, which is the same kind of thing: a `Text` with a CSS-only effect. Upstream needs `motion` because it animates `backgroundPosition` from JavaScript. Here it is one keyframe.

**Acceptance criteria:**

- `<Shimmer>Thinking…</Shimmer>` renders the text with a highlight moving left to right in a loop.
- Every `Text` prop passes through: `size`, `weight`, `family`, `color`, `emphasis`, spacing, and `render`.
- The base color comes from whatever `Text` resolves (`color` / `emphasis`), so a palette hue shimmers in that hue. Shimmer adds no color props.
- With `prefers-reduced-motion: reduce`, the text renders statically and legibly, with no sweep.
- It renders on the server: no `"use client"`, no hooks, no `motion`.
- It works with zero new tokens and zero new dependencies.

## API

```ts
import type { TextProps } from "../text/text.types";

export type ShimmerProps = Omit<TextProps, "children"> & {
  /** Text to shimmer — string only, since its length sizes the highlight */
  children: string;
  /** Duration of one sweep, in ms */
  duration?: number;
  /** Highlight width per character, in px */
  spread?: number;
};
```

Defaults go in `shimmer.constants.ts`. Upstream's are `duration` 2s and `spread` 2, so here `SHIMMER_DEFAULT_DURATION = 2000` and `SHIMMER_DEFAULT_SPREAD = 2`. Milliseconds match `Reveal`.

Upstream's polymorphic `as` prop is dropped in favor of `Text`'s `render`, which is the uiid convention.

## Implementation notes

It mirrors `reveal.tsx`: render `Text` with `data-slot="shimmer"`, and pass the animation parameters as custom properties on the root.

```tsx
<Text
  data-slot="shimmer"
  className={cx(styles["shimmer"], className)}
  style={
    {
      "--shimmer-duration": `${duration}ms`,
      "--shimmer-spread": `${children.length * spread}px`,
      ...style,
    } as React.CSSProperties
  }
  {...props}
>
  {children}
</Text>
```

Setting animation parameters through `style` follows `Reveal`'s existing precedent. It sets no layout, spacing, sizing or text styling, so it does not run into the inline-style ban.

**CSS (`shimmer.module.css`)**, with the keyframe kept in the module the way `reveal.module.css` keeps its own:

- Two background layers. The top layer is a highlight band, `linear-gradient(90deg, transparent calc(50% - var(--shimmer-spread)), var(--shade-background), transparent calc(50% + var(--shimmer-spread)))`. The bottom layer is solid `currentColor`.
- `background-clip: text`, sized `250% 100%, auto`, with `no-repeat` on the band.
- **Hide the glyphs with `-webkit-text-fill-color: transparent`, not `color: transparent`.** That way `color` keeps holding `Text`'s resolved hue, and `currentColor` in the bottom layer picks it up. This is how a palette `color` or `emphasis` carries through.
- The keyframe animates `background-position` from `100% center` to `0% center`, `linear`, `infinite`, over `var(--shimmer-duration)`.
- Under reduced motion: `animation: none`, with the band parked off-text so only the `currentColor` layer shows.

The only token consumed is `--shade-background`, which already exists.

## Files

```
packages/typography/src/shimmer/
  shimmer.tsx
  shimmer.types.ts
  shimmer.constants.ts
  shimmer.module.css
  shimmer.test.tsx
  shimmer.examples.tsx
  README.md
packages/typography/src/index.ts             (export shimmer + types)
apps/storybook/stories/typography/shimmer.stories.tsx
apps/storybook/stories/typography/shimmer.mdx
```

## Commands

```
pnpm test:run packages/typography
pnpm run build --filter=@uiid/typography
pnpm run lint && pnpm run format:check
pnpm size
pnpm --filter @uiid/storybook dev
```

## Testing strategy

Vitest with happy-dom, in the style of `reveal.test.tsx`:

- Renders the full text content and `data-slot="shimmer"`
- `--shimmer-duration` and `--shimmer-spread` on the root reflect the props and the defaults
- `--shimmer-spread` scales with `children.length`
- A caller's `style` merges rather than being replaced
- `Text` props pass through and show up as their `data-ui-*` attributes (attributes, not computed style)
- `render={<p />}` changes the element

Checked by hand in Storybook: the sweep in light and dark, a palette `color`, and reduced motion. happy-dom can't render `background-clip: text`.

## Boundaries

- **Always:** reuse `Text`, follow `reveal/` file for file, and keep it server-renderable.
- **Ask first:** any new token, or moving the keyframe into `@uiid/tokens/animations.css`.
- **Never:** add `motion`, add color props, or use `color-mix`.

## Success criteria

- Every acceptance criterion above holds.
- `pnpm test:run packages/typography` passes.
- `pnpm size` shows `@uiid/typography` within its existing limit.
- Exported from `@uiid/typography`, and so from `@uiid/design-system`.
- A Storybook story with a README-backed MDX page exists.

## Open questions

1. Does `--shade-background` read well as the highlight on palette-colored text in both themes, or should the band use a hue's tint token? This gets checked in Storybook. If it doesn't read well, I'll come back to you rather than add a token.
