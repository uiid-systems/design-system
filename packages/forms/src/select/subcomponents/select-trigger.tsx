import { Select as BaseSelect } from "@base-ui/react/select";

import { Group } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { inputVariants } from "../../input/input.variants";
import inputStyles from "../../input/input.module.css";

import type { SelectTriggerProps } from "../select.types";

export const SelectTrigger = ({
  size,
  ghost,
  fullwidth,
  className,
  children,
  ...props
}: SelectTriggerProps) => {
  return (
    <BaseSelect.Trigger
      data-slot="select-trigger"
      render={
        <Group render={<button />} ay="center" ax="space-between" gap={4} />
      }
      className={cx(
        inputStyles["input"],
        inputVariants({ size, ghost, fullwidth }),
        className,
      )}
      {...props}
    >
      {children}
    </BaseSelect.Trigger>
  );
};
SelectTrigger.displayName = "SelectTrigger";
