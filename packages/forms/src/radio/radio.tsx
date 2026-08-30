"use client";

import { cx } from "@uiid/utils";

import { checkboxVariants } from "../checkbox/checkbox.variants";
import { FieldRow } from "../field/subcomponents";
import type { RadioProps } from "./radio.types";
import { RadioIndicator, RadioRoot } from "./subcomponents";

import checkboxStyles from "../checkbox/checkbox.module.css";

export const Radio = ({
  value,
  label,
  description,
  reversed,
  bordered,
  hideIndicator,
  IndicatorProps,
  FieldProps,
  ...props
}: RadioProps) => {
  return (
    <FieldRow
      label={label}
      description={description}
      className={cx(
        checkboxStyles["checkbox-label"],
        checkboxVariants({ reversed, bordered }),
      )}
      {...FieldProps}
    >
      <RadioRoot value={value} hideIndicator={hideIndicator} {...props}>
        <RadioIndicator {...IndicatorProps} />
      </RadioRoot>
    </FieldRow>
  );
};
Radio.displayName = "Radio";
