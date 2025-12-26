"use client";

import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";

import { Stack, Group } from "@uiid/layout";

import { Radio } from "../radio/radio";

import type { RadioGroupProps } from "./radio-group.types";

export const RadioGroup = ({
  items,
  direction = "vertical",
  bordered,
  reversed,
  hideIndicator,
  defaultValue,
  RadioProps,
  IndicatorProps,
  ...props
}: RadioGroupProps) => {
  const isHorizontal = direction === "horizontal";

  return (
    <BaseRadioGroup
      {...props}
      defaultValue={defaultValue ?? items[0]?.value}
      render={isHorizontal ? <Group gap={2} /> : <Stack gap={2} />}
    >
      {items.map(({ value, label }) => (
        <Radio
          key={value}
          {...RadioProps}
          hideIndicator={hideIndicator}
          bordered={bordered}
          reversed={reversed}
          value={value}
          label={label}
          IndicatorProps={IndicatorProps}
        />
      ))}
    </BaseRadioGroup>
  );
};
RadioGroup.displayName = "RadioGroup";
