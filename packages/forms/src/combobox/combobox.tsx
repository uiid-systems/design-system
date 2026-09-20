"use client";

import { splitDomAttributes } from "@uiid/utils";

import { InputGroupActions } from "../shared/input-group";
import type { ComboboxProps } from "./combobox.types";
import {
  ComboboxRoot,
  ComboboxInput,
  ComboboxInputGroup,
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

  return (
    <ComboboxRoot items={items} name={name} {...RootProps} {...rootProps}>
      <ComboboxInputGroup size={size} {...InputGroupProps}>
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
          {...domAttributes}
          {...InputProps}
        />
      </ComboboxInputGroup>

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
