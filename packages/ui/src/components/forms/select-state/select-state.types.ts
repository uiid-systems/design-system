import type { SelectProps } from "../select/select.types";

export type SelectStateProps = Omit<SelectProps, "options"> & {
  type?: "postal" | "fullname";
};
