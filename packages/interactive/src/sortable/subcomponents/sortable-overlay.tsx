"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  DragOverlay,
  type DropAnimation,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { cx } from "@uiid/utils";

import {
  useSortableContext,
  SortableOverlayContext,
} from "../sortable.context";
import { OVERLAY_NAME } from "../sortable.constants";
import type { SortableOverlayProps } from "../sortable.types";
import styles from "../sortable.module.css";

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

export const SortableOverlay = (props: SortableOverlayProps) => {
  const { container: containerProp, children, ...overlayProps } = props;

  const context = useSortableContext(OVERLAY_NAME);

  const [mounted, setMounted] = React.useState(false);

  React.useLayoutEffect(() => setMounted(true), []);

  const container =
    containerProp ?? (mounted ? globalThis.document?.body : null);

  if (!container) return null;

  return ReactDOM.createPortal(
    <DragOverlay
      dropAnimation={dropAnimation}
      modifiers={context.modifiers}
      className={cx(!context.flatCursor && styles["sortable-dragging"])}
      {...overlayProps}
    >
      <SortableOverlayContext.Provider value={true}>
        {context.activeId
          ? typeof children === "function"
            ? children({ value: context.activeId })
            : children
          : null}
      </SortableOverlayContext.Provider>
    </DragOverlay>,
    container,
  );
};
SortableOverlay.displayName = "SortableOverlay";
