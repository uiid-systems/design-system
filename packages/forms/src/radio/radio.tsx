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
  ContainerProps,
  ...props
}: RadioProps) => {
  return (
    <CheckboxField
      label={label}
      description={description}
      reversed={reversed}
      bordered={bordered}
      {...ContainerProps}
    >
      <RadioRoot value={value} hideIndicator={hideIndicator} {...props}>
        <RadioIndicator {...IndicatorProps} />
      </RadioRoot>
    </CheckboxField>
  );
};
Radio.displayName = "Radio";
