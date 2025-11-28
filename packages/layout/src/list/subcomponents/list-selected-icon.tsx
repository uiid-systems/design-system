import { Check } from "@uiid/icons";

import { ICON_SIZE_SMALL } from "../list.constants";

export const ListSelectedIcon = () => {
  return (
    <Check
      size={ICON_SIZE_SMALL}
      strokeWidth={4}
      stroke="var(--colors-success-bg)"
    />
  );
};
ListSelectedIcon.displayName = "ListSelectedIcon";
