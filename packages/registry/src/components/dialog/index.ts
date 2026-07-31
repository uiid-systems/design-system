import { z } from "zod";

import type { ComponentEntry } from "../../types";

/**
 * Dialog size variants.
 */
export const DialogSize = z.enum(["small", "medium", "large", "xlarge"]);

/**
 * Dialog component props schema.
 * Centered dialog overlay with Card-like content structure.
 */
export const DialogPropsSchema = z.object({
  /** Dialog content */
  children: z.any().optional(),
  /** Trigger element to open the dialog */
  trigger: z.any().optional(),
  /** Dialog title */
  title: z.any().optional(),
  /** Dialog description */
  description: z.any().optional(),
  /** Action slot (typically buttons) */
  action: z.any().optional(),
  /** Icon component */
  icon: z.any().optional(),
  /** Footer slot */
  footer: z.any().optional(),
  /** Dialog size */
  size: DialogSize.optional(),
  /** Controlled open state */
  open: z.boolean().optional(),
  /** Open state change callback */
  onOpenChange: z.function().input(z.tuple([z.boolean()])).output(z.void()).optional(),
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

export type DialogProps = z.infer<typeof DialogPropsSchema>;

export const DialogEntry: ComponentEntry<typeof DialogPropsSchema> = {
  name: "Dialog",
  package: "@uiid/overlays",
  hasChildren: true,
  propsSchema: DialogPropsSchema,
  description: "Centered dialog overlay with Card-like content structure",
  category: "overlays",
  defaults: {
    size: "medium",
  },
  libs: ["base-ui"],
};
