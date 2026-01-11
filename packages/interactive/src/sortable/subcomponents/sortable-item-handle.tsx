"use client";

import { cx, useComposedRefs } from "@uiid/utils";

import { useSortableItemContext } from "../sortable.context";
import { ITEM_HANDLE_NAME } from "../sortable.constants";
import type { SortableItemHandleProps } from "../sortable.types";
import styles from "../sortable.module.css";

export const SortableItemHandle = ({
  disabled,
  className,
  ref,
  children,
  ...props
}: SortableItemHandleProps) => {
  const itemContext = useSortableItemContext(ITEM_HANDLE_NAME);

  const isDisabled = disabled ?? itemContext.disabled;

  const composedRef = useComposedRefs(ref, (node: HTMLElement | null) => {
    if (isDisabled) return;
    itemContext.setActivatorNodeRef(node);
  });

  return (
    <button
      type="button"
      aria-controls={itemContext.id}
      data-slot="sortable-item-handle"
      data-disabled={isDisabled ? "" : undefined}
      data-dragging={itemContext.isDragging ? "" : undefined}
      ref={composedRef}
      className={cx(styles["sortable-item-handle"], className)}
      disabled={isDisabled}
      {...(isDisabled ? {} : itemContext.attributes)}
      {...(isDisabled ? {} : itemContext.listeners)}
      {...props}
    >
      {children}
    </button>
  );
};
SortableItemHandle.displayName = "SortableItemHandle";
