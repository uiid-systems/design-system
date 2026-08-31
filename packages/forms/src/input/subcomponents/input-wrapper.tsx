"use client";

import { Group } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { InputWrapperProps } from "../input.types";
import { inputVariants } from "../input.variants";

import styles from "../input.module.css";

export const InputWrapper = ({
  before,
  after,
  size,
  fullwidth,
  variant,
  className,
  children,
}: InputWrapperProps) => {
  if (!before && !after) return <>{children}</>;

  return (
    <Group
      data-slot="input-wrapper"
      ay="center"
      className={cx(
        styles["input"],
        styles["input-wrapper"],
        inputVariants({ size, fullwidth, variant }),
        className,
      )}
    >
      {before && (
        <span data-slot="input-before" className={styles["input-slot"]}>
          {before}
        </span>
      )}
      {children}
      {after && (
        <span data-slot="input-after" className={styles["input-slot"]}>
          {after}
        </span>
      )}
    </Group>
  );
};
InputWrapper.displayName = "InputWrapper";
