import type { FormProps } from "../types";
import type { SlotsProps } from "../../layout";

export type FormFieldProps = React.PropsWithChildren &
  Pick<FormProps, "name" | "label" | "description" | "required"> &
  Pick<SlotsProps, "fullwidth">;
