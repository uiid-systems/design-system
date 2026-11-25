"use client";

import { definedProps, splitDomAttributes } from "@uiid/utils";
import { Children, isValidElement, useMemo } from "react";

import { Field } from "../field/field";
import { resolveItemKey } from "../shared/item-utils";
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
 * Base UI resolves the trigger's text from Root's `items` and
 * `itemToStringLabel`, nothing else — it keeps no registry of the `label` each
 * `Select.Item` already declares — so without this a composed select falls
 * through to the raw value and the trigger reads "mono" instead of
 * "Monospace". The pairs go to Root as its `items` so Base UI resolves them
 * the same way it resolves a caller's own. Recurses, because children arrive
 * wrapped in fragments as often as not, and stops at the first element
 * carrying both props so a custom row's own markup is never mistaken for one.
 */
function collectItemLabels(
  children: React.ReactNode,
  collected: Pick<SelectItemProps<unknown>, "value" | "label">[] = [],
) {
  Children.forEach(children, (child) => {
    if (!isValidElement<Partial<SelectItemProps<unknown>>>(child)) return;

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
  w,
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

  // Top-level props win over the same key in RootProps, so a value set only
  // in RootProps is the one to read whenever the top level leaves it unset.
  const isMultiple = multiple ?? RootProps?.multiple;
  // The Field reads the same values, so its label marker, dimming and Form
  // error lookup match the control.
  const fieldName = name ?? RootProps?.name;
  const fieldRequired = required ?? RootProps?.required;
  const fieldDisabled = disabled ?? RootProps?.disabled;

  // Multiple mode starts empty; single mode falls back to the first enabled
  // item unless a placeholder should show instead. A disabled row is one the
  // user could not pick, so it is never picked for them.
  const resolvedDefaultValue = (defaultValue ??
    RootProps?.defaultValue ??
    (isMultiple
      ? []
      : placeholder
        ? undefined
        : items?.find((item) => !item.disabled)?.value)) as SelectRootProps<
    Value,
    Multiple
  >["defaultValue"];

  // Composed selects have no `items` to hand Root, so their labels come off
  // the children instead — the trigger shouldn't lose its text just because
  // the list was composed by hand. Root does the rest: `Value` reads these
  // labels and, ahead of them, any `itemToStringLabel` the caller passed,
  // which is why the trigger's text is not formatted here. Deliberately not
  // fed back into `resolvedDefaultValue` above: a composed select still opens
  // empty unless told otherwise.
  // Rows key the way Combobox and Autocomplete rows do (see `resolveItemKey`).
  // Top-level props spread last onto Root, so their functions are the ones
  // Root uses too.
  const itemToString = {
    itemToStringValue:
      rootProps.itemToStringValue ?? RootProps?.itemToStringValue,
    itemToStringLabel:
      rootProps.itemToStringLabel ?? RootProps?.itemToStringLabel,
  };

  // `RootProps.items` stands unless the top level passes its own.
  const rootItems = RootProps?.items;
  const itemLabels = useMemo(() => {
    if (items) return items;
    if (rootItems) return undefined;
    const collected = collectItemLabels(children);
    return collected.length > 0 ? collected : undefined;
  }, [items, rootItems, children]);

  // `disabled` goes to Root and to Field, not the trigger. Root owns the
  // hidden input, the field registration and the validation props, and its
  // context is where the trigger and every item read it back from; Field
  // reads its own root to dim the label and description.
  return (
    <Field
      {...FieldProps}
      {...definedProps({
        name: fieldName,
        label,
        description,
        action,
        required: fieldRequired,
        disabled: fieldDisabled,
        size,
      })}
    >
      <SelectRoot<Value, Multiple>
        {...RootProps}
        {...definedProps({
          name,
          required,
          disabled,
          multiple,
          defaultValue: resolvedDefaultValue,
          items: itemLabels,
        })}
        {...rootProps}
      >
        {/*
         * Each slot spreads first and Select's own values after, so a
         * top-level value wins and an unset one leaves the slot's alone. The
         * DOM attributes are copied into a plain object, the shape
         * `definedProps` takes, so an `aria-label={undefined}` is dropped too.
         */}
        <SelectTrigger
          {...TriggerProps}
          {...definedProps({ ...domAttributes })}
          {...definedProps({ size, w, variant, color, before, after })}
        >
          <SelectValue
            {...ValueProps}
            {...definedProps({ size, placeholder })}
          />
          <SelectIcon {...IconProps} />
        </SelectTrigger>
        <SelectPortal {...PortalProps}>
          {backdrop && <SelectBackdrop {...BackdropProps} />}
          <SelectPositioner {...PositionerProps}>
            <SelectPopup {...PopupProps} {...definedProps({ color })}>
              <SelectList {...ListProps}>
                {!items
                  ? children
                  : items.map(({ value, ...item }, index) => (
                      <SelectItem<Value>
                        key={resolveItemKey(value, index, itemToString)}
                        value={value}
                        {...item}
                      />
                    ))}
              </SelectList>
            </SelectPopup>
          </SelectPositioner>
        </SelectPortal>
      </SelectRoot>
    </Field>
  );
}
Select.displayName = "Select";
