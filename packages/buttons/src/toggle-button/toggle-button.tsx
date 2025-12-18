"use client";

import { Toggle } from "@base-ui-components/react/toggle";

import { Button } from "../button/button";

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
          <Button {...toggleProps}>
            {activeIcon}
            {activeContent ?? children}
          </Button>
        );
      }}
    />
  );
};
ToggleButton.displayName = "ToggleButton";
