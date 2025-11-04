import { Ban } from "@uiid/icons";

import { ICON_SIZE } from "../list.constants";

export const ListDisabledIcon = () => {
  return (
    <Ban size={ICON_SIZE} strokeWidth={4} stroke="var(--colors-error-bg)" />
  );
};
ListDisabledIcon.displayName = "ListDisabledIcon";
