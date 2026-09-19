"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import { ConditionalRender, Layer } from "@uiid/layout";
import { paletteClassName } from "@uiid/tokens";
import { cx } from "@uiid/utils";

import { BUTTON_DEFAULT_SIZE } from "./button.constants";
import type { ButtonProps } from "./button.types";
import { isLinkRender } from "./button.utils";
import { buttonVariants } from "./button.variants";
import {
  ButtonLink,
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

  const buttonClassName = cx(
    styles["button"],
    buttonVariants({
      shape,
      size,
      variant,
      fullwidth,
    }),
    colorClassName,
    className,
  );

  const content = (
    <Layer ay="center" ax="center">
      <ButtonContentContainer loading={loading}>
        {children}
      </ButtonContentContainer>
      <ButtonSpinner loading={loading} />
    </Layer>
  );

  /*
   * A `render` that navigates keeps link semantics instead of being treated as
   * a button — see `isLinkRender`. Everything else still goes through Base UI.
   */
  return (
    <ConditionalRender
      condition={!!tooltip}
      render={<ButtonTooltipWrapper tooltip={tooltip} />}
    >
      {isLinkRender(props.render) ? (
        <ButtonLink className={buttonClassName} {...props}>
          {content}
        </ButtonLink>
      ) : (
        <BaseButton
          nativeButton={!props.render}
          data-slot="button"
          className={buttonClassName}
          {...props}
        >
          {content}
        </BaseButton>
      )}
    </ConditionalRender>
  );
};
Button.displayName = "Button";
