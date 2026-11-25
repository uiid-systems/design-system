# Accordion

> A set of collapsible panels with headings. Built on the [Base UI Accordion](https://base-ui.com/react/components/accordion) primitive.

## Quick Reference

```tsx
import { Accordion } from "@uiid/navigation";

// Simple usage with items array
<Accordion
  items={[
    { value: "item-1", trigger: "Title", content: "Content" },
    { value: "item-2", trigger: "Title 2", content: "Content 2" },
  ]}
/>

// Controlled
<Accordion items={items} value={value} onValueChange={setValue} />

// With default expanded item
<Accordion items={items} defaultValue={["item-1"]} />

// Allow several open at once
<Accordion items={items} multiple />

// Size and surface
<Accordion items={items} size="small" variant="ghost" />

// Disabled
<Accordion items={items} disabled />
```

## Props

| Prop            | Type                                                          | Default    | Description                                                          |
| --------------- | ------------------------------------------------------------- | ---------- | -------------------------------------------------------------------- |
| `items`         | `AccordionItemData[]`                                         | —          | Array of accordion items                                             |
| `defaultValue`  | `AccordionValue` (an array of item values)                    | —          | Initially expanded items                                             |
| `value`         | `AccordionValue` (an array of item values)                    | —          | Controlled expanded items                                            |
| `onValueChange` | `(value, eventDetails) => void`                               | —          | Callback when expanded items change                                  |
| `multiple`      | `boolean`                                                     | `false`    | Whether several items can be open at the same time                   |
| `disabled`      | `boolean`                                                     | `false`    | Disables all accordion items                                         |
| `orientation`   | `"vertical" \| "horizontal"`                                  | —          | Passed to Base UI, which deprecates it; it no longer changes focus   |
| `size`          | `"small" \| "medium" \| "large"`                              | `"medium"` | Trigger padding and icon size, and the panel padding to match        |
| `variant`       | `"ghost"`                                                     | —          | Filled by default; `ghost` drops the card surface and the item rules |
| `RootProps`     | `AccordionRootProps`                                          | —          | Props for the root                                                   |
| `ItemProps`     | `Omit<AccordionItemProps, "value" \| "disabled">`             | —          | Props for every item; each item keeps its own `value` and `disabled` |
| `HeaderProps`   | `AccordionHeaderProps`                                        | —          | Props for every header                                               |
| `TriggerProps`  | `Omit<AccordionTriggerProps, "size" \| "icon" \| "children">` | —          | Props for every trigger; set `size` at the top level                 |
| `PanelProps`    | `Omit<AccordionPanelProps, "size" \| "children">`             | —          | Props for every panel; set `size` at the top level                   |
| `ContentProps`  | `AccordionContentProps`                                       | —          | Props for the `Stack` inside every panel                             |

### AccordionItemData

| Prop       | Type              | Description                         |
| ---------- | ----------------- | ----------------------------------- |
| `value`    | `string`          | Unique identifier for the item      |
| `icon`     | `Icon`            | Icon shown before the trigger label |
| `trigger`  | `React.ReactNode` | Content for the trigger button      |
| `content`  | `React.ReactNode` | Content for the panel               |
| `disabled` | `boolean`         | Disables this specific item         |

## Anatomy

```tsx
<AccordionRoot>
  <AccordionItem value="item-1">
    <AccordionHeader>
      <AccordionTrigger>Title</AccordionTrigger>
    </AccordionHeader>
    <AccordionPanel>
      <AccordionContent>Content</AccordionContent>
    </AccordionPanel>
  </AccordionItem>
</AccordionRoot>
```

`variant` goes on `AccordionRoot`; `size` goes on each `AccordionTrigger` and `AccordionPanel`, and `icon` on the trigger.

## Layout

`AccordionRoot` renders a [`Card`](../../../cards/src/card/README.md) and each `AccordionItem` a `Stack`, so `RootProps` and `ItemProps` take their layout props (`gap`, `p`, `ax`, `ay`, `w`, ...) alongside Base UI's. When a top-level prop and `RootProps` set the same key, the top-level prop wins. The root is flush (`gap={0}`, `p={0}`) and fills its container (`w="full"`); pass another `w` through `RootProps` to size it, or `w: null` to release the fill. Each item fills the root (`w="full"`, released the same way through `ItemProps`) and stretches its header and panel across the root (`ax="stretch"`). `AccordionContent` is a `Stack` that carries the panel's padding.

The items sit inside the Card's inner container, so a `gap` on the root spaces the Card's own regions — title, body, footer — rather than the items. Space the items with `InnerContainerProps`: `RootProps={{ InnerContainerProps: { gap: 2 } }}`.

A `render` of your own replaces the primitive, so layout props passed beside it reach your element as plain attributes.

## Subcomponents

| Component          | Description                            |
| ------------------ | -------------------------------------- |
| `AccordionRoot`    | Container and context provider         |
| `AccordionItem`    | Groups header with its panel           |
| `AccordionHeader`  | Labels the corresponding panel         |
| `AccordionTrigger` | Button that opens/closes the panel     |
| `AccordionPanel`   | Collapsible content container          |
| `AccordionContent` | Padded `Stack` for the panel's content |

## Data Slots

| Slot                | Element         |
| ------------------- | --------------- |
| `accordion-root`    | Root container  |
| `accordion-item`    | Item container  |
| `accordion-header`  | Header element  |
| `accordion-trigger` | Trigger button  |
| `accordion-panel`   | Panel container |
| `accordion-content` | Panel content   |

## Styling

Every trigger and panel carries a size tier, `medium` when `size` is unset, and the tier tokens are the ones that take effect:

| Token                                   | Default                                      | Description                                                                                                               |
| --------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `--accordion-size-{sm,md,lg}-padding-x` | `--forms-size-{sm,md,lg}-padding-x`          | Trigger and content inline padding per size                                                                               |
| `--accordion-size-{sm,md,lg}-padding-y` | `0.5rem`, `0.75rem`, `1rem`                  | Trigger block padding per size; content uses twice it                                                                     |
| `--accordion-size-{sm,md,lg}-icon-size` | `0.875rem`, `--globals-icon-size`, `1.25rem` | Trigger icon and chevron height per size                                                                                  |
| `--accordion-size-{sm,md,lg}-font-size` | `--forms-size-{sm,md,lg}-font-size`          | Set on the trigger button, but the label does not follow it: the label is a size `0` `Text`, which sets its own font size |

These tokens are declared but always overridden, so changing them has no visible effect:

| Token                           | Default               | Why it has no effect                                                                           |
| ------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------- |
| `--accordion-trigger-padding-x` | `--globals-padding-x` | The trigger's size tier sets `padding-inline` directly from `--accordion-size-*-padding-x`     |
| `--accordion-trigger-padding-y` | `--globals-padding-y` | The trigger's size tier sets `padding-block` directly from `--accordion-size-*-padding-y`      |
| `--accordion-panel-padding-x`   | `--globals-padding-x` | The panel's size tier redefines it from `--accordion-size-*-padding-x`                         |
| `--accordion-panel-padding-y`   | `1.5rem`              | The panel's size tier redefines it as twice `--accordion-size-*-padding-y`                     |
| `--accordion-panel-height`      | `2rem`                | Base UI sets its own `--accordion-panel-height` on the panel, which the height animation reads |

## Accessibility

- Built on Base UI, which handles ARIA attributes automatically
- Each trigger is a button in the tab order; Enter or Space toggles its panel
- Base UI 1.9 no longer moves focus between triggers with the arrow keys, following the APG guidance update

## See Also

- [Collapsible](../../../interactive/src/collapsible/README.md) - Single collapsible panel
- [Base UI Accordion](https://base-ui.com/react/components/accordion) - Underlying primitive
