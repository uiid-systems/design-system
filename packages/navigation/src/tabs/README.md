# Tabs

> Accessible tab interface built on [Base UI Tabs](https://base-ui.com/react/components/tabs) with an animated indicator and panel transitions.

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

// Size and surface
<Tabs items={items} size="small" />
<Tabs items={items} variant="ghost" />

// Stretch the list across the root
<Tabs items={items} ListProps={{ w: "full" }} />

// Keep panels mounted
<Tabs items={items} keepMounted />
```

## Props

| Prop             | Type                                                           | Default            | Description                                                                                                   |
| ---------------- | -------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------- |
| `items`          | `TabsItemData[]`                                               | —                  | Array of tab items (required)                                                                                 |
| `defaultValue`   | `string \| null`                                               | First item's value | Initially selected tab                                                                                        |
| `value`          | `string \| null`                                               | —                  | Controlled selected tab                                                                                       |
| `onValueChange`  | `(value, eventDetails) => void`                                | —                  | Callback when the selected tab changes                                                                        |
| `size`           | `"xsmall" \| "small" \| "medium" \| "large"`                   | `"medium"`         | Tab height and padding, matching the form-control rows                                                        |
| `variant`        | `"ghost"`                                                      | —                  | Filled by default; `ghost` drops the list background and border                                               |
| `keepMounted`    | `boolean`                                                      | `false`            | Keep inactive panels in the DOM                                                                               |
| `RootProps`      | `TabsRootProps`                                                | —                  | Props for the root                                                                                            |
| `ListProps`      | `Omit<TabsListProps, "size" \| "variant" \| "children">`       | —                  | Props for the tab list; set `size` and `variant` at the top level                                             |
| `TabProps`       | `Omit<TabsTabProps, "value" \| "children">`                    | —                  | Props for every tab; each item keeps its own `value` and label                                                |
| `IndicatorProps` | `TabsIndicatorProps`                                           | —                  | Props for the indicator                                                                                       |
| `PanelProps`     | `Omit<TabsPanelProps, "value" \| "keepMounted" \| "children">` | —                  | Props for every panel; each item keeps its own `value` and content, and `keepMounted` is set at the top level |
| `ContainerProps` | `LayerProps`                                                   | —                  | Props for the `Layer` that wraps the panels                                                                   |

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
| `tabs-root`      | Root                         |
| `tabs-list`      | Tab button container         |
| `tabs-tab`       | Individual tab button        |
| `tabs-indicator` | Animated selection indicator |
| `tabs-container` | `Layer` wrapping the panels  |
| `tabs-panel`     | Content panel                |

`tabs-list` also carries `data-size` and, for the ghost surface, `data-variant="ghost"`.

## Architecture

```
┌─ TabsRoot (Stack) ─────────────────────┐
│ ┌─ TabsList (Group) ─────────────────┐ │
│ │ [Tab 1] [Tab 2] [Tab 3]            │ │
│ │ ════════ (TabsIndicator)           │ │
│ └────────────────────────────────────┘ │
│ ┌─ Layer (tabs-container) ───────────┐ │
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

For advanced customization, you can use the individual subcomponents. `size` and `variant` go on `TabsList`:

```tsx
import {
  TabsRoot,
  TabsList,
  TabsTab,
  TabsIndicator,
  TabsPanel,
} from "@uiid/navigation";

<TabsRoot defaultValue="tab-1">
  <TabsList size="small">
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

The indicator slides between tabs by animating its `left` and `width`. The tab height and padding come from the `size` tier, which reads the form-control size tokens (`--forms-size-{xs,sm,md,lg}-height` and `-padding-x`). The component tokens are:

| Token                      | Default  | Description                                                             |
| -------------------------- | -------- | ----------------------------------------------------------------------- |
| `--tabs-tab-height`        | `2.5rem` | Tab list height; each `size` tier sets it from the matching forms token |
| `--tabs-tab-padding-x`     | —        | Inline padding of each tab; set by the `size` tier                      |
| `--tabs-panel-translate-y` | `2%`     | Vertical offset a hidden panel slides from                              |
