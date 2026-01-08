"use client";

import { Button as BaseButton } from "@base-ui/react/button";

import { ConditionalRender, Layer } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { ButtonProps } from "./button.types";
import styles from "./button.module.css";
import { ButtonSpinner, ButtonTooltipWrapper } from "./subcomponents";
import { buttonVariants } from "./button.variants";
import { ButtonContentContainer } from "./subcomponents/button-content-container";

export const Button = ({
  tooltip,
  ghost,
  pill,
  grows,
  size,
  tone,
  square,
  circle,
  variant,
  loading,
  className,
  children,
  ...props
}: ButtonProps) => {
  if (circle) {
    pill = true;
    square = true;
  }

  return (
    <ConditionalRender
      condition={!!tooltip}
      render={<ButtonTooltipWrapper tooltip={tooltip} />}
    >
      <BaseButton
        data-slot="button"
        className={cx(
          styles["button"],
          buttonVariants({ ghost, grows, pill, size, square, variant, tone }),
          className,
        )}
        data-ghost={ghost}
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
