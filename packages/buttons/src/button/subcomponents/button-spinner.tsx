import { LoadingSpinner } from "@uiid/icons";

import type { ButtonSpinnerProps } from "../button.types";
import styles from "../button.module.css";

export const ButtonSpinner = ({ loading, ...props }: ButtonSpinnerProps) => {
  return (
    <LoadingSpinner
      data-slot="button-spinner"
      className={styles["button-spinner"]}
      data-loading={loading}
      aria-hidden={loading}
      {...props}
    />
  );
};
ButtonSpinner.displayName = "ButtonSpinner";
