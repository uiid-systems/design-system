import { z } from "zod";

import type { ComponentEntry } from "../../types";
import { BoxPropsSchema } from "../box";

/**
 * Layer offset schema for positioned layers.
 */
export const LayerOffsetSchema = z.object({
  x: z.number().optional(),
  y: z.number().optional(),
});

/**
 * Layer component props schema.
 * Positioned layer with offset support, extends Box.
 */
export const LayerPropsSchema = BoxPropsSchema.extend({
  /** Position offset from parent */
  offset: LayerOffsetSchema.optional(),
});

export type LayerProps = z.infer<typeof LayerPropsSchema>;

export const LayerEntry: ComponentEntry<typeof LayerPropsSchema> = {
  name: "Layer",
  package: "@uiid/layout",
  hasChildren: true,
  propsSchema: LayerPropsSchema,
  description: "Positioned layer with offset support for overlays and positioned content",
  category: "layout",
  defaults: {},
};
