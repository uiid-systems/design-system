import { ChevronsUpDown, ChevronsDownUp } from "lucide-react";
import { Box } from "../../../layout";

import "./select-chevron.css";

export type SelectChevronProps = {
  open?: boolean;
};

export const SelectChevron = ({ open }: SelectChevronProps) => {
  return (
    <Box data-slot="select-chevron" pr={2}>
      {open ? <ChevronsDownUp size={12} /> : <ChevronsUpDown size={12} />}
    </Box>
  );
};
SelectChevron.displayName = "SelectChevron";
