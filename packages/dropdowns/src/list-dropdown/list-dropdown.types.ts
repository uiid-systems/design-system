import type { ListProps } from "@uiid/layout";

import type { DropdownProps } from "../dropdown/dropdown.types";

export type ListDropdownProps = DropdownProps & {
  items: ListProps["items"];
  placeholder: string;
};
