"use client";

import { LoadingSpinner } from "@uiid/icons";
import { SwitchRender } from "@uiid/layout";
import { cx, renderWithProps } from "@uiid/utils";

import type { ButtonProps } from "./button.types";
import styles from "./button.module.css";

import {
  ButtonIconSlot,
  ButtonTooltipWrapper,
  ButtonContentSlot,
  ButtonContentContainer,
} from "./subcomponents";

export const Button = ({
  variant,
  size = "md",
  shape = "rounded",
  grows = true,
  square,
  loading,
  icon,
  iconPosition,
  tooltip,
  render,
  className,
  children,
  ...props
}: ButtonProps) => {
  const ariaLabel = props["aria-label"];
  const isLink = "href" in props;
  const isDisabled = props.disabled || loading;
  const onlyIcon = icon && !iconPosition;

  if (onlyIcon && !ariaLabel) {
    throw new Error(
      "Please provide an aria-label for your button when it includes an icon with no text.",
    );
  }

  // Handle events appropriately for button vs anchor
  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    if (isLink) {
      if (loading) e.preventDefault();
      props.onClick?.(e as React.MouseEvent<HTMLAnchorElement>);
    } else {
      if (props.disabled || loading) return;
      props.onClick?.(e as React.MouseEvent<HTMLButtonElement>);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    if (isLink) {
      // For links, prevent navigation if loading
      if (loading && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
      }
      props.onKeyDown?.(e as React.KeyboardEvent<HTMLAnchorElement>);
    } else {
      // For buttons, handle disabled/loading states
      if ((props.disabled || loading) && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
      }
      props.onKeyDown?.(e as React.KeyboardEvent<HTMLButtonElement>);
    }
  };

  return renderWithProps({
    render,
    fallbackElement: isLink ? "a" : "button",
    props: {
      uiid: "button",
      ...props,
      className: cx(styles["button"], className),
      /** accessibility */
      "aria-label": loading ? "Loading" : ariaLabel,
      "aria-disabled": isDisabled ? "true" : undefined,
      /** attributes */
      "data-icon": icon && (iconPosition ? iconPosition : "standalone"),
      "data-variant": variant,
      "data-size": size,
      "data-shape": shape,
      "data-grows": grows ? "true" : undefined,
      "data-square": square ? "true" : undefined,
      /** events */
      onClick: handleClick,
      onKeyDown: handleKeyDown,
    },
    children: (
      <>
        <SwitchRender
          condition={Boolean(tooltip)}
          render={{
            true: <ButtonTooltipWrapper shift={loading} tooltip={tooltip!} />,
            false: <ButtonContentContainer shift={loading} />,
          }}
        >
          <ButtonContentSlot active={!loading}>
            {onlyIcon ? icon : children}
          </ButtonContentSlot>
          <ButtonContentSlot active={loading}>
            <LoadingSpinner />
          </ButtonContentSlot>
        </SwitchRender>
        {icon && !onlyIcon && (
          <ButtonIconSlot icon={icon} position={iconPosition} />
        )}
      </>
    ),
  });
};
Button.displayName = "Button";
