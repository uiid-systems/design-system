import type { DropdownProps } from "../dropdown/dropdown.types";

export type DateDropdownProps = Omit<DropdownProps, "children"> & {
  format?: "short" | "medium" | "long";
};
