# Spec: `forms-input-group`

**Module:** `forms-input-group` (see [capability map](./capability-map.md)). The id was set before the scope settled on Textarea slots. It stays as is, because module ids are never renamed.
**Package:** `@uiid/forms`
**Status:** Approved

## Objective

`InputWrapper` gets an `orientation` prop. `Textarea` uses the vertical orientation to get the same `before`/`after` slots as `Input`, stacked above and below the text instead of beside it. `PromptInput` needs a single field surface holding a header row, the text, and a footer row of tools and a submit button. One wrapper serves both controls, so there's one surface implementation and not two that could drift apart.

**Acceptance criteria:**

- `<Textarea before={…} after={…} />` renders one field surface: the `before` row, then the textarea, then the `after` row.
- With neither slot set, Textarea renders exactly what it does today: no wrapper and no class changes. Every existing `textarea.test.tsx` case passes unchanged.
- `InputWrapper` accepts `orientation?: "horizontal" | "vertical"`, defaulting to `"horizontal"`. Input renders exactly what it does today, and every existing `input.test.tsx` case passes unchanged.
- With a slot set, the wrapper carries `fullwidth`, `variant` and `color`. The textarea keeps its `size` and `resize` and drops its own surface.
- Focus in the textarea rings the whole surface. Disabled and invalid states come from the textarea and show on the wrapper.
- A `<Button>` in a slot is clickable. Plain text and icons in a slot let clicks pass through, the same as Input's slots.
- `ref`, `className`, `rows`, `resize`, `name`, `onValueChange` and native textarea props still land on the `<textarea>`.

## API

```ts
// input.types.ts — additive
export type InputWrapperProps = {
  before?: React.ReactNode;
  after?: React.ReactNode;
  /** Slot placement: beside the control, or above and below it */
  orientation?: "horizontal" | "vertical";
  className?: string;
  children: React.ReactNode;
  color?: InputColor;
} & InputVariants;

// textarea.types.ts — additive
export type TextareaProps = /* existing */ {
  /** Rendered above the text, inside the field surface */
  before?: React.ReactNode;
  /** Rendered below the text, inside the field surface */
  after?: React.ReactNode;
};
```

`orientation` is typed the same way it already is on `RadioGroup`, `CheckboxGroup` and `Avatar`. The default is set in `input.constants.ts` as `INPUT_DEFAULT_ORIENTATION`.

## Implementation notes

**InputWrapper.** The `horizontal` path is unchanged. Both orientations stamp `data-orientation`. `vertical` renders `Stack ax="stretch"` where `horizontal` renders `Group ay="center"`. The rest is identical in both: the classes, `data-slot="input-wrapper"`, and the `input-before`/`input-after` slot spans.

**Textarea:**

```tsx
const hasSlots = Boolean(before || after);

<Field … {...FieldProps}>
  <InputWrapper orientation="vertical" before={before} after={after} size={size} fullwidth={fullwidth} variant={variant} color={color}>
    <FieldControl
      data-slot="textarea"
      className={cx(
        styles["textarea"],
        hasSlots
          ? cx(styles["textarea-inner"], textareaVariants({ size, resize }))
          : cx(textareaVariants({ size, resize, fullwidth, variant }), paletteClassName(color, styles["color"])),
        className,
      )}
      render={<textarea ref={ref} rows={rows} {...props} />}
      …
    />
  </InputWrapper>
</Field>
```

The inner textarea keeps its own size class. Without slots on either side, it still wants the tier's `font-size`, `padding-inline` and `min-height`. So no per-tier rules need writing, unlike Input's `.input-inner`, which has to restate `font-size` for each tier.

**CSS.** The wrapper's surface, the border restatement that undoes `Box`'s reset, disabled-within, and `padding: 0` all come from the existing `.input-wrapper` and `.input-edge` rules. The only new rules are these:

