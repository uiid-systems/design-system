import type { StackProps } from "@uiid/layout";
import type { TextProps } from "@uiid/typography";

export type CardHeaderProps = {} & Pick<CardVariantProps, "variant"> &
  CardTitleProps;

export type CardTitleProps = {
  title?: string;
} & Pick<CardVariantProps, "size"> &
  TextProps;

export type CardVariantProps = {
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "info" | "warning" | "negative" | "positive" | "inverted";
  trimmed?: boolean;
  transparent?: boolean;
};

export type CardProps = Omit<StackProps, "title"> &
  CardVariantProps &
  CardHeaderProps;
