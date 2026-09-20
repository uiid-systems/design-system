"use client";

import { splitDomAttributes } from "@uiid/utils";

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
  PortalProps,
  PositionerProps,
  PopupProps,
  ListProps,
  children,
  ...props
}: AutocompleteProps) => {
  // `Root` renders no element, so a DOM attribute spread onto it lands
  // nowhere. Route those to the input instead — it is the focusable element
  // and the one carrying `role="combobox"`, so it is where a name or a
  // `data-*` hook is meant to go.
  const [domAttributes, rootProps] = splitDomAttributes(props);

  return (
    <AutocompleteRoot
      items={items}
      name={name}
      disabled={disabled}
      {...RootProps}
      {...rootProps}
    >
      <AutocompleteInput
        name={name}
        placeholder={placeholder}
        label={label}
        description={description}
        action={action}
        before={before}
        after={after}
        size={size}
        color={color}
        onFocus={onFocus}
        onBlur={onBlur}
        {...domAttributes}
        {...InputProps}
      />

      <AutocompletePortal {...PortalProps}>
        <AutocompletePositioner {...PositionerProps}>
          <AutocompletePopup color={color} {...PopupProps}>
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
