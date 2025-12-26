"use client";

import { Autocomplete as BaseAutocomplete } from "@base-ui-components/react/autocomplete";

import { cx } from "@uiid/utils";

import type { AutocompletePositionerProps } from "../autocomplete.types";
import styles from "../autocomplete.module.css";

export const AutocompletePositioner = ({
  className,
  sideOffset = 4,
  children,
  ...props
}: AutocompletePositionerProps) => {
  return (
    <BaseAutocomplete.Positioner
      data-slot="autocomplete-positioner"
      className={cx(styles["autocomplete-positioner"], className)}
      sideOffset={sideOffset}
      {...props}
    >
      {children}
    </BaseAutocomplete.Positioner>
  );
};
AutocompletePositioner.displayName = "AutocompletePositioner";

