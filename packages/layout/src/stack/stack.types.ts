import type { BoxProps } from "../box/box.types";

export type StackProps = {
  ax?: BoxProps["ay"];
  ay?: BoxProps["ax"];
} & Omit<BoxProps, "ax" | "ay">;
