"use client";

import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";

import { Stack, Group } from "@uiid/layout";

import { Checkbox } from "../checkbox/checkbox";
import { Field } from "../field/field";

import type { CheckboxGroupProps } from "./checkbox-group.types";

export const CheckboxGroup = ({
  items,
  label,
  description,
  defaultValue,
  direction = "vertical",
  hideIndicators,
  bordered,
  reversed,
  CheckboxProps,
  IndicatorProps,
  ...props
}: CheckboxGroupProps) => {
  const isHorizontal = direction === "horizontal";

  return (
    <Field label={label} description={description}>
      <BaseCheckboxGroup
        render={isHorizontal ? <Group gap={2} /> : <Stack gap={2} />}
        defaultValue={defaultValue ? [...defaultValue] : undefined}
        {...props}
      >
        {items.map(({ value, label }) => (
          <Checkbox
            key={value}
            hideIndicator={hideIndicators}
            bordered={bordered}
            reversed={reversed}
            value={value}
            label={label}
            IndicatorProps={IndicatorProps}
            {...CheckboxProps}
          />
        ))}
      </BaseCheckboxGroup>
    </Field>
  );
};
CheckboxGroup.displayName = "CheckboxGroup";
