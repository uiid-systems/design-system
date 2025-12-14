import type { GroupProps } from "@uiid/layout";

export type BadgeProps = GroupProps & {
  size?: "sm" | "md" | "lg";
  variant?: "info" | "warning" | "negative" | "positive" | "inverted";
  hideIndicator?: boolean;
};
