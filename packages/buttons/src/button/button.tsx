"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import { ConditionalRender, Layer } from "@uiid/layout";
import { paletteClassName } from "@uiid/tokens";
import { cx } from "@uiid/utils";

import { BUTTON_DEFAULT_SIZE } from "./button.constants";
import type { ButtonProps } from "./button.types";
import { buttonVariants } from "./button.variants";
import {
  ButtonSpinner,
  ButtonTooltipWrapper,
  ButtonContentContainer,
} from "./subcomponents";

import styles from "./button.module.css";

export const Button = ({
  tooltip,
  shape,
  fullwidth,
  variant,
  color,
  loading,
  size = BUTTON_DEFAULT_SIZE,
  className,
  children,
  ...props
}: ButtonProps) => {
  const colorClassName = paletteClassName(color, styles["color"]);

  return (
    <ConditionalRender
      condition={!!tooltip}
      render={<ButtonTooltipWrapper tooltip={tooltip} />}
    >
      <BaseButton
        nativeButton={!props.render}
        data-slot="button"
        className={cx(
          styles["button"],
          buttonVariants({
            shape,
            size,
            variant,
            fullwidth,
          }),
          colorClassName,
          className,
        )}
        {...props}
      >
        <Layer ay="center" ax="center">
          <ButtonContentContainer loading={loading}>
            {children}
          </ButtonContentContainer>
          <ButtonSpinner loading={loading} />
        </Layer>
      </BaseButton>
    </ConditionalRender>
  );
};
Button.displayName = "Button";
