"use client";

import { Form as BaseForm } from "@base-ui/react/form";
import { cxState } from "@uiid/utils";

import styles from "./form.module.css";

export type FormProps = BaseForm.Props;

export const Form = ({ children, className, ...props }: FormProps) => {
  return (
    <BaseForm
      data-slot="form"
      className={cxState(styles["form"], className)}
      {...props}
    >
      {children}
    </BaseForm>
  );
};
Form.displayName = "Form";
