"use client";

import { Toggle } from "@base-ui-components/react/toggle";

import { Button } from "../button/button";

import type { ToggleButtonProps } from "./toggle-button.types";

export const ToggleButton = ({
  text,
  icon,
  iconPosition,
  size,
  square,
  children,
  ...props
}: ToggleButtonProps) => {
  return (
    <Toggle
      {...props}
      render={(toggleProps, state) => {
        const content = state.pressed
          ? (text?.pressed ?? children)
          : (text?.unpressed ?? children);
        const activeIcon =
          state.pressed && icon ? icon.pressed : icon?.unpressed;

        // Determine if we have any content (text or children)
        const hasContent = Boolean(content);

        // Icon with content (positioned icon)
        if (activeIcon && hasContent) {
          return (
            <Button
              {...toggleProps}
              icon={activeIcon}
              iconPosition={iconPosition ?? "before"}
              size={size}
              square={square}
            >
              {content}
            </Button>
          );
        }

        // Icon only (no content)
        if (activeIcon && !hasContent) {
          return (
            <Button {...toggleProps} icon={activeIcon} aria-label="Toggle" />
          );
        }

        // Content only (no icon)
        return <Button {...toggleProps}>{content}</Button>;
      }}
    />
  );
};
ToggleButton.displayName = "ToggleButton";
