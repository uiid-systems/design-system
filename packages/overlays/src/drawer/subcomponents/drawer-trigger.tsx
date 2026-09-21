"use client";

import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { cxState, resolveTrigger } from "@uiid/utils";

import type { DrawerTriggerProps } from "../drawer.types";

import styles from "../drawer.module.css";

export const DrawerTrigger = ({
  children,
  className,
  ...props
}: DrawerTriggerProps) => (
  <BaseDrawer.Trigger
    data-slot="drawer-trigger"
    className={cxState(styles["drawer-trigger"], className)}
    {...resolveTrigger(children, props.render)}
    {...props}
  />
);
DrawerTrigger.displayName = "DrawerTrigger";
