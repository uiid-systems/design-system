import { Drawer as BaseDrawer } from "vaul";
import type { DialogProps } from "vaul";

import type { DrawerProps } from "./drawer.types";
import styles from "./drawer.module.css";

export const Drawer = ({
  trigger,
  direction,
  title,
  description,
  children,
  RootProps,
  TriggerProps,
  ContentProps,
}: DrawerProps) => {
  return (
    <BaseDrawer.Root direction={direction} {...(RootProps as DialogProps)}>
      <BaseDrawer.Trigger {...TriggerProps}>{trigger}</BaseDrawer.Trigger>
      <BaseDrawer.Portal>
        <BaseDrawer.Overlay className={styles["drawer-overlay"]} />
        <BaseDrawer.Content
          className={styles["drawer-content"]}
          {...ContentProps}
        >
          <BaseDrawer.Title>{title}</BaseDrawer.Title>
          <BaseDrawer.Description>{description}</BaseDrawer.Description>
          {children}
        </BaseDrawer.Content>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  );
};
Drawer.displayName = "Drawer";
