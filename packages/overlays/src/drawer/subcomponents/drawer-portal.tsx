"use client";

import { DrawerPreview as BaseDrawer } from "@base-ui/react/drawer";

import type { DrawerPortalProps } from "../drawer.types";

export const DrawerPortal = ({ children, ...props }: DrawerPortalProps) => {
  return (
    <BaseDrawer.Portal data-slot="drawer-portal" {...props}>
      {children}
    </BaseDrawer.Portal>
  );
};
DrawerPortal.displayName = "DrawerPortal";
