"use client";

import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui-components/react/checkbox-group";

import { Stack, Group } from "@uiid/layout";

import { Checkbox } from "../checkbox/checkbox";

import type { CheckboxGroupProps } from "./checkbox-group.types";

export const CheckboxGroup = ({
  items,
  direction = "vertical",
  bordered,
  reversed,
  defaultValue,
  CheckboxProps,
  IndicatorProps,
  ...props
}: CheckboxGroupProps) => {
  const isHorizontal = direction === "horizontal";

  return (
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
  );
};
CheckboxGroup.displayName = "CheckboxGroup";
