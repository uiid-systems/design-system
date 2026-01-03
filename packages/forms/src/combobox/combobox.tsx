"use client";

import type { ComboboxProps } from "./combobox.types";
import styles from "./combobox.module.css";

import {
  ComboboxRoot,
  ComboboxInput,
  ComboboxActionButtons,
  ComboboxPortal,
  ComboboxPositioner,
  ComboboxPopup,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "./subcomponents";

export const Combobox = ({
  items,
  label,
  description,
  placeholder,
  RootProps,
  InputProps,
  PortalProps,
  PositionerProps,
  PopupProps,
  ListProps,
  children,
}: ComboboxProps) => {
  return (
    <ComboboxRoot items={items} {...RootProps}>
      <div className={styles["combobox-input-wrapper"]}>
        <ComboboxInput
          placeholder={placeholder}
          label={label}
          description={description}
          {...InputProps}
        />
        <ComboboxActionButtons />
      </div>

      <ComboboxPortal {...PortalProps}>
        <ComboboxPositioner {...PositionerProps}>
          <ComboboxPopup {...PopupProps}>
            <ComboboxList {...ListProps}>
              {children ??
                ((item: string) => <ComboboxItem key={item} value={item} />)}
            </ComboboxList>
            <ComboboxEmpty>No results found.</ComboboxEmpty>
          </ComboboxPopup>
        </ComboboxPositioner>
      </ComboboxPortal>
    </ComboboxRoot>
  );
};
Combobox.displayName = "Combobox";
