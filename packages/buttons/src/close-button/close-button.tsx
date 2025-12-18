import { X } from "@uiid/icons";
import { cx } from "@uiid/utils";

import { Button } from "../button/button";

const LABEL = "Close";

import type { CloseButtonProps } from "./close-button.types";
import styles from "./close-button.module.css";

export const CloseButton = ({ className, ...props }: CloseButtonProps) => {
  return (
    <Button
      data-slot="close-button"
      aria-label={LABEL}
      tooltip={LABEL}
      variant="subtle"
      size="sm"
      square
      className={cx(styles["close-button"], className)}
      {...props}
    >
      <X strokeWidth={2} size={20} />
    </Button>
  );
};
CloseButton.displayName = "CloseButton";
