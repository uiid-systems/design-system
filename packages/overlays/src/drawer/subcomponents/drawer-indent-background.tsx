"use client";

import { DrawerPreview as BaseDrawer } from "@base-ui/react/drawer";

import type { DrawerIndentBackgroundProps } from "../drawer.types";

/** Sits behind the indented app UI so the scaled-down page reveals a backdrop. */
export const DrawerIndentBackground = (props: DrawerIndentBackgroundProps) => {
  return (
    <BaseDrawer.IndentBackground
      data-slot="drawer-indent-background"
      {...props}
    />
  );
};
DrawerIndentBackground.displayName = "DrawerIndentBackground";
