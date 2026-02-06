import { z } from "zod";

/**
 * Margin value - allows number (pixels) or "auto".
 */
export const MarginValue = z.union([z.number(), z.literal("auto")]);

export type MarginValue = z.infer<typeof MarginValue>;

/**
 * Spacing props available on layout components.
 * Maps to CSS gap, margin, and padding properties.
 */
export const SpacingPropsSchema = z.object({
  /** CSS gap property */
  gap: z.number().optional(),
  /** CSS padding (all sides) */
  p: z.number().optional(),
  /** CSS padding-inline (left/right) */
  px: z.number().optional(),
  /** CSS padding-block (top/bottom) */
  py: z.number().optional(),
  /** CSS padding-block-start (top) */
  pt: z.number().optional(),
  /** CSS padding-block-end (bottom) */
  pb: z.number().optional(),
  /** CSS padding-inline-start (left) */
  pl: z.number().optional(),
  /** CSS padding-inline-end (right) */
  pr: z.number().optional(),
  /** CSS margin (all sides) */
  m: MarginValue.optional(),
  /** CSS margin-inline (left/right) */
  mx: MarginValue.optional(),
  /** CSS margin-block (top/bottom) */
  my: MarginValue.optional(),
  /** CSS margin-block-start (top) */
  mt: MarginValue.optional(),
  /** CSS margin-block-end (bottom) */
  mb: MarginValue.optional(),
  /** CSS margin-inline-start (left) */
  ml: MarginValue.optional(),
  /** CSS margin-inline-end (right) */
  mr: MarginValue.optional(),
});

export type SpacingProps = z.infer<typeof SpacingPropsSchema>;

/**
 * Border width props available on layout components.
 * Values are in pixels.
 */
export const BorderPropsSchema = z.object({
  /** CSS border-width (all sides) */
  b: z.number().optional(),
  /** CSS border-inline-width (left/right) */
  bx: z.number().optional(),
  /** CSS border-block-width (top/bottom) */
  by: z.number().optional(),
  /** CSS border-inline-start-width (left) */
  bl: z.number().optional(),
  /** CSS border-inline-end-width (right) */
  br: z.number().optional(),
  /** CSS border-block-start-width (top) */
  bt: z.number().optional(),
  /** CSS border-block-end-width (bottom) */
  bb: z.number().optional(),
});

export type BorderProps = z.infer<typeof BorderPropsSchema>;

/**
 * Sizing props available on layout components.
 * Values are in pixels.
 */
export const SizingPropsSchema = z.object({
  /** CSS width */
  w: z.number().optional(),
  /** CSS min-width */
  minw: z.number().optional(),
  /** CSS max-width */
  maxw: z.number().optional(),
  /** CSS height */
  h: z.number().optional(),
  /** CSS min-height */
  minh: z.number().optional(),
  /** CSS max-height */
  maxh: z.number().optional(),
});

export type SizingProps = z.infer<typeof SizingPropsSchema>;

/**
 * Alignment values for justify-content (ax).
 */
export const AlignX = z.enum([
  "start",
  "center",
  "end",
  "space-between",
  "stretch",
]);

/**
 * Alignment values for align-items (ay).
 */
export const AlignY = z.enum(["start", "center", "end", "baseline", "stretch"]);

/**
 * Flex direction values.
 */
export const Direction = z.enum(["column", "row"]);

/**
 * Layout props for flex container alignment.
 */
export const LayoutPropsSchema = z.object({
  /** CSS justify-content */
  ax: AlignX.optional(),
  /** CSS align-items */
  ay: AlignY.optional(),
  /** CSS flex-direction */
  direction: Direction.optional(),
});

export type LayoutProps = z.infer<typeof LayoutPropsSchema>;

/**
 * Shade values for color variants.
 */
export const Shade = z.enum([
  "background",
  "surface",
  "accent",
  "halftone",
  "muted",
  "foreground",
]);

export type Shade = z.infer<typeof Shade>;

/**
 * Tone values for semantic colors.
 */
export const Tone = z.enum(["positive", "critical", "warning", "info"]);

export type Tone = z.infer<typeof Tone>;

/**
 * Size values for component variants.
 */
export const Size = z.enum(["xsmall", "small", "medium", "large"]);

export type Size = z.infer<typeof Size>;

/**
 * Size values for form components (no xsmall).
 */
export const FormSize = z.enum(["small", "medium", "large"]);

export type FormSize = z.infer<typeof FormSize>;
