"use client";

import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { cxState } from "@uiid/utils";
import { isValidElement } from "react";

import type { DrawerTriggerProps } from "../drawer.types";

import styles from "../drawer.module.css";

export const DrawerTrigger = ({
  children,
  className,
  ...props
}: DrawerTriggerProps) => {
  const triggerIsEl = isValidElement(children);

  return (
    <BaseDrawer.Trigger
      data-slot="drawer-trigger"
      className={cxState(styles["drawer-trigger"], className)}
      nativeButton={triggerIsEl}
      render={
        triggerIsEl ? (
          children
        ) : (
          <span role="button" tabIndex={0}>
            {children}
          </span>
        )
      }
      {...props}
    />
  );
};
DrawerTrigger.displayName = "DrawerTrigger";
