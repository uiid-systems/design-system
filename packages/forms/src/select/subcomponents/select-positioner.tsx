import { Select as BaseSelect } from "@base-ui/react/select";

import { cx } from "@uiid/utils";

import type { SelectPositionerProps } from "../select.types";
import styles from "../select.module.css";

export const SelectPositioner = ({
  children,
  className,
  ...props
}: SelectPositionerProps) => {
  return (
    <BaseSelect.Positioner
      data-slot="select-positioner"
      className={cx(styles["select-positioner"], className)}
      sideOffset={4}
      {...props}
    >
      <BaseSelect.ScrollUpArrow data-slot="select-scroll-up-arrow" />
      {children}
      <BaseSelect.ScrollDownArrow data-slot="select-scroll-down-arrow" />
    </BaseSelect.Positioner>
  );
};
SelectPositioner.displayName = "SelectPositioner";
