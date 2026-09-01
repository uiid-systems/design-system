"use client";

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
  return (
    <ComboboxRoot items={items} name={name} {...RootProps} {...props}>
      <ComboboxInputGroup size={size} {...InputGroupProps}>
        <ComboboxInput
          name={name}
          placeholder={placeholder}
          label={label}
          description={description}
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
