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
  fill = "solid",
  shape = "rounded",
  grows = true,
  loading,
  icon,
  iconPosition,
  tooltip = "lorem ipsum dolor sit amet",
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

  // Ref callback to set custom attributes that React might filter out
  const setCustomAttributes = (element: HTMLElement | null) => {
    if (element) {
      if (variant) element.setAttribute("variant", variant);
      if (size) element.setAttribute("size", size);
      if (fill) element.setAttribute("fill", fill);
      if (shape) element.setAttribute("shape", shape);
    }
  };

  const componentProps = {
    uiid: "button",
    ...props,
    className: cx(styles["button"], className),
    ref: setCustomAttributes,
    /** accessibility */
    "aria-label": loading ? "Loading" : ariaLabel,
    "aria-disabled": isDisabled ? "true" : undefined,
    /** attributes */
    "data-icon": icon && (iconPosition ? iconPosition : "standalone"),
    "data-grows": grows ? "true" : undefined,
    /** events */
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  };

  return renderWithProps({
    fallbackElement: isLink ? "a" : "button",
    props: componentProps,
    render,
    children: (
      <>
        <SwitchRender
          condition={Boolean(tooltip)}
          render={{
            true: <ButtonTooltipWrapper shift={loading} tooltip={tooltip} />,
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
