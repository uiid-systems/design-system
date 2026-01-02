"use client";

import { Form as BaseForm } from "@base-ui/react/form";

export type FormProps = BaseForm.Props;

export const Form = ({ children, ...props }: FormProps) => {
  return (
    <BaseForm data-slot="form" {...props}>
      {children}
    </BaseForm>
  );
};
Form.displayName = "Form";
