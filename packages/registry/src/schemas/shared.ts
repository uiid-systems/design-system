import { z } from "zod";

/**
 * Valid spacing values matching @uiid/utils SPACING_VALUES.
 * Used for gap, padding, and margin props.
 */
export const SpacingValue = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(6),
  z.literal(8),
  z.literal(10),
  z.literal(12),
  z.literal(16),
  z.literal(20),
  z.literal(24),
  z.literal(32),
  z.literal(40),
  z.literal(48),
  z.literal(56),
  z.literal(64),
]);

export type SpacingValue = z.infer<typeof SpacingValue>;

/**
 * Spacing props available on layout components.
 * Maps to CSS gap, margin, and padding properties.
 */
export const SpacingPropsSchema = z.object({
  /** CSS gap property */
  gap: SpacingValue.optional(),
  /** CSS padding (all sides) */
  p: SpacingValue.optional(),
  /** CSS padding-inline (left/right) */
  px: SpacingValue.optional(),
  /** CSS padding-block (top/bottom) */
  py: SpacingValue.optional(),
  /** CSS padding-block-start (top) */
  pt: SpacingValue.optional(),
  /** CSS padding-block-end (bottom) */
  pb: SpacingValue.optional(),
  /** CSS padding-inline-start (left) */
  pl: SpacingValue.optional(),
  /** CSS padding-inline-end (right) */
  pr: SpacingValue.optional(),
  /** CSS margin (all sides) */
  m: SpacingValue.optional(),
  /** CSS margin-inline (left/right) */
  mx: SpacingValue.optional(),
  /** CSS margin-block (top/bottom) */
  my: SpacingValue.optional(),
  /** CSS margin-block-start (top) */
  mt: SpacingValue.optional(),
  /** CSS margin-block-end (bottom) */
  mb: SpacingValue.optional(),
  /** CSS margin-inline-start (left) */
  ml: SpacingValue.optional(),
  /** CSS margin-inline-end (right) */
  mr: SpacingValue.optional(),
});

export type SpacingProps = z.infer<typeof SpacingPropsSchema>;

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
export const Tone = z.enum(["positive", "negative", "warning", "info"]);

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
