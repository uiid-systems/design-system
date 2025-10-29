import { LoadingSpinner } from "@uiid/icons";
import { cx, renderWithProps } from "@uiid/utils";

import type { ButtonProps } from "./button.types";
import styles from "./button.module.css";
import { ButtonIconSlot } from "./subcomponents";

export const Button = ({
  variant,
  size = "md",
  fill = "solid",
  shape = "rounded",
  grows = true,
  loading,
  loadingText,
  icon,
  iconPosition,
  render,
  className,
  children,
  ...props
}: ButtonProps) => {
  const ariaLabel = props["aria-label"];
  const isLink = "href" in props;

  if (icon && !iconPosition && !ariaLabel) {
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
    "aria-label": loading ? (loadingText ?? "Loading") : ariaLabel,
    "aria-disabled": isLink
      ? undefined
      : props.disabled || loading
        ? "true"
        : undefined,
    /** attributes */
    "data-loading": loading ? "true" : undefined,
    "data-icon": icon && (iconPosition ? iconPosition : "standalone"),
    "data-grows": grows ? "true" : undefined,
    /** events */
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  };

  const Content = () => (
    <>
      <div data-slot="button-content" aria-hidden={loading}>
        {icon && iconPosition === "before" && (
          <ButtonIconSlot icon={icon} position="before" />
        )}
        {icon && iconPosition !== "before" && iconPosition !== "after"
          ? icon
          : children}
        {icon && iconPosition === "after" && (
          <ButtonIconSlot icon={icon} position="after" />
        )}
      </div>
      <span data-slot="button-loading" aria-hidden={!loading}>
        {loadingText ?? <LoadingSpinner />}
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