| File                  | Rule                                                                                                   | Why                                                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `input.module.css`    | `.input-wrapper[data-orientation="vertical"]`: `height: auto`                                          | The size tier pins a control `height`. A stacked surface grows with its content instead.                                            |
| `input.module.css`    | `[data-orientation="vertical"] > .input-slot`: `padding-block: var(--forms-padding-y)`                 | Stacked slots need padding above and below. The side padding and icon size already come from `composes-field-slot`.                 |
| `textarea.module.css` | `.textarea-inner`: no border, transparent background (on hover too), no outline (on focus-visible too) | The wrapper paints the surface once. These rules mirror `.input-wrapper > .input-inner`.                                            |
| `textarea.module.css` | `.textarea-inner` next to a slot: `padding-block-start: 0` / `padding-block-end: 0`                    | This keeps the gap between the text and a slot from doubling. It is the block-axis version of how `.input-slot` trims side padding. |

No new tokens are added.

**Known and unchanged.** A disabled control dims twice with slots present: the control's `composes-disabled` and the wrapper's `composes-disabled-within` each apply `--globals-disabled-opacity`. Input already does this today, so Textarea inherits it. Fixing it means changing a shared composition, which is out of scope here.

**Out of scope:**

- Auto-growing the textarea (upstream uses `field-sizing: content`)
- Submit-on-Enter

Both belong to PromptInput.

## Files

```
packages/forms/src/input/
  input.types.ts                        (orientation)
  input.constants.ts                    (INPUT_DEFAULT_ORIENTATION)
  subcomponents/input-wrapper.tsx       (Stack/Group switch, data-orientation)
  input.module.css                      (two vertical rules)
  input.test.tsx                        (orientation cases)
packages/forms/src/textarea/
  textarea.tsx                          (slots, inner switch)
  textarea.types.ts                     (before/after)
  textarea.module.css                   (inner rules)
  textarea.test.tsx                     (slot cases)
  textarea.examples.tsx                 (BeforeAfterSlots)
  README.md                             (slots section)
packages/forms/src/input/README.md      (orientation on InputWrapper)
apps/storybook/stories/forms/textarea.stories.tsx   (BeforeAfterSlots story)
```

## Commands

```
pnpm test:run packages/forms
pnpm run build --filter=@uiid/forms
pnpm run lint && pnpm run format:check
pnpm size
pnpm --filter @uiid/storybook dev
```

## Testing strategy

Vitest with happy-dom. The slot cases in `input.test.tsx` (lines 103–227) are the template.

**InputWrapper:**

- It defaults to `data-orientation="horizontal"`, and its existing classes are unchanged.
- `orientation="vertical"` stamps `data-orientation="vertical"` and keeps the surface, the edge, the color classes and the slot `data-slot`s.

**Textarea:**

- With no slots, no `input-wrapper` renders. The textarea keeps its size, variant and color classes.
- With `before`, `after` or both, the wrapper is vertical and the parts appear in DOM order: `input-before`, `textarea`, `input-after`.
- The textarea gets `textarea-inner` plus its `size` and `resize` classes. It does not get the `variant`, `fullwidth` or `color` classes, which move to the wrapper.
- `ref`, `rows`, `name` and `onValueChange` still reach the `<textarea>`.
- A `<button>` in `after` receives a click and comes after the textarea in tab order.

**Checked by hand in Storybook**, since happy-dom does no layout:

- the focus ring wraps the whole surface
- the four sizes
- ghost and color, in light and dark
- the invalid state
- where the resize handle sits

## Boundaries

- **Always:** keep the horizontal path and the no-slot Textarea path unchanged; reuse the existing wrapper rules; keep the slot names `before`/`after`.
- **Ask first:** any new token, any change to `compositions.css`, and any change to InputWrapper beyond `orientation`.
- **Never:** add a standalone InputGroup or a `TextareaWrapper`, or use inline styles.

## Success criteria

- Every acceptance criterion above holds.
- `pnpm test:run packages/forms` passes, with every existing Input and Textarea test unchanged.
- `pnpm size` keeps `@uiid/forms` within its existing limit.
- A Storybook `BeforeAfterSlots` story exists for Textarea, backed by its README.

## Resolved decisions

1. **No click-through to focus.** Clicking empty space in a slot row does nothing, the same as Input. Upstream's InputGroup focuses the control instead. PromptInput can add that if it needs it.
2. **`resize` is honored as passed.** Slots don't change it. The handle sits at the textarea's corner, just above the `after` row.
