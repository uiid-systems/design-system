"use client";

import { Autocomplete as BaseAutocomplete } from "@base-ui-components/react/autocomplete";
import { useState, useRef } from "react";

import { Card } from "@uiid/cards";

import { Input } from "../input/input";
import { SelectChevron } from "../select/subcomponents";

import type {
  AutocompleteProps,
  AutocompleteDefaultItem,
} from "./autocomplete.types";
import styles from "./autocomplete.module.css";

export const Autocomplete = ({
  items,
  label,
  description,
  hint,
  required,
  onChange,
  RootProps,
  InputProps,
  // ValueProps,
  // PortalProps,
  // PositionerProps,
  // PopupProps,
}: AutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
  };

  const handleOpenDropdown = () => {
    setOpen((open) => !open);
    inputRef.current?.focus();
  };

  return (
    <BaseAutocomplete.Root
      {...RootProps}
      open={open}
      onOpenChange={setOpen}
      items={items}
    >
      <BaseAutocomplete.Input
        render={
          <Input
            ref={inputRef}
            label={label}
            description={description}
            hint={hint}
            required={required}
            {...InputProps}
            after={<SelectChevron open={false} />}
            afterOnClick={handleOpenDropdown}
            onChange={handleInputChange}
          />
        }
      />

      <BaseAutocomplete.Portal>
        <BaseAutocomplete.Positioner
          className={styles.Positioner}
          sideOffset={4}
        >
          <BaseAutocomplete.Popup
            render={<Card size="sm" />}
            className={styles["autocomplete-popup"]}
          >
            <BaseAutocomplete.Empty>No tags found.</BaseAutocomplete.Empty>
            <BaseAutocomplete.List>
              {(tag: AutocompleteDefaultItem) => (
                <BaseAutocomplete.Item key={tag.value} value={tag.value}>
                  {tag.label}
                </BaseAutocomplete.Item>
              )}
            </BaseAutocomplete.List>
          </BaseAutocomplete.Popup>
        </BaseAutocomplete.Positioner>
      </BaseAutocomplete.Portal>
    </BaseAutocomplete.Root>
  );
};
Autocomplete.displayName = "Autocomplete";
