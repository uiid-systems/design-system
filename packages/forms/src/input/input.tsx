"use client";

import { Input as BaseInput } from "@base-ui-components/react/input";

import { cx } from "@uiid/utils";

import type { InputProps } from "./input.types";
import styles from "./input.module.css";

export const Input = ({ size = "md", className, ...props }: InputProps) => {
  return (
    <BaseInput
      data-slot="input"
      className={cx(styles["input"], className)}
      data-size={size}
      {...props}
    />
  );
};
Input.displayName = "Input";
