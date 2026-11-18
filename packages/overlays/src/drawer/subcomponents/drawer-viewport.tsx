"use client";

import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { cxState } from "@uiid/utils";

import type { DrawerViewportProps } from "../drawer.types";

import styles from "../drawer.module.css";

/**
 * Fixed full-screen layer the popup is inset against. Placing the popup with
 * insets rather than a transform frees the popup's own `transform` for the
 * drag, which the gesture system writes to.
 */
export const DrawerViewport = ({
  className,
  children,
  ...props
}: DrawerViewportProps) => {
  return (
    <BaseDrawer.Viewport
      data-slot="drawer-viewport"
      className={cxState(styles["drawer-viewport"], className)}
      {...props}
    >
      {children}
    </BaseDrawer.Viewport>
  );
};
DrawerViewport.displayName = "DrawerViewport";
