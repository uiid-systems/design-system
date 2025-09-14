import { renderWithProps } from "../../../utils/render";

import type { ButtonProps } from "./button.types";
import "./button.styles.css";

export const Button = ({
  variant,
  size = "md",
  fill = "solid",
  shape = "rounded",
  loading,
  loadingText,
  icon,
  iconPosition,
  render,
  children,
  ...props
}: ButtonProps) => {
  const ariaLabel = props["aria-label"];
  const isLink = "href" in props;

  if (icon && !iconPosition && !ariaLabel) {
    throw new Error(
      "Please provide an aria-label for an icon button with no iconPosition.",
    );
  }

  let iconSlot;
  if (icon && iconPosition === "before") {
    iconSlot = "before";
  } else if (icon && iconPosition === "after") {
    iconSlot = "after";
  } else if (icon && !iconPosition) {
    iconSlot = "standalone";
  }

  // Handle events appropriately for button vs anchor
  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    if (isLink) {
      // For links, let the browser handle navigation
      // Only prevent default if loading
      if (loading) {
        e.preventDefault();
      }
      props.onClick?.(e as React.MouseEvent<HTMLAnchorElement>);
    } else {
      // For buttons, handle disabled/loading states
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
    ref: setCustomAttributes,
    /** accessibility */
    "aria-label": loading ? (loadingText ?? "Loading") : ariaLabel,
    "aria-disabled": isLink
      ? undefined
      : props.disabled || loading
        ? "true"
        : undefined,
    /** attributes */
    "data-loading": loading ? "true" : undefined,
    "data-icon": iconSlot,
    /** events */
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  };

  const Content = () => (
    <>
      <span data-slot="button-content" aria-hidden={loading}>
        {icon && iconPosition === "before" && icon}
        {icon && iconPosition !== "before" && iconPosition !== "after"
          ? icon
          : children}
        {icon && iconPosition === "after" && icon}
      </span>
      <span data-slot="button-loading" aria-hidden={!loading}>
        {loadingText ?? <aside data-slot="button-loading-dots" />}
      </span>
    </>
  );

  return renderWithProps({
    fallbackElement: isLink ? "a" : "button",
    props: componentProps,
    render,
    children: <Content />,
  });
};

Button.displayName = "Button";
