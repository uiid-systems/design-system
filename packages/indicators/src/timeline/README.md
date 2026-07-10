# Timeline

> A vertical sequence of events on a marker rail. Precomposed when you have data, composable when you don't.

Use Timeline when you want to:

- Render an array of events with `items` — each entry is `{ title, time, description, color, status, marker, media, content }` plus any per-item slot props (`TitleProps`, `MarkerProps`, …)
- Compose by hand instead — pass `<TimelineItem>`s as children (same shape as props)
- Track progress with `activeIndex` — earlier items render as `completed`, the index itself as `active`, later items as `pending`
- Render a feed of past events with `defaultStatus="completed"` — no `activeIndex` gymnastics; per-item `status` overrides either derivation
- Put an icon inside the dot with `marker` — the marker switches to its content variant and the rail widens to fit
- Give an event prominence with `media` — an `<Avatar>`, icon, or any node in a dedicated column to the left of the rail
- Drop richer `content` (e.g. a `<Card />`) below an item's text — the content column stretches to fill, no extra wiring
- Tune the rhythm with `gap` — a spacing token for the space between items, like `Stack`

Both shapes coexist: `items` is the fast path for data, JSX children is the escape hatch for custom layouts. They render the same output.

## Anatomy

Each item is a grid row of up to three columns:

```
[ media ]  [ rail ]  [ content ]
 avatar     dot +     title · time
 / icon     line      description
            (marker)   + children
```

- **media** — optional. Only present when at least one item has `media`; otherwise the column collapses and the rail moves to the left edge. The media centers on the title's first line.
- **rail** — the `marker` (a status-colored dot, or a circled `marker` node such as a small icon) and the `connector` (a continuous line masked behind each marker). The marker centers on the title's first line; the last item has no trailing connector. Connectors below `completed` items render filled.
- **content** — the `title` / `time` heading row, a `description`, and any `children`.

## Usage

```tsx
// Data mode (stepper)
<Timeline
  activeIndex={2}
  items={[
    { title: "Order placed", time: "9:00 AM" },
    { title: "Shipped", description: "In transit", media: <Truck size={20} /> },
    { title: "Delivered" },
  ]}
/>

// Data mode (event feed) — markers in the rail, tight rhythm, colored titles
<Timeline
  defaultStatus="completed"
  gap={4}
  items={[
    {
      title: "prompt",
      time: "09:00:41",
      color: "blue",
      marker: <MessageSquare size={12} />,
      TitleProps: { color: "blue" },
    },
    { title: "tool work", color: "yellow", marker: <Wrench size={12} /> },
  ]}
/>

// Composition mode
<Timeline activeIndex={1}>
  <TimelineItem title="Draft" time="Mon" />
  <TimelineItem title="In review" media={<Avatar initials="JD" />}>
    <Card>…</Card>
  </TimelineItem>
  <TimelineItem title="Published" />
</Timeline>
```

`color` (root or per-item) tints the markers and connectors with any palette color; a per-item `color` overrides the root. Per-item `status` overrides whatever `activeIndex` or `defaultStatus` derive.

## Subcomponents

- **`TimelineItem`** — one event (`<li>`). Slots: `title`, `time`, `description`, `marker`, `media`, `content`, plus `children`. Reads its status/position from the timeline.
- **`TimelineMedia`** — the leading column wrapper for the `media` node.
- **`TimelineMarker`** — the dot on the rail. Reflects status via `data-status`; renders as a circled content marker when given children (or an item `marker`).
- **`TimelineConnector`** — the line to the next item. Hidden on the last item unless `forceMount`.
- **`TimelineContent`**, **`TimelineTitle`**, **`TimelineTime`**, **`TimelineDescription`** — the content building blocks.

Slot props (`MediaProps`, `MarkerProps`, `ConnectorProps`, `ContentProps`, `TitleProps`, `TimeProps`, `DescriptionProps`, `HeadingProps`) forward props to the matching subcomponent. Set them on the root to apply to every item in data mode (`<Timeline ContentProps={{ maxw: 680 }}>`), or on a single item/entry to override — per-item values merge over the root's key-by-key. `ItemProps` on the root forwards plain `<li>` props to every item.

## Theming

All geometry derives from CSS variables on the root — override them to retheme without touching markup:

| Variable                          | Default              | Controls                                  |
| --------------------------------- | -------------------- | ----------------------------------------- |
| `--timeline-media-size`           | `2.5rem`             | Width of the leading media column         |
| `--timeline-rail-size`            | `1rem`               | Width of the dot/connector column         |
| `--timeline-line`                 | `1.5rem`             | First-line height markers align to        |
| `--timeline-dot-size`             | `0.75rem`            | Diameter of the default dot               |
| `--timeline-marker-size`          | `1.5rem`             | Diameter of a content marker (`marker`)   |
| `--timeline-connector-thickness`  | `0.125rem`           | Connector line width                      |
| `--timeline-column-gap`           | `0.75rem`            | Gap between columns                        |
| `--timeline-row-gap`              | `2.5rem`             | Vertical space between items              |
| `--timeline-marker-bg`            | `var(--shade-background)` | Fill that masks the line behind a marker |

Set `dir="rtl"` to flip the rail (and media column) to the opposite edge — positioning uses logical properties.
