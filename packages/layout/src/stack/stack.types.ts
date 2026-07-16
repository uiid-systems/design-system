import type { BoxProps } from "../box/box.types";

export type StackProps = {
  /** Horizontal alignment of children (cross axis of the column) */
  ax?: BoxProps["ay"];
  /** Vertical alignment of children (main axis of the column) */
  ay?: BoxProps["ax"];
} & Omit<BoxProps, "ax" | "ay">;
