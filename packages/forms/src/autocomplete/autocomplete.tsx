"use client";

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

export const Autocomplete = ({
  items,
  label,
  description,
  placeholder,
  disabled,
  onFocus,
  onBlur,
  RootProps,
  InputProps,
  PortalProps,
  PositionerProps,
  PopupProps,
  ListProps,
  children,
  ...props
}: AutocompleteProps) => {
  return (
    <AutocompleteRoot
      items={items}
      disabled={disabled}
      {...RootProps}
      {...props}
    >
      <AutocompleteInput
        placeholder={placeholder}
        label={label}
        description={description}
        onFocus={onFocus}
        onBlur={onBlur}
        {...InputProps}
      />

      <AutocompletePortal {...PortalProps}>
        <AutocompletePositioner {...PositionerProps}>
          <AutocompletePopup {...PopupProps}>
            <AutocompleteList {...ListProps}>
              {children ??
                ((item: string) => (
                  <AutocompleteItem
                    key={item}
                    value={item}
                    disabled={disabled}
                  />
                ))}
            </AutocompleteList>
            <AutocompleteEmpty>No results found.</AutocompleteEmpty>
          </AutocompletePopup>
        </AutocompletePositioner>
      </AutocompletePortal>
    </AutocompleteRoot>
  );
};
Autocomplete.displayName = "Autocomplete";
