"use client";

import { cx, definedProps } from "@uiid/utils";

import { FieldRow } from "../field/subcomponents";
import type { RadioProps } from "./radio.types";
import { radioVariants } from "./radio.variants";
import { RadioIndicator, RadioRoot } from "./subcomponents";

import checkboxStyles from "../checkbox/checkbox.module.css";

export const Radio = ({
  value,
  label,
  description,
  size,
  color,
  reversed,
  bordered,
  hideIndicator,
  IndicatorProps,
  FieldProps,
  ...props
}: RadioProps) => {
  return (
    <FieldRow
      {...FieldProps}
      {...definedProps({ label, description, size })}
      frameClassName={cx(
        checkboxStyles["checkbox-label"],
        radioVariants({ reversed, bordered }),
      )}
    >
      <RadioRoot
        value={value}
        size={size}
        color={color}
        hideIndicator={hideIndicator}
        {...props}
      >
        <RadioIndicator {...IndicatorProps} />
      </RadioRoot>
    </FieldRow>
  );
};
Radio.displayName = "Radio";
