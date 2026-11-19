"use client";

import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { Button } from "@uiid/buttons";
import { XIcon } from "@uiid/icons/x";

import { useDrawerPending } from "../drawer-pending-context";

/**
 * The header close. It sits beside the title it would describe, so it's named
 * by `aria-label` alone and takes no `tooltip`.
 */
export const DrawerCloseButton = () => {
  const pending = useDrawerPending();

  return (
    <BaseDrawer.Close
      data-slot="drawer-close-button"
      aria-label="Close"
      render={<Button variant="ghost" shape="square" disabled={pending} />}
    >
      <XIcon />
    </BaseDrawer.Close>
  );
};
DrawerCloseButton.displayName = "DrawerCloseButton";
