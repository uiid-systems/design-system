import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";

import { Card } from "@uiid/cards";
import { cx } from "@uiid/utils";

import type { AutocompletePopupProps } from "../autocomplete.types";
import styles from "../autocomplete.module.css";

export const AutocompletePopup = ({
  children,
  className,
  ...props
}: AutocompletePopupProps) => {
  return (
    <BaseAutocomplete.Popup
      data-slot="autocomplete-popup"
      render={<Card p={2} gap={0} fullwidth data-is-popup />}
      className={cx(styles["autocomplete-popup"], className)}
      {...props}
    >
      {children}
    </BaseAutocomplete.Popup>
  );
};
AutocompletePopup.displayName = "AutocompletePopup";
