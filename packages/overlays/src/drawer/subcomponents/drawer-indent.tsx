"use client";

import { DrawerPreview as BaseDrawer } from "@base-ui/react/drawer";

import type { DrawerIndentProps } from "../drawer.types";

/** Wraps the app UI. Gains `data-active` while any drawer in the provider is open. */
export const DrawerIndent = ({ children, ...props }: DrawerIndentProps) => {
  return (
    <BaseDrawer.Indent data-slot="drawer-indent" {...props}>
      {children}
    </BaseDrawer.Indent>
  );
};
DrawerIndent.displayName = "DrawerIndent";
