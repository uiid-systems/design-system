import { Select as BaseSelect } from "@base-ui/react/select";

import { ChevronsUpDownIcon } from "@uiid/icons";
import { cx } from "@uiid/utils";

import type { SelectIndicatorProps } from "../select.types";
import styles from "../select.module.css";

export const SelectIndicator = ({
  className,
  ...props
}: SelectIndicatorProps) => {
  return (
    <BaseSelect.Icon
      data-slot="select-icon"
      render={<ChevronsUpDownIcon />}
      className={cx(styles["select-icon"], className)}
      {...props}
    />
  );
};
SelectIndicator.displayName = "SelectIndicator";
