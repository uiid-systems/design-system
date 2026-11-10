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
import {
  isLinkRender,
  isNamedByCaller,
  isNativeButtonRender,
  isTooltipDescription,
} from "./button.utils";
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
   * accessible name. A string tooltip names it unless the caller already has,
   * on the Button or on its `render` element. It is spread after the caller's
   * props, so a wrapper forwarding `aria-label={undefined}` cannot erase it.
   */
  const tooltipName =
    typeof tooltip === "string" &&
    BUTTON_ICON_ONLY_SHAPES.includes(shape) &&
    !isNamedByCaller(props, props.render)
      ? { "aria-label": tooltip }
      : undefined;

  /**
   * The tooltip sits on a wrapper the button does not point at, so a screen
   * reader never reads it. A string tooltip therefore describes the button
   * too, which is how a disabled one says why. It is skipped when it would
   * repeat the name: the tooltip's own, the visible text, or an `aria-label`.
   */
  const tooltipDescription =
    typeof tooltip === "string" &&
    tooltip !== "" &&
    !tooltipName &&
    tooltip !== children &&
    isTooltipDescription(tooltip, props, props.render)
      ? { "aria-description": tooltip }
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
   * erase one set on it, so the link only gets `aria-label` or
   * `aria-description` when there is one.
   */
  return (
    <ConditionalRender
      condition={!!tooltip}
      render={<ButtonTooltipWrapper tooltip={tooltip} />}
    >
      {isLinkRender(props.render) ? (
        <ButtonLink
          className={buttonClassName}
          {...props}
          {...tooltipName}
          {...tooltipDescription}
        >
          {content}
        </ButtonLink>
      ) : (
        <BaseButton
          data-slot="button"
          className={buttonClassName}
          {...props}
          nativeButton={
            props.nativeButton ??
            (!props.render || isNativeButtonRender(props.render))
          }
          {...tooltipName}
          {...tooltipDescription}
        >
          {content}
        </BaseButton>
      )}
    </ConditionalRender>
  );
};
Button.displayName = "Button";
