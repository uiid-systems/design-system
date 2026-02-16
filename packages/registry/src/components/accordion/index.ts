import { z } from "zod";

import type { ComponentEntry } from "../../types";
import { accordionPreviews } from "./previews";

/**
 * Accordion item schema.
 */
export const AccordionItemSchema = z.object({
  /** Unique value for the item */
  value: z.string(),
  /** Trigger text or content */
  trigger: z.string(),
  /** Panel content */
  content: z.string(),
  /** Disabled state */
  disabled: z.boolean().optional(),
});

/**
 * Accordion component props schema.
 */
export const AccordionPropsSchema = z.object({
  /** Accordion items */
  items: z.array(AccordionItemSchema),
  /** Expanded value(s) - controlled */
  value: z.union([z.string(), z.array(z.string())]).optional(),
  /** Default expanded value(s) - uncontrolled */
  defaultValue: z.union([z.string(), z.array(z.string())]).optional(),
  /** Allow multiple items open */
  multiple: z.boolean().optional(),
  /** Disabled state */
  disabled: z.boolean().optional(),
  /** Orientation */
  orientation: z.enum(["horizontal", "vertical"]).optional(),
  /** Full width */
  fullwidth: z.boolean().optional(),
});

export type AccordionProps = z.infer<typeof AccordionPropsSchema>;

export const AccordionEntry: ComponentEntry<typeof AccordionPropsSchema> = {
  name: "Accordion",
  package: "@uiid/interactive",
  hasChildren: false,
  propsSchema: AccordionPropsSchema,
  description: "Collapsible accordion panels for organizing content",
  category: "interactive",
  defaults: {
    orientation: "vertical",
  },
  previews: accordionPreviews,
  usage: "Use for collapsible content sections. Set multiple=true to allow multiple panels open simultaneously.",
};
