"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cx, useComposedRefs, renderWithProps } from "@uiid/utils";

import {
  useSortableContext,
  SortableContentContext,
  SortableItemContext,
  SortableOverlayContext,
} from "../sortable.context";
import { CONTENT_NAME, ITEM_NAME, OVERLAY_NAME } from "../sortable.constants";
import type {
  SortableItemProps,
  SortableItemContextValue,
} from "../sortable.types";
import styles from "../sortable.module.css";

export const SortableItem = (props: SortableItemProps) => {
  const {
    value,
    style,
    asHandle,
    render,
    disabled,
    className,
    ref,
    children,
    ...itemProps
  } = props;

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

  const context = useSortableContext(ITEM_NAME);
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

  const computedClassName = cx(
    {
      // "touch-none select-none": asHandle,
      // "cursor-default": context.flatCursor,
      "data-dragging:cursor-grabbing": !context.flatCursor,
      "cursor-grab": !isDragging && asHandle && !context.flatCursor,
      "opacity-50": isDragging,
    },
    className,
  );

  return (
    <SortableItemContext.Provider value={itemContext}>
      {renderWithProps({
        render,
        children,
        fallbackElement: "div",
        props: {
          id,
          "data-slot": "sortable-item",
          "data-disabled": disabled ? "" : undefined,
          "data-dragging": isDragging ? "" : undefined,
          ...itemProps,
          ...(asHandle && !disabled ? attributes : {}),
          ...(asHandle && !disabled ? listeners : {}),
          ref: composedRef,
          style: composedStyle,
          className: cx(styles["sortable-item"], computedClassName),
        },
      })}
    </SortableItemContext.Provider>
  );
};
SortableItem.displayName = "SortableItem";
