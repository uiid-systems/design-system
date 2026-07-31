import { z } from "zod";

import type { ComponentEntry } from "../../types";

/**
 * Swipe direction — the edge the drawer is anchored to, and the
 * direction a swipe dismisses it.
 */
export const DrawerSwipeDirection = z.enum(["up", "down", "left", "right"]);

/**
 * Drawer component props schema.
 * Edge-anchored panel with swipe-to-dismiss and snap points.
 */
export const DrawerPropsSchema = z.object({
  /** Drawer content */
  children: z.any().optional(),
  /** Trigger element to open the drawer */
  trigger: z.any().optional(),
  /** Drawer title */
  title: z.any().optional(),
  /** Drawer description */
  description: z.any().optional(),
  /** Action slot (typically buttons) */
  action: z.any().optional(),
  /** Icon component */
  icon: z.any().optional(),
  /** Footer slot */
  footer: z.any().optional(),
  /** Edge the drawer is anchored to, and the swipe direction that dismisses it */
  swipeDirection: DrawerSwipeDirection.optional(),
  /** Snap positions — 0–1 as viewport fractions, >1 as pixels, or CSS lengths */
  snapPoints: z.array(z.union([z.number(), z.string()])).optional(),
  /** Whether the drawer traps focus and blocks the page */
  modal: z.union([z.boolean(), z.literal("trap-focus")]).optional(),
  /** Controlled open state */
  open: z.boolean().optional(),
  /** Open state change callback */
  onOpenChange: z.function().input(z.tuple([z.boolean()])).output(z.void()).optional(),
  /** Root props */
  RootProps: z.any().optional(),
  /** Trigger props */
  TriggerProps: z.any().optional(),
  /** Portal props */
  PortalProps: z.any().optional(),
  /** Backdrop props */
  BackdropProps: z.any().optional(),
  /** Viewport props */
  ViewportProps: z.any().optional(),
  /** Popup props */
  PopupProps: z.any().optional(),
  /** Content props */
  ContentProps: z.any().optional(),
});

export type DrawerProps = z.infer<typeof DrawerPropsSchema>;

export const DrawerEntry: ComponentEntry<typeof DrawerPropsSchema> = {
  name: "Drawer",
  package: "@uiid/overlays",
  hasChildren: true,
  propsSchema: DrawerPropsSchema,
  description: "Edge-anchored panel with swipe-to-dismiss and snap points",
  category: "overlays",
  defaults: {
    swipeDirection: "down",
  },
  libs: ["base-ui"],
};
