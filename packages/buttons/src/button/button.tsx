"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import { ConditionalRender, Layer } from "@uiid/layout";
import { paletteClassName } from "@uiid/tokens";
import { cx } from "@uiid/utils";

import {
  BUTTON_DEFAULT_SIZE,
  BUTTON_ICON_ONLY_SHAPES,
} from "./button.constants";
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

  /**
   * Base UI tooltips are visual only, so an icon-only button would have no
   * accessible name. A string tooltip names it unless the caller already has.
   */
  const tooltipLabel =
    typeof tooltip === "string" &&
    BUTTON_ICON_ONLY_SHAPES.includes(shape) &&
    !props["aria-labelledby"]
      ? tooltip
      : undefined;

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
   * `ButtonLink` clones the caller's element, where an `undefined` label would
   * erase one set on it, so the link only gets `aria-label` when there is one.
   */
  return (
    <ConditionalRender
      condition={!!tooltip}
      render={<ButtonTooltipWrapper tooltip={tooltip} />}
    >
      {isLinkRender(props.render) ? (
        <ButtonLink
          {...(tooltipLabel && { "aria-label": tooltipLabel })}
          className={buttonClassName}
          {...props}
        >
          {content}
        </ButtonLink>
      ) : (
        <BaseButton
          aria-label={tooltipLabel}
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
