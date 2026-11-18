import { Button } from "@uiid/buttons";
import { EllipsisVerticalIcon } from "@uiid/icons/ellipsis-vertical";
import { Menu } from "@uiid/navigation";

import type { TableCellDropdownProps } from "../table.types";

type ItemsFunctionProps<T> = Extract<
  TableCellDropdownProps<T>,
  { items: (item: T) => unknown }
>;

const hasItemsFunction = <T,>(
  props: TableCellDropdownProps<T>,
): props is ItemsFunctionProps<T> => typeof props.items === "function";

export function TableCellDropdown<T = Record<string, unknown>>(
  props: TableCellDropdownProps<T>,
): React.ReactElement {
  const { icon: Icon, tooltip = "More options", size = "small" } = props;

  return (
    <Menu
      align="end"
      trigger={
        <Button tooltip={tooltip} size={size} variant="ghost" shape="square">
          {Icon ? <Icon /> : <EllipsisVerticalIcon size={14} />}
        </Button>
      }
      items={hasItemsFunction(props) ? props.items(props.item) : props.items}
    />
  );
}
TableCellDropdown.displayName = "TableCellDropdown";
