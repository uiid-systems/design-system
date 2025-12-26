import { NumberField as BaseNumberField } from "@base-ui/react/number-field";

import { Group } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { NumberFieldRootProps } from "../number-field.types";
import styles from "../number-field.module.css";

export const NumberFieldRoot = ({
  className,
  ...props
}: NumberFieldRootProps) => {
  return (
    <BaseNumberField.Root
      defaultValue={100}
      render={<Group />}
      className={cx(styles["number-field"], className)}
      {...props}
    />
  );
};
NumberFieldRoot.displayName = "NumberFieldRoot";
