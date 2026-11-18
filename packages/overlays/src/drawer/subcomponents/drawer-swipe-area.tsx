"use client";

import { Drawer as BaseDrawer } from "@base-ui/react/drawer";

import type { DrawerSwipeAreaProps } from "../drawer.types";

/**
 * An invisible area that opens the drawer on a swipe, from the edge the drawer
 * enters from. Unstyled: place and size it yourself, such as a narrow strip
 * fixed to that edge. Render it inside `DrawerRoot`, outside the portal.
 */
export const DrawerSwipeArea = (props: DrawerSwipeAreaProps) => {
  return <BaseDrawer.SwipeArea data-slot="drawer-swipe-area" {...props} />;
};
DrawerSwipeArea.displayName = "DrawerSwipeArea";
