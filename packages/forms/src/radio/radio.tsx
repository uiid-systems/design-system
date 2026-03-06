import { CheckboxField } from "../checkbox/subcomponents";

import type { RadioProps } from "./radio.types";

import { RadioRoot, RadioIndicator } from "./subcomponents";

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
    <CheckboxField
      label={label}
      description={description}
      reversed={reversed}
      bordered={bordered}
      {...FieldProps}
    >
      <RadioRoot value={value} hideIndicator={hideIndicator} {...props}>
        <RadioIndicator {...IndicatorProps} />
      </RadioRoot>
    </CheckboxField>
  );
};
Radio.displayName = "Radio";
