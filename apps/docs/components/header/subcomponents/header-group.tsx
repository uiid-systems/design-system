import { Group } from "@uiid/design-system";

import { HEADER_GROUP_GAP } from "../header.constants";
import type { HeaderGroupProps } from "../header.types";

/** A cluster of controls at one end of the header. */
export const HeaderGroup = ({ children, ...props }: HeaderGroupProps) => {
  return (
    <Group data-slot="header-group" gap={HEADER_GROUP_GAP} {...props}>
      {children}
    </Group>
  );
};
HeaderGroup.displayName = "HeaderGroup";
