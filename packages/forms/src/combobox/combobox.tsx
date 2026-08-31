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
          after={after}
          size={size}
          disabled={disabled}
          onFocus={onFocus}
          onBlur={onBlur}
          {...InputProps}
        />
        <InputGroupActions slot="combobox-actions">
          <ComboboxClear />
          <ComboboxTrigger />
        </InputGroupActions>
      </ComboboxInputGroup>

      <ComboboxPortal {...PortalProps}>
        <ComboboxPositioner {...PositionerProps}>
          <ComboboxPopup {...PopupProps}>
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
