import { z } from "zod";

import type { ComponentEntry } from "../../types";

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

export const TooltipEntry: ComponentEntry<typeof TooltipPropsSchema> = {
  name: "Tooltip",
  package: "@uiid/overlays",
  hasChildren: true,
  propsSchema: TooltipPropsSchema,
  description: "Informational popup shown on hover or focus",
  category: "overlays",
  defaults: {},
};
