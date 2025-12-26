import { NumberField as BaseNumberField } from "@base-ui/react/number-field";

import { Input } from "../input/input";

import {
  NumberFieldRoot,
  NumberFieldIncrement,
  NumberFieldDecrement,
} from "./subcomponents";

import type { NumberFieldProps } from "./number-field.types";
import styles from "./number-field.module.css";

/**
 * @todo apply scrub area
 * @see https://base-ui.com/react/components/number-field#scrub-area
 * */
export const NumberField = ({
  DecrementProps,
  IncrementProps,
  InputProps,
  ...props
}: NumberFieldProps) => {
  return (
    <NumberFieldRoot {...props}>
      <NumberFieldDecrement {...DecrementProps} />

      <BaseNumberField.Input
        render={<Input />}
        className={styles["number-field-input"]}
        {...InputProps}
      />

      <NumberFieldIncrement {...IncrementProps} />
    </NumberFieldRoot>
  );
};
NumberField.displayName = "NumberField";
