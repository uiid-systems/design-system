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

// Disabled
<Accordion items={items} disabled />
```

## Props

| Prop            | Type                         | Default      | Description                         |
| --------------- | ---------------------------- | ------------ | ----------------------------------- |
| `items`         | `AccordionItemData[]`        | —            | Array of accordion items            |
| `defaultValue`  | `string[]`                   | —            | Initially expanded items            |
| `value`         | `string[]`                   | —            | Controlled expanded items           |
| `onValueChange` | `(value: string[]) => void`  | —            | Callback when expanded items change |
| `disabled`      | `boolean`                    | `false`      | Disables all accordion items        |
| `orientation`   | `"vertical" \| "horizontal"` | `"vertical"` | Orientation for keyboard navigation |

### AccordionItemData

| Prop       | Type              | Description                    |
| ---------- | ----------------- | ------------------------------ |
| `value`    | `string`          | Unique identifier for the item |
| `trigger`  | `React.ReactNode` | Content for the trigger button |
| `content`  | `React.ReactNode` | Content for the panel          |
| `disabled` | `boolean`         | Disables this specific item    |

## Anatomy

```tsx
<AccordionRoot>
  <AccordionItem value="item-1">
    <AccordionHeader>
      <AccordionTrigger>Title</AccordionTrigger>
    </AccordionHeader>
    <AccordionPanel>Content</AccordionPanel>
  </AccordionItem>
</AccordionRoot>
```

## Layout

`AccordionRoot` renders a [`Card`](../../../cards/src/card/README.md) and each `AccordionItem` a `Stack`, so `RootProps` and `ItemProps` take their layout props (`gap`, `p`, `ax`, `ay`, `fullwidth`, ...) alongside Base UI's. The root is flush (`gap={0}`, `p={0}`) and fills its container, and `fullwidth={false}` releases it. Each item stretches its header and panel across the root (`ax="stretch"`).

The items sit inside the Card's inner container, so a `gap` on the root spaces the Card's own regions — title, body, footer — rather than the items. Space the items with `InnerContainerProps`: `RootProps={{ InnerContainerProps: { gap: 2 } }}`.

A `render` of your own replaces the primitive, so layout props passed beside it reach your element as plain attributes.

## Subcomponents

| Component          | Description                        |
| ------------------ | ---------------------------------- |
| `AccordionRoot`    | Container and context provider     |
| `AccordionItem`    | Groups header with its panel       |
| `AccordionHeader`  | Labels the corresponding panel     |
| `AccordionTrigger` | Button that opens/closes the panel |
| `AccordionPanel`   | Collapsible content container      |

## Data Slots

| Slot                | Element         |
| ------------------- | --------------- |
| `accordion-root`    | Root container  |
| `accordion-item`    | Item container  |
| `accordion-header`  | Header element  |
| `accordion-trigger` | Trigger button  |
| `accordion-panel`   | Panel container |

## Accessibility

- Built on Base UI which handles ARIA attributes automatically
- Keyboard navigation: Arrow keys navigate between triggers, Enter/Space toggles panels
- Supports `orientation` prop for horizontal keyboard navigation

## See Also

- [Collapsible](../../../interactive/src/collapsible/README.md) - Single collapsible panel
- [Base UI Accordion](https://base-ui.com/react/components/accordion) - Underlying primitive
