import { Combobox as BaseCombobox } from "@base-ui/react/combobox";

import { XIcon, ChevronDownIcon } from "@uiid/icons";
import { Group } from "@uiid/layout";

import type { GroupProps } from "@uiid/layout";

import styles from "../combobox.module.css";

export const ComboboxActionButtons = ({
  ...props
}: Omit<GroupProps, "children">) => {
  return (
    <Group
      data-slot="combobox-action-buttons"
      className={styles["combobox-actions"]}
      ay="center"
      ax="center"
      gap={2}
      {...props}
    >
      <BaseCombobox.Clear
        data-slot="combobox-clear"
        className={styles["combobox-action"]}
        aria-label="Clear selection"
      >
        <XIcon size={14} />
      </BaseCombobox.Clear>
      <BaseCombobox.Trigger
        className={styles["combobox-action"]}
        aria-label="Toggle dropdown"
      >
        <ChevronDownIcon size={14} />
      </BaseCombobox.Trigger>
    </Group>
  );
};
ComboboxActionButtons.displayName = "ComboboxActionButtons";
