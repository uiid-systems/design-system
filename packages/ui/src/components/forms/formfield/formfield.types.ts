import type { SlotsProps } from "@uiid/layout";

import type { FormProps } from "../types";
import type { FormFieldDescriptionProps } from "./subcomponents";

export type FormFieldProps = React.PropsWithChildren &
  Pick<FormProps, "name" | "label" | "description" | "required" | "hint"> &
  Pick<SlotsProps, "fullwidth"> &
  Pick<FormFieldDescriptionProps, "hasError">;
