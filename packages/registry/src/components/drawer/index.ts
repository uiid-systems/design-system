import { z } from "zod";

import type { ComponentEntry } from "../../types";

/**
 * Drawer direction variants.
 */
export const DrawerDirection = z.enum(["top", "right", "bottom", "left"]);

/**
 * Drawer component props schema.
 * Bottom sheet with drag-to-close interaction.
 */
export const DrawerPropsSchema = z.object({
  /** Drawer content */
  children: z.any().optional(),
  /** Trigger element to open the drawer */
  trigger: z.any().optional(),
  /** Drawer title */
  title: z.string(),
  /** Direction from which drawer slides in */
  direction: DrawerDirection.optional(),
  /** Controlled open state */
  open: z.boolean().optional(),
  /** Default open state */
  defaultOpen: z.boolean().optional(),
  /** Open state change callback */
  onOpenChange: z.function().input(z.tuple([z.boolean()])).output(z.void()).optional(),
  /** Root drawer props */
  RootProps: z.any().optional(),
  /** Trigger props */
  TriggerProps: z.any().optional(),
  /** Content props */
  ContentProps: z.any().optional(),
});

export type DrawerProps = z.infer<typeof DrawerPropsSchema>;

export const DrawerEntry: ComponentEntry<typeof DrawerPropsSchema> = {
  name: "Drawer",
  package: "@uiid/overlays",
  hasChildren: true,
  propsSchema: DrawerPropsSchema,
  description: "Bottom sheet with drag-to-close interaction",
  category: "overlays",
  defaults: {
    direction: "bottom",
  },
};
