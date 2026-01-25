import { Group } from "@uiid/layout";

import { HeaderActions } from "./header-actions";

export const Header = () => {
  return (
    <Group data-slot="header" gap={2} p={2} ay="center" ax="space-between">
      <div />
      <HeaderActions />
    </Group>
  );
};
