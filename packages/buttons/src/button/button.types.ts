import type { RenderProp } from "@uiid/utils";
import type { GroupProps } from "@uiid/layout";

export type ButtonProps = React.ComponentProps<"button"> & {
  variant?: "inverted" | "subtle" | "ghost";
  size?: "sm" | "md" | "lg";
  shape?: "rounded" | "pill";
  tooltip?: React.ReactNode;
  delay?: number;
  grows?: boolean;
  /** @todo replace with toggle prop */
  square?: boolean;
  loading?: boolean;
  // icon?: ButtonIconSlotProps["icon"];
  // iconPosition?: ButtonIconSlotProps["position"];
  render?: RenderProp;
  children?: React.ReactNode;
  align?: GroupProps["ax"];
};
