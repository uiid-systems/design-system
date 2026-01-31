import { z } from "zod";

import {
  BorderPropsSchema,
  LayoutPropsSchema,
  SpacingPropsSchema,
} from "../../shared";
import type { ComponentEntry } from "../../types";

/**
 * Box variant props (toggle flags).
 */
export const BoxVariantsSchema = z.object({
  /** Distribute children evenly (flex: 1) */
  evenly: z.boolean().optional(),
  /** Set width to 100% */
  fullwidth: z.boolean().optional(),
  /** Set height to 100% */
  fullheight: z.boolean().optional(),
  /** Set width and height to 100vw/100vh */
  fullscreen: z.boolean().optional(),
});

/**
 * Box component props schema.
 * Generic flex container with layout, spacing, and border props.
 */
export const BoxPropsSchema = SpacingPropsSchema.merge(LayoutPropsSchema)
  .merge(BorderPropsSchema)
  .merge(BoxVariantsSchema);

export type BoxProps = z.infer<typeof BoxPropsSchema>;

export const BoxEntry: ComponentEntry<typeof BoxPropsSchema> = {
  name: "Box",
  package: "@uiid/layout",
  hasChildren: true,
  propsSchema: BoxPropsSchema,
  description: "Generic flex container with layout and spacing props",
  category: "layout",
  defaults: {},
};
