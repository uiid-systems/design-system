"use client";

import { isValidElement } from "react";
import { Drawer as BaseDrawer, type DialogProps } from "vaul";

import { Card } from "@uiid/cards";

import type { DrawerProps } from "./drawer.types";
import styles from "./drawer.module.css";

export const Drawer = ({
  trigger,
  direction = "right",
  title,
  children,
  RootProps,
  TriggerProps,
  ContentProps,
}: DrawerProps) => {
  const triggerIsEl = isValidElement(trigger);

  return (
    <BaseDrawer.Root direction={direction} {...(RootProps as DialogProps)}>
      <BaseDrawer.Trigger {...TriggerProps} asChild>
        <div tabIndex={triggerIsEl ? -1 : 0}>{trigger}</div>
      </BaseDrawer.Trigger>
      <BaseDrawer.Portal>
        <BaseDrawer.Overlay className={styles["drawer-overlay"]} />
        <BaseDrawer.Content
          aria-describedby={undefined} // vaul requirement, or add Drawer.Description support
          className={styles["drawer-content"]}
          {...ContentProps}
        >
          <Card
            uiid="drawer"
            title={title}
            renderTitle={<BaseDrawer.Title />}
            renderDismissButton={<BaseDrawer.Close />}
            fullwidth
            fullheight
          >
            {children}
          </Card>
        </BaseDrawer.Content>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  );
};
Drawer.displayName = "Drawer";
