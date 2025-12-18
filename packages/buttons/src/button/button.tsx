"use client";

import { LoadingSpinner } from "@uiid/icons";
import { SwitchRender } from "@uiid/layout";
import { cx, renderWithProps } from "@uiid/utils";

import {
  BUTTON_DEFAULT_SIZE,
  BUTTON_DEFAULT_SHAPE,
  BUTTON_DEFAULT_GROWS,
  BUTTON_DEFAULT_ALIGN,
  BUTTON_TOOLTIP_DELAY,
} from "./button.constants";
import type { ButtonProps } from "./button.types";
import styles from "./button.module.css";

import {
  ButtonTooltipWrapper,
  ButtonContentSlot,
  ButtonContentContainer,
} from "./subcomponents";

export const Button = ({
  size = BUTTON_DEFAULT_SIZE,
  shape = BUTTON_DEFAULT_SHAPE,
  grows = BUTTON_DEFAULT_GROWS,
  align = BUTTON_DEFAULT_ALIGN,
  delay = BUTTON_TOOLTIP_DELAY,
  variant,
  square,
  loading,
  tooltip,
  className,
  children,
  ...props
}: ButtonProps) =>
  renderWithProps({
    fallbackElement: "button",
    props: {
      uiid: "button",
      delay,
      disabled: props.disabled || loading,
      className: cx(styles["button"], className),
      /** attributes */
      "data-variant": variant,
      "data-size": size,
      "data-shape": shape,
      "data-grows": grows,
      "data-square": square,
      ...props,
    },
    children: (
      <SwitchRender
        condition={Boolean(tooltip)}
        render={{
          true: <ButtonTooltipWrapper shift={loading} tooltip={tooltip!} />,
          false: <ButtonContentContainer shift={loading} />,
        }}
      >
        <ButtonContentSlot active={!loading} ax={align}>
          {children}
        </ButtonContentSlot>
        <ButtonContentSlot active={loading} ax={align}>
          <LoadingSpinner />
        </ButtonContentSlot>
      </SwitchRender>
    ),
  });
Button.displayName = "Button";
