"use client";

import { Drawer as BaseDrawer } from "@base-ui/react/drawer";

import type { DrawerCloseProps } from "../drawer.types";

export const DrawerClose = ({ children, ...props }: DrawerCloseProps) => {
  return (
    <BaseDrawer.Close data-slot="drawer-close" {...props}>
      {children}
    </BaseDrawer.Close>
  );
};
DrawerClose.displayName = "DrawerClose";
