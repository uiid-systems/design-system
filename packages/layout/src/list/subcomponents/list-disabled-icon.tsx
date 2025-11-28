import { Ban } from "@uiid/icons";

import { ICON_SIZE_SMALL } from "../list.constants";

export const ListDisabledIcon = () => {
  return (
    <Ban
      size={ICON_SIZE_SMALL}
      strokeWidth={4}
      stroke="var(--colors-error-bg)"
    />
  );
};
ListDisabledIcon.displayName = "ListDisabledIcon";
