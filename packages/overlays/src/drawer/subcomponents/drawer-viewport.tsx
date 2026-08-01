"use client";

import { DrawerPreview as BaseDrawer } from "@base-ui/react/drawer";
import { cx } from "@uiid/utils";

import type { DrawerViewportProps } from "../drawer.types";

import styles from "../drawer.module.css";

/**
 * Positioning container for the popup. The edge placement lives here rather
 * than on the popup, whose `transform` is owned by the gesture system.
 */
export const DrawerViewport = ({
  className,
  children,
  ...props
}: DrawerViewportProps) => {
  return (
    <BaseDrawer.Viewport
      data-slot="drawer-viewport"
      className={cx(styles["drawer-viewport"], className)}
      {...props}
    >
      {children}
    </BaseDrawer.Viewport>
  );
};
DrawerViewport.displayName = "DrawerViewport";
