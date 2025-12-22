import { Checkbox as BaseCheckbox } from "@base-ui-components/react/checkbox";

import { cx } from "@uiid/utils";

import { CHECKBOX_DEFAULT_SIZE } from "../checkbox.constants";
import type { CheckboxProps } from "../checkbox.types";
import styles from "../checkbox.module.css";

export type CheckboxRootProps = BaseCheckbox.Root.Props &
  Pick<CheckboxProps, "size">;

export const CheckboxRoot = ({
  size = CHECKBOX_DEFAULT_SIZE,
  className,
  ...props
}: CheckboxRootProps) => {
  return (
    <BaseCheckbox.Root
      data-slot="checkbox"
      className={cx(styles["checkbox"], className)}
      data-size={size}
      {...props}
    />
  );
};
CheckboxRoot.displayName = "CheckboxRoot";
