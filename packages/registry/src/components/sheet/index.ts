import { z } from "zod";

import type { ComponentEntry } from "../../types";

/**
 * Sheet side variants.
 */
export const SheetSide = z.enum(["top", "right", "bottom", "left"]);

/**
 * Sheet component props schema.
 * Slide-in panel overlay from any edge.
 */
export const SheetPropsSchema = z.object({
  /** Sheet content */
  children: z.any().optional(),
  /** Trigger element to open the sheet */
  trigger: z.any().optional(),
  /** Sheet title */
  title: z.any().optional(),
  /** Sheet description */
  description: z.any().optional(),
  /** Action slot (typically buttons) */
  action: z.any().optional(),
  /** Icon component */
  icon: z.any().optional(),
  /** Footer slot */
  footer: z.any().optional(),
  /** Side from which sheet slides in */
  side: SheetSide.optional(),
  /** Controlled open state */
  open: z.boolean().optional(),
  /** Open state change callback */
  onOpenChange: z.function().args(z.boolean()).returns(z.void()).optional(),
  /** Root dialog props */
  RootProps: z.any().optional(),
  /** Trigger props */
  TriggerProps: z.any().optional(),
  /** Portal props */
  PortalProps: z.any().optional(),
  /** Backdrop props */
  BackdropProps: z.any().optional(),
  /** Popup props */
  PopupProps: z.any().optional(),
});

export type SheetProps = z.infer<typeof SheetPropsSchema>;

export const SheetEntry: ComponentEntry<typeof SheetPropsSchema> = {
  name: "Sheet",
  package: "@uiid/overlays",
  hasChildren: true,
  propsSchema: SheetPropsSchema,
  description: "Slide-in panel overlay from any edge of the screen",
  category: "overlays",
  defaults: {
    side: "right",
  },
};
