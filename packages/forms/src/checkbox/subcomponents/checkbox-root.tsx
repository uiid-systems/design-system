import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";

import { cx } from "@uiid/utils";

import { CHECKBOX_DEFAULT_SIZE } from "../checkbox.constants";
import type { CheckboxRootProps } from "../checkbox.types";
import { checkboxVariants } from "../checkbox.variants";
import styles from "../checkbox.module.css";

export const CheckboxRoot = ({
  size = CHECKBOX_DEFAULT_SIZE,
  bordered,
  reversed,
  hideIndicator,
  className,
  ...props
}: CheckboxRootProps) => {
  return (
    <BaseCheckbox.Root
      data-slot="checkbox"
      aria-label="checkbox"
      className={cx(
        styles["checkbox"],
        checkboxVariants({ size, bordered, reversed }),
        className,
        {
          "sr-only": hideIndicator,
        },
      )}
      {...props}
    />
  );
};
CheckboxRoot.displayName = "CheckboxRoot";
