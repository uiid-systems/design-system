import { Drawer as BaseDrawer } from "vaul";

import { Text } from "@uiid/typography";

import type { DrawerProps } from "./drawer.types";
import styles from "./drawer.module.css";

export const Drawer = ({
  trigger,
  children,
  RootProps,
  TriggerProps,
  PortalProps,
  OverlayProps,
  ContentProps,
}: DrawerProps) => {
  return (
    <BaseDrawer.Root {...RootProps}>
      <BaseDrawer.Trigger {...TriggerProps}>{trigger}</BaseDrawer.Trigger>
      <BaseDrawer.Portal {...PortalProps}>
        <BaseDrawer.Overlay
          className={styles["drawer-overlay"]}
          {...OverlayProps}
        />
        <BaseDrawer.Content
          className={styles["drawer-content"]}
          {...ContentProps}
        >
          <BaseDrawer.Title asChild>
            <Text render={<h3 />} level={1} />
          </BaseDrawer.Title>
          <BaseDrawer.Description asChild>
            <Text render={<h4 />} level={0} />
          </BaseDrawer.Description>
          {children}
        </BaseDrawer.Content>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  );
};
Drawer.displayName = "Drawer";
