import { ChevronsUpDown } from "@uiid/icons";
import { List } from "@uiid/layout";

import { Dropdown } from "../dropdown/dropdown";

import type { ListDropdownProps } from "./list-dropdown.types";

export const ListDropdown = ({
  items,
  placeholder,
  ...props
}: ListDropdownProps) => {
  return (
    <Dropdown
      {...props}
      placeholder={placeholder}
      PopupProps={{ style: { padding: 0 } }}
      TriggerProps={{
        icon: <ChevronsUpDown />,
        iconPosition: "after",
      }}
    >
      <List items={items} fullwidth />
    </Dropdown>
  );
};
ListDropdown.displayName = "ListDropdown";
