"use client";

import { Radio as BaseRadio } from "@base-ui/react/radio";

import { Group } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { CHECKBOX_DEFAULT_SIZE } from "../../checkbox/checkbox.constants";
import { checkboxVariants } from "../../checkbox/checkbox.variants";

import type { RadioRootProps } from "../radio.types";
import styles from "../radio.module.css";

export const RadioRoot = ({
  value,
  size = CHECKBOX_DEFAULT_SIZE,
  className,
  hideIndicator,
  children,
  ...props
}: RadioRootProps) => {
  return (
    <BaseRadio.Root
      data-slot="radio"
      value={value}
      nativeButton
      render={<Group render={<button />} ax="center" ay="center" p={0} m={0} />}
      className={cx(styles["radio"], checkboxVariants({ size }), className, {
        "sr-only": hideIndicator,
      })}
      {...props}
    >
      {children}
    </BaseRadio.Root>
  );
};
RadioRoot.displayName = "RadioRoot";
