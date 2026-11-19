"use client";

import { definedProps, splitDomAttributes } from "@uiid/utils";

import type { SelectMultipleMode } from "../select/select.types";
import { InputGroupActions, mergeInputGroupProps } from "../shared/input-group";
import { resolveItemKey, resolveItemLabel } from "../shared/item-utils";
import type { ComboboxProps } from "./combobox.types";
import {
  ComboboxRoot,
  ComboboxInput,
  ComboboxClear,
  ComboboxTrigger,
  ComboboxPortal,
  ComboboxPositioner,
  ComboboxPopup,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "./subcomponents";

export function Combobox<
  Value = string,
  Multiple extends SelectMultipleMode = false,
>({
  items,
  name,
  label,
  description,
  action,
  placeholder,
  before,
  after,
  size,
  variant,
  fullwidth,
  color,
  disabled,
  required,
  onFocus,
  onBlur,
  RootProps,
  InputProps,
  InputGroupProps,
  PortalProps,
  PositionerProps,
  PopupProps,
  ListProps,
  children,
  ...props
}: ComboboxProps<Value, Multiple>) {
  // `Root` renders no element, so a DOM attribute spread onto it lands
  // nowhere. Route those to the input instead — it is the focusable element
  // and the one carrying `role="combobox"`, so it is where a name or a
  // `data-*` hook is meant to go.
  const [domAttributes, rootProps] = splitDomAttributes(props);

  // Base UI's item renders no text of its own, so the default row resolves
  // its label the way Root resolves the input's text: `itemToStringLabel`,
  // then an object's `label`, then a primitive value. Top-level props spread
  // last onto Root, so their functions are the ones Root uses too.
  const itemToStringLabel =
    rootProps.itemToStringLabel ?? RootProps?.itemToStringLabel;
  const itemToStringValue =
    rootProps.itemToStringValue ?? RootProps?.itemToStringValue;

  // Top-level props win over the same key in RootProps. The input and its
  // Field read the resolved values, so the label marker, dimming and Form
  // error lookup match the control.
  const resolvedName = name ?? RootProps?.name;
  const resolvedDisabled = disabled ?? RootProps?.disabled;
  const resolvedRequired = required ?? RootProps?.required;

  // `required` reaches the Field, which paints the label's marker, without
  // passing through the input part's own `required`, which is also the native
  // attribute. Root already marks the hidden input that carries the value; the
  // text input holds only the filter query, so it stays `aria-required` alone.
  //
  // This deliberately bypasses a type restriction. `InputProps["FieldProps"]`
  // omits `required` (see `input.types.ts`) because the input part owns it and
  // hands it to Field itself, which is the route that would also add the
  // native attribute. Building the object in a variable is what lets it
  // through: TypeScript only runs the excess-property check on an object
  // literal passed directly, so inlining this into the `FieldProps` attribute
  // below fails `tsc`.
  const fieldProps =
    resolvedRequired === undefined
      ? InputProps?.FieldProps
      : { ...InputProps?.FieldProps, required: resolvedRequired };

  return (
    <ComboboxRoot<Value, Multiple>
      {...RootProps}
      {...definedProps({ items, name, disabled, required })}
      {...rootProps}
    >
      <ComboboxInput
        name={resolvedName}
        placeholder={placeholder}
        label={label}
        description={description}
        action={action}
        before={before}
        after={
          /*
           * Clear and Trigger ride the input's trailing slot rather than
           * overlaying it, so they take their inset and their icon sizing
           * from the size tier the way any other slotted content does.
           * Anything the caller passed as `after` leads the row.
           */
          <InputGroupActions slot="combobox-actions">
            {after}
            <ComboboxClear />
            <ComboboxTrigger />
          </InputGroupActions>
        }
        size={size}
        variant={variant}
        fullwidth={fullwidth}
        color={color}
        disabled={resolvedDisabled}
        onFocus={onFocus}
        onBlur={onBlur}
        {...domAttributes}
        {...InputProps}
        InputGroupProps={mergeInputGroupProps(
          InputGroupProps,
          InputProps?.InputGroupProps,
        )}
        FieldProps={fieldProps}
      />

      <ComboboxPortal {...PortalProps}>
        <ComboboxPositioner {...PositionerProps}>
          <ComboboxPopup color={color} {...PopupProps}>
            <ComboboxList {...ListProps}>
              {children ??
                ((item: Value, index: number) => (
                  <ComboboxItem<Value>
                    key={resolveItemKey(item, index, {
                      itemToStringValue,
                      itemToStringLabel,
                    })}
                    value={item}
                    label={resolveItemLabel(item, itemToStringLabel)}
                    disabled={disabled}
                  />
                ))}
            </ComboboxList>
            <ComboboxEmpty />
          </ComboboxPopup>
        </ComboboxPositioner>
      </ComboboxPortal>
    </ComboboxRoot>
  );
}
Combobox.displayName = "Combobox";
