"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { Group } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { inputVariants } from "../../input/input.variants";
import type { SelectTriggerProps } from "../select.types";

import inputStyles from "../../input/input.module.css";
import styles from "../select.module.css";

export const SelectTrigger = ({
  size,
  variant,
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
      /*
       * A `Group` rendering a `<button>`: the row is layout, so it is described
       * with props rather than a flex block in the module. Without slots the
       * value and the chevron sit at opposite ends with a gap between them;
       * with slots the value flexes to fill instead, and the slots provide
       * their own edges, so both collapse.
       */
      render={
        <Group
          render={<button />}
          ay="center"
          ax={hasSlots ? "normal" : "space-between"}
          gap={hasSlots ? 0 : 4}
        />
      }
      className={cx(
        hasSlots && styles["select-trigger-slots"],
        inputStyles["input"],
        inputVariants({ size, variant, fullwidth }),
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
