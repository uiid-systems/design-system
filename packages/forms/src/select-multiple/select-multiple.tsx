"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { ConditionalRender } from "@uiid/layout";

import { Field } from "../field/field";
import { SELECT_DEFAULT_SIZE } from "../select/select.constants";
import {
  SelectTrigger,
  SelectPortal,
  SelectPositioner,
  SelectPopup,
  SelectList,
  SelectItem,
  SelectValue,
  SelectIndicator,
} from "../select/subcomponents";

import type { SelectMultipleProps } from "./select-multiple.types";

export const SelectMultiple = ({
  size = SELECT_DEFAULT_SIZE,
  fullwidth,
  ghost,
  disabled,
  required,
  name,
  label,
  description,
  items,
  defaultValue = [],
  RootProps,
  TriggerProps,
  PortalProps,
  PositionerProps,
  PopupProps,
  ListProps,
  ValueProps,
  IndicatorProps,
  FieldProps,
  children,
  ...props
}: SelectMultipleProps) => {
  return (
    <ConditionalRender
      condition={Boolean(label || description)}
      render={
        <Field
          name={name}
          label={label}
          description={description}
          required={required}
          {...FieldProps}
        />
      }
    >
      <BaseSelect.Root
        data-slot="select-multiple-root"
        name={name}
        multiple
        defaultValue={defaultValue}
        {...props}
        {...RootProps}
      >
        <SelectTrigger
          fullwidth={fullwidth}
          ghost={ghost}
          disabled={disabled}
          {...TriggerProps}
        >
          <SelectValue size={size} {...ValueProps} />
          <SelectIndicator {...IndicatorProps} />
        </SelectTrigger>
        <SelectPortal {...PortalProps}>
          <SelectPositioner {...PositionerProps}>
            <SelectPopup {...PopupProps}>
              <SelectList {...ListProps}>
                {!items
                  ? children
                  : items.map(
                      ({
                        label,
                        value,
                        disabled: itemDisabled,
                        description,
                        icon,
                      }) => (
                        <SelectItem
                          key={value}
                          label={label}
                          value={value}
                          disabled={itemDisabled || disabled}
                          description={description}
                          icon={icon}
                        />
                      ),
                    )}
              </SelectList>
            </SelectPopup>
          </SelectPositioner>
        </SelectPortal>
      </BaseSelect.Root>
    </ConditionalRender>
  );
};
SelectMultiple.displayName = "SelectMultiple";
