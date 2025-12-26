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
  error,
  placeholder,
  RootProps,
  InputProps,
  PortalProps,
  PositionerProps,
  PopupProps,
  ListProps,
  children,
}: AutocompleteProps) => {
  return (
    <AutocompleteRoot items={items} {...RootProps}>
      <AutocompleteInput
        placeholder={placeholder}
        label={label}
        description={description}
        error={error}
        {...InputProps}
      />

      <AutocompletePortal {...PortalProps}>
        <AutocompletePositioner {...PositionerProps}>
          <AutocompletePopup {...PopupProps}>
            <AutocompleteList {...ListProps}>
              {children ??
                ((item: string) => (
                  <AutocompleteItem key={item} value={item} />
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
