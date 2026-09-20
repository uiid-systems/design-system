"use client";

import { splitDomAttributes } from "@uiid/utils";
import { Children, isValidElement, useMemo } from "react";

import { Field } from "../field/field";
import { SELECT_DEFAULT_SIZE } from "./select.constants";
import type {
  SelectItemProps,
  SelectMultipleMode,
  SelectProps,
  SelectRootProps,
} from "./select.types";
import {
  SelectRoot,
  SelectTrigger,
  SelectPortal,
  SelectBackdrop,
  SelectPositioner,
  SelectPopup,
  SelectList,
  SelectItem,
  SelectValue,
  SelectIcon,
} from "./subcomponents";

/**
 * Harvests `value`/`label` pairs off composed `SelectItem` children.
 *
 * Base UI resolves the trigger's text from Root's `items` and nothing else —
 * it keeps no registry of the `label` each `Select.Item` already declares — so
 * without this a composed select falls through to the raw value and the
 * trigger reads "mono" instead of "Monospace". Recurses, because children
 * arrive wrapped in fragments as often as not, and stops at the first element
 * carrying both props so a custom row's own markup is never mistaken for one.
 */
function collectItemLabels(
  children: React.ReactNode,
  collected: Pick<SelectItemProps, "value" | "label">[] = [],
) {
  Children.forEach(children, (child) => {
    if (!isValidElement<Partial<SelectItemProps>>(child)) return;

    const { value, label, children: nested } = child.props;

    if (value !== undefined && label !== undefined) {
      collected.push({ value, label });
    } else {
      collectItemLabels(nested, collected);
    }
  });

  return collected;
}

export function Select<
  Value = string,
  Multiple extends SelectMultipleMode = false,
>({
  size = SELECT_DEFAULT_SIZE,
  fullwidth,
  variant,
  color,
  disabled,
  required,
  name,
  label,
  description,
  action,
  placeholder,
  before,
  after,
  items,
  multiple,
  defaultValue,
  backdrop = true,
  RootProps,
  TriggerProps,
  PortalProps,
  BackdropProps,
  PositionerProps,
  PopupProps,
  ListProps,
  ValueProps,
  IconProps,
  FieldProps,
  children,
  ...props
}: SelectProps<Value, Multiple>) {
  // `Root` renders no element, so a DOM attribute spread onto it lands
  // nowhere. Route those to the trigger instead — it is the focusable element
  // and the one carrying `role="combobox"`, so it is where a name or a
  // `data-*` hook is meant to go.
  const [domAttributes, rootProps] = splitDomAttributes(props);

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

  // Create a lookup function to resolve labels from values. Composed selects
  // have no `items` to read, so their labels come off the children instead —
  // the trigger shouldn't lose its text just because the list was composed by
  // hand. Deliberately not fed back into `resolvedDefaultValue` above: a
  // composed select still opens empty unless told otherwise.
  const itemLabels = useMemo(
    () => items ?? collectItemLabels(children),
    [items, children],
  );

  const itemToStringLabel = useMemo(() => {
    if (itemLabels.length === 0) return undefined;
    const labelMap = new Map(
      itemLabels.map((item) => [item.value, item.label]),
    );
    return (value: Value) => labelMap.get(value as string) ?? String(value);
  }, [itemLabels]);

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
      action={action}
      required={required}
      size={size}
      {...FieldProps}
    >
      <SelectRoot<Value, Multiple>
        name={name}
        required={required}
        multiple={multiple}
        defaultValue={resolvedDefaultValue}
        items={items}
        itemToStringLabel={itemToStringLabel}
        {...rootProps}
        {...RootProps}
      >
        <SelectTrigger
          size={size}
          fullwidth={fullwidth}
          variant={variant}
          color={color}
          disabled={disabled}
          before={before}
          after={after}
          {...domAttributes}
          {...TriggerProps}
        >
          <SelectValue size={size} {...ValueProps}>
            {renderValue}
          </SelectValue>
          <SelectIcon {...IconProps} />
        </SelectTrigger>
        <SelectPortal {...PortalProps}>
          {backdrop && <SelectBackdrop {...BackdropProps} />}
          <SelectPositioner {...PositionerProps}>
            <SelectPopup color={color} {...PopupProps}>
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
                        children: itemChildren,
                      }) => (
                        <SelectItem
                          key={value}
                          label={label}
                          value={value}
                          disabled={itemDisabled || disabled}
                          description={description}
                          icon={icon}
                        >
                          {itemChildren}
                        </SelectItem>
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
