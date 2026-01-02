"use client";

import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";

import { Stack, Group, ConditionalRender } from "@uiid/layout";

import { Field } from "../field/field";
import { Radio } from "../radio/radio";

import type { RadioGroupProps } from "./radio-group.types";

export const RadioGroup = ({
  /** data */
  items,
  label,
  description,
  error,
  /** shortcuts */
  defaultValue,
  direction = "vertical",
  /** toggles */
  bordered,
  reversed,
  hideIndicator,
  /** subcomponents */
  RadioProps,
  IndicatorProps,
  ...props
}: RadioGroupProps) => {
  const isHorizontal = direction === "horizontal";

  return (
    <ConditionalRender
      condition={Boolean(label || description || error)}
      render={<Field label={label} description={description} error={error} />}
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
            hideIndicator={hideIndicator}
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
