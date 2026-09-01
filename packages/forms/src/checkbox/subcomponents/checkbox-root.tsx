"use client";

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Group } from "@uiid/layout";
import { paletteClassName } from "@uiid/tokens";
import { cx } from "@uiid/utils";

import { CHECKBOX_DEFAULT_SIZE } from "../checkbox.constants";
import type { CheckboxRootProps } from "../checkbox.types";
import { checkboxVariants } from "../checkbox.variants";

import styles from "../checkbox.module.css";

export const CheckboxRoot = ({
  size = CHECKBOX_DEFAULT_SIZE,
  color,
  hideIndicator,
  className,
  ...props
}: CheckboxRootProps) => {
  const colorClassName = paletteClassName(color, styles["color"]);

  return (
    <BaseCheckbox.Root
      data-slot="checkbox"
      /* A `Group` rendering the `<button>` Base UI expects, so centering the
         indicator inside the box is props rather than a flex block in the
         module. */
      render={<Group render={<button />} ax="center" ay="center" />}
      className={cx(
        styles["checkbox"],
        checkboxVariants({ size }),
        colorClassName,
        className,
        { "sr-only": hideIndicator },
      )}
      {...props}
    />
  );
};
CheckboxRoot.displayName = "CheckboxRoot";
