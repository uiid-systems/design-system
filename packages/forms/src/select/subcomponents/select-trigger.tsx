import { Select as BaseSelect } from "@base-ui/react/select";
import { cx } from "@uiid/utils";

import { inputVariants } from "../../input/input.variants";
import type { SelectTriggerProps } from "../select.types";

import inputStyles from "../../input/input.module.css";
import styles from "../select.module.css";

export const SelectTrigger = ({
  size,
  ghost,
  fullwidth,
  before,
  after,
  className,
  children,
  ...props
}: SelectTriggerProps) => {
  const hasSlots = Boolean(before || after);

  return (
    <BaseSelect.Trigger
      data-slot="select-trigger"
      render={<button />}
      className={cx(
        styles["select-trigger"],
        hasSlots && styles["select-trigger-slots"],
        inputStyles["input"],
        inputVariants({ size, ghost, fullwidth }),
        className,
      )}
      {...props}
    >
      {before && (
        <span data-slot="select-before" className={styles["select-slot"]}>
          {before}
        </span>
      )}
      {children}
      {after && (
        <span data-slot="select-after" className={styles["select-slot"]}>
          {after}
        </span>
      )}
    </BaseSelect.Trigger>
  );
};
SelectTrigger.displayName = "SelectTrigger";
