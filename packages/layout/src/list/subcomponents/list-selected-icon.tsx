import { Check } from "@uiid/icons";

import { ICON_SIZE } from "../list.constants";

export const ListSelectedIcon = () => {
  return (
    <Check
      size={ICON_SIZE}
      strokeWidth={4}
      stroke="var(--colors-success-bg)"
      style={{ marginInlineStart: "auto" }}
    />
  );
};
ListSelectedIcon.displayName = "ListSelectedIcon";
