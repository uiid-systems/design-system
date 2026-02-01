import { Group } from "@uiid/layout";

import { ComponentPicker } from "./component-picker";
import { HeaderActions } from "./header-actions";

export const Header = () => {
  return (
    <Group
      data-slot="header"
      ay="center"
      ax="space-between"
      p={2}
      gap={2}
      bb={1}
    >
      <ComponentPicker />
      <HeaderActions />
    </Group>
  );
};
