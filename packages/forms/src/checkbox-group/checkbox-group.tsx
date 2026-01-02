"use client";

import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";

import { Stack, Group, ConditionalRender } from "@uiid/layout";

import { Checkbox } from "../checkbox/checkbox";
import { Field } from "../field/field";

import type { CheckboxGroupProps } from "./checkbox-group.types";

export const CheckboxGroup = ({
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
  /** subcomponents */
  CheckboxProps,
  IndicatorProps,
  ...props
}: CheckboxGroupProps) => {
  const isHorizontal = direction === "horizontal";

  return (
    <ConditionalRender
      condition={Boolean(label || description || error)}
      render={<Field label={label} description={description} error={error} />}
    >
      <BaseCheckboxGroup
        {...props}
        defaultValue={defaultValue ? [...defaultValue] : undefined}
        render={isHorizontal ? <Group gap={2} /> : <Stack gap={2} />}
      >
        {items.map(({ value, label }) => (
          <Checkbox
            key={value}
            {...CheckboxProps}
            bordered={bordered}
            reversed={reversed}
            value={value}
            label={label}
            IndicatorProps={IndicatorProps}
          />
        ))}
      </BaseCheckboxGroup>
    </ConditionalRender>
  );
};
CheckboxGroup.displayName = "CheckboxGroup";
