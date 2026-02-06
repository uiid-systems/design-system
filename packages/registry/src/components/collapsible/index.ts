import { z } from "zod";

import type { ComponentEntry } from "../../types";
import { collapsiblePreviews } from "./previews";

/**
 * Collapsible component props schema.
 * Expandable/collapsible content panel with trigger.
 */
export const CollapsiblePropsSchema = z.object({
  /** Content shown when expanded */
  children: z.any().optional(),
  /** Element that toggles the collapsible */
  trigger: z.any(),
  /** Skip animation and expand/collapse instantly */
  instant: z.boolean().optional(),
  /** Controlled open state */
  open: z.boolean().optional(),
  /** Default open state (uncontrolled) */
  defaultOpen: z.boolean().optional(),
  /** Open state change callback */
  onOpenChange: z
    .function()
    .input(z.tuple([z.boolean()]))
    .output(z.void())
    .optional(),
  /** Props forwarded to the root element */
  RootProps: z.record(z.string(), z.any()).optional(),
  /** Props forwarded to the trigger element */
  TriggerProps: z.record(z.string(), z.any()).optional(),
  /** Props forwarded to the panel element */
  PanelProps: z.record(z.string(), z.any()).optional(),
});

export type CollapsibleProps = z.infer<typeof CollapsiblePropsSchema>;

export const CollapsibleEntry: ComponentEntry<typeof CollapsiblePropsSchema> = {
  name: "Collapsible",
  package: "@uiid/interactive",
  hasChildren: true,
  propsSchema: CollapsiblePropsSchema,
  description:
    "Expandable content panel that can be toggled open or closed via a trigger element",
  category: "interactive",
  defaults: {
    instant: false,
  },
  previews: collapsiblePreviews,
  usage:
    "Use Collapsible to hide/show content. Pass the toggle element as trigger, content as children.",
};
