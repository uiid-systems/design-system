import { Combobox as BaseCombobox } from "@base-ui/react/combobox";

import { List } from "@uiid/layout";

import type { ComboboxListProps } from "../combobox.types";

export const ComboboxList = ({ children, ...props }: ComboboxListProps) => {
  return (
    <BaseCombobox.List
      data-slot="combobox-list"
      render={<List fullwidth />}
      {...props}
    >
      {children}
    </BaseCombobox.List>
  );
};
ComboboxList.displayName = "ComboboxList";
