import { ChevronsUpDown, ChevronsDownUp } from "@uiid/icons";

import "./select-chevron.css";

export type SelectChevronProps = {
  open?: boolean;
};

export const SelectChevron = ({ open }: SelectChevronProps) => {
  return (
    <aside data-slot="select-chevron" aria-hidden="true">
      {open ? <ChevronsDownUp size={14} /> : <ChevronsUpDown size={12} />}
    </aside>
  );
};
SelectChevron.displayName = "SelectChevron";
