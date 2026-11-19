"use client";

import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { Button } from "@uiid/buttons";

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
      render={
        <Button variant="subtle" {...props} disabled={pending || disabled} />
      }
    >
      {children}
    </BaseDrawer.Close>
  );
};
DrawerClose.displayName = "DrawerClose";
