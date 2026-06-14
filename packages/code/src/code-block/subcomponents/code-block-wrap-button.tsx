"use client";

import { ToggleButton } from "@uiid/buttons";
import { WrapTextIcon } from "@uiid/icons";
import { cx } from "@uiid/utils";

import type { CodeBlockWrapButtonProps } from "../code-block.types";
import styles from "../code-block.module.css";

export const CodeBlockWrapButton = ({
  pressed,
  defaultPressed,
  onPressedChange,
  className,
  ...props
}: CodeBlockWrapButtonProps) => {
  return (
    <ToggleButton
      data-slot="code-block-wrap-button"
      aria-label="Toggle line wrap"
      tooltip="Toggle line wrap"
      className={cx(styles["code-block-icon-button"], className)}
      size="xsmall"
      variant="inverted"
      pressed={pressed}
      defaultPressed={defaultPressed}
      onPressedChange={onPressedChange}
      icon={{
        pressed: <WrapTextIcon />,
        unpressed: <WrapTextIcon />,
      }}
      {...props}
    />
  );
};
CodeBlockWrapButton.displayName = "CodeBlockWrapButton";
