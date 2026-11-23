"use client";

import { Form as BaseForm } from "@base-ui/react/form";
import { cx } from "@uiid/utils";

import type { FormProps } from "./form.types";

import styles from "./form.module.css";

export const Form = ({ children, className, ...props }: FormProps) => {
  return (
    <BaseForm
      data-slot="form"
      className={cx(styles["form"], className)}
      {...props}
    >
      {children}
    </BaseForm>
  );
};
Form.displayName = "Form";
