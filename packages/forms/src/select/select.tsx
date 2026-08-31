"use client";

import { useMemo } from "react";

import { Field } from "../field/field";
import { SELECT_DEFAULT_SIZE } from "./select.constants";
import type {
  SelectMultipleMode,
  SelectProps,
  SelectRootProps,
} from "./select.types";
import {
  SelectRoot,
  SelectTrigger,
  SelectPortal,
  SelectPositioner,
  SelectPopup,
  SelectList,
  SelectItem,
  SelectValue,
  SelectIcon,
} from "./subcomponents";

export function Select<
  Value = string,
  Multiple extends SelectMultipleMode = false,
>({
  size = SELECT_DEFAULT_SIZE,
  fullwidth,
  variant,
  disabled,
  required,
  name,
  label,
  description,
  placeholder,
  before,
  after,
  items,
  multiple,
  defaultValue,
  RootProps,
  TriggerProps,
  PortalProps,
  PositionerProps,
  PopupProps,
  ListProps,
  ValueProps,
  IconProps,
  FieldProps,
  children,
  ...props
}: SelectProps<Value, Multiple>) {
  // Multiple mode starts empty; single mode falls back to the first item
  // unless a placeholder should show instead.
  const resolvedDefaultValue = (defaultValue ??
    (multiple
      ? []
      : placeholder
        ? undefined
        : items?.[0]?.value)) as SelectRootProps<
    Value,
    Multiple
  >["defaultValue"];

  // Create a lookup function to resolve labels from values
  const itemToStringLabel = useMemo(() => {
    if (!items) return undefined;
    const labelMap = new Map(items.map((item) => [item.value, item.label]));
    return (value: Value) => labelMap.get(value as string) ?? String(value);
  }, [items]);

  const renderValue = (value: Value | Value[]) => {
    if (multiple) {
      const values = Array.isArray(value) ? value : [];
      return values.length > 0
        ? values.map((v) => itemToStringLabel?.(v) ?? String(v)).join(", ")
        : (placeholder ?? null);
    }

    return value != null
      ? (itemToStringLabel?.(value as Value) ?? String(value))
      : (placeholder ?? null);
  };

  return (
    <Field
      name={name}
      label={label}
      description={description}
      required={required}
      {...FieldProps}
    >
      <SelectRoot<Value, Multiple>
        name={name}
        required={required}
        multiple={multiple}
        defaultValue={resolvedDefaultValue}
        items={items}
        itemToStringLabel={itemToStringLabel}
        {...props}
        {...RootProps}
      >
        <SelectTrigger
          size={size}
          fullwidth={fullwidth}
          variant={variant}
          disabled={disabled}
          before={before}
          after={after}
          {...TriggerProps}
        >
          <SelectValue size={size} {...ValueProps}>
            {renderValue}
          </SelectValue>
          <SelectIcon {...IconProps} />
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
      </SelectRoot>
    </Field>
  );
}
Select.displayName = "Select";
