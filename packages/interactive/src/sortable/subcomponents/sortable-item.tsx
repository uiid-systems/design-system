"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cx, useComposedRefs } from "@uiid/utils";

import {
  SortableContentContext,
  SortableItemContext,
  SortableOverlayContext,
} from "../sortable.context";
import { CONTENT_NAME, ITEM_NAME, OVERLAY_NAME } from "../sortable.constants";
import type { SortableItemProps, SortableItemContextValue } from "../sortable.types";
import styles from "../sortable.module.css";

export const SortableItem = ({
  value,
  style,
  asHandle,
  disabled,
  className,
  ref,
  children,
  ...props
}: SortableItemProps) => {
  const inSortableContent = React.useContext(SortableContentContext);
  const inSortableOverlay = React.useContext(SortableOverlayContext);

  if (!inSortableContent && !inSortableOverlay) {
    throw new Error(
      `\`${ITEM_NAME}\` must be used within \`${CONTENT_NAME}\` or \`${OVERLAY_NAME}\``,
    );
  }

  if (value === "") {
    throw new Error(`\`${ITEM_NAME}\` value cannot be an empty string`);
  }

  const id = React.useId();
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: value, disabled });

  const composedRef = useComposedRefs(ref, (node: HTMLElement | null) => {
    if (disabled) return;
    setNodeRef(node);
    if (asHandle) setActivatorNodeRef(node);
  });

  const composedStyle = React.useMemo<React.CSSProperties>(() => {
    return {
      transform: CSS.Translate.toString(transform),
      transition,
      ...style,
    };
  }, [transform, transition, style]);

  const itemContext = React.useMemo<SortableItemContextValue>(
    () => ({
      id,
      attributes,
      listeners,
      setActivatorNodeRef,
      isDragging,
      disabled,
    }),
    [id, attributes, listeners, setActivatorNodeRef, isDragging, disabled],
  );

  return (
    <SortableItemContext.Provider value={itemContext}>
      <div
        id={id}
        data-slot="sortable-item"
        data-disabled={disabled ? "" : undefined}
        data-dragging={isDragging ? "" : undefined}
        ref={composedRef}
        style={composedStyle}
        className={cx(styles["sortable-item"], className)}
        {...(asHandle && !disabled ? attributes : {})}
        {...(asHandle && !disabled ? listeners : {})}
        {...props}
      >
        {children}
      </div>
    </SortableItemContext.Provider>
  );
};
SortableItem.displayName = "SortableItem";
