# Styling Guide

## No Inline Styles

**Never use `style={{}}` for layout, spacing, sizing, or text styling.** Resolution order:

1. **Component props** (always try first) — `gap`, `p`, `ax`, `evenly`, `fullwidth`, `size`, `shade`, etc.
2. **CSS Modules** — for visual styling that can't be expressed as props (colors, borders, animations)
3. **Inline styles** — avoid entirely. If you think you need one, check the component README for a prop that does the same thing.

If no prop exists for what you need, stop and ask the user. Do not fall back to inline styles.

| Instead of...                                 | Use...                                         |
| --------------------------------------------- | ---------------------------------------------- |
| `style={{ flex: 1 }}` on children             | `<Group evenly>`                               |
| `style={{ width: "100%"}}`                   | `fullwidth` or `ax="stretch"` on parent Stack  |
| `style={{ alignItems: "center" }}`            | `ay="center"` (Group) or `ax="center"` (Stack) |
| `style={{ gap: "16px" }}`                     | `gap={4}`                                      |
| `style={{ padding: "16px" }}`                 | `p={4}`                                        |
| `style={{ fontSize: "14px", color: "gray" }}` | `<Text size={0} shade="muted">`                |

## Layout Components (`@uiid/layout`)

| Component | Purpose                       |
| --------- | ----------------------------- |
| `Stack`   | Vertical flex layout (column) |
| `Group`   | Horizontal flex layout (row)  |
| `Box`     | Generic flex container        |

**Spacing Props** (available on all layout components):

| Prop                               | CSS Property              |
| ---------------------------------- | ------------------------- |
| `gap`                              | gap                       |
| `p`                                | padding                   |
| `px`, `py`                         | padding-inline, padding-block |
| `pt`, `pb`, `pl`, `pr`             | padding-block-start, etc. |
| `m`, `mx`, `my`, `mt`, `mb`, `ml`, `mr` | margin variants      |

**Layout Props:**

| Prop        | CSS Property    | Values                                               |
| ----------- | --------------- | ---------------------------------------------------- |
| `ax`        | justify-content | `start`, `center`, `end`, `space-between`, `stretch` |
| `ay`        | align-items     | `start`, `center`, `end`, `baseline`, `stretch`      |
| `direction` | flex-direction  | `row`, `column`                                      |

**Toggle Props:**

| Prop         | Effect              |
| ------------ | ------------------- |
| `fullwidth`  | width: 100%         |
| `fullheight` | height: 100%        |
| `evenly`     | flex: 1 on children |

**Stack vs Group axis directions:**

- `Stack` (vertical): `ax` = cross-axis (horizontal alignment), `ay` = main-axis (vertical)
- `Group` (horizontal): `ax` = main-axis (horizontal), `ay` = cross-axis (vertical alignment)

## Conditional Rendering Utilities

**ConditionalRender** — Wrap content in a component only when condition is true:

```tsx
<ConditionalRender condition={showWrapper} render={<Card />}>
  {children}
</ConditionalRender>
```

**SwitchRender** — Switch between two wrapper components. Any additional props are passed to whichever wrapper is selected:

```tsx
<SwitchRender
  condition={orientation === "vertical"}
  render={{ true: <Stack gap={2} />, false: <Group gap={2} /> }}
  role="list"
  data-slot="timeline"
  className={cx(styles["timeline"], className)}
  {...props}
>
  {children}
</SwitchRender>
```

## Typography (`@uiid/typography`)

Use `Text` for all text content instead of raw HTML elements:

| Prop            | Values                                                               |
| --------------- | -------------------------------------------------------------------- |
| `size`          | -1, 0, 1, 2, 3, 4, 5, 6, 7, 8                                        |
| `weight`        | `thin`, `light`, `normal`, `bold`                                    |
| `shade`         | `background`, `surface`, `accent`, `halftone`, `muted`, `foreground` |
| `tone`          | `positive`, `critical`, `warning`, `info`                            |
| `align`         | `left`, `center`, `right`, `justify`                                 |
| `underline`     | boolean                                                              |
| `strikethrough` | boolean                                                              |
| `balance`       | boolean                                                              |

Text also supports all spacing props (`m`, `mb`, `p`, etc.).

## CSS Module Patterns

Only use CSS Modules for:
- **Visual styling** (colors, borders, shadows, animations)
- **State-based styling** using `data-*` attributes
- **Pseudo-elements** (`::before`, `::after`)
- **Complex positioning** (absolute, transforms)

```css
/* Good — visual styling */
.timeline-dot {
  border-radius: 9999px;
  border: 2px solid var(--shade-foreground);
}

/* Good — state styling */
.timeline-dot[data-status="pending"] {
  border-color: var(--globals-border-color);
}
```

## CSS Variable Naming

```css
--{layer}-{property}
--{layer}-{variant}-{property}
--{layer}-state-{state}-{property}
```

Examples:
```css
--forms-bg
--forms-bg-hover
--buttons-variant-primary-background
--forms-state-disabled-opacity
```

## Spacing Scale Reference

```
0  = 0px    1  = 4px    2  = 8px    3  = 12px
4  = 16px   6  = 24px   8  = 32px   10 = 40px
12 = 48px   16 = 64px   20 = 80px   24 = 96px
```
