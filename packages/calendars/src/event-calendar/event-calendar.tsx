"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDays,
  addHours,
  addMonths,
  addWeeks,
  // endOfWeek,
  format,
  // isSameMonth,
  // startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";

import { Group, Stack } from "@uiid/layout";
import { useToastManager } from "@uiid/overlays";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuShortcut,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

import { EventCalendarDndProvider } from "./event-calendar.context";
import type { CalendarEvent, CalendarView } from "./event-calendar.types";
import { MonthView, EventCalendarHeader } from "./subcomponents";

export interface EventCalendarProps {
  events?: CalendarEvent[];
  onEventAdd?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  className?: string;
  initialView?: CalendarView;
}

export function EventCalendar({
  events = [],
  // onEventAdd,
  onEventUpdate,
  //
  className,
  initialView = "month",
}: EventCalendarProps) {
  const toast = useToastManager();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>(initialView);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );

  // Add keyboard shortcuts for view switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input, textarea or contentEditable element
      // or if the event dialog is open
      if (
        isEventDialogOpen ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "m":
          setView("month");
          break;
        case "w":
          setView("week");
          break;
        case "d":
          setView("day");
          break;
        case "a":
          setView("agenda");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEventDialogOpen]);

  const handlePrevious = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, -1));
    } else if (view === "agenda") {
      // For agenda view, go back 30 days (a full month)
      // setCurrentDate(addDays(currentDate, -AgendaDaysToShow))
    }
  };

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, 1));
    } else if (view === "agenda") {
      // For agenda view, go forward 30 days (a full month)
      // setCurrentDate(addDays(currentDate, AgendaDaysToShow))
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
    console.log("Event selected:", selectedEvent); // Debug log
  };

  const handleEventCreate = (startTime: Date) => {
    console.log("Creating new event at:", startTime); // Debug log

    // Snap to 15-minute intervals
    const minutes = startTime.getMinutes();
    const remainder = minutes % 15;
    if (remainder !== 0) {
      if (remainder < 7.5) {
        // Round down to nearest 15 min
        startTime.setMinutes(minutes - remainder);
      } else {
        // Round up to nearest 15 min
        startTime.setMinutes(minutes + (15 - remainder));
      }
      startTime.setSeconds(0);
      startTime.setMilliseconds(0);
    }

    const newEvent: CalendarEvent = {
      id: "",
      title: "",
      start: startTime,
      end: addHours(startTime, 1),
      allDay: false,
    };
    setSelectedEvent(newEvent);
    setIsEventDialogOpen(true);
  };

  // const handleEventSave = (event: CalendarEvent) => {
  //   if (event.id) {
  //     onEventUpdate?.(event);
  //     // Show toast notification when an event is updated
  //     toast.add({
  //       title: `Event "${event.title}" updated`,
  //       description: format(new Date(event.start), "MMM d, yyyy"),
  //     });
  //   } else {
  //     onEventAdd?.({
  //       ...event,
  //       id: Math.random().toString(36).substring(2, 11),
  //     });
  //     // Show toast notification when an event is added
  //     toast.add({
  //       title: `Event "${event.title}" added`,
  //       description: format(new Date(event.start), "MMM d, yyyy"),
  //     });
  //   }
  //   setIsEventDialogOpen(false);
  //   setSelectedEvent(null);
  // };

  // const handleEventDelete = (eventId: string) => {
  //   const deletedEvent = events.find((e) => e.id === eventId);
  //   onEventDelete?.(eventId);
  //   setIsEventDialogOpen(false);
  //   setSelectedEvent(null);

  //   // Show toast notification when an event is deleted
  //   if (deletedEvent) {
  //     toast.add({
  //       title: `Event "${deletedEvent.title}" deleted`,
  //       description: format(new Date(deletedEvent.start), "MMM d, yyyy"),
  //     });
  //   }
  // };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    onEventUpdate?.(updatedEvent);

    // Show toast notification when an event is updated via drag and drop
    toast.add({
      title: `Event "${updatedEvent.title}" moved`,
      description: format(new Date(updatedEvent.start), "MMM d, yyyy"),
    });
  };

  const viewTitle = useMemo(() => {
    if (view === "month") {
      return format(currentDate, "MMMM yyyy");
    } else if (view === "week") {
      // const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      // const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      // if (isSameMonth(start, end)) {
      //   return format(start, "MMMM yyyy");
      // } else {
      //   return `${format(start, "MMM")} - ${format(end, "MMM yyyy")}`;
      // }
    } else if (view === "day") {
      // return (
      //   <>
      //     <span className="min-[480px]:hidden" aria-hidden="true">
      //       {format(currentDate, "MMM d, yyyy")}
      //     </span>
      //     <span className="max-[479px]:hidden min-md:hidden" aria-hidden="true">
      //       {format(currentDate, "MMMM d, yyyy")}
      //     </span>
      //     <span className="max-md:hidden">
      //       {format(currentDate, "EEE MMMM d, yyyy")}
      //     </span>
      //   </>
      // );
    } else if (view === "agenda") {
      // Show the month range for agenda view
      // const start = currentDate;
      // const end = addDays(currentDate, AgendaDaysToShow - 1);
      // if (isSameMonth(start, end)) {
      //   return format(start, "MMMM yyyy");
      // } else {
      //   return `${format(start, "MMM")} - ${format(end, "MMM yyyy")}`;
      // }
    } else {
      return format(currentDate, "MMMM yyyy");
    }
  }, [currentDate, view]);

  return (
    <Stack fullwidth ax="stretch">
      <EventCalendarDndProvider onEventUpdate={handleEventUpdate}>
        <Group ay="center" ax="space-between" p={4} className={className}>
          <EventCalendarHeader
            handleToday={handleToday}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            viewTitle={viewTitle}
          />
          {/* <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1.5 max-[479px]:h-8">
                  <span>
                    <span className="min-[480px]:hidden" aria-hidden="true">
                      {view.charAt(0).toUpperCase()}
                    </span>
                    <span className="max-[479px]:sr-only">
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </span>
                  </span>
                  <ChevronDownIcon
                    className="-me-1 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-32">
                <DropdownMenuItem onClick={() => setView("month")}>
                  Month <DropdownMenuShortcut>M</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setView("week")}>
                  Week <DropdownMenuShortcut>W</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setView("day")}>
                  Day <DropdownMenuShortcut>D</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setView("agenda")}>
                  Agenda <DropdownMenuShortcut>A</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              className="max-[479px]:aspect-square max-[479px]:p-0!"
              onClick={() => {
                setSelectedEvent(null); // Ensure we're creating a new event
                setIsEventDialogOpen(true);
              }}
            >
              <PlusIcon
                className="opacity-60 sm:-ms-1"
                size={16}
                aria-hidden="true"
              />
              <span className="max-sm:sr-only">New event</span>
            </Button>
          </div> */}
        </Group>

        <Stack style={{ flex: 1 }}>
          {view === "month" && (
            <MonthView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
            />
          )}
          {/* {view === "week" && (
            <WeekView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
            />
          )}
          {view === "day" && (
            <DayView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
            />
          )}
          {view === "agenda" && (
            <AgendaView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
            />
          )} */}
        </Stack>
      </EventCalendarDndProvider>
    </Stack>
  );
}
