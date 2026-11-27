import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";
import { cx } from "@uiid/utils";

import type { ContextMenuTriggerProps } from "../context-menu.types";

import styles from "../context-menu.module.css";

/**
 * Base UI's trigger renders a `<div>` around the area. That `<div>` takes
 * `display: contents`, so it draws no box and the area keeps its own size in
 * its parent's layout. With `render`, the trigger is the rendered element
 * itself, which keeps its own box, so the class is left off it.
 */
export const ContextMenuTrigger = ({
  className,
  render,
  ...props
}: ContextMenuTriggerProps) => {
  return (
    <BaseContextMenu.Trigger
      data-slot="context-menu-trigger"
      render={render}
      className={cx(!render && styles["trigger"], className)}
      {...props}
    />
  );
};
ContextMenuTrigger.displayName = "ContextMenuTrigger";
