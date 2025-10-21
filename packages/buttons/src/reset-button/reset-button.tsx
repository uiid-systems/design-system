import { RefreshCcw } from "@uiid/icons";
import { cx } from "@uiid/utils";

import { Button } from "../button/button";

import type { ResetButtonProps } from "./reset-button.types";
import styles from "./reset-button.module.css";

export const ResetButton = ({ children, ...props }: ResetButtonProps) => {
  return (
    <Button
      size="icon"
      shape="pill"
      fill="outline"
      icon={<RefreshCcw strokeWidth={3} />}
      aria-label="Reset"
      className={cx(styles["reset-button"], props.className)}
      {...props}
    >
      {children}
    </Button>
  );
};
ResetButton.displayName = "ResetButton";
