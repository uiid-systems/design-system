"use client";

import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";

import { ConditionalRender, Stack, Group } from "@uiid/layout";

import { Checkbox } from "../checkbox/checkbox";
import { Field } from "../field/field";

import type { CheckboxGroupProps } from "./checkbox-group.types";

export const CheckboxGroup = ({
  items,
  label: fieldLabel,
  description,
  defaultValue,
  direction = "vertical",
  hideIndicators,
  bordered,
  reversed,
  disabled,
  required,
  CheckboxProps,
  IndicatorProps,
  ...props
}: CheckboxGroupProps) => {
  const isHorizontal = direction === "horizontal";

  return (
    <ConditionalRender
      condition={Boolean(fieldLabel || description)}
      render={
        <Field
          label={fieldLabel}
          description={description}
          required={required}
          disabled={disabled}
        />
      }
    >
      <BaseCheckboxGroup
        render={isHorizontal ? <Group gap={2} /> : <Stack gap={2} />}
        defaultValue={defaultValue ? [...defaultValue] : undefined}
        {...props}
      >
        {items.map(({ value, label: checkboxLabel }) => (
          <Checkbox
            key={value}
            hideIndicator={hideIndicators}
            bordered={bordered}
            reversed={reversed}
            value={value}
            label={checkboxLabel}
            IndicatorProps={IndicatorProps}
            {...CheckboxProps}
          />
        ))}
      </BaseCheckboxGroup>
    </ConditionalRender>
  );
};
CheckboxGroup.displayName = "CheckboxGroup";
