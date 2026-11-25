# Tabs

> Accessible tab interface built on [Base UI Tabs](https://base-ui.com/react/components/tabs) with animated indicator and panel transitions.

## Quick Reference

```tsx
import { Tabs } from "@uiid/navigation";

// Basic usage
<Tabs
  items={[
    { label: "Tab 1", value: "tab-1", content: <div>Content 1</div> },
    { label: "Tab 2", value: "tab-2", content: <div>Content 2</div> },
  ]}
/>

// With default selection
<Tabs items={items} defaultValue="tab-2" />

// Controlled
<Tabs items={items} value={activeTab} onValueChange={setActiveTab} />

// Alignment
<Tabs items={items} align="start" />   // Left-aligned (default)
<Tabs items={items} align="center" />  // Center-aligned
<Tabs items={items} align="end" />     // Right-aligned

// Keep panels mounted
<Tabs items={items} keepMounted />
```

## Props

| Prop             | Type                                                     | Default            | Description                                                                                         |
| ---------------- | -------------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------- |
| `items`          | `TabsItemData[]`                                         | —                  | Array of tab items (required)                                                                       |
| `defaultValue`   | `string`                                                 | First item's value | Initially selected tab                                                                              |
| `value`          | `string`                                                 | —                  | Controlled selected tab                                                                             |
| `onValueChange`  | `(value: string, details: object) => void`               | —                  | Callback when tab changes                                                                           |
| `align`          | `"start" \| "center" \| "end"`                           | `"start"`          | Horizontal alignment of tabs                                                                        |
| `keepMounted`    | `boolean`                                                | `false`            | Keep inactive panels in DOM                                                                         |
| `RootProps`      | `TabsRootProps`                                          | —                  | Props for root element                                                                              |
| `ListProps`      | `Omit<TabsListProps, "size" \| "variant" \| "children">` | —                  | Props for tab list; set `size` and `variant` at the top level, and stretch the list with `w="full"` |
| `TabProps`       | `Omit<TabsTabProps, "value">`                            | —                  | Props for every tab; each item keeps its own `value`                                                |
| `IndicatorProps` | `TabsIndicatorProps`                                     | —                  | Props for indicator                                                                                 |
| `PanelProps`     | `Omit<TabsPanelProps, "value" \| "keepMounted">`         | —                  | Props for every panel; set `keepMounted` at the top level                                           |

`defaultValue` falls back to the first item's value only when it is `undefined`, and there is no default when `items` is empty. Pass `defaultValue={null}` for no active tab. When a top-level prop and `RootProps` set the same key, the top-level prop wins. A `RootProps.defaultValue` still counts before the first-item fallback. The default is read once, on mount: when `items` starts empty and loads later, the first tab is selected and `onValueChange` fires once with the reason `"initial"`.

### TabsItemData (items)

| Prop      | Type        | Description       |
| --------- | ----------- | ----------------- |
| `label`   | `string`    | Tab button label  |
| `value`   | `string`    | Unique identifier |
| `content` | `ReactNode` | Panel content     |

## Data Slots

| Slot             | Element                      |
| ---------------- | ---------------------------- |
| `tabs-list`      | Tab button container         |
| `tabs-tab`       | Individual tab button        |
| `tabs-indicator` | Animated selection indicator |
| `tabs-panel`     | Content panel                |

## Architecture

```
┌─ TabsRoot ─────────────────────────────┐
│ ┌─ TabsList (Group) ─────────────────┐ │
│ │ [Tab 1] [Tab 2] [Tab 3]            │ │
│ │ ════════ (TabsIndicator)           │ │
│ └────────────────────────────────────┘ │
│ ┌─ Layer ────────────────────────────┐ │
│ │ ┌─ TabsPanel (Stack) ────────────┐ │ │
│ │ │ Panel content renders here     │ │ │
│ │ └────────────────────────────────┘ │ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
```

## Layout

`TabsRoot` and `TabsPanel` render a `Stack` and `TabsList` a `Group`, so `RootProps`, `PanelProps`, and `ListProps` take their layout props (`gap`, `p`, `ax`, `ay`, `w`, ...) alongside Base UI's. The list keeps its content width unless `ListProps={{ w: "full" }}` stretches it. The list spaces its tabs `gap={4}` apart and centres them on the cross axis (`ay="center"`); each panel fills the width (`w="full"`, released with `PanelProps={{ w: null }}`), stretches its content across it, and centres it vertically (`ay="center"`). Pass any of them to change it.

A `render` of your own replaces the primitive, so layout props passed beside it reach your element as plain attributes: `<TabsRoot render={<section />} gap={4}>` renders `<section gap="4">`.

## Subcomponents

For advanced customization, you can use the individual subcomponents:

```tsx
import {
  TabsRoot,
  TabsList,
  TabsTab,
  TabsIndicator,
  TabsPanel,
} from "@uiid/navigation";

<TabsRoot defaultValue="tab-1">
  <TabsList>
    <TabsTab value="tab-1">Tab 1</TabsTab>
    <TabsTab value="tab-2">Tab 2</TabsTab>
    <TabsIndicator />
  </TabsList>
  <TabsPanel value="tab-1">Content 1</TabsPanel>
  <TabsPanel value="tab-2">Content 2</TabsPanel>
</TabsRoot>;
```

## Accessibility

- Full keyboard navigation (Arrow keys, Home, End)
- ARIA attributes automatically applied
- Focus management between tabs and panels
- Screen reader announcements

## Styling

The indicator animates between tabs using CSS transforms. Customize via tokens:

| Token                       | Default              | Description            |
| --------------------------- | -------------------- | ---------------------- |
| `--tabs-tab-height`         | `3rem`               | Tab button height      |
| `--tabs-tab-color-default`  | `--shade-muted`      | Inactive tab color     |
| `--tabs-tab-color-active`   | `--shade-foreground` | Active/hover tab color |
| `--tabs-indicator-height`   | `50%`                | Indicator height       |
| `--tabs-indicator-color-bg` | `--shade-foreground` | Indicator background   |
