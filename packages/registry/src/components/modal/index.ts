import { z } from "zod";

import type { ComponentEntry } from "../../types";

/**
 * Modal size variants.
 */
export const ModalSize = z.enum(["small", "medium", "large", "xlarge"]);

/**
 * Modal component props schema.
 * Dialog overlay with Card-like content structure.
 */
export const ModalPropsSchema = z.object({
  /** Modal content */
  children: z.any().optional(),
  /** Trigger element to open the modal */
  trigger: z.any().optional(),
  /** Modal title */
  title: z.any().optional(),
  /** Modal description */
  description: z.any().optional(),
  /** Action slot (typically buttons) */
  action: z.any().optional(),
  /** Icon component */
  icon: z.any().optional(),
  /** Footer slot */
  footer: z.any().optional(),
  /** Modal size */
  size: ModalSize.optional(),
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

export type ModalProps = z.infer<typeof ModalPropsSchema>;

export const ModalEntry: ComponentEntry<typeof ModalPropsSchema> = {
  name: "Modal",
  package: "@uiid/overlays",
  hasChildren: true,
  propsSchema: ModalPropsSchema,
  description: "Dialog overlay with Card-like content structure",
  category: "overlays",
  defaults: {
    size: "medium",
  },
};
