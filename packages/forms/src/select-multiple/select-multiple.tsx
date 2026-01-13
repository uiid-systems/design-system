"use client";

import { useMemo } from "react";
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
import selectStyles from "../select/select.module.css";

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
  placeholder,
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
  // Create a lookup function to resolve labels from values for multi-select display
  const itemToStringLabel = useMemo(() => {
    if (!items) return undefined;
    const labelMap = new Map(items.map((item) => [item.value, item.label]));
    return (value: string) => labelMap.get(value) ?? value;
  }, [items]);

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
        items={items}
        itemToStringLabel={itemToStringLabel}
        {...props}
        {...RootProps}
      >
        <SelectTrigger
          fullwidth={fullwidth}
          ghost={ghost}
          disabled={disabled}
          {...TriggerProps}
        >
          <SelectValue size={size} {...ValueProps}>
            {(value: string[]) =>
              value && value.length > 0 ? (
                value.map((v) => itemToStringLabel?.(v) ?? v).join(", ")
              ) : placeholder ? (
                <span className={selectStyles["select-placeholder"]}>
                  {placeholder}
                </span>
              ) : null
            }
          </SelectValue>
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
