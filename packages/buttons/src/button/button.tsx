"use client";

import { Button as BaseButton } from "@base-ui/react/button";

import { ConditionalRender, Layer } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { ButtonProps } from "./button.types";
import styles from "./button.module.css";
import {
  ButtonSpinner,
  ButtonTooltipWrapper,
  ButtonContentContainer,
} from "./subcomponents";
import { buttonVariants } from "./button.variants";
import { BUTTON_DEFAULT_SIZE } from "./button.constants";

export const Button = ({
  tooltip,
  shape,
  fullwidth,
  variant,
  loading,
  size = BUTTON_DEFAULT_SIZE,
  className,
  children,
  ...props
}: ButtonProps) => {
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
