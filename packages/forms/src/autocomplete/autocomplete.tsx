"use client";

import { definedProps, splitDomAttributes } from "@uiid/utils";

import { mergeInputGroupProps } from "../shared/input-group";
import { resolveItemKey, resolveItemLabel } from "../shared/item-utils";
import type { AutocompleteProps } from "./autocomplete.types";
import {
  AutocompleteRoot,
  AutocompleteInput,
  AutocompletePortal,
  AutocompletePositioner,
  AutocompletePopup,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteEmpty,
} from "./subcomponents";

export function Autocomplete<Value = string>({
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
}: AutocompleteProps<Value>) {
  // `Root` renders no element, so a DOM attribute spread onto it lands
  // nowhere. Route those to the input instead — it is the focusable element
  // and the one carrying `role="combobox"`, so it is where a name or a
  // `data-*` hook is meant to go.
  const [domAttributes, rootProps] = splitDomAttributes(props);

  // Top-level props win over the same key in RootProps. The input and its
  // Field read the resolved values, so the label marker, dimming and Form
  // error lookup match the control.
  const resolvedName = name ?? RootProps?.name;
  const resolvedDisabled = disabled ?? RootProps?.disabled;
  const resolvedRequired = required ?? RootProps?.required;

  // Autocomplete's Root has no `itemToStringLabel`: `itemToStringValue` is
  // the text Base UI fills the input with, so the default row shows the same.
  // Top-level props spread last onto Root, so theirs is the one Root uses.
  const itemToStringValue =
    rootProps.itemToStringValue ?? RootProps?.itemToStringValue;

  return (
    <AutocompleteRoot<Value>
      {...RootProps}
      {...definedProps({ items, name, disabled, required })}
      {...rootProps}
    >
      <AutocompleteInput
        name={resolvedName}
        placeholder={placeholder}
        label={label}
        description={description}
        action={action}
        before={before}
        after={after}
        size={size}
        variant={variant}
        fullwidth={fullwidth}
        color={color}
        disabled={resolvedDisabled}
        required={resolvedRequired}
        onFocus={onFocus}
        onBlur={onBlur}
        {...domAttributes}
        {...InputProps}
        InputGroupProps={mergeInputGroupProps(
          InputGroupProps,
          InputProps?.InputGroupProps,
        )}
      />

      <AutocompletePortal {...PortalProps}>
        <AutocompletePositioner {...PositionerProps}>
          <AutocompletePopup color={color} {...PopupProps}>
            <AutocompleteList {...ListProps}>
              {children ??
                ((item: Value, index: number) => (
                  <AutocompleteItem<Value>
                    key={resolveItemKey(item, index, { itemToStringValue })}
                    value={item}
                    label={resolveItemLabel(item, itemToStringValue)}
                    disabled={disabled}
                  />
                ))}
            </AutocompleteList>
            <AutocompleteEmpty />
          </AutocompletePopup>
        </AutocompletePositioner>
      </AutocompletePortal>
    </AutocompleteRoot>
  );
}
Autocomplete.displayName = "Autocomplete";
