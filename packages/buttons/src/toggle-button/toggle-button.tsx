import { Toggle } from "@base-ui-components/react/toggle";
import { Heart } from "@uiid/icons";

import { Button } from "../button/button";

import type { ToggleButtonProps } from "./toggle-button.types";

export const ToggleButton = ({
  iconPosition,
  pressedText,
  children,
  ...props
}: ToggleButtonProps) => {
  const defaultIconPosition = children ? "before" : undefined;

  return (
    <Toggle
      {...props}
      render={(props, state) => {
        return (
          <Button
            {...props}
            aria-label="Favorite"
            icon={<Heart fill={state.pressed ? "red" : "transparent"} />}
            iconPosition={iconPosition ?? defaultIconPosition}
          >
            {state.pressed ? (pressedText ?? children) : children}
          </Button>
        );
      }}
    />
  );
};
