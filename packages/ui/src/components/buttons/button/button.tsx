import type { ButtonProps } from "../types";

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
  disabled,
  onClick,
  onKeyDown,
  children,
  ...props
}: ButtonProps) => {
  const ariaLabel = props["aria-label"];

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

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if ((disabled || loading) && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
    }
    onKeyDown?.(e);
  };

  return (
    <button
      data-uiid="button"
      /** properties */
      data-variant={variant}
      data-size={size}
      data-fill={fill}
      data-shape={shape}
      data-loading={loading ? "true" : undefined}
      data-icon={iconSlot}
      /** accessibility */
      aria-label={loading ? (loadingText ?? "Loading") : ariaLabel}
      aria-disabled={disabled || loading ? "true" : undefined}
      /** events */
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {loading !== undefined && (
        <span data-uiid="button-loading" aria-hidden={!loading}>
          {loadingText ?? <aside data-uiid="button-loading-dots" />}
        </span>
      )}
      <span data-uiid="button-content" aria-hidden={loading}>
        {icon && iconPosition === "before" && icon}
        {icon && iconPosition !== "before" && iconPosition !== "after"
          ? icon
          : children}
        {icon && iconPosition === "after" && icon}
      </span>
    </button>
  );
};

Button.displayName = "Button";
