import { Radio as BaseRadio } from "@base-ui-components/react/radio";

import { Group } from "@uiid/layout";
import { cx } from "@uiid/utils";
import styles from "../radio.module.css";

export type RadioIndicatorProps = BaseRadio.Indicator.Props;

export const RadioIndicator = ({
  className,
  ...props
}: RadioIndicatorProps) => {
  return (
    <BaseRadio.Indicator
      data-slot="radio-indicator"
      render={<Group ax="center" ay="center" />}
      className={cx(styles["indicator"], className)}
      {...props}
    />
  );
};
RadioIndicator.displayName = "RadioIndicator";
