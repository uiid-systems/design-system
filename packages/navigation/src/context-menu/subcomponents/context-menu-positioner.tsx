import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";
import { cx } from "@uiid/utils";

import type { ContextMenuPositionerProps } from "../context-menu.types";

import styles from "../context-menu.module.css";

/**
 * Places the popup at the pointer, with Base UI's own offsets for a context
 * menu, and keeps it 16px clear of the viewport edges as `MenuPositioner` does.
 */
export const ContextMenuPositioner = ({
  className,
  children,
  ...props
}: ContextMenuPositionerProps) => {
  return (
    <BaseContextMenu.Positioner
      data-slot="context-menu-positioner"
      className={cx(styles["positioner"], className)}
      collisionPadding={16}
      {...props}
    >
      {children}
    </BaseContextMenu.Positioner>
  );
};
ContextMenuPositioner.displayName = "ContextMenuPositioner";
