import { z } from "zod";

import type { ComponentEntry } from "../../types";

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

export const ToasterEntry: ComponentEntry<typeof ToasterPropsSchema> = {
  name: "Toaster",
  package: "@uiid/overlays",
  hasChildren: false,
  propsSchema: ToasterPropsSchema,
  description: "Container for toast notifications",
  category: "overlays",
  defaults: {
    position: "bottom",
  },
};
