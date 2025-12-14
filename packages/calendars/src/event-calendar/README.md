# Event Calendar

Drag-and-drop calendar events across month, week, day, and agenda views.

## Quick Start

```tsx
import {
  EventCalendarDndProvider,
  DraggableEvent,
  DroppableCell,
} from "./event-calendar";

const MyCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([...]);

  const handleEventUpdate = (updated: CalendarEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    );
  };

  return (
    <EventCalendarDndProvider onEventUpdate={handleEventUpdate}>
      {/* Your calendar grid with DroppableCells and DraggableEvents */}
    </EventCalendarDndProvider>
  );
};
```

## Architecture

```
event-calendar/
├── event-calendar.context.tsx   # DnD provider + state management
├── event-calendar.types.ts      # Shared types
├── event-calendar.utils.ts      # Date helpers
├── event-calendar.constants.ts  # Config values
├── hooks/
│   └── use-event-visibility.ts  # Calculate visible events in a cell
└── subcomponents/
    ├── draggable-event.tsx      # Wrapper that makes events draggable
    ├── droppable-cell.tsx       # Drop target (calendar cell)
    ├── event-item.tsx           # View dispatcher
    ├── month-event.tsx          # Month view rendering
    ├── week-day-event.tsx       # Week/day view rendering
    ├── agenda-event.tsx         # Agenda view rendering
    ├── event-wrapper.tsx        # Shared button wrapper
    └── event-drag-overlay.tsx   # Ghost element during drag
```

## Core Types

### `CalendarEvent`

```ts
type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  location?: string;
};
```

### `CalendarView`

```ts
type CalendarView = "month" | "week" | "day" | "agenda";
```

## Components

### `EventCalendarDndProvider`

Wraps your calendar. Manages drag state via `useReducer` and provides context.

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Your calendar content |
| `onEventUpdate` | `(event: CalendarEvent) => void` | Called when an event is dropped |

### `DraggableEvent`

Makes an event draggable. Renders `EventItem` internally.

| Prop | Type | Description |
|------|------|-------------|
| `event` | `CalendarEvent` | The event data |
| `view` | `"month" \| "week" \| "day"` | Current view (no drag in agenda) |
| `showTime?` | `boolean` | Show time in event display |
| `height?` | `number` | Fixed height (for week/day views) |
| `isMultiDay?` | `boolean` | Spans multiple days |
| `onClick?` | `(e: MouseEvent) => void` | Click handler |

### `DroppableCell`

A drop target. Wrap your calendar cells with this.

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Unique identifier |
| `date` | `Date` | The date this cell represents |
| `time?` | `number` | Hour as decimal (e.g., `9.5` = 9:30am) |

### `EventItem`

View dispatcher—renders the appropriate component based on `view`. You typically don't use this directly; `DraggableEvent` handles it.

## Hooks

### `useEventCalendarDnd()`

Access drag state from anywhere in the provider tree.

```ts
const {
  activeEvent,    // Event being dragged (or null)
  activeView,     // View it came from
  currentTime,    // Live position during drag
  // ...etc
} = useEventCalendarDnd();
```

### `useEventVisibility(options)`

Calculates how many events can fit in a calendar cell. Uses `ResizeObserver` for efficient updates.

```ts
const { contentRef, contentHeight, getVisibleEventCount } = useEventVisibility({
  eventHeight: 20,  // Height of each event in px
  eventGap: 4,      // Gap between events in px
});

// Attach ref to your content container
<div ref={contentRef}>
  {events.slice(0, getVisibleEventCount(events.length)).map(...)}
  {events.length > getVisibleEventCount(events.length) && <MoreButton />}
</div>
```

Returns:
- `contentRef` — attach to the container you want to measure
- `contentHeight` — current height in pixels (or `null` before mount)
- `getVisibleEventCount(total)` — returns how many events to show (reserves space for "more" button)

## Utils

All in `event-calendar.utils.ts`:

| Function | Purpose |
|----------|---------|
| `hasDateChanged(a, b)` | Compare year/month/day |
| `hasDateTimeChanged(a, b)` | Compare year/month/day/hour/minute |
| `roundToNearest15Minutes(time)` | Snap to 15-min intervals |
| `calculateDropTime(dropData, currentTime, isMonthView)` | Get new time for dropped event |
| `calculateUpdatedEventTimes(event, newStart)` | Preserve duration when moving |
| `getDisplayTimes(event, currentTime?)` | Get start/end/duration for rendering |
| `formatEventTime(...)` | Format time range string |

## State Management

The provider uses `useReducer` with three actions:

```ts
type DragAction =
  | { type: "START_DRAG"; payload: EventCalendarDndContextType }
  | { type: "UPDATE_TIME"; payload: Date }
  | { type: "RESET" };
```

This keeps all drag-related state in sync and makes transitions predictable.

