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
}: ComboboxProps) => {
  return (
    <ComboboxRoot items={items} {...RootProps} {...props}>
      <div className={styles["combobox-input-wrapper"]}>
        <ComboboxInput
          placeholder={placeholder}
          label={label}
          description={description}
          onFocus={onFocus}
          onBlur={onBlur}
          FieldProps={{ style: { width: "100%" } }}
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
