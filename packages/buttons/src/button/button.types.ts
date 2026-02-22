import type { Button as BaseButton } from "@base-ui/react/button";

import type { GroupProps } from "@uiid/layout";
import type { LoadingSpinnerProps } from "@uiid/icons";
import type { VariantProps } from "@uiid/utils";

import type { buttonVariants } from "./button.variants";

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export type ButtonContentContainerProps = GroupProps & {
  loading?: boolean;
};

export type ButtonSpinnerProps = LoadingSpinnerProps & {
  loading?: boolean;
};

export type ButtonProps = React.ComponentProps<"button"> &
  Omit<BaseButton.Props, "onClick"> &
  ButtonVariants & {
    tooltip?: React.ReactNode;
    loading?: boolean;
  };
