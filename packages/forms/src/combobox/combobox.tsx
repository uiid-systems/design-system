"use client";

import { Combobox as BaseCombobox } from "@base-ui-components/react/combobox";

import { CheckIcon } from "@uiid/icons";

import type { ComboboxProps } from "./combobox.types";
import styles from "./combobox.module.css";

import {
  ComboboxRoot,
  ComboboxInput,
  ComboboxActionButtons,
} from "./subcomponents";

export const Combobox = ({ items, placeholder }: ComboboxProps) => {
  return (
    <ComboboxRoot items={items}>
      <div className={styles["combobox-input-wrapper"]}>
        <ComboboxInput placeholder={placeholder} />
        <ComboboxActionButtons />
      </div>

      <BaseCombobox.Portal>
        <BaseCombobox.Positioner className={styles.Positioner} sideOffset={4}>
          <BaseCombobox.Popup className={styles.Popup}>
            <BaseCombobox.Empty className={styles.Empty}>
              No fruits found.
            </BaseCombobox.Empty>
            <BaseCombobox.List className={styles.List}>
              {(item: string) => (
                <BaseCombobox.Item
                  key={item}
                  value={item}
                  className={styles.Item}
                >
                  <BaseCombobox.ItemIndicator className={styles.ItemIndicator}>
                    <CheckIcon className={styles.ItemIndicatorIcon} />
                  </BaseCombobox.ItemIndicator>
                  <div className={styles.ItemText}>{item}</div>
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </ComboboxRoot>
  );
};
Combobox.displayName = "Combobox";
