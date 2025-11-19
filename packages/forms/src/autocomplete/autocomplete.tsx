"use client";

import { Autocomplete as BaseAutocomplete } from "@base-ui-components/react/autocomplete";
import { useState, useRef } from "react";

import { Card } from "@uiid/cards";
import { X } from "@uiid/icons";
import { List, ListItem } from "@uiid/layout";

import { Input } from "../input/input";
import { SelectChevron } from "../select/subcomponents";

import type {
  AutocompleteProps,
  AutocompleteDefaultItem,
} from "./autocomplete.types";
import styles from "./autocomplete.module.css";

export const Autocomplete = ({
  items,
  onValueChange,
  enableClear,
  RootProps,
  InputProps,
  ...props
}: AutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const [value, setValue] = useState("");

  const handleOpenDropdown = () => {
    setOpen((open) => !open);
    inputRef.current?.focus();
  };

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    setHasValue(newValue.length > 0);
    const selectedItem = newValue
      ? items.find((item) => item.value === newValue)
      : null;
    onValueChange?.(newValue, selectedItem ?? null);
  };

  const handleClear = () => {
    setValue("");
    setHasValue(false);
    handleValueChange("");
    inputRef.current?.focus();
  };

  const showClearButton = enableClear && hasValue;

  return (
    <BaseAutocomplete.Root
      {...RootProps}
      open={open}
      onOpenChange={setOpen}
      onValueChange={handleValueChange}
      value={value}
      items={items}
    >
      <BaseAutocomplete.Input
        render={
          <Input
            ref={inputRef}
            name="autocomplete"
            {...props}
            {...InputProps}
            afterOnClick={showClearButton ? handleClear : handleOpenDropdown}
            after={
              showClearButton ? <X size={12} /> : <SelectChevron open={false} />
            }
          />
        }
      />

      <BaseAutocomplete.Portal>
        <BaseAutocomplete.Positioner
          className={styles.Positioner}
          sideOffset={1}
        >
          <BaseAutocomplete.Popup
            render={<Card size="sm" title="" />}
            className={styles["autocomplete-popup"]}
          >
            {/** @todo create a custom empty state */}
            <BaseAutocomplete.Empty>No tags found.</BaseAutocomplete.Empty>

            <BaseAutocomplete.List render={<List fullwidth p={0} m={0} />}>
              {(tag: AutocompleteDefaultItem) => (
                <BaseAutocomplete.Item
                  render={<ListItem value={tag.value} label={tag.label} />}
                  key={tag.value}
                />
              )}
            </BaseAutocomplete.List>
          </BaseAutocomplete.Popup>
        </BaseAutocomplete.Positioner>
      </BaseAutocomplete.Portal>
    </BaseAutocomplete.Root>
  );
};
Autocomplete.displayName = "Autocomplete";
