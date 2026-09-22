import { LoadingSpinnerIcon } from "@uiid/icons/loading-spinner";
import { cx } from "@uiid/utils";

import type { ButtonSpinnerProps } from "../button.types";

import styles from "../button.module.css";

export const ButtonSpinner = ({
  loading,
  className,
  ...props
}: ButtonSpinnerProps) => {
  return (
    <LoadingSpinnerIcon
      data-slot="button-spinner"
      data-loading={loading}
      aria-hidden={!loading}
      aria-label={loading ? "Loading" : undefined}
      {...props}
      /*
       * Merged, not spread over: `className` used to sit before `{...props}`,
       * so a caller's would replace it outright. That now costs more than the
       * transition — `.button-spinner` is what pauses the animation on an idle
       * button, so losing it leaves the spinner turning forever, invisibly.
       */
      className={cx(styles["button-spinner"], className)}
    />
  );
};
ButtonSpinner.displayName = "ButtonSpinner";
