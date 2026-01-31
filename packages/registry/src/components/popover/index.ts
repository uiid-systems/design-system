import { z } from "zod";

import type { ComponentEntry } from "../../types";

/**
 * Popover component props schema.
 * Floating card attached to a trigger element.
 */
export const PopoverPropsSchema = z.object({
  /** Popover content */
  children: z.any().optional(),
  /** Trigger element to open the popover */
  trigger: z.any().optional(),
  /** Popover title */
  title: z.any().optional(),
  /** Popover description */
  description: z.any().optional(),
  /** Action slot (typically buttons) */
  action: z.any().optional(),
  /** Icon component */
  icon: z.any().optional(),
  /** Footer slot */
  footer: z.any().optional(),
  /** Controlled open state */
  open: z.boolean().optional(),
  /** Open state change callback */
  onOpenChange: z.function().args(z.boolean()).returns(z.void()).optional(),
  /** Root popover props */
  RootProps: z.any().optional(),
  /** Trigger props */
  TriggerProps: z.any().optional(),
  /** Portal props */
  PortalProps: z.any().optional(),
  /** Backdrop props */
  BackdropProps: z.any().optional(),
  /** Positioner props */
  PositionerProps: z.any().optional(),
  /** Popup props */
  PopupProps: z.any().optional(),
});

export type PopoverProps = z.infer<typeof PopoverPropsSchema>;

export const PopoverEntry: ComponentEntry<typeof PopoverPropsSchema> = {
  name: "Popover",
  package: "@uiid/overlays",
  hasChildren: true,
  propsSchema: PopoverPropsSchema,
  description: "Floating card attached to a trigger element",
  category: "overlays",
  defaults: {},
};
