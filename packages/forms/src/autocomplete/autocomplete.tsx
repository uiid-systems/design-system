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
      name={name}
      disabled={disabled}
      {...RootProps}
      {...props}
    >
      <AutocompleteInput
        name={name}
        placeholder={placeholder}
        label={label}
        description={description}
        before={before}
        after={after}
        size={size}
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
            <AutocompleteEmpty />
          </AutocompletePopup>
        </AutocompletePositioner>
      </AutocompletePortal>
    </AutocompleteRoot>
  );
};
Autocomplete.displayName = "Autocomplete";
