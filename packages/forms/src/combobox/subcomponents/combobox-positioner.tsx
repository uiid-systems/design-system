import { Combobox as BaseCombobox } from "@base-ui/react/combobox";

import { cx } from "@uiid/utils";

import type { ComboboxPositionerProps } from "../combobox.types";
import styles from "../combobox.module.css";

export const ComboboxPositioner = ({
  children,
  ...props
}: ComboboxPositionerProps) => {
  return (
    <BaseCombobox.Positioner
      data-slot="combobox-positioner"
      className={cx(styles["combobox-positioner"], props.className)}
      sideOffset={4}
      {...props}
    >
      {children}
    </BaseCombobox.Positioner>
  );
};
ComboboxPositioner.displayName = "ComboboxPositioner";
