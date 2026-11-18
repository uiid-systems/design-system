"use client";

import { splitDomAttributes } from "@uiid/utils";

import { InputGroupActions } from "../shared/input-group";
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

export const Combobox = ({
  items,
  name,
  label,
  description,
  action,
  placeholder,
  before,
  after,
  size,
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
}: ComboboxProps) => {
  // `Root` renders no element, so a DOM attribute spread onto it lands
  // nowhere. Route those to the input instead — it is the focusable element
  // and the one carrying `role="combobox"`, so it is where a name or a
  // `data-*` hook is meant to go.
  const [domAttributes, rootProps] = splitDomAttributes(props);

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
    required === undefined
      ? InputProps?.FieldProps
      : { ...InputProps?.FieldProps, required };

  return (
    <ComboboxRoot
      items={items}
      name={name}
      disabled={disabled}
      required={required}
      {...RootProps}
      {...rootProps}
    >
      <ComboboxInput
        name={name}
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
        color={color}
        disabled={disabled}
        onFocus={onFocus}
        onBlur={onBlur}
        InputGroupProps={InputGroupProps}
        {...domAttributes}
        {...InputProps}
        FieldProps={fieldProps}
      />

      <ComboboxPortal {...PortalProps}>
        <ComboboxPositioner {...PositionerProps}>
          <ComboboxPopup color={color} {...PopupProps}>
            <ComboboxList {...ListProps}>
              {children ??
                ((item: string) => (
                  <ComboboxItem key={item} value={item} disabled={disabled} />
                ))}
            </ComboboxList>
            <ComboboxEmpty />
          </ComboboxPopup>
        </ComboboxPositioner>
      </ComboboxPortal>
    </ComboboxRoot>
  );
};
Combobox.displayName = "Combobox";
