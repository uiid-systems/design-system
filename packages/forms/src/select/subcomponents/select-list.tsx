import { Select as BaseSelect } from "@base-ui/react/select";

import { List } from "@uiid/layout";

import type { SelectListProps } from "../select.types";

export const SelectList = ({ children, ...props }: SelectListProps) => {
  return (
    <BaseSelect.List
      data-slot="select-list"
      render={<List fullwidth />}
      {...props}
    >
      {children}
    </BaseSelect.List>
  );
};
SelectList.displayName = "SelectList";
