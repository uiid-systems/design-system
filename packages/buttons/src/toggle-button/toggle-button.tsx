import { Toggle } from "@base-ui-components/react/toggle";

import { Button } from "../button/button";

import type { ToggleButtonProps } from "./toggle-button.types";

export const ToggleButton = ({
  icon,
  iconPosition,
  pressedIcon,
  pressedText,
  children,
  ...props
}: ToggleButtonProps) => {
  return (
    <Toggle
      {...props}
      render={(toggleProps, state) => {
        const content = state.pressed ? (pressedText ?? children) : children;
        const activeIcon = state.pressed && pressedIcon ? pressedIcon : icon;
        const finalIconPosition =
          iconPosition ?? (children ? "before" : undefined);

        // Icon with children (positioned icon)
        if (activeIcon && finalIconPosition) {
          return (
            <Button
              {...toggleProps}
              icon={activeIcon}
              iconPosition={finalIconPosition}
              aria-label="Favorite"
            >
              {content}
            </Button>
          );
        }

        // Icon only (no children)
        if (activeIcon && !finalIconPosition) {
          return (
            <Button {...toggleProps} icon={activeIcon} aria-label="Favorite">
              {content}
            </Button>
          );
        }

        // No icon
        return <Button {...toggleProps}>{content}</Button>;
      }}
    />
  );
};
ToggleButton.displayName = "ToggleButton";
