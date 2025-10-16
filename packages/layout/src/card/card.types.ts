import type { StackProps } from "../stack/stack.types";

export type CardProps = StackProps & {
  size?: "sm" | "md" | "lg";
  variant?: "info" | "warning" | "error" | "success" | "inverted";
};
