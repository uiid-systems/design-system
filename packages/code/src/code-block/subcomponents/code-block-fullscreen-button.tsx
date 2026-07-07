"use client";

import { ToggleButton } from "@uiid/buttons";
import { Maximize2Icon, Minimize2Icon } from "@uiid/icons";
import { cx } from "@uiid/utils";

import type { CodeBlockFullscreenButtonProps } from "../code-block.types";
import styles from "../code-block.module.css";

export const CodeBlockFullscreenButton = ({
  pressed,
  defaultPressed,
  onPressedChange,
  className,
  ...props
}: CodeBlockFullscreenButtonProps) => {
  return (
    <ToggleButton
      data-slot="code-block-fullscreen-button"
      aria-label={pressed ? "Exit fullscreen" : "Enter fullscreen"}
      tooltip={pressed ? "Exit fullscreen" : "Fullscreen"}
      className={cx(styles["code-block-icon-button"], className)}
      size="xsmall"
      variant="inverted"
      pressed={pressed}
      defaultPressed={defaultPressed}
      onPressedChange={onPressedChange}
      icon={{
        pressed: <Minimize2Icon />,
        unpressed: <Maximize2Icon />,
      }}
      {...props}
    />
  );
};
CodeBlockFullscreenButton.displayName = "CodeBlockFullscreenButton";
