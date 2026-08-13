import type { Button as BaseButton } from "@base-ui/react/button";
import { type LoadingSpinnerIconProps } from "@uiid/icons/loading-spinner";
import type { GroupProps } from "@uiid/layout";
import type { PaletteColor } from "@uiid/tokens";
import type { VariantProps } from "@uiid/utils";

import type { buttonVariants } from "./button.variants";

export type ButtonVariants = VariantProps<typeof buttonVariants>;

/**
 * Palette hue for the colored surface treatment. One hue resolves the button's
 * background, foreground, border, and hover together.
 */
export type ButtonColor = PaletteColor;

export type ButtonContentContainerProps = GroupProps & {
  loading?: boolean;
};

export type ButtonSpinnerProps = LoadingSpinnerIconProps & {
  loading?: boolean;
};

export type ButtonProps = Omit<React.ComponentProps<"button">, "color"> &
  Omit<BaseButton.Props, "onClick" | "color"> &
  ButtonVariants & {
    /** Palette hue applied as a full bg/fg/border/hover surface treatment. */
    color?: ButtonColor;
    /** Wraps the button in a Tooltip with this content — no manual composition */
    tooltip?: React.ReactNode;
    /** Show a spinner without the button changing size */
    loading?: boolean;
  };
