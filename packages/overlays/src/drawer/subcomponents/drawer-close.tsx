"use client";

import { Drawer as BaseDrawer } from "@base-ui/react/drawer";

import { useDrawerPending } from "../drawer-pending-context";
import type { DrawerCloseProps } from "../drawer.types";

export const DrawerClose = ({
  children,
  disabled,
  ...props
}: DrawerCloseProps) => {
  const pending = useDrawerPending();

  return (
    <BaseDrawer.Close
      data-slot="drawer-close"
      disabled={pending || disabled}
      {...props}
    >
      {children}
    </BaseDrawer.Close>
  );
};
DrawerClose.displayName = "DrawerClose";
