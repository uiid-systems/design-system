"use client";

import { useDroppable, type UniqueIdentifier } from "@dnd-kit/core";

import { Stack, type StackProps } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { useEventCalendarDnd } from "../event-calendar.hooks";
import type { DropTargetData } from "../event-calendar.types";

import styles from "../event-calendar.module.css";

type DroppableCellProps = DropTargetData &
  Omit<StackProps, "id"> & {
    id: UniqueIdentifier;
  };

export const DroppableCell = ({
  id,
  date,
  time,
  className,
  children,
  ...props
}: DroppableCellProps) => {
  const { activeEvent } = useEventCalendarDnd();

  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      date,
      time,
    },
  });

  return (
    <Stack
      ref={setNodeRef}
      data-dragging={isOver && activeEvent ? true : undefined}
      className={cx(styles["droppable-cell"], className)}
      fullheight
      {...props}
    >
      {children}
    </Stack>
  );
};
DroppableCell.displayName = "DroppableCell";
