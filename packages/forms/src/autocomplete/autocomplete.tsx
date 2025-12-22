"use client";

import { Autocomplete as BaseAutocomplete } from "@base-ui-components/react/autocomplete";
import { useState } from "react";

import { Card } from "@uiid/cards";
import { List, ListItem } from "@uiid/layout";

import { Input } from "../input/input";

import type {
  AutocompleteProps,
  AutocompleteDefaultItem,
} from "./autocomplete.types";
import styles from "./autocomplete.module.css";

export const Autocomplete = ({
  items,
  onValueChange,
  RootProps,
  InputProps,
  ...props
}: AutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    const selectedItem = newValue
      ? items.find((item) => item.value === newValue)
      : null;
    onValueChange?.(newValue, selectedItem ?? null);
  };

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
        render={<Input name="autocomplete" {...props} {...InputProps} />}
      />

      <BaseAutocomplete.Portal>
        <BaseAutocomplete.Positioner
          className={styles.Positioner}
          sideOffset={1}
        >
          <BaseAutocomplete.Popup
            render={<Card size="sm" data-is-popup />}
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
