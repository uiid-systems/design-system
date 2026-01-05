import { NumberField as BaseNumberField } from "@base-ui/react/number-field";

import { ConditionalRender } from "@uiid/layout";
import { cx } from "@uiid/utils";

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
  label,
  description,
  placeholder,
  disabled,
  required,
  RootProps,
  DecrementProps,
  IncrementProps,
  FieldProps,
  InputProps,
  ...props
}: NumberFieldProps) => {
  return (
    <ConditionalRender
      condition={Boolean(label || description)}
      render={
        <Field
          {...FieldProps}
          label={label}
          description={description}
          disabled={disabled}
          required={required}
        />
      }
    >
      <NumberFieldRoot {...RootProps} {...props}>
        <NumberFieldDecrement disabled={disabled} {...DecrementProps} />

        <BaseNumberField.Input
          render={<Input FieldProps={{ style: { flex: 1 } }} />}
          className={cx(styles["number-field-input"], InputProps?.className)}
          placeholder={placeholder}
          required={required}
          {...InputProps}
        />

        <NumberFieldIncrement disabled={disabled} {...IncrementProps} />
      </NumberFieldRoot>
    </ConditionalRender>
  );
};
NumberField.displayName = "NumberField";
