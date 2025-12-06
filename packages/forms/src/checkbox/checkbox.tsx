import { Checkbox as BaseCheckbox } from "@base-ui-components/react/checkbox";

import { CheckIcon, MinusIcon } from "@uiid/icons";
import { SwitchRender } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { CheckboxProps } from "./checkbox.types";
import styles from "./checkbox.module.css";

export const Checkbox = ({
  label,
  size = "md",
  indeterminate,
  IndicatorProps,
  ...props
}: CheckboxProps) => {
  return (
    <label data-slot="checkbox-label" className={styles["label"]}>
      <BaseCheckbox.Root
        aria-label="Enable notifications"
        className={cx(styles["checkbox"], props.className)}
        data-size={size}
        {...props}
      >
        <BaseCheckbox.Indicator
          className={cx(styles["indicator"], IndicatorProps?.className)}
          {...IndicatorProps}
        >
          <SwitchRender
            condition={Boolean(indeterminate)}
            className={styles["icon"]}
            render={{
              true: <MinusIcon strokeWidth={3} />,
              false: <CheckIcon strokeWidth={3} />,
            }}
          />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {label}
    </label>
  );
};
Checkbox.displayName = "Checkbox";
