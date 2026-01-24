import { z } from "zod";

import type { ComponentEntry, PreviewConfig } from "../types";

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

const stackPreviews: PreviewConfig[] = [
  {
    label: "Gap sizes",
    tree: {
      root: "outer",
      elements: {
        outer: { key: "outer", type: "Group", props: { gap: 8 }, children: ["s2", "s4", "s8"] },
        s2: { key: "s2", type: "Stack", props: { gap: 2, p: 4, bordered: true }, children: ["s2a", "s2b", "s2c"] },
        s2a: { key: "s2a", type: "Text", props: { children: "gap=2" }, parentKey: "s2" },
        s2b: { key: "s2b", type: "Button", props: { children: "A", size: "small" }, parentKey: "s2" },
        s2c: { key: "s2c", type: "Button", props: { children: "B", size: "small" }, parentKey: "s2" },
        s4: { key: "s4", type: "Stack", props: { gap: 4, p: 4, bordered: true }, children: ["s4a", "s4b", "s4c"] },
        s4a: { key: "s4a", type: "Text", props: { children: "gap=4" }, parentKey: "s4" },
        s4b: { key: "s4b", type: "Button", props: { children: "A", size: "small" }, parentKey: "s4" },
        s4c: { key: "s4c", type: "Button", props: { children: "B", size: "small" }, parentKey: "s4" },
        s8: { key: "s8", type: "Stack", props: { gap: 8, p: 4, bordered: true }, children: ["s8a", "s8b", "s8c"] },
        s8a: { key: "s8a", type: "Text", props: { children: "gap=8" }, parentKey: "s8" },
        s8b: { key: "s8b", type: "Button", props: { children: "A", size: "small" }, parentKey: "s8" },
        s8c: { key: "s8c", type: "Button", props: { children: "B", size: "small" }, parentKey: "s8" },
      },
    },
  },
  {
    label: "Alignment",
    tree: {
      root: "outer",
      elements: {
        outer: { key: "outer", type: "Group", props: { gap: 8 }, children: ["start", "center", "end"] },
        start: { key: "start", type: "Stack", props: { gap: 2, ay: "start", p: 4, bordered: true }, children: ["sa", "sb"] },
        sa: { key: "sa", type: "Text", props: { children: "ay=start" }, parentKey: "start" },
        sb: { key: "sb", type: "Button", props: { children: "Item", size: "small" }, parentKey: "start" },
        center: { key: "center", type: "Stack", props: { gap: 2, ay: "center", p: 4, bordered: true }, children: ["ca", "cb"] },
        ca: { key: "ca", type: "Text", props: { children: "ay=center" }, parentKey: "center" },
        cb: { key: "cb", type: "Button", props: { children: "Item", size: "small" }, parentKey: "center" },
        end: { key: "end", type: "Stack", props: { gap: 2, ay: "end", p: 4, bordered: true }, children: ["ea", "eb"] },
        ea: { key: "ea", type: "Text", props: { children: "ay=end" }, parentKey: "end" },
        eb: { key: "eb", type: "Button", props: { children: "Item", size: "small" }, parentKey: "end" },
      },
    },
  },
];

export const StackEntry: ComponentEntry<typeof StackPropsSchema> = {
  name: "Stack",
  package: "@uiid/layout",
  hasChildren: true,
  propsSchema: StackPropsSchema,
  description:
    "Vertical flex layout (column). ax controls vertical alignment, ay controls horizontal",
  category: "layout",
  defaults: {},
  previews: stackPreviews,
  usage: "Use Stack for vertical layouts. Children flow top-to-bottom. ax controls vertical alignment, ay horizontal.",
};

/**
 * Group component props schema.
 * Horizontal flex layout (row direction by default).
 */
export const GroupPropsSchema = BoxPropsSchema;

export type GroupProps = z.infer<typeof GroupPropsSchema>;

