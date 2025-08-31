import type { ButtonProps } from "./button.types";
import { renderWithProps } from "../../../utils/render";
import "@uiid/tokens/buttons/button.css";
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
      (props as any).onClick?.(e);
    } else {
      // For buttons, handle disabled/loading states
      const buttonProps = props as any;
      if (buttonProps.disabled || loading) return;
      buttonProps.onClick?.(e);
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
      (props as any).onKeyDown?.(e);
    } else {
      // For buttons, handle disabled/loading states
      const buttonProps = props as any;
      if (
        (buttonProps.disabled || loading) &&
        (e.key === "Enter" || e.key === " ")
      ) {
        e.preventDefault();
      }
      buttonProps.onKeyDown?.(e);
    }
  };

  const componentProps = {
    uiid: "button",
    ...props,
    /** properties */
    "data-variant": variant,
    "data-size": size,
    "data-fill": fill,
    "data-shape": shape,
    "data-loading": loading ? "true" : undefined,
    "data-icon": iconSlot,
    /** accessibility */
    "aria-label": loading ? (loadingText ?? "Loading") : ariaLabel,
    "aria-disabled": isLink
      ? undefined
      : (props as any).disabled || loading
        ? "true"
        : undefined,
    /** events */
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  };

  const content = (
    <>
      {loading !== undefined && (
        <span data-slot="button-loading" aria-hidden={!loading}>
          {loadingText ?? <aside data-slot="button-loading-dots" />}
        </span>
      )}
      <span data-slot="button-content" aria-hidden={loading}>
        {icon && iconPosition === "before" && icon}
        {icon && iconPosition !== "before" && iconPosition !== "after"
          ? icon
          : children}
        {icon && iconPosition === "after" && icon}
      </span>
    </>
  );

  return renderWithProps({
    fallbackElement: isLink ? "a" : "button",
    props: componentProps,
    render,
    children: content,
  });
};

Button.displayName = "Button";
