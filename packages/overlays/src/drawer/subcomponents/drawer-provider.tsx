"use client";

import { Drawer as BaseDrawer } from "@base-ui/react/drawer";

import type { DrawerProviderProps } from "../drawer.types";

/**
 * Opt-in. Wrap the app to enable the indent effect and nested-drawer
 * awareness. Not required for a standalone drawer.
 */
export const DrawerProvider = ({ children }: DrawerProviderProps) => {
  return <BaseDrawer.Provider>{children}</BaseDrawer.Provider>;
};
DrawerProvider.displayName = "DrawerProvider";
