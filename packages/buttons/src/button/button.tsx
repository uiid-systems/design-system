"use client";

import { LoadingSpinner } from "@uiid/icons";
import { SwitchRender } from "@uiid/layout";
import { cx, renderWithProps } from "@uiid/utils";

import type { ButtonProps } from "./button.types";
import styles from "./button.module.css";

import {
  ButtonTooltipWrapper,
  ButtonContentSlot,
  ButtonContentContainer,
} from "./subcomponents";

export const Button = ({
  variant,
  size = "md",
  shape = "rounded",
  grows = true,
  align = "center",
  square,
  loading,
  tooltip,
  render,
  className,
  children,
  ContentProps,
  ...props
}: ButtonProps) => {
  return renderWithProps({
    render,
    fallbackElement: "button",
    props: {
      uiid: "button",
      ...props,
      className: cx(styles["button"], className),
      /** attributes */
      "data-variant": variant,
      "data-size": size,
      "data-shape": shape,
      "data-grows": grows,
      "data-square": square,
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
};
Button.displayName = "Button";
