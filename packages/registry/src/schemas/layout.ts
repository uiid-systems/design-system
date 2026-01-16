import { z } from "zod";

import type { ComponentEntry } from "../types";

import { LayoutPropsSchema, Shade, SpacingPropsSchema } from "./shared";

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
 * Generic flex container with layout and spacing props.
 */
export const BoxPropsSchema = SpacingPropsSchema.merge(LayoutPropsSchema).merge(
  BoxVariantsSchema
);

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

/**
 * Stack component props schema.
 * Vertical flex layout (column direction by default).
 * Note: ax/ay semantics are swapped from Box (ax controls vertical, ay controls horizontal).
 */
export const StackPropsSchema = BoxPropsSchema;

export type StackProps = z.infer<typeof StackPropsSchema>;

export const StackEntry: ComponentEntry<typeof StackPropsSchema> = {
  name: "Stack",
  package: "@uiid/layout",
  hasChildren: true,
  propsSchema: StackPropsSchema,
  description:
    "Vertical flex layout (column). ax controls vertical alignment, ay controls horizontal",
  category: "layout",
  defaults: {},
};

/**
 * Group component props schema.
 * Horizontal flex layout (row direction by default).
 */
export const GroupPropsSchema = BoxPropsSchema;

export type GroupProps = z.infer<typeof GroupPropsSchema>;

export const GroupEntry: ComponentEntry<typeof GroupPropsSchema> = {
  name: "Group",
  package: "@uiid/layout",
  hasChildren: true,
  propsSchema: GroupPropsSchema,
  description:
    "Horizontal flex layout (row). ax controls horizontal alignment, ay controls vertical",
  category: "layout",
  defaults: {},
};

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

export const SeparatorEntry: ComponentEntry<typeof SeparatorPropsSchema> = {
  name: "Separator",
  package: "@uiid/layout",
  hasChildren: false,
  propsSchema: SeparatorPropsSchema,
  description: "Visual divider line with horizontal or vertical orientation",
  category: "layout",
  defaults: {
    orientation: "horizontal",
  },
};

