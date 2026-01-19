# Tabs

> Accessible tab interface built on [Base UI Tabs](https://base-ui.com/react/components/tabs) with animated indicator and panel transitions.

## Quick Reference

```tsx
import { Tabs } from "@uiid/interactive";

// Basic usage
<Tabs
  items={[
    { label: "Tab 1", value: "tab-1", render: <div>Content 1</div> },
    { label: "Tab 2", value: "tab-2", render: <div>Content 2</div> },
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

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `TabProps[]` | — | Array of tab items (required) |
| `defaultValue` | `string` | First item's value | Initially selected tab |
| `value` | `string` | — | Controlled selected tab |
| `onValueChange` | `(value: string, details: object) => void` | — | Callback when tab changes |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Horizontal alignment of tabs |
| `keepMounted` | `boolean` | `false` | Keep inactive panels in DOM |
| `RootProps` | `TabsRootProps` | — | Props for root element |
| `ListProps` | `TabsListProps` | — | Props for tab list |
| `TabProps` | `TabsTabProps` | — | Props for individual tabs |
| `IndicatorProps` | `TabsIndicatorProps` | — | Props for indicator |
| `PanelProps` | `TabsPanelProps` | — | Props for panels |

### TabProps (items)

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Tab button label |
| `value` | `string` | Unique identifier |
| `render` | `ReactNode` | Panel content |

## Data Slots

| Slot | Element |
|------|---------|
| `tabs-list` | Tab button container |
| `tabs-tab` | Individual tab button |
| `tabs-indicator` | Animated selection indicator |
| `tabs-panel` | Content panel |

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

## Subcomponents

For advanced customization, you can use the individual subcomponents:

```tsx
import {
  TabsRoot,
  TabsList,
  TabsTab,
  TabsIndicator,
  TabsPanel,
} from "@uiid/interactive";

<TabsRoot defaultValue="tab-1">
  <TabsList>
    <TabsTab value="tab-1">Tab 1</TabsTab>
    <TabsTab value="tab-2">Tab 2</TabsTab>
    <TabsIndicator />
  </TabsList>
  <TabsPanel value="tab-1">Content 1</TabsPanel>
  <TabsPanel value="tab-2">Content 2</TabsPanel>
</TabsRoot>
```

## Accessibility

- Full keyboard navigation (Arrow keys, Home, End)
- ARIA attributes automatically applied
- Focus management between tabs and panels
- Screen reader announcements

## Styling

The indicator animates between tabs using CSS transforms. Customize via tokens:

| Token | Default | Description |
|-------|---------|-------------|
| `--tabs-tab-height` | `3rem` | Tab button height |
| `--tabs-tab-color-default` | `--shade-muted` | Inactive tab color |
| `--tabs-tab-color-active` | `--shade-foreground` | Active/hover tab color |
| `--tabs-indicator-height` | `50%` | Indicator height |
| `--tabs-indicator-color-bg` | `--shade-foreground` | Indicator background |
