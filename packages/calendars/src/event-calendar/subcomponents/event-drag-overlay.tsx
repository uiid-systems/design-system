import type { EventCalendarDndContextType } from "../event-calendar.types";

import { EventItem } from "./event-item";

export type EventDragOverlayProps = EventCalendarDndContextType;

export const EventDragOverlay = ({
  activeEvent,
  activeView,
  currentTime,
  eventHeight,
  isMultiDay,
  multiDayWidth,
  dragHandlePosition,
}: EventDragOverlayProps) => {
  if (!activeEvent || !activeView) return null;

  return (
    <div
      style={{
        height: eventHeight ? `${eventHeight}px` : "auto",
        width: isMultiDay && multiDayWidth ? `${multiDayWidth}%` : "100%",
      }}
    >
      <EventItem
        event={activeEvent}
        view={activeView}
        isDragging={true}
        showTime={activeView !== "month"}
        currentTime={currentTime || undefined}
        isFirstDay={dragHandlePosition?.data?.isFirstDay !== false}
        isLastDay={dragHandlePosition?.data?.isLastDay !== false}
      />
    </div>
  );
};
EventDragOverlay.displayName = "EventDragOverlay";
