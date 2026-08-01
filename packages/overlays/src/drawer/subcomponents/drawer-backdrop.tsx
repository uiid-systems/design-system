"use client";

import { DrawerPreview as BaseDrawer } from "@base-ui/react/drawer";
import { cx } from "@uiid/utils";

import type { DrawerBackdropProps } from "../drawer.types";

import styles from "../drawer.module.css";

export const DrawerBackdrop = ({
  className,
  ...props
}: DrawerBackdropProps) => {
  return (
    <BaseDrawer.Backdrop
      data-slot="drawer-backdrop"
      className={cx(styles["drawer-backdrop"], className)}
      {...props}
    />
  );
};
DrawerBackdrop.displayName = "DrawerBackdrop";
