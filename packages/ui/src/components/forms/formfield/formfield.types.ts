import type { FormProps } from "../types";
import type { SlotsProps } from "../../layout";
import type { FormFieldDescriptionProps } from "./subcomponents";

export type FormFieldProps = React.PropsWithChildren &
  Pick<FormProps, "name" | "label" | "description" | "required" | "hint"> &
  Pick<SlotsProps, "fullwidth"> &
  Pick<FormFieldDescriptionProps, "hasError">;
