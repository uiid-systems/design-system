# Timeline

> A vertical sequence of events on a marker rail. Precomposed when you have data, composable when you don't.

Use Timeline when you want to:

- Render an array of events with `items` — each entry is `{ title, time, description, color, status, marker, media, content }` plus any per-item slot props (`CardProps`, `TitleProps`, …)
- Compose by hand instead — pass `<TimelineItem>`s as children (same shape as props)
- Every item renders as a **Card**: `title` and `time` fill the card header (time in the action corner), `description` sits below the title, and `content`/children fill the body. Pass `CardProps={{ variant: "ghost" }}` (root or per item) for flat rows without the surface.
- Track progress with `activeIndex` — earlier items render as `completed`, the index itself as `active`, later items as `pending`
- Render a feed of past events with `defaultStatus="completed"` — no `activeIndex` gymnastics; per-item `status` overrides either derivation
- Put an icon inside the dot with `marker` — the marker switches to its content variant and the rail widens to fit
- Give an event prominence with `media` — an `<Avatar>`, icon, or any node in a dedicated column to the left of the rail
- Tune the rhythm with `gap` — a spacing token for the space between items, like `Stack`

Both shapes coexist: `items` is the fast path for data, JSX children is the escape hatch for custom layouts. They render the same output.

## Anatomy

Each item is a grid row of up to three columns:

```
[ media ]  [ rail ]  [ content: Card       ]
 avatar     dot +    ┌ title        · time ┐
 / icon     line     │ description         │
            (marker) └ body (content)      ┘
```

- **media** — optional. Only present when at least one item has `media`; otherwise the column collapses and the rail moves to the left edge. The media centers on the card's title row.
- **rail** — the `marker` (a status-colored dot, or a circled `marker` node such as a small icon) and the `connector` (a continuous line masked behind each marker). The marker centers on the card's title row; the last item has no trailing connector. Connectors below `completed` items render filled.
- **content** — a `Card` per item: `title` in the header with `time` in the action corner, `description` under the title, `content`/`children` as the body. `CardProps={{ variant: "ghost" }}` flattens the surface while keeping the padding, so ghost and solid rows stay aligned.

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
      content: <Markdown>{prompt}</Markdown>,   // card body
    },
    {
      title: "tool work",
      color: "yellow",
      marker: <Wrench size={12} />,
      CardProps: { variant: "ghost" },          // flat row, no surface
    },
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

- **`TimelineItem`** — one event (`<li>`). Slots: `title`, `time`, `description`, `marker`, `media`, `content`, plus `children`. Reads its status/position from the timeline and renders its content through a `Card`.
- **`TimelineMedia`** — the leading column wrapper for the `media` node.
- **`TimelineMarker`** — the dot on the rail. Reflects status via `data-status`; renders as a circled content marker when given children (or an item `marker`).
- **`TimelineConnector`** — the line to the next item. Hidden on the last item unless `forceMount`.
- **`TimelineContent`** — the content grid cell wrapping the Card.
- **`TimelineTime`** — the `<time>` text rendered in the Card's action corner.

Slot props (`MediaProps`, `MarkerProps`, `ConnectorProps`, `ContentProps`, `CardProps`, `TitleProps`, `TimeProps`, `DescriptionProps`, `HeadingProps`) forward props to the matching part — `TitleProps`, `DescriptionProps`, and `HeadingProps` reach the Card's title, description, and header. Set them on the root to apply to every item in data mode (`<Timeline CardProps={{ variant: "ghost" }}>`), or on a single item/entry to override — per-item values merge over the root's key-by-key. `ItemProps` on the root forwards plain `<li>` props to every item.

## Theming

All geometry derives from CSS variables on the root — override them to retheme without touching markup:

| Variable                         | Default                    | Controls                                        |
| -------------------------------- | -------------------------- | ----------------------------------------------- |
| `--timeline-media-size`          | `2.5rem`                   | Width of the leading media column               |
| `--timeline-rail-size`           | `1rem`                     | Width of the dot/connector column               |
| `--timeline-line`                | `1.5rem`                   | First-line height markers align to              |
| `--timeline-dot-size`            | `0.75rem`                  | Diameter of the default dot                     |
| `--timeline-marker-size`         | `1.5rem`                   | Diameter of a content marker (`marker`)         |
| `--timeline-anchor-offset`       | `var(--globals-padding-y)` | Marker/media shift down to the card's title row |
| `--timeline-connector-thickness` | `0.125rem`                 | Connector line width                            |
| `--timeline-column-gap`          | `0.75rem`                  | Gap between columns                             |
| `--timeline-row-gap`             | `2.5rem`                   | Vertical space between items                    |
| `--timeline-marker-bg`           | `var(--shade-background)`  | Fill that masks the line behind a marker        |

Set `dir="rtl"` to flip the rail (and media column) to the opposite edge — positioning uses logical properties.
