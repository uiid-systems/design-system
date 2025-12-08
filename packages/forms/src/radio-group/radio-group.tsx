"use client";

import { RadioGroup as BaseRadioGroup } from "@base-ui-components/react/radio-group";

import { Stack, Group } from "@uiid/layout";

import { Radio } from "../radio/radio";

import type { RadioGroupProps } from "./radio-group.types";

export const RadioGroup = ({
  options,
  axis = "y",
  bordered,
  reversed,
  hideIndicator,
  RadioProps,
  IndicatorProps,
  ...props
}: RadioGroupProps) => {
  const isHorizontal = axis === "x";

  return (
    <BaseRadioGroup
      {...props}
      render={isHorizontal ? <Group gap={2} /> : <Stack gap={2} />}
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          {...RadioProps}
          hideIndicator={hideIndicator}
          bordered={bordered}
          reversed={reversed}
          value={option.value}
          label={option.label}
          IndicatorProps={IndicatorProps}
        />
      ))}
    </BaseRadioGroup>
  );
};
RadioGroup.displayName = "RadioGroup";