const groupPreviews: PreviewConfig[] = [
  {
    label: "Gap sizes",
    tree: {
      root: "outer",
      elements: {
        outer: { key: "outer", type: "Stack", props: { gap: 8 }, children: ["g2", "g4", "g8"] },
        g2: { key: "g2", type: "Group", props: { gap: 2, p: 4, bordered: true, ay: "center" }, children: ["g2a", "g2b", "g2c"] },
        g2a: { key: "g2a", type: "Text", props: { children: "gap=2" }, parentKey: "g2" },
        g2b: { key: "g2b", type: "Button", props: { children: "A", size: "small" }, parentKey: "g2" },
        g2c: { key: "g2c", type: "Button", props: { children: "B", size: "small" }, parentKey: "g2" },
        g4: { key: "g4", type: "Group", props: { gap: 4, p: 4, bordered: true, ay: "center" }, children: ["g4a", "g4b", "g4c"] },
        g4a: { key: "g4a", type: "Text", props: { children: "gap=4" }, parentKey: "g4" },
        g4b: { key: "g4b", type: "Button", props: { children: "A", size: "small" }, parentKey: "g4" },
        g4c: { key: "g4c", type: "Button", props: { children: "B", size: "small" }, parentKey: "g4" },
        g8: { key: "g8", type: "Group", props: { gap: 8, p: 4, bordered: true, ay: "center" }, children: ["g8a", "g8b", "g8c"] },
        g8a: { key: "g8a", type: "Text", props: { children: "gap=8" }, parentKey: "g8" },
        g8b: { key: "g8b", type: "Button", props: { children: "A", size: "small" }, parentKey: "g8" },
        g8c: { key: "g8c", type: "Button", props: { children: "B", size: "small" }, parentKey: "g8" },
      },
    },
  },
  {
    label: "Alignment",
    tree: {
      root: "outer",
      elements: {
        outer: { key: "outer", type: "Stack", props: { gap: 8 }, children: ["start", "center", "end", "between"] },
        start: { key: "start", type: "Group", props: { gap: 2, ax: "start", p: 4, bordered: true, fullwidth: true }, children: ["sa", "sb", "sc"] },
        sa: { key: "sa", type: "Text", props: { children: "ax=start" }, parentKey: "start" },
        sb: { key: "sb", type: "Button", props: { children: "A", size: "small" }, parentKey: "start" },
        sc: { key: "sc", type: "Button", props: { children: "B", size: "small" }, parentKey: "start" },
        center: { key: "center", type: "Group", props: { gap: 2, ax: "center", p: 4, bordered: true, fullwidth: true }, children: ["ca", "cb", "cc"] },
        ca: { key: "ca", type: "Text", props: { children: "ax=center" }, parentKey: "center" },
        cb: { key: "cb", type: "Button", props: { children: "A", size: "small" }, parentKey: "center" },
        cc: { key: "cc", type: "Button", props: { children: "B", size: "small" }, parentKey: "center" },
        end: { key: "end", type: "Group", props: { gap: 2, ax: "end", p: 4, bordered: true, fullwidth: true }, children: ["ea", "eb", "ec"] },
        ea: { key: "ea", type: "Text", props: { children: "ax=end" }, parentKey: "end" },
        eb: { key: "eb", type: "Button", props: { children: "A", size: "small" }, parentKey: "end" },
        ec: { key: "ec", type: "Button", props: { children: "B", size: "small" }, parentKey: "end" },
        between: { key: "between", type: "Group", props: { gap: 2, ax: "between", p: 4, bordered: true, fullwidth: true }, children: ["ba", "bb", "bc"] },
        ba: { key: "ba", type: "Text", props: { children: "ax=between" }, parentKey: "between" },
        bb: { key: "bb", type: "Button", props: { children: "A", size: "small" }, parentKey: "between" },
        bc: { key: "bc", type: "Button", props: { children: "B", size: "small" }, parentKey: "between" },
      },
    },
  },
];

export const GroupEntry: ComponentEntry<typeof GroupPropsSchema> = {
  name: "Group",
  package: "@uiid/layout",
  hasChildren: true,
  propsSchema: GroupPropsSchema,
  description:
    "Horizontal flex layout (row). ax controls horizontal alignment, ay controls vertical",
  category: "layout",
  defaults: {},
  previews: groupPreviews,
  usage: "Use Group for horizontal layouts. Children flow left-to-right. ax controls horizontal alignment, ay vertical.",
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

