import { Select as BaseSelect } from "@base-ui/react/select";

import { List } from "@uiid/lists";

import type { SelectListProps } from "../select.types";

export const SelectList = ({ children, ...props }: SelectListProps) => {
  return (
    <BaseSelect.List
      data-slot="select-list"
      render={<List fullwidth type="none" />}
      {...props}
    >
      {children}
    </BaseSelect.List>
  );
};
SelectList.displayName = "SelectList";
