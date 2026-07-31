"use client";

import { DrawerPreview as BaseDrawer } from "@base-ui/react/drawer";

import type { DrawerContentProps } from "../drawer.types";

/**
 * Wraps the drawer body. Lets a mouse user select text inside the drawer
 * without the drag starting a swipe.
 */
export const DrawerContent = ({ children, ...props }: DrawerContentProps) => {
  return (
    <BaseDrawer.Content data-slot="drawer-content" {...props}>
      {children}
    </BaseDrawer.Content>
  );
};
DrawerContent.displayName = "DrawerContent";
