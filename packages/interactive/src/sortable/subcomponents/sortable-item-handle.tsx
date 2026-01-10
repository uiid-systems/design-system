"use client";

import { cx, useComposedRefs, renderWithProps } from "@uiid/utils";

import { useSortableContext, useSortableItemContext } from "../sortable.context";
import { ITEM_HANDLE_NAME } from "../sortable.constants";
import type { SortableItemHandleProps } from "../sortable.types";

export const SortableItemHandle = (props: SortableItemHandleProps) => {
  const { render, disabled, className, ref, children, ...itemHandleProps } = props;

  const context = useSortableContext(ITEM_HANDLE_NAME);
  const itemContext = useSortableItemContext(ITEM_HANDLE_NAME);

  const isDisabled = disabled ?? itemContext.disabled;

  const composedRef = useComposedRefs(ref, (node: HTMLElement | null) => {
    if (!isDisabled) return;
    itemContext.setActivatorNodeRef(node);
  });

  const computedClassName = cx(
    "select-none disabled:pointer-events-none disabled:opacity-50",
    context.flatCursor
      ? "cursor-default"
      : "cursor-grab data-dragging:cursor-grabbing",
    className,
  );

  return renderWithProps({
    render,
    children,
    fallbackElement: "button",
    props: {
      type: "button",
      "aria-controls": itemContext.id,
      "data-disabled": isDisabled ? "" : undefined,
      "data-dragging": itemContext.isDragging ? "" : undefined,
      "data-slot": "sortable-item-handle",
      ...itemHandleProps,
      ...(isDisabled ? {} : itemContext.attributes),
      ...(isDisabled ? {} : itemContext.listeners),
      ref: composedRef,
      className: computedClassName,
      disabled: isDisabled,
    },
  });
};
SortableItemHandle.displayName = "SortableItemHandle";
