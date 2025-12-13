import type { DraggableAttributes, UniqueIdentifier } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

export type CalendarView = "month" | "week" | "day" | "agenda";

export type DragHandlePosition = {
  x?: number;
  y?: number;
  data?: {
    isFirstDay?: boolean;
    isLastDay?: boolean;
  };
};

export type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  location?: string;
};

type EventInteractiveProps = React.PropsWithChildren<{
  event: CalendarEvent;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  isDragging?: boolean;
  currentTime?: Date;
  dndListeners?: SyntheticListenerMap;
  dndAttributes?: DraggableAttributes;
  onClick?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  className?: string;
}>;

export type EventWrapperProps = EventInteractiveProps;

export type EventItemProps = EventInteractiveProps & {
  view: CalendarView;
  showTime?: boolean;
};

/** Data attached to a draggable event */
export type DragStartData = {
  event: CalendarEvent;
  view: Exclude<CalendarView, "agenda">;
  height?: number;
  isMultiDay?: boolean;
  multiDayWidth?: number;
  dragHandlePosition?: DragHandlePosition;
};

/** Data attached to a drop target (calendar cell) */
export type DropTargetData = {
  date: Date;
  time?: number;
};

export type EventCalendarDndContextType = {
  activeEvent: DragStartData["event"] | null;
  activeId: UniqueIdentifier | null;
  activeView: DragStartData["view"] | null;
  currentTime: Date | null;
  eventHeight: NonNullable<DragStartData["height"]> | null;
  isMultiDay: NonNullable<DragStartData["isMultiDay"]>;
  multiDayWidth: NonNullable<DragStartData["multiDayWidth"]> | null;
  dragHandlePosition: NonNullable<DragStartData["dragHandlePosition"]> | null;
};
