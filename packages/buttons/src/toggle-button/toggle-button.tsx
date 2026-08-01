"use client";

import { Toggle } from "@base-ui/react/toggle";

import { Button } from "../button/button";
import type { ButtonProps } from "../button/button.types";
import type { ToggleButtonProps } from "./toggle-button.types";

export const ToggleButton = ({
  text,
  icon,
  children,
  ...props
}: ToggleButtonProps) => {
  return (
    <Toggle
      {...props}
      render={(toggleProps, state) => {
        const activeContent = state.pressed ? text?.pressed : text?.unpressed;
        const activeIcon = state.pressed ? icon?.pressed : icon?.unpressed;

        return (
          <Button {...(toggleProps as ButtonProps)}>
            {activeIcon}
            {activeContent ?? children}
          </Button>
        );
      }}
    />
  );
};
ToggleButton.displayName = "ToggleButton";
