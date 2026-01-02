import { NumberField as BaseNumberField } from "@base-ui/react/number-field";

import { ConditionalRender } from "@uiid/layout";

import { Field } from "../field/field";
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
  /** data */
  label,
  description,
  error,
  /** subcomponents */
  DecrementProps,
  IncrementProps,
  InputProps,
  /** misc */
  ...props
}: NumberFieldProps) => {
  return (
    <ConditionalRender
      condition={Boolean(label || description || error)}
      render={<Field label={label} description={description} error={error} />}
    >
      <NumberFieldRoot {...props}>
        <NumberFieldDecrement {...DecrementProps} />

        <BaseNumberField.Input
          render={<Input />}
          className={styles["number-field-input"]}
          {...InputProps}
        />

        <NumberFieldIncrement {...IncrementProps} />
      </NumberFieldRoot>
    </ConditionalRender>
  );
};
NumberField.displayName = "NumberField";
