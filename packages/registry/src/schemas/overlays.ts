import { z } from "zod";

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

export type ModalProps = z.infer<typeof ModalPropsSchema>;

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
  onOpenChange: z.function().args(z.boolean()).returns(z.void()).optional(),
  /** Root drawer props */
  RootProps: z.any().optional(),
  /** Trigger props */
  TriggerProps: z.any().optional(),
  /** Content props */
  ContentProps: z.any().optional(),
});

export type DrawerProps = z.infer<typeof DrawerPropsSchema>;

/**
 * Tooltip component props schema.
 * Informational popup on hover/focus.
 */
export const TooltipPropsSchema = z.object({
  /** Tooltip content */
  children: z.any().optional(),
  /** Trigger element */
  trigger: z.any(),
  /** Delay before showing tooltip (ms) */
  delay: z.number().optional(),
  /** Controlled open state */
  open: z.boolean().optional(),
  /** Open state change callback */
  onOpenChange: z.function().args(z.boolean()).returns(z.void()).optional(),
  /** Provider props */
  ProviderProps: z.any().optional(),
  /** Root tooltip props */
  RootProps: z.any().optional(),
  /** Trigger props */
  TriggerProps: z.any().optional(),
  /** Portal props */
  PortalProps: z.any().optional(),
  /** Positioner props */
  PositionerProps: z.any().optional(),
  /** Popup props */
  PopupProps: z.any().optional(),
});

export type TooltipProps = z.infer<typeof TooltipPropsSchema>;

/**
 * Toaster position variants.
 */
export const ToasterPosition = z.enum(["top", "bottom"]);

/**
 * Toaster component props schema.
 * Container for toast notifications.
 */
export const ToasterPropsSchema = z.object({
  /** Position of the toaster */
  position: ToasterPosition.optional(),
});

export type ToasterProps = z.infer<typeof ToasterPropsSchema>;
