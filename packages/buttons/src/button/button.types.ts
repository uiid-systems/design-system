import type { Button as BaseButton } from "@base-ui/react/button";

import type { VariantProps } from "@uiid/utils";

import type { buttonVariants } from "./button.variants";

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export type ButtonProps = React.ComponentProps<"button"> &
  Omit<BaseButton.Props, "onClick"> &
  ButtonVariants & {
    tooltip?: React.ReactNode;
    // onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  };
