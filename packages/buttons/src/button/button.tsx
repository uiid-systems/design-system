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
  swallowDisabledActivation,
} from "./button.utils";
import { buttonVariants } from "./button.variants";
import {
  ButtonLink,
  ButtonSpinner,
  ButtonTooltipWrapper,
  ButtonContentContainer,
} from "./subcomponents";

import styles from "./button.module.css";

/*
 * Base UI skips the caller's handlers while disabled but lets the click
 * bubble. A click dispatched straight at the element, as assistive technology
 * does, would otherwise reach ancestor handlers that a natively disabled
 * button never signals. Capture phase, so it also runs ahead of any caller
 * `onClickCapture`, which a disabled button must not call either. It has to
 * cancel the default too: stopping propagation here keeps Base UI's own
 * handler, which is what blocks a submit, from ever running.
 */
const DISABLED_BUTTON_PROPS = {
  onClickCapture: swallowDisabledActivation,
};

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
  /*
   * Disabled buttons stay in the tab order by default: the `tooltip` is
   * usually the reason the button is disabled, and keyboard users only reach
   * it by focusing the button.
   */
  focusableWhenDisabled = true,
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
          focusableWhenDisabled={focusableWhenDisabled}
          {...props}
          {...tooltipName}
          {...tooltipDescription}
        >
          {content}
        </ButtonLink>
      ) : (
        <BaseButton
          focusableWhenDisabled={focusableWhenDisabled}
          data-slot="button"
          className={buttonClassName}
          {...props}
          nativeButton={
            props.nativeButton ??
            (!props.render || isNativeButtonRender(props.render))
          }
          {...tooltipName}
          {...tooltipDescription}
          {...(props.disabled && focusableWhenDisabled
            ? DISABLED_BUTTON_PROPS
            : {})}
        >
          {content}
        </BaseButton>
      )}
    </ConditionalRender>
  );
};
Button.displayName = "Button";
