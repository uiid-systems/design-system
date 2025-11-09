import type { StackProps } from "@uiid/layout";

import type { CardHeaderProps } from "./subcomponents";

export type CardVariantProps = {
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "info" | "warning" | "error" | "success" | "inverted";
};

export type CardProps = Omit<StackProps, "title"> &
  CardVariantProps &
  CardHeaderProps;
