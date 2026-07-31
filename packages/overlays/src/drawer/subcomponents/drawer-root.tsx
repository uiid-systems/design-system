"use client";

import { DrawerPreview as BaseDrawer } from "@base-ui/react/drawer";

import type { DrawerRootProps } from "../drawer.types";

/** Groups all parts of the drawer. Renders no element of its own. */
export const DrawerRoot = ({ children, ...props }: DrawerRootProps) => {
  return <BaseDrawer.Root {...props}>{children}</BaseDrawer.Root>;
};
DrawerRoot.displayName = "DrawerRoot";
