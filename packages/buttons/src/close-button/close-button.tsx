import { X } from "@uiid/icons";
import { cx } from "@uiid/utils";

import { Button } from "../button/button";

import type { CloseButtonProps } from "./close-button.types";
import styles from "./close-button.module.css";

export const CloseButton = ({ className, ...props }: CloseButtonProps) => {
  return (
    <Button
      {...props}
      size="sm"
      icon={<X strokeWidth={2} size={24} />}
      aria-label="Close"
      className={cx(styles["close-button"], className)}
    />
  );
};
CloseButton.displayName = "CloseButton";
