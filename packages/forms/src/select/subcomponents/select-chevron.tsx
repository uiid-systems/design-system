import { ChevronsUpDown, ChevronsDownUp } from "@uiid/icons";

import "./select-chevron.css";

export type SelectChevronProps = {
  open?: boolean;
};

const ICON_SIZE = 12;

export const SelectChevron = ({ open }: SelectChevronProps) => {
  return (
    <aside data-slot="select-chevron" aria-hidden="true">
      {open ? (
        <ChevronsDownUp size={ICON_SIZE} />
      ) : (
        <ChevronsUpDown size={ICON_SIZE} />
      )}
    </aside>
  );
};
SelectChevron.displayName = "SelectChevron";
