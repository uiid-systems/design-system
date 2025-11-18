"use client";

import { Group, Stack, SwitchRender } from "@uiid/layout";

import { FormField } from "../formfield";
import { Fieldset } from "../fieldset/fieldset";

import type { RadioGroupProps } from "./radio-group.types";

export const RadioGroup = ({
  name,
  label,
  description,
  options,
  direction = "vertical",
  ...props
}: RadioGroupProps) => {
  return (
    <FormField name={name} label={label} description={description} {...props}>
      <SwitchRender
        condition={direction === "vertical"}
        render={{
          true: <Fieldset render={<Stack gap={2} />} />,
          false: <Fieldset render={<Group ay="center" gap={4} />} />,
        }}
      >
        {options.map((option) => (
          <Group key={option.value} gap={2} ay="start">
            <input
              type="radio"
              id={option.value}
              name={name}
              value={option.value}
            />
            <label htmlFor={option.value}>{option.label}</label>
          </Group>
        ))}
      </SwitchRender>
    </FormField>
  );
};
RadioGroup.displayName = "RadioGroup";
