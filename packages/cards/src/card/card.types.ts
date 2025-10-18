import type { StackProps } from "@uiid/layout";

export type CardProps = StackProps & {
  size?: "sm" | "md" | "lg";
  variant?: "info" | "warning" | "error" | "success" | "inverted";
  title?: string;
  onClose?: () => void;
};
