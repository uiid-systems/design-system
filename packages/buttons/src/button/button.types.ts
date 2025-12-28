import type { Button as BaseButton } from "@base-ui/react/button";

import type { VariantProps } from "@uiid/utils";

import type { buttonVariants } from "./button.variants";

// export type ButtonProps = React.ComponentProps<"button"> & {
//   variant?: "inverted" | "subtle" | "ghost";
//   size?: "sm" | "md" | "lg";
//   shape?: "rounded" | "pill";
//   tooltip?: React.ReactNode;
//   delay?: number;
//   grows?: boolean;
//   /** @todo replace with toggle prop */
//   square?: boolean;
//   loading?: boolean;
//   // icon?: ButtonIconSlotProps["icon"];
//   // iconPosition?: ButtonIconSlotProps["position"];
//   render?: RenderProp;
//   children?: React.ReactNode;
//   align?: GroupProps["ax"];
// };

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export type ButtonProps = BaseButton.Props &
  ButtonVariants & {
    tooltip?: React.ReactNode;
  };
