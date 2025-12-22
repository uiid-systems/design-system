import { Select as BaseSelect } from "@base-ui-components/react/select";

import { Group } from "@uiid/layout";
import { ChevronsUpDownIcon } from "@uiid/icons";

import inputStyles from "../../input/input.module.css";

import type { SelectProps } from "../select.types";
import styles from "../select.module.css";

export type SelectTriggerProps = BaseSelect.Trigger.Props &
  Pick<SelectProps, "size">;

export const SelectTrigger = ({ size, ...props }: SelectTriggerProps) => {
  return (
    <BaseSelect.Trigger
      data-slot="select-trigger"
      render={<Group ay="center" ax="space-between" gap={4} />}
      className={inputStyles["input"]}
      data-size={size}
      {...props}
    >
      <BaseSelect.Value data-slot="select-value" />
      <BaseSelect.Icon
        data-slot="select-icon"
        render={<ChevronsUpDownIcon />}
        className={styles["select-icon"]}
      />
    </BaseSelect.Trigger>
  );
};
SelectTrigger.displayName = "SelectTrigger";
