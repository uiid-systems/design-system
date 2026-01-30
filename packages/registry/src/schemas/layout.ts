import { z } from "zod";

import {
  BorderPropsSchema,
  LayoutPropsSchema,
  Shade,
  SpacingPropsSchema,
} from "./shared";

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

/**
 * Stack component props schema.
 * Vertical flex layout (column direction by default).
 * Note: ax/ay semantics are swapped from Box (ax controls vertical, ay controls horizontal).
 */
export const StackPropsSchema = BoxPropsSchema;

export type StackProps = z.infer<typeof StackPropsSchema>;

/**
 * Group component props schema.
 * Horizontal flex layout (row direction by default).
 */
export const GroupPropsSchema = BoxPropsSchema;

export type GroupProps = z.infer<typeof GroupPropsSchema>;

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

/**
 * Separator orientation values.
 */
export const SeparatorOrientation = z.enum(["horizontal", "vertical"]);

/**
 * Separator component props schema.
 * Visual divider with orientation and shade variants.
 */
export const SeparatorPropsSchema = SpacingPropsSchema.extend({
  /** Separator direction */
  orientation: SeparatorOrientation.optional(),
  /** Color shade */
  shade: Shade.optional(),
});

export type SeparatorProps = z.infer<typeof SeparatorPropsSchema>;
