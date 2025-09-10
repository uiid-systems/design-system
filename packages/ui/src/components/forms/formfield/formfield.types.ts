import type { FormProps } from "../types";

export type FormFieldProps = React.PropsWithChildren &
  Pick<FormProps, "name" | "label" | "description" | "required">;
