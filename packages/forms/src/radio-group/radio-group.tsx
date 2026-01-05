"use client";

import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";

import { ConditionalRender, Stack, Group } from "@uiid/layout";

import { Field } from "../field/field";
import { Radio } from "../radio/radio";

import type { RadioGroupProps } from "./radio-group.types";

export const RadioGroup = ({
  items,
  label,
  description,
  defaultValue,
  direction = "vertical",
  bordered,
  reversed,
  hideIndicators,
  RadioProps,
  IndicatorProps,
  ...props
}: RadioGroupProps) => {
  const isHorizontal = direction === "horizontal";

  return (
    <ConditionalRender
      condition={Boolean(label || description)}
      render={<Field label={label} description={description} />}
    >
      <BaseRadioGroup
        {...props}
        defaultValue={defaultValue ?? items[0]?.value}
        render={isHorizontal ? <Group gap={2} /> : <Stack gap={2} />}
      >
        {items.map(({ value, label }) => (
          <Radio
            key={value}
            {...RadioProps}
            hideIndicator={hideIndicators}
            bordered={bordered}
            reversed={reversed}
            value={value}
            label={label}
            IndicatorProps={IndicatorProps}
          />
        ))}
      </BaseRadioGroup>
    </ConditionalRender>
  );
};
RadioGroup.displayName = "RadioGroup";
