"use client";

import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { cxState, resolveTrigger } from "@uiid/utils";

import type { DrawerTriggerProps } from "../drawer.types";

import styles from "../drawer.module.css";

export const DrawerTrigger = ({
  children,
  className,
  render,
  nativeButton,
  ...props
}: DrawerTriggerProps) => {
  const resolved = resolveTrigger(children, render);

  return (
    <BaseDrawer.Trigger
      data-slot="drawer-trigger"
      className={cxState(styles["drawer-trigger"], className)}
      {...props}
      render={render ?? resolved.render}
      nativeButton={nativeButton ?? resolved.nativeButton}
    >
      {resolved.children}
    </BaseDrawer.Trigger>
  );
};
DrawerTrigger.displayName = "DrawerTrigger";
