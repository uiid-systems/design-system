import { X } from "@uiid/icons";
import { cx } from "@uiid/utils";

import { Button } from "../button/button";

import type { CloseButtonProps } from "./close-button.types";
import styles from "./close-button.module.css";

export const CloseButton = ({ children, ...props }: CloseButtonProps) => {
  return (
    <Button
      size="icon"
      shape="pill"
      fill="outline"
      icon={<X strokeWidth={3} />}
      iconPosition={children ? "before" : undefined}
      aria-label="Close"
      className={cx(styles["close-button"], props.className)}
      {...props}
    >
      {children}
    </Button>
  );
};
CloseButton.displayName = "CloseButton";
