# Timeline

> A vertical sequence of events on a marker rail. Precomposed when you have data, composable when you don't.

Use Timeline when you want to:

- Render an array of events with `items` — each entry is `{ title, time, description, color, media, content }`
- Compose by hand instead — pass `<TimelineItem>`s as children (same shape as props)
- Track progress with `activeIndex` — earlier items render as `completed`, the index itself as `active`, later items as `pending`
- Give an event prominence with `media` — an `<Avatar>`, icon, or any node in a dedicated column to the left of the rail
- Drop richer `content` (e.g. a `<Card />`) below an item's text — the content column stretches to fill, no extra wiring

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
- **rail** — the `marker` (a status-colored dot) and the `connector` (a continuous line masked behind each marker). The dot centers on the title's first line; the last item has no trailing connector.
- **content** — the `title` / `time` heading row, a `description`, and any `children`.

## Usage

```tsx
// Data mode
<Timeline
  activeIndex={2}
  items={[
    { title: "Order placed", time: "9:00 AM" },
    { title: "Shipped", description: "In transit", media: <Truck size={20} /> },
    { title: "Delivered" },
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

`color` (root or per-item) tints the markers and connectors with any palette color; a per-item `color` overrides the root.

## Subcomponents

- **`TimelineItem`** — one event (`<li>`). Slots: `title`, `time`, `description`, `media`, `content`, plus `children`. Reads its status/position from the timeline.
- **`TimelineMedia`** — the leading column wrapper for the `media` node.
- **`TimelineMarker`** — the dot on the rail. Reflects status via `data-status`.
- **`TimelineConnector`** — the line to the next item. Hidden on the last item unless `forceMount`.
- **`TimelineContent`**, **`TimelineTitle`**, **`TimelineTime`**, **`TimelineDescription`** — the content building blocks.

Per-item slot overrides (`MediaProps`, `MarkerProps`, `ConnectorProps`, `ContentProps`, `TitleProps`, `TimeProps`, `DescriptionProps`) forward props to the subcomponent; pass them through `ItemProps` on the root to apply to every item in data mode.

## Theming

All geometry derives from CSS variables on the root — override them to retheme without touching markup:

| Variable                          | Default              | Controls                                  |
| --------------------------------- | -------------------- | ----------------------------------------- |
| `--timeline-media-size`           | `2.5rem`             | Width of the leading media column         |
| `--timeline-rail-size`            | `1rem`               | Width of the dot/connector column         |
| `--timeline-line`                 | `1.5rem`             | First-line height markers align to        |
| `--timeline-dot-size`             | `0.75rem`            | Diameter of the default dot               |
| `--timeline-connector-thickness`  | `0.125rem`           | Connector line width                      |
| `--timeline-column-gap`           | `0.75rem`            | Gap between columns                        |
| `--timeline-row-gap`              | `2.5rem`             | Vertical space between items              |
| `--timeline-marker-bg`            | `var(--shade-background)` | Fill that masks the line behind a marker |

Set `dir="rtl"` to flip the rail (and media column) to the opposite edge — positioning uses logical properties.
