"use client";

import { useMemo } from "react";
import { ConditionalRender } from "@uiid/layout";

import { Field } from "../field/field";

import { SELECT_DEFAULT_SIZE } from "./select.constants";
import type { SelectProps } from "./select.types";
import styles from "./select.module.css";

import {
  SelectRoot,
  SelectTrigger,
  SelectPortal,
  SelectPositioner,
  SelectPopup,
  SelectList,
  SelectItem,
  SelectValue,
  SelectIndicator,
} from "./subcomponents";

export function Select<Value = string>({
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
  defaultValue,
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
}: SelectProps<Value>) {
  // Only use defaultValue or first item, not placeholder
  const resolvedDefaultValue =
    defaultValue ?? (placeholder ? undefined : items?.[0]?.value);

  // Create a lookup function to resolve labels from values
  const itemToStringLabel = useMemo(() => {
    if (!items) return undefined;
    const labelMap = new Map(items.map((item) => [item.value, item.label]));
    return (value: Value) => labelMap.get(value as string) ?? String(value);
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
      <SelectRoot<Value>
        name={name}
        defaultValue={resolvedDefaultValue}
        items={items}
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
            {(value: Value) =>
              value != null ? (
                (itemToStringLabel?.(value) ?? String(value))
              ) : placeholder ? (
                <span className={styles["select-placeholder"]}>
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
      </SelectRoot>
    </ConditionalRender>
  );
}
Select.displayName = "Select";
