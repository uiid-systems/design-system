import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";

import { CheckIcon, MinusIcon } from "@uiid/icons";
import { SwitchRender } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { CheckboxIndicatorProps } from "../checkbox.types";
import styles from "../checkbox.module.css";

export const CheckboxIndicator = ({
  indeterminate,
  className,
  ...props
}: CheckboxIndicatorProps) => {
  return (
    <BaseCheckbox.Indicator
      data-slot="checkbox-indicator"
      className={cx(styles["checkbox-indicator"], className)}
      {...props}
    >
      <SwitchRender
        condition={Boolean(indeterminate)}
        className={styles["checkbox-icon"]}
        render={{
          true: <MinusIcon strokeWidth={3} />,
          false: <CheckIcon strokeWidth={3} />,
        }}
      />
    </BaseCheckbox.Indicator>
  );
};
CheckboxIndicator.displayName = "CheckboxIndicator";
